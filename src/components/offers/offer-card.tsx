import { OfferWithRelations } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { SCORE_GRADE_CONFIG, OFFER_STATUS_LABELS } from "@/lib/constants";
import Link from "next/link";
import { Building2, Sparkles } from "lucide-react";

export function OfferCard({ offer }: { offer: OfferWithRelations }) {
  const candidateName = `${offer.candidate?.firstName} ${offer.candidate?.lastName}`;
  const gradeColor = offer.scoreGrade ? SCORE_GRADE_CONFIG[offer.scoreGrade] : 'text-slate-400 bg-slate-800';
  const statusConfig = OFFER_STATUS_LABELS[offer.status] || { label: offer.status, color: 'default' };
  
  return (
    <Link href={`/offers/${offer.id}`}>
      <Card className="p-5 hover:border-violet-500/50 transition-all cursor-pointer group flex flex-col h-full bg-[#0B1020] border-slate-800">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <Avatar name={candidateName} />
            <div>
              <h3 className="font-semibold text-slate-100 group-hover:text-violet-400 transition-colors">
                {candidateName}
              </h3>
              <p className="text-sm text-slate-400">{offer.role?.title} • {offer.level?.name}</p>
            </div>
          </div>
          <div className={`flex items-center justify-center h-10 w-10 rounded-full font-bold text-sm ${gradeColor}`}>
            {offer.scoreGrade || '-'}
          </div>
        </div>

        <div className="space-y-3 mt-auto">
          <div className="p-3 bg-slate-950 rounded-lg flex items-center justify-between border border-slate-800/50">
            <span className="text-sm text-slate-400">Total Comp</span>
            <span className="font-semibold text-emerald-400">{formatCurrency(offer.totalCompensation)}</span>
          </div>
          
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <div className="flex flex-col">
              <span>Base</span>
              <span className="text-slate-300">{formatCurrency(offer.baseSalary)}</span>
            </div>
            <div className="flex flex-col text-center">
              <span>Equity</span>
              <span className="text-slate-300">{formatCurrency(offer.equity)}</span>
            </div>
            <div className="flex flex-col text-right">
              <span>Bonus</span>
              <span className="text-slate-300">{formatCurrency(offer.signingBonus + offer.annualBonus)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-5 pt-4 border-t border-slate-800/50">
          <Badge className={
            statusConfig.color === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
            statusConfig.color === 'warning' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
            statusConfig.color === 'info' ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' : ''
          }>
            {statusConfig.label}
          </Badge>
          
          {offer.insights && offer.insights.length > 0 && (
            <div className="flex items-center text-xs text-violet-400 font-medium bg-violet-500/10 px-2 py-1 rounded-full">
              <Sparkles size={12} className="mr-1" />
              {offer.insights.length} AI
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
