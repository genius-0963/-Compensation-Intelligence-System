import { PrismaClient } from '@prisma/client';
import { normalizeCompanyName, getNormalizedRank } from '../src/lib/normalize';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Clean up
  await prisma.auditLog.deleteMany();
  await prisma.savedComparison.deleteMany();
  await prisma.watchlist.deleteMany();
  await prisma.compensationInsight.deleteMany();
  await prisma.submissionDocument.deleteMany();
  await prisma.compensationSubmission.deleteMany();
  
  await prisma.compensationEntry.deleteMany();
  await prisma.level.deleteMany();
  await prisma.company.deleteMany();
  await prisma.location.deleteMany();
  await prisma.roleFamily.deleteMany();

  // 2. Companies
  const companies = [
    { name: 'Google', industry: 'Technology', website: 'google.com' },
    { name: 'Meta', industry: 'Social Media', website: 'meta.com' },
    { name: 'Amazon', industry: 'E-commerce', website: 'amazon.com' },
  ];

  const createdCompanies = await Promise.all(
    companies.map(c => 
      prisma.company.create({
        data: {
          ...c,
          normalizedName: normalizeCompanyName(c.name)
        }
      })
    )
  );

  // 3. Role Families
  const roles = ['Software Engineering', 'Product Management', 'Design', 'Data Science'];
  const createdRoles = await Promise.all(
    roles.map(r => prisma.roleFamily.create({ data: { name: r } }))
  );

  // 4. Locations
  const locations = [
    { city: 'San Francisco', state: 'CA', country: 'USA', costOfLivingIndex: 1.5, currency: 'USD' },
    { city: 'Seattle', state: 'WA', country: 'USA', costOfLivingIndex: 1.3, currency: 'USD' },
    { city: 'Bangalore', state: 'KA', country: 'India', costOfLivingIndex: 0.6, currency: 'INR' },
    { city: 'London', state: '', country: 'UK', costOfLivingIndex: 1.2, currency: 'GBP' },
  ];

  const createdLocations = await Promise.all(
    locations.map(l => prisma.location.create({ data: l }))
  );

  // 5. Levels & Compensation Entries
  for (const company of createdCompanies) {
    const levelNames = company.name === 'Google' ? ['L3', 'L4', 'L5', 'L6', 'L7'] :
                      company.name === 'Meta' ? ['E3', 'E4', 'E5', 'E6', 'E7'] :
                      ['L4', 'L5', 'L6', 'L7'];

    for (const lName of levelNames) {
      const rank = getNormalizedRank(lName, company.name);
      const level = await prisma.level.create({
        data: {
          companyId: company.id,
          name: lName,
          code: `${company.id}-${lName}`,
          normalizedLevelRank: rank,
        }
      });

      // Create entries for each location
      for (const loc of createdLocations) {
        const baseMultiplier = loc.city === 'San Francisco' ? 1.5 : loc.city === 'Bangalore' ? 0.4 : 1.0;
        const rankMultiplier = rank * 40000;
        
        await prisma.compensationEntry.create({
          data: {
            companyId: company.id,
            roleFamilyId: createdRoles[0].id,
            levelId: level.id,
            locationId: loc.id,
            baseSalary: (120000 + rankMultiplier) * baseMultiplier,
            bonus: (20000 + rankMultiplier * 0.1) * baseMultiplier,
            stock: (50000 + rankMultiplier * 0.5) * baseMultiplier,
            totalCompensation: (190000 + rankMultiplier * 1.6) * baseMultiplier,
            currency: loc.currency,
            yearsExperience: rank * 2,
            isVerified: Math.random() > 0.3,
            source: 'verified_offer'
          }
        });
      }
    }
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
