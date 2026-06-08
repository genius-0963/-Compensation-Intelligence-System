const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("--- COMPANIES ---");
  const companies = await prisma.company.findMany();
  console.log(companies);

  console.log("\n--- COMPENSATIONS ---");
  const compensations = await prisma.compensationEntry.findMany({
    include: {
      company: true,
      level: true,
      roleFamily: true,
      location: true
    }
  });
  console.log(JSON.stringify(compensations, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
