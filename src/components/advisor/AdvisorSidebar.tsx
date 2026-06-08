'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search, Sparkles, MessageSquare, Trash2, Pin, Archive } from 'lucide-react';


interface SidebarProps {
  conversations: any[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onRefresh: () => void;
}

export default function AdvisorSidebar({ conversations, activeId, onSelect, onNew, onRefresh }: SidebarProps) {
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Archive conversation?")) {
      await fetch(`/api/advisor/conversations/${id}`, { method: 'DELETE' });
      onRefresh();
    }
  };

  return (
    <div className="w-[320px] h-full bg-[#0B1020] border-r border-slate-800 flex flex-col shrink-0">
      <div className="p-4 flex items-center justify-between border-b border-slate-800">
        <h2 className="font-semibold text-slate-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-400" /> AI History
        </h2>
        <Button variant="ghost" size="sm" onClick={onNew} className="text-slate-300 hover:text-white hover:bg-slate-800">
          <Plus size={18} />
        </Button>
      </div>

      <div className="p-4 border-b border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search conversations..." 
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {conversations.map(conv => (
          <div 
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`p-3 rounded-xl cursor-pointer group transition-all relative ${
              activeId === conv.id 
                ? 'bg-slate-800 text-white' 
                : 'hover:bg-slate-800/50 text-slate-300'
            }`}
          >
            <div className="flex items-start justify-between mb-1 pr-6">
              <h4 className="font-medium text-sm truncate pr-2">{conv.title}</h4>
              <span className="text-[10px] text-slate-500 whitespace-nowrap">
                {new Date(conv.updatedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <MessageSquare size={12} /> {(conv.mode ?? 'GENERAL').replace(/_/g, ' ')}
            </div>

            {/* Quick Actions overlay */}
            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
              <button onClick={(e) => handleDelete(e, conv.id)} className="p-1.5 text-slate-400 hover:text-rose-400 rounded-md hover:bg-slate-700">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {conversations.length === 0 && (
          <div className="text-center p-6 text-sm text-slate-500">
            No history yet. Start a conversation.
          </div>
        )}
      </div>
    </div>
  );
}
