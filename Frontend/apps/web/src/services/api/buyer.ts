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
    const res = await apiClient.get<CreditBatch[]>('/buyer/batches');
    return res.data;
  },

  getBatchDetails: async (batchId: string): Promise<CreditBatch> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 200));
      const found = mockCreditBatches.find((b) => b.id === batchId);
      return found || mockCreditBatches[0];
    }
    const res = await apiClient.get<CreditBatch>(`/buyer/batches/${batchId}`);
    return res.data;
  },

  getAuditTrail: async (batchId: string): Promise<AuditTrail> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 350));
      return { ...mockAuditTrail, batchId };
    }
    const res = await apiClient.get<AuditTrail>(`/buyer/batches/${batchId}/audit-trail`);
    return res.data;
  },

  getPricingTiers: async (): Promise<PricingTier[]> => {
    if (USE_MOCKS) {
      return mockPricingTiers;
    }
    const res = await apiClient.get<PricingTier[]>('/buyer/pricing-tiers');
    return res.data;
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
    const res = await apiClient.post<Order>('/buyer/purchase', payload);
    return res.data;
  },

  getOrders: async (): Promise<Order[]> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 250));
      return mockOrders;
    }
    const res = await apiClient.get<Order[]>('/buyer/orders');
    return res.data;
  },

  getCertificate: async (certId: string): Promise<Certificate> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 300));
      return { ...mockCertificate, id: certId };
    }
    const res = await apiClient.get<Certificate>(`/buyer/certificates/${certId}`);
    return res.data;
  },

  getBuyerImpact: async (): Promise<BuyerImpact> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 250));
      return mockBuyerImpact;
    }
    const res = await apiClient.get<BuyerImpact>('/buyer/impact');
    return res.data;
  },

  getBuyerProfile: async (): Promise<BuyerProfile> => {
    if (USE_MOCKS) {
      return mockBuyerProfile;
    }
    const res = await apiClient.get<BuyerProfile>('/buyer/profile');
    return res.data;
  },
};
