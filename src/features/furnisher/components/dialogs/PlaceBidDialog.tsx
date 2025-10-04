/**
 * PlaceBidDialog Component
 * Dialog wrapper for placing bids
 */

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import type { EscrowTX } from '@/types/blockchain.types';
import { PlaceBidForm } from '../forms/PlaceBidForm';
import { extractContractTitle } from '@/utils/formatting';

interface PlaceBidDialogProps {
  open: boolean;
  contract: EscrowTX | null;
  onClose: () => void;
}

export const PlaceBidDialog: React.FC<PlaceBidDialogProps> = ({
  open,
  contract,
  onClose,
}) => {
  if (!contract) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6">Place Bid</Typography>
            <Typography variant="caption" color="text.secondary">
              {extractContractTitle(contract.record.workDescription)}
            </Typography>
          </Box>
          <IconButton edge="end" onClick={onClose} aria-label="close">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <PlaceBidForm
          contract={contract}
          onSuccess={onClose}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
