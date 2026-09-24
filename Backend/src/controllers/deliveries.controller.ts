import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { prisma } from '../models/prisma';
import { sendSuccess, sendError, parsePagination } from '../utils/helpers';
import { EmissionsService } from '../services/emissionsService';
import { RewardService } from '../services/rewardService';

export class DeliveriesController {
  static async getCurrentDelivery(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
        return;
      }

      const rider = await prisma.rider.findUnique({
        where: { user_id: req.user.userId },
      });

      if (!rider) {
        sendError(res, 'RIDER_NOT_FOUND', 'Rider not found', 404);
        return;
      }

      const currentDelivery = await prisma.delivery.findFirst({
        where: {
          rider_id: rider.id,
          status: { in: ['assigned', 'in_progress'] },
        },
        include: {
          city: true,
          fleet: true,
          routes: true,
          route_selection: true,
        },
        orderBy: { assigned_at: 'desc' },
      });

      sendSuccess(res, { delivery: currentDelivery });
    } catch (err) {
      sendError(res, 'INTERNAL_ERROR', (err as Error).message, 500);
    }
  }

  static async completeDelivery(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
        return;
      }

      const id = req.params.id as string;

      const delivery = await prisma.delivery.findUnique({
        where: { id },
        include: {
          routes: true,
          route_selection: true,
          co2_calculation: true,
        },
      });

      if (!delivery) {
        sendError(res, 'DELIVERY_NOT_FOUND', 'Delivery not found', 404);
        return;
      }

      if (delivery.status === 'completed' || delivery.co2_calculation) {
        sendError(res, 'DELIVERY_ALREADY_COMPLETED', 'This delivery is already marked complete', 409);
        return;
      }

      if (!delivery.route_selection) {
        sendError(res, 'ROUTE_NOT_SELECTED', 'A route must be selected before completing delivery', 400);
        return;
      }

      // Calculate baseline vs actual CO₂
      const co2Calc = EmissionsService.calculateDeliveryCo2(
        delivery.routes,
        delivery.route_selection.route_id
      );

      // Save CO₂ calculation and mark delivery completed in a transaction
      const [persistedCo2] = await prisma.$transaction([
        prisma.co2Calculation.create({
          data: {
            delivery_id: id,
            baseline_co2_kg: co2Calc.baselineCo2Kg,
            actual_co2_kg: co2Calc.actualCo2Kg,
            co2_saved_kg: co2Calc.co2SavedKg,
          },
        }),
        prisma.delivery.update({
          where: { id },
          data: {
            status: 'completed',
            completed_at: new Date(),
          },
        }),
      ]);

      // Trigger reward calculation & wallet credit synchronously
      const rewardResult = await RewardService.processDeliveryReward(
        id,
        delivery.rider_id,
        persistedCo2.co2_saved_kg
      );

      sendSuccess(res, {
        deliveryId: id,
        co2Saved: rewardResult.co2SavedKg,
        rewardAmount: rewardResult.rewardAmountInr,
        newBalance: rewardResult.newBalance,
      });
    } catch (err) {
      sendError(res, 'INTERNAL_ERROR', (err as Error).message, 500);
    }
  }

  static async getHistory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
        return;
      }

      const rider = await prisma.rider.findUnique({
        where: { user_id: req.user.userId },
      });

      if (!rider) {
        sendError(res, 'RIDER_NOT_FOUND', 'Rider not found', 404);
        return;
      }

      const { page, limit, skip } = parsePagination(
        req.query.page as string,
        req.query.limit as string
      );

      const [total, deliveries] = await Promise.all([
        prisma.delivery.count({
          where: { rider_id: rider.id, status: 'completed' },
        }),
        prisma.delivery.findMany({
          where: { rider_id: rider.id, status: 'completed' },
          include: {
            city: true,
            co2_calculation: true,
            rewards: true,
            route_selection: { include: { route: true } },
          },
          orderBy: { completed_at: 'desc' },
          skip,
          take: limit,
        }),
      ]);

      sendSuccess(res, {
        deliveries: deliveries.map((d) => ({
          id: d.id,
          city: d.city.name,
          assignedAt: d.assigned_at,
          completedAt: d.completed_at,
          co2SavedKg: d.co2_calculation?.co2_saved_kg || 0,
          rewardAmountInr: d.rewards[0]?.amount_inr || 0,
          distanceKm: d.route_selection?.route.distance_km || 0,
          grsScore: d.route_selection?.route.grs_score || 0,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      sendError(res, 'INTERNAL_ERROR', (err as Error).message, 500);
    }
  }
}
