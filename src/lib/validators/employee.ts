import { z } from 'zod';

export const employeeSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(),
  roleId: z.string().min(1, "Role is required"),
  levelId: z.string().min(1, "Level is required"),
  locationId: z.string().min(1, "Location is required"),
  departmentId: z.string().min(1, "Department is required"),
  currentSalary: z.coerce.number().min(0, "Salary must be positive"),
  equity: z.coerce.number().min(0).default(0),
  bonus: z.coerce.number().min(0).default(0),
  hireDate: z.string().or(z.date()),
  status: z.string().default('ACTIVE')
});

export type EmployeeInput = z.infer<typeof employeeSchema>;
