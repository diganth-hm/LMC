import { prisma } from '../models/prisma';
import { parsePagination } from '../utils/helpers';

export class WalletService {
  /**
   * Get current wallet balance for a rider
   */
  static async getWalletBalance(riderId: string): Promise<number> {
    const latestTx = await prisma.walletTransaction.findFirst({
      where: { rider_id: riderId },
      orderBy: { created_at: 'desc' },
    });
    return latestTx ? Math.round(latestTx.balance_after * 100) / 100 : 0;
  }

  /**
   * Record a wallet credit transaction
   */
  static async creditWallet(riderId: string, rewardId: string, amountInr: number) {
    const currentBalance = await this.getWalletBalance(riderId);
    const newBalance = Math.round((currentBalance + amountInr) * 100) / 100;

    return prisma.walletTransaction.create({
      data: {
        rider_id: riderId,
        reward_id: rewardId,
        amount_inr: amountInr,
        type: 'credit',
        balance_after: newBalance,
      },
    });
  }

  /**
   * Get rider wallet summary (balance + weekly earnings + transaction list)
   */
  static async getRiderWalletSummary(riderId: string) {
    const balance = await this.getWalletBalance(riderId);

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyCredits = await prisma.walletTransaction.aggregate({
      where: {
        rider_id: riderId,
        type: 'credit',
        created_at: { gte: sevenDaysAgo },
      },
      _sum: { amount_inr: true },
    });

    const weeklyEarnings = Math.round((weeklyCredits._sum.amount_inr || 0) * 100) / 100;

    const recentTransactions = await prisma.walletTransaction.findMany({
      where: { rider_id: riderId },
      orderBy: { created_at: 'desc' },
      take: 10,
    });

    return {
      balance,
      weeklyEarnings,
      recentTransactions: recentTransactions.map((tx) => ({
        id: tx.id,
        amountInr: tx.amount_inr,
        type: tx.type,
        balanceAfter: tx.balance_after,
        createdAt: tx.created_at,
      })),
    };
  }

  /**
   * Paginated transaction history
   */
  static async getPaginatedTransactions(riderId: string, pageStr?: string, limitStr?: string) {
    const { page, limit, skip } = parsePagination(pageStr, limitStr);

    const [total, transactions] = await Promise.all([
      prisma.walletTransaction.count({ where: { rider_id: riderId } }),
      prisma.walletTransaction.findMany({
        where: { rider_id: riderId },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      transactions: transactions.map((tx) => ({
        id: tx.id,
        rewardId: tx.reward_id,
        amountInr: tx.amount_inr,
        type: tx.type,
        balanceAfter: tx.balance_after,
        createdAt: tx.created_at,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
