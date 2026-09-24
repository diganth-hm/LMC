import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

// /auth/rider/login
router.post('/rider/login', AuthController.requestRiderOtp);

// /auth/rider/verify-otp
router.post('/rider/verify-otp', AuthController.verifyRiderOtp);

// /auth/login
router.post('/login', AuthController.loginEmailPassword);

// /auth/me
router.get('/me', requireAuth, AuthController.me);

// /auth/logout
router.post('/logout', requireAuth, AuthController.logout);

export default router;
