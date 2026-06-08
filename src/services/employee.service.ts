import { prisma } from '@/lib/db';
import { EmployeeInput } from '@/lib/validators/employee';
import { Prisma } from '@prisma/client';

export class EmployeeService {
  static async getAll(filters?: { departmentId?: string; roleId?: string; levelId?: string; locationId?: string; search?: string }) {
    const where: Prisma.EmployeeWhereInput = {};
    
    if (filters?.departmentId) where.departmentId = filters.departmentId;
    if (filters?.roleId) where.roleId = filters.roleId;
    if (filters?.levelId) where.levelId = filters.levelId;
    if (filters?.locationId) where.locationId = filters.locationId;
    
    if (filters?.search) {
      where.OR = [
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { employeeId: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    return prisma.employee.findMany({
      where,
      include: { role: true, level: true, location: true, department: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getById(id: string) {
    return prisma.employee.findUnique({
      where: { id },
      include: {
        role: true,
        level: true,
        location: true,
        department: true,
        salaryHistory: { orderBy: { effectiveDate: 'desc' } }
      }
    });
  }

  static async create(data: EmployeeInput) {
    const employeeId = `EMP-${Math.floor(Math.random() * 10000)}`;
    const totalComp = data.currentSalary + data.equity + data.bonus;

    return prisma.employee.create({
      data: {
        ...data,
        employeeId,
        totalCompensation: totalComp,
        hireDate: new Date(data.hireDate)
      }
    });
  }

  static async update(id: string, data: Partial<EmployeeInput>) {
    const current = await this.getById(id);
    if (!current) throw new Error("Employee not found");
    
    const salary = data.currentSalary ?? current.currentSalary;
    const equity = data.equity ?? current.equity;
    const bonus = data.bonus ?? current.bonus;
    const totalCompensation = salary + equity + bonus;

    if (data.currentSalary && data.currentSalary !== current.currentSalary) {
      const changePercentage = ((data.currentSalary - current.currentSalary) / current.currentSalary) * 100;
      await prisma.salaryHistory.create({
        data: {
          employeeId: id,
          previousSalary: current.currentSalary,
          newSalary: data.currentSalary,
          changePercentage,
          reason: 'Adjustment',
          effectiveDate: new Date()
        }
      });
    }

    return prisma.employee.update({
      where: { id },
      data: {
        ...data,
        totalCompensation,
        ...(data.hireDate && { hireDate: new Date(data.hireDate) })
      },
      include: { role: true, level: true, location: true, department: true }
    });
  }
  
  static async delete(id: string) {
    await prisma.salaryHistory.deleteMany({ where: { employeeId: id } });
    return prisma.employee.delete({ where: { id } });
  }
}
