const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const roles = await prisma.roleFamily.findMany({ select: { name: true }, distinct: ['name'] });
  const levels = await prisma.level.findMany({ select: { name: true }, distinct: ['name'] });
  const locations = await prisma.location.findMany({ select: { city: true }, distinct: ['city'] });

  console.log("ROLES:", roles.map(r => r.name).slice(0, 10));
  console.log("LEVELS:", levels.map(l => l.name));
  console.log("LOCATIONS:", locations.map(l => l.city).slice(0, 10));
}

main().catch(console.error).finally(() => prisma.$disconnect());
