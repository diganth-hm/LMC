import { RiderProfile, RiderStats, DeliveryAssignment, RouteOption, DeliveryCompletion, WalletTransaction, CO2HistoryPoint, RouteHistoryItem } from '../../types';
import { mockRiderProfile, mockRiderStats, mockDeliveryAssignment, mockRouteOptions, mockDeliveryCompletion, mockWalletTransactions, mockCO2History, mockRouteHistory, mockWalletBalance, mockWeeklyEarnings } from './mockData';

const USE_MOCKS = true; // import.meta.env.EXPO_PUBLIC_USE_MOCKS !== 'false';

export const riderService = {
  getProfile: async (): Promise<RiderProfile> => { if (USE_MOCKS) { await new Promise(r => setTimeout(r, 200)); return mockRiderProfile; } throw new Error('Not implemented'); },
  getStats: async (): Promise<RiderStats> => { if (USE_MOCKS) { await new Promise(r => setTimeout(r, 200)); return mockRiderStats; } throw new Error('Not implemented'); },
  getAssignment: async (): Promise<DeliveryAssignment> => { if (USE_MOCKS) { await new Promise(r => setTimeout(r, 400)); return mockDeliveryAssignment; } throw new Error('Not implemented'); },
  getRoutes: async (_deliveryId: string): Promise<RouteOption[]> => { if (USE_MOCKS) { await new Promise(r => setTimeout(r, 500)); return mockRouteOptions; } throw new Error('Not implemented'); },
  completeDelivery: async (_deliveryId: string): Promise<DeliveryCompletion> => { if (USE_MOCKS) { await new Promise(r => setTimeout(r, 800)); return mockDeliveryCompletion; } throw new Error('Not implemented'); },
  getWalletBalance: async (): Promise<number> => { if (USE_MOCKS) { await new Promise(r => setTimeout(r, 200)); return mockWalletBalance; } throw new Error('Not implemented'); },
  getTransactions: async (): Promise<WalletTransaction[]> => { if (USE_MOCKS) { await new Promise(r => setTimeout(r, 250)); return mockWalletTransactions; } throw new Error('Not implemented'); },
  getWeeklyEarnings: async (): Promise<{ day: string; amount: number }[]> => { if (USE_MOCKS) { return mockWeeklyEarnings; } throw new Error('Not implemented'); },
  getCO2History: async (): Promise<CO2HistoryPoint[]> => { if (USE_MOCKS) { await new Promise(r => setTimeout(r, 250)); return mockCO2History; } throw new Error('Not implemented'); },
  getRouteHistory: async (): Promise<RouteHistoryItem[]> => { if (USE_MOCKS) { await new Promise(r => setTimeout(r, 200)); return mockRouteHistory; } throw new Error('Not implemented'); },
};
