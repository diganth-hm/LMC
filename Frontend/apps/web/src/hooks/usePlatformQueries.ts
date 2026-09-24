import { useQuery, useMutation } from '@tanstack/react-query';
import { platformService } from '../services/api/platform';

export function useFleetOverview() {
  return useQuery({
    queryKey: ['platform', 'fleet-overview'],
    queryFn: platformService.getFleetOverview,
  });
}

export function useCityStats() {
  return useQuery({
    queryKey: ['platform', 'city-stats'],
    queryFn: platformService.getCityStats,
  });
}

export function useEmissionsStats() {
  return useQuery({
    queryKey: ['platform', 'emissions-stats'],
    queryFn: platformService.getEmissionsStats,
  });
}

export function useRiderLeaderboard() {
  return useQuery({
    queryKey: ['platform', 'leaderboard'],
    queryFn: platformService.getLeaderboard,
  });
}

export function useDeliveryAnalytics() {
  return useQuery({
    queryKey: ['platform', 'delivery-analytics'],
    queryFn: platformService.getDeliveryAnalytics,
  });
}

export function useInvoices() {
  return useQuery({
    queryKey: ['platform', 'invoices'],
    queryFn: platformService.getInvoices,
  });
}

export function useReportTemplates() {
  return useQuery({
    queryKey: ['platform', 'report-templates'],
    queryFn: platformService.getReportTemplates,
  });
}

export function useGenerateReport() {
  return useMutation({
    mutationFn: ({ templateId, format }: { templateId: string; format: string }) =>
      platformService.generateReport(templateId, format),
  });
}
