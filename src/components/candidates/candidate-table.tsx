import { CandidateWithOffers } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { CANDIDATE_STATUS_LABELS } from "@/lib/constants";
import Link from "next/link";

export function CandidateTable({ candidates }: { candidates: CandidateWithOffers[] }) {
  if (!candidates?.length) {
    return <div className="p-8 text-center text-slate-500 bg-[#0B1020] rounded-lg border border-slate-800">No candidates found matching the criteria.</div>;
  }

  return (
    <Table className="border border-slate-800 rounded-lg bg-[#0B1020] overflow-hidden">
      <TableHeader className="bg-slate-950">
        <TableRow>
          <TableHead>Candidate</TableHead>
          <TableHead>Current Role</TableHead>
          <TableHead>Expected Salary</TableHead>
          <TableHead>Offers</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {candidates.map((candidate) => {
          const name = `${candidate.firstName} ${candidate.lastName}`;
          const statusConfig = CANDIDATE_STATUS_LABELS[candidate.status] || { label: candidate.status, color: 'default' };
          
          return (
            <TableRow key={candidate.id} className="cursor-pointer group">
              <TableCell>
                <Link href={`/candidates/${candidate.id}`} className="flex items-center gap-3 w-full">
                  <Avatar name={name} size="sm" />
                  <div>
                    <div className="font-medium text-slate-200 group-hover:text-violet-400 transition-colors">{name}</div>
                    <div className="text-xs text-slate-500">{candidate.email}</div>
                  </div>
                </Link>
              </TableCell>
              <TableCell>
                <div className="text-sm text-slate-300">{candidate.currentTitle || '-'}</div>
                <div className="text-xs text-slate-500">{candidate.currentCompany || '-'}</div>
              </TableCell>
              <TableCell className="text-sm text-slate-300">
                {candidate.expectedSalary ? formatCurrency(candidate.expectedSalary) : '-'}
              </TableCell>
              <TableCell className="text-sm text-slate-300">
                {candidate.offers?.length || 0}
              </TableCell>
              <TableCell>
                <Badge className={
                  statusConfig.color === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  statusConfig.color === 'danger' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                  statusConfig.color === 'warning' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                  statusConfig.color === 'info' ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' : ''
                }>
                  {statusConfig.label}
                </Badge>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
