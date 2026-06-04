const fs = require('fs');
const path = require('path');

const writeFiles = () => {
  const files = {
    'src/components/ui/button.tsx': `'use client';
import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-violet-600 text-white hover:bg-violet-700 shadow-sm border border-violet-500/50',
      secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700',
      ghost: 'bg-transparent text-slate-300 hover:text-white hover:bg-slate-800',
      danger: 'bg-rose-600 text-white hover:bg-rose-700 border border-rose-500/50',
      outline: 'bg-transparent border border-white/10 text-slate-300 hover:text-white hover:bg-white/5',
    };
    
    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 py-2 text-sm',
      lg: 'h-12 px-8 text-base',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
export { Button };
`,
    'src/components/ui/card.tsx': `import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-xl border border-white/5 bg-slate-900/80 text-slate-100 shadow-sm backdrop-blur-xl", className)} {...props} />
));
Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("font-semibold leading-none tracking-tight text-white", className)} {...props} />
));
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-slate-400", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
`,
    'src/components/ui/badge.tsx': `import React from 'react';
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
`,
    'src/components/ui/input.tsx': `import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-white/10 bg-slate-950/50 px-3 py-2 text-sm text-slate-100 ring-offset-slate-950 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            icon && "pl-10",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";
export { Input };
`,
    'src/components/dashboard/kpi-card.tsx': `import React from 'react';
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
`,
    'src/app/(dashboard)/dashboard/page.tsx': `'use client';
import React from 'react';
import PageHeader from '@/components/layout/page-header';
import { KPICard } from '@/components/dashboard/kpi-card';
import { Users, DollarSign, FileText, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Overview of compensation metrics and trends" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Employees" value="1,248" icon={Users} trend={12} trendLabel="vs last month" />
        <KPICard title="Average Salary" value="$145k" icon={DollarSign} trend={4.2} trendLabel="vs last month" />
        <KPICard title="Open Offers" value="24" icon={FileText} trend={-5} trendLabel="vs last month" />
        <KPICard title="Org Comp Ratio" value="1.04" icon={Activity} trend={0.02} trendLabel="vs target" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="min-h-[400px]">
          <CardHeader>
            <CardTitle>Salary Distribution</CardTitle>
            <CardDescription>Company-wide salary distribution across all departments.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center text-slate-500 h-[300px]">
            [ Salary Distribution Chart Component ]
          </CardContent>
        </Card>
        <Card className="min-h-[400px]">
          <CardHeader>
            <CardTitle>Headcount by Department</CardTitle>
            <CardDescription>Current employee headcount segmented by department.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center text-slate-500 h-[300px]">
            [ Department Headcount Chart Component ]
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
`
  };

  for (const [filepath, content] of Object.entries(files)) {
    fs.writeFileSync(path.join('/Users/subh/Documents/Compensation Intelligence System/compensation-intelligence', filepath), content);
    console.log('Created ' + filepath);
  }
};

writeFiles();
