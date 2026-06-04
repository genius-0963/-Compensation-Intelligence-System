'use client';

import React from 'react';
import { Zap, Shield, Cpu, Users, BarChart3, Check } from 'lucide-react';

export function ComparisonMatrix() {
  const metrics = [
    { name: 'Build Speed', icon: Zap, a: '1.2s', b: '0.4s', win: 'b' },
    { name: 'Deploy Time', icon: BarChart3, a: '45s', b: '12s', win: 'b' },
    { name: 'Performance', icon: Cpu, a: '92/100', b: '99/100', win: 'b' },
    { name: 'Security Score', icon: Shield, a: 'A-', b: 'A+', win: 'b' },
    { name: 'Team Size', icon: Users, a: '12 Members', b: '24 Members', win: 'b' },
  ];

  return (
    <div className="py-12">
      <div className="flex flex-col items-center text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">Workspace Optimization</h2>
        <p className="text-sm text-gray-500 mt-2 max-w-xl">Compare performance and resource allocation across your different deployment environments.</p>
      </div>

      <div className="max-w-4xl mx-auto bg-white border border-gray-100 rounded-[32px] shadow-premium overflow-hidden">
        <div className="grid grid-cols-3 border-b border-gray-50">
          <div className="p-8 bg-gray-50/50 border-r border-gray-50">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Metric</span>
          </div>
          <div className="p-8 text-center border-r border-gray-50">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Standard</span>
            <h4 className="font-bold text-gray-900">Workspace A</h4>
          </div>
          <div className="p-8 text-center bg-blue-50/30">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-600 text-[10px] font-bold text-white uppercase tracking-wider mb-2">
              <Zap className="h-2.5 w-2.5" />
              Optimized
            </div>
            <h4 className="font-bold text-blue-900">Workspace B</h4>
          </div>
        </div>

        {metrics.map((m, i) => (
          <div key={i} className="grid grid-cols-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/30 transition-colors">
            <div className="p-6 flex items-center gap-3 border-r border-gray-50">
              <div className="h-10 w-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 shadow-sm">
                <m.icon className="h-5 w-5" />
              </div>
              <span className="font-bold text-gray-700 text-sm">{m.name}</span>
            </div>
            
            <div className="p-6 flex items-center justify-center text-sm font-medium text-gray-500 border-r border-gray-50">
              {m.a}
            </div>
            
            <div className="p-6 flex items-center justify-center gap-3 bg-blue-50/10">
              <span className="text-sm font-bold text-blue-600">{m.b}</span>
              {m.win === 'b' && (
                <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="p-8 bg-gray-50/50 flex items-center justify-between">
          <p className="text-xs text-gray-400 font-medium italic">Data synced 5 minutes ago.</p>
          <button className="px-6 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95">
            Optimize Workspace A
          </button>
        </div>
      </div>
    </div>
  );
}
