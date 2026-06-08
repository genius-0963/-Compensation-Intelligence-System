"use client";

import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { CreditCard, Zap, Download, Check } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function BillingSettingsPage() {
  const [billing, setBilling] = useState<any>(null);

  useEffect(() => {
    fetch('/api/user/billing').then(r => r.json()).then(d => {
      if (d.success) setBilling(d.data);
    });
  }, []);

  if (!billing) return <div className="p-20 text-center text-muted-foreground animate-pulse text-xs font-black uppercase tracking-widest">Loading Billing...</div>;

  return (
    <div className="space-y-8 animate-fade-up">
       <Card className="p-10 border-none shadow-sm bg-card transition-colors">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
             <div>
                <h3 className="text-xl font-black text-foreground">Enterprise Plan</h3>
                <p className="text-sm text-muted-foreground mt-1">You are currently on the Enterprise subscription.</p>
             </div>
             <div className="text-left md:text-right">
                <div className="text-3xl font-black text-foreground">{formatCurrency(billing.amount / 100)}<span className="text-sm text-muted-foreground font-medium">/{billing.interval}</span></div>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1 uppercase tracking-widest">Active until {new Date(billing.renewalDate).toLocaleDateString()}</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
             <div className="space-y-4">
                <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4">Included Features</h4>
                {billing.features.map((f: string, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                     <div className="h-5 w-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3" />
                     </div>
                     <span className="text-sm font-bold text-foreground">{f}</span>
                  </div>
                ))}
             </div>
             
             <div className="p-6 border border-border rounded-2xl bg-background">
                <div className="flex items-center justify-between mb-4">
                   <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest">Seat Usage</h4>
                   <span className="text-xs font-bold text-foreground">3 / {billing.seats} Seats</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-4">
                   <div className="h-full bg-blue-600 rounded-full w-[60%]" />
                </div>
                <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors">Buy More Seats</button>
             </div>
          </div>

          <div className="pt-10 border-t border-border flex gap-4">
             <button className="h-10 px-6 bg-foreground text-background rounded-xl text-xs font-black uppercase tracking-widest hover:bg-foreground/90 transition-colors">
                Manage Subscription in Stripe
             </button>
             <button className="h-10 px-6 border border-border text-foreground bg-card rounded-xl text-xs font-black uppercase tracking-widest hover:bg-muted transition-colors">
                Downgrade
             </button>
          </div>
       </Card>

       <Card className="p-10 border-none shadow-sm bg-card transition-colors">
          <h3 className="text-xl font-black text-foreground mb-6">Payment Methods</h3>
          <div className="flex items-center justify-between p-6 border border-border rounded-2xl bg-background">
             <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                   <CreditCard className="h-6 w-6" />
                </div>
                <div>
                   <h4 className="text-sm font-bold text-foreground">Visa ending in 4242</h4>
                   <p className="text-xs text-muted-foreground font-medium mt-1">Expires 12/2028</p>
                </div>
             </div>
             <button className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Update</button>
          </div>
       </Card>
    </div>
  );
}
