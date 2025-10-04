/**
 * AvailableWorkCard Component
 * Displays available work contract in card format
 */

import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Button,
  Tooltip,
} from '@mui/material';
import {
  Schedule,
  AttachMoney,
  Gavel,
  Info,
  Warning,
} from '@mui/icons-material';
import type { EscrowTX } from '@/types/blockchain.types';
import { ContractStatusBadge } from '@/features/seeker/components/contracts/ContractStatusBadge';
import { formatSatoshis, formatDate, extractContractTitle, extractContractDescription } from '@/utils/formatting';
import { isDeadlineApproaching, isDeadlinePassed } from '@/features/seeker/utils/contractHelpers';
import { getRealBidsCount } from '@/features/seeker/utils/bidHelpers';

interface AvailableWorkCardProps {
  contract: EscrowTX;
  onPlaceBid: () => void;
  onViewDetails?: () => void;
}

export const AvailableWorkCard: React.FC<AvailableWorkCardProps> = ({
  contract,
  onPlaceBid,
  onViewDetails,
}) => {
  const deadline = contract.record.workCompletionDeadline;
  const deadlineApproaching = isDeadlineApproaching(deadline);
  const deadlinePassed = isDeadlinePassed(deadline);
  const bidsCount = getRealBidsCount(contract);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        border: deadlineApproaching ? '2px solid' : '1px solid',
        borderColor: deadlineApproaching ? 'warning.main' : 'divider',
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-2px)',
          transition: 'all 0.2s',
        },
      }}
    >
      {deadlinePassed && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
          }}
        >
          <Tooltip title="Deadline passed">
            <Warning color="error" />
          </Tooltip>
        </Box>
      )}

      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, gap: 1 }}>
          <ContractStatusBadge status={contract.record.status} />
          {bidsCount > 0 && (
            <Chip
              icon={<Gavel />}
              label={`${bidsCount} bid${bidsCount !== 1 ? 's' : ''}`}
              size="small"
              variant="outlined"
              color="primary"
            />
          )}
        </Box>

        <Typography
          variant="h6"
          gutterBottom
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {extractContractTitle(contract.record.workDescription)}
        </Typography>

        {extractContractDescription(contract.record.workDescription, 150) && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              mb: 2,
            }}
          >
            {extractContractDescription(contract.record.workDescription, 150)}
          </Typography>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AttachMoney fontSize="small" color="success" />
            <Typography variant="body2" fontWeight="bold" color="success.main">
              {formatSatoshis(contract.satoshis)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Schedule
              fontSize="small"
              color={deadlineApproaching ? 'warning' : 'action'}
            />
            <Typography
              variant="body2"
              color={deadlineApproaching ? 'warning.main' : 'text.secondary'}
            >
              Deadline: {formatDate(deadline, false)}
            </Typography>
          </Box>

          {contract.record.minAllowableBid > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Info fontSize="small" color="info" />
              <Typography variant="caption" color="text.secondary">
                Min bid: {formatSatoshis(contract.record.minAllowableBid)}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button
          variant="contained"
          size="small"
          onClick={onPlaceBid}
          disabled={deadlinePassed}
        >
          Place Bid
        </Button>
        {onViewDetails && (
          <Button size="small" variant="outlined" onClick={onViewDetails}>
            Details
          </Button>
        )}
      </CardActions>
    </Card>
  );
};
