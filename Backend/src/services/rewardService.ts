import {
  REWARD_RATE_INR_PER_KG,
  MIN_CO2_THRESHOLD_KG,
  TIER_THRESHOLDS,
} from '../config/constants';
import { prisma } from '../models/prisma';
import { WalletService } from './walletService';
import { createRiderRewardPayout } from '../external/razorpayClient';
import { RiderTier } from '@prisma/client';

export class RewardService {
  /**
   * Process CO₂ savings reward for a completed delivery
   */
  static async processDeliveryReward(
    deliveryId: string,
    riderId: string,
    co2SavedKg: number
  ) {
    let rewardAmountInr = 0;

    if (co2SavedKg >= MIN_CO2_THRESHOLD_KG) {
      rewardAmountInr = Math.round(co2SavedKg * REWARD_RATE_INR_PER_KG * 100) / 100;
    }

    // Create Reward record
    const reward = await prisma.reward.create({
      data: {
        delivery_id: deliveryId,
        rider_id: riderId,
        co2_saved_kg: co2SavedKg,
        amount_inr: rewardAmountInr,
        status: rewardAmountInr > 0 ? 'paid' : 'pending',
        paid_at: rewardAmountInr > 0 ? new Date() : null,
      },
    });

    let newBalance = 0;

    if (rewardAmountInr > 0) {
      // Execute RazorpayX payout simulation
      await createRiderRewardPayout(riderId, rewardAmountInr, reward.id);

      // Record wallet credit transaction
      const walletTx = await WalletService.creditWallet(riderId, reward.id, rewardAmountInr);
      newBalance = walletTx.balance_after;
    } else {
      newBalance = await WalletService.getWalletBalance(riderId);
    }

    // Recalculate rider Green Route Score and tier
    await this.updateRiderTierAndGrs(riderId);

    return {
      co2SavedKg,
      rewardAmountInr,
      newBalance,
    };
  }

  /**
   * Recalculate rolling 30-day Green Route adoption rate, average GRS score, and update tier
   */
  static async updateRiderTierAndGrs(riderId: string) {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const completedDeliveries = await prisma.delivery.findMany({
      where: {
        rider_id: riderId,
        status: 'completed',
        completed_at: { gte: thirtyDaysAgo },
      },
      include: {
        routes: true,
        route_selection: true,
      },
    });

    if (completedDeliveries.length === 0) return;

    let greenRoutesSelected = 0;
    let grsSum = 0;

    completedDeliveries.forEach((d) => {
      const selected = d.routes.find((r) => r.id === d.route_selection?.route_id);
      if (selected) {
        grsSum += selected.grs_score;
        // Check if selected route had lowest GRS score among candidate routes for that delivery
        const minGrsInDelivery = Math.min(...d.routes.map((r) => r.grs_score));
        if (selected.grs_score === minGrsInDelivery) {
          greenRoutesSelected++;
        }
      }
    });

    const totalCount = completedDeliveries.length;
    const adoptionPct = Math.round((greenRoutesSelected / totalCount) * 100);
    const avgGrsScore = Math.round((grsSum / totalCount) * 10) / 10;

    // Determine tier
    let tier: RiderTier = 'bronze';
    if (adoptionPct >= TIER_THRESHOLDS.platinum) {
      tier = 'platinum';
    } else if (adoptionPct >= TIER_THRESHOLDS.gold) {
      tier = 'gold';
    } else if (adoptionPct >= TIER_THRESHOLDS.silver) {
      tier = 'silver';
    }

    await prisma.rider.update({
      where: { id: riderId },
      data: {
        grs_score: avgGrsScore,
        tier,
      },
    });
  }
}
