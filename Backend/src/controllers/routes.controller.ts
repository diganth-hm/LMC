import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { RouteService } from '../services/routeService';
import { sendSuccess, sendError } from '../utils/helpers';

export class RoutesController {
  static async getCandidateRoutes(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const deliveryId = req.query.deliveryId as string;
      if (!deliveryId) {
        sendError(res, 'INVALID_INPUT', 'deliveryId query parameter is required', 400);
        return;
      }

      const routes = await RouteService.getCandidateRoutesForDelivery(deliveryId);
      sendSuccess(res, { routes });
    } catch (err) {
      const msg = (err as Error).message;
      if (msg === 'DELIVERY_NOT_FOUND') {
        sendError(res, 'DELIVERY_NOT_FOUND', 'Delivery not found', 404);
      } else {
        sendError(res, 'INTERNAL_ERROR', msg, 500);
      }
    }
  }

  static async selectRoute(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
        return;
      }

      const routeId = req.params.id as string;
      const deliveryId = req.body.deliveryId as string;

      if (!deliveryId) {
        sendError(res, 'INVALID_INPUT', 'deliveryId is required in request body', 400);
        return;
      }

      const riderId = req.user.userId;
      const result = await RouteService.selectRoute(deliveryId, routeId, riderId);
      sendSuccess(res, result);
    } catch (err) {
      const msg = (err as Error).message;
      if (msg === 'ROUTE_ALREADY_SELECTED') {
        sendError(res, 'ROUTE_ALREADY_SELECTED', 'A route has already been selected for this delivery', 409);
      } else if (msg === 'DELIVERY_NOT_FOUND' || msg === 'INVALID_ROUTE_ID') {
        sendError(res, 'NOT_FOUND', msg, 404);
      } else if (msg === 'FORBIDDEN_DELIVERY_ACCESS') {
        sendError(res, 'FORBIDDEN', 'You are not assigned to this delivery', 403);
      } else {
        sendError(res, 'INTERNAL_ERROR', msg, 500);
      }
    }
  }
}
