import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

const router = Router();

router.use(requireAuth);
router.use(requireRole(['platform_admin']));

// GET /analytics/emissions
router.get('/emissions', AnalyticsController.getEmissions);

// GET /analytics/leaderboard
router.get('/leaderboard', AnalyticsController.getLeaderboard);

// GET /analytics/deliveries
router.get('/deliveries', AnalyticsController.getDeliveryTrend);

// POST /analytics/reports/generate
router.post('/reports/generate', AnalyticsController.generateReport);

export default router;
