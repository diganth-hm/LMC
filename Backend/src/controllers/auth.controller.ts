import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { sendSuccess, sendError } from '../utils/helpers';
import { AuthenticatedRequest } from '../types';

export class AuthController {
  static async requestRiderOtp(req: Request, res: Response): Promise<void> {
    try {
      const { phone } = req.body;
      if (!phone) {
        sendError(res, 'INVALID_INPUT', 'Phone number is required', 400);
        return;
      }
      const result = await AuthService.requestRiderOtp(phone);
      sendSuccess(res, result);
    } catch (err) {
      sendError(res, 'AUTH_FAILED', (err as Error).message, 400);
    }
  }

  static async verifyRiderOtp(req: Request, res: Response): Promise<void> {
    try {
      const { phone, otp } = req.body;
      if (!phone || !otp) {
        sendError(res, 'INVALID_INPUT', 'Phone and OTP are required', 400);
        return;
      }
      const result = await AuthService.verifyRiderOtp(phone, otp);
      sendSuccess(res, result);
    } catch (err) {
      sendError(res, 'INVALID_OTP', (err as Error).message === 'INVALID_OTP' ? 'Invalid or expired OTP' : (err as Error).message, 401);
    }
  }

  static async loginEmailPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        sendError(res, 'INVALID_INPUT', 'Email and password are required', 400);
        return;
      }
      const result = await AuthService.loginWithEmail(email, password);
      sendSuccess(res, result);
    } catch (err) {
      sendError(res, 'INVALID_CREDENTIALS', 'Invalid email or password', 401);
    }
  }

  static async me(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'UNAUTHORIZED', 'No authentication token provided', 401);
        return;
      }
      const result = await AuthService.me(req.user.userId);
      sendSuccess(res, result);
    } catch (err) {
      sendError(res, 'USER_NOT_FOUND', (err as Error).message, 404);
    }
  }

  static async logout(_req: Request, res: Response): Promise<void> {
    sendSuccess(res, { success: true, message: 'Logged out successfully' });
  }
}
