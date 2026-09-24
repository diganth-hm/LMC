import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { CertificateService } from '../services/certificateService';
import { sendSuccess, sendError } from '../utils/helpers';

export class CertificatesController {
  static async getCertificate(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const metadata = await CertificateService.getCertificateMetadata(id);
      sendSuccess(res, { certificate: metadata });
    } catch (err) {
      const msg = (err as Error).message;
      if (msg === 'CERTIFICATE_NOT_FOUND') {
        sendError(res, 'NOT_FOUND', 'Certificate not found', 404);
      } else {
        sendError(res, 'INTERNAL_ERROR', msg, 500);
      }
    }
  }

  static async downloadCertificate(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const pdfBuffer = await CertificateService.getCertificatePdfBuffer(id);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="Certificate_${id}.pdf"`);
      res.status(200).send(pdfBuffer);
    } catch (err) {
      const msg = (err as Error).message;
      if (msg === 'CERTIFICATE_NOT_FOUND') {
        sendError(res, 'NOT_FOUND', 'Certificate not found', 404);
      } else {
        sendError(res, 'INTERNAL_ERROR', msg, 500);
      }
    }
  }
}
