import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { prisma } from '../models/prisma';
import { sendSuccess, sendError, treeEquivalent } from '../utils/helpers';

export class BuyerController {
  static async getDashboard(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
        return;
      }

      const buyer = await prisma.corporateBuyer.findUnique({
        where: { user_id: req.user.userId },
        include: {
          purchases: {
            include: {
              certificate: true,
              credit_batch: { include: { city: true } },
            },
            orderBy: { purchased_at: 'desc' },
          },
        },
      });

      if (!buyer) {
        sendError(res, 'BUYER_NOT_FOUND', 'Corporate buyer profile not found', 404);
        return;
      }

      const totalTonnesPurchased = Math.round(
        buyer.purchases.reduce((sum, p) => sum + p.tonnes_purchased, 0) * 1000
      ) / 1000;

      const activeCertificates = buyer.purchases.filter((p) => p.certificate).length;

      const recentActivity = buyer.purchases.slice(0, 5).map((p) => ({
        id: p.id,
        cityName: p.credit_batch.city.name,
        tonnesPurchased: p.tonnes_purchased,
        totalAmountInr: p.total_amount_inr,
        purchasedAt: p.purchased_at,
        certificateId: p.certificate?.id || null,
      }));

      sendSuccess(res, {
        companyName: buyer.company_name,
        totalTonnesPurchased,
        impactEquivalent: {
          treesPlanted: Math.round(treeEquivalent(totalTonnesPurchased * 1000)),
          carsOffRoad: Math.round((totalTonnesPurchased / 4.6) * 10) / 10,
        },
        activeCertificates,
        recentActivity,
      });
    } catch (err) {
      sendError(res, 'INTERNAL_ERROR', (err as Error).message, 500);
    }
  }

  static async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
        return;
      }

      const buyer = await prisma.corporateBuyer.findUnique({
        where: { user_id: req.user.userId },
        include: { user: true },
      });

      if (!buyer) {
        sendError(res, 'BUYER_NOT_FOUND', 'Corporate buyer profile not found', 404);
        return;
      }

      sendSuccess(res, {
        companyName: buyer.company_name,
        billingContact: buyer.billing_contact,
        email: buyer.user.email,
      });
    } catch (err) {
      sendError(res, 'INTERNAL_ERROR', (err as Error).message, 500);
    }
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
        return;
      }

      const { companyName, billingContact } = req.body;

      const buyer = await prisma.corporateBuyer.findUnique({
        where: { user_id: req.user.userId },
      });

      if (!buyer) {
        sendError(res, 'BUYER_NOT_FOUND', 'Corporate buyer profile not found', 404);
        return;
      }

      const updated = await prisma.corporateBuyer.update({
        where: { id: buyer.id },
        data: {
          company_name: companyName || buyer.company_name,
          billing_contact: billingContact || buyer.billing_contact,
        },
      });

      sendSuccess(res, { profile: updated });
    } catch (err) {
      sendError(res, 'INTERNAL_ERROR', (err as Error).message, 500);
    }
  }
}
