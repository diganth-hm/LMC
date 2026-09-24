import { prisma } from '../src/models/prisma';
import { seedRidersAndFleets } from './seedRiders';
import { seedDeliveries } from './seedDeliveries';
import { seedBuyersAndPurchases } from './seedBuyers';

async function main() {
  console.log('🚀 Starting Full Seed Process for LastMile Carbon...');

  try {
    const { cities, fleets, guruRider, secondaryRiders } = await seedRidersAndFleets();
    await seedDeliveries(cities, fleets, guruRider, secondaryRiders);
    await seedBuyersAndPurchases(cities);

    console.log('\n🎉 Seed process completed successfully!');
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
