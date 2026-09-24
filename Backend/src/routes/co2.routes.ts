import { Router } from 'express';
import { Co2Controller } from '../controllers/co2.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

const router = Router();

router.use(requireAuth);
router.use(requireRole(['rider']));

// GET /co2/history
router.get('/history', Co2Controller.getHistory);

// GET /co2/summary
router.get('/summary', Co2Controller.getSummary);

export default router;
