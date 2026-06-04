'use server';

import { auth } from '@/auth';
import prisma from '@/lib/db';
import { compensationSubmissionSchema } from '@/lib/validators/compensation';
import { SubmissionStatus } from '@prisma/client';

export async function submitCompensation(data: unknown) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const validated = compensationSubmissionSchema.parse(data);

  // Phase 1: Create submission
  const submission = await prisma.compensationSubmission.create({
    data: {
      userId: session.user.id,
      status: SubmissionStatus.SUBMITTED,
      companyId: validated.companyName, // In prod, resolve via lookup
      roleFamilyId: validated.roleFamilyName,
      levelId: validated.levelName,
      locationId: 'loc_id', // Placeholder for location resolution
      baseSalary: validated.baseSalary,
      annualBonus: validated.bonus || 0,
      totalCompensation: validated.baseSalary + (validated.bonus || 0) + (validated.stock || 0),
      yearsExperience: validated.yearsExperience,
    },
  });

  return { success: true, submissionId: submission.id };
}
