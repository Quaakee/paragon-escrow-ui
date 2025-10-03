/**
 * useCreateWork Hook
 * Handles work contract creation with proper BRC-100 compliance
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { seekerService } from '@/services/blockchain/SeekerService';
import type { CreateWorkFormData } from '../types';
import { TOAST_MESSAGES } from '../constants';

export const useCreateWork = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateWorkFormData) => {
      // Convert deadline Date to Unix timestamp
      const deadline = Math.floor(data.deadline.getTime() / 1000);

      // Call seeker service which wraps backend Seeker entity
      // Backend handles:
      // 1. Transaction creation with proper locking script
      // 2. Wallet action creation (BRC-100 compliance)
      // 3. Broadcasting to overlay network via TopicManager
      await seekerService.createWork(data.description, deadline, data.bounty);
    },
    onSuccess: () => {
      // Invalidate contracts query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['seeker', 'contracts'] });
    },
    meta: {
      successMessage: TOAST_MESSAGES.CREATE_WORK_SUCCESS,
      errorMessage: TOAST_MESSAGES.CREATE_WORK_ERROR,
    },
  });
};
