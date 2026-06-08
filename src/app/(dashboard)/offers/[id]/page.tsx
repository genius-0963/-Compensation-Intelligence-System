'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageHeader from '@/components/layout/page-header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { SCORE_GRADE_CONFIG, OFFER_STATUS_LABELS } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import { Sparkles, Trash2, ArrowLeft, TrendingUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function OfferDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [offer, setOffer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/offers/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setOffer(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [params.id]);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this offer?")) {
      await fetch(`/api/offers/${params.id}`, { method: 'DELETE' });
      router.push('/offers');
    }
  };

  const updateStatus = async (status: string) => {
    const res = await fetch(`/api/offers/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const updated = await res.json();
    setOffer(updated);
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Loading offer details...</div>;
  if (!offer || offer.error) return <div className="p-8 text-center text-rose-400">Offer not found.</div>;

  const candidateName = `${offer.candidate?.firstName} ${offer.candidate?.lastName}`;
  const gradeColor = offer.scoreGrade ? SCORE_GRADE_CONFIG[offer.scoreGrade] : 'text-slate-400 bg-slate-800';
  
  const getInsightIcon = (category: string) => {
    if (category === 'NEGOTIATION_OPPORTUNITY') return <Sparkles className="h-5 w-5 text-violet-400" />;
    if (category === 'MARKET_POSITION') return <TrendingUp className="h-5 w-5 text-emerald-400" />;
    return <AlertTriangle className="h-5 w-5 text-amber-400" />;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <Link href="/offers" className="inline-flex items-center text-sm text-slate-400 hover:text-slate-200 transition-colors">
        <ArrowLeft size={16} className="mr-1" /> Back to Offers
      </Link>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar name={candidateName} className="h-16 w-16 text-lg" />
          <div>
            <h1 className="text-2xl font-bold text-slate-100">{candidateName}</h1>
            <p className="text-slate-400 text-lg">
              {offer.role?.title} • {offer.level?.name} • {offer.location?.city}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <SelectStatus currentStatus={offer.status} onChange={updateStatus} />
          <Button variant="outline" className="border-rose-900 text-rose-500 hover:bg-rose-950/30 hover:text-rose-400" onClick={handleDelete}>
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score & Breakdown */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-[#0B1020] border-slate-800 text-center p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <h3 className="text-sm font-medium text-slate-400 mb-4">Competitiveness Score</h3>
            <div className="flex justify-center items-end gap-4 mb-2">
              <span className="text-6xl font-black text-slate-100">{offer.score || 0}</span>
              <span className={`text-3xl font-bold ${gradeColor} bg-transparent px-0`}>
                {offer.scoreGrade || '-'}
              </span>
            </div>
            <p className="text-sm text-slate-500">{offer.notes}</p>
          </Card>

          <Card className="bg-[#0B1020] border-slate-800">
            <CardHeader className="pb-2 border-b border-slate-800">
              <h3 className="font-semibold text-slate-100">Compensation Breakdown</h3>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Base Salary</span>
                <span className="font-medium text-slate-200">{formatCurrency(offer.baseSalary)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Equity Grant</span>
                <span className="font-medium text-slate-200">{formatCurrency(offer.equity)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Signing Bonus</span>
                <span className="font-medium text-slate-200">{formatCurrency(offer.signingBonus)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Annual Bonus</span>
                <span className="font-medium text-slate-200">{formatCurrency(offer.annualBonus)}</span>
              </div>
              <div className="pt-4 mt-2 border-t border-slate-800 flex justify-between items-center">
                <span className="text-slate-300 font-medium">Total Comp</span>
                <span className="font-bold text-emerald-400 text-lg">{formatCurrency(offer.totalCompensation)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold text-slate-100 flex items-center">
            <Sparkles className="mr-2 text-violet-400" size={20} /> AI Negotiation Insights
          </h3>
          
          {(!offer.insights || offer.insights.length === 0) ? (
            <Card className="bg-[#0B1020] border-slate-800 border-dashed">
              <CardContent className="p-12 text-center text-slate-500">
                No insights available. Try re-analyzing the offer.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {offer.insights.map((insight: any) => (
                <Card key={insight.id} className="bg-[#0B1020] border-slate-800 relative overflow-hidden group hover:border-violet-500/30 transition-all">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                        {getInsightIcon(insight.category)}
                      </div>
                      <Badge variant={
                        insight.severity === 'CRITICAL' ? 'danger' :
                        insight.severity === 'HIGH' ? 'warning' :
                        insight.severity === 'MEDIUM' ? 'info' : 'default'
                      }>
                        {insight.severity}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-slate-100 mb-2">{insight.title}</h4>
                    <p className="text-sm text-slate-400">{insight.description}</p>
                    <div className="mt-4 text-xs font-medium text-slate-500 flex justify-between">
                      <span>{insight.category.replace('_', ' ')}</span>
                      <span>{(insight.confidence * 100).toFixed(0)}% Confidence</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SelectStatus({ currentStatus, onChange }: { currentStatus: string, onChange: (s: string) => void }) {
  return (
    <select 
      value={currentStatus} 
      onChange={(e) => onChange(e.target.value)}
      className="h-10 bg-[#0B1020] border border-slate-800 text-slate-300 text-sm rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-violet-500"
    >
      {Object.keys(OFFER_STATUS_LABELS).map(key => (
        <option key={key} value={key}>{OFFER_STATUS_LABELS[key as keyof typeof OFFER_STATUS_LABELS].label}</option>
      ))}
      <option value="EXTENDED">Extended</option>
      <option value="NEGOTIATING">Negotiating</option>
      <option value="WITHDRAWN">Withdrawn</option>
    </select>
  );
}
