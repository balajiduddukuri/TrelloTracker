import React from 'react';
import { NormalizedTask } from '../types';
import { ExternalLink, Clock, User, MessageSquare } from 'lucide-react';
import Skeleton from './ui/Skeleton';
import { motion } from 'motion/react';

interface TaskTableProps {
  tasks: NormalizedTask[];
  onSelectTask: (task: NormalizedTask) => void;
  loading?: boolean;
}

export default function TaskTable({ tasks, onSelectTask, loading }: TaskTableProps) {
  if (loading) {
    return (
      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-500">
        <div className="p-8 space-y-6">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center gap-6">
              <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-12 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="sleek-card p-16 text-center bg-white/10 backdrop-blur-md border-dashed border-2">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="text-slate-300" size={24} />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">Silence in the Backlog</h3>
        <p className="text-sm font-medium opacity-40 max-w-xs mx-auto">No tasks found matching your filters. Maybe it's time to celebrate?</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden ring-1 ring-black/5">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
              <th className="px-8 py-5 text-[11px] font-black opacity-40 uppercase tracking-[0.15em]">Issue / Task</th>
              <th className="px-8 py-5 text-[11px] font-black opacity-40 uppercase tracking-[0.15em]">Context</th>
              <th className="px-8 py-5 text-[11px] font-black opacity-40 uppercase tracking-[0.15em]">Owner</th>
              <th className="px-8 py-5 text-[11px] font-black opacity-40 uppercase tracking-[0.15em]">Deadline</th>
              <th className="px-8 py-5 text-[11px] font-black opacity-40 uppercase tracking-[0.15em] text-right">Ops</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {tasks.map((task, index) => (
              <motion.tr
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => onSelectTask(task)}
                className="hover:bg-[var(--bg)] cursor-pointer transition-all group"
              >
                <td className="px-8 py-5">
                  <div className="flex flex-col gap-2">
                    <span className="font-bold text-[14px] text-[var(--text-main)] group-hover:text-[var(--brand)] transition-colors">{task.title}</span>
                    <div className="flex flex-wrap gap-1.5">
                       {task.labels.map(l => (
                         <span 
                          key={l.id} 
                          className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter"
                          style={{ 
                            backgroundColor: l.color === 'black' ? 'rgba(0,0,0,0.05)' : `${l.color}15`, 
                            color: l.color === 'black' ? 'var(--text-main)' : l.color 
                          }}
                         >
                           {l.name || l.color}
                         </span>
                       ))}
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-[var(--brand)] uppercase tracking-widest mb-1">{task.boardName}</span>
                    <span className="text-[13px] text-[var(--text-muted)] font-bold">{task.listName}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex -space-x-2">
                    {task.members.length > 0 ? (
                      task.members.map(m => (
                        <div 
                          key={m.id} 
                          className="h-8 w-8 rounded-xl ring-2 ring-[var(--card-bg)] overflow-hidden bg-[var(--bg)] border border-[var(--border)] grayscale hover:grayscale-0 transition-all hover:scale-110 z-10"
                          title={m.fullName}
                        >
                          {m.avatarUrl ? (
                            <img src={m.avatarUrl} referrerPolicy="no-referrer" alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-[10px] font-black opacity-50">
                              {m.fullName[0]}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="h-8 w-8 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center">
                        <User size={12} className="text-slate-300" />
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className={`text-[12px] font-black flex items-center gap-2 ${task.isOverdue ? 'text-rose-500' : 'text-[var(--text-main)] opacity-70'}`}>
                    {task.due ? new Date(task.due).toLocaleDateString([], { month: 'short', day: 'numeric' }) : '—'}
                    {task.isOverdue && <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />}
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <a
                      href={task.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 opacity-0 group-hover:opacity-100 bg-white border border-slate-100 text-slate-400 hover:text-[var(--brand)] hover:scale-110 rounded-xl transition-all shadow-sm"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
