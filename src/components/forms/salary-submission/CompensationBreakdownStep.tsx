'use client';

import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { formatCurrency } from '@/lib/utils';

export function CompensationBreakdownStep() {
  const { register, control } = useFormContext();
  const values = useWatch({ control });

  const base = parseFloat(values.baseSalary) || 0;
  const bonus = parseFloat(values.bonus) || 0;
  const stock = parseFloat(values.stock) || 0;
  const total = base + bonus + stock;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-gray-900">Compensation Breakdown</h2>
      <div className="grid grid-cols-2 gap-4">
        <Input {...register("baseSalary", { valueAsNumber: true })} type="number" placeholder="Base Salary" />
        <Input {...register("bonus", { valueAsNumber: true })} type="number" placeholder="Annual Bonus" />
        <Input {...register("stock", { valueAsNumber: true })} type="number" placeholder="Stock Grant Value" />
      </div>
      
      <div className="p-6 bg-gray-900 text-white rounded-2xl">
         <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Compensation</div>
         <div className="text-4xl font-black">{formatCurrency(total)}</div>
      </div>
    </div>
  );
}
