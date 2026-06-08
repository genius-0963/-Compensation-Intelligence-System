import { z } from 'zod';

export const benchmarkSchema = z.object({
  roleId: z.string().min(1),
  levelId: z.string().min(1),
  locationId: z.string().min(1),
  p10: z.coerce.number().min(0),
  p25: z.coerce.number().min(0),
  p50: z.coerce.number().min(0),
  p75: z.coerce.number().min(0),
  p90: z.coerce.number().min(0),
  source: z.string().min(1),
  surveyDate: z.string().or(z.date()),
  currency: z.string().default('USD')
}).refine(data => 
  data.p10 <= data.p25 && 
  data.p25 <= data.p50 && 
  data.p50 <= data.p75 && 
  data.p75 <= data.p90, 
{
  message: "Invalid percentiles order",
  path: ["p50"]
});

export type BenchmarkInput = z.infer<typeof benchmarkSchema>;
