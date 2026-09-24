import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { prisma } from '../models/prisma';
import { EmissionsService } from '../services/emissionsService';
import { sendSuccess, sendError } from '../utils/helpers';

export class Co2Controller {
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

      const range = (req.query.range as string) === '7d' ? 7 : 30;
      const history = await EmissionsService.getRiderCo2History(rider.id, range);
      sendSuccess(res, history);
    } catch (err) {
      sendError(res, 'INTERNAL_ERROR', (err as Error).message, 500);
    }
  }

  static async getSummary(req: AuthenticatedRequest, res: Response): Promise<void> {
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

      const summary = await EmissionsService.getRiderCo2Summary(rider.id);
      sendSuccess(res, summary);
    } catch (err) {
      sendError(res, 'INTERNAL_ERROR', (err as Error).message, 500);
    }
  }
}
