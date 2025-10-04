/**
 * Hook for fetching available work contracts
 */

import { useQuery } from '@tanstack/react-query';
import { furnisherService } from '@/services/blockchain/FurnisherService';
import type { EscrowTX } from '@/types/blockchain.types';

export const useAvailableWork = () => {
  return useQuery<EscrowTX[], Error>({
    queryKey: ['furnisher', 'available-work'],
    queryFn: async () => {
      return await furnisherService.listAvailableWork();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 0, // Always consider data stale (refetch on mount)
    gcTime: 0, // Don't cache data (was cacheTime in v4)
  });
};
