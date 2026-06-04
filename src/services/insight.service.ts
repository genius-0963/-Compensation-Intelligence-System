import { prisma } from '@/lib/db';

export class InsightService {
  static async generateInsights(offerId: string) {
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: { role: true, level: true, location: true }
    });
    
    if (!offer) throw new Error("Offer not found");

    const insights = [];

    // 1. Negotiation Leverage Insight
    if (offer.score && offer.score > 85) {
      insights.push({
        type: 'NEGOTIATION',
        title: 'Strong Market Position',
        insight: 'This offer is in the top 15% for this role. The candidate has minimal leverage for base salary negotiation.',
        confidence: 0.92,
        priority: 1
      });
    } else if (offer.score && offer.score < 50) {
      insights.push({
        type: 'NEGOTIATION',
        title: 'High Flight Risk',
        insight: 'Offer is below market P50. Expect aggressive counter-offers. Consider increasing equity to offset base salary gap.',
        confidence: 0.88,
        priority: 1
      });
    }

    // 2. Equity Analysis
    if (offer.equity > 0 && offer.baseSalary > 0) {
      const equityRatio = offer.equity / offer.baseSalary;
      if (equityRatio > 0.3) {
        insights.push({
          type: 'EQUITY_ANALYSIS',
          title: 'Equity Heavy Structure',
          insight: 'The compensation is heavily weighted towards equity. Ensure the candidate understands the vesting schedule and projected valuation.',
          confidence: 0.95,
          priority: 2
        });
      }
    }

    // Save insights to DB
    for (const data of insights) {
      await prisma.negotiationInsight.create({
        data: {
          offerId: offer.id,
          type: data.type as any,
          title: data.title,
          insight: data.insight,
          confidence: data.confidence,
          priority: data.priority,
          metadata: JSON.stringify({ generatedAt: new Date().toISOString() })
        }
      });
    }

    return insights;
  }
}
