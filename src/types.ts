export interface TrelloCard {
  id: string;
  name: string;
  desc: string;
  due: string | null;
  idBoard: string;
  idList: string;
  idMembers: string[];
  idLabels: string[];
  url: string;
  dateLastActivity: string;
  labels: { id: string; name: string; color: string }[];
}

export interface TrelloBoard {
  id: string;
  name: string;
}

export interface TrelloList {
  id: string;
  name: string;
  idBoard: string;
}

export interface TrelloMember {
  id: string;
  fullName: string;
  username: string;
  avatarUrl: string | null;
}

export interface DashboardSummary {
  totalOpen: number;
  overdue: number;
  unassigned: number;
  stale: number;
  lastSync: string;
}

export interface NormalizedTask {
  id: string;
  title: string;
  description: string;
  due: string | null;
  boardId: string;
  boardName: string;
  listId: string;
  listName: string;
  memberIds: string[];
  members: TrelloMember[];
  labels: { id: string; name: string; color: string }[];
  url: string;
  updatedAt: string;
  isOverdue: boolean;
  isStale: boolean;
  isUnassigned: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}
