/**
 * Furnisher Feature Type Definitions
 */

import type { EscrowTX } from '@/types/blockchain.types';

/**
 * Place bid form data
 */
export interface PlaceBidFormData {
  bidAmount: number; // satoshis
  plans: string;
  bond?: number; // satoshis (optional)
  timeRequired?: number; // seconds
}

/**
 * Available work filter options
 */
export interface WorkFilters {
  searchQuery: string;
  minBounty: number;
  maxBounty: number;
  sortBy: 'newest' | 'oldest' | 'bounty-high' | 'bounty-low' | 'deadline';
  showOnlyNoBids: boolean;
}

/**
 * Work statistics
 */
export interface WorkStats {
  totalAvailableWork: number;
  activeBids: number;
  ongoingWork: number;
  completedWork: number;
  totalEarned: number; // satoshis
}

/**
 * Work with additional UI metadata
 */
export interface WorkWithMetadata extends EscrowTX {
  hasBids: boolean;
  myBidIndex?: number;
  isMyBidAccepted?: boolean;
}

/**
 * Furnisher action types
 */
export type FurnisherAction =
  | 'place-bid'
  | 'start-work'
  | 'submit-work'
  | 'claim-bounty'
  | 'raise-dispute'
  | 'view-details';

/**
 * Furnisher action payload
 */
export interface FurnisherActionPayload {
  action: FurnisherAction;
  contract: EscrowTX;
  bidData?: PlaceBidFormData;
  workDescription?: string;
}

/**
 * Dashboard view mode
 */
export type DashboardView = 'available' | 'my-bids' | 'active' | 'completed';
