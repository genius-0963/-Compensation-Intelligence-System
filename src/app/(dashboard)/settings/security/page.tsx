"use client";

import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Key, ShieldCheck, Monitor, LogOut, Loader2 } from 'lucide-react';

export default function SecuritySettingsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState(false);

  useEffect(() => {
    fetch('/api/user/sessions').then(r => r.json()).then(d => {
      if (d.success) setSessions(d.data);
      setLoading(false);
    });
  }, []);

  const handleRevokeAll = async () => {
    setRevoking(true);
    try {
      const res = await fetch('/api/user/sessions', { method: 'DELETE' });
      if (res.ok) {
         setSessions(sessions.filter(s => s.isCurrent));
      }
    } catch (e) {
      console.error(e);
    }
    setRevoking(false);
  };

  return (
    <div className="space-y-8 animate-fade-up">
       <Card className="p-10 border-none shadow-sm bg-card transition-colors">
         <h3 className="text-xl font-black text-foreground mb-6 flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-emerald-500" />
            Password & Authentication
         </h3>
         
         <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border border-border rounded-2xl bg-background gap-4">
               <div>
                  <h4 className="text-sm font-bold text-foreground">Change Password</h4>
                  <p className="text-xs text-muted-foreground mt-1">Ensure your account is using a long, random password.</p>
               </div>
               <button className="h-10 px-6 bg-foreground text-background rounded-xl text-xs font-black uppercase tracking-widest hover:bg-foreground/90 transition-colors">
                  Update
               </button>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border border-border rounded-2xl bg-background gap-4">
               <div>
                  <h4 className="text-sm font-bold text-foreground">Two-Factor Authentication</h4>
                  <p className="text-xs text-muted-foreground mt-1">Add an extra layer of security to your account.</p>
               </div>
               <button className="h-10 px-6 border border-border text-foreground bg-card rounded-xl text-xs font-black uppercase tracking-widest hover:bg-muted transition-colors">
                  Enable 2FA
               </button>
            </div>
         </div>
       </Card>

       <Card className="p-10 border-none shadow-sm bg-card transition-colors">
         <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-foreground flex items-center gap-3">
               <Monitor className="h-6 w-6 text-blue-500" />
               Active Sessions
            </h3>
            {sessions.length > 1 && (
               <button 
                  onClick={handleRevokeAll}
                  disabled={revoking}
                  className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors flex items-center gap-2"
               >
                  {revoking ? <Loader2 className="h-3 w-3 animate-spin" /> : <LogOut className="h-3 w-3" />}
                  Revoke All Other Sessions
               </button>
            )}
         </div>

         {loading ? (
            <div className="py-10 text-center text-muted-foreground animate-pulse text-xs font-black uppercase tracking-widest">Loading Sessions...</div>
         ) : (
            <div className="space-y-4">
               {sessions.length > 0 ? sessions.map(session => (
                 <div key={session.id} className="flex items-center justify-between p-6 border border-border rounded-2xl bg-background">
                    <div>
                       <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                          {session.os || 'Unknown OS'} • {session.browser || 'Unknown Browser'}
                          {session.isCurrent && <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] uppercase tracking-widest rounded">Current</span>}
                       </h4>
                       <p className="text-xs text-muted-foreground mt-1">{session.ipAddress || 'Unknown IP'} • {session.location || 'Unknown Location'}</p>
                    </div>
                    {!session.isCurrent && (
                       <button className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors">Revoke</button>
                    )}
                 </div>
               )) : (
                 <div className="p-6 border border-border rounded-2xl bg-background text-center text-sm font-medium text-muted-foreground">
                    No active sessions found.
                 </div>
               )}
            </div>
         )}
       </Card>
    </div>
  );
}
