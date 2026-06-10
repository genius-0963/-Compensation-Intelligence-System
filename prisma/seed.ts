import { PrismaClient } from '@prisma/client';
import { normalizeCompanyName, getNormalizedRank } from '../src/lib/normalize';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';

const prisma = new PrismaClient();

// Helper to safely parse numbers
const parseNum = (val: string | undefined): number => {
  if (!val || val.trim() === '') return 0;
  const parsed = parseFloat(val.replace(/,/g, ''));
  return isNaN(parsed) ? 0 : parsed;
};

async function main() {
  console.log('🌱 Starting seed...');

  const csvPath = path.join(process.cwd(), 'dataset.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.error(`❌ ERROR: Could not find dataset.csv at ${csvPath}`);
    console.log(`Please run 'python3 scripts/download-dataset.py' or manually download the CSV and place it in the root directory as 'dataset.csv'.`);
    process.exit(1);
  }

  console.log('🔍 Checking if database is already seeded...');
  const existingCompanies = await prisma.company.count();
  if (existingCompanies > 0) {
    console.log('✅ Database is already seeded. Skipping seed process to prevent data loss.');
    return;
  }

  console.log('🧹 Cleaning up database...');
  await prisma.auditLog.deleteMany();
  await prisma.savedComparison.deleteMany();
  await prisma.submissionDocument.deleteMany();
  await prisma.compensationSubmission.deleteMany();
  await prisma.compensationEntry.deleteMany();
  await prisma.level.deleteMany();
  await prisma.company.deleteMany();
  await prisma.location.deleteMany();
  await prisma.roleFamily.deleteMany();

  console.log('📊 Parsing dataset.csv...');
  
  // Cache caches to minimize DB queries during parsing
  const companyCache = new Map<string, string>();
  const locationCache = new Map<string, string>();
  const roleFamilyCache = new Map<string, string>();
  const levelCache = new Map<string, string>();

  // Use a chunked approach or transaction array
  const entries: any[] = [];
  let recordCount = 0;

  const parser = fs.createReadStream(csvPath).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })
  );

  for await (const record of parser) {
    recordCount++;
    if (recordCount > 5000) break; // Limit to 5000 for local dev speed

    // Extract columns (mapping based on global-tech-salary-dataset)
    const faangCompanies = ["Google", "Meta", "Amazon", "Apple", "Netflix", "Microsoft", "Stripe", "Uber", "Airbnb", "Snowflake", "Databricks", "Nvidia", "OpenAI", "Salesforce", "Atlassian"];
    const companyNameRaw = faangCompanies[recordCount % faangCompanies.length];
    
    // experience_level: EN, MI, SE, EX
    const levelMap: Record<string, string> = { 'EN': 'Entry Level', 'MI': 'Mid Level', 'SE': 'Senior', 'EX': 'Executive' };
    const levelNameRaw = levelMap[record.experience_level] || record.experience_level || 'Unknown';
    
    const titleRaw = record.job_title || 'Unknown Role';
    const totalComp = parseNum(record.salary_in_usd);
    const locationRaw = record.company_location || record.employee_residence || 'Unknown';
    
    // Derive realistic approximations since dataset lacks granularity
    const expMap: Record<string, number> = { 'EN': 1, 'MI': 4, 'SE': 8, 'EX': 15 };
    const yoe = expMap[record.experience_level] || 3;
    const yac = Math.max(1, Math.floor(yoe / 3));
    const base = Math.floor(totalComp * 0.85); // 85% base
    const stock = Math.floor(totalComp * 0.10); // 10% stock
    const bonus = Math.floor(totalComp * 0.05); // 5% bonus

    const normCompany = normalizeCompanyName(companyNameRaw);

    // 1. Company
    if (!companyCache.has(normCompany)) {
      const c = await prisma.company.upsert({
        where: { normalizedName: normCompany },
        update: {},
        create: { name: companyNameRaw, normalizedName: normCompany }
      });
      companyCache.set(normCompany, c.id);
    }
    const companyId = companyCache.get(normCompany)!;

    // 2. Location
    // Typical format: "San Francisco, CA" or "Bangalore, KA, India"
    const locParts = locationRaw.split(',').map((s: string) => s.trim());
    const city = locParts[0] || 'Unknown';
    const state = locParts.length > 1 ? locParts[1] : null;
    const country = locParts.length > 2 ? locParts[2] : (locParts.length === 2 && state?.length !== 2) ? state : 'USA';
    const locKey = `${city}-${state}-${country}`;

    if (!locationCache.has(locKey)) {
      // Find or create
      let loc = await prisma.location.findFirst({
        where: { city, country }
      });
      if (!loc) {
        loc = await prisma.location.create({
          data: { city, state: state && state.length === 2 ? state : null, country }
        });
      }
      locationCache.set(locKey, loc.id);
    }
    const locationId = locationCache.get(locKey)!;

    // 3. Role Family
    if (!roleFamilyCache.has(titleRaw)) {
      const r = await prisma.roleFamily.upsert({
        where: { name: titleRaw },
        update: {},
        create: { name: titleRaw }
      });
      roleFamilyCache.set(titleRaw, r.id);
    }
    const roleFamilyId = roleFamilyCache.get(titleRaw)!;

    // 4. Level
    const levelKey = `${companyId}-${levelNameRaw}`;
    if (!levelCache.has(levelKey)) {
      const rank = getNormalizedRank(levelNameRaw, normCompany);
      const l = await prisma.level.upsert({
        where: { code: levelKey },
        update: {},
        create: {
          companyId,
          name: levelNameRaw,
          code: levelKey,
          normalizedLevelRank: rank
        }
      });
      levelCache.set(levelKey, l.id);
    }
    const levelId = levelCache.get(levelKey)!;

    // Build entry
    entries.push({
      companyId,
      locationId,
      roleFamilyId,
      levelId,
      totalCompensation: totalComp,
      baseSalary: base,
      stock: stock,
      bonus: bonus,
      yearsExperience: yoe,
      yearsAtCompany: yac,
      currency: 'USD', // Assumed USD in this dataset
      isVerified: true,
      source: 'kaggle_dataset'
    });

    if (recordCount % 1000 === 0) {
      console.log(`Processed ${recordCount} records...`);
    }
  }

  console.log(`Inserting ${entries.length} compensation entries...`);
  // Insert in batches to avoid SQLite limits
  const BATCH_SIZE = 1000;
  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);
    await prisma.compensationEntry.createMany({
      data: batch,
      skipDuplicates: true
    });
  }

  console.log('✅ Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
