"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { ChevronLeft, Building2, MapPin, TrendingUp, Compass, Activity, CheckCircle } from 'lucide-react';
import { formatCurrency } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import AILocationAdvisor from '@/components/locations/AILocationAdvisor';

export default function CityIntelligencePage() {
  const params = useParams();
  const router = useRouter();
  const citySlug = params.city as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/locations/city/${citySlug}`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [citySlug]);

  if (loading) return <div className="p-8 text-white">Loading Intelligence...</div>;
  if (!data || data.error) return <div className="p-8 text-rose-500">Failed to load data for {citySlug}</div>;

  return (
    <div className="space-y-8 pb-20">
      <button onClick={() => router.back()} className="flex items-center text-gray-400 hover:text-white transition-colors text-sm font-bold">
        <ChevronLeft className="h-4 w-4 mr-1" /> Back
      </button>

      <div className="relative w-full h-[350px] rounded-[32px] overflow-hidden">
        {/* Mocking dynamic city image */}
        <img 
          src={`https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1600&q=80`}
          alt={data.city}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020] via-[#0B1020]/80 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <span className="text-xs font-black bg-blue-500 text-white px-2 py-1 rounded tracking-widest uppercase">{data.country}</span>
               <span className="text-xs font-black bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded tracking-widest uppercase">Score {data.relocationScore}/10</span>
            </div>
            <h1 className="text-5xl font-black text-white">{data.city}</h1>
          </div>
          <div className="flex gap-4 text-right">
             <div>
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Median TC</p>
               <p className="text-3xl font-black text-white">{formatCurrency(data.median)}</p>
             </div>
             <div className="w-[1px] bg-white/10 mx-2" />
             <div>
               <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Adjusted PPP</p>
               <p className="text-3xl font-black text-emerald-400">{formatCurrency(data.adjusted)}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <Card className="p-6 bg-card border-none shadow-sm">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-black text-white">Compensation Trends</h3>
               </div>
               <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={data.trends}>
                        <XAxis dataKey="year" stroke="#4b5563" tick={{fill: '#9ca3af', fontSize: 12}} axisLine={false} tickLine={false} />
                        <YAxis stroke="#4b5563" tick={{fill: '#9ca3af', fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                        <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{borderRadius: '16px', border: '1px solid #1f2937', backgroundColor: '#0f172a', color: '#fff'}} />
                        <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={4} dot={{r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#0f172a'}} />
                     </LineChart>
                  </ResponsiveContainer>
               </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Card className="p-6 bg-[#1F2937] border-none shadow-sm text-white relative overflow-hidden">
                  <Compass className="absolute -right-4 -bottom-4 h-32 w-32 text-white/5" />
                  <div className="relative z-10">
                     <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Cost of Living Index</h3>
                     <p className="text-4xl font-black">{data.costOfLivingIndex.toFixed(2)}x</p>
                     <p className="text-sm text-gray-400 mt-2 font-medium">Relative to global baseline</p>
                  </div>
               </Card>

               <Card className="p-6 bg-[#1F2937] border-none shadow-sm text-white relative overflow-hidden">
                  <Activity className="absolute -right-4 -bottom-4 h-32 w-32 text-white/5" />
                  <div className="relative z-10">
                     <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Growth Rate</h3>
                     <p className="text-4xl font-black text-emerald-400">+{data.growthRate.toFixed(1)}%</p>
                     <p className="text-sm text-gray-400 mt-2 font-medium">Year over year TC growth</p>
                  </div>
               </Card>
            </div>
         </div>

         <div className="space-y-6">
            <AILocationAdvisor locationContext={data} />

            <Card className="p-6 bg-card border-none shadow-sm">
               <h3 className="text-lg font-black text-white mb-6">Location Highlights</h3>
               <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                     <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5" />
                     <div>
                        <p className="text-sm font-bold text-white">Top 10% in Growth</p>
                        <p className="text-xs text-gray-500 mt-1">One of the fastest growing tech hubs globally.</p>
                     </div>
                  </li>
                  <li className="flex items-start gap-3">
                     <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5" />
                     <div>
                        <p className="text-sm font-bold text-white">{data.companies}+ Active Employers</p>
                        <p className="text-xs text-gray-500 mt-1">High density of hiring tech companies.</p>
                     </div>
                  </li>
                  <li className="flex items-start gap-3">
                     <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5" />
                     <div>
                        <p className="text-sm font-bold text-white">{data.records.toLocaleString()} Verified Offers</p>
                        <p className="text-xs text-gray-500 mt-1">High confidence in compensation data.</p>
                     </div>
                  </li>
               </ul>
            </Card>
         </div>
      </div>
    </div>
  );
}
