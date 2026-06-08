"use client";

import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Settings2, Globe, DollarSign, BrainCircuit, Loader2, Save } from 'lucide-react';

export default function PreferencesSettingsPage() {
  const [prefs, setPrefs] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/user/preferences').then(r => r.json()).then(d => {
      if (d.success) setPrefs(d.data);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs)
      });
      const data = await res.json();
      if (data.success) setPrefs(data.data);
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  if (!prefs) return <div className="p-20 text-center text-muted-foreground animate-pulse text-xs font-black uppercase tracking-widest">Loading Preferences...</div>;

  return (
    <Card className="p-10 border-none shadow-sm bg-card transition-colors animate-fade-up">
       <div className="space-y-10">
          <div>
             <h3 className="text-xl font-black text-foreground mb-6 flex items-center gap-3">
                <Globe className="h-5 w-5 text-blue-500" />
                Localization
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Default Currency</label>
                   <select 
                      value={prefs.defaultCurrency} 
                      onChange={e => setPrefs({...prefs, defaultCurrency: e.target.value})}
                      className="w-full h-12 bg-background border border-border rounded-xl px-4 text-sm font-bold text-foreground focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
                   >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="INR">INR (₹)</option>
                      <option value="SGD">SGD (S$)</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Default Location</label>
                   <input 
                      type="text" 
                      value={prefs.defaultLocation || ''} 
                      onChange={e => setPrefs({...prefs, defaultLocation: e.target.value})}
                      placeholder="e.g. San Francisco, CA"
                      className="w-full h-12 bg-background border border-border rounded-xl px-4 text-sm font-bold text-foreground focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm" 
                   />
                </div>
             </div>
          </div>

          <div className="pt-8 border-t border-border">
             <h3 className="text-xl font-black text-foreground mb-6 flex items-center gap-3">
                <BrainCircuit className="h-5 w-5 text-indigo-500" />
                AI Advisor Configuration
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Advisor Mode</label>
                   <select 
                      defaultValue="comprehensive"
                      className="w-full h-12 bg-background border border-border rounded-xl px-4 text-sm font-bold text-foreground focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all shadow-sm"
                   >
                      <option value="comprehensive">Comprehensive Analysis</option>
                      <option value="concise">Concise Summary</option>
                      <option value="aggressive">Aggressive Negotiation</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Insight Frequency</label>
                   <select 
                      defaultValue="always"
                      className="w-full h-12 bg-background border border-border rounded-xl px-4 text-sm font-bold text-foreground focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all shadow-sm"
                   >
                      <option value="always">Always Suggest</option>
                      <option value="on-demand">On Demand Only</option>
                   </select>
                </div>
             </div>
          </div>

          <div className="pt-10 border-t border-border flex items-center justify-end">
             <button 
               onClick={handleSave}
               disabled={saving}
               className="h-12 px-10 bg-foreground text-background rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-foreground/90 transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-2"
             >
               {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
               Save Preferences
             </button>
          </div>
       </div>
    </Card>
  );
}
