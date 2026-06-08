import { CompensationBand, Role, Level, Location } from '@prisma/client';

export type BandWithRelations = CompensationBand & {
  role?: Role;
  level?: Level;
  location?: Location;
};

export interface BandFilters {
  roleId?: string;
  levelId?: string;
  locationId?: string;
}
