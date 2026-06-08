import { MarketDataPoint as PrismaMarketDataPoint, Role, Location } from '@prisma/client';

export type MarketDataPoint = PrismaMarketDataPoint & {
  role?: Role;
  location?: Location;
};
