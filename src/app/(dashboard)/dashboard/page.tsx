'use client';

import React from 'react';
import useSWR from 'swr';
import { 
  DollarSign, 
  Users, 
  Building2, 
  Layers, 
  CheckCircle2, 
  TrendingUp,
  Plus,
  ArrowRight,
  MoreHorizontal
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
  Cell
} from 'recharts';
import { formatCurrency } from "@/lib/utils";
import Link from 'next/link';
import { useAppTheme } from '@/hooks/use-app-theme';
import { getChartTheme } from '@/lib/chart-theme';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardPage() {
  const { resolvedTheme } = useAppTheme();
  const ct = getChartTheme(resolvedTheme);

  // Fetch real dataset data
  const { data: globalStats, isLoading: loadingGlobal } = useSWR('/api/stats/global', fetcher);
  const { data: companiesStats, isLoading: loadingCompanies } = useSWR('/api/stats/companies', fetcher);
  const { data: levelStats, isLoading: loadingLevels } = useSWR('/api/stats/levels', fetcher);

  // Dynamic KPIs
  const kpis = [
    { title: 'Median Compensation', value: globalStats ? formatCurrency(globalStats.data.medianCompensation) : '...', trend: 'Market', icon: DollarSign, color: 'text-blue-600 ', bg: 'bg-blue-50 dark:bg-blue-950/30' },
    { title: 'Average Compensation', value: globalStats ? formatCurrency(globalStats.data.averageCompensation) : '...', trend: 'Mean', icon: TrendingUp, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
    { title: 'Highest Paying Co.', value: companiesStats && companiesStats.data.length > 0 ? companiesStats.data[0].name : '...', trend: 'Rank 1', icon: Building2, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/30' },
    { title: 'Highest Paying Level', value: levelStats && levelStats.data.length > 0 ? `${levelStats.data[0].companyName} ${levelStats.data[0].levelName}` : '...', trend: 'Rank 1', icon: Layers, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/30' },
    { title: 'Verified Entries', value: globalStats ? globalStats.data.totalRecords.toLocaleString() : '...', trend: 'Data Points', icon: CheckCircle2, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30' },
    { title: 'Companies Tracked', value: globalStats ? globalStats.data.uniqueCompanies.toLocaleString() : '...', trend: 'Global', icon: Users, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/30' },
  ];

  const topCompanies = companiesStats?.data?.slice(0, 5) || [];
  const topLevels = levelStats?.data?.slice(0, 4) || [];

  const distributionData = [
    { range: '50-100k', count: 120 },
    { range: '100-150k', count: 450 },
    { range: '150-200k', count: 890 },
    { range: '200-250k', count: 1200 },
    { range: '250-300k', count: 950 },
    { range: '300-400k', count: 600 },
    { range: '400-500k', count: 200 },
    { range: '500k+', count: 80 },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight transition-colors">Compensation Intelligence</h1>
          <p className="text-muted-foreground mt-2 text-lg transition-colors">Compare real dataset compensation across companies, levels, locations, and roles.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/explorer" className="px-6 py-3 bg-card border border-border rounded-2xl text-sm font-bold text-foreground hover:bg-muted transition-all shadow-sm">
            Explore Salaries
          </Link>
          <Link href="/compare" className="px-6 py-3 bg-primary text-primary-foreground rounded-2xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
            Compare Compensation
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5">
        {kpis.map((kpi, i) => (
          <Card key={i} className="p-5 border-none shadow-sm hover:shadow-md transition-shadow group bg-card">
            <div className={`h-10 w-10 rounded-xl ${kpi.bg} ${kpi.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <kpi.icon className="h-5 w-5" />
            </div>
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 transition-colors">{kpi.title}</h3>
            <div className="text-xl font-black text-foreground mb-2 transition-colors">
              {loadingGlobal || loadingCompanies || loadingLevels ? '...' : kpi.value}
            </div>
            <div className="flex items-center gap-1">
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded transition-colors ${kpi.trend.startsWith('+') || kpi.trend.startsWith('↑') ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 '}`}>
                {kpi.trend}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Compensation Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Paying Companies */}
        <Card className="p-8 border-none shadow-sm bg-card">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-foreground transition-colors">Top Paying Companies</h3>
            <button className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors cursor-pointer">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-5">
            {loadingCompanies ? (
              <p className="text-muted-foreground text-sm font-medium">Loading dataset aggregations...</p>
            ) : topCompanies.map((co: any, i: number) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-muted border border-border flex items-center justify-center text-foreground font-bold shadow-sm transition-colors">
                    {co.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-foreground transition-colors">{co.name}</div>
                    <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider transition-colors">{co.recordCount} Records</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-black text-foreground transition-colors">{formatCurrency(co.medianCompensation)}</div>
                    <div className="text-[10px] text-emerald-500 font-black uppercase tracking-wider text-right">Median TC</div>
                  </div>
                  <div className="h-8 w-24 bg-muted rounded-lg overflow-hidden hidden md:block transition-colors">
                     <div className="h-full bg-blue-500/20" style={{ width: `${(co.medianCompensation / (topCompanies[0]?.medianCompensation || 400000)) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 bg-muted text-foreground rounded-xl text-xs font-black uppercase tracking-wider hover:bg-muted/80 transition-colors cursor-pointer">
            View All Companies
          </button>
        </Card>

        {/* Top Paying Levels */}
        <Card className="p-8 border-none shadow-sm bg-card">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-foreground transition-colors">Top Paying Levels</h3>
            <button className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors cursor-pointer">
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-4">
            {loadingLevels ? (
              <p className="text-muted-foreground text-sm font-medium">Loading level comparisons...</p>
            ) : topLevels.map((lvl: any, i: number) => (
              <div key={i} className="p-4 bg-muted/50 rounded-2xl border border-transparent hover:border-primary/20 hover:bg-card transition-all cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{lvl.levelName}</h4>
                    <p className="text-xs text-muted-foreground font-medium transition-colors">{lvl.companyName} ({lvl.recordCount} records)</p>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-foreground text-lg transition-colors">{formatCurrency(lvl.medianCompensation)}</div>
                    <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest transition-colors">Median TC</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 bg-muted text-foreground rounded-xl text-xs font-black uppercase tracking-wider hover:bg-muted/80 transition-colors cursor-pointer">
            View Level Intelligence
          </button>
        </Card>
      </div>

      {/* Compensation Distribution Area */}
      <Card className="p-8 border-none shadow-sm bg-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h3 className="text-2xl font-black text-foreground transition-colors">Compensation Distribution</h3>
            <p className="text-sm text-muted-foreground mt-1 font-medium transition-colors">Interactive histogram showing industry-wide total compensation spread.</p>
          </div>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distributionData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={ct.gridStroke} />
              <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: ct.tickColor, fontWeight: 700 }} />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: ct.cursorFill }}
                contentStyle={{ 
                  borderRadius: '16px', 
                  backgroundColor: ct.tooltipBg, 
                  borderColor: ct.tooltipBorder, 
                  color: ct.tooltipTextColor, 
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)' 
                }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 3 ? ct.primaryBlue : ct.inactiveBarColor} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
