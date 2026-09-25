import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { riderService } from '../services/api/riders';

export function useRiderProfile() {
  return useQuery({ queryKey: ['rider', 'profile'], queryFn: riderService.getProfile });
}
export function useUpdateVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vehicleType: string) => riderService.updateVehicle(vehicleType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rider', 'profile'] });
    },
  });
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
export function useSelectRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (routeId: string) => riderService.selectRoute(routeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rider', 'assignment'] });
    },
  });
}
export function useCompleteDelivery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (deliveryId: string) => riderService.completeDelivery(deliveryId),
    onSuccess: () => {
      // After delivery completion, refresh dashboard stats, wallet, CO2 history, route history
      queryClient.invalidateQueries({ queryKey: ['rider', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['rider', 'assignment'] });
      queryClient.invalidateQueries({ queryKey: ['rider', 'wallet-balance'] });
      queryClient.invalidateQueries({ queryKey: ['rider', 'transactions'] });
      queryClient.invalidateQueries({ queryKey: ['rider', 'co2-history'] });
      queryClient.invalidateQueries({ queryKey: ['rider', 'route-history'] });
      queryClient.invalidateQueries({ queryKey: ['rider', 'weekly-earnings'] });
    },
  });
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
