"use client";

import React from 'react';
import { Card } from "@/components/ui/card";
import { LifeBuoy, BookOpen, MessageSquare, Bug, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function SupportSettingsPage() {
  const resources = [
    { title: 'Documentation', desc: 'Read guides on compensation analysis.', icon: BookOpen },
    { title: 'Contact Support', desc: 'Get help from our Enterprise team.', icon: MessageSquare },
    { title: 'Report a Bug', desc: 'Found an issue? Let us know.', icon: Bug },
  ];

  return (
    <Card className="p-10 border-none shadow-sm bg-card transition-colors animate-fade-up min-h-[600px]">
       <div className="flex items-center gap-4 mb-8">
          <div className="h-16 w-16 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
             <LifeBuoy className="h-8 w-8" />
          </div>
          <div>
             <h3 className="text-2xl font-black text-foreground">Enterprise Support</h3>
             <p className="text-sm text-muted-foreground font-medium">We're here to help you get the most out of the platform.</p>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {resources.map((res, i) => (
             <div key={i} className="p-6 border border-border rounded-2xl bg-background hover:border-blue-500/20 transition-all cursor-pointer group">
                <res.icon className="h-6 w-6 text-muted-foreground group-hover:text-blue-500 transition-colors mb-4" />
                <h4 className="text-sm font-bold text-foreground mb-1 flex items-center justify-between">
                   {res.title}
                   <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-xs text-muted-foreground">{res.desc}</p>
             </div>
          ))}
       </div>

       <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-md">
             <h4 className="text-lg font-black mb-2">Dedicated Account Manager</h4>
             <p className="text-sm font-medium opacity-90 mb-6">As an Enterprise customer, you have direct access to a compensation strategy expert.</p>
             <button className="px-6 py-3 bg-white text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition-colors shadow-lg">
                Schedule a Call
             </button>
          </div>
          <LifeBuoy className="absolute -right-10 -bottom-10 h-64 w-64 text-white opacity-10 rotate-12 pointer-events-none" />
       </div>
    </Card>
  );
}
