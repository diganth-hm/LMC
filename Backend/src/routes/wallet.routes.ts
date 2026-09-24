import { Router } from 'express';
import { WalletController } from '../controllers/wallet.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

const router = Router();

router.use(requireAuth);
router.use(requireRole(['rider']));

// GET /wallet
router.get('/', WalletController.getWallet);

// GET /wallet/transactions
router.get('/transactions', WalletController.getTransactions);

export default router;
