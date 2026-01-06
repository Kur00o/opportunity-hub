import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Opportunity } from '@/types/opportunity';
import { getAllOpportunities } from '@/lib/api/opportunityService';
import { mockOpportunities, getActiveOpportunities } from '@/lib/mock-data';

/**
 * Hook to fetch and manage opportunities
 * Uses React Query for caching and automatic refetching
 * Filters out expired opportunities - only shows upcoming/ongoing
 */
export function useOpportunities() {
  const { data, isLoading, error, refetch } = useQuery<Opportunity[]>({
    queryKey: ['opportunities'],
    queryFn: async () => {
      // Try to fetch from API, fallback to mock data
      try {
        const opportunities = await getAllOpportunities();
        const allOpportunities = opportunities.length > 0 ? opportunities : mockOpportunities;
        // Filter out expired opportunities
        return getActiveOpportunities(allOpportunities);
      } catch (err) {
        console.error('Error fetching opportunities:', err);
        // Filter out expired opportunities from mock data
        return getActiveOpportunities(mockOpportunities);
      }
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
  });

  return {
    opportunities: data || getActiveOpportunities(mockOpportunities),
    isLoading,
    error,
    refetch,
  };
}

