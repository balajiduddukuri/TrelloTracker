import React from 'react';
import { NormalizedTask } from '../types';
import { X, ExternalLink, Calendar, MapPin, Hash, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TaskDetailProps {
  task: NormalizedTask | null;
  onClose: () => void;
}

export default function TaskDetail({ task, onClose }: TaskDetailProps) {
  if (!task) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] pointer-events-auto transition-opacity" onClick={onClose} />
        
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl border-l border-[var(--border)] pointer-events-auto flex flex-col"
        >
          <div className="p-6 border-b border-[var(--border)] flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
               <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded">Task Context</span>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-10">
            <header>
              <h1 className="text-2xl font-bold text-slate-900 mb-6 leading-snug">{task.title}</h1>
              <div className="flex flex-wrap gap-2">
                {task.labels.map(l => (
                  <span 
                    key={l.id} 
                    className="badge-sleek opacity-90 shadow-sm"
                    style={{ 
                      backgroundColor: l.color === 'black' ? '#e2e8f0' : `${l.color}20`, 
                      color: l.color === 'black' ? '#1e293b' : l.color 
                    }}
                  >
                    {l.name || l.color}
                  </span>
                ))}
              </div>
            </header>

            <div className="grid grid-cols-2 gap-10 py-10 border-y border-slate-100">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg">
                    <MapPin size={16} className="text-slate-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Location</span>
                    <span className="text-[14px] font-semibold text-slate-700">{task.boardName} / {task.listName}</span>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg">
                    <Calendar size={16} className="text-slate-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Due Date</span>
                    <span className={`text-[14px] font-semibold ${task.isOverdue ? 'text-rose-500' : 'text-slate-700'}`}>
                      {task.due ? new Date(task.due).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Not Set'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg">
                    <User size={16} className="text-slate-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Assigned</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {task.members.map(m => (
                        <div key={m.id} className="text-[11px] font-semibold text-slate-600 px-2 py-1 bg-slate-100 rounded-md border border-slate-200">{m.fullName}</div>
                      ))}
                      {task.members.length === 0 && <span className="text-xs italic text-slate-400">Unassigned</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg">
                    <Hash size={16} className="text-slate-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Issue ID</span>
                    <span className="text-[12px] font-mono font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{task.id}</span>
                  </div>
                </div>
              </div>
            </div>

            <section>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Description</h3>
              <div className="text-[15px] text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50/50 p-6 rounded-xl border border-slate-100">
                {task.description || <span className="italic opacity-40">No description provided.</span>}
              </div>
            </section>
          </div>

          <div className="p-6 border-t border-[var(--border)] bg-slate-50/50">
            <a
              href={task.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white py-4 rounded-xl font-bold text-[14px] shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98]"
            >
              View on Trello <ExternalLink size={18} />
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
