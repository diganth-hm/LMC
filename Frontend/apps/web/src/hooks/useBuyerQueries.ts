import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { buyerService } from '../services/api/buyer';

export function useCreditInventory() {
  return useQuery({
    queryKey: ['buyer', 'inventory'],
    queryFn: buyerService.getCreditBatches,
  });
}

export function useBatchDetails(batchId: string) {
  return useQuery({
    queryKey: ['buyer', 'batch', batchId],
    queryFn: () => buyerService.getBatchDetails(batchId),
    enabled: Boolean(batchId),
  });
}

export function useAuditTrail(batchId: string) {
  return useQuery({
    queryKey: ['buyer', 'audit-trail', batchId],
    queryFn: () => buyerService.getAuditTrail(batchId),
    enabled: Boolean(batchId),
  });
}

export function usePricingTiers() {
  return useQuery({
    queryKey: ['buyer', 'pricing-tiers'],
    queryFn: buyerService.getPricingTiers,
  });
}

export function usePurchaseHistory() {
  return useQuery({
    queryKey: ['buyer', 'orders'],
    queryFn: buyerService.getOrders,
  });
}

export function useCertificate(certId: string) {
  return useQuery({
    queryKey: ['buyer', 'certificate', certId],
    queryFn: () => buyerService.getCertificate(certId),
    enabled: Boolean(certId),
  });
}

export function useBuyerImpact() {
  return useQuery({
    queryKey: ['buyer', 'impact'],
    queryFn: buyerService.getBuyerImpact,
  });
}

export function useBuyerProfile() {
  return useQuery({
    queryKey: ['buyer', 'profile'],
    queryFn: buyerService.getBuyerProfile,
  });
}

export function usePurchaseCredits() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { batchId: string; quantityTonnes: number; paymentMethod: string }) =>
      buyerService.purchaseCredits(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyer', 'inventory'] });
      queryClient.invalidateQueries({ queryKey: ['buyer', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['buyer', 'impact'] });
      queryClient.invalidateQueries({ queryKey: ['buyer', 'certificate'] });
    },
  });
}
