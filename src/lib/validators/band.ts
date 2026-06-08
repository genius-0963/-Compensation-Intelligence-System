import { z } from 'zod';

export const bandSchema = z.object({
  roleId: z.string().min(1),
  levelId: z.string().min(1),
  locationId: z.string().min(1),
  minSalary: z.coerce.number().min(0),
  midSalary: z.coerce.number().min(0),
  maxSalary: z.coerce.number().min(0),
  currency: z.string().default('USD'),
  effectiveDate: z.string().or(z.date())
}).refine(data => data.minSalary <= data.midSalary && data.midSalary <= data.maxSalary, {
  message: "Invalid salary range (must be min <= mid <= max)",
  path: ["midSalary"]
});

export type BandInput = z.infer<typeof bandSchema>;
