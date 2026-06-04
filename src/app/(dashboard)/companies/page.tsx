"use client";

import React, { useState } from 'react';
import { 
  Search, 
  Building2, 
  Users, 
  ArrowUpRight, 
  Filter, 
  ChevronDown,
  Globe,
  ExternalLink,
  Plus
} from 'lucide-react';
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import Link from 'next/link';

export default function CompaniesPage() {
  const [searchQuery, setSearchParams] = useState('');

  const companies = [
    { id: 'google', name: 'Google', industry: 'Technology', employees: '180,000+', medianTC: 320000, growth: '+4.2%', logo: 'G', website: 'google.com' },
    { id: 'meta', name: 'Meta', industry: 'Social Media', employees: '70,000+', medianTC: 315000, growth: '+3.8%', logo: 'M', website: 'meta.com' },
    { id: 'amazon', name: 'Amazon', industry: 'E-commerce', employees: '1,500,000+', medianTC: 295000, growth: '+2.1%', logo: 'A', website: 'amazon.com' },
    { id: 'apple', name: 'Apple', industry: 'Consumer Tech', employees: '160,000+', medianTC: 285000, growth: '+1.5%', logo: 'A', website: 'apple.com' },
    { id: 'netflix', name: 'Netflix', industry: 'Entertainment', employees: '12,000+', medianTC: 450000, growth: '+5.0%', logo: 'N', website: 'netflix.com' },
    { id: 'microsoft', name: 'Microsoft', industry: 'Technology', employees: '220,000+', medianTC: 275000, growth: '+2.4%', logo: 'M', website: 'microsoft.com' },
    { id: 'uber', name: 'Uber', industry: 'Transportation', employees: '30,000+', medianTC: 260000, growth: '+1.8%', logo: 'U', website: 'uber.com' },
    { id: 'airbnb', name: 'Airbnb', industry: 'Hospitality', employees: '6,000+', medianTC: 290000, growth: '+3.2%', logo: 'A', website: 'airbnb.com' },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* 1. Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Company Directory</h1>
          <p className="text-gray-500 mt-1 font-medium">Explore compensation benchmarks by company and industry size.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-11 px-5 bg-white border border-gray-100 rounded-xl text-xs font-black uppercase tracking-widest text-gray-700 hover:bg-gray-50 shadow-sm transition-all">
            Filter Industries
          </button>
          <button className="h-11 px-6 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Company
          </button>
        </div>
      </div>

      {/* 2. Company Search Bar */}
      <Card className="p-2 border-none shadow-sm bg-white overflow-hidden max-w-3xl">
        <div className="flex items-center gap-2">
           <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search companies by name, industry, or size..." 
                className="w-full h-12 bg-transparent border-none pl-12 pr-4 text-sm focus:ring-0 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchParams(e.target.value)}
              />
           </div>
           <div className="h-8 w-px bg-gray-100 mx-2" />
           <button className="h-10 px-4 bg-gray-50 text-gray-400 rounded-lg flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
              <Filter className="h-3.5 w-3.5" />
              All Sizes
              <ChevronDown className="h-3 w-3" />
           </button>
        </div>
      </Card>

      {/* 3. Company Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {companies.map((co) => (
          <Link key={co.id} href={`/companies/${co.id}`}>
            <Card className="p-6 border-none shadow-sm hover:shadow-premium transition-all hover:-translate-y-1 group relative overflow-hidden bg-white">
              {/* Background Ornament */}
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <Building2 className="h-24 w-24 -rotate-12" />
              </div>

              <div className="flex items-start justify-between mb-6">
                <div className="h-12 w-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-900 font-black text-xl shadow-sm group-hover:scale-110 transition-transform">
                  {co.logo}
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-widest mb-1">
                    {co.growth}
                  </div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Median Growth</div>
                </div>
              </div>

              <h3 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors mb-1">{co.name}</h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-6">{co.industry}</p>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-50">
                <div>
                   <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Median TC</div>
                   <div className="text-lg font-black text-gray-900">{formatCurrency(co.medianTC)}</div>
                </div>
                <div className="text-right">
                   <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Headcount</div>
                   <div className="text-lg font-black text-gray-700">{co.employees}</div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between group-hover:translate-x-1 transition-transform">
                 <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">View Intelligence</span>
                 <ArrowUpRight className="h-4 w-4 text-blue-600" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
