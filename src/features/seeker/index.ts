/**
 * Seeker Feature Exports
 * Central export point for all seeker-related components and utilities
 */

// Pages
export { SeekerDashboard } from './pages/SeekerDashboard';
export { CreateWorkPage } from './pages/CreateWorkPage';
export { ContractDetailsPage } from './pages/ContractDetailsPage';

// Components - Forms
export { CreateWorkForm } from './components/forms/CreateWorkForm';

// Components - Contracts
export { ContractCard } from './components/contracts/ContractCard';
export { ContractsList } from './components/contracts/ContractsList';
export { ContractInfo } from './components/contracts/ContractInfo';
export { ContractStatusBadge } from './components/contracts/ContractStatusBadge';

// Components - Bids
export { BidCard } from './components/bids/BidCard';
export { BidsList } from './components/bids/BidsList';

// Components - Work
export { WorkSubmissionView } from './components/work/WorkSubmissionView';

// Components - Actions & Dialogs
export { ContractActions } from './components/actions/ContractActions';
export { ConfirmApprovalDialog } from './components/dialogs/ConfirmApprovalDialog';
export { RaiseDisputeDialog } from './components/dialogs/RaiseDisputeDialog';

// Components - Dashboard
export { DashboardStats } from './components/dashboard/DashboardStats';
export { QuickActions } from './components/dashboard/QuickActions';

// Components - Filters
export { ContractFilters } from './components/filters/ContractFilters';

// Hooks
export { useCreateWork } from './hooks/useCreateWork';
export { useContractFilters } from './hooks/useContractFilters';
export {
  useAcceptBid,
  useApproveWork,
  useRaiseDispute,
  useCancelContract,
  useIncreaseBounty,
} from './hooks/useContractActions';

// Types
export type {
  CreateWorkFormData,
  ContractFilters as ContractFiltersType,
  ContractStats,
  BidWithMetadata,
  ContractAction,
  ContractActionPayload,
  DashboardView,
  SortDirection,
} from './types';

// Constants
export {
  DEFAULT_FILTERS,
  MIN_BOUNTY,
  MAX_BOUNTY,
  DEFAULT_BOUNTY,
  STATUS_LABELS,
  ACTION_LABELS,
  TOAST_MESSAGES,
  ERROR_MESSAGES,
} from './constants';

// Utils
export {
  canCancelContract,
  canAcceptBid,
  canApproveWork,
  canRaiseDispute,
  canIncreaseBounty,
  getAvailableActions,
  calculateStats,
  filterByStatus,
  filterBySearch,
  sortContracts,
  isDeadlineApproaching,
  isDeadlinePassed,
  getTimeRemaining,
} from './utils/contractHelpers';

export {
  enrichBidsWithMetadata,
  getAcceptedBid,
  sortBids,
  getLowestBid,
  getHighestBid,
  getAverageBidAmount,
  getBidStatistics,
  validateBid,
  formatBidPlans,
  isRecentBid,
} from './utils/bidHelpers';
