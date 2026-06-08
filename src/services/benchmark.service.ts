import { prisma } from '@/lib/db';
import { BenchmarkInput } from '@/lib/validators/benchmark';

export class BenchmarkService {
  static async getAll(filters?: { roleId?: string; levelId?: string; locationId?: string }) {
    return prisma.salaryBenchmark.findMany({
      where: filters,
      include: { role: true, level: true, location: true },
      orderBy: { surveyDate: 'desc' }
    });
  }

  static async getById(id: string) {
    return prisma.salaryBenchmark.findUnique({
      where: { id },
      include: { role: true, level: true, location: true }
    });
  }

  static async create(data: BenchmarkInput) {
    return prisma.salaryBenchmark.create({
      data: {
        ...data,
        surveyDate: new Date(data.surveyDate)
      }
    });
  }

  static async update(id: string, data: Partial<BenchmarkInput>) {
    return prisma.salaryBenchmark.update({
      where: { id },
      data: {
        ...data,
        ...(data.surveyDate && { surveyDate: new Date(data.surveyDate) })
      },
      include: { role: true, level: true, location: true }
    });
  }
  
  static async delete(id: string) {
    return prisma.salaryBenchmark.delete({ where: { id } });
  }
}
