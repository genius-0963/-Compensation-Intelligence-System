"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { ChevronLeft, Building2, MapPin, TrendingUp, Users } from 'lucide-react';
import { formatCurrency } from "@/lib/utils";

export default function CountryIntelligencePage() {
  const params = useParams();
  const router = useRouter();
  const countrySlug = params.country as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/locations/country/${countrySlug}`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [countrySlug]);

  if (loading) return <div className="p-8 text-white">Loading Intelligence...</div>;
  if (!data || data.error) return <div className="p-8 text-rose-500">Failed to load data for {countrySlug}</div>;

  return (
    <div className="space-y-8 pb-20">
      <button onClick={() => router.push('/locations')} className="flex items-center text-gray-400 hover:text-white transition-colors text-sm font-bold">
        <ChevronLeft className="h-4 w-4 mr-1" /> Back to Global Intel
      </button>

      <div className="relative w-full h-[300px] rounded-[32px] overflow-hidden">
        {/* We use an unsplash placeholder for the country */}
        <img 
          src={`https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=1600&q=80`}
          alt={data.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020] via-[#0B1020]/60 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-black text-white">{data.name}</h1>
            <p className="text-gray-300 font-medium mt-2">{data.records.toLocaleString()} Verified Compensation Packages</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Median TC</p>
            <p className="text-4xl font-black text-white">{formatCurrency(data.median)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-[#1F2937] border-none shadow-sm text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Adjusted TC</h3>
            <DollarSignIcon className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black">{formatCurrency(data.adjusted)}</p>
          <p className="text-xs text-gray-500 mt-2 font-medium">PPP adjusted purchasing power</p>
        </Card>

        <Card className="p-6 bg-[#1F2937] border-none shadow-sm text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Growth (YoY)</h3>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black">{data.growth}</p>
          <p className="text-xs text-gray-500 mt-2 font-medium">Average across top cities</p>
        </Card>

        <Card className="p-6 bg-[#1F2937] border-none shadow-sm text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Top Employers</h3>
            <Building2 className="h-4 w-4 text-purple-500" />
          </div>
          <p className="text-2xl font-black">{data.companies}+</p>
          <p className="text-xs text-gray-500 mt-2 font-medium">Active hiring companies</p>
        </Card>

        <Card className="p-6 bg-[#1F2937] border-none shadow-sm text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Data Points</h3>
            <Users className="h-4 w-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black">{data.records.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-2 font-medium">Verified submissions</p>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-black text-white mb-6">Top Cities in {data.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.cities.slice(0, 9).map((city: any) => (
            <Card 
              key={city.id} 
              onClick={() => router.push(`/locations/city/${city.city.toLowerCase().replace(/ /g, '-')}`)}
              className="p-6 bg-card border-none shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <h3 className="font-bold text-white group-hover:text-blue-500 transition-colors">{city.city}</h3>
                </div>
                <div className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                  {city.score.toFixed(1)}/10
                </div>
              </div>
              <div className="flex items-end justify-between mt-6">
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Median TC</p>
                  <p className="text-lg font-black text-white">{formatCurrency(city.median)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Offers</p>
                  <p className="text-sm font-bold text-gray-400">{city.records.toLocaleString()}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function DollarSignIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}
