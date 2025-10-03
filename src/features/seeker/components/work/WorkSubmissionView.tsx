/**
 * WorkSubmissionView Component
 * Displays submitted work for review
 */

import { Box, Typography, Paper, Alert, Divider } from '@mui/material';
import { CheckCircle, Schedule } from '@mui/icons-material';
import type { EscrowTX } from '@/types/blockchain.types';
import { formatDate, hexToAscii } from '@/utils/formatting';

interface WorkSubmissionViewProps {
  contract: EscrowTX;
}

export const WorkSubmissionView: React.FC<WorkSubmissionViewProps> = ({
  contract,
}) => {
  if (contract.record.status !== 'work-submitted') {
    return (
      <Alert severity="info">
        Work has not been submitted yet. Current status:{' '}
        {contract.record.status}
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <CheckCircle color="success" />
        <Typography variant="h6">Work Submitted</Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Submission Time */}
      {contract.record.workCompletionTime && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Schedule fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            Submitted on {formatDate(contract.record.workCompletionTime)}
          </Typography>
        </Box>
      )}

      {/* Work Completion Description */}
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Completion Description
      </Typography>
      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 3 }}>
        {contract.record.workCompletionDescription
          ? hexToAscii(contract.record.workCompletionDescription)
          : 'No completion description provided'}
      </Typography>

      {/* Review Instructions */}
      <Alert severity="warning">
        Please carefully review the submitted work before approving. Once
        approved, the bounty will be released to the furnisher and cannot be
        recovered.
      </Alert>
    </Paper>
  );
};
