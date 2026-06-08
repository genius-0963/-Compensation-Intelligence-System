import { BandWithRelations } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Users, TrendingUp } from "lucide-react";

export function BandCard({ band }: { band: BandWithRelations }) {
  const spread = ((band.maxSalary - band.minSalary) / band.minSalary * 100).toFixed(0);
  
  return (
    <Link href={`/bands/${band.id}`}>
      <Card className="p-5 hover:border-violet-500/50 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)] transition-all cursor-pointer group h-full flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-slate-100 group-hover:text-violet-400 transition-colors">
              {band.role?.title || 'Unknown Role'}
            </h3>
            <p className="text-sm text-slate-400">{band.level?.name || 'Unknown Level'}</p>
          </div>
          <Badge variant="outline" className="bg-slate-800 text-slate-300">
            {band.location?.city}, {band.location?.country}
          </Badge>
        </div>

        <div className="mt-auto space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-500">
              <span>{formatCurrency(band.minSalary)}</span>
              <span>{formatCurrency(band.midSalary)}</span>
              <span>{formatCurrency(band.maxSalary)}</span>
            </div>
            
            <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="absolute h-full bg-gradient-to-r from-violet-600/50 via-violet-500 to-violet-600/50" 
                style={{ left: '0%', right: '0%' }}
              />
              <div 
                className="absolute top-0 bottom-0 w-1 bg-card"
                style={{ left: '50%', transform: 'translateX(-50%)' }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
            <div className="flex items-center text-xs text-slate-400">
              <Users size={14} className="mr-1.5 text-slate-500" />
              <span>{spread}% Spread</span>
            </div>
            <div className="flex items-center text-xs text-slate-400">
              <TrendingUp size={14} className="mr-1.5 text-emerald-500" />
              <span className="text-emerald-400">Market Aligned</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
