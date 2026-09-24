import bcrypt from 'bcryptjs';
import { prisma } from '../src/models/prisma';
import { CreditAggregationService } from '../src/services/creditAggregationService';
import { PurchaseService } from '../src/services/purchaseService';

export async function seedBuyersAndPurchases(cities: Record<string, string>) {
  console.log('🏛️ Seeding Corporate Buyers, Credit Batches, and Purchases...');

  const passwordHash = await bcrypt.hash('buyer123', 10);

  // 1. Create Corporate Buyer User 1
  const buyerUser1 = await prisma.user.upsert({
    where: { email: 'esg@manipal.edu' },
    create: {
      email: 'esg@manipal.edu',
      password_hash: passwordHash,
      role: 'corporate_buyer',
    },
    update: {},
  });

  const buyer1 = await prisma.corporateBuyer.upsert({
    where: { user_id: buyerUser1.id },
    create: {
      user_id: buyerUser1.id,
      company_name: 'Manipal Education & Medical Group',
      billing_contact: 'Finance & Sustainability Office',
    },
    update: {},
  });

  // 2. Create Corporate Buyer User 2
  const buyerUser2 = await prisma.user.upsert({
    where: { email: 'sustainability@infosys.com' },
    create: {
      email: 'sustainability@infosys.com',
      password_hash: passwordHash,
      role: 'corporate_buyer',
    },
    update: {},
  });

  await prisma.corporateBuyer.upsert({
    where: { user_id: buyerUser2.id },
    create: {
      user_id: buyerUser2.id,
      company_name: 'Infosys ESG Initiatives',
      billing_contact: 'Corporate Sustainability Desk',
    },
    update: {},
  });

  // 3. Pool CO₂ savings into a Credit Batch for Mangaluru
  const mangaluruCityId = cities['Mangaluru'] || Object.values(cities)[0];

  try {
    const pooledResult = await CreditAggregationService.poolCityCo2Savings(mangaluruCityId);
    console.log(`✅ Credit Batch Pooled: ${pooledResult.batch.totalTonnes} Tonnes in ${mangaluruCityId}`);

    // 4. Pre-seed one purchase against this batch
    if (pooledResult.batch.totalTonnes > 0.001) {
      const purchaseTonnes = Math.min(0.001, pooledResult.batch.totalTonnes / 2);
      await PurchaseService.executePurchase(buyer1.user_id, pooledResult.batch.id, purchaseTonnes);
      console.log(`✅ Pre-seeded credit purchase of ${purchaseTonnes} Tonnes for ${buyer1.company_name}`);
    }
  } catch (err) {
    console.warn('⚠️ Credit batch pooling notice:', (err as Error).message);
  }
}
