/**
 * useContract Hook - React Query hook for fetching a single contract
 * Provides contract data with caching and automatic refetching
 */

import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '@/stores/useUserStore';
import { seekerService } from '@/services/blockchain/SeekerService';
import { furnisherService } from '@/services/blockchain/FurnisherService';
import { platformService } from '@/services/blockchain/PlatformService';
import type { EscrowTX } from '@/types/blockchain.types';

interface UseContractOptions {
  contractId: string; // Format: "txid:outputIndex"
  enabled?: boolean;
}

/**
 * Parse contract ID into txid and outputIndex
 */
const parseContractId = (
  contractId: string
): { txid: string; outputIndex: number } | null => {
  const parts = contractId.split(':');
  if (parts.length !== 2) return null;

  const txid = parts[0];
  const outputIndex = parseInt(parts[1], 10);

  if (!txid || isNaN(outputIndex)) return null;

  return { txid, outputIndex };
};

/**
 * Fetch a single contract by searching through all contracts
 */
const fetchContract = async (
  contractId: string,
  role: 'seeker' | 'furnisher' | 'platform' | null
): Promise<EscrowTX | null> => {
  const parsed = parseContractId(contractId);
  if (!parsed) {
    throw new Error(`Invalid contract ID format: ${contractId}`);
  }

  const { txid, outputIndex } = parsed;

  // Fetch contracts based on role
  let contracts: EscrowTX[] = [];

  try {
    if (role === 'seeker') {
      contracts = await seekerService.getMyContracts();
    } else if (role === 'furnisher') {
      contracts = await furnisherService.listAvailableWork();
    } else if (role === 'platform') {
      contracts = await platformService.listActiveDisputes();
    } else {
      // No role selected, try all services
      const [seekerContracts, furnisherContracts, platformContracts] =
        await Promise.allSettled([
          seekerService.getMyContracts(),
          furnisherService.listAvailableWork(),
          platformService.listActiveDisputes(),
        ]);

      if (seekerContracts.status === 'fulfilled') {
        contracts.push(...seekerContracts.value);
      }
      if (furnisherContracts.status === 'fulfilled') {
        contracts.push(...furnisherContracts.value);
      }
      if (platformContracts.status === 'fulfilled') {
        contracts.push(...platformContracts.value);
      }
    }
  } catch (error) {
    console.error('Failed to fetch contracts:', error);
    throw error;
  }

  // Find the specific contract
  const contract = contracts.find(
    (c) => c.record.txid === txid && c.record.outputIndex === outputIndex
  );

  return contract || null;
};

export const useContract = ({ contractId, enabled = true }: UseContractOptions) => {
  const { role } = useUserStore();

  return useQuery({
    queryKey: ['contract', contractId, role],
    queryFn: () => fetchContract(contractId, role),
    enabled: enabled && !!contractId,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (renamed from cacheTime)
    retry: 2,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
