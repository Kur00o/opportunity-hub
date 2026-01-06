// @ts-nocheck

import { useEffect, useState } from 'react';
import { getAllOpportunities } from '@/lib/api/opportunityService';
import { getActiveOpportunities } from '@/lib/mock-data';
import { Opportunity } from '@/types/opportunity';

/**
 * Hook that fetches opportunities from the API.
 * Returns only upcoming/ongoing opportunities (filters out expired).
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
        setOpportunities(active);
      } catch (err: any) {
        console.error('useOpportunities: fetch error', err);
        setError(err);
        setOpportunities([]);
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

