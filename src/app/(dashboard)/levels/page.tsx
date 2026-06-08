"use client";

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ArrowDown, 
  ArrowRight,
  Zap,
  ShieldCheck,
  BrainCircuit,
  Calculator,
  Search,
  Scale
} from 'lucide-react';
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
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

interface LevelMapping {
  normalizedRank: number;
  levels: {
    companyId: string;
    companyName: string;
    levelName: string;
    levelCode: string;
  }[];
}

interface Intelligence {
  rank: number;
  medianBase: number;
  medianBonus: number;
  medianStock: number;
  medianTotal: number;
  dataPoints: number;
  promotionDelta: number;
}

export default function LevelsPage() {
  const [targetLevel, setTargetLevel] = useState(5);
  const [mapping, setMapping] = useState<LevelMapping[]>([]);
  const [intelligence, setIntelligence] = useState<Intelligence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/levels/mapping').then(r => r.json()),
      fetch('/api/levels/intelligence').then(r => r.json())
    ]).then(([mapRes, intRes]) => {
      if (mapRes.success) setMapping(mapRes.data);
      if (intRes.success) setIntelligence(intRes.data);
      setLoading(false);
    });
  }, []);

  // Helpers
  const getRankName = (rank: number) => {
    const names: Record<number, string> = { 3: 'Entry', 4: 'Mid', 5: 'Senior', 6: 'Staff', 7: 'Principal', 8: 'Distinguished' };
    return names[rank] || `Rank ${rank}`;
  };

  const getTargetComp = () => {
    const match = intelligence.find(i => i.rank === targetLevel);
    return match ? match.medianTotal : 0;
  };

  // Find unique companies for matrix columns
  const companiesInMapping = Array.from(new Set(
    mapping.flatMap(m => m.levels.map(l => l.companyName))
  )).slice(0, 5); // Limit to top 5 for UI spacing

  if (loading) {
    return <div className="p-20 text-center text-muted-foreground animate-pulse font-black uppercase tracking-widest">Loading Intelligence Engine...</div>;
  }

  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight transition-colors">Level Intelligence Engine</h1>
          <p className="text-muted-foreground mt-1 font-medium transition-colors">Live compensation aggregations mapped to standardized career ranks.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <input type="text" placeholder="Search level (e.g. L4)..." className="h-10 pl-9 pr-4 bg-card border border-border rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/20 outline-none shadow-sm transition-all w-64" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Ladder & Simulator */}
        <div className="lg:col-span-6 space-y-8">
          
           {/* Section 2: Career Ladder (Live Data) */}
           <h3 className="text-xl font-black text-foreground mb-6 flex items-center gap-3 transition-colors">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-500" />
              Live Career Ladder
           </h3>
           
           <div className="relative space-y-4">
              {intelligence.map((step, i) => (
                <div key={step.rank} className="relative group">
                   <div className="absolute left-[-1.5rem] top-1/2 -translate-y-1/2 w-4 h-0.5 bg-border group-hover:bg-blue-600 transition-colors hidden sm:block" />
                   
                   <Card className="border-border shadow-sm bg-card hover:shadow-md transition-all hover:translate-x-1 sm:hover:translate-x-2 hover:border-blue-500/30 overflow-hidden group">
                      <div className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                           <div className="flex items-center gap-4 sm:gap-6">
                              <div className={`h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center font-black text-lg transition-colors ${
                                step.rank === 5 ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-muted text-muted-foreground'
                              }`}>
                                 L{step.rank}
                              </div>
                              <div>
                                 <h4 className="font-black text-foreground text-lg transition-colors">{getRankName(step.rank)}</h4>
                                 <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest transition-colors">Based on {step.dataPoints} records</span>
                              </div>
                           </div>
                           <div className="text-left sm:text-right">
                              <div className="text-2xl font-black text-foreground transition-colors">{formatCurrency(step.medianTotal)}</div>
                              {step.promotionDelta > 0 && (
                                <div className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mt-1 sm:mt-0 transition-colors">
                                   +{step.promotionDelta.toFixed(1)}% Promotion Jump
                                </div>
                              )}
                           </div>
                        </div>
                      </div>
                      
                      <div className="border-t border-border bg-muted/30 px-6 py-3 flex flex-wrap items-center justify-between gap-4 transition-colors">
                         <div className="flex items-center gap-2">
                            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest transition-colors">Median Stock</div>
                            <div className="text-sm font-bold text-foreground transition-colors">{formatCurrency(step.medianStock)}</div>
                         </div>
                         <div className="flex items-center gap-2">
                            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest transition-colors">Base Pay</div>
                            <div className="text-sm font-bold text-foreground transition-colors">{formatCurrency(step.medianBase)}</div>
                         </div>
                      </div>
                   </Card>
                   
                   {i < intelligence.length - 1 && (
                     <div className="flex justify-center py-3 text-muted-foreground transition-colors">
                        <ArrowDown className="h-5 w-5" />
                     </div>
                   )}
                </div>
              ))}
           </div>

           {/* Section 6: Growth Simulator */}
           <Card className="p-8 border-none shadow-sm bg-blue-600 text-white relative overflow-hidden transition-colors mt-8">
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-lg transition-colors">
                       <Calculator className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-black transition-colors">Career Growth Simulator</h3>
                 </div>
                 
                 <div className="space-y-6 mb-8">
                    <div>
                       <label className="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-3 block transition-colors">Select Target Level</label>
                       <div className="flex flex-wrap gap-2">
                          {intelligence.map(l => (
                            <button 
                              key={l.rank}
                              onClick={() => setTargetLevel(l.rank)}
                              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                                targetLevel === l.rank ? 'bg-white text-blue-600 shadow-xl' : 'bg-blue-700 border border-blue-500 text-white hover:bg-blue-800'
                              }`}
                            >
                               {getRankName(l.rank)} (L{l.rank})
                            </button>
                          ))}
                       </div>
                    </div>
                    
                    <div className="p-5 bg-blue-700/50 rounded-2xl border border-blue-500/50 transition-colors">
                       <div className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-1 transition-colors">Projected Total Compensation</div>
                       <div className="text-4xl font-black transition-colors">{formatCurrency(getTargetComp())}</div>
                       <p className="text-xs text-blue-200 mt-3 font-medium transition-colors">This projection is backed by real-time median data for Rank {targetLevel} roles globally.</p>
                    </div>
                 </div>

                 <button className="w-full py-4 bg-white text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer">
                    Simulate Strategy
                    <ArrowRight className="h-4 w-4" />
                 </button>
              </div>
              <BrainCircuit className="absolute -bottom-10 -right-10 h-48 w-48 text-blue-700/50 rotate-12 transition-colors" />
           </Card>

        </div>

        {/* RIGHT COLUMN: Equivalency & Insights */}
        <div className="lg:col-span-6 space-y-8">
          
           {/* Section 1: Equivalency Matrix */}
           <Card className="p-6 border-none shadow-sm bg-card transition-colors">
              <h3 className="text-lg font-black text-foreground mb-6 flex items-center gap-2 transition-colors">
                 <Scale className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                 Dynamic Equivalency Matrix
              </h3>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="border-b border-border">
                          <th className="pb-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest transition-colors">Rank</th>
                          {companiesInMapping.map(company => (
                             <th key={company} className="pb-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest transition-colors">{company}</th>
                          ))}
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                       {mapping.map((m) => (
                         <tr key={m.normalizedRank}>
                            <td className="py-4 font-black text-foreground text-xs transition-colors">Rank {m.normalizedRank}</td>
                            {companiesInMapping.map(company => {
                               const levelsForCompany = m.levels.filter(l => l.companyName === company);
                               return (
                                  <td key={company} className="py-4 text-xs font-bold text-muted-foreground transition-colors">
                                     {levelsForCompany.length > 0 ? (
                                        <div className="flex flex-col gap-1">
                                           {levelsForCompany.map(lvl => (
                                              <span key={lvl.levelName} className="text-blue-600 dark:text-blue-400 font-black">{lvl.levelName}</span>
                                           ))}
                                        </div>
                                     ) : '-'}
                                  </td>
                               );
                            })}
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </Card>

           {/* Section 3 & 4: Charts */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-6 border-none shadow-sm bg-card transition-colors">
                 <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Total Compensation by Rank</h4>
                 <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={intelligence}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                          <XAxis dataKey="rank" tickFormatter={v => `L${v}`} axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af', fontWeight: 700}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af', fontWeight: 700}} tickFormatter={(v) => `$${v/1000}k`} />
                          <Tooltip contentStyle={{borderRadius: '8px', border: 'none', backgroundColor: '#1E293B', color: '#fff'}} cursor={{fill: 'transparent'}} />
                          <Bar dataKey="medianTotal" radius={[4, 4, 0, 0]}>
                             {intelligence.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.rank === targetLevel ? '#2563eb' : '#334155'} />
                             ))}
                          </Bar>
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
              </Card>

              <Card className="p-6 border-none shadow-sm bg-card transition-colors">
                 <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Promotion Delta (%)</h4>
                 <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={intelligence}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                          <XAxis dataKey="rank" tickFormatter={v => `L${v-1}→L${v}`} axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af', fontWeight: 700}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af', fontWeight: 700}} tickFormatter={(v) => `${v}%`} />
                          <Tooltip contentStyle={{borderRadius: '8px', border: 'none', backgroundColor: '#1E293B', color: '#fff'}} cursor={{fill: 'transparent'}} />
                          <Bar dataKey="promotionDelta" fill="#10b981" radius={[4, 4, 0, 0]} />
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
              </Card>
           </div>

           {/* Section 7/8: AI Career Advisor / Promotion Intelligence */}
           <Card className="p-6 border-none shadow-sm bg-[#111827] text-white relative overflow-hidden transition-colors">
              <div className="flex items-center gap-3 mb-6">
                 <BrainCircuit className="h-5 w-5 text-blue-400" />
                 <h3 className="text-sm font-black uppercase tracking-widest text-blue-400">AI Promotion Intelligence</h3>
              </div>
              <div className="space-y-4 relative z-10">
                 {intelligence.filter(i => i.promotionDelta > 0).map((insight, idx) => (
                    <div key={idx} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                       <p className="text-xs font-medium leading-relaxed text-slate-300">
                          <span className="font-black text-white">Rank {insight.rank - 1} → Rank {insight.rank}</span> represents a <span className="text-emerald-400 font-bold">{insight.promotionDelta.toFixed(1)}% TC increase</span>. 
                          The new median compensation hits <span className="text-white font-bold">{formatCurrency(insight.medianTotal)}</span>, primarily driven by equity refreshers averaging {formatCurrency(insight.medianStock)}.
                       </p>
                    </div>
                 )).slice(-3)} {/* Show top 3 insights */}
                 
                 <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Heuristic Generation</div>
                    <button className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-blue-300">Run Deep AI Analysis →</button>
                 </div>
              </div>
              <Zap className="absolute -bottom-6 -right-6 h-32 w-32 text-blue-900/20" />
           </Card>

        </div>
      </div>
    </div>
  );
}
