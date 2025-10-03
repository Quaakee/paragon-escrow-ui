/**
 * ContractCard Component
 * Displays contract summary in card format
 */

import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Schedule,
  AttachMoney,
  Gavel,
  MoreVert,
  Warning,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { EscrowTX } from '@/types/blockchain.types';
import { ContractStatusBadge } from './ContractStatusBadge';
import { formatSatoshis, formatDate, extractContractTitle, extractContractDescription } from '@/utils/formatting';
import {
  isDeadlineApproaching,
  isDeadlinePassed,
} from '../../utils/contractHelpers';
import { getRealBidsCount } from '../../utils/bidHelpers';

interface ContractCardProps {
  contract: EscrowTX;
  onAction?: (action: string) => void;
}

export const ContractCard: React.FC<ContractCardProps> = ({
  contract,
  onAction,
}) => {
  const navigate = useNavigate();
  const deadline = contract.record.workCompletionDeadline;
  const deadlineApproaching = isDeadlineApproaching(deadline);
  const deadlinePassed = isDeadlinePassed(deadline);

  const handleViewDetails = () => {
    navigate(
      `/seeker/contracts/${contract.record.txid}/${contract.record.outputIndex}`
    );
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        border: deadlineApproaching ? '2px solid' : '1px solid',
        borderColor: deadlineApproaching ? 'warning.main' : 'divider',
      }}
    >
      {deadlinePassed && contract.record.status !== 'resolved' && (
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <ContractStatusBadge status={contract.record.status} />
          {getRealBidsCount(contract) > 0 && (
            <Chip
              icon={<Gavel />}
              label={`${getRealBidsCount(contract)} bid${
                getRealBidsCount(contract) !== 1 ? 's' : ''
              }`}
              size="small"
              variant="outlined"
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

        {extractContractDescription(contract.record.workDescription, 200) && (
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
            {extractContractDescription(contract.record.workDescription, 200)}
          </Typography>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AttachMoney fontSize="small" color="primary" />
            <Typography variant="body2" fontWeight="medium">
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
              {formatDate(deadline, false)}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button size="small" onClick={handleViewDetails}>
          View Details
        </Button>
        {onAction && (
          <IconButton size="small" onClick={() => onAction('menu')}>
            <MoreVert />
          </IconButton>
        )}
      </CardActions>
    </Card>
  );
};
