import { Candidate, Offer } from '@prisma/client';
import { OfferWithRelations } from './offer';

export type CandidateWithOffers = Candidate & {
  offers?: OfferWithRelations[];
};

export interface CandidateFilters {
  status?: string;
  search?: string;
}
