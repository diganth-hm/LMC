import { prisma } from '../models/prisma';
import { PRICING_TIERS } from '../config/constants';
import { VerificationService } from './verificationService';

export class CreditAggregationService {
  /**
   * Aggregate unpooled CO₂ savings for a city into a credit batch
   */
  static async poolCityCo2Savings(cityId: string, startDate?: Date, endDate?: Date) {
    const periodEnd = endDate || new Date();
    const periodStart = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Find all CO₂ calculations for this city in range that are NOT yet in any credit batch
    const unpooledCalculations = await prisma.co2Calculation.findMany({
      where: {
        calculated_at: {
          gte: periodStart,
          lte: periodEnd,
        },
        delivery: {
          city_id: cityId,
          status: 'completed',
        },
        credit_batch_deliveries: {
          none: {},
        },
      },
      include: {
        delivery: true,
      },
    });

    if (unpooledCalculations.length === 0) {
      throw new Error('NO_UNPOOLED_SAVINGS_AVAILABLE');
    }

    const totalKgPooled = Math.round(
      unpooledCalculations.reduce((sum, c) => sum + c.co2_saved_kg, 0) * 100
    ) / 100;

    const totalTonnes = Math.round((totalKgPooled / 1000) * 1000) / 1000;

    if (totalTonnes <= 0) {
      throw new Error('INSUFFICIENT_POOL_TONNAGE');
    }

    // Lookup base pricing per tonne
    const priceTier = PRICING_TIERS.find(
      (t) => totalTonnes >= t.minTonnes && totalTonnes < t.maxTonnes
    ) || PRICING_TIERS[0];
    const pricePerTonne = priceTier.pricePerTonne;

    // Create CreditBatch row inside transaction
    const batch = await prisma.$transaction(async (tx) => {
      const createdBatch = await tx.creditBatch.create({
        data: {
          city_id: cityId,
          period_start: periodStart,
          period_end: periodEnd,
          total_kg_pooled: totalKgPooled,
          total_tonnes: totalTonnes,
          tonnes_available: totalTonnes,
          price_per_tonne: pricePerTonne,
          status: 'pending_verification',
        },
      });

      await tx.creditBatchDelivery.createMany({
        data: unpooledCalculations.map((c) => ({
          credit_batch_id: createdBatch.id,
          co2_calculation_id: c.id,
        })),
      });

      return createdBatch;
    });

    // Run verification audit immediately to transition to 'verified'
    const verificationRecord = await VerificationService.verifyBatch(batch.id);

    return {
      batch: {
        id: batch.id,
        cityId: batch.city_id,
        totalKgPooled: batch.total_kg_pooled,
        totalTonnes: batch.total_tonnes,
        tonnesAvailable: batch.tonnes_available,
        pricePerTonne: batch.price_per_tonne,
        status: 'verified',
      },
      verification: verificationRecord,
    };
  }

  /**
   * Get available verified credit batches for buyers
   */
  static async getAvailableBatches() {
    const batches = await prisma.creditBatch.findMany({
      where: {
        status: 'verified',
        tonnes_available: { gt: 0 },
      },
      include: {
        city: true,
        verification_record: true,
      },
      orderBy: { period_end: 'desc' },
    });

    return batches.map((b) => ({
      id: b.id,
      city: b.city.name,
      period: `${b.period_start.toISOString().split('T')[0]} to ${b.period_end.toISOString().split('T')[0]}`,
      totalTonnes: b.total_tonnes,
      tonnesAvailable: b.tonnes_available,
      pricePerTonne: b.price_per_tonne,
      verified: !!b.verification_record,
      verificationHash: b.verification_record?.verification_hash || null,
    }));
  }

  /**
   * Get detail for a single credit batch
   */
  static async getBatchDetail(batchId: string) {
    const batch = await prisma.creditBatch.findUnique({
      where: { id: batchId },
      include: {
        city: true,
        verification_record: true,
        credit_batch_deliveries: {
          include: {
            co2_calculation: {
              include: {
                delivery: {
                  include: { rider: true },
                },
              },
            },
          },
        },
      },
    });

    if (!batch) {
      throw new Error('BATCH_NOT_FOUND');
    }

    const uniqueRiders = new Set(
      batch.credit_batch_deliveries.map((cbd) => cbd.co2_calculation.delivery.rider_id)
    );

    return {
      batch: {
        id: batch.id,
        city: batch.city.name,
        periodStart: batch.period_start,
        periodEnd: batch.period_end,
        totalKgPooled: batch.total_kg_pooled,
        totalTonnes: batch.total_tonnes,
        tonnesAvailable: batch.tonnes_available,
        pricePerTonne: batch.price_per_tonne,
        status: batch.status,
      },
      riderCount: uniqueRiders.size,
      deliveryCount: batch.credit_batch_deliveries.length,
      dateRange: `${batch.period_start.toISOString().split('T')[0]} - ${batch.period_end.toISOString().split('T')[0]}`,
      verification: batch.verification_record
        ? {
            method: batch.verification_record.method,
            hash: batch.verification_record.verification_hash,
            verifiedAt: batch.verification_record.verified_at,
          }
        : null,
    };
  }
}
