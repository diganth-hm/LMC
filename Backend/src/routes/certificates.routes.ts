import { Router } from 'express';
import { CertificatesController } from '../controllers/certificates.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

const router = Router();

router.use(requireAuth);
router.use(requireRole(['corporate_buyer', 'platform_admin']));

// GET /certificates/:id
router.get('/:id', CertificatesController.getCertificate);

// GET /certificates/:id/download
router.get('/:id/download', CertificatesController.downloadCertificate);

export default router;
