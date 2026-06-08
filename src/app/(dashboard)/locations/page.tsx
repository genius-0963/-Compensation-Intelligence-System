"use client";

import React from 'react';
import { 
  Globe, 
  Map as MapIcon, 
  TrendingUp, 
  ArrowUpRight, 
  Info, 
  ChevronRight,
  DollarSign,
  Building2,
  Users,
  Search,
  Filter,
  Navigation
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
  Cell,
  Legend
} from 'recharts';
import { formatCurrency } from "@/lib/utils";

export default function LocationsPage() {
  const cityData = [
    { city: 'San Francisco, CA', medianTC: 320000, colIndex: 1.5, adjusted: 213333, growth: '+5.2%' },
    { city: 'New York, NY', medianTC: 295000, colIndex: 1.45, adjusted: 203448, growth: '+4.8%' },
    { city: 'Seattle, WA', medianTC: 280000, colIndex: 1.25, adjusted: 224000, growth: '+3.5%' },
    { city: 'London, UK', medianTC: 145000, colIndex: 1.15, adjusted: 126087, growth: '+6.1%' },
    { city: 'Zurich, CH', medianTC: 220000, colIndex: 1.4, adjusted: 157143, growth: '+2.4%' },
    { city: 'Bangalore, IN', medianTC: 85000, colIndex: 0.45, adjusted: 188888, growth: '+12.5%' },
    { city: 'Berlin, DE', medianTC: 110000, colIndex: 0.9, adjusted: 122222, growth: '+5.5%' },
    { city: 'Singapore, SG', medianTC: 165000, colIndex: 1.3, adjusted: 126923, growth: '+7.2%' },
  ];

  const countryCards = [
    { name: 'United States', median: 248000, growth: '+4.5%', records: 28450, code: 'US' },
    { name: 'India', median: 65000, growth: '+12.2%', records: 12840, code: 'IN' },
    { name: 'United Kingdom', median: 135000, growth: '+5.8%', records: 5620, code: 'GB' },
    { name: 'Canada', median: 155000, growth: '+3.2%', records: 4100, code: 'CA' },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Geographical Intelligence</h1>
          <p className="text-slate-500 mt-1 font-medium">Global compensation mapping and cost-of-living adjustments.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
             <input type="text" placeholder="Search cities..." className="h-10 pl-9 pr-4 bg-card border border-border rounded-xl text-xs focus:ring-2 focus:ring-blue-500/10 outline-none shadow-sm" />
          </div>
          <button className="h-10 px-4 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg">
             Compare Locations
          </button>
        </div>
      </div>

      {/* 2. Map Visualization Simulation */}
      <Card className="p-8 border-none shadow-sm bg-[#1F2937] text-white overflow-hidden relative min-h-[450px] flex flex-col justify-center items-center text-center">
         <div className="relative z-10 max-w-2xl">
            <div className="h-20 w-20 rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8">
               <Globe className="h-10 w-10 text-blue-400 animate-pulse" />
            </div>
            <h3 className="text-4xl font-black mb-4">Interactive Global Pay Map</h3>
            <p className="text-lg text-gray-400 font-medium mb-10 leading-relaxed">
               Visualizing compensation density and median pay across 4,200+ cities worldwide.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
               {['High Pay', 'High Growth', 'Low Cost', 'Hubs'].map(f => (
                 <button key={f} className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold hover:bg-white/10 transition-all">
                    {f}
                 </button>
               ))}
            </div>
         </div>
         {/* Map Dots Simulation */}
         <div className="absolute inset-0 opacity-20 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="absolute h-3 w-3 bg-blue-500 rounded-full blur-[2px]" 
                style={{ 
                  top: `${Math.random() * 100}%`, 
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() 
                }} 
              />
            ))}
         </div>
         <Navigation className="absolute -bottom-10 -right-10 h-64 w-64 text-white/5 -rotate-12" />
      </Card>

      {/* 3. Country Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {countryCards.map((c) => (
          <Card key={c.code} className="p-6 border-none shadow-sm bg-card hover:shadow-md transition-shadow group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
               <div className="h-10 w-10 rounded-xl bg-[#0B1020] border border-border flex items-center justify-center text-sm font-black text-gray-400 group-hover:text-blue-600 transition-colors uppercase tracking-widest">{c.code}</div>
               <div className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-widest">{c.growth}</div>
            </div>
            <h3 className="font-black text-white group-hover:text-blue-600 transition-colors">{c.name}</h3>
            <div className="mt-4 pt-4 border-t border-border">
               <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Median Country TC</div>
               <div className="text-xl font-black text-white">{formatCurrency(c.median)}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* 4. City Ranking Table & Analysis */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <Card className="xl:col-span-8 border-none shadow-sm bg-card overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
             <h3 className="text-lg font-black text-white">City Ranking Matrix</h3>
             <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-gray-400" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Adjusted by local PPP</span>
             </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                   <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">City</th>
                   <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Median TC</th>
                   <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">CoL Index</th>
                   <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Adjusted TC</th>
                   <th className="px-6 py-4 text-center border-l border-border"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {cityData.map((d, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                       <span className="font-bold text-white">{d.city}</span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-700">
                       {formatCurrency(d.medianTC)}
                    </td>
                    <td className="px-6 py-4 text-center">
                       <div className={`inline-flex px-2 py-0.5 rounded text-[10px] font-black ${d.colIndex > 1.3 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          {d.colIndex}x
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="font-black text-blue-600">{formatCurrency(d.adjusted)}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-blue-600 transition-colors" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="xl:col-span-4 space-y-6">
           <Card className="p-8 border-none shadow-sm bg-card">
              <h3 className="text-lg font-black text-white mb-8">Location Adjusted Pay</h3>
              <div className="h-[300px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cityData.slice(0, 5)} layout="vertical">
                       <XAxis type="number" hide />
                       <YAxis dataKey="city" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#4b5563'}} width={100} />
                       <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.06)'}} />
                       <Bar dataKey="adjusted" fill="#2563eb" radius={[0, 4, 4, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
              <p className="mt-6 text-xs text-gray-400 font-medium leading-relaxed italic">
                 Adjusted TC represents the effective purchasing power in the local economy relative to global standards.
              </p>
           </Card>

           <Card className="p-6 border-none shadow-sm bg-blue-600 text-white relative overflow-hidden">
              <div className="relative z-10">
                 <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6" />
                 </div>
                 <h3 className="text-xl font-black mb-2">Growth Hotspot</h3>
                 <p className="text-sm font-medium opacity-90 mb-6">Bangalore leads global growth with a +12.5% increase in verified compensation packages this year.</p>
                 <button className="w-full py-3 bg-card text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#172033] transition-all">
                    View Bangalore Report
                 </button>
              </div>
              <MapIcon className="absolute -bottom-6 -right-6 h-32 w-32 text-white/5 rotate-12" />
           </Card>
        </div>
      </div>
    </div>
  );
}
