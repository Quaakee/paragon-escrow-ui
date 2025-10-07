/**
 * BidCard Component
 * Displays individual bid details
 */

import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Button,
} from '@mui/material';
import {
  AttachMoney,
  Schedule,
  CheckCircle,
  Person,
} from '@mui/icons-material';
import type { BidWithMetadata } from '../../types';
import { formatSatoshis, formatDate, truncateAddress, hexToAscii } from '@/utils/formatting';
import { isRecentBid } from '../../utils/bidHelpers';

interface BidCardProps {
  bid: BidWithMetadata;
  onAccept?: (bidIndex: number) => void;
  canAccept?: boolean;
}

export const BidCard: React.FC<BidCardProps> = ({
  bid,
  onAccept,
  canAccept,
}) => {
  const isRecent = isRecentBid(bid.timeOfBid);

  return (
    <Card
      variant={bid.isAccepted ? 'elevation' : 'outlined'}
      sx={{
        border: bid.isAccepted ? '2px solid' : undefined,
        borderColor: bid.isAccepted ? 'success.main' : undefined,
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {bid.isAccepted && (
              <Chip
                icon={<CheckCircle />}
                label="Accepted"
                color="success"
                size="small"
              />
            )}
            {isRecent && !bid.isAccepted && (
              <Chip label="New" color="info" size="small" />
            )}
          </Box>
          <Typography variant="caption" color="text.secondary">
            Bid #{bid.index + 1}
          </Typography>
        </Box>

        {/* Furnisher */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Person fontSize="small" color="action" />
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
            {truncateAddress(bid.furnisherKey)}
          </Typography>
        </Box>

        {/* Bid Amount */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <AttachMoney fontSize="small" color="primary" />
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Bid Amount
            </Typography>
            <Typography variant="h6">
              {formatSatoshis(bid.bidAmount)}
            </Typography>
          </Box>
        </Box>

        {/* Bond (if any) */}
        {bid.bond > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <AttachMoney fontSize="small" color="secondary" />
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Bond Amount
              </Typography>
              <Typography variant="body1">
                {formatSatoshis(bid.bond)}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Time Required */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Schedule fontSize="small" color="action" />
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Estimated Time
            </Typography>
            <Typography variant="body2">
              {Math.floor((bid.timeRequired - bid.timeOfBid) / 3600)} hours
            </Typography>
          </Box>
        </Box>

        {/* Bid Plans/Description */}
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Proposal
        </Typography>
        <Typography
          variant="body2"
          sx={{
            whiteSpace: 'pre-wrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {hexToAscii(bid.plans)}
        </Typography>

        {/* Time of Bid */}
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
          Submitted {formatDate(bid.timeOfBid)}
        </Typography>
      </CardContent>

      {canAccept && !bid.isAccepted && onAccept && (
        <CardActions sx={{ px: 2, pb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => onAccept(bid.index)}
          >
            Accept This Bid
          </Button>
        </CardActions>
      )}
    </Card>
  );
};
