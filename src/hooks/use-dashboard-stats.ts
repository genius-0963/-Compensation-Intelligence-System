import useSWR from 'swr';
import { DashboardStats } from '@/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useDashboardStats() {
  const { data, error, isLoading, mutate } = useSWR<DashboardStats>('/api/dashboard/stats', fetcher, {
    refreshInterval: 5000, // Refresh every 5 seconds for "real-time" feel
    revalidateOnFocus: true,
  });

  return {
    stats: data,
    isLoading,
    isError: error,
    mutate
  };
}
