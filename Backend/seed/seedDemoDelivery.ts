/**
 * seedDemoDelivery.ts
 *
 * Creates (or resets) a persistent demo delivery for the Guru Prasad rider account.
 *
 * Pickup:  Hampankatta Junction, Mangaluru (12.8698° N, 74.8428° E)
 * Drop:    Kadri Manjunath Temple, Kadri Hills, Mangaluru (12.8874° N, 74.8480° E)
 * ~3.2 km apart — reliably generates 2–3 alternative routes via Mapbox / fallback.
 *
 * Run with:
 *   npx ts-node seed/seedDemoDelivery.ts
 *
 * Safe to re-run: any existing assigned/in_progress delivery for Guru Prasad is
 * deleted first, then a fresh one is created. Completed deliveries are untouched.
 */

import { prisma } from '../src/models/prisma';

// ── Fixed demo coordinates ────────────────────────────────────────────────────
const DEMO_PICKUP = {
  lat: 12.9716,
  lng: 77.6408,
  label: 'Indiranagar 100 Feet Road, Bengaluru',
};

const DEMO_DROP = {
  lat: 12.9352,
  lng: 77.6245,
  label: 'Koramangala 5th Block, Bengaluru',
};

// ── Demo rider phone (matches seedRiders.ts) ──────────────────────────────────
const DEMO_RIDER_PHONE = '9876543210';

async function main() {
  console.log('🚀 Seeding demo delivery for Guru Prasad...\n');

  // 1. Find the demo rider's user record
  const user = await prisma.user.findUnique({
    where: { phone: DEMO_RIDER_PHONE },
    include: { rider: true },
  });

  if (!user || !user.rider) {
    console.error(
      `❌ Rider with phone ${DEMO_RIDER_PHONE} not found in DB.\n` +
        '   Run the full seed first: npm run db:seed'
    );
    process.exit(1);
  }

  const rider = user.rider;
  console.log(`✅ Found rider: ${rider.name} (id: ${rider.id})`);

  // 2. Find the fleet & city to attach the delivery to
  const fleet = await prisma.fleet.findFirst();
  if (!fleet) {
    console.error('❌ No fleet found. Run the full seed first: npm run db:seed');
    process.exit(1);
  }

  const city = await prisma.city.findFirst({ where: { name: 'Bengaluru' } });
  if (!city) {
    console.error('❌ Bengaluru city not found. Run the full seed first: npm run db:seed');
    process.exit(1);
  }

  console.log(`✅ Using fleet: ${fleet.name}, city: ${city.name}`);

  // 3. Delete any existing active (assigned / in_progress) delivery for this rider
  //    so the script is fully idempotent and a fresh demo is always clean.
  //    Must delete child records first to satisfy FK constraints:
  //    route_selections → routes → co2_calculations → rewards → delivery
  const activeDeliveries = await prisma.delivery.findMany({
    where: {
      rider_id: rider.id,
      status: { in: ['assigned', 'in_progress'] },
    },
    select: { id: true },
  });

  if (activeDeliveries.length > 0) {
    const deliveryIds = activeDeliveries.map((d) => d.id);

    // Delete child tables in FK order
    await prisma.routeSelection.deleteMany({ where: { delivery_id: { in: deliveryIds } } });
    await prisma.route.deleteMany({ where: { delivery_id: { in: deliveryIds } } });
    await prisma.reward.deleteMany({ where: { delivery_id: { in: deliveryIds } } });
    await prisma.co2Calculation.deleteMany({ where: { delivery_id: { in: deliveryIds } } });
    await prisma.delivery.deleteMany({ where: { id: { in: deliveryIds } } });

    console.log(`🗑️  Removed ${deliveryIds.length} existing active delivery(s) and their child records`);
  }

  // 4. Create the demo delivery in 'assigned' status (no routes yet).
  //    Routes are generated on-demand by the RouteService when the rider taps "View Routes".
  const delivery = await prisma.delivery.create({
    data: {
      rider_id: rider.id,
      fleet_id: fleet.id,
      city_id: city.id,
      pickup_lat: DEMO_PICKUP.lat,
      pickup_lng: DEMO_PICKUP.lng,
      drop_lat: DEMO_DROP.lat,
      drop_lng: DEMO_DROP.lng,
      status: 'assigned',
      assigned_at: new Date(),
    },
  });

  console.log('\n🎉 Demo delivery created successfully!');
  console.log('─────────────────────────────────────────────────────');
  console.log(`  Delivery ID  : ${delivery.id}`);
  console.log(`  Rider        : ${rider.name} (phone: ${DEMO_RIDER_PHONE}, OTP: 1234)`);
  console.log(`  Status       : ${delivery.status}`);
  console.log(`  Pickup       : ${DEMO_PICKUP.label}`);
  console.log(`               : lat ${DEMO_PICKUP.lat}, lng ${DEMO_PICKUP.lng}`);
  console.log(`  Drop         : ${DEMO_DROP.label}`);
  console.log(`               : lat ${DEMO_DROP.lat}, lng ${DEMO_DROP.lng}`);
  console.log('─────────────────────────────────────────────────────');
  console.log('\nHow to demo:');
  console.log('  1. Open the Rider App (http://localhost:5174)');
  console.log('  2. Enter phone: 9876543210  →  OTP: 1234');
  console.log('  3. Dashboard shows the active delivery card');
  console.log('  4. Tap the card → DeliveryAssignment screen');
  console.log('  5. Tap "View Routes" → 3 routes generated live from Mapbox');
  console.log('  6. Select a route → Live Tracking → Complete → CO₂ reveal + reward\n');
}

main()
  .catch((err) => {
    console.error('❌ seedDemoDelivery failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
