import React from 'react';
import { Filter, User, Tag, Layout, Palette, Sparkles, Search } from 'lucide-react';
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
  activeView: 'dashboard' | 'retro';
  setActiveView: (view: 'dashboard' | 'retro') => void;
  onOpenChat: () => void;
}

export default function Sidebar({ 
  boards, members, lists, filters, setFilters, 
  currentTheme, setTheme, 
  activeView, setActiveView,
  onOpenChat
}: SidebarProps) {
  return (
    <aside className="w-64 border-r border-[var(--border)] h-full overflow-y-auto bg-[var(--sidebar-bg)] flex flex-col transition-all">
      <div className="p-8 pb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Layout size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800 tracking-tighter leading-tight">Trello<span className="text-indigo-600">Sync</span></h2>
            <div className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Ops Command Center</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        <div className="px-4 mb-8 space-y-1">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-black uppercase tracking-tight transition-all ${
              activeView === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'
            }`}
          >
            <Layout size={16} />
            Dashboard
          </button>
          <button
            onClick={() => setActiveView('retro')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-black uppercase tracking-tight transition-all ${
              activeView === 'retro' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'
            }`}
          >
            <Tag size={16} />
            Retrospective
          </button>
          <button
            onClick={onOpenChat}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-black uppercase tracking-tight text-slate-400 hover:bg-slate-50 transition-all border border-dashed border-slate-200 mt-4 group"
          >
            <Sparkles size={16} className="text-indigo-500 group-hover:scale-125 transition-transform" />
            AI Analytics
          </button>
        </div>

        <div className="px-6 mb-6">
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
              <Search size={14} />
            </div>
            <input
              type="text"
              placeholder="Filter instances..."
              className="w-full bg-slate-50 border border-transparent focus:border-indigo-100 focus:bg-white rounded-xl pl-9 pr-4 py-2.5 text-xs font-bold outline-none transition-all placeholder:text-slate-300"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-6 pb-8">
          <ThemeSelector currentTheme={currentTheme} setTheme={setTheme} />
          
          <div className="h-px bg-slate-100 mx-6" />

          {activeView === 'dashboard' && (
            <>
              <section>
                <div className="px-6 flex items-center gap-2 mb-2">
                  <Layout size={14} className="text-[var(--text-muted)]" />
                  <h3 className="sleek-stat-label !text-[10px]">Boards</h3>
                </div>
                <div className="px-3 text-sm">
                  <select
                    className="w-full bg-transparent p-2 text-[var(--text-main)] rounded-md hover:bg-slate-50 focus:outline-none"
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
                <div className="px-3 text-sm">
                  <select
                    className="w-full bg-transparent p-2 text-[var(--text-main)] rounded-md hover:bg-slate-50 focus:outline-none"
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
                <div className="px-3 text-sm">
                  <select
                    className="w-full bg-transparent p-2 text-[var(--text-main)] rounded-md hover:bg-slate-50 focus:outline-none"
                    value={filters.memberId}
                    onChange={(e) => setFilters({ ...filters, memberId: e.target.value })}
                  >
                    <option value="">Anyone</option>
                    {members.map(m => <option key={m.id} value={m.id}>{m.fullName}</option>)}
                  </select>
                </div>
              </section>
            </>
          )}
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
