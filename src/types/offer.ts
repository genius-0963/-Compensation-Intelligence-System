import { Offer, Candidate, Role, Level, Location, NegotiationInsight } from '@prisma/client';

export type OfferWithRelations = Offer & {
  candidate?: Candidate;
  role?: Role;
  level?: Level;
  location?: Location;
  insights?: NegotiationInsight[];
};
