import React from 'react';
import { Filter, User, Tag, Layout, Palette } from 'lucide-react';
import { TrelloBoard, TrelloMember, TrelloList } from '../types';
import ThemeSelector, { ThemeType } from './ThemeSelector';

interface SidebarProps {
  boards: TrelloBoard[];
  members: TrelloMember[];
  lists: TrelloList[];
  filters: {
    boardId: string;
    listId: string;
    memberId: string;
    search: string;
  };
  setFilters: (f: any) => void;
  currentTheme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

export default function Sidebar({ boards, members, lists, filters, setFilters, currentTheme, setTheme }: SidebarProps) {
  return (
    <aside className="w-60 border-r border-[var(--border)] h-full overflow-y-auto bg-[var(--sidebar-bg)] flex flex-col transition-all">
      <div className="p-6 pb-8">
        <h2 className="text-xl font-extrabold text-[var(--brand)]">TrelloTracker</h2>
      </div>

      <nav className="flex-1 space-y-1">
        <div className="px-6 mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full bg-slate-50 border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-300"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-6 pb-8">
          <ThemeSelector currentTheme={currentTheme} setTheme={setTheme} />
          
          <div className="h-px bg-slate-100 mx-6" />

          <section>
            <div className="px-6 flex items-center gap-2 mb-2">
              <Layout size={14} className="text-[var(--text-muted)]" />
              <h3 className="sleek-stat-label !text-[10px]">Boards</h3>
            </div>
            <div className="px-3">
              <select
                className="w-full bg-transparent p-2 text-sm text-[var(--text-main)] rounded-md hover:bg-slate-50 focus:outline-none"
                value={filters.boardId}
                onChange={(e) => setFilters({ ...filters, boardId: e.target.value })}
              >
                <option value="">All Boards</option>
                {boards.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
          </section>

          <section>
            <div className="px-6 flex items-center gap-2 mb-2">
              <Filter size={14} className="text-[var(--text-muted)]" />
              <h3 className="sleek-stat-label !text-[10px]">Status / List</h3>
            </div>
            <div className="px-3">
              <select
                className="w-full bg-transparent p-2 text-sm text-[var(--text-main)] rounded-md hover:bg-slate-50 focus:outline-none"
                value={filters.listId}
                onChange={(e) => setFilters({ ...filters, listId: e.target.value })}
              >
                <option value="">All Lists</option>
                {lists
                  .filter(l => !filters.boardId || l.idBoard === filters.boardId)
                  .map(l => <option key={l.id} value={l.id}>{l.name}</option>)
                }
              </select>
            </div>
          </section>

          <section>
            <div className="px-6 flex items-center gap-2 mb-2">
              <User size={14} className="text-[var(--text-muted)]" />
              <h3 className="sleek-stat-label !text-[10px]">Assigned Member</h3>
            </div>
            <div className="px-3">
              <select
                className="w-full bg-transparent p-2 text-sm text-[var(--text-main)] rounded-md hover:bg-slate-50 focus:outline-none"
                value={filters.memberId}
                onChange={(e) => setFilters({ ...filters, memberId: e.target.value })}
              >
                <option value="">Anyone</option>
                {members.map(m => <option key={m.id} value={m.id}>{m.fullName}</option>)}
              </select>
            </div>
          </section>
        </div>
      </nav>

      <div className="p-6 mt-auto">
        <div className="bg-slate-50 rounded-lg p-3">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Status</div>
          <div className="text-xs font-semibold text-slate-600 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Operational
          </div>
        </div>
      </div>
    </aside>
  );
}
