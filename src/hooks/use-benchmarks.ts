import useSWR from 'swr';
import { BenchmarkWithRelations } from '@/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useBenchmarks(query = '') {
  const url = query ? `/api/benchmarks?${query}` : '/api/benchmarks';
  const { data, error, isLoading, mutate } = useSWR<BenchmarkWithRelations[]>(url, fetcher);

  return {
    benchmarks: data || [],
    isLoading,
    isError: error,
    mutate
  };
}

export function useBenchmark(id?: string) {
  const { data, error, isLoading, mutate } = useSWR<BenchmarkWithRelations>(id ? `/api/benchmarks/${id}` : null, fetcher);
  
  return {
    benchmark: data,
    isLoading,
    isError: error,
    mutate
  };
}
