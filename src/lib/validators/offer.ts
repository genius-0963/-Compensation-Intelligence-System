import { z } from 'zod';

export const offerSchema = z.object({
  candidateId: z.string().min(1),
  roleId: z.string().min(1),
  levelId: z.string().min(1),
  locationId: z.string().min(1),
  baseSalary: z.coerce.number().min(0),
  equity: z.coerce.number().min(0).default(0),
  signingBonus: z.coerce.number().min(0).default(0),
  annualBonus: z.coerce.number().min(0).default(0),
  status: z.string().default('DRAFT'),
  notes: z.string().optional()
});

export type OfferInput = z.infer<typeof offerSchema>;
