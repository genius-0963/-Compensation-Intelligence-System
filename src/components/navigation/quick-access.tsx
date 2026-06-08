'use client';

import React from 'react';
import { Plus, Terminal, Zap, FileText, GitBranch, Settings } from 'lucide-react';

export function QuickAccess() {
  const actions = [
    { icon: Plus, label: 'New File', color: 'text-blue-600' },
    { icon: Terminal, label: 'Terminal', color: 'text-indigo-600' },
    { icon: Zap, label: 'Deploy', color: 'text-amber-500' },
    { icon: FileText, label: 'Docs', color: 'text-emerald-600' },
    { icon: GitBranch, label: 'Git', color: 'text-rose-500' },
    { icon: Settings, label: 'Settings', color: 'text-slate-400' },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
      <div className="flex items-center gap-1 p-1.5 bg-background/80 backdrop-blur-xl border border-border rounded-2xl shadow-premium animate-fade-up">
        {actions.map((action, i) => (
          <button 
            key={i}
            className="group relative p-3 rounded-xl hover:bg-card hover:shadow-sm transition-all flex flex-col items-center"
          >
            <action.icon className={`h-5 w-5 ${action.color} transition-transform group-hover:scale-110`} />
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#1F2937] text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
