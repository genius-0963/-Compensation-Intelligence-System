import useSWR from 'swr';
import { CandidateWithOffers } from '@/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useCandidates(query = '') {
  const url = query ? `/api/candidates?${query}` : '/api/candidates';
  const { data, error, isLoading, mutate } = useSWR<CandidateWithOffers[]>(url, fetcher);

  return {
    candidates: data || [],
    isLoading,
    isError: error,
    mutate
  };
}

export function useCandidate(id?: string) {
  const { data, error, isLoading, mutate } = useSWR<CandidateWithOffers>(id ? `/api/candidates/${id}` : null, fetcher);
  
  return {
    candidate: data,
    isLoading,
    isError: error,
    mutate
  };
}
