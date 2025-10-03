/**
 * ContractsList Component
 * Displays list/grid of contracts with filtering and sorting
 */

import { Box, Typography, Alert, Grid } from '@mui/material';
import { Inbox } from '@mui/icons-material';
import type { EscrowTX } from '@/types/blockchain.types';
import { ContractCard } from './ContractCard';
import type { DashboardView } from '../../types';

interface ContractsListProps {
  contracts: EscrowTX[];
  view?: DashboardView;
  onContractAction?: (contract: EscrowTX, action: string) => void;
  isLoading?: boolean;
  error?: Error | null;
}

export const ContractsList: React.FC<ContractsListProps> = ({
  contracts,
  view = 'grid',
  onContractAction,
  isLoading,
  error,
}) => {
  if (error) {
    return (
      <Alert severity="error">
        {error instanceof Error ? error.message : 'Failed to load contracts'}
      </Alert>
    );
  }

  if (!isLoading && contracts.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          gap: 2,
        }}
      >
        <Inbox sx={{ fontSize: 64, color: 'text.secondary' }} />
        <Typography variant="h6" color="text.secondary">
          No contracts found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create your first work contract to get started
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {contracts.map((contract) => (
        <Grid
          key={`${contract.record.txid}-${contract.record.outputIndex}`}
          size={{ xs: 12, sm: view === 'grid' ? 6 : 12, lg: view === 'grid' ? 4 : 12 }}
        >
          <ContractCard
            contract={contract}
            onAction={
              onContractAction
                ? (action) => onContractAction(contract, action)
                : undefined
            }
          />
        </Grid>
      ))}
    </Grid>
  );
};
