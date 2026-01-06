import { mockOpportunities, getActiveOpportunities } from '@/lib/mock-data';

/**
 * Minimal hook that always returns opportunities from local data.
 * This guarantees results in production even if external APIs fail.
 * (You can re-enable the React Query + API integration later if needed.)
 */
export function useOpportunities() {
  const base = mockOpportunities;
  const active = getActiveOpportunities(base);

  return {
    opportunities: active.length > 0 ? active : base,
    isLoading: false,
    error: null,
    refetch: () => {},
  };
}

