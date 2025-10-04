/**
 * Hook for managing work filters
 */

import { useState, useMemo } from 'react';
import type { EscrowTX } from '@/types/blockchain.types';
import type { WorkFilters } from '../types';
import { DEFAULT_MIN_BOUNTY, DEFAULT_MAX_BOUNTY } from '../constants';

const defaultFilters: WorkFilters = {
  searchQuery: '',
  minBounty: DEFAULT_MIN_BOUNTY,
  maxBounty: DEFAULT_MAX_BOUNTY,
  sortBy: 'newest',
  showOnlyNoBids: false,
};

export const useWorkFilters = (contracts: EscrowTX[] = []) => {
  const [filters, setFilters] = useState<WorkFilters>(defaultFilters);

  const filteredContracts = useMemo(() => {
    let result = [...contracts];

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter((contract) =>
        contract.record.workDescription.toLowerCase().includes(query)
      );
    }

    // Bounty range filter
    result = result.filter(
      (contract) =>
        contract.satoshis >= filters.minBounty &&
        contract.satoshis <= filters.maxBounty
    );

    // No bids filter
    if (filters.showOnlyNoBids) {
      result = result.filter(
        (contract) =>
          !contract.record.bids || contract.record.bids.length === 0
      );
    }

    // Sorting
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return b.record.workCompletionDeadline - a.record.workCompletionDeadline;
        case 'oldest':
          return a.record.workCompletionDeadline - b.record.workCompletionDeadline;
        case 'bounty-high':
          return b.satoshis - a.satoshis;
        case 'bounty-low':
          return a.satoshis - b.satoshis;
        case 'deadline':
          return a.record.workCompletionDeadline - b.record.workCompletionDeadline;
        default:
          return 0;
      }
    });

    return result;
  }, [contracts, filters]);

  const updateFilters = (newFilters: Partial<WorkFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return {
    filters,
    filteredContracts,
    updateFilters,
    resetFilters,
  };
};
