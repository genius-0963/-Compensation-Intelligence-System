import { prisma } from '@/lib/db';
import { CandidateInput } from '@/lib/validators/candidate';
import { Prisma } from '@prisma/client';

export class CandidateService {
  static async getAll(filters?: { status?: string; search?: string }) {
    const where: Prisma.CandidateWhereInput = {};
    
    if (filters?.status) where.status = filters.status as any;
    
    if (filters?.search) {
      where.OR = [
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    return prisma.candidate.findMany({
      where,
      include: { offers: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getById(id: string) {
    return prisma.candidate.findUnique({
      where: { id },
      include: {
        offers: {
          include: { role: true, level: true, location: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  }

  static async create(data: CandidateInput) {
    return prisma.candidate.create({
      data: {
        ...data,
        status: data.status as any
      }
    });
  }

  static async update(id: string, data: Partial<CandidateInput>) {
    return prisma.candidate.update({
      where: { id },
      data: {
        ...data,
        ...(data.status && { status: data.status as any })
      },
      include: { offers: true }
    });
  }
  
  static async delete(id: string) {
    return prisma.candidate.delete({ where: { id } });
  }
}
