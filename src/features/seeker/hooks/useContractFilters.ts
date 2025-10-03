/**
 * useContractFilters Hook
 * Manages contract filtering, searching, and sorting
 */

import { useState, useMemo } from 'react';
import type { EscrowTX } from '@/types/blockchain.types';
import type { ContractFilters } from '../types';
import { DEFAULT_FILTERS } from '../constants';
import {
  filterByStatus,
  filterBySearch,
  sortContracts,
} from '../utils/contractHelpers';

export const useContractFilters = (contracts: EscrowTX[]) => {
  const [filters, setFilters] = useState<ContractFilters>(DEFAULT_FILTERS);

  // Apply filters and sorting
  const filteredContracts = useMemo(() => {
    let result = [...contracts];

    // Filter by status
    result = filterByStatus(result, filters.status);

    // Filter by search query
    result = filterBySearch(result, filters.searchQuery);

    // Sort
    result = sortContracts(result, filters.sortBy);

    return result;
  }, [contracts, filters]);

  // Update individual filter
  const updateFilter = <K extends keyof ContractFilters>(
    key: K,
    value: ContractFilters[K]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  return {
    filters,
    filteredContracts,
    updateFilter,
    resetFilters,
    hasActiveFilters:
      filters.status !== 'all' ||
      filters.searchQuery !== '' ||
      filters.sortBy !== 'newest',
  };
};
