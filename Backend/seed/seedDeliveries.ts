import { prisma } from '../src/models/prisma';
import { RouteService } from '../src/services/routeService';
import { EmissionsService } from '../src/services/emissionsService';
import { RewardService } from '../src/services/rewardService';

export async function seedDeliveries(
  cities: Record<string, string>,
  fleets: Record<string, string>,
  guruRider: { id: string },
  secondaryRiders: Array<{ id: string }>
) {
  console.log('📦 Seeding 30-day delivery dataset and calculating CO₂ + rewards...');

  const cityId = cities['Mangaluru'] || Object.values(cities)[0];
  const fleetId = Object.values(fleets)[0];

  // Base coordinates around Mangaluru city center (12.9141° N, 74.8560° E)
  const baseLat = 12.9141;
  const baseLng = 74.8560;

  const allRiders = [guruRider, ...secondaryRiders];

  for (const rider of allRiders) {
    const isGuru = rider.id === guruRider.id;
    const daysToSeed = 30;
    const deliveriesPerDay = isGuru ? 8 : 3;

    for (let day = daysToSeed; day >= 1; day--) {
      const date = new Date(Date.now() - day * 24 * 60 * 60 * 1000);

      for (let i = 0; i < deliveriesPerDay; i++) {
        date.setHours(9 + i * 1, Math.floor(Math.random() * 60));

        const pickupLat = baseLat + (Math.random() - 0.5) * 0.08;
        const pickupLng = baseLng + (Math.random() - 0.5) * 0.08;
        const dropLat = pickupLat + (Math.random() - 0.5) * 0.05;
        const dropLng = pickupLng + (Math.random() - 0.5) * 0.05;

        // 1. Create delivery
        const delivery = await prisma.delivery.create({
          data: {
            rider_id: rider.id,
            fleet_id: fleetId,
            city_id: cityId,
            pickup_lat: pickupLat,
            pickup_lng: pickupLng,
            drop_lat: dropLat,
            drop_lng: dropLng,
            status: 'assigned',
            assigned_at: date,
          },
        });

        // 2. Generate candidate routes
        const routes = await RouteService.getCandidateRoutesForDelivery(delivery.id);

        // 3. Select greenest route
        const greenestRoute = routes.find((r) => r.isGreenest) || routes[0];
        await RouteService.selectRoute(delivery.id, greenestRoute.id, rider.id);

        // 4. Calculate CO₂ baseline vs actual
        const dbRoutes = await prisma.route.findMany({ where: { delivery_id: delivery.id } });
        const co2Calc = EmissionsService.calculateDeliveryCo2(dbRoutes, greenestRoute.id);

        const completionDate = new Date(date.getTime() + Math.floor(greenestRoute.durationMin * 60 * 1000));

        await prisma.$transaction([
          prisma.co2Calculation.create({
            data: {
              delivery_id: delivery.id,
              baseline_co2_kg: co2Calc.baselineCo2Kg,
              actual_co2_kg: co2Calc.actualCo2Kg,
              co2_saved_kg: co2Calc.co2SavedKg,
              calculated_at: completionDate,
            },
          }),
          prisma.delivery.update({
            where: { id: delivery.id },
            data: {
              status: 'completed',
              completed_at: completionDate,
            },
          }),
        ]);

        // 5. Process Reward & Wallet credit
        await RewardService.processDeliveryReward(delivery.id, rider.id, co2Calc.co2SavedKg);
      }
    }
  }

  console.log('✅ Deliveries, CO₂ calculations, and Rewards seeded successfully!');
}
