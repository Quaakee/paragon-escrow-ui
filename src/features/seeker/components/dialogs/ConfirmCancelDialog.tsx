/**
 * ConfirmCancelDialog Component
 * Confirmation dialog for cancelling a contract
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
import { formatSatoshis, hexToAscii, extractContractTitle } from '@/utils/formatting';

interface ConfirmCancelDialogProps {
  open: boolean;
  contract: EscrowTX | null;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ConfirmCancelDialog: React.FC<ConfirmCancelDialogProps> = ({
  open,
  contract,
  onConfirm,
  onCancel,
  isLoading,
}) => {
  if (!contract) return null;

  const contractTitle = extractContractTitle(contract.record.workDescription, 100);

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Cancel Contract</DialogTitle>

      <DialogContent>
        <Alert severity="warning" icon={<Warning />} sx={{ mb: 3 }}>
          This action will cancel the contract and return the bounty to you.
          This can only be done before accepting any bids.
        </Alert>

        <Typography variant="body1" gutterBottom>
          Are you sure you want to cancel this contract?
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Contract Title:
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {contractTitle}
            </Typography>
          </Box>

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
              Status:
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {contract.record.status}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="caption" color="text.secondary" display="block">
            By cancelling, you confirm that:
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ ml: 2, mt: 1 }}
          >
            • No bids have been accepted yet
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ ml: 2 }}
          >
            • The contract will be removed from the marketplace
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ ml: 2 }}
          >
            • The bounty will be returned to your wallet
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} disabled={isLoading}>
          Keep Contract
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="warning"
          disabled={isLoading}
        >
          {isLoading ? 'Cancelling...' : 'Cancel Contract'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
