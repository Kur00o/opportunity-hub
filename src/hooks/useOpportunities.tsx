import { useQuery } from '@tanstack/react-query';
import { Opportunity } from '@/types/opportunity';
import { getAllOpportunities } from '@/lib/api/opportunityService';
import { mockOpportunities, getActiveOpportunities } from '@/lib/mock-data';

/**
 * Hook to fetch and manage opportunities
 * Uses React Query for caching and automatic refetching
 * Prefers upcoming/ongoing opportunities but never returns an empty list
 */
export function useOpportunities() {
  const { data, isLoading, error, refetch } = useQuery<Opportunity[]>({
    queryKey: ['opportunities'],
    queryFn: async () => {
      try {
        const opportunities = await getAllOpportunities();
        const allOpportunities = opportunities.length > 0 ? opportunities : mockOpportunities;

        // First try to show only active (upcoming/ongoing) opportunities
        const active = getActiveOpportunities(allOpportunities);
        return active.length > 0 ? active : allOpportunities;
      } catch (err) {
        console.error('Error fetching opportunities:', err);
        const active = getActiveOpportunities(mockOpportunities);
        return active.length > 0 ? active : mockOpportunities;
      }
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
  });

  const base = data || mockOpportunities;
  const active = getActiveOpportunities(base);

  return {
    opportunities: active.length > 0 ? active : base,
    isLoading,
    error,
    refetch,
  };
}

