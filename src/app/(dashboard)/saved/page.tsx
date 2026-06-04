"use client";

import React, { useState } from 'react';
import { 
  Bookmark, 
  Search, 
  Building2, 
  Scale, 
  MapPin, 
  Layers, 
  MoreVertical, 
  ExternalLink, 
  Trash2, 
  Share2,
  Calendar,
  Clock
} from 'lucide-react';
import { Card } from "@/components/ui/card";

export default function SavedPage() {
  const [activeTab, setActiveTab] = useState('searches');

  const tabs = [
    { id: 'searches', label: 'Searches', icon: Search },
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'levels', label: 'Levels', icon: Layers },
    { id: 'comparisons', label: 'Comparisons', icon: Scale },
    { id: 'locations', label: 'Locations', icon: MapPin },
  ];

  const mockSaved = [
    { title: 'Google L5 vs Meta E5 - Bangalore', date: 'Oct 12, 2024', type: 'comparisons' },
    { title: 'Senior SE - San Francisco (High Stock)', date: 'Oct 10, 2024', type: 'searches' },
    { title: 'Netflix Entertainment', date: 'Oct 08, 2024', type: 'companies' },
    { title: 'L7 Principal Track', date: 'Oct 05, 2024', type: 'levels' },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Saved Research</h1>
        <p className="text-gray-500 mt-1 font-medium">Access your bookmarked comparisons, searches, and benchmarks.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-gray-100/50 rounded-2xl w-fit overflow-x-auto">
        {tabs.map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-4 animate-fade-up">
        {mockSaved.filter(item => activeTab === 'all' || item.type === activeTab || activeTab === 'searches').map((item, i) => (
          <Card key={i} className="p-6 border-none shadow-sm bg-white hover:shadow-md transition-all group flex items-center justify-between">
            <div className="flex items-center gap-6">
               <div className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors">
                  {tabs.find(t => t.id === item.type)?.icon && React.createElement(tabs.find(t => t.id === item.type)!.icon, { className: 'h-6 w-6' })}
               </div>
               <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                  <div className="flex items-center gap-4 mt-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                     <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {item.date}</div>
                     <div className="flex items-center gap-1"><Clock className="h-3 w-3" /> Last opened 2d ago</div>
                  </div>
               </div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><ExternalLink className="h-4 w-4" /></button>
               <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Share2 className="h-4 w-4" /></button>
               <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="h-4 w-4" /></button>
               <div className="h-6 w-px bg-gray-100 mx-1" />
               <button className="p-2 text-gray-400 hover:text-gray-900 rounded-lg transition-all"><MoreVertical className="h-4 w-4" /></button>
            </div>
          </Card>
        ))}
        
        {mockSaved.filter(item => item.type === activeTab).length === 0 && activeTab !== 'searches' && (
          <div className="py-20 text-center space-y-4">
             <div className="h-16 w-16 bg-gray-50 rounded-[24px] flex items-center justify-center mx-auto text-gray-300">
                <Bookmark className="h-8 w-8" />
             </div>
             <div>
                <h3 className="font-black text-gray-900">No saved {activeTab} yet</h3>
                <p className="text-sm text-gray-400 max-w-xs mx-auto mt-1">Bookmark items while you explore the platform to see them here.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
