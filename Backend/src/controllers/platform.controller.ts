import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { prisma } from '../models/prisma';
import { sendSuccess, sendError, parseDateRange } from '../utils/helpers';
import { CreditAggregationService } from '../services/creditAggregationService';

export class PlatformController {
  static async getOverview(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { from, to } = parseDateRange(req.query.from as string, req.query.to as string);

      const [activeRidersCount, completedDeliveries, rewardsAggregate, ridersAggregate] =
        await Promise.all([
          prisma.rider.count(),
          prisma.delivery.findMany({
            where: {
              status: 'completed',
              completed_at: { gte: from, lte: to },
            },
            include: { co2_calculation: true },
          }),
          prisma.reward.aggregate({
            where: { paid_at: { gte: from, lte: to } },
            _sum: { amount_inr: true },
          }),
          prisma.rider.aggregate({
            _avg: { grs_score: true },
          }),
        ]);

      const totalCo2Saved = Math.round(
        completedDeliveries.reduce((sum, d) => sum + (d.co2_calculation?.co2_saved_kg || 0), 0) * 100
      ) / 100;

      const totalBonusesPaid = Math.round((rewardsAggregate._sum.amount_inr || 0) * 100) / 100;
      const avgGrs = Math.round((ridersAggregate._avg.grs_score || 0) * 10) / 10;

      sendSuccess(res, {
        activeRiders: activeRidersCount,
        totalCo2Saved,
        totalBonusesPaid,
        avgGrs,
      });
    } catch (err) {
      sendError(res, 'INTERNAL_ERROR', (err as Error).message, 500);
    }
  }

  static async getFleetAnalytics(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { from, to } = parseDateRange(req.query.from as string, req.query.to as string);
      const cityFilter = req.query.city as string;

      const cities = await prisma.city.findMany({
        where: cityFilter ? { name: { contains: cityFilter, mode: 'insensitive' } } : {},
        include: {
          deliveries: {
            where: {
              status: 'completed',
              completed_at: { gte: from, lte: to },
            },
            include: {
              co2_calculation: true,
              rider: true,
            },
          },
        },
      });

      const cityAnalytics = cities.map((c) => {
        const uniqueRiders = new Set(c.deliveries.map((d) => d.rider_id));
        const totalCo2Saved = Math.round(
          c.deliveries.reduce((sum, d) => sum + (d.co2_calculation?.co2_saved_kg || 0), 0) * 100
        ) / 100;

        const grsSum = c.deliveries.reduce((sum, d) => sum + d.rider.grs_score, 0);
        const avgGrs = c.deliveries.length > 0 ? Math.round((grsSum / c.deliveries.length) * 10) / 10 : 0;

        return {
          name: c.name,
          state: c.state,
          riderCount: uniqueRiders.size,
          co2Saved: totalCo2Saved,
          avgGrs,
          adoptionPct: Math.min(100, Math.round((avgGrs / 80) * 100)),
        };
      });

      sendSuccess(res, { cities: cityAnalytics });
    } catch (err) {
      sendError(res, 'INTERNAL_ERROR', (err as Error).message, 500);
    }
  }

  static async getBilling(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const fleets = await prisma.fleet.findMany({
        include: {
          deliveries: {
            where: { status: 'completed' },
          },
        },
      });

      const fleetBilling = fleets.map((f) => {
        const uniqueRiders = new Set(f.deliveries.map((d) => d.rider_id));
        const riderCount = Math.max(1, uniqueRiders.size);
        const ratePerRider = f.saas_rate_per_rider;
        const totalDue = riderCount * ratePerRider;

        return {
          id: f.id,
          fleetName: f.name,
          riderCount,
          ratePerRider,
          totalDue,
          status: 'active',
        };
      });

      const current = fleetBilling[0] || {
        riderCount: 45,
        ratePerRider: 150,
        totalDue: 6750,
        status: 'active',
      };

      sendSuccess(res, {
        current,
        history: fleetBilling,
      });
    } catch (err) {
      sendError(res, 'INTERNAL_ERROR', (err as Error).message, 500);
    }
  }

  /**
   * On-demand credit aggregation trigger for live demo moment
   */
  static async triggerAggregation(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { cityId } = req.body;

      let targetCityId = cityId;
      if (!targetCityId) {
        const firstCity = await prisma.city.findFirst();
        if (!firstCity) {
          sendError(res, 'CITY_NOT_FOUND', 'No cities found in database', 404);
          return;
        }
        targetCityId = firstCity.id;
      }

      const result = await CreditAggregationService.poolCityCo2Savings(targetCityId);
      sendSuccess(res, result);
    } catch (err) {
      sendError(res, 'AGGREGATION_FAILED', (err as Error).message, 400);
    }
  }
}
