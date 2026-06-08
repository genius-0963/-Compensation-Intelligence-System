"use client";

import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Download, Trash2, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function PrivacySettingsPage() {
  const [deleteStep, setDeleteStep] = useState(0);

  return (
    <div className="space-y-8 animate-fade-up">
       <Card className="p-10 border-none shadow-sm bg-card transition-colors">
          <h3 className="text-xl font-black text-foreground mb-6 flex items-center gap-3">
             <ShieldAlert className="h-6 w-6 text-blue-500" />
             Data & Privacy
          </h3>
          <p className="text-sm text-muted-foreground mb-8">Manage how your data is used and exported across the Compensation Intelligence Platform.</p>

          <div className="space-y-6">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border border-border rounded-2xl bg-background gap-4">
                <div>
                   <h4 className="text-sm font-bold text-foreground">Profile Visibility</h4>
                   <p className="text-xs text-muted-foreground mt-1">Control whether your profile appears in enterprise leaderboards.</p>
                </div>
                <div className="flex bg-card border border-border rounded-xl p-1">
                   <button className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-600 dark:text-blue-400">Private</button>
                   <button className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground">Public</button>
                </div>
             </div>

             <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border border-border rounded-2xl bg-background gap-4">
                <div>
                   <h4 className="text-sm font-bold text-foreground">Export Account Data</h4>
                   <p className="text-xs text-muted-foreground mt-1">Download all your compensation entries, comparisons, and activity in JSON format.</p>
                </div>
                <button className="h-10 px-6 border border-border text-foreground bg-card rounded-xl text-xs font-black uppercase tracking-widest hover:bg-muted transition-colors flex items-center gap-2">
                   <Download className="h-4 w-4" /> Export JSON
                </button>
             </div>
          </div>
       </Card>

       <Card className="p-10 border border-red-500/20 shadow-sm bg-red-500/5 dark:bg-red-500/5 transition-colors">
          <h3 className="text-xl font-black text-red-600 dark:text-red-500 mb-2 flex items-center gap-3">
             <AlertTriangle className="h-6 w-6" />
             Danger Zone
          </h3>
          <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-8 font-medium">Permanently delete your account and all associated data. This action cannot be undone.</p>

          <div className="p-6 border border-red-200 dark:border-red-900/50 rounded-2xl bg-white dark:bg-black/50">
             {deleteStep === 0 ? (
                <button 
                  onClick={() => setDeleteStep(1)}
                  className="h-12 px-8 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-500/20"
                >
                   Delete Account
                </button>
             ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                   <p className="text-sm font-bold text-foreground">Are you absolutely sure?</p>
                   <p className="text-xs text-muted-foreground">This will immediately delete all your data, including saved companies and compensation logs.</p>
                   <div className="flex items-center gap-4">
                      <button className="h-10 px-6 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-colors flex items-center gap-2">
                         <Trash2 className="h-4 w-4" /> Confirm Deletion
                      </button>
                      <button 
                        onClick={() => setDeleteStep(0)}
                        className="h-10 px-6 border border-border text-foreground bg-card rounded-xl text-xs font-black uppercase tracking-widest hover:bg-muted transition-colors"
                      >
                         Cancel
                      </button>
                   </div>
                </div>
             )}
          </div>
       </Card>
    </div>
  );
}
