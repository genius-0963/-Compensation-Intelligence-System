'use client';

import React from 'react';
import { Search, Bell, User, Zap, Bookmark, Command } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
    <header className="h-16 border-b border-gray-100 bg-white/80 backdrop-blur-md flex items-center px-8 justify-between sticky top-0 z-40">
      {/* Left: Page Title */}
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-black text-gray-900 tracking-tight whitespace-nowrap">{getPageTitle()}</h2>
        <div className="h-4 w-px bg-gray-100 mx-2 hidden lg:block" />
      </div>

      {/* Center: Global Search */}
      <div className="flex-1 max-w-2xl px-8">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search companies, levels, locations, roles..." 
            className="h-10 w-full bg-gray-50 border border-gray-100 rounded-xl pl-11 pr-16 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 focus:bg-white transition-all placeholder:text-gray-400"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-1 bg-gray-200/50 border border-gray-200 rounded text-[10px] font-bold text-gray-500 uppercase tracking-tight">
            <Command className="h-2.5 w-2.5" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <Link href="/compare" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all shadow-lg active:scale-95">
          <Zap className="h-3 w-3 text-amber-400" />
          Quick Compare
        </Link>
        
        <div className="flex items-center gap-1">
          <button className="h-10 w-10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-all">
            <Bookmark className="h-5 w-5" />
          </button>
          <button className="h-10 w-10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-all relative">
            <Bell className="h-5 w-5" />
            <div className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 border-2 border-white rounded-full" />
          </button>
        </div>

        <div className="flex items-center gap-3 pl-2 border-l border-gray-100 ml-1">
          <div className="flex flex-col items-end hidden md:flex">
            <span className="text-xs font-black text-gray-900 leading-none">Alex Dawson</span>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase tracking-widest">Pro Member</span>
            </div>
          </div>
          <div className="h-9 w-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 text-xs font-black cursor-pointer hover:shadow-md transition-shadow">
            AD
          </div>
        </div>
      </div>
    </header>
  );
}
