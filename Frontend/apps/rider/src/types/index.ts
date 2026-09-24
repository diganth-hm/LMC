export interface RiderProfile {
  id: string;
  name: string;
  phone: string;
  vehicleType: 'Petrol 2W' | 'EV 2W' | 'CNG 3W' | 'Diesel 3W';
  memberSince: string;
  payoutAccount: string;
  avatarUrl: string;
}

export interface RiderStats {
  todayDeliveries: number;
  todayCO2SavedKg: number;
  todayEarningsRupees: number;
  currentTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  grsScore: number;
  nextTierThreshold: number;
}

export interface DeliveryAssignment {
  id: string;
  pickupName: string;
  pickupAddress: string;
  dropAddress: string;
  distanceKm: number;
  baseFeeRupees: number;
  status: 'assigned' | 'in_progress' | 'completed';
}

export interface RouteOption {
  id: string;
  name: string;
  distanceKm: number;
  durationMin: number;
  co2Kg: number;
  fuelCostRupees: number;
  grsScore: number;
  isGreenest: boolean;
  color: string;
}

export interface DeliveryCompletion {
  deliveryId: string;
  distanceKm: number;
  durationMin: number;
  baselineCO2Kg: number;
  actualCO2Kg: number;
  co2SavedKg: number;
  rewardRupees: number;
  treeEquivalent: string;
}

export interface WalletTransaction {
  id: string;
  deliveryRef: string;
  amountRupees: number;
  date: string;
  type: 'reward' | 'withdrawal';
}

export interface CO2HistoryPoint {
  date: string;
  co2SavedKg: number;
}

export interface RouteHistoryItem {
  id: string;
  date: string;
  routeType: 'Green' | 'Default';
  co2SavedKg: number;
  rewardRupees: number;
  distanceKm: number;
}

export interface ApiError {
  status: number | 'network';
  message: string;
  code: string;
}
