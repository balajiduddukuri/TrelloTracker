# Trello Task Tracker - Documentation

This document provides a detailed overview of the system architecture, data models, and feature implementation of the Trello Task Tracker.

## 🏗️ System Architecture

The application follows a **BFF (Backend-for-Frontend)** pattern:

1.  **Frontend (React/Vite)**: 
    - Manages user UI state, themes, and interactive boards.
    - Communicates with the Express backend instead of direct Trello API calls (for security).
    - Integrates Gemini AI directly for conversational features.

2.  **Backend (Express)**:
    - Acts as a proxy/normalizer for the Trello API.
    - Handles authentication (API Key/Token) in a secure server-side environment.
    - Aggregates metrics to reduce frontend logic complexity.

## 📂 Project Structure

```text
/src
  /components
    /ui/            - Reusable UI elements
    ChatInterface   - Gemini-powered AI sidebar
    RetroBoard      - Team reflection workspace
    SummaryCards    - KPI visualization
    TaskTable       - Data-rich backlog view
    ThemeSelector   - Global aesthetic switcher
  /services         - (Optional) Future service abstraction
  App.tsx           - Main entry point and state coordinator
  types.ts          - Central type definitions
server.ts           - Express server and Trello API logic
```

## 🔌 API Endpoints

### `GET /api/tasks`
Returns a list of normalized tasks.
- **Query Params**: `boardId`, `listId`, `memberId`, `search`.

### `GET /api/dashboard/summary`
Returns aggregated stats.
- **Response**: `{ open, overdue, unassigned, stale, lastSync }`.

### `POST /api/sync`
Manually triggers a cache refresh from Trello.

## 🤖 AI Integration Details

The **Task Intelligence Assistant** uses the Gemini 3.0 Flash model via the `@google/genai` SDK.

- **Context Injection**: Every request to the AI includes a JSON-serialized snapshot of the current task list.
- **System Prompt**: Enforces a persona of a Trello Workspace expert.
- **Location**: Implementation is in `src/components/ChatInterface.tsx`.

## 🎨 Theme System

Themes are implemented via `data-theme` attributes on the `html` element.

**Theme Variables (src/index.css):**
- `--bg`: Main body background.
- `--brand`: Primary accent color.
- `--text-main`: Standard text color.
- `--border`: UI element borders.

To add a new theme:
1. Define a new `[data-theme='name']` block in `src/index.css`.
2. Update `ThemeSelector.tsx` to include the new option.

## 🔄 Data Lifecycle

1. **Bootstrap**: `App.tsx` calls `/api/config-status`.
2. **Initial Load**: If configured, it calls `/api/dashboard/summary`.
3. **Filtering**: User changes filters -> `App.tsx` triggers `fetchTasks()`.
4. **Syncing**: User clicks "Sync" -> Backend refetches from Trello -> Frontend updates.

## 🛠️ Future Roadmap

- [ ] Support for editing task labels/status directly.
- [ ] Multi-user concurrent retro boards (WebSockets).
- [ ] Export Retro action items to PDF or Trello.
- [ ] Chart.js integration for historical task trends.
