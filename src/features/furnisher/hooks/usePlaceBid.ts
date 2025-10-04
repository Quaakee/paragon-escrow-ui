/**
 * Hook for placing bids on work contracts
 */

import { useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { furnisherService } from '@/services/blockchain/FurnisherService';
import type { EscrowTX } from '@/types/blockchain.types';
import type { PlaceBidFormData } from '../types';
import toast from 'react-hot-toast';

interface PlaceBidParams {
  contract: EscrowTX;
  bidData: PlaceBidFormData;
}

export const usePlaceBid = () => {
  const queryClient = useQueryClient();
  const executingRef = useRef<Set<string>>(new Set());

  return useMutation<void, Error, PlaceBidParams>({
    // CRITICAL: Never retry blockchain transactions - they modify state and cannot be idempotent
    retry: false,
    mutationFn: async ({ contract, bidData }) => {
      // Create unique key for this specific bid attempt
      const bidKey = `${contract.record.txid}:${contract.record.outputIndex}`;

      // Prevent duplicate execution (handles React StrictMode double-invokes in dev)
      if (executingRef.current.has(bidKey)) {
        console.log('🚫 Duplicate bid attempt detected and blocked:', bidKey);
        throw new Error('Bid already in progress for this contract');
      }

      try {
        executingRef.current.add(bidKey);

        // CRITICAL: Refetch fresh contract from overlay network before bidding
        // The cached contract may have stale/invalid BEEF data
        // This matches the pattern used in SimpleBidFlow.test.ts (fetch fresh, then bid)
        console.log('🔄 Refetching fresh contract before placing bid...');
        const freshContracts = await furnisherService.listAvailableWork();
        const freshContract = freshContracts.find(
          (c) => c.record.txid === contract.record.txid && c.record.outputIndex === contract.record.outputIndex
        );

        if (!freshContract) {
          throw new Error(
            `Contract not found in overlay network. ` +
            `TXID: ${contract.record.txid}, Output: ${contract.record.outputIndex}. ` +
            `The contract may have been spent or removed.`
          );
        }

        console.log('✅ Fresh contract fetched, placing bid...');
        await furnisherService.placeBid(
          freshContract,
          bidData.plans,
          bidData.bidAmount,
          bidData.bond,
          bidData.timeRequired
        );
      } finally {
        // Clean up after execution (success or failure)
        executingRef.current.delete(bidKey);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['furnisher', 'available-work'] });
      toast.success('Bid placed successfully!');
    },
    onError: (error) => {
      // Invalidate cache on error too, especially for "UTXO spent" errors
      queryClient.invalidateQueries({ queryKey: ['furnisher', 'available-work'] });
      toast.error(error.message || 'Failed to place bid');
    },
  });
};
