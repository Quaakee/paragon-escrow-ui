/**
 * ConfirmApprovalDialog Component
 * Confirmation dialog for approving work
 */

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Box,
  Divider,
} from '@mui/material';
import { Warning } from '@mui/icons-material';
import type { EscrowTX } from '@/types/blockchain.types';
import { formatSatoshis } from '@/utils/formatting';

interface ConfirmApprovalDialogProps {
  open: boolean;
  contract: EscrowTX | null;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ConfirmApprovalDialog: React.FC<ConfirmApprovalDialogProps> = ({
  open,
  contract,
  onConfirm,
  onCancel,
  isLoading,
}) => {
  if (!contract) return null;

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Confirm Work Approval</DialogTitle>

      <DialogContent>
        <Alert severity="warning" icon={<Warning />} sx={{ mb: 3 }}>
          This action cannot be undone. The bounty will be released to the
          furnisher immediately.
        </Alert>

        <Typography variant="body1" gutterBottom>
          Are you sure you want to approve the submitted work?
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Bounty Amount:
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {formatSatoshis(contract.satoshis)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Furnisher:
            </Typography>
            <Typography
              variant="body2"
              fontWeight="medium"
              sx={{ fontFamily: 'monospace' }}
            >
              {contract.record.acceptedBid?.furnisherKey.substring(0, 16)}...
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="caption" color="text.secondary" display="block">
            By approving, you confirm that:
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ ml: 2, mt: 1 }}
          >
            • The work meets the requirements
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ ml: 2 }}
          >
            • You authorize the release of the bounty
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ ml: 2 }}
          >
            • This action is final and irreversible
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="success"
          disabled={isLoading}
        >
          {isLoading ? 'Approving...' : 'Approve Work'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
