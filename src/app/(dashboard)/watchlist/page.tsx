"use client";

import React, { useState } from 'react';
import { 
  Eye, 
  TrendingUp, 
  TrendingDown, 
  Bell, 
  Building2, 
  Layers, 
  MapPin, 
  Target,
  ArrowRight,
  Plus,
  Settings2,
  Zap
} from 'lucide-react';
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { TrendModal, WatchlistItem } from '@/components/watchlist/trend-modal';

export default function WatchlistPage() {
  const [selectedItem, setSelectedItem] = useState<WatchlistItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const watchlist = [
    { name: 'Google', category: 'Companies', median: 320000, change: '+4.2%', trend: 'up' },
    { name: 'Meta E5', category: 'Levels', median: 375000, change: '+1.5%', trend: 'up' },
    { name: 'San Francisco', category: 'Locations', median: 310000, change: '-0.8%', trend: 'down' },
    { name: 'Staff Engineer', category: 'Roles', median: 485000, change: '+2.4%', trend: 'up' },
  ];

  const recentChanges = [
    { text: 'Google L5 stock packages increased 8%', time: '2h ago' },
    { text: 'Meta E4 total compensation down 2% (Market adjustment)', time: '5h ago' },
    { text: 'Seattle median TC surpassed $280k', time: '1d ago' },
  ];

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Watchlist</h1>
          <p className="text-muted-foreground mt-1 font-medium">Tracking real-time compensation shifts for your target entities.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-10 px-4 bg-card border border-border rounded-xl text-xs font-black uppercase tracking-widest text-foreground hover:bg-muted transition-colors flex items-center gap-2">
             <Settings2 className="h-4 w-4" /> Alert Config
          </button>
          <button className="h-10 px-6 bg-primary text-primary-foreground rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
             <Plus className="h-4 w-4" /> Add Tracking
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Watchlist Cards */}
        <div className="lg:col-span-8 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {watchlist.map((item, i) => (
                <Card 
                  key={i} 
                  className="p-6 border-none shadow-sm bg-card hover:shadow-md transition-all group cursor-pointer relative overflow-hidden"
                  onClick={() => {
                    setSelectedItem(item as WatchlistItem);
                    setIsModalOpen(true);
                  }}
                >
                   <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                            {item.category === 'Companies' && <Building2 className="h-4 w-4" />}
                            {item.category === 'Levels' && <Layers className="h-4 w-4" />}
                            {item.category === 'Locations' && <MapPin className="h-4 w-4" />}
                            {item.category === 'Roles' && <Target className="h-4 w-4" />}
                         </div>
                         <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{item.category}</span>
                      </div>
                      <button className="text-muted-foreground/50 hover:text-primary transition-colors"><Bell className="h-4 w-4" /></button>
                   </div>
                   <h3 className="text-xl font-black text-foreground mb-2">{item.name}</h3>
                   <div className="flex items-end justify-between">
                      <div>
                         <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Median TC</div>
                         <div className="text-2xl font-black text-foreground">{formatCurrency(item.median)}</div>
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-black ${item.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                         {item.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                         {item.change}
                      </div>
                   </div>
                   <div className="absolute top-0 right-0 p-2 opacity-[0.03]">
                      <Eye className="h-16 w-16 -rotate-12" />
                   </div>
                </Card>
              ))}
           </div>

           <Card className="p-8 border-none shadow-sm bg-primary text-primary-foreground overflow-hidden relative">
              <div className="relative z-10">
                 <h3 className="text-xl font-black mb-2">Market Volatility Alert</h3>
                 <p className="text-sm font-medium opacity-90 max-w-md mb-6">Stock refreshers across FAANG firms are currently highly volatile. We recommend setting tighter alert thresholds for your tracked levels.</p>
                 <button className="px-6 py-2.5 bg-background text-primary rounded-xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-background/90 transition-colors">Optimize My Alerts</button>
              </div>
              <Zap className="absolute -bottom-6 -right-6 h-32 w-32 text-white/5 rotate-12" />
           </Card>
        </div>

        {/* Changes Feed (Right) */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="p-6 border-none shadow-sm bg-card">
              <h3 className="text-lg font-black text-foreground mb-6">Market Activity</h3>
              <div className="space-y-6">
                 {recentChanges.map((change, i) => (
                   <div key={i} className="flex gap-4 group cursor-pointer">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0 group-hover:scale-150 transition-transform" />
                      <div>
                         <p className="text-xs font-bold text-foreground leading-relaxed">{change.text}</p>
                         <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 block">{change.time}</span>
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-8 py-3 border border-border rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-muted hover:text-foreground transition-all flex items-center justify-center gap-2">
                 Full Change Log <ArrowRight className="h-3 w-3" />
              </button>
           </Card>

           <Card className="p-6 border-none shadow-sm bg-muted/50">
              <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4">Tracking Insights</h3>
              <div className="space-y-4">
                 <div className="p-3 bg-card rounded-xl shadow-sm border border-border">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-1">High Velocity</span>
                    <p className="text-[11px] font-bold text-muted-foreground">You are tracking 3 entities in San Francisco. Bangalore data is growing 3x faster.</p>
                 </div>
                 <div className="p-3 bg-card rounded-xl shadow-sm border border-border">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-1">Efficiency</span>
                    <p className="text-[11px] font-bold text-muted-foreground">Your watchlist coverage is currently <span className="text-emerald-600">82%</span> of Tier 1 tech levels.</p>
                 </div>
              </div>
           </Card>
        </div>
      </div>

      <TrendModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedItem}
      />
    </div>
  );
}
