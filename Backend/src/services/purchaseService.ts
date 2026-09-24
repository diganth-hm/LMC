import { prisma } from '../models/prisma';
import { PRICING_TIERS } from '../config/constants';
import { createCreditPurchaseOrder } from '../external/razorpayClient';
import { CertificateService } from './certificateService';

export class PurchaseService {
  /**
   * Execute credit purchase transaction for a corporate buyer
   */
  static async executePurchase(buyerUserId: string, creditBatchId: string, tonnes: number) {
    if (tonnes <= 0) {
      throw new Error('INVALID_PURCHASE_QUANTITY');
    }

    const buyer = await prisma.corporateBuyer.findUnique({
      where: { user_id: buyerUserId },
    });

    if (!buyer) {
      throw new Error('CORPORATE_BUYER_NOT_FOUND');
    }

    const batch = await prisma.creditBatch.findUnique({
      where: { id: creditBatchId },
    });

    if (!batch) {
      throw new Error('CREDIT_BATCH_NOT_FOUND');
    }

    if (batch.status !== 'verified') {
      throw new Error('BATCH_NOT_VERIFIED');
    }

    if (batch.tonnes_available < tonnes) {
      throw new Error('EXCEEDS_AVAILABLE_INVENTORY');
    }

    // Determine price per tonne
    const tier = PRICING_TIERS.find(
      (t) => tonnes >= t.minTonnes && tonnes < t.maxTonnes
    ) || PRICING_TIERS[0];

    const pricePerTonne = tier.pricePerTonne;
    const totalAmountInr = Math.round(tonnes * pricePerTonne * 100) / 100;

    // Simulate/create Razorpay Payment Order
    const rzpOrder = await createCreditPurchaseOrder(totalAmountInr, `purch_${Date.now()}`);

    // Execute atomic DB transaction
    const { purchase, certificate } = await prisma.$transaction(async (tx) => {
      // Re-verify inventory within transaction to avoid race conditions
      const currentBatch = await tx.creditBatch.findUnique({
        where: { id: creditBatchId },
      });

      if (!currentBatch || currentBatch.tonnes_available < tonnes) {
        throw new Error('EXCEEDS_AVAILABLE_INVENTORY');
      }

      const updatedTonnes = Math.round((currentBatch.tonnes_available - tonnes) * 1000) / 1000;

      await tx.creditBatch.update({
        where: { id: creditBatchId },
        data: {
          tonnes_available: updatedTonnes,
          status: updatedTonnes === 0 ? 'sold_out' : 'verified',
        },
      });

      const newPurchase = await tx.purchase.create({
        data: {
          buyer_id: buyer.id,
          credit_batch_id: creditBatchId,
          tonnes_purchased: tonnes,
          price_per_tonne: pricePerTonne,
          total_amount_inr: totalAmountInr,
          status: 'completed',
        },
      });

      return { purchase: newPurchase, certificate: null };
    });

    // Generate certificate PDF
    const certResult = await CertificateService.generateCertificateForPurchase(purchase.id);

    return {
      purchase: {
        id: purchase.id,
        buyerId: purchase.buyer_id,
        creditBatchId: purchase.credit_batch_id,
        tonnesPurchased: purchase.tonnes_purchased,
        pricePerTonne: purchase.price_per_tonne,
        totalAmountInr: purchase.total_amount_inr,
        status: purchase.status,
        purchasedAt: purchase.purchased_at,
        razorpayOrderId: rzpOrder.orderId,
      },
      certificateId: certResult.certificateId,
      pdfUrl: certResult.pdfUrl,
    };
  }

  /**
   * Get purchase history for corporate buyer
   */
  static async getBuyerPurchases(buyerUserId: string) {
    const buyer = await prisma.corporateBuyer.findUnique({
      where: { user_id: buyerUserId },
    });

    if (!buyer) return [];

    const purchases = await prisma.purchase.findMany({
      where: { buyer_id: buyer.id },
      include: {
        credit_batch: { include: { city: true } },
        certificate: true,
      },
      orderBy: { purchased_at: 'desc' },
    });

    return purchases.map((p) => ({
      id: p.id,
      cityName: p.credit_batch.city.name,
      tonnesPurchased: p.tonnes_purchased,
      pricePerTonne: p.price_per_tonne,
      totalAmountInr: p.total_amount_inr,
      status: p.status,
      purchasedAt: p.purchased_at,
      certificateId: p.certificate?.id || null,
    }));
  }

  /**
   * Get single purchase detail
   */
  static async getPurchaseDetail(purchaseId: string) {
    const purchase = await prisma.purchase.findUnique({
      where: { id: purchaseId },
      include: {
        buyer: true,
        credit_batch: { include: { city: true, verification_record: true } },
        certificate: true,
      },
    });

    if (!purchase) {
      throw new Error('PURCHASE_NOT_FOUND');
    }

    return {
      id: purchase.id,
      companyName: purchase.buyer.company_name,
      cityName: purchase.credit_batch.city.name,
      tonnesPurchased: purchase.tonnes_purchased,
      pricePerTonne: purchase.price_per_tonne,
      totalAmountInr: purchase.total_amount_inr,
      status: purchase.status,
      purchasedAt: purchase.purchased_at,
      verificationHash: purchase.credit_batch.verification_record?.verification_hash || '',
      certificateId: purchase.certificate?.id || null,
      pdfUrl: purchase.certificate?.pdf_url || null,
    };
  }
}
