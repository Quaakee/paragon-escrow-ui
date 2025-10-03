/**
 * useContracts Hook - React Query hook for fetching multiple contracts
 * Provides contract list with caching, polling, and automatic refetching
 */

import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '@/stores/useUserStore';
import { seekerService } from '@/services/blockchain/SeekerService';
import { furnisherService } from '@/services/blockchain/FurnisherService';
import { platformService } from '@/services/blockchain/PlatformService';
import type { EscrowTX } from '@/types/blockchain.types';

interface UseContractsOptions {
  enabled?: boolean;
  pollInterval?: number; // Polling interval in milliseconds (0 = disabled)
  includeDisputes?: boolean; // Include disputed contracts
}

/**
 * Fetch contracts based on user role
 */
const fetchContracts = async (
  role: 'seeker' | 'furnisher' | 'platform' | null,
  includeDisputes: boolean = false
): Promise<EscrowTX[]> => {
  let contracts: EscrowTX[] = [];

  try {
    if (role === 'seeker') {
      contracts = await seekerService.getMyContracts();

      if (includeDisputes) {
        const disputes = await seekerService.listDisputes(true);
        contracts.push(...disputes.active);
      }
    } else if (role === 'furnisher') {
      contracts = await furnisherService.listAvailableWork();

      if (includeDisputes) {
        const disputes = await furnisherService.listDisputes(true);
        contracts.push(...disputes.active);
      }
    } else if (role === 'platform') {
      if (includeDisputes) {
        contracts = await platformService.listActiveDisputes();
      } else {
        // Platform typically only sees disputes
        contracts = await platformService.listActiveDisputes();
      }
    } else {
      throw new Error('No role selected. Please select a role first.');
    }
  } catch (error) {
    console.error('Failed to fetch contracts:', error);
    throw error;
  }

  return contracts;
};

export const useContracts = ({
  enabled = true,
  pollInterval = 0,
  includeDisputes = false,
}: UseContractsOptions = {}) => {
  const { role } = useUserStore();

  return useQuery({
    queryKey: ['contracts', role, includeDisputes],
    queryFn: () => fetchContracts(role, includeDisputes),
    enabled: enabled && !!role,
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes (renamed from cacheTime)
    retry: 2,
    refetchInterval: pollInterval > 0 ? pollInterval : false,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
