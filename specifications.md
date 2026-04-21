# Technical Specifications - Trello Task Tracker

## 1. Overview
The Trello Task Tracker is a full-stack dashboard designed to aggregate, analyze, and visualize Trello data. It provides enhanced productivity features like KPI tracking, AI-powered backlog analysis, and team retrospective tools.

## 2. Technical Stack
- **Frontend Framework**: React 19 (Strict Mode)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4.0
- **Animation**: Motion (motion/react)
- **Icons**: Lucide React
- **Backend**: Node.js with Express
- **AI Integration**: Google Gemini 3.0 Flash (@google/genai)
- **State Management**: React Hooks (useState, useEffect, useMemo)

## 3. Core Components
### 3.1 Dashboard View
- **SummaryCards**: Displays four key metrics (Open, Overdue, Unassigned, Stale).
- **TaskTable**: A high-density data grid with sorting and filtering capabilities.
- **Sidebar**: Central navigation and filtering hub.
- **ThemeSelector**: Dynamic UI aesthetic switcher (4 themes: Sleek, Technical, Dark, Brutal).

### 3.2 Intelligence Layer
- **Gemini AI Assistant**: Side-loading chat interface.
- **Context Handling**: Serializes task state as JSON and injects it into the LLM system prompt.
- **Model**: `gemini-3-flash-preview` or `gemini-3.1-pro-preview`.

### 3.3 Collaborative Tools
- **RetroBoard**: Client-side retrospective board with local storage persistence.
- **Categories**: Went Well, To Improve, Action Items.
- **Voting**: Single-instance upvoting system per item.

### 3.4 Production Systems
- **Skeleton Loaders**: Modern `Skeleton` components for non-blocking UI initialization and perceived performance.
- **Toast Engine**: Global notified system for asynchronous feedback (Sync Success, Error, Connectivity).
- **Navigation Rails**: High-fidelity sidebar for rapid context switching between Ops (Dashboard) and Brain (AI/Retro).

## 4. API Endpoints (Backend)
- `GET /api/config-status`: Checks for Presence of Trello credentials.
- `GET /api/dashboard/summary`: Returns aggregated task counts.
- `GET /api/tasks`: Returns normalized cards with enhanced metadata (overdue/stale flags).
- `GET /api/filters`: Returns boards, members, and lists for UI dropdowns.
- `POST /api/sync`: Forces clear of in-memory cache and refetch from Trello.

## 5. Environment Requirements
- `TRELLO_API_KEY`: Trello Developer Key.
- `TRELLO_TOKEN`: Trello OAuth Token.
- `TRELLO_BOARDS`: Comma-separated list of Board IDs to track.
- `GEMINI_API_KEY`: Google Generative AI Key.

## 6. Performance & UX Design
- **Perceived Performance**: Implementation of `Skeleton` screens to reduce layout shift during initial data hydration.
- **Micro-Animations**: Staggered row entries and transition-weighted iconography for a high-end interaction feel.
- **Responsive Density**: Fluid layouts that maintain command-center density across various screen signatures.
- **Error Resilience**: Proactive error catching with visual Toast feedback to ensure user transparency.
