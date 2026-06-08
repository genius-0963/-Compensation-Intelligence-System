'use client';
import React, { useEffect, useState } from 'react';
import PageHeader from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';

export default function InsightsPage() {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/insights/negotiation')
      .then(res => res.json())
      .then(data => {
        setInsights(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const getIcon = (category: string) => {
    if (category === 'NEGOTIATION_OPPORTUNITY') return <Sparkles className="h-5 w-5 text-violet-400" />;
    if (category === 'MARKET_POSITION') return <TrendingUp className="h-5 w-5 text-emerald-400" />;
    return <AlertTriangle className="h-5 w-5 text-amber-400" />;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="AI Negotiation Insights" description="AI-driven recommendations for active offers." />
      
      {loading ? (
        <div className="text-slate-400">Loading insights...</div>
      ) : insights.length === 0 ? (
        <Card className="bg-[#0B1020] border-slate-800">
          <CardContent className="p-12 text-center text-slate-500">
            No insights generated yet. Score an offer to generate insights.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insights.map(insight => (
            <Card key={insight.id} className="bg-[#0B1020] border-slate-800 relative overflow-hidden hover:border-violet-500/30 transition-all group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-violet-600/10 transition-colors"></div>
              <CardHeader className="pb-2 flex flex-row items-start justify-between">
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  {getIcon(insight.category)}
                </div>
                <Badge variant={
                  insight.severity === 'CRITICAL' ? 'danger' :
                  insight.severity === 'HIGH' ? 'warning' :
                  insight.severity === 'MEDIUM' ? 'info' : 'default'
                }>
                  {insight.severity}
                </Badge>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-lg text-slate-100 mb-2">{insight.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">{insight.description}</p>
                <div className="text-xs text-slate-500 pt-4 border-t border-slate-800 flex justify-between">
                  <span>Offer for: <span className="text-slate-300">{insight.offer?.candidate?.firstName} {insight.offer?.candidate?.lastName}</span></span>
                  <span>{(insight.confidence * 100).toFixed(0)}% Conf</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
