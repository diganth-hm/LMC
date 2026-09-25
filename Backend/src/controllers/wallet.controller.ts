import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { prisma } from '../models/prisma';
import { WalletService } from '../services/walletService';
import { sendSuccess, sendError } from '../utils/helpers';

export class WalletController {
  static async getWallet(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
        return;
      }

      const rider = await prisma.rider.findUnique({
        where: { user_id: req.user.userId },
      });

      if (!rider) {
        sendError(res, 'RIDER_NOT_FOUND', 'Rider not found', 404);
        return;
      }

      const wallet = await WalletService.getRiderWalletSummary(rider.id);
      sendSuccess(res, wallet);
    } catch (err) {
      sendError(res, 'INTERNAL_ERROR', (err as Error).message, 500);
    }
  }

  static async getTransactions(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
        return;
      }

      const rider = await prisma.rider.findUnique({
        where: { user_id: req.user.userId },
      });

      if (!rider) {
        sendError(res, 'RIDER_NOT_FOUND', 'Rider not found', 404);
        return;
      }

      const result = await WalletService.getPaginatedTransactions(
        rider.id,
        req.query.page as string,
        req.query.limit as string
      );
      sendSuccess(res, result);
    } catch (err) {
      sendError(res, 'INTERNAL_ERROR', (err as Error).message, 500);
    }
  }

  static async withdraw(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
        return;
      }

      const { amount, upiId } = req.body;
      const amountInr = Number(amount);

      if (!amountInr || amountInr <= 0) {
        sendError(res, 'INVALID_AMOUNT', 'Withdrawal amount must be a positive number', 400);
        return;
      }

      const rider = await prisma.rider.findUnique({
        where: { user_id: req.user.userId },
      });

      if (!rider) {
        sendError(res, 'RIDER_NOT_FOUND', 'Rider not found', 404);
        return;
      }

      const payoutUpi = upiId || 'guru@upi';
      const result = await WalletService.withdrawWallet(rider.id, amountInr, payoutUpi);
      sendSuccess(res, result);
    } catch (err) {
      const msg = (err as Error).message;
      if (msg === 'INSUFFICIENT_FUNDS') {
        sendError(res, 'INSUFFICIENT_FUNDS', 'Insufficient wallet balance for withdrawal', 400);
      } else {
        sendError(res, 'INTERNAL_ERROR', msg, 500);
      }
    }
  }
}
