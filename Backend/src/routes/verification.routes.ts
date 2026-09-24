import { Router } from 'express';
import { VerificationController } from '../controllers/verification.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

const router = Router();

router.use(requireAuth);
router.use(requireRole(['corporate_buyer', 'platform_admin']));

// GET /credits/:id/audit-trail
router.get('/:id/audit-trail', VerificationController.getAuditTrail);

export default router;
