import { prisma } from '@/lib/db';

export interface Insight {
  id: string;
  type: 'MARKET_POSITION' | 'EFFICIENCY' | 'GROWTH' | 'VOLATILITY';
  title: string;
  text: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export async function generateGlobalInsights(): Promise<Insight[]> {
  try {
    const insights: Insight[] = [];

    // 1. Get the global median TC
    const globalStats: any = await prisma.$queryRaw`
      SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY "totalCompensation") as median_tc
      FROM "compensation_entries"
    `;
    const globalMedian = Number(globalStats[0]?.median_tc) || 0;

    // 2. Find a company paying significantly above market median
    if (globalMedian > 0) {
      const topCompany: any = await prisma.$queryRaw`
        SELECT 
          c.name as company_name,
          PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY e."totalCompensation") as median_tc
        FROM "companies" c
        JOIN "compensation_entries" e ON c.id = e."companyId"
        GROUP BY c.id, c.name
        HAVING COUNT(e.id) > 20
        ORDER BY median_tc DESC
        LIMIT 1
      `;
      
      if (topCompany.length > 0) {
        const comp = topCompany[0];
        const medianTc = Number(comp.median_tc);
        if (medianTc > globalMedian) {
          const percentage = Math.round(((medianTc - globalMedian) / globalMedian) * 100);
          insights.push({
            id: 'highest-paying-company',
            type: 'MARKET_POSITION',
            title: 'Market Leaders',
            text: `${comp.company_name} pays ${percentage}% above the global market median for tech roles.`,
            priority: 'HIGH'
          });
        }
      }
    }

    // 3. Stock-heavy compensation
    const stockHeavy: any = await prisma.$queryRaw`
      SELECT 
        l.name as level_name,
        c.name as company_name,
        AVG(e.stock) / AVG(e."totalCompensation") as stock_ratio
      FROM "levels" l
      JOIN "companies" c ON l."companyId" = c.id
      JOIN "compensation_entries" e ON l.id = e."levelId"
      GROUP BY l.id, l.name, c.name
      HAVING AVG(e."totalCompensation") > 0 AND COUNT(e.id) > 5
      ORDER BY stock_ratio DESC
      LIMIT 1
    `;

    if (stockHeavy.length > 0) {
      const lvl = stockHeavy[0];
      const ratio = Math.round(Number(lvl.stock_ratio) * 100);
      insights.push({
        id: 'stock-heavy',
        type: 'VOLATILITY',
        title: 'Equity Focus',
        text: `${lvl.company_name} ${lvl.level_name} has the most stock-heavy compensation structure at ${ratio}% equity.`,
        priority: 'MEDIUM'
      });
    }

    // 4. Best location insight
    const topCity: any = await prisma.$queryRaw`
      SELECT 
        l.city,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY e."totalCompensation") as median_tc
      FROM "locations" l
      JOIN "compensation_entries" e ON l.id = e."locationId"
      GROUP BY l.id, l.city
      HAVING COUNT(e.id) > 10 AND l.country != 'USA'
      ORDER BY median_tc DESC
      LIMIT 1
    `;

    if (topCity.length > 0) {
      insights.push({
        id: 'top-city-intl',
        type: 'GROWTH',
        title: 'Global Hotspots',
        text: `${topCity[0].city} emerges as a top international hub for engineering compensation.`,
        priority: 'LOW'
      });
    }

    return insights;
  } catch (error) {
    console.error('Failed to generate insights:', error);
    return [];
  }
}
