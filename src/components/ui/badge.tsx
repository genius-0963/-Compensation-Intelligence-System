import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'border-transparent bg-slate-800 text-slate-100',
    success: 'border-transparent bg-emerald-500/10 text-emerald-400',
    warning: 'border-transparent bg-amber-500/10 text-amber-400',
    danger: 'border-transparent bg-rose-500/10 text-rose-400',
    info: 'border-transparent bg-sky-500/10 text-sky-400',
    outline: 'text-slate-100 border-white/10',
  };

  return (
    <div className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500', variants[variant], className)} {...props} />
  );
}
