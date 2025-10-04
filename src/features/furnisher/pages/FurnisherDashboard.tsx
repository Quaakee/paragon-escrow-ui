/**
 * FurnisherDashboard Page
 * Main dashboard for furnishers to browse and bid on work
 */

import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Alert,
  Button,
  Paper,
} from '@mui/material';
import { Refresh, FilterList } from '@mui/icons-material';
import { useAvailableWork } from '../hooks/useAvailableWork';
import { useWorkFilters } from '../hooks/useWorkFilters';
import { AvailableWorkCard } from '../components/work/AvailableWorkCard';
import { WorkFilters } from '../components/filters/WorkFilters';
import { PlaceBidDialog } from '../components/dialogs/PlaceBidDialog';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import type { EscrowTX } from '@/types/blockchain.types';

export const FurnisherDashboard: React.FC = () => {
  const { data: contracts, isLoading, isError, error, refetch } = useAvailableWork();
  const { filters, filteredContracts, updateFilters, resetFilters } = useWorkFilters(contracts);
  const [selectedContract, setSelectedContract] = useState<EscrowTX | null>(null);
  const [showFilters, setShowFilters] = useState(true);

  const handlePlaceBid = (contract: EscrowTX) => {
    setSelectedContract(contract);
  };

  const handleCloseDialog = () => {
    setSelectedContract(null);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading available work..." />;
  }

  if (isError) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          {error instanceof Error ? error.message : 'Failed to load available work'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            Available Work
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => refetch()}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {/* Stats */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="caption" color="text.secondary">
                Total Available
              </Typography>
              <Typography variant="h6">
                {contracts?.length || 0}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="caption" color="text.secondary">
                Filtered Results
              </Typography>
              <Typography variant="h6">
                {filteredContracts.length}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="caption" color="text.secondary">
                No Bids Yet
              </Typography>
              <Typography variant="h6">
                {contracts?.filter(c => !c.record.bids || c.record.bids.length === 0).length || 0}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="caption" color="text.secondary">
                Active Filters
              </Typography>
              <Typography variant="h6">
                {(filters.searchQuery ? 1 : 0) +
                 (filters.showOnlyNoBids ? 1 : 0) +
                 (filters.minBounty > 0 ? 1 : 0)}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Filters */}
      {showFilters && (
        <WorkFilters filters={filters} onFiltersChange={updateFilters} />
      )}

      {/* Work List */}
      {filteredContracts.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No work available
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {contracts?.length === 0
              ? 'There are no open work contracts at the moment. Check back later!'
              : 'No work matches your filters. Try adjusting your search criteria.'}
          </Typography>
          {filters.searchQuery || filters.showOnlyNoBids || filters.minBounty > 0 ? (
            <Button variant="outlined" onClick={resetFilters}>
              Clear Filters
            </Button>
          ) : null}
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredContracts.map((contract) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={`${contract.record.txid}-${contract.record.outputIndex}`}>
              <AvailableWorkCard
                contract={contract}
                onPlaceBid={() => handlePlaceBid(contract)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Place Bid Dialog */}
      <PlaceBidDialog
        open={!!selectedContract}
        contract={selectedContract}
        onClose={handleCloseDialog}
      />
    </Container>
  );
};
