import useSWR from 'swr';
import { EmployeeWithRelations } from '@/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useEmployees(query = '') {
  const url = query ? `/api/employees?${query}` : '/api/employees';
  const { data, error, isLoading, mutate } = useSWR<EmployeeWithRelations[]>(url, fetcher);

  return {
    employees: data || [],
    isLoading,
    isError: error,
    mutate
  };
}

export function useEmployee(id?: string) {
  const { data, error, isLoading, mutate } = useSWR<EmployeeWithRelations>(id ? `/api/employees/${id}` : null, fetcher);
  
  return {
    employee: data,
    isLoading,
    isError: error,
    mutate
  };
}
