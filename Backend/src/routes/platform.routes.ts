import { Router } from 'express';
import { PlatformController } from '../controllers/platform.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

const router = Router();

router.use(requireAuth);
router.use(requireRole(['platform_admin']));

// GET /platform/overview
router.get('/overview', PlatformController.getOverview);

// GET /platform/fleet-analytics
router.get('/fleet-analytics', PlatformController.getFleetAnalytics);

// GET /platform/billing
router.get('/billing', PlatformController.getBilling);

// POST /platform/aggregate-now (on-demand aggregation trigger for demo)
router.post('/aggregate-now', PlatformController.triggerAggregation);

export default router;
