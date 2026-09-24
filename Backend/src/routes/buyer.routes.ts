import { Router } from 'express';
import { BuyerController } from '../controllers/buyer.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

const router = Router();

router.use(requireAuth);
router.use(requireRole(['corporate_buyer']));

// GET /buyer/dashboard
router.get('/dashboard', BuyerController.getDashboard);

// GET /buyer/profile
router.get('/profile', BuyerController.getProfile);

// PATCH /buyer/profile
router.patch('/profile', BuyerController.updateProfile);

export default router;
