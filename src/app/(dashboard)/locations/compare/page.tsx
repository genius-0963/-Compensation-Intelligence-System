"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { Card } from "@/components/ui/card";
import { ChevronLeft, ArrowRightLeft, MapPin } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatCurrency } from "@/lib/utils";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell } from 'recharts';

function CompareLocationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialLocs = searchParams.get('locations') || 'seattle,bangalore';
  
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedLocs, setSelectedLocs] = useState<string[]>(initialLocs.split(','));
  const [compareData, setCompareData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchList() {
      const res = await fetch('/api/locations');
      const data = await res.json();
      setLocations(data);
    }
    fetchList();
  }, []);

  useEffect(() => {
    async function fetchCompare() {
      if (selectedLocs.length === 0) return;
      setLoading(true);
      const res = await fetch(`/api/locations/compare?locations=${selectedLocs.join(',')}`);
      const data = await res.json();
      setCompareData(data);
      setLoading(false);
    }
    fetchCompare();
  }, [selectedLocs]);

  const handleSelect = (index: number, val: string) => {
    const newLocs = [...selectedLocs];
    newLocs[index] = val;
    setSelectedLocs(newLocs);
    router.replace(`/locations/compare?locations=${newLocs.join(',')}`);
  };

  const radarData = compareData.length > 0 ? [
    { subject: 'Purchasing Power', A: compareData[0]?.ppp * 10, B: compareData[1]?.ppp * 10, fullMark: 15 },
    { subject: 'Cost of Living', A: compareData[0]?.costOfLiving * 10, B: compareData[1]?.costOfLiving * 10, fullMark: 15 },
    { subject: 'Growth Rate', A: compareData[0]?.growth, B: compareData[1]?.growth, fullMark: 15 },
    { subject: 'Relocation Score', A: compareData[0]?.score, B: compareData[1]?.score, fullMark: 10 },
    { subject: 'Tech Hub Density', A: compareData[0]?.records / 100, B: compareData[1]?.records / 100, fullMark: 15 },
  ] : [];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
         <button onClick={() => router.back()} className="flex items-center text-gray-400 hover:text-white transition-colors text-sm font-bold">
           <ChevronLeft className="h-4 w-4 mr-1" /> Back
         </button>
         <h1 className="text-2xl font-black text-white">Compare Locations</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
         {[0, 1].map(index => (
            <Card key={index} className="p-4 bg-card border-none shadow-sm flex items-center gap-4">
               <div className="bg-[#1F2937] p-3 rounded-xl">
                  <MapPin className="h-5 w-5 text-blue-500" />
               </div>
               <div className="flex-1">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Location {index + 1}</p>
                  <select 
                     value={selectedLocs[index] || ''} 
                     onChange={(e) => handleSelect(index, e.target.value)}
                     className="w-full bg-transparent text-white font-bold text-lg focus:outline-none appearance-none cursor-pointer"
                  >
                     <option value="" disabled>Select city</option>
                     {locations.map(l => (
                        <option key={l.id} value={l.city.toLowerCase().replace(/ /g, '-')}>
                           {l.city}, {l.country}
                        </option>
                     ))}
                  </select>
               </div>
            </Card>
         ))}
      </div>

      {loading ? (
         <div className="text-center p-12 text-white">Loading comparison data...</div>
      ) : compareData.length >= 2 ? (
         <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <Card className="p-8 bg-[#1F2937] border-none shadow-sm text-center">
               <h3 className="text-lg font-black text-white mb-8">Metrics Radar</h3>
               <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                        <PolarGrid stroke="#374151" />
                        <PolarAngleAxis dataKey="subject" tick={{fill: '#9ca3af', fontSize: 10, fontWeight: 700}} />
                        <PolarRadiusAxis angle={30} domain={[0, 15]} tick={false} axisLine={false} />
                        <Radar name={compareData[0].city} dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} strokeWidth={2} />
                        <Radar name={compareData[1].city} dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.4} strokeWidth={2} />
                        <Legend wrapperStyle={{paddingTop: '20px', fontSize: '12px', fontWeight: 'bold'}} />
                     </RadarChart>
                  </ResponsiveContainer>
               </div>
            </Card>

            <div className="space-y-6">
               <Card className="p-6 bg-card border-none shadow-sm">
                  <h3 className="text-sm font-black text-white mb-6 uppercase tracking-widest text-center">Median Total Compensation</h3>
                  <div className="h-[120px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={compareData} layout="vertical">
                           <XAxis type="number" hide />
                           <YAxis dataKey="city" type="category" axisLine={false} tickLine={false} tick={{fill: '#fff', fontSize: 12, fontWeight: 700}} width={100} />
                           <Bar dataKey="median" radius={[0, 4, 4, 0]}>
                              {compareData.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#10b981'} />
                              ))}
                           </Bar>
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
               </Card>
               <Card className="p-6 bg-card border-none shadow-sm">
                  <h3 className="text-sm font-black text-white mb-6 uppercase tracking-widest text-center">Purchasing Power (Adjusted TC)</h3>
                  <div className="h-[120px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={compareData} layout="vertical">
                           <XAxis type="number" hide />
                           <YAxis dataKey="city" type="category" axisLine={false} tickLine={false} tick={{fill: '#fff', fontSize: 12, fontWeight: 700}} width={100} />
                           <Bar dataKey="adjusted" radius={[0, 4, 4, 0]}>
                              {compareData.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#10b981'} />
                              ))}
                           </Bar>
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
               </Card>
               <Card className="p-6 bg-card border-none shadow-sm">
                  <h3 className="text-sm font-black text-white mb-6 uppercase tracking-widest text-center">Cost of Living Index</h3>
                  <div className="h-[120px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={compareData} layout="vertical">
                           <XAxis type="number" hide />
                           <YAxis dataKey="city" type="category" axisLine={false} tickLine={false} tick={{fill: '#fff', fontSize: 12, fontWeight: 700}} width={100} />
                           <Bar dataKey="costOfLiving" radius={[0, 4, 4, 0]}>
                              {compareData.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#10b981'} />
                              ))}
                           </Bar>
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
               </Card>
            </div>
         </div>
      ) : (
         <div className="text-center p-12 text-rose-500">Could not load comparison data.</div>
      )}
    </div>
  );
}

export default function CompareLocationsPage() {
  return (
    <Suspense fallback={<div className="text-center p-12 text-white">Loading comparison...</div>}>
      <CompareLocationsContent />
    </Suspense>
  );
}
