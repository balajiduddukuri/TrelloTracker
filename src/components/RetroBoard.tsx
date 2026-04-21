import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RetroItem {
  id: string;
  content: string;
  category: 'well' | 'improved' | 'action';
  votes: number;
}

export default function RetroBoard() {
  const [items, setItems] = useState<RetroItem[]>(() => {
    const saved = localStorage.getItem('retro-items');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState('');
  const [activeCategory, setActiveCategory] = useState<'well' | 'improved' | 'action'>('well');

  useEffect(() => {
    localStorage.setItem('retro-items', JSON.stringify(items));
  }, [items]);

  const addItem = (category: 'well' | 'improved' | 'action') => {
    if (!inputValue.trim()) return;
    const newItem: RetroItem = {
      id: Math.random().toString(36).substr(2, 9),
      content: inputValue,
      category,
      votes: 0
    };
    setItems([...items, newItem]);
    setInputValue('');
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const voteItem = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, votes: item.votes + 1 } : item));
  };

  const categories = [
    { id: 'well', label: 'Went Well', color: 'bg-green-50 text-green-700 border-green-100', icon: '✨' },
    { id: 'improved', label: 'To Improve', color: 'bg-rose-50 text-rose-700 border-rose-100', icon: '⛈️' },
    { id: 'action', label: 'Action Items', color: 'bg-indigo-50 text-indigo-700 border-indigo-100', icon: '🚀' }
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto h-full flex flex-col">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-[var(--text-main)] mb-2">Sprint Retrospective</h1>
        <p className="text-[var(--text-muted)] text-sm uppercase tracking-widest font-bold">Reflect. Adjust. Improve.</p>
      </header>

      <div className="flex gap-4 mb-8">
        <input
          type="text"
          placeholder="Type your reflection..."
          className="flex-1 sleek-card !py-3 !px-4 focus:ring-2 focus:ring-indigo-100 outline-none"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem(activeCategory)}
        />
        <div className="flex bg-white border border-[var(--border)] rounded-xl overflow-hidden p-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-4 py-2 text-xs font-bold uppercase transition-all rounded-lg ${
                activeCategory === cat.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => addItem(activeCategory)}
          className="bg-indigo-600 text-white px-6 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          Add Note
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1 overflow-hidden h-full pb-8">
        {categories.map(cat => (
          <div key={cat.id} className="flex flex-col h-full bg-slate-50/50 rounded-2xl border border-[var(--border)] overflow-hidden">
            <div className={`p-4 border-b ${cat.color} flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <span>{cat.icon}</span>
                <span className="font-bold uppercase text-xs tracking-tighter">{cat.label}</span>
              </div>
              <span className="text-[10px] font-bold opacity-60">
                {items.filter(i => i.category === cat.id).length} ITEMS
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              <AnimatePresence>
                {items
                  .filter(i => i.category === cat.id)
                  .map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      layout
                      className="sleek-card !p-4 !rounded-xl group relative bg-white border-slate-100"
                    >
                      <div className="flex gap-3">
                        <GripVertical size={14} className="text-slate-200 mt-1 shrink-0" />
                        <div className="flex-1">
                          <p className="text-[14px] text-slate-700 font-medium leading-relaxed mb-3">{item.content}</p>
                          <div className="flex items-center justify-between">
                            <button 
                              onClick={() => voteItem(item.id)}
                              className="text-[10px] font-bold px-2 py-1 bg-slate-50 border border-slate-100 rounded hover:bg-indigo-50 hover:text-indigo-600 transition-all text-slate-400"
                            >
                              👍 {item.votes}
                            </button>
                            <button 
                              onClick={() => deleteItem(item.id)}
                              className="p-1.5 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 rounded-md transition-all"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
              {items.filter(i => i.category === cat.id).length === 0 && (
                <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl">
                  <span className="text-[11px] font-bold text-slate-300 uppercase">Input Required</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
