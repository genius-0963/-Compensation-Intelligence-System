'use client';

import React from 'react';
import { 
  DollarSign, 
  Users, 
  Building2, 
  Layers, 
  CheckCircle2, 
  TrendingUp,
  Plus,
  ArrowRight,
  MoreHorizontal
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
  Cell
} from 'recharts';
import { formatCurrency } from "@/lib/utils";
import Link from 'next/link';

export default function DashboardPage() {
  // Mock KPIs based on spec
  const kpis = [
    { title: 'Median Compensation', value: '$248,000', trend: '+12%', icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Average Compensation', value: '$215,400', trend: '+8%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Highest Paying Co.', value: 'OpenAI', trend: 'Rank 1', icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Highest Paying Level', value: 'Google L8', trend: 'Principal+', icon: Layers, color: 'text-violet-600', bg: 'bg-violet-50' },
    { title: 'Verified Entries', value: '42,850', trend: '94%', icon: CheckCircle2, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Companies Tracked', value: '1,240', trend: '+15', icon: Users, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  const topCompanies = [
    { name: 'Google', median: 320000, trend: '+4.2%', logo: 'G' },
    { name: 'Meta', median: 315000, trend: '+3.8%', logo: 'M' },
    { name: 'Amazon', median: 295000, trend: '+2.1%', logo: 'A' },
    { name: 'Apple', median: 285000, trend: '+1.5%', logo: 'A' },
    { name: 'Netflix', median: 450000, trend: '+5.0%', logo: 'N' },
  ];

  const topLevels = [
    { level: 'L7 Staff Software Engineer', company: 'Google', median: 680000 },
    { level: 'E7 Software Engineer', company: 'Meta', median: 675000 },
    { level: 'L7 Principal SDE', company: 'Amazon', median: 640000 },
    { level: 'ICT6 Software Engineer', company: 'Apple', median: 620000 },
  ];

  const distributionData = [
    { range: '50-100k', count: 120 },
    { range: '100-150k', count: 450 },
    { range: '150-200k', count: 890 },
    { range: '200-250k', count: 1200 },
    { range: '250-300k', count: 950 },
    { range: '300-400k', count: 600 },
    { range: '400-500k', count: 200 },
    { range: '500k+', count: 80 },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Compensation Intelligence</h1>
          <p className="text-gray-500 mt-2 text-lg">Compare compensation across companies, levels, locations, and roles.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/explorer" className="px-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
            Explore Salaries
          </Link>
          <Link href="/compare" className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2">
            Compare Compensation
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5">
        {kpis.map((kpi, i) => (
          <Card key={i} className="p-5 border-none shadow-sm hover:shadow-md transition-shadow group">
            <div className={`h-10 w-10 rounded-xl ${kpi.bg} ${kpi.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <kpi.icon className="h-5 w-5" />
            </div>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{kpi.title}</h3>
            <div className="text-xl font-black text-gray-900 mb-2">{kpi.value}</div>
            <div className="flex items-center gap-1">
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${kpi.trend.startsWith('+') || kpi.trend.startsWith('↑') ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                {kpi.trend}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Compensation Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Paying Companies */}
        <Card className="p-8 border-none shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-gray-900">Top Paying Companies</h3>
            <button className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-5">
            {topCompanies.map((co, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-900 font-bold shadow-sm">
                    {co.logo}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{co.name}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tier 1 Technology</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-black text-gray-900">{formatCurrency(co.median)}</div>
                    <div className="text-[10px] text-emerald-500 font-black uppercase tracking-wider text-right">{co.trend}</div>
                  </div>
                  <div className="h-8 w-24 bg-gray-50 rounded-lg overflow-hidden hidden md:block">
                     <div className="h-full bg-blue-500/20" style={{ width: `${(co.median / 450000) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 bg-gray-50 text-gray-900 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-gray-100 transition-colors">
            View All Companies
          </button>
        </Card>

        {/* Top Paying Levels */}
        <Card className="p-8 border-none shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-gray-900">Top Paying Levels</h3>
            <button className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors">
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-4">
            {topLevels.map((lvl, i) => (
              <div key={i} className="p-4 bg-gray-50/50 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white transition-all cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{lvl.level}</h4>
                    <p className="text-xs text-gray-500 font-medium">{lvl.company}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-gray-900 text-lg">{formatCurrency(lvl.median)}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Median TC</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 bg-gray-50 text-gray-900 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-gray-100 transition-colors">
            View Level Intelligence
          </button>
        </Card>
      </div>

      {/* Compensation Distribution Area */}
      <Card className="p-8 border-none shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h3 className="text-2xl font-black text-gray-900">Compensation Distribution</h3>
            <p className="text-sm text-gray-500 mt-1 font-medium">Interactive histogram showing industry-wide total compensation spread.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {['P50', 'P75', 'P90', 'P95'].map((p) => (
              <div key={p} className="px-3 py-1.5 bg-gray-50 rounded-lg text-xs font-bold text-gray-600 border border-gray-100">
                {p} <span className="text-blue-600 ml-1">$240k+</span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distributionData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 700 }} />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 3 ? '#2563eb' : '#e5e7eb'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-50 grid grid-cols-2 md:grid-cols-4 gap-8">
           <div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Median</div>
              <div className="text-2xl font-black text-gray-900">$248,000</div>
           </div>
           <div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">75th Percentile</div>
              <div className="text-2xl font-black text-gray-900">$312,000</div>
           </div>
           <div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">90th Percentile</div>
              <div className="text-2xl font-black text-gray-900">$485,000</div>
           </div>
           <div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">95th Percentile</div>
              <div className="text-2xl font-black text-gray-900">$620,000+</div>
           </div>
        </div>
      </Card>

      {/* Compensation Breakdown Section */}
      <Card className="p-8 border-none shadow-sm overflow-hidden">
        <div className="mb-10">
          <h3 className="text-2xl font-black text-gray-900">Compensation Breakdown</h3>
          <p className="text-sm text-gray-500 mt-1 font-medium">Comparison of compensation structures across top-tier companies.</p>
        </div>

        <div className="space-y-12">
           {[
             { name: 'Google L5', base: 190000, bonus: 35000, stock: 120000, total: 345000 },
             { name: 'Meta E5', base: 185000, bonus: 40000, stock: 150000, total: 375000 },
             { name: 'Microsoft 63', base: 180000, bonus: 30000, stock: 80000, total: 290000 },
             { name: 'Amazon SDE3', base: 165000, bonus: 25000, stock: 220000, total: 410000 },
           ].map((item, i) => (
             <div key={i}>
                <div className="flex items-center justify-between mb-3">
                   <div className="font-black text-gray-900">{item.name}</div>
                   <div className="text-sm font-black text-gray-900">{formatCurrency(item.total)}</div>
                </div>
                <div className="h-4 w-full bg-gray-100 rounded-full flex overflow-hidden">
                   <div className="h-full bg-blue-600" style={{ width: `${(item.base / item.total) * 100}%` }} />
                   <div className="h-full bg-emerald-500" style={{ width: `${(item.bonus / item.total) * 100}%` }} />
                   <div className="h-full bg-violet-600" style={{ width: `${(item.stock / item.total) * 100}%` }} />
                </div>
                <div className="flex gap-4 mt-2">
                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      <div className="h-2 w-2 rounded-full bg-blue-600" /> Base ({Math.round(item.base/item.total*100)}%)
                   </div>
                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" /> Bonus ({Math.round(item.bonus/item.total*100)}%)
                   </div>
                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      <div className="h-2 w-2 rounded-full bg-violet-600" /> Stock ({Math.round(item.stock/item.total*100)}%)
                   </div>
                </div>
             </div>
           ))}
        </div>
      </Card>
    </div>
  );
}
