import { apiClient } from './client';
import {
  FleetOverview,
  CityStat,
  EmissionStat,
  RiderLeaderboardItem,
  DeliveryAnalyticItem,
  InvoiceItem,
  ReportTemplate,
} from '../../types';
import {
  mockFleetOverview,
  mockCityStats,
  mockEmissionsStats,
  mockRiderLeaderboard,
  mockDeliveryAnalytics,
  mockInvoices,
  mockReportTemplates,
} from './mockData';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

export const platformService = {
  getFleetOverview: async (): Promise<FleetOverview> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 300));
      return mockFleetOverview;
    }
    const res = await apiClient.get<FleetOverview>('/platform/overview');
    return res.data;
  },

  getCityStats: async (): Promise<CityStat[]> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 250));
      return mockCityStats;
    }
    const res = await apiClient.get<CityStat[]>('/platform/cities');
    return res.data;
  },

  getEmissionsStats: async (): Promise<EmissionStat[]> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 300));
      return mockEmissionsStats;
    }
    const res = await apiClient.get<EmissionStat[]>('/platform/emissions');
    return res.data;
  },

  getLeaderboard: async (): Promise<RiderLeaderboardItem[]> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 250));
      return mockRiderLeaderboard;
    }
    const res = await apiClient.get<RiderLeaderboardItem[]>('/platform/leaderboard');
    return res.data;
  },

  getDeliveryAnalytics: async (): Promise<DeliveryAnalyticItem[]> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 300));
      return mockDeliveryAnalytics;
    }
    const res = await apiClient.get<DeliveryAnalyticItem[]>('/platform/delivery-analytics');
    return res.data;
  },

  getInvoices: async (): Promise<InvoiceItem[]> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 250));
      return mockInvoices;
    }
    const res = await apiClient.get<InvoiceItem[]>('/platform/invoices');
    return res.data;
  },

  getReportTemplates: async (): Promise<ReportTemplate[]> => {
    if (USE_MOCKS) {
      return mockReportTemplates;
    }
    const res = await apiClient.get<ReportTemplate[]>('/platform/report-templates');
    return res.data;
  },

  generateReport: async (templateId: string, format: string): Promise<{ downloadUrl: string; reportId: string }> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 800));
      return {
        downloadUrl: '#',
        reportId: `REP-${Math.floor(100000 + Math.random() * 900000)}`,
      };
    }
    const res = await apiClient.post<{ downloadUrl: string; reportId: string }>('/platform/reports/generate', { templateId, format });
    return res.data;
  },
};
