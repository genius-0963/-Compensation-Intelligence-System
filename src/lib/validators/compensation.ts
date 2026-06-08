import { z } from "zod";

export const compensationSubmissionSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  roleFamilyName: z.string().min(1, "Role family is required"),
  levelName: z.string().min(1, "Level name is required"),
  location: z.object({
    city: z.string().min(1, "City is required"),
    state: z.string().optional(),
    country: z.string().min(1, "Country is required"),
  }),
  baseSalary: z.number().positive("Base salary must be positive"),
  bonus: z.number().min(0).optional(),
  stock: z.number().min(0).optional(),
  other: z.number().min(0).optional(),
  currency: z.string().length(3, "Currency must be 3 characters (e.g., USD)"),
  yearsExperience: z.number().min(0),
  yearsAtCompany: z.number().min(0).optional(),
  source: z.string().optional(),
});

export type CompensationSubmission = z.infer<typeof compensationSubmissionSchema>;
