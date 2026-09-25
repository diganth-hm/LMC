import { Router } from 'express';
import { RiderController } from '../controllers/rider.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

const router = Router();

router.use(requireAuth);
router.use(requireRole(['rider']));

// GET /riders/me
router.get('/me', RiderController.getMe);

// PATCH /riders/me/vehicle
router.patch('/me/vehicle', RiderController.updateVehicle);

// PATCH /riders/me/payout
router.patch('/me/payout', RiderController.updatePayoutAccount);

export default router;
