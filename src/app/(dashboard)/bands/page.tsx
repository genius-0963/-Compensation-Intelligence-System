'use client';
import React, { useEffect, useState } from 'react';
import PageHeader from '@/components/layout/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function BandsPage() {
  const [bands, setBands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/bands')
      .then(res => res.json())
      .then(data => {
        setBands(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Compensation Bands" description="Manage structured compensation bands across roles and locations.">
        <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Create Band</Button>
      </PageHeader>
      
      {loading ? (
        <div className="text-slate-400">Loading bands...</div>
      ) : bands.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-slate-500">
            No compensation bands found. Seed the database to see bands here.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bands.map(band => (
            <Card key={band.id} className="hover:border-violet-500/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-slate-100">{band.role?.title}</h3>
                    <p className="text-sm text-slate-400">{band.level?.code} • {band.level?.name}</p>
                  </div>
                  <div className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded">
                    {band.location?.city}
                  </div>
                </div>
                
                <div className="space-y-3 mt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Min</span>
                    <span className="text-slate-300">${band.minSalary?.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <div className="bg-violet-600 h-1.5 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Mid</span>
                    <span className="text-violet-400 font-medium">${band.midSalary?.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <div className="bg-violet-600 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Max</span>
                    <span className="text-slate-300">${band.maxSalary?.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
