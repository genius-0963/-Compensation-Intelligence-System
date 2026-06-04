'use client';
import React, { useEffect, useState } from 'react';
import PageHeader from '@/components/layout/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function OffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/offers')
      .then(res => res.json())
      .then(data => {
        setOffers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getScoreColor = (grade: string) => {
    if (grade?.startsWith('A')) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    if (grade?.startsWith('B')) return 'text-sky-400 bg-sky-400/10 border-sky-400/20';
    if (grade?.startsWith('C')) return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Offer Comparison" description="Analyze and score candidate offers against market bands." />
      
      {loading ? (
        <div className="text-slate-400">Loading offers...</div>
      ) : offers.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-slate-500">
            No offers found. Seed the database to see offers here.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {offers.map(offer => (
            <Card key={offer.id} className="hover:border-white/10 transition-colors">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {offer.candidate.firstName} {offer.candidate.lastName}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    {offer.role.title} • {offer.level.name} • {offer.location.city}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Total Comp</p>
                    <p className="text-lg font-bold text-slate-100">
                      ${offer.totalCompensation.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center h-16 w-16 rounded-lg border border-white/10 bg-slate-900">
                    <span className="text-xs text-slate-500 mb-1">SCORE</span>
                    <span className={`text-xl font-bold ${getScoreColor(offer.scoreGrade)}`}>
                      {offer.scoreGrade || '-'}
                    </span>
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
