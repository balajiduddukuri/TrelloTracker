import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Trello API Config
  const TRELLO_API_KEY = process.env.TRELLO_API_KEY;
  const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
  const TRELLO_BOARDS = process.env.TRELLO_BOARDS?.split(",").filter(Boolean) || [];

  const checkConfig = () => {
    if (!TRELLO_API_KEY || !TRELLO_TOKEN) {
      return false;
    }
    return true;
  };

  // Cache object for simple MVP
  let cache: any = {
    tasks: [],
    boards: [],
    members: [],
    lists: [],
    lastSync: null,
  };

  async function fetchTrelloData() {
    if (!checkConfig()) {
      throw new Error("Trello API configuration missing");
    }

    const allTasks: any[] = [];
    const allBoards: any[] = [];
    const allMembersMap = new Map();
    const allListsMap = new Map();

    // In a real app, we'd iterate through TRELLO_BOARDS
    // For MVP, if no boards specified, we might fetch user's boards or error
    const boardsToFetch = TRELLO_BOARDS.length > 0 ? TRELLO_BOARDS : [];
    
    if (boardsToFetch.length === 0) {
      // Try to fetch all boards user has access to
      const boardsRes = await fetch(`https://api.trello.com/1/members/me/boards?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`);
      if (!boardsRes.ok) throw new Error("Failed to fetch boards");
      const userBoards: any[] = await boardsRes.json();
      boardsToFetch.push(...userBoards.map(b => b.id));
    }

    for (const boardId of boardsToFetch) {
      // Fetch Board info
      const boardRes = await fetch(`https://api.trello.com/1/boards/${boardId}?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`);
      if (!boardRes.ok) continue;
      const boardData: any = await boardRes.json();
      allBoards.push({ id: boardData.id, name: boardData.name });

      // Fetch Lists
      const listsRes = await fetch(`https://api.trello.com/1/boards/${boardId}/lists?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`);
      const lists: any[] = await listsRes.json();
      lists.forEach(l => allListsMap.set(l.id, l));

      // Fetch Members
      const membersRes = await fetch(`https://api.trello.com/1/boards/${boardId}/members?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`);
      const members: any[] = await membersRes.json();
      members.forEach(m => {
        const avatarUrl = m.avatarUrl ? `https://trello-avatars.s3.amazonaws.com/${m.avatarUrl}/30.png` : null;
        allMembersMap.set(m.id, { ...m, avatarUrl });
      });

      // Fetch Cards (Open only)
      const cardsRes = await fetch(`https://api.trello.com/1/boards/${boardId}/cards?filter=open&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`);
      const cards: any[] = await cardsRes.json();
      
      const normalized = cards.map(card => {
        const list = allListsMap.get(card.idList);
        const cardMembers = card.idMembers.map((mid: string) => allMembersMap.get(mid)).filter(Boolean);
        
        const now = new Date();
        const dueDate = card.due ? new Date(card.due) : null;
        const updatedAt = new Date(card.dateLastActivity);
        
        const isOverdue = dueDate ? dueDate < now && !card.dueComplete : false;
        const isStale = (now.getTime() - updatedAt.getTime()) > (14 * 24 * 60 * 60 * 1000); // 14 days
        const isUnassigned = card.idMembers.length === 0;

        return {
          id: card.id,
          title: card.name,
          description: card.desc,
          due: card.due,
          boardId: card.idBoard,
          boardName: boardData.name,
          listId: card.idList,
          listName: list?.name || "Unknown",
          memberIds: card.idMembers,
          members: cardMembers,
          labels: card.labels,
          url: card.url,
          updatedAt: card.dateLastActivity,
          isOverdue,
          isStale,
          isUnassigned
        };
      });

      allTasks.push(...normalized);
    }

    cache = {
      tasks: allTasks,
      boards: allBoards,
      members: Array.from(allMembersMap.values()),
      lists: Array.from(allListsMap.values()),
      lastSync: new Date().toISOString(),
    };
  }

  // API Routes
  app.get("/api/config-status", (req, res) => {
    res.json({ configured: checkConfig() });
  });

  app.get("/api/dashboard/summary", (req, res) => {
    if (!cache.lastSync && checkConfig()) {
      // In a real app we might trigger sync here, but let's keep it simple
    }
    
    const tasks = cache.tasks;
    res.json({
      totalOpen: tasks.length,
      overdue: tasks.filter((t: any) => t.isOverdue).length,
      unassigned: tasks.filter((t: any) => t.isUnassigned).length,
      stale: tasks.filter((t: any) => t.isStale).length,
      lastSync: cache.lastSync,
    });
  });

  app.get("/api/tasks", (req, res) => {
    let tasks = [...cache.tasks];
    
    // Simple filtering logic
    const { boardId, listId, memberId, search } = req.query;
    
    if (boardId) tasks = tasks.filter(t => t.boardId === boardId);
    if (listId) tasks = tasks.filter(t => t.listId === listId);
    if (memberId) tasks = tasks.filter(t => t.memberIds.includes(memberId));
    if (search) {
      const q = (search as string).toLowerCase();
      tasks = tasks.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }

    res.json(tasks);
  });

  app.get("/api/filters", (req, res) => {
    res.json({
      boards: cache.boards,
      members: cache.members,
      lists: cache.lists,
    });
  });

  app.post("/api/sync", async (req, res) => {
    try {
      await fetchTrelloData();
      res.json({ status: "success", lastSync: cache.lastSync });
    } catch (error: any) {
      console.error("Sync error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
