/**
 * Bid Helper Utilities
 */

import type { Bid, EscrowTX } from '@/types/blockchain.types';
import type { BidWithMetadata } from '../types';
import { hexToAscii } from '@/utils/formatting';

/**
 * Enrich bids with metadata
 * Filters out placeholder bids (sCrypt uses FixedArray<Bid, 4> with empty slots)
 */
export const enrichBidsWithMetadata = (
  contract: EscrowTX
): BidWithMetadata[] => {
  const bids = contract.record.bids || [];
  const acceptedBid = contract.record.acceptedBid;

  // Filter out placeholder bids (empty slots in FixedArray)
  // Placeholder bids have bidAmount=0 and timeOfBid=0
  const realBids = bids.filter(
    (bid) => bid.bidAmount > 0 && bid.timeOfBid > 0
  );

  return realBids.map((bid, index) => ({
    ...bid,
    index,
    isAccepted:
      acceptedBid &&
      acceptedBid.furnisherKey === bid.furnisherKey &&
      acceptedBid.plans === bid.plans,
    isLatest: index === realBids.length - 1,
  }));
};

/**
 * Get accepted bid with metadata
 */
export const getAcceptedBid = (
  contract: EscrowTX
): BidWithMetadata | null => {
  const enrichedBids = enrichBidsWithMetadata(contract);
  return enrichedBids.find((bid) => bid.isAccepted) || null;
};

/**
 * Sort bids by criteria
 */
export const sortBids = (
  bids: BidWithMetadata[],
  sortBy: 'newest' | 'oldest' | 'amount-low' | 'amount-high' | 'time-required'
): BidWithMetadata[] => {
  const sorted = [...bids];

  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => b.timeOfBid - a.timeOfBid);

    case 'oldest':
      return sorted.sort((a, b) => a.timeOfBid - b.timeOfBid);

    case 'amount-low':
      return sorted.sort((a, b) => a.bidAmount - b.bidAmount);

    case 'amount-high':
      return sorted.sort((a, b) => b.bidAmount - a.bidAmount);

    case 'time-required':
      return sorted.sort((a, b) => a.timeRequired - b.timeRequired);

    default:
      return sorted;
  }
};

/**
 * Get lowest bid
 * Filters out placeholder bids
 */
export const getLowestBid = (bids: Bid[]): Bid | null => {
  const realBids = bids.filter((bid) => bid.bidAmount > 0 && bid.timeOfBid > 0);
  if (realBids.length === 0) return null;
  return realBids.reduce((lowest, bid) =>
    bid.bidAmount < lowest.bidAmount ? bid : lowest
  );
};

/**
 * Get highest bid
 * Filters out placeholder bids
 */
export const getHighestBid = (bids: Bid[]): Bid | null => {
  const realBids = bids.filter((bid) => bid.bidAmount > 0 && bid.timeOfBid > 0);
  if (realBids.length === 0) return null;
  return realBids.reduce((highest, bid) =>
    bid.bidAmount > highest.bidAmount ? bid : highest
  );
};

/**
 * Get average bid amount
 * Filters out placeholder bids
 */
export const getAverageBidAmount = (bids: Bid[]): number => {
  const realBids = bids.filter((bid) => bid.bidAmount > 0 && bid.timeOfBid > 0);
  if (realBids.length === 0) return 0;
  const total = realBids.reduce((sum, bid) => sum + bid.bidAmount, 0);
  return Math.floor(total / realBids.length);
};

/**
 * Check if bid meets minimum requirements
 */
export const meetsMinimumBid = (bid: Bid, minBid: number): boolean => {
  return bid.bidAmount >= minBid;
};

/**
 * Check if bid has required bond
 */
export const hasRequiredBond = (bid: Bid, requiredBond: number): boolean => {
  return bid.bond >= requiredBond;
};

/**
 * Validate bid against contract requirements
 */
export const validateBid = (
  bid: Bid,
  contract: EscrowTX
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check minimum bid
  if (!meetsMinimumBid(bid, contract.record.minAllowableBid)) {
    errors.push(
      `Bid amount must be at least ${contract.record.minAllowableBid} satoshis`
    );
  }

  // Check bond requirements
  const bondingMode = contract.record.furnisherBondingMode;
  if (bondingMode === 'required') {
    if (!hasRequiredBond(bid, contract.record.requiredBondAmount)) {
      errors.push(
        `Bond amount must be at least ${contract.record.requiredBondAmount} satoshis`
      );
    }
  } else if (bondingMode === 'forbidden' && bid.bond > 0) {
    errors.push('Bond is not allowed for this contract');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Calculate total cost (bid amount + bond)
 */
export const calculateTotalCost = (bid: Bid): number => {
  return bid.bidAmount + bid.bond;
};

/**
 * Get bid statistics
 * Filters out placeholder bids before calculating statistics
 */
export const getBidStatistics = (
  bids: Bid[]
): {
  count: number;
  lowest: number | null;
  highest: number | null;
  average: number;
} => {
  // Filter out placeholder bids
  const realBids = bids.filter((bid) => bid.bidAmount > 0 && bid.timeOfBid > 0);

  if (realBids.length === 0) {
    return {
      count: 0,
      lowest: null,
      highest: null,
      average: 0,
    };
  }

  const lowestBid = getLowestBid(bids);
  const highestBid = getHighestBid(bids);

  return {
    count: realBids.length,
    lowest: lowestBid?.bidAmount || null,
    highest: highestBid?.bidAmount || null,
    average: getAverageBidAmount(bids),
  };
};

/**
 * Format bid plans/description for display
 */
export const formatBidPlans = (plans: string, maxLength = 100): string => {
  const asciiPlans = hexToAscii(plans);
  if (asciiPlans.length <= maxLength) {
    return asciiPlans;
  }
  return asciiPlans.substring(0, maxLength) + '...';
};

/**
 * Check if bid was submitted recently (within 1 hour)
 */
export const isRecentBid = (bidTime: number): boolean => {
  const now = Math.floor(Date.now() / 1000);
  const hourAgo = now - 3600;
  return bidTime >= hourAgo;
};

/**
 * Get the count of real bids (filters out placeholder bids)
 * Placeholder bids have bidAmount=0 and timeOfBid=0
 */
export const getRealBidsCount = (contract: EscrowTX): number => {
  return contract.record.bids.filter(
    (bid) => bid.bidAmount > 0 && bid.timeOfBid > 0
  ).length;
};
