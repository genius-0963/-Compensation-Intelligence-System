'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from "@/components/ui/input";

export function EmploymentInfoStep() {
  const { register } = useFormContext();
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-white">Personal Employment Information</h2>
      <div className="grid grid-cols-2 gap-4">
        <Input {...register("companyName")} placeholder="Company Name" className="col-span-2" />
        <select {...register("employmentType")} className="h-10 border rounded-lg px-3">
          <option value="FULL_TIME">Full Time</option>
          <option value="INTERN">Intern</option>
        </select>
        <Input {...register("roleFamilyName")} placeholder="Role Family (e.g. Engineering)" />
      </div>
    </div>
  );
}
