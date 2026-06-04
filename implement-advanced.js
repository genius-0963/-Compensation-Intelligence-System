const fs = require('fs');
const path = require('path');

const root = '/Users/subh/Documents/Compensation Intelligence System/compensation-intelligence';

const files = {
  // --- AI Insights Service ---
  'src/services/insight.service.ts': `import { prisma } from '@/lib/db';

export class InsightService {
  static async generateInsights(offerId: string) {
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: { role: true, level: true, location: true }
    });
    
    if (!offer) throw new Error("Offer not found");

    const insights = [];

    // 1. Negotiation Leverage Insight
    if (offer.score && offer.score > 85) {
      insights.push({
        type: 'NEGOTIATION',
        title: 'Strong Market Position',
        insight: 'This offer is in the top 15% for this role. The candidate has minimal leverage for base salary negotiation.',
        confidence: 0.92,
        priority: 1
      });
    } else if (offer.score && offer.score < 50) {
      insights.push({
        type: 'NEGOTIATION',
        title: 'High Flight Risk',
        insight: 'Offer is below market P50. Expect aggressive counter-offers. Consider increasing equity to offset base salary gap.',
        confidence: 0.88,
        priority: 1
      });
    }

    // 2. Equity Analysis
    if (offer.equity > 0 && offer.baseSalary > 0) {
      const equityRatio = offer.equity / offer.baseSalary;
      if (equityRatio > 0.3) {
        insights.push({
          type: 'EQUITY_ANALYSIS',
          title: 'Equity Heavy Structure',
          insight: 'The compensation is heavily weighted towards equity. Ensure the candidate understands the vesting schedule and projected valuation.',
          confidence: 0.95,
          priority: 2
        });
      }
    }

    // Save insights to DB
    for (const data of insights) {
      await prisma.negotiationInsight.create({
        data: {
          offerId: offer.id,
          type: data.type as any,
          title: data.title,
          insight: data.insight,
          confidence: data.confidence,
          priority: data.priority,
          metadata: JSON.stringify({ generatedAt: new Date().toISOString() })
        }
      });
    }

    return insights;
  }
}
`,

  // --- Insights API ---
  'src/app/api/insights/route.ts': `import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const offerId = searchParams.get('offerId');
    
    const where = offerId ? { offerId } : {};
    
    const insights = await prisma.negotiationInsight.findMany({
      where,
      include: { offer: { include: { candidate: true } } },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    
    return NextResponse.json(insights);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`,

  // --- Insights Page ---
  'src/app/(dashboard)/insights/page.tsx': `'use client';
import React, { useEffect, useState } from 'react';
import PageHeader from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';

export default function InsightsPage() {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/insights')
      .then(res => res.json())
      .then(data => {
        setInsights(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const getIcon = (type: string) => {
    if (type === 'NEGOTIATION') return <Sparkles className="h-5 w-5 text-violet-400" />;
    if (type === 'EQUITY_ANALYSIS') return <TrendingUp className="h-5 w-5 text-emerald-400" />;
    return <AlertTriangle className="h-5 w-5 text-amber-400" />;
  };

  return (
    <div className="space-y-6">
      <PageHeader title="AI Negotiation Insights" description="AI-driven recommendations for active offers." />
      
      {loading ? (
        <div className="text-slate-400">Loading insights...</div>
      ) : insights.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-slate-500">
            No insights generated yet. Score an offer to generate insights.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insights.map(insight => (
            <Card key={insight.id} className="relative overflow-hidden hover:border-violet-500/30 transition-all group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-violet-600/10 transition-colors"></div>
              <CardHeader className="pb-2 flex flex-row items-start justify-between">
                <div className="bg-slate-950 p-2 rounded-lg border border-white/5">
                  {getIcon(insight.type)}
                </div>
                <Badge variant={insight.confidence > 0.9 ? 'success' : 'warning'}>
                  {(insight.confidence * 100).toFixed(0)}% Confidence
                </Badge>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-lg text-slate-100 mb-2">{insight.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">{insight.insight}</p>
                <div className="text-xs text-slate-500 pt-4 border-t border-white/5">
                  Offer for: <span className="text-slate-300">{insight.offer.candidate?.firstName} {insight.offer.candidate?.lastName}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
`,

  // --- Dashboard Stats API ---
  'src/app/api/dashboard/stats/route.ts': `import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const employeeCount = await prisma.employee.count();
    const offerCount = await prisma.offer.count({ where: { status: { in: ['PENDING', 'DRAFT'] } } });
    
    // Aggregate salary
    const aggregations = await prisma.employee.aggregate({
      _avg: { totalCompensation: true }
    });
    
    // Department headcount
    const departments = await prisma.department.findMany({
      include: { _count: { select: { employees: true } } }
    });
    
    return NextResponse.json({
      employeeCount,
      offerCount,
      avgSalary: aggregations._avg.totalCompensation || 0,
      departments: departments.map(d => ({
        name: d.name,
        count: d._count.employees
      }))
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`,

  // --- Dashboard Charts (Recharts) ---
  'src/components/dashboard/headcount-by-dept.tsx': `'use client';
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function HeadcountByDept() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(stats => setData(stats.departments || []))
      .catch(console.error);
  }, []);

  if (!data.length) return <div className="text-sm text-slate-500 flex items-center justify-center h-full">No data available</div>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip 
          cursor={{ fill: 'rgba(255,255,255,0.02)' }}
          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={\`cell-\${index}\`} fill={index % 2 === 0 ? '#8b5cf6' : '#38bdf8'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
`,

  'src/components/dashboard/salary-distribution-chart.tsx': `'use client';
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SalaryDistributionChart() {
  // Mock distribution data for demonstration
  const data = [
    { range: '$50k', count: 5 },
    { range: '$100k', count: 25 },
    { range: '$150k', count: 45 },
    { range: '$200k', count: 30 },
    { range: '$250k', count: 15 },
    { range: '$300k+', count: 5 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey="range" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f8fafc' }}
          itemStyle={{ color: '#8b5cf6' }}
        />
        <Area type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
`,

  // --- Update Dashboard Page to include charts ---
  'src/app/(dashboard)/dashboard/page.tsx': `'use client';
import React, { useEffect, useState } from 'react';
import PageHeader from '@/components/layout/page-header';
import { KPICard } from '@/components/dashboard/kpi-card';
import HeadcountByDept from '@/components/dashboard/headcount-by-dept';
import SalaryDistributionChart from '@/components/dashboard/salary-distribution-chart';
import { Users, DollarSign, FileText, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Overview of compensation metrics and trends" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Employees" value={stats?.employeeCount?.toString() || "0"} icon={Users} trend={2} trendLabel="vs last month" />
        <KPICard title="Average Salary" value={\`$\${((stats?.avgSalary || 0)/1000).toFixed(1)}k\`} icon={DollarSign} trend={4.2} trendLabel="vs last month" />
        <KPICard title="Open Offers" value={stats?.offerCount?.toString() || "0"} icon={FileText} trend={-5} trendLabel="vs last month" />
        <KPICard title="Org Comp Ratio" value="1.04" icon={Activity} trend={0.02} trendLabel="vs target" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="min-h-[400px]">
          <CardHeader>
            <CardTitle>Salary Distribution</CardTitle>
            <CardDescription>Company-wide salary distribution across all departments.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <SalaryDistributionChart />
          </CardContent>
        </Card>
        <Card className="min-h-[400px]">
          <CardHeader>
            <CardTitle>Headcount by Department</CardTitle>
            <CardDescription>Current employee headcount segmented by department.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <HeadcountByDept />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
`
};

Object.entries(files).forEach(([filepath, content]) => {
  const fullPath = path.join(root, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log('Generated:', filepath);
});
