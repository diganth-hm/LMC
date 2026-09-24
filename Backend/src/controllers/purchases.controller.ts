import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { PurchaseService } from '../services/purchaseService';
import { sendSuccess, sendError } from '../utils/helpers';

export class PurchasesController {
  static async executePurchase(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
        return;
      }

      const { creditBatchId, tonnes } = req.body;
      if (!creditBatchId || typeof tonnes !== 'number') {
        sendError(res, 'INVALID_INPUT', 'creditBatchId and numeric tonnes are required', 400);
        return;
      }

      const result = await PurchaseService.executePurchase(
        req.user.userId,
        creditBatchId,
        tonnes
      );

      sendSuccess(res, result, 201);
    } catch (err) {
      const msg = (err as Error).message;
      if (msg === 'EXCEEDS_AVAILABLE_INVENTORY') {
        sendError(res, 'EXCEEDS_INVENTORY', 'Requested tonnes exceed available credit batch inventory', 400);
      } else if (msg === 'CREDIT_BATCH_NOT_FOUND' || msg === 'CORPORATE_BUYER_NOT_FOUND') {
        sendError(res, 'NOT_FOUND', msg, 404);
      } else {
        sendError(res, 'PURCHASE_FAILED', msg, 400);
      }
    }
  }

  static async getPurchases(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
        return;
      }

      const purchases = await PurchaseService.getBuyerPurchases(req.user.userId);
      sendSuccess(res, { purchases });
    } catch (err) {
      sendError(res, 'INTERNAL_ERROR', (err as Error).message, 500);
    }
  }

  static async getPurchaseDetail(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const purchase = await PurchaseService.getPurchaseDetail(id);
      sendSuccess(res, { purchase });
    } catch (err) {
      const msg = (err as Error).message;
      if (msg === 'PURCHASE_NOT_FOUND') {
        sendError(res, 'NOT_FOUND', 'Purchase record not found', 404);
      } else {
        sendError(res, 'INTERNAL_ERROR', msg, 500);
      }
    }
  }
}
