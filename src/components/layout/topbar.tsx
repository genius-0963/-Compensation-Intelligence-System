'use client';
import React from 'react';
import { Search, Bell } from 'lucide-react';
import { ThemeToggle } from '../ui/theme-toggle';

export default function Topbar() {
  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center px-6 justify-between sticky top-0 z-30">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input 
            type="text" 
            placeholder="Search employees, candidates, bands..." 
            className="h-10 w-full bg-background border border-border rounded-lg pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <button className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-card text-muted transition-colors relative">
          <Bell className="h-5 w-5" />
        </button>
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-sm font-medium text-white cursor-pointer ring-2 ring-primary/20">
          AD
        </div>
      </div>
    </header>
  );
}
