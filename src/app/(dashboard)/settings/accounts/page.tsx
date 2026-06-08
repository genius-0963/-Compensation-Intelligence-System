"use client";

import React from 'react';
import { Card } from "@/components/ui/card";
import { Code, Briefcase, Mail } from 'lucide-react';

export default function AccountsSettingsPage() {
  const accounts = [
    { provider: 'Google', icon: Mail, connected: true, username: 'alex@dawson.dev', lastSynced: 'Today at 10:42 AM', color: 'text-red-500' },
    { provider: 'GitHub', icon: Code, connected: true, username: 'alexdawson', lastSynced: 'Yesterday', color: 'text-foreground' },
    { provider: 'LinkedIn', icon: Briefcase, connected: false, username: null, lastSynced: null, color: 'text-blue-600' },
  ];

  return (
    <Card className="p-10 border-none shadow-sm bg-card transition-colors animate-fade-up min-h-[600px]">
       <h3 className="text-xl font-black text-foreground mb-6">Connected Accounts</h3>
       <p className="text-sm text-muted-foreground mb-10">Connect your accounts to enable single sign-on and sync your professional profile data automatically.</p>
       
       <div className="space-y-4">
          {accounts.map((acc, i) => (
             <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border border-border rounded-2xl bg-background gap-4 transition-all hover:border-blue-500/20">
                <div className="flex items-center gap-4">
                   <div className="h-12 w-12 rounded-xl bg-card border border-border flex items-center justify-center shadow-sm">
                      <acc.icon className={`h-6 w-6 ${acc.color}`} />
                   </div>
                   <div>
                      <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                         {acc.provider}
                         {acc.connected && <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] uppercase tracking-widest rounded">Connected</span>}
                      </h4>
                      {acc.connected ? (
                         <p className="text-xs text-muted-foreground font-medium mt-1">{acc.username} • Last synced {acc.lastSynced}</p>
                      ) : (
                         <p className="text-xs text-muted-foreground font-medium mt-1">Not connected</p>
                      )}
                   </div>
                </div>
                
                <button className={`h-10 px-6 rounded-xl text-xs font-black uppercase tracking-widest transition-colors ${
                   acc.connected 
                     ? 'border border-border text-muted-foreground hover:text-red-500 hover:border-red-500/50 bg-card' 
                     : 'bg-foreground text-background hover:bg-foreground/90'
                }`}>
                   {acc.connected ? 'Disconnect' : 'Connect'}
                </button>
             </div>
          ))}
       </div>
    </Card>
  );
}
