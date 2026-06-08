import { Employee, Role, Level, Location, Department, SalaryHistory } from '@prisma/client';

export type EmployeeWithRelations = Employee & {
  role?: Role;
  level?: Level;
  location?: Location;
  department?: Department;
  salaryHistory?: SalaryHistory[];
};

export interface EmployeeFilters {
  departmentId?: string;
  locationId?: string;
  roleId?: string;
  levelId?: string;
  search?: string;
}
