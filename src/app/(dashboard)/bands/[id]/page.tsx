"use client";

import { useParams } from "next/navigation";
import { useBand } from "@/hooks/use-bands";
import PageHeader from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function BandDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { band, isLoading, isError } = useBand(id);

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !band) {
    return (
      <div className="p-6 text-rose-400">
        Failed to load band details.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader 
        title={`Band: ${band.role?.title} (${band.level?.name})`}
        description={`Location: ${band.location?.city}, ${band.location?.country}`}
      />
      
      <div className="p-6 bg-[#0B1020] border border-slate-800 rounded-xl">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Salary Range</h2>
        <div className="grid grid-cols-3 gap-4">
            <div>
                <p className="text-slate-500 text-sm">Min Salary</p>
                <p className="text-xl font-medium text-white">${band.minSalary.toLocaleString()}</p>
            </div>
            <div>
                <p className="text-slate-500 text-sm">Mid Salary</p>
                <p className="text-xl font-medium text-white">${band.midSalary.toLocaleString()}</p>
            </div>
            <div>
                <p className="text-slate-500 text-sm">Max Salary</p>
                <p className="text-xl font-medium text-white">${band.maxSalary.toLocaleString()}</p>
            </div>
        </div>
      </div>
    </div>
  );
}
