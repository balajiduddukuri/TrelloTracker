import React from 'react';
import { DashboardSummary } from '../types';
import { AlertCircle, UserMinus, Clock, List } from 'lucide-react';
import { motion } from 'motion/react';

interface SummaryCardsProps {
  summary: DashboardSummary | null;
}

export default function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      label: 'Open Issues',
      value: summary?.totalOpen ?? 0,
      icon: List,
      color: 'text-blue-600',
    },
    {
      label: 'Overdue',
      value: summary?.overdue ?? 0,
      icon: AlertCircle,
      color: 'text-red-600',
    },
    {
      label: 'Unassigned',
      value: summary?.unassigned ?? 0,
      icon: UserMinus,
      color: 'text-amber-600',
    },
    {
      label: 'Stale (>14d)',
      value: summary?.stale ?? 0,
      icon: Clock,
      color: 'text-gray-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="sleek-card flex flex-col gap-1 transition-transform hover:scale-[1.02] cursor-default"
        >
          <div className="flex items-center justify-between">
            <span className="sleek-stat-label">{card.label}</span>
            <card.icon size={16} className={`opacity-60 ${card.color}`} />
          </div>
          <div className="sleek-stat-value">
            {card.value.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">Updated just now</div>
        </motion.div>
      ))}
    </div>
  );
}
