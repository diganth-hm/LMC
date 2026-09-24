import { Router } from 'express';
import { RoutesController } from '../controllers/routes.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

const router = Router();

router.use(requireAuth);
router.use(requireRole(['rider']));

// GET /routes?deliveryId=
router.get('/', RoutesController.getCandidateRoutes);

// POST /routes/:id/select
router.post('/:id/select', RoutesController.selectRoute);

export default router;
