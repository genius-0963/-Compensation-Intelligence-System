const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const citiesData = {
  "San Francisco": { lat: 37.7749, lng: -122.4194, ppp: 1.0, growth: 5.2, score: 8.5 },
  "New York": { lat: 40.7128, lng: -74.0060, ppp: 1.0, growth: 4.8, score: 8.2 },
  "Seattle": { lat: 47.6062, lng: -122.3321, ppp: 1.05, growth: 3.5, score: 8.8 },
  "London": { lat: 51.5074, lng: -0.1278, ppp: 0.9, growth: 6.1, score: 8.0 },
  "Zurich": { lat: 47.3769, lng: 8.5417, ppp: 0.8, growth: 2.4, score: 7.5 },
  "Bangalore": { lat: 12.9716, lng: 77.5946, ppp: 3.2, growth: 12.5, score: 9.0 },
  "Berlin": { lat: 52.5200, lng: 13.4050, ppp: 1.1, growth: 5.5, score: 8.4 },
  "Singapore": { lat: 1.3521, lng: 103.8198, ppp: 1.0, growth: 7.2, score: 8.6 },
  "Austin": { lat: 30.2672, lng: -97.7431, ppp: 1.1, growth: 8.0, score: 8.5 },
  "Toronto": { lat: 43.6510, lng: -79.3470, ppp: 1.0, growth: 4.5, score: 8.1 },
  "Sydney": { lat: -33.8688, lng: 151.2093, ppp: 0.9, growth: 3.8, score: 8.2 },
};

async function main() {
  console.log('Seeding location metadata...');
  const locations = await prisma.location.findMany();
  let count = 0;
  for (const loc of locations) {
    const data = citiesData[loc.city] || {
      lat: (Math.random() * 140) - 70, // Avoid extremes for better map centering
      lng: (Math.random() * 360) - 180,
      ppp: parseFloat((0.8 + Math.random() * 2).toFixed(2)),
      growth: parseFloat((Math.random() * 15).toFixed(1)),
      score: parseFloat((5 + Math.random() * 4).toFixed(1))
    };
    
    await prisma.location.update({
      where: { id: loc.id },
      data: {
        latitude: data.lat,
        longitude: data.lng,
        pppIndex: data.ppp,
        growthRate: data.growth,
        relocationScore: data.score
      }
    });
    count++;
  }
  console.log(`Seeded ${count} locations!`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
