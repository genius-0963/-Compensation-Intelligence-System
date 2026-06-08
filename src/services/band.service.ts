import { prisma } from '@/lib/db';
import { BandInput } from '@/lib/validators/band';

export class BandService {
  static async getAll(filters?: { roleId?: string; levelId?: string; locationId?: string }) {
    return prisma.compensationBand.findMany({
      where: filters,
      include: { role: true, level: true, location: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getById(id: string) {
    return prisma.compensationBand.findUnique({
      where: { id },
      include: { role: true, level: true, location: true }
    });
  }

  static async create(data: BandInput) {
    return prisma.compensationBand.create({
      data: {
        ...data,
        effectiveDate: new Date(data.effectiveDate)
      }
    });
  }

  static async update(id: string, data: Partial<BandInput>) {
    return prisma.compensationBand.update({
      where: { id },
      data: {
        ...data,
        ...(data.effectiveDate && { effectiveDate: new Date(data.effectiveDate) })
      },
      include: { role: true, level: true, location: true }
    });
  }
  
  static async delete(id: string) {
    return prisma.compensationBand.delete({ where: { id } });
  }
}
