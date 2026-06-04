import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  className?: string;
}

export function KPICard({ title, value, icon: Icon, trend, trendLabel, className }: KPICardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <div className="h-10 w-10 rounded-full bg-violet-600/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-violet-500" />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="text-3xl font-bold text-white">{value}</div>
          {trend !== undefined && (
            <div className="flex items-center mt-2 space-x-1">
              {trend >= 0 ? (
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-rose-400" />
              )}
              <span className={cn("text-sm font-medium", trend >= 0 ? "text-emerald-400" : "text-rose-400")}>
                {Math.abs(trend)}%
              </span>
              {trendLabel && <span className="text-sm text-slate-500 ml-1">{trendLabel}</span>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
