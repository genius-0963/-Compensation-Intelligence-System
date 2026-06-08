import { prisma } from '@/lib/db';
import { InsightCategory, Severity } from '@prisma/client';

type GeneratedInsight = {
  category: InsightCategory;
  title: string;
  description: string;
  confidence: number;
  severity: Severity;
};

export class InsightService {
  static async generateInsights(offerId: string) {
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: { role: true, level: true, location: true, candidate: true }
    });
    
    if (!offer) throw new Error("Offer not found");

    const insights: GeneratedInsight[] = [];

    // 1. Negotiation Leverage Insight
    if (offer.score && offer.score >= 80) {
      insights.push({
        category: InsightCategory.NEGOTIATION_OPPORTUNITY,
        title: 'Strong Market Position',
        description: 'This offer is highly competitive. The candidate has minimal leverage for base salary negotiation.',
        confidence: 0.92,
        severity: Severity.HIGH,
      });
    } else if (offer.score && offer.score < 60) {
      insights.push({
        category: InsightCategory.RETENTION_RISK,
        title: 'High Flight Risk',
        description: 'Offer is below market expectations. Expect aggressive counter-offers. Consider increasing equity to offset base salary gap.',
        confidence: 0.88,
        severity: Severity.HIGH,
      });
    }

    // 2. Equity Analysis
    if (offer.equity > 0 && offer.baseSalary > 0) {
      const equityRatio = offer.equity / offer.baseSalary;
      if (equityRatio > 0.25) {
        insights.push({
          category: InsightCategory.EQUITY,
          title: 'Equity Heavy Structure',
          description: 'The compensation is heavily weighted towards equity. Ensure the candidate understands the vesting schedule and projected valuation.',
          confidence: 0.95,
          severity: Severity.MEDIUM,
        });
      }
    }

    // 3. Market Position Analysis
    const benchmark = await prisma.salaryBenchmark.findFirst({
      where: { roleId: offer.roleId, levelId: offer.levelId, locationId: offer.locationId },
      orderBy: { surveyDate: 'desc' }
    });

    if (benchmark) {
      if (offer.baseSalary < benchmark.p25) {
        insights.push({
          category: InsightCategory.MARKET_POSITION,
          title: 'Below P25 Base Salary',
          description: 'Base salary is in the bottom quartile. This offer may only be viable for junior candidates or if the company brand is exceptionally strong.',
          confidence: 0.90,
          severity: Severity.HIGH,
        });
      } else if (offer.baseSalary > benchmark.p75) {
        insights.push({
          category: InsightCategory.MARKET_POSITION,
          title: 'Above P75 Base Salary',
          description: 'Paying top of market. This should only be for critical hires or candidates bringing immediate specialized expertise.',
          confidence: 0.85,
          severity: Severity.MEDIUM,
        });
      }
    }
    
    // 4. Counter Offer Probability
    if (offer.candidate?.currentSalary && offer.totalCompensation < offer.candidate.currentSalary * 1.1) {
       insights.push({
          category: InsightCategory.RETENTION_RISK,
          title: 'High Counter-Offer Probability',
          description: 'Total comp is less than 10% above current salary. The candidate\'s current employer is very likely to match or beat this offer.',
          confidence: 0.82,
          severity: Severity.HIGH,
       });
    }

    // Clear existing insights for this offer before generating new ones
    await prisma.negotiationInsight.deleteMany({
      where: { offerId: offer.id }
    });

    // Save insights to DB
    for (const data of insights) {
      await prisma.negotiationInsight.create({
        data: {
          offerId: offer.id,
          category: data.category,
          title: data.title,
          description: data.description,
          confidence: data.confidence,
          severity: data.severity,
        }
      });
    }

    return insights;
  }
}
