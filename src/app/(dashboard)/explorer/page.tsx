"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ArrowUpDown, 
  Download, 
  ExternalLink,
  Briefcase,
  MapPin,
  Clock,
  ChevronRight,
  Plus,
  CheckCircle2,
  Calendar,
  MoreVertical,
  Columns,
  Pin,
  Maximize2
} from 'lucide-react';
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export default function ExplorerPage() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ 
    company: '', 
    role: '', 
    location: '', 
    level: '', 
    verified: false 
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const params = new URLSearchParams({
        ...filters,
        verified: filters.verified.toString()
      });
      const res = await fetch(`/api/compensations?${params.toString()}`);
      const json = await res.json();
      setData(json.entries || []);
      setIsLoading(false);
    };
    fetchData();
  }, [filters]);

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Advanced Filters Bar */}
      <Card className="p-4 border-none shadow-sm bg-white sticky top-0 z-30">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search by company..."
              className="w-full h-10 bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none transition-all"
              value={filters.company}
              onChange={(e) => setFilters(f => ({ ...f, company: e.target.value }))}
            />
          </div>

          <div className="flex items-center gap-2">
            {[
              { label: 'Role Family', icon: Briefcase, key: 'role' },
              { label: 'Location', icon: MapPin, key: 'location' },
              { label: 'Level', icon: Clock, key: 'level' },
            ].map((item) => (
              <button 
                key={item.key}
                className="h-10 px-4 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-600 flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm"
              >
                <item.icon className="h-3.5 w-3.5 text-gray-400" />
                <span>{item.label}</span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-gray-100 mx-1" />

          <button 
            onClick={() => setFilters(f => ({ ...f, verified: !f.verified }))}
            className={`h-10 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm border ${
              filters.verified 
                ? 'bg-blue-600 border-blue-600 text-white' 
                : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <CheckCircle2 className={`h-3.5 w-3.5 ${filters.verified ? 'text-white' : 'text-gray-400'}`} />
            <span>Verified Only</span>
          </button>

          <button className="h-10 w-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-50 shadow-sm">
             <Calendar className="h-4 w-4 text-gray-400" />
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button className="text-[10px] font-black uppercase text-gray-400 hover:text-blue-600 transition-colors px-2">Reset</button>
            <button className="h-10 px-5 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-gray-800 transition-all active:scale-95">
              Save Filter
            </button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* 2. Main Salary Table (Left) */}
        <div className="xl:col-span-9 space-y-4">
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
               <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-500 hover:text-gray-900 transition-colors">
                    <Columns className="h-3.5 w-3.5" />
                    Columns
                  </button>
                  <button className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-500 hover:text-gray-900 transition-colors">
                    <ArrowUpDown className="h-3.5 w-3.5" />
                    Sort
                  </button>
               </div>
               <div className="flex items-center gap-3">
                  <button className="h-8 px-3 bg-white border border-gray-100 rounded-lg text-[10px] font-black uppercase text-gray-600 hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-all">
                    <Download className="h-3 w-3" />
                    Export CSV
                  </button>
                  <button className="h-8 px-3 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase flex items-center gap-2 shadow-md hover:bg-blue-700 transition-all">
                    <Plus className="h-3 w-3" />
                    Bulk Compare
                  </button>
               </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white">
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Company</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Role</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Level</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 text-right">Base</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 text-right">Stock</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 text-right font-black">Total Comp</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 text-center">Exp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isLoading ? (
                    Array(10).fill(0).map((_, i) => (
                      <tr key={i}>
                        <td colSpan={7} className="px-6 py-5">
                          <div className="h-4 bg-gray-50 rounded-full w-full animate-pulse" />
                        </td>
                      </tr>
                    ))
                  ) : (
                    data.map((entry: any) => (
                      <tr key={entry.id} className="hover:bg-blue-50/30 transition-colors group cursor-pointer">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-900 font-bold text-[10px] shadow-sm">
                              {entry.company.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                                {entry.company.name}
                                {entry.isVerified && <CheckCircle2 className="h-3 w-3 text-blue-600" />}
                              </div>
                              <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{entry.location.city}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="text-sm font-medium text-gray-700">{entry.roleFamily.name}</div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="inline-flex items-center px-2 py-0.5 bg-gray-100 rounded text-[10px] font-black text-gray-600 uppercase tracking-widest">
                             {entry.level.name}
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium text-gray-600">
                          {formatCurrency(entry.baseSalary)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium text-gray-600">
                          {formatCurrency(entry.stock)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="text-sm font-black text-gray-900">{formatCurrency(entry.totalCompensation)}</div>
                          <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Annual</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                           <div className="text-xs font-bold text-gray-500">{entry.yearsExperience}y</div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="p-4 border-t border-gray-50 flex items-center justify-between bg-white">
              <span className="text-xs text-gray-500 font-medium">Showing <span className="font-bold text-gray-900">1-20</span> of <span className="font-bold text-gray-900">42,850</span> results</span>
              <div className="flex items-center gap-1">
                 {[1, 2, 3, '...', 12].map((p, i) => (
                   <button key={i} className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${p === 1 ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
                     {p}
                   </button>
                 ))}
              </div>
            </div>
          </Card>
        </div>

        {/* 3. Right Insights Panel */}
        <div className="xl:col-span-3 space-y-6">
          <Card className="p-6 border-none shadow-sm bg-white">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Market Context</h3>
            
            <div className="space-y-6">
              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-50">
                 <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1 block">Median Salary</span>
                 <div className="text-2xl font-black text-gray-900 tracking-tight">$248,000</div>
                 <div className="flex items-center gap-1.5 mt-1 text-[10px] font-bold text-emerald-600">
                    <ArrowUpDown className="h-3 w-3" />
                    +12.4% vs Avg
                 </div>
              </div>

              <div className="p-4 bg-violet-50/50 rounded-2xl border border-violet-50">
                 <span className="text-[10px] font-black text-violet-600 uppercase tracking-widest mb-1 block">90th Percentile</span>
                 <div className="text-2xl font-black text-gray-900 tracking-tight">$485,000</div>
                 <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-600" style={{ width: '90%' }} />
                 </div>
              </div>

              <div className="space-y-4 pt-2">
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500">Top Company</span>
                    <span className="text-xs font-black text-gray-900">Netflix</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500">Highest Stock Ratio</span>
                    <span className="text-xs font-black text-gray-900">Snowflake</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500">Growth Hotspot</span>
                    <span className="text-xs font-black text-gray-900">Austin, TX</span>
                 </div>
              </div>
            </div>

            <button className="w-full mt-8 py-3 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg active:scale-95">
              Generate Detailed Report
            </button>
          </Card>

          <Card className="p-6 border-none shadow-sm bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
             <div className="flex items-center gap-2 mb-4">
                <Maximize2 className="h-4 w-4 text-blue-200" />
                <h3 className="text-xs font-black uppercase tracking-widest">Pro Analytics</h3>
             </div>
             <p className="text-sm font-medium leading-relaxed opacity-90 mb-6">Unlock deep location adjustments and cost-of-living normalization for all entries.</p>
             <button className="w-full py-3 bg-white text-blue-700 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-blue-50 transition-all">
                Upgrade to Pro
             </button>
          </Card>
        </div>
      </div>
    </div>
  );
}
