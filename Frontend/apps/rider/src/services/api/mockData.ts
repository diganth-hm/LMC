import {
  RiderProfile, RiderStats, DeliveryAssignment, RouteOption,
  DeliveryCompletion, WalletTransaction, CO2HistoryPoint, RouteHistoryItem
} from '../../types';

export const mockRiderProfile: RiderProfile = {
  id: 'rider-guru-01',
  name: 'Guru Prasad',
  phone: '+91 98765 43210',
  vehicleType: 'Petrol 2W',
  memberSince: 'June 2026',
  payoutAccount: '****4832',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
};

export const mockRiderStats: RiderStats = {
  todayDeliveries: 14,
  todayCO2SavedKg: 0.6,
  todayEarningsRupees: 92,
  currentTier: 'Gold',
  grsScore: 74,
  nextTierThreshold: 80,
};

export const mockDeliveryAssignment: DeliveryAssignment = {
  id: 'DEL-99301',
  pickupName: 'Machali (Seafood Kitchen)',
  pickupAddress: 'Hampankatta Junction, Mangaluru',
  dropAddress: 'Kadri Hills Apartment, Kadri Road',
  distanceKm: 4.8,
  baseFeeRupees: 35,
  status: 'assigned',
};

export const mockRouteOptions: RouteOption[] = [
  { id: 'route-a', name: 'Green Route', distanceKm: 2.72, durationMin: 6.5, co2Kg: 0.03, fuelCostRupees: 1.35, grsScore: 88, isGreenest: true, color: '#0F6E56' },
  { id: 'route-b', name: 'Standard Route', distanceKm: 3.37, durationMin: 11.2, co2Kg: 0.05, fuelCostRupees: 2.25, grsScore: 65, isGreenest: false, color: '#3b82f6' },
  { id: 'route-c', name: 'Fast Route', distanceKm: 2.46, durationMin: 4.9, co2Kg: 0.04, fuelCostRupees: 1.80, grsScore: 52, isGreenest: false, color: '#f59e0b' },
];

export const mockDeliveryCompletion: DeliveryCompletion = {
  deliveryId: 'DEL-99301',
  distanceKm: 5.6,
  durationMin: 18,
  baselineCO2Kg: 1.2,
  actualCO2Kg: 0.6,
  co2SavedKg: 0.6,
  rewardRupees: 5.1,
  treeEquivalent: 'brewing 30 cups of tea',
};

export const mockWalletTransactions: WalletTransaction[] = [
  { id: 'tx-001', deliveryRef: 'DEL-99301', amountRupees: 5.10, date: '2026-09-24 14:55', type: 'reward' },
  { id: 'tx-002', deliveryRef: 'DEL-99298', amountRupees: 4.80, date: '2026-09-24 13:20', type: 'reward' },
  { id: 'tx-003', deliveryRef: 'DEL-99295', amountRupees: 6.20, date: '2026-09-24 11:45', type: 'reward' },
  { id: 'tx-004', deliveryRef: 'DEL-99290', amountRupees: 3.90, date: '2026-09-24 10:10', type: 'reward' },
  { id: 'tx-005', deliveryRef: 'DEL-99285', amountRupees: 5.50, date: '2026-09-23 16:30', type: 'reward' },
  { id: 'tx-006', deliveryRef: 'DEL-99280', amountRupees: 4.60, date: '2026-09-23 14:15', type: 'reward' },
  { id: 'tx-007', deliveryRef: 'DEL-99275', amountRupees: 7.10, date: '2026-09-23 12:00', type: 'reward' },
  { id: 'tx-008', deliveryRef: 'DEL-99270', amountRupees: 3.20, date: '2026-09-22 17:45', type: 'reward' },
];

export const mockCO2History: CO2HistoryPoint[] = Array.from({ length: 30 }, (_, i) => ({
  date: `Day ${i + 1}`,
  co2SavedKg: Number((3.81 - i * 0.099 + Math.sin(i * 0.5) * 0.15).toFixed(2)),
}));

export const mockRouteHistory: RouteHistoryItem[] = [
  { id: 'rh-01', date: '2026-09-24 14:55', routeType: 'Green', co2SavedKg: 0.60, rewardRupees: 5.10, distanceKm: 5.6 },
  { id: 'rh-02', date: '2026-09-24 13:20', routeType: 'Green', co2SavedKg: 0.48, rewardRupees: 4.80, distanceKm: 4.2 },
  { id: 'rh-03', date: '2026-09-24 11:45', routeType: 'Green', co2SavedKg: 0.72, rewardRupees: 6.20, distanceKm: 6.1 },
  { id: 'rh-04', date: '2026-09-24 10:10', routeType: 'Default', co2SavedKg: 0.12, rewardRupees: 3.90, distanceKm: 3.8 },
  { id: 'rh-05', date: '2026-09-23 16:30', routeType: 'Green', co2SavedKg: 0.55, rewardRupees: 5.50, distanceKm: 5.0 },
  { id: 'rh-06', date: '2026-09-23 14:15', routeType: 'Green', co2SavedKg: 0.44, rewardRupees: 4.60, distanceKm: 4.5 },
];

export const mockWalletBalance = 3218;
export const mockWeeklyEarnings = [
  { day: 'Mon', amount: 82 },
  { day: 'Tue', amount: 95 },
  { day: 'Wed', amount: 78 },
  { day: 'Thu', amount: 110 },
  { day: 'Fri', amount: 92 },
  { day: 'Sat', amount: 125 },
  { day: 'Sun', amount: 88 },
];
