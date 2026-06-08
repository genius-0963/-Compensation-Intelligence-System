import useSWR from 'swr';
import { MarketDataPoint } from '@/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useMarketData(query = '') {
  const url = query ? `/api/market-data?${query}` : '/api/market-data';
  const { data, error, isLoading, mutate } = useSWR<MarketDataPoint[]>(url, fetcher);

  return {
    marketData: data || [],
    isLoading,
    isError: error,
    mutate
  };
}
