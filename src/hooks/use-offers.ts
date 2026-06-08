import useSWR from 'swr';
import { OfferWithRelations } from '@/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useOffers(query = '') {
  const url = query ? `/api/offers?${query}` : '/api/offers';
  const { data, error, isLoading, mutate } = useSWR<OfferWithRelations[]>(url, fetcher);

  return {
    offers: data || [],
    isLoading,
    isError: error,
    mutate
  };
}

export function useOffer(id?: string) {
  const { data, error, isLoading, mutate } = useSWR<OfferWithRelations>(id ? `/api/offers/${id}` : null, fetcher);
  
  return {
    offer: data,
    isLoading,
    isError: error,
    mutate
  };
}
