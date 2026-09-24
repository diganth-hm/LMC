import bcrypt from 'bcryptjs';
import { prisma } from '../src/models/prisma';
import { VehicleType } from '@prisma/client';

export async function seedRidersAndFleets() {
  console.log('🌱 Seeding Cities, Fleets, and Riders...');

  // 1. Seed Cities
  const citiesData = [
    { name: 'Mangaluru', state: 'Karnataka' },
    { name: 'Bengaluru', state: 'Karnataka' },
    { name: 'Mumbai', state: 'Maharashtra' },
  ];

  const cities: Record<string, string> = {};
  for (const c of citiesData) {
    const city = await prisma.city.upsert({
      where: { name: c.name },
      create: c,
      update: {},
    });
    cities[c.name] = city.id;
  }

  // 2. Seed Admin User & Fleets
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@lastmilecarbon.org' },
    create: {
      email: 'admin@lastmilecarbon.org',
      password_hash: adminPasswordHash,
      role: 'platform_admin',
    },
    update: {},
  });

  const fleetsData = [
    { name: 'Swiggy', platform_admin_user_id: adminUser.id, saas_rate_per_rider: 150 },
  ];

  const fleets: Record<string, string> = {};
  for (const f of fleetsData) {
    const fleet = await prisma.fleet.upsert({
      where: { platform_admin_user_id: f.platform_admin_user_id },
      create: f,
      update: {},
    });
    fleets[f.name] = fleet.id;
  }

  // 3. Seed Flagship Rider "Guru Prasad"
  const guruUser = await prisma.user.upsert({
    where: { phone: '9876543210' },
    create: {
      phone: '9876543210',
      email: 'guru.prasad@swiggy.in',
      role: 'rider',
    },
    update: {},
  });

  const guruRider = await prisma.rider.upsert({
    where: { user_id: guruUser.id },
    create: {
      user_id: guruUser.id,
      name: 'Guru Prasad',
      tier: 'gold',
      grs_score: 32.5,
      member_since: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    },
    update: {},
  });

  await prisma.vehicle.createMany({
    data: [
      { rider_id: guruRider.id, type: 'ev_2w' as VehicleType },
    ],
    skipDuplicates: true,
  });

  // 4. Seed 10 additional plausible riders
  const vehicleTypes: VehicleType[] = ['petrol_2w', 'ev_2w', 'cng_3w', 'diesel_3w'];
  const riderNames = [
    'Ramesh Kumar', 'Suresh Rai', 'Ananya Shetty', 'Praveen Poojary',
    'Mohammed Kaif', 'Deepak V', 'Kavya Nair', 'Vikram Singh',
    'Sunil Hegde', 'Naveen K'
  ];

  const secondaryRiders = [];
  for (let i = 0; i < riderNames.length; i++) {
    const phone = `98000000${i.toString().padStart(2, '0')}`;
    const user = await prisma.user.upsert({
      where: { phone },
      create: { phone, role: 'rider' },
      update: {},
    });

    const rider = await prisma.rider.upsert({
      where: { user_id: user.id },
      create: {
        user_id: user.id,
        name: riderNames[i],
        tier: i % 3 === 0 ? 'platinum' : i % 2 === 0 ? 'gold' : 'silver',
        grs_score: 25 + Math.floor(Math.random() * 40),
      },
      update: {},
    });

    await prisma.vehicle.createMany({
      data: [{ rider_id: rider.id, type: vehicleTypes[i % vehicleTypes.length] }],
      skipDuplicates: true,
    });

    secondaryRiders.push(rider);
  }

  return {
    cities,
    fleets,
    guruRider,
    secondaryRiders,
  };
}
