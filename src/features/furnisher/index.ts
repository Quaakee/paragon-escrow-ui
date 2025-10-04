/**
 * Furnisher Feature Exports
 */

// Pages
export { FurnisherDashboard } from './pages/FurnisherDashboard';

// Hooks
export { useAvailableWork } from './hooks/useAvailableWork';
export { usePlaceBid } from './hooks/usePlaceBid';
export { useWorkFilters } from './hooks/useWorkFilters';

// Components
export { AvailableWorkCard } from './components/work/AvailableWorkCard';
export { PlaceBidForm } from './components/forms/PlaceBidForm';
export { PlaceBidDialog } from './components/dialogs/PlaceBidDialog';
export { WorkFilters } from './components/filters/WorkFilters';

// Types
export type {
  PlaceBidFormData,
  WorkFilters as FurnisherWorkFilters,
  WorkStats,
  WorkWithMetadata,
  FurnisherAction,
  FurnisherActionPayload,
  DashboardView as FurnisherDashboardView,
} from './types';

// Constants
export {
  DEFAULT_BID_AMOUNT,
  DEFAULT_TIME_REQUIRED,
  MIN_BID_AMOUNT,
  MIN_TIME_REQUIRED,
  SECONDS_PER_HOUR,
  SECONDS_PER_DAY,
  SECONDS_PER_WEEK,
} from './constants';
