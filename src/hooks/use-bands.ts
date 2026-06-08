import useSWR from 'swr';
import { BandWithRelations } from '@/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useBands(query = '') {
  const url = query ? `/api/bands?${query}` : '/api/bands';
  const { data, error, isLoading, mutate } = useSWR<BandWithRelations[]>(url, fetcher);

  return {
    bands: data || [],
    isLoading,
    isError: error,
    mutate
  };
}

export function useBand(id?: string) {
  const { data, error, isLoading, mutate } = useSWR<BandWithRelations>(id ? `/api/bands/${id}` : null, fetcher);
  
  return {
    band: data,
    isLoading,
    isError: error,
    mutate
  };
}
