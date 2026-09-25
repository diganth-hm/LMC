import {
  EMISSION_FACTORS,
  BASE_FUEL_EFFICIENCY,
  GRS_WEIGHTS,
} from '../config/constants';
import { prisma } from '../models/prisma';
import { treeEquivalent } from '../utils/helpers';

export interface RouteEmissionsInput {
  distanceKm: number;
  congestionScore: number;
  vehicleType: string;
}

export interface RouteScoringResult {
  distanceKm: number;
  durationMin: number;
  congestionScore: number;
  co2Kg: number;
  fuelCostInr: number;
  grsScore: number;
  isGreenest?: boolean;
}

export class EmissionsService {
  /**
   * Calculate CO₂ emissions for a given distance, congestion, and vehicle type
   */
  static calculateCo2Kg(input: RouteEmissionsInput): { co2Kg: number; fuelCostInr: number } {
    const emissionFactor = EMISSION_FACTORS[input.vehicleType] ?? EMISSION_FACTORS.petrol_2w;
    const baseEfficiency = BASE_FUEL_EFFICIENCY[input.vehicleType] ?? BASE_FUEL_EFFICIENCY.petrol_2w;

    // Congestion reduces fuel efficiency (up to 30% reduction in heavy traffic)
    const efficiencyPenalty = (input.congestionScore / 100) * 0.3;
    const effectiveEfficiency = Math.max(5, baseEfficiency * (1 - efficiencyPenalty));

    // Consumed units (litres for petrol/diesel, kWh for EV, kg for CNG)
    const unitsUsed = input.distanceKm / effectiveEfficiency;
    const co2Kg = Math.round(unitsUsed * emissionFactor * 100) / 100;

    // Fuel cost estimation (INR per unit: Petrol ~102, EV ~8.5/kWh, Diesel ~90, CNG ~85)
    const unitPriceMap: Record<string, number> = {
      petrol_2w: 102,
      ev_2w: 8.5,
      diesel_3w: 90,
      cng_3w: 85,
    };
    const unitPrice = unitPriceMap[input.vehicleType] ?? 100;
    const fuelCostInr = Math.round(unitsUsed * unitPrice * 100) / 100;

    return { co2Kg, fuelCostInr };
  }

  /**
   * Compute GRS (Green Route Score 0-100, lower = greener) for candidate routes
   */
  static scoreCandidateRoutes(
    candidates: Array<{ distanceKm: number; durationMin: number; congestionScore: number }>,
    vehicleType: string
  ): RouteScoringResult[] {
    if (candidates.length === 0) return [];

    const scored = candidates.map((cand) => {
      const { co2Kg, fuelCostInr } = this.calculateCo2Kg({
        distanceKm: cand.distanceKm,
        congestionScore: cand.congestionScore,
        vehicleType,
      });
      return {
        ...cand,
        co2Kg,
        fuelCostInr,
      };
    });

    const maxDist = Math.max(...scored.map((s) => s.distanceKm), 1);
    const maxCong = Math.max(...scored.map((s) => s.congestionScore), 1);
    const maxCo2 = Math.max(...scored.map((s) => s.co2Kg), 0.1);

    const scoredWithGrs = scored.map((cand) => {
      const distNorm = (cand.distanceKm / maxDist) * 100;
      const congNorm = (cand.congestionScore / maxCong) * 100;
      const co2Norm = (cand.co2Kg / maxCo2) * 100;

      // Raw penalty (0 to 100, higher = dirtier/more congested)
      const penalty =
        distNorm * GRS_WEIGHTS.distance +
        congNorm * GRS_WEIGHTS.congestion +
        co2Norm * GRS_WEIGHTS.co2;

      // Green Route Score (1 to 100 where 100 = cleanest/greenest)
      const grsScore = Math.min(100, Math.max(10, Math.round(100 - penalty + 15)));

      return {
        ...cand,
        grsScore,
      };
    });

    // Identify highest GRS as greenest (100 = greenest)
    const maxGrs = Math.max(...scoredWithGrs.map((s) => s.grsScore));

    return scoredWithGrs.map((item) => ({
      ...item,
      isGreenest: item.grsScore === maxGrs,
    }));
  }

  /**
   * Compute CO₂ baseline vs actual calculation for a completed delivery
   */
  static calculateDeliveryCo2(
    routes: Array<{ id: string; grs_score: number; co2_kg: number }>,
    selectedRouteId: string
  ) {
    const selectedRoute = routes.find((r) => r.id === selectedRouteId);
    if (!selectedRoute) {
      throw new Error('SELECTED_ROUTE_NOT_FOUND');
    }

    // Baseline route is defined as the candidate route with highest CO2 / lowest GRS (least green)
    const baselineRoute = routes.reduce((prev, curr) =>
      curr.co2_kg > prev.co2_kg ? curr : prev
    , routes[0]);

    const baselineCo2Kg = Math.round(baselineRoute.co2_kg * 100) / 100;
    const actualCo2Kg = Math.round(selectedRoute.co2_kg * 100) / 100;
    const co2SavedKg = Math.max(0, Math.round((baselineCo2Kg - actualCo2Kg) * 100) / 100);

    return {
      baselineCo2Kg,
      actualCo2Kg,
      co2SavedKg,
    };
  }

  /**
   * Get CO₂ summary stats for a rider
   */
  static async getRiderCo2Summary(riderId: string) {
    const calculations = await prisma.co2Calculation.findMany({
      where: {
        delivery: { rider_id: riderId },
      },
    });

    const totalSavedKg = Math.round(
      calculations.reduce((sum: number, c: { co2_saved_kg: number }) => sum + c.co2_saved_kg, 0) * 100
    ) / 100;

    return {
      totalSavedKg,
      treeEquivalent: treeEquivalent(totalSavedKg),
    };
  }

  /**
   * Get historical CO₂ savings trend for a rider (7d or 30d)
   */
  static async getRiderCo2History(riderId: string, rangeDays = 30) {
    const sinceDate = new Date(Date.now() - rangeDays * 24 * 60 * 60 * 1000);

    const calculations = await prisma.co2Calculation.findMany({
      where: {
        delivery: { rider_id: riderId },
        calculated_at: { gte: sinceDate },
      },
      orderBy: { calculated_at: 'asc' },
    });

    const grouped: Record<string, number> = {};
    for (let i = rangeDays - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split('T')[0];
      grouped[dateStr] = 0;
    }

    calculations.forEach((c: { calculated_at: Date; co2_saved_kg: number }) => {
      const dateStr = c.calculated_at.toISOString().split('T')[0];
      if (grouped[dateStr] !== undefined) {
        grouped[dateStr] = Math.round((grouped[dateStr] + c.co2_saved_kg) * 100) / 100;
      }
    });

    const series = Object.entries(grouped).map(([date, co2SavedKg]) => ({
      date,
      co2SavedKg,
    }));

    const totalKg = Math.round(
      series.reduce((acc, curr) => acc + curr.co2SavedKg, 0) * 100
    ) / 100;

    return {
      series,
      totalKg,
      treeEquivalent: treeEquivalent(totalKg),
    };
  }
}
