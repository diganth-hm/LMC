import { Router } from 'express';
import { DeliveriesController } from '../controllers/deliveries.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

const router = Router();

router.use(requireAuth);
router.use(requireRole(['rider']));

// GET /deliveries/current
router.get('/current', DeliveriesController.getCurrentDelivery);

// POST /deliveries/:id/complete
router.post('/:id/complete', DeliveriesController.completeDelivery);

// GET /deliveries/history
router.get('/history', DeliveriesController.getHistory);

export default router;
