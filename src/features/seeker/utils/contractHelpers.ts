/**
 * Contract Helper Utilities
 */

import type { EscrowTX, ContractStatus } from '@/types/blockchain.types';
import type { ContractStats } from '../types';
import { hexToAscii } from '@/utils/formatting';
import { getRealBidsCount } from './bidHelpers';

/**
 * Check if contract can be cancelled
 */
export const canCancelContract = (contract: EscrowTX): boolean => {
  return contract.record.status === 'initial';
};

/**
 * Check if contract can accept bids
 */
export const canAcceptBid = (contract: EscrowTX): boolean => {
  return (
    contract.record.status === 'initial' && getRealBidsCount(contract) > 0
  );
};

/**
 * Check if work can be approved
 */
export const canApproveWork = (contract: EscrowTX): boolean => {
  return contract.record.status === 'work-submitted';
};

/**
 * Check if dispute can be raised
 */
export const canRaiseDispute = (contract: EscrowTX): boolean => {
  return (
    contract.record.status === 'work-submitted' ||
    contract.record.status === 'work-started'
  );
};

/**
 * Check if bounty can be increased
 */
export const canIncreaseBounty = (contract: EscrowTX): boolean => {
  // Check if bounty increase is allowed by global config
  const allowanceMode = contract.record.bountyIncreaseAllowanceMode;
  if (
    allowanceMode === 'forbidden' ||
    allowanceMode === 'by-platform'
  ) {
    return false;
  }

  // Check if we're before the cutoff point
  const cutoff = contract.record.bountyIncreaseCutoffPoint;
  const status = contract.record.status;

  switch (cutoff) {
    case 'bid-acceptance':
      return status === 'initial';
    case 'start-of-work':
      return status === 'initial' || status === 'bid-accepted';
    case 'submission-of-work':
      return (
        status === 'initial' ||
        status === 'bid-accepted' ||
        status === 'work-started'
      );
    case 'acceptance-of-work':
      return status !== 'resolved';
    default:
      return false;
  }
};

/**
 * Get available actions for a contract
 */
export const getAvailableActions = (contract: EscrowTX): string[] => {
  const actions: string[] = [];

  if (canAcceptBid(contract)) {
    actions.push('accept-bid');
  }

  if (canApproveWork(contract)) {
    actions.push('approve-work');
  }

  if (canRaiseDispute(contract)) {
    actions.push('raise-dispute');
  }

  if (canCancelContract(contract)) {
    actions.push('cancel-contract');
  }

  if (canIncreaseBounty(contract)) {
    actions.push('increase-bounty');
  }

  // View details is always available
  actions.push('view-details');

  return actions;
};

/**
 * Calculate contract statistics
 */
export const calculateStats = (contracts: EscrowTX[]): ContractStats => {
  const stats: ContractStats = {
    totalContracts: contracts.length,
    openContracts: 0,
    activeContracts: 0,
    completedContracts: 0,
    disputedContracts: 0,
    totalBountyLocked: 0,
  };

  contracts.forEach((contract) => {
    const status = contract.record.status;

    // Count by status
    if (status === 'initial') {
      stats.openContracts++;
    } else if (
      status === 'bid-accepted' ||
      status === 'work-started' ||
      status === 'work-submitted'
    ) {
      stats.activeContracts++;
    } else if (status === 'resolved') {
      stats.completedContracts++;
    } else if (
      status === 'disputed-by-seeker' ||
      status === 'disputed-by-furnisher'
    ) {
      stats.disputedContracts++;
    }

    // Sum bounty locked (exclude completed contracts)
    if (status !== 'resolved') {
      stats.totalBountyLocked += contract.satoshis;
    }
  });

  return stats;
};

/**
 * Filter contracts by status
 */
export const filterByStatus = (
  contracts: EscrowTX[],
  status: ContractStatus | 'all'
): EscrowTX[] => {
  if (status === 'all') {
    return contracts;
  }
  return contracts.filter((contract) => contract.record.status === status);
};

/**
 * Filter contracts by search query (searches description)
 */
export const filterBySearch = (
  contracts: EscrowTX[],
  query: string
): EscrowTX[] => {
  if (!query.trim()) {
    return contracts;
  }

  const lowerQuery = query.toLowerCase();
  return contracts.filter((contract) =>
    hexToAscii(contract.record.workDescription).toLowerCase().includes(lowerQuery)
  );
};

/**
 * Sort contracts
 */
export const sortContracts = (
  contracts: EscrowTX[],
  sortBy: 'newest' | 'oldest' | 'bounty-high' | 'bounty-low' | 'deadline'
): EscrowTX[] => {
  const sorted = [...contracts];

  switch (sortBy) {
    case 'newest':
      return sorted.sort(
        (a, b) =>
          (b.record.bids[0]?.timeOfBid || 0) -
          (a.record.bids[0]?.timeOfBid || 0)
      );

    case 'oldest':
      return sorted.sort(
        (a, b) =>
          (a.record.bids[0]?.timeOfBid || 0) -
          (b.record.bids[0]?.timeOfBid || 0)
      );

    case 'bounty-high':
      return sorted.sort((a, b) => b.satoshis - a.satoshis);

    case 'bounty-low':
      return sorted.sort((a, b) => a.satoshis - b.satoshis);

    case 'deadline':
      return sorted.sort(
        (a, b) =>
          a.record.workCompletionDeadline - b.record.workCompletionDeadline
      );

    default:
      return sorted;
  }
};

/**
 * Check if deadline is approaching (within 24 hours)
 */
export const isDeadlineApproaching = (deadline: number): boolean => {
  const now = Math.floor(Date.now() / 1000);
  const hoursRemaining = (deadline - now) / 3600;
  return hoursRemaining > 0 && hoursRemaining <= 24;
};

/**
 * Check if deadline has passed
 */
export const isDeadlinePassed = (deadline: number): boolean => {
  const now = Math.floor(Date.now() / 1000);
  return deadline < now;
};

/**
 * Get time remaining until deadline
 */
export const getTimeRemaining = (deadline: number): number => {
  const now = Math.floor(Date.now() / 1000);
  return Math.max(0, deadline - now);
};
