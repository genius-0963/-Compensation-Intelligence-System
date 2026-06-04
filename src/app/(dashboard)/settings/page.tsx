"use client";

import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Monitor, 
  Lock, 
  CreditCard, 
  Settings2,
  ChevronRight,
  Globe,
  Camera,
  Check,
  Zap,
  Mail,
  Smartphone,
  Eye
} from 'lucide-react';

import { Card } from "@/components/ui/card";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Monitor },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'preferences', label: 'Preferences', icon: Settings2 },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Account Settings</h1>
        <p className="text-gray-500 mt-1 font-medium">Manage your profile, preferences, and enterprise subscription.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 space-y-1">
           {tabs.map((tab) => (
             <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full px-4 py-3 rounded-xl text-xs font-black flex items-center gap-3 transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-blue-600 shadow-sm border-r-4 border-blue-600' 
                  : 'text-gray-500 hover:bg-white hover:text-gray-900'
              }`}
             >
               <tab.icon className="h-4 w-4" />
               {tab.label}
             </button>
           ))}

           <Card className="mt-8 p-6 border-none shadow-sm bg-blue-600 text-white relative overflow-hidden">
              <div className="relative z-10">
                 <h4 className="text-xs font-black uppercase tracking-widest mb-1 opacity-80">Current Plan</h4>
                 <div className="text-xl font-black mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-400 fill-amber-400" />
                    Pro Monthly
                 </div>
                 <button className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">
                    Manage Plan
                 </button>
              </div>
           </Card>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
           <Card className="p-10 border-none shadow-sm bg-white min-h-[600px] animate-fade-up">
              {activeTab === 'profile' && (
                <div className="space-y-10">
                   <div className="flex items-center gap-8">
                      <div className="relative">
                         <div className="h-24 w-24 rounded-[32px] bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-black shadow-lg">AD</div>
                         <button className="absolute -bottom-1 -right-1 h-8 w-8 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-blue-600 shadow-md transition-all">
                            <Camera className="h-4 w-4" />
                         </button>
                      </div>
                      <div>
                         <h3 className="text-xl font-black text-gray-900">Alex Dawson</h3>
                         <p className="text-sm text-gray-400 font-medium">Software Engineer @ Google • San Francisco, CA</p>
                         <div className="flex gap-2 mt-4">
                            <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest rounded">Verified Contributor</span>
                            <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded">L5 Benchmark</span>
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                         <input type="text" defaultValue="Alex Dawson" className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-500/10 focus:bg-white outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                         <input type="email" defaultValue="alex@dawson.dev" className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-500/10 focus:bg-white outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Company</label>
                         <input type="text" defaultValue="Google" className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-500/10 focus:bg-white outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Years of Experience</label>
                         <input type="text" defaultValue="6.5" className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-500/10 focus:bg-white outline-none transition-all" />
                      </div>
                   </div>

                   <div className="pt-10 border-t border-gray-50 flex items-center justify-between">
                      <button className="text-xs font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors">Delete Account</button>
                      <button className="h-12 px-10 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-gray-800 transition-all active:scale-95">Save Changes</button>
                   </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-10">
                   <div>
                      <h3 className="text-xl font-black text-gray-900 mb-6">Market Alerts</h3>
                      <div className="space-y-4">
                         {[
                           { title: 'Watchlist Changes', desc: 'Notify me when entities in my watchlist update.', icon: Eye },
                           { title: 'Market Reports', desc: 'Weekly deep-dives into global compensation trends.', icon: Mail },
                           { title: 'Level Benchmarks', desc: 'Alert me when equivalent levels are updated.', icon: Zap },
                         ].map((item, i) => (
                           <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group cursor-pointer hover:bg-white border border-transparent hover:border-blue-100 transition-all">
                              <div className="flex items-center gap-4">
                                 <div className="h-10 w-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors">
                                    <item.icon className="h-5 w-5" />
                                 </div>
                                 <div>
                                    <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                                    <p className="text-xs text-gray-500 font-medium">{item.desc}</p>
                                 </div>
                              </div>
                              <div className="h-6 w-11 bg-blue-600 rounded-full flex items-center px-1">
                                 <div className="h-4 w-4 bg-white rounded-full shadow-sm ml-auto" />
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="pt-10 border-t border-gray-50">
                      <h3 className="text-xl font-black text-gray-900 mb-6">Device Configuration</h3>
                      <div className="flex items-center justify-between p-6 border border-gray-100 rounded-[28px]">
                         <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                               <Smartphone className="h-6 w-6" />
                            </div>
                            <div>
                               <h4 className="text-sm font-bold text-gray-900">Mobile Push Notifications</h4>
                               <p className="text-xs text-gray-500 font-medium">Currently enabled for iPhone 15 Pro</p>
                            </div>
                         </div>
                         <button className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">Manage</button>
                      </div>
                   </div>
                </div>
              )}

              {/* Other tabs would follow same pattern */}
              {activeTab !== 'profile' && activeTab !== 'notifications' && (
                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                   <div className="h-20 w-20 rounded-[32px] bg-gray-50 flex items-center justify-center mb-6">
                      <Settings2 className="h-10 w-10 text-gray-300" />
                   </div>
                   <h3 className="text-xl font-black text-gray-900">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Settings</h3>
                   <p className="text-sm text-gray-500 max-w-xs mx-auto mt-2">This module is part of the Enterprise Suite and is currently being localized for your region.</p>
                </div>
              )}
           </Card>
        </div>
      </div>
    </div>
  );
}
