/**
 * Contract Store - Zustand state management for contract caching
 * Caches contract data and manages selected contract state
 */

import { create } from 'zustand';
import type { EscrowTX } from '@/types/blockchain.types';

interface ContractState {
  contracts: Map<string, EscrowTX>;
  selectedContract: EscrowTX | null;
  loading: boolean;
  error: string | null;

  // Actions
  setContracts: (contracts: EscrowTX[]) => void;
  addContract: (contract: EscrowTX) => void;
  selectContract: (contractId: string) => void;
  clearContracts: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

/**
 * Generate a unique contract ID from txid and outputIndex
 */
const getContractId = (contract: EscrowTX): string => {
  return `${contract.record.txid}:${contract.record.outputIndex}`;
};

export const useContractStore = create<ContractState>((set, get) => ({
  contracts: new Map(),
  selectedContract: null,
  loading: false,
  error: null,

  /**
   * Set contracts in the cache (replaces existing)
   */
  setContracts: (contracts: EscrowTX[]) => {
    const contractsMap = new Map<string, EscrowTX>();

    contracts.forEach((contract) => {
      const id = getContractId(contract);
      contractsMap.set(id, contract);
    });

    set({ contracts: contractsMap, error: null });
  },

  /**
   * Add a single contract to the cache
   */
  addContract: (contract: EscrowTX) => {
    const { contracts } = get();
    const id = getContractId(contract);

    const updatedContracts = new Map(contracts);
    updatedContracts.set(id, contract);

    set({ contracts: updatedContracts });
  },

  /**
   * Select a contract by its ID (txid:outputIndex)
   */
  selectContract: (contractId: string) => {
    const { contracts } = get();
    const contract = contracts.get(contractId);

    if (contract) {
      set({ selectedContract: contract });
    } else {
      set({ error: `Contract not found: ${contractId}` });
    }
  },

  /**
   * Clear all contracts from cache
   */
  clearContracts: () => {
    set({
      contracts: new Map(),
      selectedContract: null,
      error: null,
    });
  },

  /**
   * Set loading state
   */
  setLoading: (loading: boolean) => {
    set({ loading });
  },

  /**
   * Set error message
   */
  setError: (error: string | null) => {
    set({ error });
  },
}));
