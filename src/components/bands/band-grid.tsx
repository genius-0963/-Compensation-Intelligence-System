import { BandWithRelations } from "@/types";
import { BandCard } from "./band-card";

export function BandGrid({ bands }: { bands: BandWithRelations[] }) {
  if (!bands?.length) {
    return <div className="p-8 text-center text-slate-500 bg-[#0B1020] rounded-lg border border-slate-800 col-span-full">No compensation bands found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bands.map(band => (
        <BandCard key={band.id} band={band} />
      ))}
    </div>
  );
}
