import { PrismaClient, Offer } from '@prisma/client';
import { prisma } from '@/lib/db';

export class OfferService {
  /**
   * Calculates a comprehensive score for an offer based on market data and internal bands.
   * Weighting:
   * 40% - Market Position (Base vs Market P50)
   * 25% - Total Compensation Competitiveness
   * 20% - Equity Value
   * 15% - Internal Comp Ratio
   */
  static async calculateOfferScore(offerId: string): Promise<number> {
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: {
        role: true,
        level: true,
        location: true,
      }
    });

    if (!offer) throw new Error('Offer not found');

    const benchmark = await prisma.salaryBenchmark.findFirst({
      where: {
        roleId: offer.roleId,
        levelId: offer.levelId,
        locationId: offer.locationId,
      },
      orderBy: { surveyDate: 'desc' }
    });

    const band = await prisma.compensationBand.findFirst({
      where: {
        roleId: offer.roleId,
        levelId: offer.levelId,
        locationId: offer.locationId,
      },
      orderBy: { effectiveDate: 'desc' }
    });

    let score = 0;

    // 1. Market Position (40%)
    let marketScore = 0;
    if (benchmark) {
      const compRatioMarket = offer.baseSalary / benchmark.p50;
      // Ideal is 1.0 (P50). Above 1.15 is excellent. Below 0.85 is poor.
      marketScore = Math.max(0, Math.min(100, (compRatioMarket - 0.8) * 200)); 
    } else {
      marketScore = 50; // Neutral if no data
    }
    score += marketScore * 0.40;

    // 2. Total Compensation (25%)
    let totalCompScore = 0;
    if (benchmark) {
      // Assuming P50 base + 15% is typical total comp for benchmark
      const expectedTotalComp = benchmark.p50 * 1.15;
      const tcRatio = offer.totalCompensation / expectedTotalComp;
      totalCompScore = Math.max(0, Math.min(100, (tcRatio - 0.8) * 200));
    } else {
      totalCompScore = 50;
    }
    score += totalCompScore * 0.25;

    // 3. Equity (20%)
    // Simplified: base 0 to 100 based on absolute equity value or percentage of base
    const equityRatio = offer.equity / offer.baseSalary;
    const equityScore = Math.max(0, Math.min(100, equityRatio * 400)); // 25% equity gets 100
    score += equityScore * 0.20;

    // 4. Internal Comp Ratio (15%)
    let internalScore = 0;
    if (band) {
      const compRatioInternal = offer.baseSalary / band.midSalary;
      // Ideally between 0.9 and 1.1
      if (compRatioInternal < 0.8) internalScore = 20;
      else if (compRatioInternal > 1.2) internalScore = 100;
      else internalScore = Math.max(0, Math.min(100, (compRatioInternal - 0.8) * 250));
    } else {
      internalScore = 50;
    }
    score += internalScore * 0.15;

    // Save score to offer
    const finalScore = Math.round(score);
    const scoreGrade = this.getScoreGrade(finalScore);

    await prisma.offer.update({
      where: { id: offer.id },
      data: { score: finalScore, scoreGrade }
    });

    return finalScore;
  }

  static getScoreGrade(score: number): string {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B+';
    if (score >= 60) return 'B';
    if (score >= 50) return 'C+';
    if (score >= 40) return 'C';
    return 'D';
  }
}
