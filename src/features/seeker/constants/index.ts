/**
 * Seeker Feature Constants
 */

import type { ContractFilters } from '../types';

/**
 * Default contract filters
 */
export const DEFAULT_FILTERS: ContractFilters = {
  status: 'all',
  searchQuery: '',
  sortBy: 'newest',
};

/**
 * Minimum bounty amount in satoshis (1000 sats)
 */
export const MIN_BOUNTY = 1000;

/**
 * Maximum bounty amount in satoshis (1 BSV = 100M sats)
 */
export const MAX_BOUNTY = 100_000_000;

/**
 * Default bounty amount in satoshis (10,000 sats)
 */
export const DEFAULT_BOUNTY = 10_000;

/**
 * Minimum deadline hours from now
 */
export const MIN_DEADLINE_HOURS = 1;

/**
 * Maximum deadline days from now
 */
export const MAX_DEADLINE_DAYS = 365;

/**
 * Default deadline days from now
 */
export const DEFAULT_DEADLINE_DAYS = 7;

/**
 * Pagination page size
 */
export const PAGE_SIZE = 10;

/**
 * Query stale time (5 minutes)
 */
export const QUERY_STALE_TIME = 5 * 60 * 1000;

/**
 * Query cache time (10 minutes)
 */
export const QUERY_CACHE_TIME = 10 * 60 * 1000;

/**
 * Status display names
 */
export const STATUS_LABELS: Record<string, string> = {
  all: 'All Contracts',
  initial: 'Open for Bids',
  'bid-accepted': 'Bid Accepted',
  'work-started': 'In Progress',
  'work-submitted': 'Pending Approval',
  resolved: 'Completed',
  'disputed-by-seeker': 'Disputed by You',
  'disputed-by-furnisher': 'Disputed by Furnisher',
};

/**
 * Contract action labels
 */
export const ACTION_LABELS: Record<string, string> = {
  'accept-bid': 'Accept Bid',
  'approve-work': 'Approve Work',
  'raise-dispute': 'Raise Dispute',
  'cancel-contract': 'Cancel Contract',
  'increase-bounty': 'Increase Bounty',
  'view-details': 'View Details',
};

/**
 * Toast notification messages
 */
export const TOAST_MESSAGES = {
  CREATE_WORK_SUCCESS: 'Work contract created successfully!',
  CREATE_WORK_ERROR: 'Failed to create work contract',
  ACCEPT_BID_SUCCESS: 'Bid accepted successfully!',
  ACCEPT_BID_ERROR: 'Failed to accept bid',
  APPROVE_WORK_SUCCESS: 'Work approved and payment released!',
  APPROVE_WORK_ERROR: 'Failed to approve work',
  RAISE_DISPUTE_SUCCESS: 'Dispute raised successfully',
  RAISE_DISPUTE_ERROR: 'Failed to raise dispute',
  CANCEL_CONTRACT_SUCCESS: 'Contract cancelled successfully',
  CANCEL_CONTRACT_ERROR: 'Failed to cancel contract',
  INCREASE_BOUNTY_SUCCESS: 'Bounty increased successfully!',
  INCREASE_BOUNTY_ERROR: 'Failed to increase bounty',
};

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet first',
  INVALID_BOUNTY: 'Bounty must be between 1,000 and 100,000,000 satoshis',
  INVALID_DEADLINE: 'Deadline must be at least 1 hour from now',
  NO_CONTRACTS: 'No contracts found',
  LOAD_CONTRACTS_FAILED: 'Failed to load contracts',
  NETWORK_ERROR: 'Network error. Please try again.',
};
