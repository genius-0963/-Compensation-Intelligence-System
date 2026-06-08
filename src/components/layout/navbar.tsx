'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Bell, Moon, Sun, Plus, ChevronDown, User, Layers, Command } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-background/80 backdrop-blur-md border-b border-border shadow-sm py-2' : 'bg-background py-4'
    }`}>
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 flex items-center justify-between">
        {/* Left Side: Logo & Workspace */}
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              CI
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">CompIntel</span>
          </Link>

          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted/50 hover:bg-muted cursor-pointer transition-colors group">
            <Layers className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">Main Workspace</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </div>
        </div>

        {/* Center: Intelligent Search Bar */}
        <div className="flex-1 max-w-2xl px-8">
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-muted-foreground group-focus-within:text-foreground transition-colors">
              <Search className="h-4 w-4" />
            </div>
            <input 
              type="text" 
              placeholder="Search projects, employees, commands..." 
              className="w-full h-11 bg-muted/50 border border-border rounded-xl pl-11 pr-16 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring focus:bg-background transition-all placeholder:text-muted-foreground"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-1 bg-muted border border-border rounded text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
              <Command className="h-2.5 w-2.5" />
              <span>K</span>
            </div>
          </div>
        </div>

        {/* Right Side: Actions & Profile */}
        <div className="flex items-center gap-4">
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
            <Plus className="h-4 w-4" />
            <span>New Project</span>
          </button>

          <div className="h-8 w-px bg-border mx-1 hidden md:block" />

          <div className="flex items-center gap-1">
            <button className="h-10 w-10 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
              <Bell className="h-5 w-5" />
            </button>
            <button className="h-10 w-10 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
              <Sun className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-border ml-1">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-50 to-indigo-100 border border-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold cursor-pointer hover:shadow-md transition-shadow">
              AD
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
