import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// Helper for calculating median in JS
function median(arr: number[]) {
  if (arr.length === 0) return 0;
  arr.sort((a, b) => a - b);
  const mid = Math.floor(arr.length / 2);
  return arr.length % 2 !== 0 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
}

export async function GET(request: Request) {
  try {
    const entries = await prisma.compensationEntry.findMany({
      include: {
        level: true
      }
    });

    const grouped = new Map();

    entries.forEach(entry => {
       const rank = entry.level?.normalizedLevelRank;
       if (!rank) return;

       if (!grouped.has(rank)) {
          grouped.set(rank, {
             rank,
             base: [],
             bonus: [],
             stock: [],
             total: [],
             count: 0
          });
       }

       const g = grouped.get(rank);
       g.base.push(entry.baseSalary);
       g.bonus.push(entry.bonus);
       g.stock.push(entry.stock);
       g.total.push(entry.totalCompensation);
       g.count++;
    });

    const result = Array.from(grouped.values())
      .map(g => ({
        rank: g.rank,
        medianBase: median(g.base),
        medianBonus: median(g.bonus),
        medianStock: median(g.stock),
        medianTotal: median(g.total),
        dataPoints: g.count,
        promotionDelta: 0
      }))
      .sort((a, b) => a.rank - b.rank);

    // Calculate promotion delta
    for (let i = 0; i < result.length; i++) {
       if (i === 0) {
          result[i].promotionDelta = 0;
       } else {
          const prev = result[i-1].medianTotal;
          const curr = result[i].medianTotal;
          result[i].promotionDelta = prev > 0 ? ((curr - prev) / prev) * 100 : 0;
       }
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Intelligence Error", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch intelligence metrics' }, { status: 500 });
  }
}
