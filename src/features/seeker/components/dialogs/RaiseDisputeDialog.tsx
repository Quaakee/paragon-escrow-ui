/**
 * RaiseDisputeDialog Component
 * Dialog for raising a dispute
 */

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  TextField,
  Box,
} from '@mui/material';
import { Warning } from '@mui/icons-material';
import type { EscrowTX } from '@/types/blockchain.types';
import { extractContractTitle } from '@/utils/formatting';

interface RaiseDisputeDialogProps {
  open: boolean;
  contract: EscrowTX | null;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const RaiseDisputeDialog: React.FC<RaiseDisputeDialogProps> = ({
  open,
  contract,
  onConfirm,
  onCancel,
  isLoading,
}) => {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    onConfirm(reason);
    setReason(''); // Reset after confirm
  };

  const handleCancel = () => {
    setReason(''); // Reset on cancel
    onCancel();
  };

  if (!contract) return null;

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Raise Dispute</DialogTitle>

      <DialogContent>
        <Alert severity="warning" icon={<Warning />} sx={{ mb: 3 }}>
          Raising a dispute will escalate this contract to the platform for
          resolution. Please provide a clear explanation of the issue.
        </Alert>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Contract: {extractContractTitle(contract.record.workDescription, 100)}
        </Typography>

        <Box sx={{ mt: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Dispute Reason"
            placeholder="Explain why you're disputing this work. Include specific details about what doesn't meet the requirements."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            helperText={`${reason.length}/1000 characters`}
            inputProps={{ maxLength: 1000 }}
          />
        </Box>

        <Alert severity="info" sx={{ mt: 3 }}>
          The platform will review the dispute and make a decision. Both parties
          may be contacted for additional information.
        </Alert>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          disabled={isLoading || reason.trim().length < 10}
        >
          {isLoading ? 'Raising Dispute...' : 'Raise Dispute'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
