'use client';

import React from 'react';
import { Users, FileText, DollarSign, Activity, TrendingUp, ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface AnalyticsProps {
  stats: any;
  isLoading: boolean;
}

export function WorkspaceAnalytics({ stats, isLoading }: AnalyticsProps) {
  const metrics = [
    {
      title: 'Total Employees',
      value: stats?.employeeCount?.toString() || '0',
      icon: Users,
      trend: '+12%',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Active Offers',
      value: stats?.offerCount?.toString() || '0',
      icon: FileText,
      trend: '+5',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      title: 'Avg Total Comp',
      value: stats?.avgSalary ? formatCurrency(stats.avgSalary) : '$0',
      icon: DollarSign,
      trend: '+2.4%',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      title: 'System Health',
      value: 'Optimal',
      icon: Activity,
      trend: '99.9%',
      color: 'text-amber-500',
      bg: 'bg-amber-50',
    },
  ];

  return (
    <div className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold text-gray-900">Workspace Metrics</h2>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Live</span>
            </div>
          </div>
          <p className="text-sm text-gray-500">Real-time compensation and organizational health data.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 transition-all">
          <TrendingUp className="h-4 w-4 text-blue-600" />
          <span>Detailed Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div 
            key={i}
            className="group bg-white border border-gray-100 rounded-[28px] p-6 hover:shadow-premium transition-all hover:-translate-y-1 relative overflow-hidden"
          >
            {/* Background Accent */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 ${m.bg} opacity-30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`} />
            
            <div className="flex items-center justify-between mb-6">
              <div className={`h-12 w-12 rounded-2xl ${m.bg} ${m.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                <m.icon className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider">
                <ArrowUpRight className="h-3 w-3" />
                {m.trend}
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{m.title}</h3>
              <div className="text-3xl font-black text-gray-900 tracking-tight">
                {isLoading ? (
                  <div className="h-8 w-24 bg-gray-100 animate-pulse rounded-lg" />
                ) : (
                  m.value
                )}
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">vs last month</span>
              <div className="h-1.5 w-12 bg-gray-50 rounded-full overflow-hidden">
                <div className={`h-full ${m.color.replace('text', 'bg')}`} style={{ width: '70%' }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
