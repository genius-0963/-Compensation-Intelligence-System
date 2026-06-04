"use client";

import React, { useState } from 'react';
import { 
  Building2, 
  Globe, 
  Users, 
  MapPin, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Briefcase,
  PieChart as PieChartIcon,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Card } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { formatCurrency } from "@/lib/utils";

export default function CompanyDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for Google
  const company = {
    name: 'Google',
    website: 'google.com',
    industry: 'Technology',
    headcount: '180,000+',
    hq: 'Mountain View, CA',
    logo: 'G',
  };

  const metrics = [
    { title: 'Median TC', value: '$320,000', icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Average TC', value: '$312,400', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Highest Level TC', value: '$1.2M+', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Lowest Level TC', value: '$165,000', icon: Briefcase, color: 'text-rose-600', bg: 'bg-rose-50' },
    { title: 'Total Records', value: '14,280', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  const levelData = [
    { name: 'L3', median: 195000 },
    { name: 'L4', median: 275000 },
    { name: 'L5', median: 385000 },
    { name: 'L6', median: 520000 },
    { name: 'L7', median: 840000 },
    { name: 'L8', median: 1250000 },
  ];

  const stockRatioData = [
    { name: 'Base Salary', value: 55, color: '#2563eb' },
    { name: 'Stock (RSUs)', value: 35, color: '#8b5cf6' },
    { name: 'Annual Bonus', value: 10, color: '#10b981' },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* 1. Company Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
         <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-3xl bg-white border border-gray-100 flex items-center justify-center text-gray-900 font-black text-4xl shadow-sm">
               {company.logo}
            </div>
            <div>
               <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-4xl font-black text-gray-900 tracking-tight">{company.name}</h1>
                  <a href={`https://${company.website}`} target="_blank" className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-blue-600 transition-colors">
                     <ExternalLink className="h-4 w-4" />
                  </a>
               </div>
               <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-gray-500">
                  <div className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> {company.industry}</div>
                  <div className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {company.headcount}</div>
                  <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {company.hq}</div>
               </div>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 bg-white border border-gray-100 rounded-xl text-xs font-black uppercase tracking-widest text-gray-700 hover:bg-gray-50 shadow-sm transition-all">
               Add to Watchlist
            </button>
            <button className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 shadow-lg transition-all active:scale-95">
               Share Profile
            </button>
         </div>
      </div>

      {/* 2. Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {metrics.map((m, i) => (
          <Card key={i} className="p-5 border-none shadow-sm bg-white">
            <div className={`h-8 w-8 rounded-lg ${m.bg} ${m.color} flex items-center justify-center mb-3`}>
              <m.icon className="h-4 w-4" />
            </div>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{m.title}</h3>
            <div className="text-xl font-black text-gray-900">{m.value}</div>
          </Card>
        ))}
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-2 p-1 bg-gray-100/50 rounded-2xl w-fit">
        {['Overview', 'Levels', 'Locations', 'Analytics', 'Comparisons'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.toLowerCase() 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 4. Overview Section */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-up">
           <div className="lg:col-span-8 space-y-8">
              {/* Compensation Distribution */}
              <Card className="p-8 border-none shadow-sm bg-white">
                 <div className="flex items-center justify-between mb-8">
                    <div>
                       <h3 className="text-xl font-black text-gray-900">Total Compensation Distribution</h3>
                       <p className="text-sm text-gray-500 mt-1">Breakdown of reported packages for Software Engineering roles.</p>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                       <BarChart3 className="h-5 w-5" />
                    </div>
                 </div>
                 <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={levelData}>
                          <defs>
                             <linearGradient id="colorMed" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#9ca3af'}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#9ca3af'}} tickFormatter={(v) => `$${v/1000}k`} />
                          <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.06)'}} />
                          <Area type="monotone" dataKey="median" stroke="#2563eb" fillOpacity={1} fill="url(#colorMed)" strokeWidth={3} />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </Card>

              {/* Salary by Level Table */}
              <Card className="border-none shadow-sm bg-white overflow-hidden">
                 <div className="p-6 border-b border-gray-50">
                    <h3 className="text-lg font-black text-gray-900">Compensation by Level</h3>
                 </div>
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-gray-50/50">
                          <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Level</th>
                          <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Equivalent</th>
                          <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Median TC</th>
                          <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Stock %</th>
                          <th className="px-6 py-4 text-center border-l border-gray-100"></th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       {levelData.map((lvl, i) => (
                          <tr key={i} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                             <td className="px-6 py-4">
                                <span className="font-black text-gray-900">{lvl.name}</span>
                             </td>
                             <td className="px-6 py-4 text-xs font-bold text-gray-500">
                                Rank {i + 3} (Mid-Senior)
                             </td>
                             <td className="px-6 py-4 text-right font-black text-blue-600">
                                {formatCurrency(lvl.median)}
                             </td>
                             <td className="px-6 py-4 text-right font-bold text-gray-500">
                                {30 + (i * 5)}%
                             </td>
                             <td className="px-6 py-4 text-center">
                                <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-blue-600 transition-colors" />
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </Card>
           </div>

           <div className="lg:col-span-4 space-y-8">
              {/* Compensation Mix */}
              <Card className="p-8 border-none shadow-sm bg-white">
                 <h3 className="text-lg font-black text-gray-900 mb-8 text-center">Compensation Mix</h3>
                 <div className="h-[240px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                          <Pie
                             data={stockRatioData}
                             cx="50%"
                             cy="50%"
                             innerRadius={60}
                             outerRadius={80}
                             paddingAngle={8}
                             dataKey="value"
                          >
                             {stockRatioData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                             ))}
                          </Pie>
                          <Tooltip />
                       </PieChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="space-y-4 mt-4">
                    {stockRatioData.map((item, i) => (
                       <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                             <span className="text-xs font-bold text-gray-500">{item.name}</span>
                          </div>
                          <span className="text-sm font-black text-gray-900">{item.value}%</span>
                       </div>
                    ))}
                 </div>
              </Card>

              {/* Verified Badge */}
              <Card className="p-6 border-none shadow-sm bg-emerald-50 border border-emerald-100">
                 <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                       <ShieldCheck className="h-6 w-6" />
                    </div>
                    <h3 className="font-black text-emerald-900 uppercase tracking-widest text-[10px]">Verified Data</h3>
                 </div>
                 <p className="text-sm font-bold text-emerald-800 leading-relaxed">
                    94% of Google submissions include verified W2s or offer letters. Our confidence in these benchmarks is <span className="underline decoration-2 underline-offset-4">Very High</span>.
                 </p>
              </Card>

              {/* Comparison CTA */}
              <Card className="p-6 border-none shadow-sm bg-gray-900 text-white relative overflow-hidden">
                 <div className="relative z-10">
                    <h3 className="text-lg font-black mb-2">How does Google compare?</h3>
                    <p className="text-sm text-gray-400 mb-6 font-medium">Side-by-side analysis against Meta, Amazon, and Microsoft.</p>
                    <button className="w-full py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                       Start Comparison
                       <ArrowRight className="h-4 w-4" />
                    </button>
                 </div>
                 <Building2 className="absolute -bottom-4 -right-4 h-24 w-24 text-white/5 rotate-12" />
              </Card>
           </div>
        </div>
      )}
    </div>
  );
}
