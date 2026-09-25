import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { prisma } from '../models/prisma';
import { sendSuccess, sendError } from '../utils/helpers';
import { VehicleType } from '@prisma/client';

export class RiderController {
  static async getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
        return;
      }

      const rider = await prisma.rider.findUnique({
        where: { user_id: req.user.userId },
        include: {
          vehicles: true,
          deliveries: {
            where: { status: 'completed' },
            include: { co2_calculation: true, rewards: true },
          },
        },
      });

      if (!rider) {
        sendError(res, 'RIDER_NOT_FOUND', 'Rider profile not found', 404);
        return;
      }

      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      const todayDeliveries = rider.deliveries.filter(
        (d) => d.completed_at && d.completed_at >= startOfToday
      );

      const todayCo2Saved = Math.round(
        todayDeliveries.reduce((sum, d) => sum + (d.co2_calculation?.co2_saved_kg || 0), 0) * 100
      ) / 100;

      const todayEarned = Math.round(
        todayDeliveries.reduce(
          (sum, d) => sum + d.rewards.reduce((rSum, r) => rSum + r.amount_inr, 0),
          0
        ) * 100
      ) / 100;

      sendSuccess(res, {
        name: rider.name,
        tier: rider.tier,
        grsScore: rider.grs_score,
        todayDeliveries: todayDeliveries.length,
        todayCo2Saved,
        todayEarned,
        vehicles: rider.vehicles,
      });
    } catch (err) {
      sendError(res, 'INTERNAL_ERROR', (err as Error).message, 500);
    }
  }

  static async updateVehicle(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
        return;
      }

      const { vehicleType } = req.body;
      const validTypes: VehicleType[] = ['petrol_2w', 'diesel_3w', 'cng_3w'];

      if (!vehicleType || !validTypes.includes(vehicleType as VehicleType)) {
        sendError(res, 'INVALID_VEHICLE_TYPE', `Vehicle type must be one of: ${validTypes.join(', ')}`, 400);
        return;
      }

      const rider = await prisma.rider.findUnique({
        where: { user_id: req.user.userId },
        include: { vehicles: true },
      });

      if (!rider) {
        sendError(res, 'RIDER_NOT_FOUND', 'Rider profile not found', 404);
        return;
      }

      let vehicle;
      if (rider.vehicles.length > 0) {
        vehicle = await prisma.vehicle.update({
          where: { id: rider.vehicles[0].id },
          data: { type: vehicleType as VehicleType },
        });
      } else {
        vehicle = await prisma.vehicle.create({
          data: {
            rider_id: rider.id,
            type: vehicleType as VehicleType,
          },
        });
      }

      sendSuccess(res, { vehicle });
    } catch (err) {
      sendError(res, 'INTERNAL_ERROR', (err as Error).message, 500);
    }
  }

  static async updatePayoutAccount(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
        return;
      }

      const { upiId } = req.body;
      const upiRegex = /^[\w.-]+@[\w.-]+$/;

      if (!upiId || !upiRegex.test(upiId)) {
        sendError(res, 'INVALID_UPI_ID', 'Please enter a valid UPI ID (e.g. name@upi)', 400);
        return;
      }

      const rider = await prisma.rider.findUnique({
        where: { user_id: req.user.userId },
      });

      if (!rider) {
        sendError(res, 'RIDER_NOT_FOUND', 'Rider profile not found', 404);
        return;
      }

      sendSuccess(res, {
        payoutAccount: upiId,
        message: 'Payout UPI ID updated successfully',
      });
    } catch (err) {
      sendError(res, 'INTERNAL_ERROR', (err as Error).message, 500);
    }
  }
}
