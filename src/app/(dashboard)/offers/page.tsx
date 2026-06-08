"use client";

import PageHeader from "@/components/layout/page-header";
import { OfferCard } from "@/components/offers/offer-card";
import { useOffers } from "@/hooks/use-offers";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, MoreHorizontal, Download } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function OffersPage() {
  const { offers, isLoading, isError } = useOffers();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader 
        title="Offers" 
        description="Track and analyze candidate offers with AI-powered competitiveness scoring."
      >
        <Link href="/offers/new">
          <Button className="bg-violet-600 hover:bg-violet-700 text-white">
            <Plus size={16} className="mr-2" />
            Create Offer
          </Button>
        </Link>
      </PageHeader>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
           <Button variant="outline" className="border-slate-800 bg-[#0B1020] text-slate-300">
             <Filter size={16} className="mr-2" />
             Filters
           </Button>
        </div>
        <div className="text-sm text-slate-500">
          Showing {offers?.length || 0} active offers
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <Skeleton shape="card" className="h-64" />
          <Skeleton shape="card" className="h-64" />
          <Skeleton shape="card" className="h-64" />
          <Skeleton shape="card" className="h-64" />
        </div>
      ) : isError ? (
        <div className="text-rose-400 p-4 border border-rose-400/20 bg-rose-400/10 rounded-lg">
          Failed to load offers.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {offers?.map(offer => (
             <OfferCard key={offer.id} offer={offer} />
          ))}
          {(!offers || offers.length === 0) && (
            <div className="col-span-full p-8 text-center text-slate-500 bg-[#0B1020] rounded-lg border border-slate-800">
              No offers found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
