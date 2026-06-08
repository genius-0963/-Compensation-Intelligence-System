import React, { useEffect } from 'react';
import { X, CheckCircle2, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Card } from '../ui/card';

interface BulkCompareDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEntries: any[];
}

export function BulkCompareDrawer({ isOpen, onClose, selectedEntries }: BulkCompareDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 transition-opacity animate-in fade-in" 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-3xl bg-card border-l border-border z-50 shadow-2xl flex flex-col animate-in slide-in-from-right-full duration-300">
        <div className="flex items-center justify-between p-6 border-b border-border bg-[#0B1020]">
          <div>
            <h2 className="text-lg font-black text-white">Bulk Comparison</h2>
            <p className="text-xs font-bold text-slate-400 mt-1">Comparing {selectedEntries.length} selected records</p>
          </div>
          <button 
            onClick={onClose}
            className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#172033] transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-[#050816]">
          {/* Compare Table */}
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0B1020]">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-r border-border w-1/4">Metric</th>
                  {selectedEntries.map((entry, idx) => (
                    <th key={idx} className="px-6 py-4 border-b border-r border-border min-w-[200px] last:border-r-0">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-[#050816] border border-border flex items-center justify-center text-white font-bold text-[10px] shadow-sm">
                          {entry.company.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm flex items-center gap-1.5">
                            {entry.company.name}
                            {entry.isVerified && <CheckCircle2 className="h-3 w-3 text-blue-600" />}
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{entry.level.name}</div>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                <tr className="hover:bg-[#172033] transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-400 border-r border-border bg-[#0B1020]">Total Comp</td>
                  {selectedEntries.map((entry, idx) => (
                    <td key={idx} className="px-6 py-4 border-r border-border font-black text-white text-lg last:border-r-0">
                      {formatCurrency(entry.totalCompensation)}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-[#172033] transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-400 border-r border-border bg-[#0B1020]">Base Salary</td>
                  {selectedEntries.map((entry, idx) => (
                    <td key={idx} className="px-6 py-4 border-r border-border font-medium text-slate-300 last:border-r-0">
                      {formatCurrency(entry.baseSalary)}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-[#172033] transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-400 border-r border-border bg-[#0B1020]">Stock (RSU)</td>
                  {selectedEntries.map((entry, idx) => (
                    <td key={idx} className="px-6 py-4 border-r border-border font-medium text-slate-300 last:border-r-0">
                      {formatCurrency(entry.stock)}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-[#172033] transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-400 border-r border-border bg-[#0B1020]">Bonus</td>
                  {selectedEntries.map((entry, idx) => (
                    <td key={idx} className="px-6 py-4 border-r border-border font-medium text-slate-300 last:border-r-0">
                      {formatCurrency(entry.bonus)}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-[#172033] transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-400 border-r border-border bg-[#0B1020]">Location</td>
                  {selectedEntries.map((entry, idx) => (
                    <td key={idx} className="px-6 py-4 border-r border-border font-medium text-slate-300 last:border-r-0">
                      {entry.location.city}, {entry.location.country}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-[#172033] transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-400 border-r border-border bg-[#0B1020]">Experience</td>
                  {selectedEntries.map((entry, idx) => (
                    <td key={idx} className="px-6 py-4 border-r border-border font-medium text-slate-300 last:border-r-0">
                      {entry.yearsExperience} years
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          
          <Card className="p-6 border-none bg-blue-900/20 shadow-none">
             <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <h3 className="font-bold text-white">Comparison Insights</h3>
             </div>
             <p className="text-sm text-slate-300 leading-relaxed">
               The highest total compensation in this selection is <span className="font-bold text-white">{formatCurrency(Math.max(...selectedEntries.map(e => e.totalCompensation)))}</span>, which is <span className="font-bold text-emerald-400">{(((Math.max(...selectedEntries.map(e => e.totalCompensation)) / Math.min(...selectedEntries.map(e => e.totalCompensation))) - 1) * 100).toFixed(1)}%</span> higher than the lowest. 
               Stock awards make up a significant portion of the variance.
             </p>
          </Card>
        </div>
      </div>
    </>
  );
}
