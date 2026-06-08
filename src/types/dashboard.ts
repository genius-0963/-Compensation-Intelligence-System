import { OfferWithRelations } from "./offer";

export interface DashboardStats {
  employeeCount: number;
  offerCount: number;
  avgSalary: number;
  departments: {
    name: string;
    count: number;
  }[];
  recentOffers: OfferWithRelations[];
}
