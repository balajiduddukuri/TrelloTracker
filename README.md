# Trello Task Tracker & Dashboard

A professional, full-stack task intelligence platform that syncs with Trello to provide deep insights, AI-powered backlog analysis, and team retrospective tools.

![Dashboard Preview](https://picsum.photos/seed/trello-dashboard/1200/600)

## 🚀 Key Features

### 📊 Intelligence Dashboard
- **Real-time Sync**: Direct integration with Trello API to fetch boards, lists, and cards.
- **KPI Metrics**: Instant visibility into Open, Overdue, Unassigned, and Stale tasks.
- **Backlog Intelligence**: A high-density data table with advanced filtering by Board, List, and Member.

### 🤖 AI Task Assistant (Gemini Powered)
- **Natural Language Queries**: Ask "What's most urgent today?" or "Summarize my stale tasks."
- **Context-Aware**: The AI understands your current Trello context for precise answers.
- **Powered by Gemini 3**: Uses the latest `@google/genai` SDK for low-latency intelligence.

### 🔄 Multi-Theme Workspace
- **Sleek**: Modern indigo interface for general use.
- **Technical**: High-density view for "power users."
- **Dark Luxury**: Premium dark mode for focused work.
- **Brutal**: High-contrast brutalist design for high visibility.

### 📝 Sprint Retrospectives
- **Start/Stop/Continue**: Dedicated space for team reflection.
- **Upvoting System**: Identify the most critical action items through team feedback.
- **Persistence**: Retro items are maintained across sessions.

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4, Motion.
- **Backend**: Node.js, Express (API Proxy & Normalization).
- **AI**: Gemini 1.5/3.0 via `@google/genai`.
- **Icons**: Lucide React.
- **Deployment**: Optimized for Cloud Run/Containerized environments.

## 🚦 Getting Started

### Prerequisites

- Node.js (v20+)
- Trello API Account (Key & Token)
- Gemini API Key

### Configuration

Create a `.env` file or set environment variables:

```env
TRELLO_API_KEY=your_key
TRELLO_TOKEN=your_token
TRELLO_BOARDS=comma_separated_board_ids
GEMINI_API_KEY=your_gemini_key
```

### Installation

```bash
# Install dependencies
npm install

# Start development server (Full-stack)
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## 📖 Architecture & Documentation

- **`AGENTS.md`**: Project conventions and AI agent rules.
- **`GEMINI.md`**: AI integration patterns and model selection.
- **`src/types.ts`**: Core data structures and API contracts.

## ⚖️ License

MIT License - feel free to use this for your own productivity workflows!
