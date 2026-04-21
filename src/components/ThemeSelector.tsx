import React from 'react';
import { Palette, Check } from 'lucide-react';

export type ThemeType = 'sleek' | 'technical' | 'dark' | 'brutal';

interface ThemeSelectorProps {
  currentTheme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

export default function ThemeSelector({ currentTheme, setTheme }: ThemeSelectorProps) {
  const themes: { id: ThemeType; label: string; color: string }[] = [
    { id: 'sleek', label: 'Sleek', color: 'bg-indigo-500' },
    { id: 'technical', label: 'Technical', color: 'bg-gray-800' },
    { id: 'dark', label: 'Dark Luxury', color: 'bg-slate-900' },
    { id: 'brutal', label: 'Brutal', color: 'bg-green-400' },
  ];

  return (
    <section>
      <div className="px-6 flex items-center gap-2 mb-3">
        <Palette size={14} className="text-[var(--text-muted)]" />
        <h3 className="sleek-stat-label !text-[10px]">Appearance</h3>
      </div>
      <div className="px-4 grid grid-cols-2 gap-2">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setTheme(theme.id)}
            className={`flex items-center gap-2 p-2 rounded-md transition-all text-left group ${
              currentTheme === theme.id ? 'bg-slate-100 ring-1 ring-slate-200' : 'hover:bg-slate-50'
            }`}
          >
            <div className={`w-3 h-3 rounded-full ${theme.color} shrink-0 shadow-sm`} />
            <span className={`text-[11px] font-bold ${currentTheme === theme.id ? 'text-slate-800' : 'text-slate-500'}`}>
              {theme.label}
            </span>
            {currentTheme === theme.id && <Check size={10} className="ml-auto text-indigo-500" />}
          </button>
        ))}
      </div>
    </section>
  );
}
