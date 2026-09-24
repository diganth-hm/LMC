import { Router } from 'express';
import { PurchasesController } from '../controllers/purchases.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

const router = Router();

router.use(requireAuth);
router.use(requireRole(['corporate_buyer']));

// POST /purchases
router.post('/', PurchasesController.executePurchase);

// GET /purchases
router.get('/', PurchasesController.getPurchases);

// GET /purchases/:id
router.get('/:id', PurchasesController.getPurchaseDetail);

export default router;
