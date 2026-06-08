import { z } from 'zod';

export const candidateSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  currentCompany: z.string().optional(),
  currentTitle: z.string().optional(),
  currentSalary: z.coerce.number().optional(),
  expectedSalary: z.coerce.number().optional(),
  noticePeriod: z.string().optional(),
  source: z.string().optional(),
  status: z.string().default('ACTIVE'),
  notes: z.string().optional()
});

export type CandidateInput = z.infer<typeof candidateSchema>;
