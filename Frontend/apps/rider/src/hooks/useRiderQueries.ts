import { useQuery, useMutation } from '@tanstack/react-query';
import { riderService } from '../services/api/riders';

export function useRiderProfile() {
  return useQuery({ queryKey: ['rider', 'profile'], queryFn: riderService.getProfile });
}
export function useRiderStats() {
  return useQuery({ queryKey: ['rider', 'stats'], queryFn: riderService.getStats, staleTime: 15_000 });
}
export function useDeliveryAssignment() {
  return useQuery({ queryKey: ['rider', 'assignment'], queryFn: riderService.getAssignment });
}
export function useRoutes(deliveryId: string) {
  return useQuery({ queryKey: ['rider', 'routes', deliveryId], queryFn: () => riderService.getRoutes(deliveryId), enabled: Boolean(deliveryId) });
}
export function useCompleteDelivery() {
  return useMutation({ mutationFn: (deliveryId: string) => riderService.completeDelivery(deliveryId) });
}
export function useWalletBalance() {
  return useQuery({ queryKey: ['rider', 'wallet-balance'], queryFn: riderService.getWalletBalance });
}
export function useWalletTransactions() {
  return useQuery({ queryKey: ['rider', 'transactions'], queryFn: riderService.getTransactions });
}
export function useWeeklyEarnings() {
  return useQuery({ queryKey: ['rider', 'weekly-earnings'], queryFn: riderService.getWeeklyEarnings });
}
export function useCO2History() {
  return useQuery({ queryKey: ['rider', 'co2-history'], queryFn: riderService.getCO2History });
}
export function useRouteHistory() {
  return useQuery({ queryKey: ['rider', 'route-history'], queryFn: riderService.getRouteHistory });
}
