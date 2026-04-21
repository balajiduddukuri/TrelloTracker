import React from 'react';
import { NormalizedTask } from '../types';
import { ExternalLink, Clock, User, MessageSquare } from 'lucide-react';

interface TaskTableProps {
  tasks: NormalizedTask[];
  onSelectTask: (task: NormalizedTask) => void;
}

export default function TaskTable({ tasks, onSelectTask }: TaskTableProps) {
  if (tasks.length === 0) {
    return (
      <div className="sleek-card p-12 text-center bg-white/10 backdrop-blur-sm">
        <p className="text-sm font-medium opacity-40">No tasks found matching criteria</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
              <th className="px-6 py-4 text-[12px] font-bold opacity-50 uppercase tracking-wider">Issue / Task</th>
              <th className="px-6 py-4 text-[12px] font-bold opacity-50 uppercase tracking-wider">Location</th>
              <th className="px-6 py-4 text-[12px] font-bold opacity-50 uppercase tracking-wider">Assigned</th>
              <th className="px-6 py-4 text-[12px] font-bold opacity-50 uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-4 text-[12px] font-bold opacity-50 uppercase tracking-wider text-right">Activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {tasks.map((task) => (
              <tr
                key={task.id}
                onClick={() => onSelectTask(task)}
                className="hover:bg-[var(--bg)] cursor-pointer transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="font-semibold text-[14px] text-[var(--text-main)] line-clamp-1">{task.title}</span>
                    <div className="flex flex-wrap gap-1">
                       {task.labels.map(l => (
                         <span 
                          key={l.id} 
                          className="badge-sleek opacity-80"
                          style={{ 
                            backgroundColor: l.color === 'black' ? 'rgba(0,0,0,0.1)' : `${l.color}20`, 
                            color: l.color === 'black' ? 'var(--text-main)' : l.color 
                          }}
                         >
                           {l.name || l.color}
                         </span>
                       ))}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-[var(--brand)] uppercase tracking-tight">{task.boardName}</span>
                    <span className="text-[13px] text-[var(--text-muted)] font-medium">{task.listName}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    {task.members.length > 0 ? (
                      task.members.map(m => (
                        <div 
                          key={m.id} 
                          className="inline-block h-7 w-7 rounded-full ring-2 ring-[var(--card-bg)] overflow-hidden bg-[var(--bg)] border border-[var(--border)]"
                          title={m.fullName}
                        >
                          {m.avatarUrl ? (
                            <img src={m.avatarUrl} referrerPolicy="no-referrer" alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-[10px] font-bold opacity-50">
                              {m.fullName[0]}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <span className="text-[11px] font-medium opacity-30 italic">Unassigned</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className={`text-[13px] font-semibold flex items-center gap-1 ${task.isOverdue ? 'text-red-500' : 'text-[var(--text-main)]'}`}>
                    {task.due ? new Date(task.due).toLocaleDateString() : '—'}
                    {task.isOverdue && <Clock size={12} />}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-4">
                    <span className="text-[12px] font-medium text-[var(--text-muted)]">
                      {new Date(task.updatedAt).toLocaleDateString()}
                    </span>
                    <a
                      href={task.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 opacity-30 hover:opacity-100 hover:text-[var(--brand)] transition-all"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
