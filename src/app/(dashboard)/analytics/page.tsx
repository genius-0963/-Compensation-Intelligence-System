"use client";

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Map as MapIcon, 
  Users, 
  DollarSign, 
  Filter, 
  ChevronDown,
  Calendar,
  Zap,
  ArrowUpRight,
  Target,
  BarChart3,
  Globe
} from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  Cell,
  Legend
} from 'recharts';
import { formatCurrency } from "@/lib/utils";

export default function AnalyticsPage() {
  const [timePeriod, setTimePeriod] = useState('1Y');
  const [filters, setFilters] = useState({ company: '', location: '', level: '' });

  // Mock data for Trends
  const trendData = [
    { name: 'Jan', google: 240, meta: 230, amazon: 210 },
    { name: 'Mar', google: 260, meta: 245, amazon: 220 },
    { name: 'May', google: 280, meta: 270, amazon: 235 },
    { name: 'Jul', google: 275, meta: 290, amazon: 250 },
    { name: 'Sep', google: 300, meta: 310, amazon: 265 },
    { name: 'Nov', google: 320, meta: 315, amazon: 280 },
  ];

  const promotionData = [
    { level: 'L3 → L4', increase: 42, stock: 65, bonus: 15 },
    { level: 'L4 → L5', increase: 38, stock: 80, bonus: 20 },
    { level: 'L5 → L6', increase: 45, stock: 120, bonus: 25 },
    { level: 'L6 → L7', increase: 55, stock: 180, bonus: 35 },
  ];

  const percentiles = [
    { label: '25th', value: '$165,000', description: 'Entry-level / Early career' },
    { label: '50th', value: '$248,000', description: 'Industry Median' },
    { label: '75th', value: '$312,000', description: 'High-performing Senior' },
    { label: '90th', value: '$485,000', description: 'Staff / Principal' },
    { label: '95th', value: '$620,000', description: 'Top 5% of Engineers' },
    { label: '99th', value: '$1.2M+', description: 'Distinguished / Fellow' },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* 1. Global Filters */}
      <Card className="p-4 border-none shadow-sm bg-card sticky top-0 z-30 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
           <Dropdown 
             align="left"
             trigger={
               <button className={`h-10 px-4 border border-border rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm ${filters.company ? 'bg-primary/20 text-primary border-primary/50' : 'bg-muted text-foreground hover:bg-muted/80'}`}>
                  <Filter className="h-3.5 w-3.5" />
                  {filters.company || 'Company'}
                  <ChevronDown className="h-3 w-3" />
               </button>
             }
           >
             <DropdownItem onClick={() => setFilters(f => ({ ...f, company: '' }))}>Any Company</DropdownItem>
             <DropdownItem onClick={() => setFilters(f => ({ ...f, company: 'Google' }))}>Google</DropdownItem>
             <DropdownItem onClick={() => setFilters(f => ({ ...f, company: 'Meta' }))}>Meta</DropdownItem>
             <DropdownItem onClick={() => setFilters(f => ({ ...f, company: 'Amazon' }))}>Amazon</DropdownItem>
             <DropdownItem onClick={() => setFilters(f => ({ ...f, company: 'Apple' }))}>Apple</DropdownItem>
             <DropdownItem onClick={() => setFilters(f => ({ ...f, company: 'Microsoft' }))}>Microsoft</DropdownItem>
           </Dropdown>

           <Dropdown 
             align="left"
             trigger={
               <button className={`h-10 px-4 border border-border rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm ${filters.location ? 'bg-primary/20 text-primary border-primary/50' : 'bg-muted text-foreground hover:bg-muted/80'}`}>
                  <Globe className="h-3.5 w-3.5" />
                  {filters.location === 'US' ? 'United States' : filters.location === 'GB' ? 'United Kingdom' : filters.location === 'CA' ? 'Canada' : filters.location === 'IN' ? 'India' : filters.location || 'Location'}
                  <ChevronDown className="h-3 w-3" />
               </button>
             }
           >
             <DropdownItem onClick={() => setFilters(f => ({ ...f, location: '' }))}>Any Location</DropdownItem>
             <DropdownItem onClick={() => setFilters(f => ({ ...f, location: 'US' }))}>United States</DropdownItem>
             <DropdownItem onClick={() => setFilters(f => ({ ...f, location: 'GB' }))}>United Kingdom</DropdownItem>
             <DropdownItem onClick={() => setFilters(f => ({ ...f, location: 'CA' }))}>Canada</DropdownItem>
             <DropdownItem onClick={() => setFilters(f => ({ ...f, location: 'IN' }))}>India</DropdownItem>
           </Dropdown>

           <Dropdown 
             align="left"
             trigger={
               <button className={`h-10 px-4 border border-border rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm ${filters.level ? 'bg-primary/20 text-primary border-primary/50' : 'bg-muted text-foreground hover:bg-muted/80'}`}>
                  <Target className="h-3.5 w-3.5" />
                  {filters.level || 'Level'}
                  <ChevronDown className="h-3 w-3" />
               </button>
             }
           >
             <DropdownItem onClick={() => setFilters(f => ({ ...f, level: '' }))}>Any Level</DropdownItem>
             <DropdownItem onClick={() => setFilters(f => ({ ...f, level: 'Entry Level' }))}>Entry Level</DropdownItem>
             <DropdownItem onClick={() => setFilters(f => ({ ...f, level: 'Mid Level' }))}>Mid Level</DropdownItem>
             <DropdownItem onClick={() => setFilters(f => ({ ...f, level: 'Senior' }))}>Senior</DropdownItem>
             <DropdownItem onClick={() => setFilters(f => ({ ...f, level: 'Executive' }))}>Executive</DropdownItem>
           </Dropdown>
        </div>
        <div className="h-6 w-px bg-border mx-1" />
        <div className="flex items-center gap-1 p-1 bg-muted rounded-xl border border-border">
           {['1M', '3M', '6M', '1Y', 'ALL'].map((p) => (
             <button 
              key={p} 
              onClick={() => setTimePeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${timePeriod === p ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
             >
               {p}
             </button>
           ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
           <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mr-2">Last Updated: 2m ago</span>
           <button className="h-10 px-5 bg-primary text-primary-foreground rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-primary/90 transition-all flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Custom Range
           </button>
        </div>
      </Card>

      {/* 2. Trends Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card className="lg:col-span-8 p-8 border-none shadow-sm bg-card">
           <div className="flex items-center justify-between mb-10">
              <div>
                 <h3 className="text-2xl font-black text-foreground tracking-tight">Compensation Trends</h3>
                 <p className="text-sm text-muted-foreground font-medium">Historical growth of Median TC across Tier 1 companies.</p>
              </div>
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-600" />
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Google</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Meta</span>
                 </div>
              </div>
           </div>
           <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#9ca3af'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#9ca3af'}} tickFormatter={(v) => `$${v}k`} />
                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.06)'}} />
                    <Line type="monotone" dataKey="google" stroke="#2563eb" strokeWidth={4} dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="meta" stroke="#10b981" strokeWidth={4} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="amazon" stroke="#94a3b8" strokeWidth={3} strokeDasharray="5 5" dot={false} />
                 </LineChart>
              </ResponsiveContainer>
           </div>
        </Card>

        {/* 3. Salary Heatmap Simulation */}
        <Card className="lg:col-span-4 p-8 border-none shadow-sm bg-card overflow-hidden">
           <h3 className="text-xl font-black text-foreground mb-6">Market Heatmap</h3>
           <div className="space-y-4">
              {['Google', 'Meta', 'Netflix', 'Amazon', 'Apple'].map((co) => (
                <div key={co} className="space-y-2">
                   <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">{co}</span>
                      <span className="text-[10px] font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded">Hot</span>
                   </div>
                   <div className="flex gap-1 h-8">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div 
                          key={i} 
                          className="flex-1 rounded-md transition-all cursor-pointer hover:scale-110" 
                          style={{ 
                            backgroundColor: i > 4 ? '#1e40af' : i > 2 ? '#3b82f6' : '#bfdbfe',
                            opacity: 0.5 + (i * 0.08)
                          }} 
                        />
                      ))}
                   </div>
                </div>
              ))}
           </div>
           <div className="mt-8 pt-6 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                 <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Lower Pay</span>
                 <div className="flex-1 h-1.5 mx-4 bg-gradient-to-r from-blue-100 via-blue-500 to-blue-900 rounded-full" />
                 <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Higher Pay</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed italic">Heatmap visualizes median compensation across standardized level ranks 1-10.</p>
           </div>
        </Card>
      </div>

      {/* 4. Promotion Growth Analysis */}
      <Card className="p-8 border-none shadow-sm bg-card">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-2xl font-black text-foreground tracking-tight">Promotion Growth Analysis</h3>
            <p className="text-sm text-muted-foreground font-medium">Quantifying the financial impact of leveling up.</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {promotionData.map((d, i) => (
            <div key={i} className="p-6 bg-muted/50 rounded-[32px] border border-transparent hover:border-primary/20 hover:bg-card transition-all group">
              <div className="text-lg font-black text-foreground mb-4">{d.level}</div>
              <div className="space-y-4">
                <div>
                   <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Median TC Increase</div>
                   <div className="text-2xl font-black text-violet-600">+{d.increase}%</div>
                </div>
                <div className="flex items-center gap-6">
                   <div>
                      <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Stock Growth</div>
                      <div className="text-sm font-black text-foreground">+{d.stock}%</div>
                   </div>
                   <div className="h-6 w-px bg-border" />
                   <div>
                      <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Bonus Jump</div>
                      <div className="text-sm font-black text-foreground">+{d.bonus}%</div>
                   </div>
                </div>
              </div>
              <div className="mt-6 h-1 w-full bg-muted rounded-full overflow-hidden">
                 <div className="h-full bg-violet-600 transition-all duration-1000" style={{ width: `${d.increase}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 5. Compensation Percentiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {percentiles.map((p, i) => (
          <Card key={i} className="p-6 border-none shadow-sm bg-card hover:shadow-md transition-shadow cursor-default group">
            <div className="text-xs font-black text-primary uppercase tracking-widest mb-1">{p.label}</div>
            <div className="text-2xl font-black text-foreground mb-3 group-hover:scale-105 transition-transform origin-left">{p.value}</div>
            <p className="text-[10px] text-muted-foreground font-bold leading-relaxed">{p.description}</p>
          </Card>
        ))}
      </div>

      {/* 6. Geo Intelligence Simulation */}
      <Card className="p-8 border-none shadow-sm bg-zinc-950 text-white overflow-hidden relative min-h-[400px]">
         <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary rounded-full mb-6">
               <Globe className="h-3 w-3" />
               <span className="text-[10px] font-black uppercase tracking-widest">Geo Intelligence</span>
            </div>
            <h3 className="text-3xl font-black mb-4">Location Premium Matrix</h3>
            <p className="text-lg text-muted-foreground font-medium mb-8 leading-relaxed">
               Identify the highest-paying hubs globally, normalized by Cost of Living and Local Purchasing Power.
            </p>
            <div className="grid grid-cols-2 gap-8 mb-10">
               <div>
                  <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Top US Hub</div>
                  <div className="text-xl font-bold">San Francisco, CA</div>
               </div>
               <div>
                  <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Top EU Hub</div>
                  <div className="text-xl font-bold">Zurich, Switzerland</div>
               </div>
            </div>
            <button className="px-8 py-4 bg-card text-zinc-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#111827] transition-all active:scale-95 shadow-2xl">
               View Geo Dashboard
            </button>
         </div>
         <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent" />
         </div>
         <BarChart3 className="absolute -bottom-10 -right-10 h-64 w-64 text-white/5 rotate-12" />
      </Card>
    </div>
  );
}
