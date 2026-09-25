import { apiClient } from './client';
import { RiderProfile, RiderStats, DeliveryAssignment, RouteOption, DeliveryCompletion, WalletTransaction, CO2HistoryPoint, RouteHistoryItem } from '../../types';
import { mockRiderProfile, mockRiderStats, mockDeliveryAssignment, mockRouteOptions, mockDeliveryCompletion, mockWalletTransactions, mockCO2History, mockRouteHistory, mockWalletBalance, mockWeeklyEarnings } from './mockData';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export const riderService = {
  getProfile: async (): Promise<RiderProfile> => {
    if (USE_MOCKS) {
      await new Promise(r => setTimeout(r, 200));
      return mockRiderProfile;
    }
    // Backend: GET /riders/me → { name, tier, grsScore, todayDeliveries, todayCo2Saved, todayEarned, ... }
    const res = await apiClient.get('/riders/me');
    const d = res.data || {};
    return {
      id: d.id || '',
      name: d.name || '',
      phone: d.phone || '',
      vehicleType: d.vehicleType || d.vehicle_type || 'Petrol 2W',
      memberSince: d.memberSince || d.member_since || '',
      payoutAccount: d.payoutAccount || '',
      avatarUrl: d.avatarUrl || '',
    };
  },

  getStats: async (): Promise<RiderStats> => {
    if (USE_MOCKS) {
      await new Promise(r => setTimeout(r, 200));
      return mockRiderStats;
    }
    // Backend: GET /riders/me → includes today's stats
    const res = await apiClient.get('/riders/me');
    const d = res.data || {};
    return {
      todayDeliveries: d.todayDeliveries ?? 0,
      todayCO2SavedKg: d.todayCo2Saved ?? d.todayCO2SavedKg ?? 0,
      todayEarningsRupees: d.todayEarned ?? d.todayEarningsRupees ?? 0,
      currentTier: ((d.tier || 'bronze').charAt(0).toUpperCase() + (d.tier || 'bronze').slice(1)) as RiderStats['currentTier'],
      grsScore: d.grsScore ?? d.grs_score ?? 0,
      nextTierThreshold: d.nextTierThreshold ?? 100,
    };
  },

  getAssignment: async (): Promise<DeliveryAssignment> => {
    if (USE_MOCKS) {
      await new Promise(r => setTimeout(r, 400));
      return mockDeliveryAssignment;
    }
    // Backend: GET /deliveries/current → { delivery | null }
    const res = await apiClient.get('/deliveries/current');
    const d = res.data?.delivery || res.data || {};
    return {
      id: d.id || '',
      pickupName: d.pickupName || 'Pickup Location',
      pickupAddress: d.pickupAddress || `${d.pickup_lat || 0}, ${d.pickup_lng || 0}`,
      dropAddress: d.dropAddress || `${d.drop_lat || 0}, ${d.drop_lng || 0}`,
      distanceKm: d.distanceKm ?? d.distance_km ?? 0,
      baseFeeRupees: d.baseFeeRupees ?? d.base_fee ?? 0,
      status: d.status || 'assigned',
    };
  },

  getRoutes: async (deliveryId: string): Promise<RouteOption[]> => {
    if (USE_MOCKS) {
      await new Promise(r => setTimeout(r, 500));
      return mockRouteOptions;
    }
    // Backend: GET /routes?deliveryId= → { routes: [{ id, distanceKm, durationMin, co2Kg, fuelCostInr, grsScore, isGreenest }] }
    const res = await apiClient.get('/routes', { params: { deliveryId } });
    const routes = res.data?.routes || res.data || [];
    const colors = ['#22c55e', '#3b82f6', '#f59e0b'];
    const names = ['Green Route', 'Standard Route', 'Fast Route'];
    return routes.map((r: Record<string, unknown>, idx: number) => ({
      id: r.id as string,
      name: names[idx] || `Route ${idx + 1}`,
      distanceKm: (r.distanceKm as number) ?? (r.distance_km as number) ?? 0,
      durationMin: (r.durationMin as number) ?? (r.duration_min as number) ?? 0,
      co2Kg: (r.co2Kg as number) ?? (r.co2_kg as number) ?? 0,
      fuelCostRupees: (r.fuelCostInr as number) ?? (r.fuel_cost_inr as number) ?? 0,
      grsScore: (r.grsScore as number) ?? (r.grs_score as number) ?? 0,
      isGreenest: (r.isGreenest as boolean) ?? false,
      color: colors[idx] || '#6b7280',
    }));
  },

  selectRoute: async (routeId: string): Promise<void> => {
    if (USE_MOCKS) {
      await new Promise(r => setTimeout(r, 300));
      return;
    }
    // Backend: POST /routes/:id/select
    await apiClient.post(`/routes/${routeId}/select`);
  },

  completeDelivery: async (deliveryId: string): Promise<DeliveryCompletion> => {
    if (USE_MOCKS) {
      await new Promise(r => setTimeout(r, 800));
      return mockDeliveryCompletion;
    }
    // Backend: POST /deliveries/:id/complete → { co2Saved, rewardAmount, newBalance }
    const res = await apiClient.post(`/deliveries/${deliveryId}/complete`);
    const d = res.data || {};
    return {
      deliveryId,
      distanceKm: d.distanceKm ?? 0,
      durationMin: d.durationMin ?? 0,
      baselineCO2Kg: d.baselineCo2Kg ?? d.baseline_co2_kg ?? 0,
      actualCO2Kg: d.actualCo2Kg ?? d.actual_co2_kg ?? 0,
      co2SavedKg: d.co2Saved ?? d.co2SavedKg ?? d.co2_saved_kg ?? 0,
      rewardRupees: d.rewardAmount ?? d.rewardAmountInr ?? 0,
      treeEquivalent: d.treeEquivalent ? String(d.treeEquivalent) : String(Math.round(((d.co2Saved ?? 0) / 22) * 10) / 10),
    };
  },

  getWalletBalance: async (): Promise<number> => {
    if (USE_MOCKS) {
      await new Promise(r => setTimeout(r, 200));
      return mockWalletBalance;
    }
    // Backend: GET /wallet → { balance, weeklyEarnings: [...] }
    const res = await apiClient.get('/wallet');
    return res.data?.balance ?? 0;
  },

  getTransactions: async (): Promise<WalletTransaction[]> => {
    if (USE_MOCKS) {
      await new Promise(r => setTimeout(r, 250));
      return mockWalletTransactions;
    }
    // Backend: GET /wallet/transactions → { transactions[], pagination }
    const res = await apiClient.get('/wallet/transactions');
    const txns = res.data?.transactions || res.data || [];
    return txns.map((t: Record<string, unknown>) => ({
      id: t.id as string,
      deliveryRef: (t.deliveryRef || t.delivery_ref || '') as string,
      amountRupees: (t.amount_inr || t.amountInr || t.amountRupees || 0) as number,
      date: (t.created_at || t.createdAt || t.date || '') as string,
      type: ((t.type as string) === 'credit' ? 'reward' : 'withdrawal') as 'reward' | 'withdrawal',
    }));
  },

  getWeeklyEarnings: async (): Promise<{ day: string; amount: number }[]> => {
    if (USE_MOCKS) {
      return mockWeeklyEarnings;
    }
    // Backend: GET /wallet → { balance, weeklyEarnings: [...] }
    const res = await apiClient.get('/wallet');
    const earnings = res.data?.weeklyEarnings || [];
    return earnings.map((e: Record<string, unknown>) => ({
      day: (e.day || e.date || '') as string,
      amount: (e.amount || e.earned || 0) as number,
    }));
  },

  getCO2History: async (): Promise<CO2HistoryPoint[]> => {
    if (USE_MOCKS) {
      await new Promise(r => setTimeout(r, 250));
      return mockCO2History;
    }
    // Backend: GET /co2/history → { series: [{ date, co2SavedKg }], totalKg, treeEquivalent }
    const res = await apiClient.get('/co2/history');
    const series = res.data?.series || res.data || [];
    return series.map((s: Record<string, unknown>) => ({
      date: (s.date as string) || '',
      co2SavedKg: (s.co2SavedKg || s.co2_saved_kg || 0) as number,
    }));
  },

  getRouteHistory: async (): Promise<RouteHistoryItem[]> => {
    if (USE_MOCKS) {
      await new Promise(r => setTimeout(r, 200));
      return mockRouteHistory;
    }
    // Backend: GET /deliveries/history → { deliveries[], pagination }
    const res = await apiClient.get('/deliveries/history');
    const deliveries = res.data?.deliveries || res.data || [];
    return deliveries.map((d: Record<string, unknown>) => ({
      id: d.id as string,
      date: (d.completed_at || d.completedAt || d.assigned_at || '') as string,
      routeType: 'Green' as const,
      co2SavedKg: (d.co2SavedKg || d.co2_saved_kg || 0) as number,
      rewardRupees: (d.rewardAmount || d.reward_amount || 0) as number,
      distanceKm: (d.distanceKm || d.distance_km || 0) as number,
    }));
  },
};
