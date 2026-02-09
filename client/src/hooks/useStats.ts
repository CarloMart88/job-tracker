import { useQuery } from '@tanstack/react-query';
import * as statsService from '../services/statsService';

export function useOverview() {
  return useQuery({
    queryKey: ['stats', 'overview'],
    queryFn: statsService.getOverview,
  });
}

export function useTrends() {
  return useQuery({
    queryKey: ['stats', 'trends'],
    queryFn: statsService.getTrends,
  });
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ['stats', 'recent-activity'],
    queryFn: statsService.getRecentActivity,
  });
}
