/**
 * SeekerDashboard Page
 * Main dashboard for seekers to view and manage contracts
 */

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Container,
} from '@mui/material';
import { Add, Refresh } from '@mui/icons-material';
import { seekerService } from '@/services/blockchain/SeekerService';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { QuickActions } from '../components/dashboard/QuickActions';
import { ContractFilters } from '../components/filters/ContractFilters';
import { ContractsList } from '../components/contracts/ContractsList';
import { useContractFilters } from '../hooks/useContractFilters';
import { calculateStats } from '../utils/contractHelpers';
import { QUERY_STALE_TIME, QUERY_CACHE_TIME } from '../constants';
import type { ContractStatus } from '@/types/blockchain.types';

export const SeekerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Fetch contracts from overlay network
  const {
    data: contracts = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['seeker', 'contracts'],
    queryFn: () => seekerService.getMyContracts(),
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_CACHE_TIME,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Filtering and sorting
  const {
    filters,
    filteredContracts,
    updateFilter,
    resetFilters,
    hasActiveFilters,
  } = useContractFilters(contracts);

  // Apply URL filter if present
  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam) {
      updateFilter('status', filterParam as ContractStatus | 'all');
    }
  }, [searchParams]);

  // Calculate statistics
  const stats = calculateStats(contracts);

  const handleCreateWork = () => {
    navigate('/seeker/create-work');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Seeker Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => refetch()}
            disabled={isLoading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateWork}
          >
            Create Work
          </Button>
        </Box>
      </Box>

      {/* Statistics */}
      <Box sx={{ mb: 4 }}>
        <DashboardStats stats={stats} />
      </Box>

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <QuickActions onCreateWork={handleCreateWork} />
      </Box>

      {/* Contracts Section */}
      <Box>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          My Contracts
        </Typography>

        {/* Filters */}
        <ContractFilters
          filters={filters}
          onFilterChange={updateFilter}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Loading State */}
        {isLoading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              py: 8,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error instanceof Error
              ? error.message
              : 'Failed to load contracts'}
          </Alert>
        )}

        {/* Contracts List */}
        {!isLoading && (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Showing {filteredContracts.length} of {contracts.length} contracts
            </Typography>
            <ContractsList contracts={filteredContracts} view="grid" />
          </>
        )}
      </Box>
    </Container>
  );
};
