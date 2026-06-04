'use client';
import React, { useEffect, useState } from 'react';
import PageHeader from '@/components/layout/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Download } from 'lucide-react';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/employees')
      .then(res => res.json())
      .then(data => {
        setEmployees(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Employee Directory" description="Manage employees, view compensation history, and analyze comp ratio.">
        <Button variant="outline" size="sm" className="hidden md:flex"><Download className="mr-2 h-4 w-4" /> Export</Button>
        <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Add Employee</Button>
      </PageHeader>
      
      {loading ? (
        <div className="text-slate-400">Loading employees...</div>
      ) : employees.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-slate-500">
            No employees found. Seed the database to see employees here.
          </CardContent>
        </Card>
      ) : (
        <div className="bg-slate-900/80 border border-white/5 rounded-xl overflow-hidden backdrop-blur-xl">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-950/50 text-slate-300 uppercase text-xs border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-medium">Employee</th>
                <th className="px-6 py-4 font-medium">Role & Level</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Total Comp</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {employees.map(emp => (
                <tr key={emp.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center font-medium text-xs">
                        {emp.firstName[0]}{emp.lastName[0]}
                      </div>
                      <div>
                        <div className="font-medium text-slate-100">{emp.firstName} {emp.lastName}</div>
                        <div className="text-xs text-slate-500">{emp.employeeId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-slate-200">{emp.role?.title || 'Unknown Role'}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{emp.department?.name} • {emp.level?.code}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                    {emp.location?.city}, {emp.location?.state}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-200">
                    ${emp.totalCompensation?.toLocaleString() || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={emp.status === 'ACTIVE' ? 'success' : 'outline'}>
                      {emp.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
