import { prisma } from '../models/prisma';
import { getRouteCandidates } from '../external/mapboxClient';
import { EmissionsService } from './emissionsService';

export class RouteService {
  /**
   * Get 3 candidate routes for a delivery.
   * If not existing, generates them using Mapbox + EmissionsService and stores them.
   */
  static async getCandidateRoutesForDelivery(deliveryId: string) {
    const delivery = await prisma.delivery.findUnique({
      where: { id: deliveryId },
      include: {
        rider: {
          include: { vehicles: true },
        },
        routes: true,
      },
    });

    if (!delivery) {
      throw new Error('DELIVERY_NOT_FOUND');
    }

    // If routes already generated for this delivery, return them
    if (delivery.routes && delivery.routes.length > 0) {
      const maxGrs = Math.max(...delivery.routes.map((r) => r.grs_score));
      return delivery.routes.map((r) => ({
        id: r.id,
        deliveryId: r.delivery_id,
        distanceKm: r.distance_km,
        durationMin: r.duration_min,
        congestionScore: r.congestion_score,
        grsScore: r.grs_score,
        co2Kg: r.co2_kg,
        fuelCostInr: Math.round(r.co2_kg * 45 * 100) / 100, // estimated
        isSelected: r.is_selected,
        isGreenest: r.grs_score === maxGrs,
      }));
    }

    // Get vehicle type
    const vehicleType = delivery.rider?.vehicles[0]?.type || 'petrol_2w';

    // Fetch candidate raw routes from Mapbox client wrapper
    const mapboxCandidates = await getRouteCandidates(
      delivery.pickup_lat,
      delivery.pickup_lng,
      delivery.drop_lat,
      delivery.drop_lng
    );

    // Score candidates with EmissionsService
    const scoredCandidates = EmissionsService.scoreCandidateRoutes(mapboxCandidates, vehicleType);

    // Persist routes in DB
    const createdRoutes = await Promise.all(
      scoredCandidates.map((c) =>
        prisma.route.create({
          data: {
            delivery_id: deliveryId,
            distance_km: c.distanceKm,
            duration_min: c.durationMin,
            congestion_score: c.congestionScore,
            grs_score: c.grsScore,
            co2_kg: c.co2Kg,
            is_selected: false,
          },
        })
      )
    );

    const maxGrs = Math.max(...createdRoutes.map((r) => r.grs_score));

    return createdRoutes.map((r, idx) => ({
      id: r.id,
      deliveryId: r.delivery_id,
      distanceKm: r.distance_km,
      durationMin: r.duration_min,
      congestionScore: r.congestion_score,
      grsScore: r.grs_score,
      co2Kg: r.co2_kg,
      fuelCostInr: scoredCandidates[idx].fuelCostInr,
      isSelected: r.is_selected,
      isGreenest: r.grs_score === maxGrs,
    }));
  }

  /**
   * Select and lock a route for a delivery
   */
  static async selectRoute(deliveryId: string, routeId: string, riderId: string) {
    const delivery = await prisma.delivery.findUnique({
      where: { id: deliveryId },
      include: { route_selection: true, routes: true },
    });

    if (!delivery) {
      throw new Error('DELIVERY_NOT_FOUND');
    }

    if (delivery.rider_id !== riderId) {
      throw new Error('FORBIDDEN_DELIVERY_ACCESS');
    }

    if (delivery.route_selection) {
      throw new Error('ROUTE_ALREADY_SELECTED');
    }

    const routeToSelect = delivery.routes.find((r) => r.id === routeId);
    if (!routeToSelect) {
      throw new Error('INVALID_ROUTE_ID');
    }

    // Lock selection and mark delivery in_progress
    const [selection] = await prisma.$transaction([
      prisma.routeSelection.create({
        data: {
          delivery_id: deliveryId,
          route_id: routeId,
        },
      }),
      prisma.route.update({
        where: { id: routeId },
        data: { is_selected: true },
      }),
      prisma.delivery.update({
        where: { id: deliveryId },
        data: { status: 'in_progress' },
      }),
    ]);

    return {
      routeSelection: {
        id: selection.id,
        deliveryId: selection.delivery_id,
        routeId: selection.route_id,
        selectedAt: selection.selected_at,
      },
    };
  }
}
