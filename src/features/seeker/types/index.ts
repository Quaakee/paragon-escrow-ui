/**
 * Seeker Feature Type Definitions
 */

import type { EscrowTX, Bid, ContractStatus } from '@/types/blockchain.types';

/**
 * Create work form data
 * Note: Description should start with a brief title on the first line
 */
export interface CreateWorkFormData {
  description: string;
  bounty: number; // satoshis
  deadline: Date;
  contractType: 'bid' | 'bounty';
}

/**
 * Contract filter options
 */
export interface ContractFilters {
  status: ContractStatus | 'all';
  searchQuery: string;
  sortBy: 'newest' | 'oldest' | 'bounty-high' | 'bounty-low' | 'deadline';
}

/**
 * Contract statistics
 */
export interface ContractStats {
  totalContracts: number;
  openContracts: number;
  activeContracts: number;
  completedContracts: number;
  disputedContracts: number;
  totalBountyLocked: number; // satoshis
}

/**
 * Bid with additional UI metadata
 */
export interface BidWithMetadata extends Bid {
  index: number;
  isAccepted: boolean;
  isLatest: boolean;
}

/**
 * Contract action types
 */
export type ContractAction =
  | 'accept-bid'
  | 'approve-work'
  | 'raise-dispute'
  | 'cancel-contract'
  | 'increase-bounty'
  | 'view-details';

/**
 * Contract action payload
 */
export interface ContractActionPayload {
  action: ContractAction;
  contract: EscrowTX;
  bidIndex?: number;
  amount?: number;
}

/**
 * Dashboard view mode
 */
export type DashboardView = 'list' | 'grid';

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';
