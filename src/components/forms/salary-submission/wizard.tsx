'use client';

import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { compensationSubmissionSchema } from '@/lib/validators/compensation';
import { submitCompensation } from '@/app/actions/submit-salary';
import { EmploymentInfoStep } from './EmploymentInfoStep';
import { CompensationBreakdownStep } from './CompensationBreakdownStep';
import { VerificationUploadStep } from './VerificationUploadStep';
import { Button } from '@/components/ui/button';

export function SalaryWizard() {
  const [step, setStep] = useState(1);
  const form = useForm({ 
      resolver: zodResolver(compensationSubmissionSchema),
      defaultValues: { baseSalary: 0, bonus: 0, stock: 0 }
  });

  const onSubmit = async (data: any) => {
    await submitCompensation(data);
    alert('Submitted!');
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-8 bg-white border border-gray-100 rounded-3xl shadow-sm">
        {step === 1 && <EmploymentInfoStep />}
        {step === 2 && <div>Step 2: Level Info (Placeholder)</div>}
        {step === 3 && <CompensationBreakdownStep />}
        {step === 4 && <VerificationUploadStep form={form} />}
        
        <div className="mt-10 flex justify-between">
           <Button type="button" variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 1}>Back</Button>
           {step < 4 ? (
             <Button type="button" onClick={() => setStep(s => s + 1)}>Next Step</Button>
           ) : (
             <Button type="submit">Submit for Verification</Button>
           )}
        </div>
      </form>
    </FormProvider>
  );
}
