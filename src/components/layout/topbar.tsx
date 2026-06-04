'use client';
import React from 'react';
import { Search, Bell } from 'lucide-react';

export default function Topbar() {
  return (
    <header className="h-16 border-b border-white/5 bg-slate-900/50 backdrop-blur-xl flex items-center px-6 justify-between sticky top-0 z-30">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search employees, candidates, bands..." 
            className="h-10 w-full bg-slate-950/50 border border-white/10 rounded-lg pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all placeholder:text-slate-500"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-slate-800 text-slate-400 transition-colors relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500"></span>
        </button>
        <div className="h-8 w-8 rounded-full bg-violet-600 flex items-center justify-center text-sm font-medium text-white cursor-pointer ring-2 ring-violet-600/20">
          AD
        </div>
      </div>
    </header>
  );
}
