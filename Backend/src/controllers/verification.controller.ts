import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { VerificationService } from '../services/verificationService';
import { sendSuccess, sendError } from '../utils/helpers';

export class VerificationController {
  static async getAuditTrail(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const auditTrail = await VerificationService.getAuditTrail(id);
      sendSuccess(res, auditTrail);
    } catch (err) {
      const msg = (err as Error).message;
      if (msg === 'VERIFICATION_RECORD_NOT_FOUND') {
        sendError(res, 'NOT_FOUND', 'Verification record not found for this batch', 404);
      } else {
        sendError(res, 'INTERNAL_ERROR', msg, 500);
      }
    }
  }
}
