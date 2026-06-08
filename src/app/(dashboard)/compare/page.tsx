"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Target, 
  MapPin, 
  Scale, 
  Check, 
  ChevronRight, 
  Plus, 
  X, 
  ArrowRight,
  Zap,
  BarChart3,
  PieChart as PieChartIcon,
  ShieldCheck,
  BrainCircuit,
  TrendingUp,
  Download
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
  Legend,
  Cell
} from 'recharts';
import { formatCurrency } from "@/lib/utils";

export default function ComparePage() {
  const [step, setStep] = useState(1);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const stepsList = [
    { num: 1, label: 'Select Companies' },
    { num: 2, label: 'Select Levels' },
    { num: 3, label: 'Select Locations' },
    { num: 4, label: 'Generate Comparison' }
  ];

  const progressPercentage = Math.round(((step - 1) / 3) * 100);

  // Mock Options
  const companies = [
    { id: 'google', name: 'Google', logo: 'G' },
    { id: 'meta', name: 'Meta', logo: 'M' },
    { id: 'amazon', name: 'Amazon', logo: 'A' },
    { id: 'microsoft', name: 'Microsoft', logo: 'M' },
    { id: 'netflix', name: 'Netflix', logo: 'N' },
    { id: 'apple', name: 'Apple', logo: 'A' },
  ];

  const levels: Record<string, string[]> = {
    google: ['L3', 'L4', 'L5', 'L6', 'L7'],
    meta: ['E3', 'E4', 'E5', 'E6', 'E7'],
    amazon: ['SDE1', 'SDE2', 'SDE3', 'Principal'],
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else setShowResults(true);
  };

  const toggleCompany = (id: string) => {
    if (selectedCompanies.includes(id)) {
      setSelectedCompanies(selectedCompanies.filter(c => c !== id));
    } else if (selectedCompanies.length < 3) {
      setSelectedCompanies([...selectedCompanies, id]);
    }
  };

  const setLevel = (coId: string, lvl: string) => {
    setSelectedLevels({ ...selectedLevels, [coId]: lvl });
  };

  // Mock Result Data
  const compareData = [
    { name: 'Base', google: 190000, meta: 185000, amazon: 165000 },
    { name: 'Bonus', google: 35000, meta: 40000, amazon: 25000 },
    { name: 'Stock', google: 120000, meta: 150000, amazon: 220000 },
  ];

  if (showResults) {
    return (
      <div className="space-y-8 pb-20 animate-fade-up">
        {/* Comparison Header */}
        <div className="flex items-center justify-between">
           <div>
              <button onClick={() => setShowResults(false)} className="text-xs font-black text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-1">
                 <ArrowRight className="h-3 w-3 rotate-180" /> Back to Builder
              </button>
              <h1 className="text-3xl font-black text-white tracking-tight">Compensation Analysis</h1>
           </div>
           <div className="flex items-center gap-3">
              <button className="h-10 px-4 bg-card border border-border rounded-xl text-xs font-black uppercase tracking-widest text-gray-700 flex items-center gap-2">
                 <Download className="h-4 w-4" /> Export Report
              </button>
              <button className="h-10 px-5 bg-[#1F2937] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
                 <Plus className="h-4 w-4" /> Save Comparison
              </button>
           </div>
        </div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {selectedCompanies.map((coId, i) => {
              const co = companies.find(c => c.id === coId)!;
              const lvl = selectedLevels[coId] || 'L5';
              const total = coId === 'amazon' ? 410000 : coId === 'meta' ? 375000 : 345000;
              return (
                <Card key={coId} className={`p-8 border-none shadow-sm relative overflow-hidden ${i === 1 ? 'bg-blue-50/20' : 'bg-card'}`}>
                   <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                         <div className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center font-black text-white shadow-sm">{co.logo}</div>
                         <div>
                            <h3 className="font-black text-white">{co.name}</h3>
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{lvl} Package</span>
                         </div>
                      </div>
                      {i === 1 && <div className="bg-blue-600 text-white px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">Recommended</div>}
                   </div>

                   <div className="space-y-6">
                      <div>
                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Total Compensation</span>
                         <div className="text-3xl font-black text-white">{formatCurrency(total)}</div>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-border">
                         <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-500 uppercase tracking-widest">Base Salary</span>
                            <span className="text-white">{formatCurrency(total * 0.5)}</span>
                         </div>
                         <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-500 uppercase tracking-widest">Annual Bonus</span>
                            <span className="text-white">{formatCurrency(total * 0.1)}</span>
                         </div>
                         <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-500 uppercase tracking-widest">Stock (RSUs)</span>
                            <span className="text-white">{formatCurrency(total * 0.4)}</span>
                         </div>
                      </div>
                   </div>
                </Card>
              );
           })}
        </div>

        {/* Visualization Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <Card className="lg:col-span-8 p-8 border-none shadow-sm bg-card">
              <div className="flex items-center justify-between mb-10">
                 <h3 className="text-xl font-black text-white">Package Composition</h3>
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-blue-600" /><span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Base</span></div>
                    <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-emerald-500" /><span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Bonus</span></div>
                    <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-violet-600" /><span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Stock</span></div>
                 </div>
              </div>
              <div className="h-[350px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={compareData}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#9ca3af'}} />
                       <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#9ca3af'}} tickFormatter={(v) => `$${v/1000}k`} />
                       <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.06)'}} />
                       <Bar dataKey="google" fill="#2563eb" radius={[6, 6, 0, 0]} />
                       <Bar dataKey="meta" fill="#10b981" radius={[6, 6, 0, 0]} />
                       <Bar dataKey="amazon" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </Card>

           <div className="lg:col-span-4 space-y-6">
              {/* AI Insights Panel */}
              <Card className="p-6 border-none shadow-sm bg-[#1F2937] text-white relative overflow-hidden">
                 <div className="flex items-center gap-2 mb-6">
                    <BrainCircuit className="h-5 w-5 text-blue-400" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-blue-400">AI Intelligence</h3>
                 </div>
                 <div className="space-y-4 relative z-10">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                       <p className="text-xs font-medium leading-relaxed">
                          <span className="font-black text-white">Meta E5</span> pays 15.4% higher than Google L5 for this location.
                       </p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                       <p className="text-xs font-medium leading-relaxed">
                          <span className="font-black text-white">Amazon</span> package is heavily stock-weighted (52%), offering higher upside in bull markets.
                       </p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                       <p className="text-xs font-medium leading-relaxed">
                          <span className="font-black text-white">Microsoft</span> provides lower stock but has the strongest base salary retention.
                       </p>
                    </div>
                 </div>
                 <Zap className="absolute -bottom-6 -right-6 h-32 w-32 text-white/5" />
              </Card>

              <Card className="p-6 border-none shadow-sm bg-card">
                 <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Negotiation Tip</h3>
                 <p className="text-sm font-bold text-white leading-relaxed mb-6">
                    Use the Amazon SDE3 offer to pressure Google for a higher Sign-on Bonus or L5-Top Tier equity refreshers.
                 </p>
                 <button className="w-full py-3 border border-border rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-[#172033] transition-all">
                    View Negotiation Guide
                 </button>
              </Card>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="text-center">
        <h1 className="text-4xl font-black text-white tracking-tight mb-4">Comparison Builder</h1>
        <p className="text-slate-500 text-lg font-medium">Select target benchmarks to generate side-by-side compensation intelligence.</p>
      </div>

      {/* Animated Progress Stepper */}
      <div className="w-full max-w-3xl mx-auto space-y-12 px-4">
         <div className="flex items-center justify-between">
            <span className="text-sm font-black text-white">Step {step} of 4</span>
            <span className="text-xs font-bold text-blue-400">{progressPercentage}% Complete</span>
         </div>
         
         <div className="relative flex items-center justify-between pb-8">
            {stepsList.map((s) => {
               const isCompleted = step > s.num;
               const isActive = step === s.num;
               
               return (
                  <div key={s.num} className="relative flex flex-col items-center group z-10">
                     <motion.div
                        className={`h-10 w-10 rounded-full flex items-center justify-center font-black text-sm transition-colors border-2 shadow-sm ${
                           isCompleted ? 'bg-blue-600 text-white border-blue-600' :
                           isActive ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]' :
                           'bg-[#1E293B] text-slate-500 border-[#334155]'
                        }`}
                        animate={{ scale: isActive ? 1.15 : 1 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ scale: 1.05 }}
                     >
                        {isCompleted ? (
                           <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                           >
                              <Check className="h-5 w-5" strokeWidth={3} />
                           </motion.div>
                        ) : (
                           s.num
                        )}
                     </motion.div>
                     <span className={`absolute top-14 w-32 text-center text-[10px] font-black uppercase tracking-widest transition-colors ${
                        isActive ? 'text-blue-400' : isCompleted ? 'text-white' : 'text-slate-600'
                     }`}>
                        {s.label}
                     </span>
                  </div>
               );
            })}

            {/* Background Track */}
            <div className="absolute top-5 left-5 right-5 h-[2px] bg-[#334155] -z-10" />
            
            {/* Animated Fill Track */}
            <div className="absolute top-5 left-5 right-5 h-[2px] -z-10 flex">
               <motion.div 
                  className="h-full bg-blue-600 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
               />
            </div>
         </div>
      </div>

      <Card className="p-10 border-none shadow-premium bg-card min-h-[400px] flex flex-col">
         {step === 1 && (
           <div className="space-y-8 animate-fade-up">
              <div>
                 <h2 className="text-2xl font-black text-white mb-2">Step 1: Select Companies</h2>
                 <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Choose up to 3 organizations to compare</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                 {companies.map((co) => (
                   <button 
                    key={co.id}
                    onClick={() => toggleCompany(co.id)}
                    className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 group ${
                      selectedCompanies.includes(co.id) ? 'border-blue-600 bg-[#1E3A8A]/20 shadow-md' : 'border-border hover:border-blue-200'
                    }`}
                   >
                     <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm ${
                       selectedCompanies.includes(co.id) ? 'bg-blue-600 text-white' : 'bg-[#0B1020] text-white group-hover:scale-110'
                     }`}>
                       {co.logo}
                     </div>
                     <span className={`font-bold text-sm ${selectedCompanies.includes(co.id) ? 'text-blue-900' : 'text-slate-500'}`}>{co.name}</span>
                   </button>
                 ))}
              </div>
           </div>
         )}

         {step === 2 && (
           <div className="space-y-8 animate-fade-up">
              <div>
                 <h2 className="text-2xl font-black text-white mb-2">Step 2: Define Levels</h2>
                 <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Match equivalent internal levels for accuracy</p>
              </div>
              <div className="space-y-6">
                 {selectedCompanies.map((coId) => (
                   <div key={coId} className="flex items-center gap-6 p-4 bg-[#0B1020] rounded-2xl">
                      <div className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center font-black text-white shadow-sm shrink-0">
                         {companies.find(c => c.id === coId)?.logo}
                      </div>
                      <div className="flex-1">
                         <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{companies.find(c => c.id === coId)?.name} Level</div>
                         <div className="flex flex-wrap gap-2">
                            {(levels[coId] || levels.google).map((lvl) => (
                              <button 
                                key={lvl}
                                onClick={() => setLevel(coId, lvl)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                  selectedLevels[coId] === lvl ? 'bg-blue-600 text-white shadow-md' : 'bg-card border border-border text-slate-400 hover:bg-[#172033]'
                                }`}
                              >
                                {lvl}
                              </button>
                            ))}
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
         )}

         {step === 3 && (
            <div className="space-y-8 animate-fade-up">
               <div>
                  <h2 className="text-2xl font-black text-white mb-2">Step 3: Select Location</h2>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Localize benchmarks and adjustments</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['San Francisco, CA', 'New York, NY', 'Seattle, WA', 'London, UK', 'Bangalore, IN', 'Berlin, DE'].map((loc) => (
                    <button key={loc} className="p-4 bg-[#0B1020] border border-border rounded-2xl flex items-center gap-3 hover:bg-[#1E3A8A]/50 hover:border-blue-200 transition-all text-sm font-bold text-gray-700">
                       <MapPin className="h-4 w-4 text-gray-400" />
                       {loc}
                    </button>
                  ))}
               </div>
            </div>
         )}

         {step === 4 && (
            <div className="space-y-8 animate-fade-up text-center py-10">
               <div className="h-20 w-20 rounded-[32px] bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Scale className="h-10 w-10" />
               </div>
               <div>
                  <h2 className="text-3xl font-black text-white mb-2">Ready to Compare</h2>
                  <p className="text-sm text-slate-500 font-medium max-w-sm mx-auto">We've gathered data for {selectedCompanies.length} companies across {Object.keys(selectedLevels).length} specified levels.</p>
               </div>
               <div className="flex flex-wrap justify-center gap-3">
                  {selectedCompanies.map(id => (
                    <div key={id} className="px-3 py-1.5 bg-[#111827] rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       {companies.find(c => c.id === id)?.name} {selectedLevels[id]}
                    </div>
                  ))}
               </div>
            </div>
         )}

         <div className="mt-auto pt-10 flex items-center justify-between border-t border-border">
            <button 
               onClick={() => step > 1 && setStep(step - 1)}
               className={`text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors ${step === 1 ? 'opacity-0' : ''}`}
            >
               Previous
            </button>
            <button 
               onClick={handleNext}
               disabled={step === 1 && selectedCompanies.length === 0}
               className="h-12 px-8 bg-blue-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
               {step === 4 ? 'Run Comparison' : 'Next Step'}
               <ChevronRight className="h-4 w-4" />
            </button>
         </div>
      </Card>
    </div>
  );
}
