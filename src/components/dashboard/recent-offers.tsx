import { OfferWithRelations } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { SCORE_GRADE_CONFIG } from "@/lib/constants";
import Link from "next/link";

export function RecentOffers({ offers }: { offers: OfferWithRelations[] }) {
  if (!offers?.length) {
    return <div className="p-4 text-center text-muted">No recent offers.</div>;
  }

  return (
    <div className="space-y-4">
      {offers.map((offer) => {
        const candidateName = `${offer.candidate?.firstName} ${offer.candidate?.lastName}`;
        const gradeColor = offer.scoreGrade ? SCORE_GRADE_CONFIG[offer.scoreGrade] : 'text-muted-foreground bg-card';
        
        return (
          <Link href={`/offers/${offer.id}`} key={offer.id}>
            <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card hover:bg-card/80 transition-colors mb-2 cursor-pointer">
              <div className="flex items-center gap-3">
                <Avatar name={candidateName} size="sm" />
                <div>
                  <p className="text-sm font-medium text-foreground">{candidateName}</p>
                  <p className="text-xs text-muted-foreground">{offer.role?.title} • {offer.level?.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-foreground">{formatCurrency(offer.totalCompensation)}</p>
                  <p className="text-xs text-muted-foreground">Total Comp</p>
                </div>
                
                <div className={`flex items-center justify-center h-8 w-8 rounded-full text-xs font-bold ${gradeColor}`}>
                  {offer.scoreGrade || '-'}
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
