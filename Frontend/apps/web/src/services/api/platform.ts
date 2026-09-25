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

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export const platformService = {
  getFleetOverview: async (): Promise<FleetOverview> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 300));
      return mockFleetOverview;
    }
    // Backend: GET /platform/overview → { activeRiders, totalCo2Saved, totalBonusesPaid, avgGrs }
    const res = await apiClient.get('/platform/overview');
    const d = res.data;
    return {
      activeRiders: d.activeRiders ?? 0,
      totalCO2SavedKg: d.totalCo2Saved ?? 0,
      totalCO2SavedTonnes: (d.totalCo2Saved ?? 0) / 1000,
      totalGreenBonusesPaidRupees: d.totalBonusesPaid ?? 0,
      avgGRSScore: d.avgGrs ?? 0,
      // Backend doesn't provide trend data — use 0 as fallback
      riderTrend: 0,
      co2Trend: 0,
      bonusTrend: 0,
      grsTrend: 0,
    };
  },

  getCityStats: async (): Promise<CityStat[]> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 250));
      return mockCityStats;
    }
    // Backend: GET /platform/fleet-analytics → { cities: [{ name, riderCount, co2Saved, avgGrs, adoptionPct }] }
    const res = await apiClient.get('/platform/fleet-analytics');
    const cities = res.data?.cities || [];
    return cities.map((c: Record<string, unknown>, idx: number) => ({
      id: `city-${idx + 1}`,
      name: c.name as string,
      activeRiders: (c.riderCount as number) ?? 0,
      co2SavedKg: (c.co2Saved as number) ?? 0,
      avgGRS: (c.avgGrs as number) ?? 0,
      greenAdoptionPct: (c.adoptionPct as number) ?? 0,
    }));
  },

  getEmissionsStats: async (): Promise<EmissionStat[]> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 300));
      return mockEmissionsStats;
    }
    // Backend: GET /analytics/emissions → { series: [{ date, baselineKg, actualKg }], pctReduction, byVehicleType }
    const res = await apiClient.get('/analytics/emissions');
    const series = res.data?.series || [];
    return series.map((s: Record<string, unknown>) => ({
      date: s.date as string,
      baselineKg: (s.baselineKg as number) ?? 0,
      actualKg: (s.actualKg as number) ?? 0,
      savedKg: Math.max(0, ((s.baselineKg as number) ?? 0) - ((s.actualKg as number) ?? 0)),
    }));
  },

  getLeaderboard: async (): Promise<RiderLeaderboardItem[]> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 250));
      return mockRiderLeaderboard;
    }
    // Backend: GET /analytics/leaderboard → { riders: [{ rank, id, name, tier, grsScore, co2Saved, adoptionPct }] }
    const res = await apiClient.get('/analytics/leaderboard');
    const riders = res.data?.riders || [];
    return riders.map((r: Record<string, unknown>) => ({
      id: r.id as string,
      rank: (r.rank as number) ?? 0,
      name: r.name as string,
      avatarUrl: '',
      tier: ((r.tier as string)?.charAt(0).toUpperCase() + (r.tier as string)?.slice(1)) as 'Bronze' | 'Silver' | 'Gold' | 'Platinum',
      co2SavedKg: (r.co2Saved as number) ?? 0,
      greenAdoptionPct: (r.adoptionPct as number) ?? 0,
      totalDeliveries: 0,
      city: '',
    }));
  },

  getDeliveryAnalytics: async (): Promise<DeliveryAnalyticItem[]> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 300));
      return mockDeliveryAnalytics;
    }
    // Backend: GET /analytics/deliveries → { volumeSeries, adoptionSeries, avgDeliveryTime }
    const res = await apiClient.get('/analytics/deliveries');
    const volumeSeries = res.data?.volumeSeries || [];
    const adoptionSeries = res.data?.adoptionSeries || [];
    return volumeSeries.map((v: Record<string, unknown>, idx: number) => ({
      date: v.date as string,
      totalDeliveries: (v.volume as number) ?? 0,
      greenDeliveries: Math.round(((v.volume as number) ?? 0) * ((adoptionSeries[idx]?.adoptionPct ?? 80) / 100)),
      defaultDeliveries: Math.round(((v.volume as number) ?? 0) * (1 - (adoptionSeries[idx]?.adoptionPct ?? 80) / 100)),
      avgTimeGreenMin: res.data?.avgDeliveryTime ?? 24,
      avgTimeDefaultMin: (res.data?.avgDeliveryTime ?? 24) + 2,
    }));
  },

  getInvoices: async (): Promise<InvoiceItem[]> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 250));
      return mockInvoices;
    }
    // Backend: GET /platform/billing → { current, history: [{ id, fleetName, riderCount, ratePerRider, totalDue, status }] }
    const res = await apiClient.get('/platform/billing');
    const history = res.data?.history || [];
    return history.map((h: Record<string, unknown>) => ({
      id: h.id as string,
      period: h.fleetName as string,
      riderCount: (h.riderCount as number) ?? 0,
      ratePerRider: (h.ratePerRider as number) ?? 0,
      amountRupees: (h.totalDue as number) ?? 0,
      status: 'Paid' as const,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      bonusPayoutTotalRupees: 0,
    }));
  },

  getReportTemplates: async (): Promise<ReportTemplate[]> => {
    // Report templates are static config — no backend endpoint needed
    if (USE_MOCKS) {
      return mockReportTemplates;
    }
    return mockReportTemplates;
  },

  generateReport: async (templateId: string, format: string): Promise<{ downloadUrl: string; reportId: string }> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 800));
      return {
        downloadUrl: '#',
        reportId: `REP-${Math.floor(100000 + Math.random() * 900000)}`,
      };
    }
    // Backend: POST /analytics/reports/generate → returns PDF binary
    const res = await apiClient.post('/analytics/reports/generate', {
      template: templateId,
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      to: new Date().toISOString(),
      format,
    }, { responseType: 'blob' });

    // Create a blob URL for download
    const blob = new Blob([res.data], { type: 'application/pdf' });
    const downloadUrl = URL.createObjectURL(blob);
    return {
      downloadUrl,
      reportId: `REP-${Date.now()}`,
    };
  },
};
