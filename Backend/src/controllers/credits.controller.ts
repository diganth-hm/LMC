import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { CreditAggregationService } from '../services/creditAggregationService';
import { sendSuccess, sendError } from '../utils/helpers';

export class CreditsController {
  static async listAvailableBatches(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const batches = await CreditAggregationService.getAvailableBatches();
      sendSuccess(res, { batches });
    } catch (err) {
      sendError(res, 'INTERNAL_ERROR', (err as Error).message, 500);
    }
  }

  static async getBatchDetail(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const detail = await CreditAggregationService.getBatchDetail(id);
      sendSuccess(res, detail);
    } catch (err) {
      const msg = (err as Error).message;
      if (msg === 'BATCH_NOT_FOUND') {
        sendError(res, 'BATCH_NOT_FOUND', 'Credit batch not found', 404);
      } else {
        sendError(res, 'INTERNAL_ERROR', msg, 500);
      }
    }
  }
}
