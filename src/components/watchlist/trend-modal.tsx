"use client";

import React from 'react';
import { Modal } from '@/components/ui/modal';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, TrendingDown, Target, Zap, ShieldAlert } from 'lucide-react';

export type WatchlistItem = {
  name: string;
  category: string;
  median: number;
  change: string;
  trend: 'up' | 'down';
};

interface TrendModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: WatchlistItem | null;
}

export function TrendModal({ isOpen, onClose, item }: TrendModalProps) {
  if (!item) return null;

  // Generate dynamic mock data based on the item's median value
  const baseValue = item.median;
  const competitorBase = baseValue * 0.92; // Competitor is slightly lower

  const chartData = [
    { year: '2023', [item.name]: baseValue * 0.85, Benchmark: competitorBase * 0.82 },
    { year: '2024', [item.name]: baseValue * 0.90, Benchmark: competitorBase * 0.89 },
    { year: '2025', [item.name]: baseValue * 0.96, Benchmark: competitorBase * 0.97 },
    { year: '2026', [item.name]: baseValue, Benchmark: competitorBase * 1.05 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-4 rounded-xl shadow-xl">
          <p className="text-sm font-bold text-foreground mb-3">{label} Compensation</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-6 mb-2 last:mb-0">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-xs font-medium text-muted-foreground">{entry.name}</span>
              </div>
              <span className="text-xs font-black text-foreground">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`${item.name} Market Analysis`}
      className="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Current Median TC</div>
            <div className="text-2xl font-black text-foreground mb-2">{formatCurrency(item.median)}</div>
            <div className={`flex items-center gap-1 text-xs font-bold ${item.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
              {item.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {item.change} YoY
            </div>
          </div>
          <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Market Position</div>
            <div className="text-2xl font-black text-foreground mb-2">Top 8%</div>
            <div className="flex items-center gap-1 text-xs font-bold text-blue-500">
              <Target className="h-4 w-4" />
              Highly Competitive
            </div>
          </div>
          <div className="bg-primary/10 p-4 rounded-xl border border-primary/20">
            <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Insight Engine</div>
            <div className="text-sm font-medium text-foreground mt-2 leading-relaxed">
              {item.name} compensation is outpacing the market benchmark by <span className="font-bold text-primary">14%</span>. Equity grants are highly volatile.
            </div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="bg-card border border-border p-6 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-foreground">Multi-Year Trend Comparison</h3>
              <p className="text-xs text-muted-foreground mt-1">Total Compensation (Base + Bonus + Equity)</p>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-primary" />
                 <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{item.name}</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                 <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Benchmark</span>
               </div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis 
                  dataKey="year" 
                  stroke="#888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => `$${value / 1000}k`}
                  width={60}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey={item.name} 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2 }} 
                  activeDot={{ r: 6, strokeWidth: 0 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="Benchmark" 
                  stroke="#64748b" 
                  strokeWidth={3} 
                  strokeDasharray="5 5"
                  dot={{ r: 4, strokeWidth: 2 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-end gap-3 mt-4">
          <button className="px-6 py-2.5 rounded-xl border border-border text-xs font-black uppercase tracking-widest text-foreground hover:bg-muted transition-colors">
            Configure Alerts
          </button>
          <button className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-colors shadow-lg">
            View Full Report
          </button>
        </div>
      </div>
    </Modal>
  );
}
