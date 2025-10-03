/**
 * ContractInfo Component
 * Displays detailed contract information
 */

import {
  Box,
  Typography,
  Divider,
  Paper,
  Alert,
  Grid,
} from '@mui/material';
import {
  Schedule,
  AttachMoney,
  Person,
  Warning,
} from '@mui/icons-material';
import type { EscrowTX } from '@/types/blockchain.types';
import { ContractStatusBadge } from './ContractStatusBadge';
import {
  formatSatoshis,
  formatDate,
  truncateAddress,
  formatPercentage,
  hexToAscii,
} from '@/utils/formatting';
import {
  isDeadlineApproaching,
  isDeadlinePassed,
} from '../../utils/contractHelpers';
import { getRealBidsCount } from '../../utils/bidHelpers';

interface ContractInfoProps {
  contract: EscrowTX;
}

export const ContractInfo: React.FC<ContractInfoProps> = ({ contract }) => {
  const deadline = contract.record.workCompletionDeadline;
  const deadlineApproaching = isDeadlineApproaching(deadline);
  const deadlinePassed = isDeadlinePassed(deadline);

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Contract Details</Typography>
        <ContractStatusBadge status={contract.record.status} size="medium" />
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Deadline Warning */}
      {deadlineApproaching && !deadlinePassed && (
        <Alert severity="warning" icon={<Warning />} sx={{ mb: 2 }}>
          Deadline is approaching! Less than 24 hours remaining.
        </Alert>
      )}

      {deadlinePassed && contract.record.status !== 'resolved' && (
        <Alert severity="error" icon={<Warning />} sx={{ mb: 2 }}>
          Deadline has passed!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Work Description */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Work Description
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {hexToAscii(contract.record.workDescription)}
          </Typography>
        </Grid>

        {/* Bounty Amount */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AttachMoney color="primary" />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Bounty Amount
              </Typography>
              <Typography variant="h6">
                {formatSatoshis(contract.satoshis)}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Deadline */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Schedule color={deadlineApproaching ? 'warning' : 'primary'} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Completion Deadline
              </Typography>
              <Typography
                variant="h6"
                color={deadlineApproaching ? 'warning.main' : 'inherit'}
              >
                {formatDate(deadline)}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Platform Key */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Person color="primary" />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Platform
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                {truncateAddress(contract.record.platformKey)}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Service Fee */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Service Fee
          </Typography>
          <Typography variant="body1">
            {formatPercentage(contract.record.escrowServiceFeeBasisPoints)}
          </Typography>
        </Grid>

        {/* Contract Type */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Contract Type
          </Typography>
          <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
            {contract.record.contractType}
          </Typography>
        </Grid>

        {/* Bids Count */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Total Bids
          </Typography>
          <Typography variant="body1">
            {getRealBidsCount(contract)}
          </Typography>
        </Grid>

        {/* Transaction Info */}
        <Grid size={{ xs: 12 }}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Transaction ID
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
            {contract.record.txid}
          </Typography>
        </Grid>

        {/* Work Completion (if submitted) */}
        {contract.record.workCompletionDescription && (
          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 2 }} />
            <Typography
              variant="subtitle2"
              color="text.secondary"
              gutterBottom
            >
              Work Completion Description
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {hexToAscii(contract.record.workCompletionDescription)}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};
