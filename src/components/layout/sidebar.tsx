'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BarChart3, 
  Building2, 
  TrendingUp, 
  Scale, 
  MapPin, 
  Layers, 
  Bookmark, 
  Eye, 
  Settings,
  ChevronLeft,
  Search,
  Plus,
  Bell,
  User,
  Zap
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Salary Explorer', href: '/explorer', icon: BarChart3 },
    { name: 'Companies', href: '/companies', icon: Building2 },
    { name: 'Analytics', href: '/analytics', icon: TrendingUp },
    { name: 'Comp Compare', href: '/compare', icon: Scale },
    { name: 'Locations', href: '/locations', icon: MapPin },
    { name: 'Levels', href: '/levels', icon: Layers },
  ];

  const secondaryItems = [
    { name: 'Saved', href: '/saved', icon: Bookmark },
    { name: 'Watchlist', href: '/watchlist', icon: Eye },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className={`bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Logo Section */}
      <div className="h-16 flex items-center px-6 border-b border-gray-50">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
            CI
          </div>
          {!isCollapsed && (
            <span className="text-lg font-bold tracking-tight text-gray-900 truncate">CompIntel</span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all group ${
                  active 
                    ? 'bg-blue-50 text-blue-600 font-bold' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className={`h-5 w-5 shrink-0 ${active ? 'text-blue-600' : 'group-hover:text-blue-600'}`} />
                {!isCollapsed && <span className="text-sm">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div>
          {!isCollapsed && <h4 className="px-3 mb-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Personal</h4>}
          <nav className="space-y-1">
            {secondaryItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all group ${
                    active 
                      ? 'bg-blue-50 text-blue-600 font-bold' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`h-5 w-5 shrink-0 ${active ? 'text-blue-600' : 'group-hover:text-blue-600'}`} />
                  {!isCollapsed && <span className="text-sm">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="h-12 border-t border-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
      >
        <ChevronLeft className={`h-5 w-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
      </button>
    </aside>
  );
}
