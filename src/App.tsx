import React, { useState, useEffect } from 'react';
import { RefreshCcw, Activity, AlertTriangle, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import Sidebar from './components/Sidebar';
import SummaryCards from './components/SummaryCards';
import TaskTable from './components/TaskTable';
import TaskDetail from './components/TaskDetail';
import { DashboardSummary, NormalizedTask, TrelloBoard, TrelloMember, TrelloList } from './types';
import { ThemeType } from './components/ThemeSelector';

export default function App() {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(() => {
    return (localStorage.getItem('theme') as ThemeType) || 'sleek';
  });
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [tasks, setTasks] = useState<NormalizedTask[]>([]);
  const [filters, setFilters] = useState({
    boardId: '',
    listId: '',
    memberId: '',
    search: '',
  });
  const [meta, setMeta] = useState<{ boards: TrelloBoard[], members: TrelloMember[], lists: TrelloList[] }>({
    boards: [],
    members: [],
    lists: [],
  });
  const [selectedTask, setSelectedTask] = useState<NormalizedTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [configStatus, setConfigStatus] = useState({ configured: true });

  const fetchData = async () => {
    try {
      const configRes = await fetch('/api/config-status');
      const configData = await configRes.json();
      setConfigStatus(configData);

      if (!configData.configured) {
        setLoading(false);
        return;
      }

      // Chain fetch summary and filters
      const [summaryRes, filtersRes] = await Promise.all([
        fetch('/api/dashboard/summary'),
        fetch('/api/filters')
      ]);
      
      const summaryData = await summaryRes.json();
      const filtersData = await filtersRes.json();

      setSummary(summaryData);
      setMeta(filtersData);

      // If lastSync exists, fetch tasks
      if (summaryData.lastSync) {
        await fetchTasks();
      } else {
        // First time, auto-sync
        await handleSync();
      }
    } catch (error) {
      console.error('Failed to initial fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    const params = new URLSearchParams(filters);
    const res = await fetch(`/api/tasks?${params}`);
    const data = await res.json();
    setTasks(data);
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/sync', { method: 'POST' });
      if (res.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    if (summary?.lastSync) {
      fetchTasks();
    }
  }, [filters]);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[var(--bg)]">
        <Activity className="animate-spin text-gray-400 mb-4" size={32} />
        <span className="mono-label">Initializing Terminal...</span>
      </div>
    );
  }

  if (!configStatus.configured) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[var(--bg)] p-8">
        <div className="sleek-card p-12 max-w-md w-full text-center space-y-6">
          <AlertTriangle className="mx-auto text-amber-500" size={48} />
          <h1 className="text-xl font-serif">Configuration Required</h1>
          <p className="text-sm text-gray-600">
            Trello API Key and Token are not found in environment variables. 
            Please configure <code className="bg-gray-100 px-1 py-0.5 rounded">TRELLO_API_KEY</code> and <code className="bg-gray-100 px-1 py-0.5 rounded">TRELLO_TOKEN</code> in your secrets.
          </p>
          <div className="text-[10px] mono-label pt-4 border-t border-[var(--line)]">
            ERR_CODE: CONFIG_MISSING_01
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex bg-[var(--bg)] overflow-hidden">
      <Sidebar 
        boards={meta.boards} 
        members={meta.members} 
        lists={meta.lists}
        filters={filters}
        setFilters={setFilters}
        currentTheme={currentTheme}
        setTheme={setCurrentTheme}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 px-8 border-b border-[var(--border)] bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-medium">Monitoring /</span>
            <h1 className="text-[15px] font-bold text-slate-800">Task Overview</h1>
          </div>

          <div className="flex items-center gap-6">
            {summary?.lastSync && (
              <div className="text-right flex items-center gap-2">
                <Clock size={12} className="text-slate-300" />
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                  Synced: {new Date(summary.lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            )}
            <button
              onClick={handleSync}
              disabled={syncing}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-2 shadow-sm shadow-indigo-100 active:scale-95"
            >
              <RefreshCcw size={14} className={syncing ? 'animate-spin' : ''} />
              <span className="text-xs font-bold whitespace-nowrap">Synchronize</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[11px] font-bold text-indigo-500">
              AD
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 relative scroll-smooth">
          <div className="max-w-6xl mx-auto">
            <SummaryCards summary={summary} />
            
            <div className="mb-6 flex items-center justify-between">
               <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Backlog Intelligence</h2>
               <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
                  <Activity size={10} className="text-indigo-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{tasks.length} Records</span>
               </div>
            </div>

            <TaskTable tasks={tasks} onSelectTask={setSelectedTask} />
          </div>
          
          {syncing && (
            <div className="absolute inset-0 bg-slate-50/50 backdrop-blur-[2px] flex items-center justify-center z-10 transition-all">
               <div className="sleek-card p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-4 max-w-xs text-center">
                  <div className="relative">
                    <Activity className="animate-spin text-indigo-500" size={32} />
                    <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-800 block mb-1">Live Synchronizing</span>
                    <span className="text-xs text-slate-400 font-medium">Extracting task intelligence from Trello boards...</span>
                  </div>
               </div>
            </div>
          )}
        </div>
      </main>

      <TaskDetail task={selectedTask} onClose={() => setSelectedTask(null)} />
    </div>
  );
}
