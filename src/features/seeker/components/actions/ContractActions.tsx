/**
 * ContractActions Component
 * Action buttons for contract management
 */

import { Box, Button, CircularProgress } from '@mui/material';
import {
  Check,
  Cancel,
  Flag,
  TrendingUp,
} from '@mui/icons-material';
import type { EscrowTX } from '@/types/blockchain.types';
import {
  canApproveWork,
  canRaiseDispute,
  canCancelContract,
  canIncreaseBounty,
} from '../../utils/contractHelpers';

interface ContractActionsProps {
  contract: EscrowTX;
  onApproveWork?: () => void;
  onRaiseDispute?: () => void;
  onCancelContract?: () => void;
  onIncreaseBounty?: () => void;
  isLoading?: boolean;
}

export const ContractActions: React.FC<ContractActionsProps> = ({
  contract,
  onApproveWork,
  onRaiseDispute,
  onCancelContract,
  onIncreaseBounty,
  isLoading,
}) => {
  const showApprove = canApproveWork(contract);
  const showDispute = canRaiseDispute(contract);
  const showCancel = canCancelContract(contract);
  const showIncrease = canIncreaseBounty(contract);

  if (!showApprove && !showDispute && !showCancel && !showIncrease) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      {showApprove && onApproveWork && (
        <Button
          variant="contained"
          color="success"
          startIcon={isLoading ? <CircularProgress size={20} /> : <Check />}
          onClick={onApproveWork}
          disabled={isLoading}
        >
          Approve Work
        </Button>
      )}

      {showDispute && onRaiseDispute && (
        <Button
          variant="outlined"
          color="error"
          startIcon={isLoading ? <CircularProgress size={20} /> : <Flag />}
          onClick={onRaiseDispute}
          disabled={isLoading}
        >
          Raise Dispute
        </Button>
      )}

      {showIncrease && onIncreaseBounty && (
        <Button
          variant="outlined"
          color="primary"
          startIcon={isLoading ? <CircularProgress size={20} /> : <TrendingUp />}
          onClick={onIncreaseBounty}
          disabled={isLoading}
        >
          Increase Bounty
        </Button>
      )}

      {showCancel && onCancelContract && (
        <Button
          variant="outlined"
          color="warning"
          startIcon={isLoading ? <CircularProgress size={20} /> : <Cancel />}
          onClick={onCancelContract}
          disabled={isLoading}
        >
          Cancel Contract
        </Button>
      )}
    </Box>
  );
};
