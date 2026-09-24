import { apiClient } from './client';
import {
  CreditBatch,
  AuditTrail,
  PricingTier,
  Order,
  Certificate,
  BuyerImpact,
  BuyerProfile,
} from '../../types';
import {
  mockCreditBatches,
  mockAuditTrail,
  mockPricingTiers,
  mockOrders,
  mockCertificate,
  mockBuyerImpact,
  mockBuyerProfile,
} from './mockData';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

export const buyerService = {
  getCreditBatches: async (): Promise<CreditBatch[]> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 300));
      return mockCreditBatches;
    }
    // Backend: GET /credits → { batches: [...] }
    const res = await apiClient.get('/credits');
    const batches = res.data?.batches || res.data || [];
    return batches.map((b: Record<string, unknown>) => ({
      id: b.id as string,
      title: `${(b as Record<string, unknown>).cityName || 'Carbon'} Credit Batch`,
      region: (b.cityName as string) || '',
      sourcePeriod: `${b.periodStart ? new Date(b.periodStart as string).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ''}`,
      availableTonnes: (b.tonnesAvailable as number) ?? (b.tonnes_available as number) ?? 0,
      totalTonnes: (b.totalTonnes as number) ?? (b.total_tonnes as number) ?? 0,
      pricePerTonneRupees: (b.pricePerTonne as number) ?? (b.price_per_tonne as number) ?? 0,
      verificationStatus: ((b.status as string) === 'verified' ? 'Verified' : 'Pending') as 'Verified' | 'Pending',
      verificationStandard: 'ISO 14064-2 Verified',
      contributingRidersCount: (b.riderCount as number) ?? 0,
      totalDeliveriesCount: (b.deliveryCount as number) ?? 0,
      issueDate: b.periodEnd ? new Date(b.periodEnd as string).toISOString().split('T')[0] : '',
      verificationHash: (b.verificationHash as string) || '',
      description: `Verified carbon credit batch from ${(b.cityName as string) || 'multiple'} delivery route optimizations.`,
    }));
  },

  getBatchDetails: async (batchId: string): Promise<CreditBatch> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 200));
      const found = mockCreditBatches.find((b) => b.id === batchId);
      return found || mockCreditBatches[0];
    }
    // Backend: GET /credits/:id → { batch detail fields... }
    const res = await apiClient.get(`/credits/${batchId}`);
    const b = res.data || {};
    return {
      id: b.id || batchId,
      title: `${b.cityName || 'Carbon'} Credit Batch`,
      region: b.cityName || '',
      sourcePeriod: b.periodStart ? new Date(b.periodStart).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '',
      availableTonnes: b.tonnesAvailable ?? b.tonnes_available ?? 0,
      totalTonnes: b.totalTonnes ?? b.total_tonnes ?? 0,
      pricePerTonneRupees: b.pricePerTonne ?? b.price_per_tonne ?? 0,
      verificationStatus: b.status === 'verified' ? 'Verified' : 'Pending',
      verificationStandard: 'ISO 14064-2 Verified',
      contributingRidersCount: b.riderCount ?? 0,
      totalDeliveriesCount: b.deliveryCount ?? 0,
      issueDate: b.periodEnd ? new Date(b.periodEnd).toISOString().split('T')[0] : '',
      verificationHash: b.verificationHash || '',
      description: `Verified carbon credit batch from ${b.cityName || 'multiple'} delivery route optimizations.`,
    };
  },

  getAuditTrail: async (batchId: string): Promise<AuditTrail> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 350));
      return { ...mockAuditTrail, batchId };
    }
    // Backend: GET /credits/:id/audit-trail → { method, verificationHash, riderCount, deliveryCount, sampleRecords }
    const res = await apiClient.get(`/credits/${batchId}/audit-trail`);
    const d = res.data || {};
    return {
      batchId,
      verificationStandard: d.method || 'ISO 14064-2 Greenhouse Gas Avoidance Protocol',
      verificationHash: d.verificationHash || '',
      isoBadge: 'ISO 14064-2 Third-Party Audited',
      contributingRidersCount: d.riderCount ?? 0,
      totalDeliveriesCount: d.deliveryCount ?? 0,
      totalCo2SavedKg: d.totalCo2SavedKg ?? 0,
      sampleRecords: (d.sampleRecords || []).map((r: Record<string, unknown>, idx: number) => ({
        id: `rec-${String(idx + 1).padStart(3, '0')}`,
        deliveryRef: (r.deliveryRef as string) || `DEL-${idx}`,
        anonymizedRiderId: (r.riderId as string) || `Rider #${idx}`,
        routeType: 'Green' as const,
        co2SavedKg: (r.co2SavedKg as number) ?? 0,
        timestamp: (r.timestamp as string) || '',
        city: (r.city as string) || '',
      })),
    };
  },

  getPricingTiers: async (): Promise<PricingTier[]> => {
    // Pricing tiers are static config — no dedicated backend endpoint
    if (USE_MOCKS) {
      return mockPricingTiers;
    }
    return mockPricingTiers;
  },

  purchaseCredits: async (payload: { batchId: string; quantityTonnes: number; paymentMethod: string }): Promise<Order> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 1000));
      const batch = mockCreditBatches.find((b) => b.id === payload.batchId) || mockCreditBatches[0];
      const orderId = `LMC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const certId = `CERT-${orderId}`;
      const subtotal = payload.quantityTonnes * batch.pricePerTonneRupees;

      const newOrder: Order = {
        id: orderId,
        batchId: batch.id,
        batchTitle: batch.title,
        quantityTonnes: payload.quantityTonnes,
        unitPriceRupees: batch.pricePerTonneRupees,
        subtotalRupees: subtotal,
        buyerName: 'Manipal Group ESG Solutions',
        paymentMethod: payload.paymentMethod,
        status: 'Completed',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        certificateId: certId,
        verificationHash: batch.verificationHash,
      };
      mockOrders.unshift(newOrder);
      return newOrder;
    }
    // Backend: POST /purchases expects { creditBatchId, tonnes }
    const res = await apiClient.post('/purchases', {
      creditBatchId: payload.batchId,
      tonnes: payload.quantityTonnes,
    });
    const d = res.data || {};
    const purchase = d.purchase || d;
    return {
      id: purchase.id || '',
      batchId: purchase.credit_batch_id || purchase.creditBatchId || payload.batchId,
      batchTitle: purchase.batchTitle || 'Carbon Credit Purchase',
      quantityTonnes: purchase.tonnes_purchased || purchase.tonnesPurchased || payload.quantityTonnes,
      unitPriceRupees: purchase.price_per_tonne || purchase.pricePerTonne || 0,
      subtotalRupees: purchase.total_amount_inr || purchase.totalAmountInr || 0,
      buyerName: purchase.buyerName || '',
      paymentMethod: payload.paymentMethod,
      status: 'Completed',
      timestamp: purchase.purchased_at || purchase.purchasedAt || new Date().toISOString(),
      certificateId: d.certificateId || purchase.certificateId || '',
      verificationHash: purchase.verificationHash || '',
    };
  },

  getOrders: async (): Promise<Order[]> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 250));
      return mockOrders;
    }
    // Backend: GET /purchases → { purchases: [...] }
    const res = await apiClient.get('/purchases');
    const purchases = res.data?.purchases || res.data || [];
    return purchases.map((p: Record<string, unknown>) => ({
      id: p.id as string,
      batchId: (p.credit_batch_id || p.creditBatchId) as string,
      batchTitle: (p.batchTitle as string) || 'Carbon Credit Purchase',
      quantityTonnes: (p.tonnes_purchased || p.tonnesPurchased) as number,
      unitPriceRupees: (p.price_per_tonne || p.pricePerTonne) as number,
      subtotalRupees: (p.total_amount_inr || p.totalAmountInr) as number,
      buyerName: (p.buyerName as string) || '',
      paymentMethod: 'Corporate Wire / RTGS',
      status: ((p.status as string) === 'completed' ? 'Completed' : 'Failed') as 'Completed' | 'Processing' | 'Failed',
      timestamp: (p.purchased_at || p.purchasedAt || '') as string,
      certificateId: (p.certificateId as string) || '',
      verificationHash: (p.verificationHash as string) || '',
    }));
  },

  getCertificate: async (certId: string): Promise<Certificate> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 300));
      return { ...mockCertificate, id: certId };
    }
    // Backend: GET /certificates/:id → { certificate: { companyName, tonnes, verificationHash, issuedAt } }
    const res = await apiClient.get(`/certificates/${certId}`);
    const c = res.data?.certificate || res.data || {};
    return {
      id: c.id || certId,
      orderId: c.purchase_id || c.purchaseId || '',
      buyerName: c.companyName || c.company_name || '',
      tonnesOffset: c.tonnes || c.tonnesOffset || 0,
      verificationHash: c.verification_hash || c.verificationHash || '',
      issueDate: c.issued_at || c.issuedAt || '',
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${c.verification_hash || c.verificationHash || ''}`,
      batchTitle: c.batchTitle || 'Carbon Credit Certificate',
      region: c.region || '',
    };
  },

  getBuyerImpact: async (): Promise<BuyerImpact> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 250));
      return mockBuyerImpact;
    }
    // Backend: GET /buyer/dashboard → { totalTonnesPurchased, impactEquivalent, activeCertificates, recentActivity }
    const res = await apiClient.get('/buyer/dashboard');
    const d = res.data || {};
    return {
      totalTonnesPurchased: d.totalTonnesPurchased ?? 0,
      equivalentTreesPlanted: d.impactEquivalent?.treesPlanted ?? 0,
      equivalentCarsOffRoad: d.impactEquivalent?.carsOffRoad ?? 0,
      activeCertificatesCount: d.activeCertificates ?? 0,
      purchaseHistoryTrend: [],
    };
  },

  getBuyerProfile: async (): Promise<BuyerProfile> => {
    if (USE_MOCKS) {
      return mockBuyerProfile;
    }
    // Backend: GET /buyer/profile → { companyName, billingContact, email }
    const res = await apiClient.get('/buyer/profile');
    const d = res.data || {};
    return {
      companyName: d.companyName || d.company_name || '',
      billingEmail: d.email || d.billingContact || '',
      gstin: '',
      address: '',
      teamMembers: [],
      notifications: { emailAlerts: true, weeklyDigest: true, newBatchAlerts: true },
    };
  },

  getDashboard: async () => {
    if (USE_MOCKS) {
      return {
        totalTonnesPurchased: mockBuyerImpact.totalTonnesPurchased,
        impactEquivalent: {
          treesPlanted: mockBuyerImpact.equivalentTreesPlanted,
          carsOffRoad: mockBuyerImpact.equivalentCarsOffRoad,
        },
        activeCertificates: mockBuyerImpact.activeCertificatesCount,
        recentActivity: [],
      };
    }
    // Backend: GET /buyer/dashboard
    const res = await apiClient.get('/buyer/dashboard');
    return res.data;
  },
};
