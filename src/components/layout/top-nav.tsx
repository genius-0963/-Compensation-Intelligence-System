'use client';

import React from 'react';
import { Search, Bell, Zap, Bookmark, Command } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserNav } from './user-nav';
import { ThemeToggle } from '../ui/theme-toggle';

export default function TopNav() {
  const pathname = usePathname();
  
  // Dynamic Page Title
  const getPageTitle = () => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0 || segments[0] === 'dashboard') return 'Dashboard';
    const segment = segments[0];
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
  };

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center px-8 justify-between sticky top-0 z-40 transition-colors">
      {/* Left: Page Title */}
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-black text-foreground tracking-tight whitespace-nowrap">{getPageTitle()}</h2>
        <div className="h-4 w-px bg-border mx-2 hidden lg:block" />
      </div>

      {/* Center: Global Search */}
      <div className="flex-1 max-w-2xl px-8">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
          <input 
            type="text" 
            placeholder="Search companies, levels, locations, roles..." 
            className="h-10 w-full bg-muted/50 border border-border rounded-xl pl-11 pr-16 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring focus:bg-background transition-all placeholder:text-muted-foreground"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-1 bg-muted border border-border rounded text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
            <Command className="h-2.5 w-2.5" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <Link href="/compare" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all shadow-lg active:scale-95">
          <Zap className="h-3 w-3 text-amber-400" />
          Quick Compare
        </Link>
        
        <div className="flex items-center gap-1">
          <button className="h-10 w-10 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
            <Bookmark className="h-5 w-5" />
          </button>
          <button className="h-10 w-10 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all relative">
            <Bell className="h-5 w-5" />
            <div className="absolute top-2.5 right-2.5 h-2 w-2 bg-destructive border-2 border-background rounded-full" />
          </button>
          
          <div className="h-8 w-px bg-border mx-1" />
          <ThemeToggle />
        </div>

        <UserNav />
      </div>
    </header>
  );
}
