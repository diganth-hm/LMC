import { Router } from 'express';
import { CreditsController } from '../controllers/credits.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

const router = Router();

router.use(requireAuth);
router.use(requireRole(['corporate_buyer', 'platform_admin']));

// GET /credits
router.get('/', CreditsController.listAvailableBatches);

// GET /credits/:id
router.get('/:id', CreditsController.getBatchDetail);

export default router;
