"use client";

import { useState } from "react";
import PageHeader from "@/components/layout/page-header";
import { CandidateTable } from "@/components/candidates/candidate-table";
import { useCandidates } from "@/hooks/use-candidates";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CandidatesPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  
  const query = new URLSearchParams();
  if (debouncedSearch) query.append("search", debouncedSearch);
  
  const { candidates, isLoading, isError } = useCandidates(query.toString());

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader 
        title="Candidates" 
        description="Manage candidate compensation expectations and active offers."
      >
        <Button className="bg-violet-600 hover:bg-violet-700 text-white">
          <Plus size={16} className="mr-2" />
          Add Candidate
        </Button>
      </PageHeader>

      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
          <Input 
            placeholder="Search candidates..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-[#0B1020] border-slate-800 text-slate-100 placeholder:text-slate-500"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton shape="card" className="h-16" />
          <Skeleton shape="card" className="h-16" />
          <Skeleton shape="card" className="h-16" />
        </div>
      ) : isError ? (
        <div className="text-rose-400 p-4 border border-rose-400/20 bg-rose-400/10 rounded-lg">
          Failed to load candidates.
        </div>
      ) : (
        <CandidateTable candidates={candidates || []} />
      )}
    </div>
  );
}
