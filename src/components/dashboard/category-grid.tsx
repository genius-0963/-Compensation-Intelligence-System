'use client';

import React from 'react';
import { 
  Layout, 
  Server, 
  Database, 
  Cpu, 
  Globe, 
  ShieldCheck, 
  BarChart3, 
  Smartphone,
  Cloud,
  Code2
} from 'lucide-react';

export function CategoryGrid() {
  const categories = [
    { name: 'Frontend', icon: Layout, color: 'from-blue-500 to-cyan-400', stats: '124 Projects' },
    { name: 'Backend', icon: Server, color: 'from-indigo-500 to-blue-500', stats: '86 Projects' },
    { name: 'Full Stack', icon: Code2, color: 'from-violet-500 to-purple-500', stats: '42 Projects' },
    { name: 'AI Apps', icon: Cpu, color: 'from-rose-500 to-orange-400', stats: '18 Projects' },
    { name: 'Mobile', icon: Smartphone, color: 'from-emerald-500 to-teal-400', stats: '24 Projects' },
    { name: 'Databases', icon: Database, color: 'from-amber-500 to-orange-500', stats: '12 Instances' },
    { name: 'DevOps', icon: ShieldCheck, color: 'from-blue-600 to-indigo-600', stats: 'Active' },
    { name: 'Cloud', icon: Cloud, color: 'from-sky-500 to-blue-400', stats: '99.9% Uptime' },
    { name: 'Analytics', icon: BarChart3, color: 'from-fuchsia-500 to-pink-500', stats: 'Real-time' },
    { name: 'APIs', icon: Globe, color: 'from-green-500 to-emerald-500', stats: '8 Endpoints' },
  ];

  return (
    <div className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Explore Stack</h2>
          <p className="text-sm text-gray-500 mt-1">Select a category to view specialized templates and projects.</p>
        </div>
        <button className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">View All Categories →</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {categories.map((cat, i) => (
          <div 
            key={i}
            className="group relative bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-premium transition-all hover:-translate-y-1 cursor-pointer overflow-hidden"
          >
            {/* Hover Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-[0.03] transition-opacity`} />
            
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white mb-4 shadow-lg shadow-gray-200 group-hover:scale-110 transition-transform`}>
              <cat.icon className="h-6 w-6" />
            </div>
            
            <h3 className="font-bold text-gray-900 mb-1">{cat.name}</h3>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{cat.stats}</p>
            
            {/* Subtle corner ornament */}
            <div className="absolute -bottom-2 -right-2 w-12 h-12 border-2 border-gray-50 rounded-full group-hover:scale-150 transition-transform duration-500" />
          </div>
        ))}
      </div>
    </div>
  );
}
