'use client';
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
        <KPICard title="Average Salary" value={`$${((stats?.avgSalary || 0)/1000).toFixed(1)}k`} icon={DollarSign} trend={4.2} trendLabel="vs last month" />
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
