/**
 * ContractStatusBadge Component
 * Displays contract status with appropriate styling
 */

import { Chip } from '@mui/material';
import type { ContractStatus } from '@/types/blockchain.types';
import { formatStatus, getStatusColor } from '@/utils/formatting';

interface ContractStatusBadgeProps {
  status: ContractStatus;
  size?: 'small' | 'medium';
}

export const ContractStatusBadge: React.FC<ContractStatusBadgeProps> = ({
  status,
  size = 'small',
}) => {
  return (
    <Chip
      label={formatStatus(status)}
      color={getStatusColor(status)}
      size={size}
      sx={{ fontWeight: 'medium' }}
    />
  );
};
