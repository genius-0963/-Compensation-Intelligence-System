import { SalaryBenchmark, Role, Level, Location } from '@prisma/client';

export type BenchmarkWithRelations = SalaryBenchmark & {
  role?: Role;
  level?: Level;
  location?: Location;
};
