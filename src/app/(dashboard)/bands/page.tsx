"use client";

import PageHeader from "@/components/layout/page-header";
import { BandGrid } from "@/components/bands/band-grid";
import { useBands } from "@/hooks/use-bands";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function BandsPage() {
  const { bands, isLoading, isError } = useBands();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader 
        title="Compensation Bands" 
        description="Define and analyze salary ranges across roles, levels, and locations."
      >
        <Button className="bg-violet-600 hover:bg-violet-700 text-white">
          <Plus size={16} className="mr-2" />
          Create Band
        </Button>
      </PageHeader>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
           <Button variant="outline" className="border-slate-800 bg-[#0B1020] text-slate-300">
             <Filter size={16} className="mr-2" />
             Filters
           </Button>
        </div>
        <div className="text-sm text-slate-500">
          Showing {bands?.length || 0} active bands
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton shape="card" className="h-48" />
          <Skeleton shape="card" className="h-48" />
          <Skeleton shape="card" className="h-48" />
        </div>
      ) : isError ? (
        <div className="text-rose-400 p-4 border border-rose-400/20 bg-rose-400/10 rounded-lg">
          Failed to load compensation bands.
        </div>
      ) : (
        <BandGrid bands={bands || []} />
      )}
    </div>
  );
}
