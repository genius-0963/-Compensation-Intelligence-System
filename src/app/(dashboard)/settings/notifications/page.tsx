"use client";

import React from 'react';
import { Card } from "@/components/ui/card";
import { Eye, Mail, Zap, Smartphone } from 'lucide-react';

export default function NotificationsSettingsPage() {
  return (
    <div className="space-y-10 animate-fade-up">
       <Card className="p-10 border-none shadow-sm bg-card transition-colors">
         <h3 className="text-xl font-black text-foreground mb-6">Market Alerts</h3>
         <div className="space-y-4">
            {[
              { title: 'Watchlist Changes', desc: 'Notify me when entities in my watchlist update.', icon: Eye },
              { title: 'Market Reports', desc: 'Weekly deep-dives into global compensation trends.', icon: Mail },
              { title: 'Level Benchmarks', desc: 'Alert me when equivalent levels are updated.', icon: Zap },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-background rounded-2xl group cursor-pointer hover:bg-card border border-transparent hover:border-blue-100 dark:hover:border-slate-800 transition-all shadow-sm">
                 <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                       <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                       <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
                       <p className="text-xs text-muted-foreground font-medium">{item.desc}</p>
                    </div>
                 </div>
                 <div className="h-6 w-11 bg-blue-600 rounded-full flex items-center px-1">
                    <div className="h-4 w-4 bg-white rounded-full shadow-sm ml-auto" />
                 </div>
              </div>
            ))}
         </div>

         <div className="pt-10 border-t border-border mt-10">
            <h3 className="text-xl font-black text-foreground mb-6">Device Configuration</h3>
            <div className="flex items-center justify-between p-6 border border-border rounded-[28px] bg-background">
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                     <Smartphone className="h-6 w-6" />
                  </div>
                  <div>
                     <h4 className="text-sm font-bold text-foreground">Mobile Push Notifications</h4>
                     <p className="text-xs text-muted-foreground font-medium">Currently enabled for iPhone 15 Pro</p>
                  </div>
               </div>
               <button className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Manage</button>
            </div>
         </div>
       </Card>
    </div>
  );
}
