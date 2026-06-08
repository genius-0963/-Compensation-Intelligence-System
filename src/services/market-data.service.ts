import { prisma } from '@/lib/db';

export class MarketDataService {
  static async getAll(filters?: { roleId?: string; locationId?: string }) {
    return prisma.marketDataPoint.findMany({
      where: filters,
      include: { role: true, location: true },
      orderBy: { period: 'desc' }
    });
  }

  static async getTrends(roleId: string, locationId: string) {
    const data = await prisma.marketDataPoint.findMany({
      where: { roleId, locationId },
      orderBy: { period: 'asc' }
    });
    
    return data.map((point, i) => {
      let yoy = point.yoyGrowth;
      if (yoy === null && i >= 4) {
        const prevYear = data[i - 4];
        if (prevYear) {
          yoy = ((point.medianSalary - prevYear.medianSalary) / prevYear.medianSalary) * 100;
        }
      }
      return { ...point, yoyGrowth: yoy };
    });
  }
}
