"use client";

import React, { useEffect, useState } from 'react';
import { 
  Globe, 
  Map as MapIcon, 
  TrendingUp, 
  Info, 
  ChevronRight,
  Search,
  Navigation
} from 'lucide-react';
import { Card } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
} from 'recharts';
import { formatCurrency } from "@/lib/utils";
import GlobalMap from '@/components/locations/GlobalMap';
import { useRouter } from 'next/navigation';

export default function LocationsPage() {
  const router = useRouter();
  const [countries, setCountries] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [rawLocations, setRawLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [intelRes, locsRes] = await Promise.all([
          fetch('/api/locations/intelligence'),
          fetch('/api/locations')
        ]);
        const intel = await intelRes.json();
        const locs = await locsRes.json();
        
        setCountries(intel.countries || []);
        setRawLocations(locs);
        
        // Enrich cities
        const enrichedCities = locs.map((l: any) => {
          const median = (intel.countries.find((c:any) => c.name === l.country)?.median || 120000) * (l.pppIndex || 1);
          return {
            ...l,
            medianTC: median,
            colIndex: l.costOfLivingIndex || 1,
            adjusted: median * (l.pppIndex || 1),
            growth: `+${(l.growthRate || 0).toFixed(1)}%`
          };
        }).sort((a: any, b: any) => b.adjusted - a.adjusted);
        
        setCities(enrichedCities);
      } catch (err) {
        console.error("Failed to fetch locations data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-8 pb-20">
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
          <button onClick={() => router.push('/locations/compare')} className="h-10 px-4 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg">
             Compare Locations
          </button>
        </div>
      </div>

      <Card className="p-0 border-none shadow-sm bg-[#1F2937] text-white overflow-hidden relative min-h-[450px] flex flex-col justify-center items-center text-center">
         {loading ? (
            <div className="flex flex-col items-center p-12">
               <Globe className="h-10 w-10 text-blue-400 animate-spin mb-4" />
               <p className="font-bold">Loading Global Intelligence...</p>
            </div>
         ) : (
            <GlobalMap locations={rawLocations} />
         )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {countries.slice(0, 8).map((c) => (
          <Card 
            key={c.code} 
            onClick={() => router.push(`/locations/country/${c.name.toLowerCase().replace(/ /g, '-')}`)}
            className="p-6 border-none shadow-sm bg-card hover:shadow-md transition-shadow group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
               <div className="h-10 w-10 rounded-xl bg-[#0B1020] border border-border flex items-center justify-center text-sm font-black text-gray-400 group-hover:text-blue-600 transition-colors uppercase tracking-widest">{c.code}</div>
               <div className="text-[10px] font-black text-emerald-600 bg-emerald-50/10 px-2 py-0.5 rounded uppercase tracking-widest">{c.growth}</div>
            </div>
            <h3 className="font-black text-white group-hover:text-blue-600 transition-colors">{c.name}</h3>
            <div className="mt-4 pt-4 border-t border-border">
               <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Median Country TC</div>
               <div className="text-xl font-black text-white">{formatCurrency(c.median)}</div>
            </div>
          </Card>
        ))}
      </div>

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
                <tr className="bg-gray-50/50 dark:bg-white/5">
                   <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">City</th>
                   <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Median TC</th>
                   <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">CoL Index</th>
                   <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Adjusted TC</th>
                   <th className="px-6 py-4 text-center border-l border-border"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {cities.slice(0, 15).map((d, i) => (
                  <tr 
                    key={i} 
                    onClick={() => router.push(`/locations/city/${d.city.toLowerCase().replace(/ /g, '-')}`)}
                    className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                       <span className="font-bold text-white">{d.city}</span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-400">
                       {formatCurrency(d.medianTC)}
                    </td>
                    <td className="px-6 py-4 text-center">
                       <div className={`inline-flex px-2 py-0.5 rounded text-[10px] font-black ${d.colIndex > 1.3 ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                          {d.colIndex.toFixed(2)}x
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="font-black text-blue-500">{formatCurrency(d.adjusted)}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-blue-500 transition-colors" />
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
                    <BarChart data={cities.slice(0, 5)} layout="vertical">
                       <XAxis type="number" hide />
                       <YAxis dataKey="city" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#9ca3af'}} width={100} />
                       <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{borderRadius: '16px', border: '1px solid #1f2937', backgroundColor: '#0f172a', color: '#fff'}} />
                       <Bar dataKey="adjusted" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
              <p className="mt-6 text-xs text-gray-500 font-medium leading-relaxed italic">
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
                 <button onClick={() => router.push('/locations/city/bangalore')} className="w-full py-3 bg-card text-blue-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#172033] transition-all">
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
