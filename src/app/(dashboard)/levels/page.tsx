"use client";

import React, { useState } from 'react';
import { 
  Layers, 
  Target, 
  Search, 
  TrendingUp, 
  ChevronRight, 
  ArrowDown, 
  ArrowRight,
  Zap,
  Briefcase,
  Users,
  ShieldCheck,
  BrainCircuit,
  Calculator,
  Plus,
  Scale
} from 'lucide-react';
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export default function LevelsPage() {
  const [targetLevel, setTargetLevel] = useState(5);

  const ladder = [
    { rank: 3, label: 'Entry', example: 'Google L3', medianTC: 195000, increase: 0, stock: 50000 },
    { rank: 4, label: 'Mid', example: 'Google L4', medianTC: 275000, increase: 41, stock: 85000 },
    { rank: 5, label: 'Senior', example: 'Google L5', medianTC: 385000, increase: 40, stock: 135000 },
    { rank: 6, label: 'Staff', example: 'Google L6', medianTC: 520000, increase: 35, stock: 210000 },
    { rank: 7, label: 'Principal', example: 'Google L7', medianTC: 840000, increase: 61, stock: 450000 },
  ];

  const mappingData = [
    { company: 'Google', l3: 'L3', l4: 'L4', l5: 'L5', l6: 'L6', l7: 'L7' },
    { company: 'Meta', l3: 'E3', l4: 'E4', l5: 'E5', l6: 'E6', l7: 'E7' },
    { company: 'Amazon', l3: 'L4', l4: 'L5', l5: 'L6', l6: 'L7', l7: 'Principal' },
    { company: 'Microsoft', l3: '59', l4: '61', l5: '63', l6: '65', l7: '67' },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Level Intelligence</h1>
          <p className="text-gray-500 mt-1 font-medium">Standardizing career progression across global technology firms.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
             <input type="text" placeholder="Search level (e.g. L4)..." className="h-10 pl-9 pr-4 bg-white border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/10 outline-none shadow-sm" />
          </div>
          <button className="h-10 px-4 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 shadow-lg">
             Compare All Levels
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* 2. Level Progression Ladder (Visual Left) */}
        <div className="lg:col-span-7 space-y-8">
           <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              Standardized Career Ladder
           </h3>
           
           <div className="relative space-y-4">
              {ladder.slice().reverse().map((step, i) => (
                <div key={step.rank} className="relative group">
                   {/* Step Indicator */}
                   <div className="absolute left-[-1.5rem] top-1/2 -translate-y-1/2 w-4 h-0.5 bg-gray-100 group-hover:bg-blue-600 transition-colors" />
                   
                   <Card className="p-6 border-none shadow-sm bg-white hover:shadow-premium transition-all hover:translate-x-2 group-hover:border-blue-100 border border-transparent relative overflow-hidden">
                      <div className="flex items-center justify-between relative z-10">
                         <div className="flex items-center gap-6">
                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                              step.rank === 5 ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-50 text-gray-400'
                            }`}>
                               L{step.rank}
                            </div>
                            <div>
                               <h4 className="font-black text-gray-900 text-lg">{step.label} Level</h4>
                               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Example: {step.example}</span>
                            </div>
                         </div>
                         <div className="text-right">
                            <div className="text-2xl font-black text-gray-900">{formatCurrency(step.medianTC)}</div>
                            {step.increase > 0 && (
                              <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                                 +{step.increase}% Promotion Jump
                              </div>
                            )}
                         </div>
                      </div>
                      
                      {/* Detailed Step Insights on Hover */}
                      <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-8 opacity-0 group-hover:opacity-100 transition-opacity">
                         <div>
                            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Median Stock</div>
                            <div className="text-sm font-bold text-gray-700">{formatCurrency(step.stock)}</div>
                         </div>
                         <div className="h-8 w-px bg-gray-100" />
                         <div>
                            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Market Confidence</div>
                            <div className="flex items-center gap-1">
                               <ShieldCheck className="h-3 w-3 text-emerald-500" />
                               <span className="text-sm font-bold text-gray-700">High</span>
                            </div>
                         </div>
                      </div>
                   </Card>
                   
                   {i < ladder.length - 1 && (
                     <div className="flex justify-center py-2 text-gray-200">
                        <ArrowDown className="h-5 w-5" />
                     </div>
                   )}
                </div>
              ))}
           </div>
        </div>

        {/* 3. Right Panel: Mapping & Simulator */}
        <div className="lg:col-span-5 space-y-8">
           {/* Level Mapping Table */}
           <Card className="p-8 border-none shadow-sm bg-white">
              <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                 <Scale className="h-5 w-5 text-blue-600" />
                 Equivalency Mapping
              </h3>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="border-b border-gray-50">
                          <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Company</th>
                          <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">L4</th>
                          <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">L5</th>
                          <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">L6</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       {mappingData.map((co) => (
                         <tr key={co.company}>
                            <td className="py-4 font-bold text-gray-900 text-xs">{co.company}</td>
                            <td className="py-4 text-center text-xs font-black text-gray-400">{co.l4}</td>
                            <td className="py-4 text-center text-xs font-black text-blue-600">{co.l5}</td>
                            <td className="py-4 text-center text-xs font-black text-gray-400">{co.l6}</td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </Card>

           {/* Career Growth Simulator */}
           <Card className="p-8 border-none shadow-sm bg-gray-900 text-white relative overflow-hidden">
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
                       <Calculator className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-black">Growth Simulator</h3>
                 </div>
                 
                 <div className="space-y-6 mb-8">
                    <div>
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Target Level</label>
                       <div className="flex gap-2">
                          {[4, 5, 6, 7].map(l => (
                            <button 
                              key={l}
                              onClick={() => setTargetLevel(l)}
                              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                                targetLevel === l ? 'bg-white text-gray-900 shadow-xl' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                              }`}
                            >
                               L{l}
                            </button>
                          ))}
                       </div>
                    </div>
                    
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                       <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Projected Total Comp</div>
                       <div className="text-3xl font-black">$520,000</div>
                       <p className="text-[10px] text-gray-400 mt-2 font-medium">Estimated 2.4x growth from your current level.</p>
                    </div>
                 </div>

                 <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-2xl flex items-center justify-center gap-2">
                    Build Career Plan
                    <ArrowRight className="h-4 w-4" />
                 </button>
              </div>
              <BrainCircuit className="absolute -bottom-10 -right-10 h-48 w-48 text-white/5 rotate-12" />
           </Card>

           {/* Promotion Insights */}
           <div className="p-6 bg-blue-50/50 rounded-[32px] border border-blue-100">
              <h4 className="text-xs font-black text-blue-900 uppercase tracking-widest mb-4">Level Up Intelligence</h4>
              <div className="space-y-4">
                 <div className="flex items-start gap-3">
                    <Zap className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs font-medium text-blue-800 leading-relaxed">
                       Promotions from <span className="font-black">L5 → L6</span> typically see the highest percentage increase in <span className="underline underline-offset-2">Equity grants</span> (85%+).
                    </p>
                 </div>
                 <div className="flex items-start gap-3">
                    <Zap className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs font-medium text-blue-800 leading-relaxed">
                       A <span className="font-black">Microsoft 64</span> is statistically equivalent to a <span className="font-black">Google L5</span> in terms of scope and median TC.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
