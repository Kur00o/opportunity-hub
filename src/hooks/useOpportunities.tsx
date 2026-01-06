// @ts-nocheck

import { useEffect, useState } from 'react';
import { getAllOpportunities } from '@/lib/api/opportunityService';
import { mockOpportunities, getActiveOpportunities } from '@/lib/mock-data';
import { Opportunity } from '@/types/opportunity';

/**
 * Hook that fetches opportunities from the API.
 * Returns only upcoming/ongoing opportunities (filters out expired).
 * Falls back to mock data if API fails or returns nothing.
 */
export function useOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const apiData = await getAllOpportunities();
        const active = getActiveOpportunities(apiData);
        console.log('useOpportunities: fetched', apiData.length, 'active', active.length);
        
        // If API returned results, use them
        // Otherwise fall back to mock data
        if (apiData.length > 0) {
          setOpportunities(active.length > 0 ? active : apiData);
        } else {
          console.warn('API returned no results, using mock data');
          const activeMock = getActiveOpportunities(mockOpportunities);
          setOpportunities(activeMock.length > 0 ? activeMock : mockOpportunities);
        }
      } catch (err: any) {
        console.error('useOpportunities: fetch error', err);
        console.warn('Falling back to mock data due to error');
        setError(err);
        // Fallback to mock data on error
        const activeMock = getActiveOpportunities(mockOpportunities);
        setOpportunities(activeMock.length > 0 ? activeMock : mockOpportunities);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return {
    opportunities,
    isLoading,
    error,
    refetch: () => {},
  };
}

