import { mockOpportunities } from '@/lib/mock-data';

/**
 * Hook that returns opportunities from local data.
 * Always returns all opportunities - filtering happens in the UI component.
 */
export function useOpportunities() {
  // Debug: Log opportunity count
  console.log('useOpportunities: Returning', mockOpportunities.length, 'opportunities');
  
  // Return all opportunities - let the UI handle filtering by status
  // This ensures we always have data to display
  return {
    opportunities: mockOpportunities,
    isLoading: false,
    error: null,
    refetch: () => {},
  };
}

