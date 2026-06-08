"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  User, 
  Bell, 
  Lock, 
  CreditCard, 
  Settings2,
  Globe,
  ShieldAlert,
  Activity,
  LifeBuoy,
  Zap,
  ChevronRight
} from 'lucide-react';
import { Card } from "@/components/ui/card";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [billing, setBilling] = useState<any>(null);

  useEffect(() => {
    fetch('/api/user/billing').then(r => r.json()).then(d => {
      if (d.success) setBilling(d.data);
    });
  }, []);

  const tabs = [
    { id: '/settings/profile', label: 'Profile', icon: User },
    { id: '/settings/notifications', label: 'Notifications', icon: Bell },
    { id: '/settings/security', label: 'Security', icon: Lock },
    { id: '/settings/billing', label: 'Billing', icon: CreditCard },
    { id: '/settings/preferences', label: 'Preferences', icon: Settings2 },
    { id: '/settings/accounts', label: 'Connected Accounts', icon: Globe },
    { id: '/settings/privacy', label: 'Data & Privacy', icon: ShieldAlert },
    { id: '/settings/activity', label: 'Usage & Activity', icon: Activity },
    { id: '/settings/support', label: 'Support', icon: LifeBuoy },
  ];

  return (
    <div className="max-w-[1440px] mx-auto space-y-8 pb-20 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-foreground tracking-tight transition-colors">Enterprise Settings</h1>
        <p className="text-muted-foreground mt-1 font-medium transition-colors">Manage your profile, security, preferences, and subscription.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar Nav */}
        <div className="w-full lg:w-[300px] shrink-0 space-y-1">
           {tabs.map((tab) => {
             const isActive = pathname.startsWith(tab.id);
             return (
               <Link 
                href={tab.id}
                key={tab.id}
                className={`w-full px-4 py-3 rounded-xl text-xs font-black flex items-center gap-3 transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-card text-blue-600 dark:text-blue-500 shadow-sm border-r-4 border-blue-600' 
                    : 'text-muted-foreground hover:bg-card/50 hover:text-foreground'
                }`}
               >
                 <tab.icon className="h-4 w-4" />
                 {tab.label}
               </Link>
             );
           })}

           {/* Enterprise Plan Card */}
           {billing && (
             <Card className="mt-8 p-6 border-none shadow-premium bg-blue-600 text-white relative overflow-hidden transition-all">
                <div className="relative z-10">
                   <h4 className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">Current Plan</h4>
                   <div className="text-xl font-black mb-1 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-amber-400 fill-amber-400" />
                      {billing.plan}
                   </div>
                   <p className="text-[10px] opacity-80 mb-4 font-semibold uppercase tracking-widest">Renews {new Date(billing.renewalDate).toLocaleDateString()}</p>
                   
                   <div className="space-y-2 mb-6">
                      <div className="flex items-center justify-between text-xs font-black">
                         <span>Seats Used</span>
                         <span>3 / {billing.seats}</span>
                      </div>
                      <div className="h-1.5 w-full bg-blue-800 rounded-full overflow-hidden">
                         <div className="h-full bg-white rounded-full w-[60%]" />
                      </div>
                   </div>

                   <button className="w-full py-3 bg-white text-blue-600 hover:bg-blue-50 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg">
                      Manage Subscription
                   </button>
                </div>
                <Zap className="absolute -bottom-10 -right-10 h-40 w-40 text-blue-700/50 rotate-12" />
             </Card>
           )}
        </div>

        {/* Right Content Area */}
        <div className="flex-1 min-w-0">
           {children}
        </div>
      </div>
    </div>
  );
}
