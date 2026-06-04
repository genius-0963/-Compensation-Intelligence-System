const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Create Admin User
  const passwordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@compintel.com' },
    update: {},
    create: {
      email: 'admin@compintel.com',
      name: 'Admin User',
      role: 'ADMIN',
      passwordHash,
    },
  });
  console.log('Admin user created');

  // 2. Create Departments
  const depsData = [
    { name: 'Engineering', code: 'ENG' },
    { name: 'Product', code: 'PROD' },
    { name: 'Design', code: 'DES' },
    { name: 'Sales', code: 'SALES' },
  ];
  const departments: Record<string, any> = {};
  for (const d of depsData) {
    departments[d.code] = await prisma.department.upsert({
      where: { code: d.code },
      update: {},
      create: { name: d.name, code: d.code },
    });
  }

  // 3. Create Levels
  const levelsData = [
    { code: 'L3', name: 'Junior', rank: 3 },
    { code: 'L4', name: 'Mid-Level', rank: 4 },
    { code: 'L5', name: 'Senior', rank: 5 },
    { code: 'L6', name: 'Staff', rank: 6 },
    { code: 'L7', name: 'Principal', rank: 7 },
  ];
  const levels: Record<string, any> = {};
  for (const l of levelsData) {
    levels[l.code] = await prisma.level.upsert({
      where: { code: l.code },
      update: {},
      create: l,
    });
  }

  // 4. Create Locations
  const locsData = [
    { city: 'San Francisco', state: 'CA', country: 'USA', costOfLivingIndex: 1.3 },
    { city: 'New York', state: 'NY', country: 'USA', costOfLivingIndex: 1.25 },
    { city: 'Austin', state: 'TX', country: 'USA', costOfLivingIndex: 1.0 },
    { city: 'London', state: 'ENG', country: 'UK', costOfLivingIndex: 1.15 },
  ];
  const locations = [];
  for (const loc of locsData) {
    locations.push(await prisma.location.upsert({
      where: { city_state_country: { city: loc.city, state: loc.state, country: loc.country } },
      update: {},
      create: loc,
    }));
  }

  // 5. Create Roles
  const rolesData = [
    { title: 'Software Engineer', family: 'Engineering', departmentId: departments['ENG'].id },
    { title: 'Frontend Engineer', family: 'Engineering', departmentId: departments['ENG'].id },
    { title: 'Product Manager', family: 'Product', departmentId: departments['PROD'].id },
    { title: 'Product Designer', family: 'Design', departmentId: departments['DES'].id },
    { title: 'Account Executive', family: 'Sales', departmentId: departments['SALES'].id },
  ];
  const roles = [];
  for (const r of rolesData) {
    roles.push(await prisma.role.create({ data: r }));
  }
  
  // 6. Create Bands (for SWE L5 in SF)
  const sweRole = roles.find(r => r.title === 'Software Engineer');
  const sfLoc = locations.find(l => l.city === 'San Francisco');
  const l5Level = levels['L5'];

  if (sweRole && sfLoc && l5Level) {
    await prisma.compensationBand.create({
      data: {
        roleId: sweRole.id,
        levelId: l5Level.id,
        locationId: sfLoc.id,
        minSalary: 160000,
        midSalary: 190000,
        maxSalary: 220000,
        effectiveDate: new Date('2024-01-01'),
      }
    });

    // Create a benchmark
    await prisma.salaryBenchmark.create({
      data: {
        roleId: sweRole.id,
        levelId: l5Level.id,
        locationId: sfLoc.id,
        p10: 150000,
        p25: 170000,
        p50: 195000,
        p75: 215000,
        p90: 240000,
        source: 'Radford',
        surveyDate: new Date('2024-01-01')
      }
    });
  }

  // 7. Create some Employees
  for (let i = 1; i <= 20; i++) {
    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    const randomLevel = Object.values(levels)[Math.floor(Math.random() * Object.values(levels).length)];
    const randomLoc = locations[Math.floor(Math.random() * locations.length)];
    const salary = 100000 + (randomLevel.rank * 20000) + Math.floor(Math.random() * 20000);
    
    await prisma.employee.create({
      data: {
        employeeId: `EMP-${1000 + i}`,
        firstName: `User${i}`,
        lastName: `Test${i}`,
        email: `user${i}@compintel.com`,
        roleId: randomRole.id,
        levelId: randomLevel.id,
        locationId: randomLoc.id,
        departmentId: randomRole.departmentId,
        currentSalary: salary,
        totalCompensation: salary * 1.2,
        hireDate: new Date(new Date().getTime() - Math.random() * 10000000000),
      }
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
