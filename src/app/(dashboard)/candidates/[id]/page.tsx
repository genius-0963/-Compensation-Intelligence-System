"use client";

import { useParams } from "next/navigation";
import { useCandidate } from "@/hooks/use-candidates";
import PageHeader from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function CandidateDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { candidate, isLoading, isError } = useCandidate(id);

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !candidate) {
    return (
      <div className="p-6 text-rose-400">
        Failed to load candidate details.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader 
        title={`${candidate.firstName} ${candidate.lastName}`} 
        description={`Status: ${candidate.status} • Current Company: ${candidate.currentCompany || 'N/A'}`}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-[#0B1020] border border-slate-800 rounded-xl">
            <h2 className="text-lg font-semibold text-slate-100 mb-4">Compensation Expectations</h2>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-slate-500 text-sm">Current Salary</p>
                    <p className="text-xl font-medium text-white">${candidate.currentSalary?.toLocaleString() || 'N/A'}</p>
                </div>
                <div>
                    <p className="text-slate-500 text-sm">Expected Salary</p>
                    <p className="text-xl font-medium text-white">${candidate.expectedSalary?.toLocaleString() || 'N/A'}</p>
                </div>
            </div>
        </div>
        
        <div className="p-6 bg-[#0B1020] border border-slate-800 rounded-xl">
            <h2 className="text-lg font-semibold text-slate-100 mb-4">Contact</h2>
            <dl className="space-y-2">
                <div className="flex justify-between">
                    <dt className="text-slate-500">Email</dt>
                    <dd className="text-slate-200">{candidate.email}</dd>
                </div>
                <div className="flex justify-between">
                    <dt className="text-slate-500">Phone</dt>
                    <dd className="text-slate-200">{candidate.phone || 'N/A'}</dd>
                </div>
            </dl>
        </div>
      </div>
    </div>
  );
}
