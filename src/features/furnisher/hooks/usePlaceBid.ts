/**
 * Hook for placing bids on work contracts
 */

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

  return useMutation<void, Error, PlaceBidParams>({
    mutationFn: async ({ contract, bidData }) => {
      await furnisherService.placeBid(
        contract,
        bidData.plans,
        bidData.bidAmount,
        bidData.bond,
        bidData.timeRequired
      );
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
