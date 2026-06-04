"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export function CompRatioGauge({ ratio }: { ratio: number }) {
  const normalizedRatio = Math.min(Math.max(ratio, 0.5), 1.5);
  
  const percentage = (normalizedRatio - 0.5) / 1.0 * 100;
  
  const data = [
    { name: 'Value', value: percentage },
    { name: 'Empty', value: 100 - percentage }
  ];

  let color = '#34d399'; 
  if (ratio < 0.8) color = '#fb7185'; 
  else if (ratio < 0.95) color = '#fbbf24'; 
  else if (ratio > 1.2) color = '#fb7185'; 
  else if (ratio > 1.05) color = '#fbbf24'; 

  return (
    <div className="relative h-40 w-full flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={color} />
            <Cell fill="#1e293b" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute bottom-0 flex flex-col items-center">
        <span className="text-3xl font-bold text-slate-50">{ratio.toFixed(2)}</span>
        <span className="text-xs text-slate-400">Target: 1.00</span>
      </div>
    </div>
  );
}
