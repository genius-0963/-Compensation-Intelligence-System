"use client";

import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Activity, Database, TrendingUp, Compass, BarChart } from 'lucide-react';

export default function ActivitySettingsPage() {
  const [activity, setActivity] = useState<any>(null);

  useEffect(() => {
    fetch('/api/user/activity').then(r => r.json()).then(d => {
      if (d.success) setActivity(d.data);
    });
  }, []);

  if (!activity) return <div className="p-20 text-center text-muted-foreground animate-pulse text-xs font-black uppercase tracking-widest">Loading Activity...</div>;

  const stats = [
     { label: 'Saved Companies', value: activity.stats.savedCompanies, icon: Database, color: 'text-blue-500' },
     { label: 'Saved Levels', value: activity.stats.savedLevels, icon: TrendingUp, color: 'text-emerald-500' },
     { label: 'Saved Locations', value: activity.stats.savedLocations, icon: Compass, color: 'text-indigo-500' },
     { label: 'Submissions', value: activity.stats.submissions, icon: BarChart, color: 'text-amber-500' },
  ];

  return (
    <div className="space-y-8 animate-fade-up">
       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
             <Card key={i} className="p-6 border-none shadow-sm bg-card flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02]">
                <div className={`h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center mb-4 ${stat.color}`}>
                   <stat.icon className="h-5 w-5" />
                </div>
                <div className="text-2xl font-black text-foreground">{stat.value}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">{stat.label}</div>
             </Card>
          ))}
       </div>

       <Card className="p-10 border-none shadow-sm bg-card transition-colors">
          <h3 className="text-xl font-black text-foreground mb-6 flex items-center gap-3">
             <Activity className="h-6 w-6 text-blue-500" />
             Activity Timeline
          </h3>

          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
             {activity.timeline.length > 0 ? activity.timeline.map((item: any, i: number) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                   <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-card bg-blue-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <Activity className="h-4 w-4" />
                   </div>
                   <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-border bg-background shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                         <h4 className="text-sm font-bold text-foreground capitalize">{item.action.replace(/_/g, ' ')}</h4>
                         <time className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</time>
                      </div>
                      <p className="text-xs text-muted-foreground font-medium">Logged system activity record.</p>
                   </div>
                </div>
             )) : (
                <div className="text-center text-sm font-medium text-muted-foreground py-10 relative z-10 bg-card rounded-xl">
                   No recent activity logs found.
                </div>
             )}
          </div>
       </Card>
    </div>
  );
}
