/**
 * useContractActions Hook
 * Handles all contract actions with proper BRC-100 compliance
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { seekerService } from '@/services/blockchain/SeekerService';
import type { EscrowTX } from '@/types/blockchain.types';
import { TOAST_MESSAGES } from '../constants';

/**
 * Accept bid mutation
 */
export const useAcceptBid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      contract,
      bidIndex,
    }: {
      contract: EscrowTX;
      bidIndex: number;
    }) => {
      await seekerService.acceptBid(contract, bidIndex);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seeker', 'contracts'] });
    },
    meta: {
      successMessage: TOAST_MESSAGES.ACCEPT_BID_SUCCESS,
      errorMessage: TOAST_MESSAGES.ACCEPT_BID_ERROR,
    },
  });
};

/**
 * Approve work mutation
 */
export const useApproveWork = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contract: EscrowTX) => {
      await seekerService.approveWork(contract);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seeker', 'contracts'] });
    },
    meta: {
      successMessage: TOAST_MESSAGES.APPROVE_WORK_SUCCESS,
      errorMessage: TOAST_MESSAGES.APPROVE_WORK_ERROR,
    },
  });
};

/**
 * Raise dispute mutation
 */
export const useRaiseDispute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      contract,
      reason,
    }: {
      contract: EscrowTX;
      reason: string;
    }) => {
      await seekerService.raiseDispute(contract, reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seeker', 'contracts'] });
      queryClient.invalidateQueries({ queryKey: ['seeker', 'disputes'] });
    },
    meta: {
      successMessage: TOAST_MESSAGES.RAISE_DISPUTE_SUCCESS,
      errorMessage: TOAST_MESSAGES.RAISE_DISPUTE_ERROR,
    },
  });
};

/**
 * Cancel contract mutation
 */
export const useCancelContract = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contract: EscrowTX) => {
      await seekerService.cancelContract(contract);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seeker', 'contracts'] });
    },
    meta: {
      successMessage: TOAST_MESSAGES.CANCEL_CONTRACT_SUCCESS,
      errorMessage: TOAST_MESSAGES.CANCEL_CONTRACT_ERROR,
    },
  });
};

/**
 * Increase bounty mutation
 */
export const useIncreaseBounty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      contract,
      amount,
    }: {
      contract: EscrowTX;
      amount: number;
    }) => {
      await seekerService.increaseBounty(contract, amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seeker', 'contracts'] });
    },
    meta: {
      successMessage: TOAST_MESSAGES.INCREASE_BOUNTY_SUCCESS,
      errorMessage: TOAST_MESSAGES.INCREASE_BOUNTY_ERROR,
    },
  });
};
