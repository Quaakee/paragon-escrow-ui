/**
 * BidsList Component
 * Displays list of bids for a contract
 */

import { useState } from 'react';
import {
  Box,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { Inbox } from '@mui/icons-material';
import type { EscrowTX } from '@/types/blockchain.types';
import { BidCard } from './BidCard';
import { enrichBidsWithMetadata, sortBids } from '../../utils/bidHelpers';

interface BidsListProps {
  contract: EscrowTX;
  onAcceptBid?: (bidIndex: number) => void;
  canAcceptBids?: boolean;
}

export const BidsList: React.FC<BidsListProps> = ({
  contract,
  onAcceptBid,
  canAcceptBids,
}) => {
  const [sortBy, setSortBy] = useState<
    'newest' | 'oldest' | 'amount-low' | 'amount-high' | 'time-required'
  >('newest');

  const enrichedBids = enrichBidsWithMetadata(contract);
  const sortedBids = sortBids(enrichedBids, sortBy);

  // Show "No bids yet" when there are no real bids (only placeholder slots)
  if (enrichedBids.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 6,
          gap: 2,
        }}
      >
        <Inbox sx={{ fontSize: 48, color: 'text.secondary' }} />
        <Typography variant="h6" color="text.secondary">
          No bids yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Furnishers will submit bids for this work
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h6">
          Bids ({enrichedBids.length})
        </Typography>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) =>
              setSortBy(
                e.target.value as
                  | 'newest'
                  | 'oldest'
                  | 'amount-low'
                  | 'amount-high'
                  | 'time-required'
              )
            }
          >
            <MenuItem value="newest">Newest First</MenuItem>
            <MenuItem value="oldest">Oldest First</MenuItem>
            <MenuItem value="amount-low">Lowest Amount</MenuItem>
            <MenuItem value="amount-high">Highest Amount</MenuItem>
            <MenuItem value="time-required">Time Required</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {contract.record.status !== 'initial' &&
        contract.record.status !== 'bid-accepted' && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Bid acceptance period has ended. Current status:{' '}
            {contract.record.status}
          </Alert>
        )}

      <Grid container spacing={3}>
        {sortedBids.map((bid) => (
          <Grid key={`bid-${bid.index}`} size={{ xs: 12, md: 6, lg: 4 }}>
            <BidCard
              bid={bid}
              onAccept={onAcceptBid}
              canAccept={canAcceptBids && !bid.isAccepted}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
