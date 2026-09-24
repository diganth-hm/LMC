import { create } from 'zustand';
import { DeliveryAssignment, RouteOption, DeliveryCompletion } from '../types';

interface DeliveryState {
  currentAssignment: DeliveryAssignment | null;
  selectedRoute: RouteOption | null;
  deliveryResult: DeliveryCompletion | null;
  isTracking: boolean;
  setAssignment: (a: DeliveryAssignment | null) => void;
  setSelectedRoute: (r: RouteOption | null) => void;
  setDeliveryResult: (d: DeliveryCompletion | null) => void;
  setIsTracking: (t: boolean) => void;
  resetDelivery: () => void;
}

export const useDeliveryStore = create<DeliveryState>((set) => ({
  currentAssignment: null,
  selectedRoute: null,
  deliveryResult: null,
  isTracking: false,
  setAssignment: (currentAssignment) => set({ currentAssignment }),
  setSelectedRoute: (selectedRoute) => set({ selectedRoute }),
  setDeliveryResult: (deliveryResult) => set({ deliveryResult }),
  setIsTracking: (isTracking) => set({ isTracking }),
  resetDelivery: () => set({ currentAssignment: null, selectedRoute: null, deliveryResult: null, isTracking: false }),
}));
