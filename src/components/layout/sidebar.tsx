'use client';
import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, UserPlus, Layers, BarChart3, FileText } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 border-r border-white/5 hidden md:flex flex-col">
      <div className="p-4 border-b border-white/5 flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-violet-600 flex items-center justify-center text-white font-bold">
          CI
        </div>
        <h2 className="text-xl font-semibold text-slate-50">CompIntel</h2>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-violet-600/10 text-violet-400">
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </Link>
        <Link href="/employees" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors">
          <Users className="h-5 w-5" />
          Employees
        </Link>
        <Link href="/candidates" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors">
          <UserPlus className="h-5 w-5" />
          Candidates
        </Link>
        <Link href="/bands" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors">
          <Layers className="h-5 w-5" />
          Comp Bands
        </Link>
        <Link href="/offers" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors">
          <FileText className="h-5 w-5" />
          Offers
        </Link>
      </nav>
    </aside>
  );
}
