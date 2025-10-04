/**
 * ContractTypeBadge Component
 * Displays badge for contract type (BID vs BOUNTY)
 */

import { Chip } from '@mui/material';
import { Gavel, EmojiEvents } from '@mui/icons-material';

interface ContractTypeBadgeProps {
  contractType: 'bid' | 'bounty';
  size?: 'small' | 'medium';
}

export const ContractTypeBadge: React.FC<ContractTypeBadgeProps> = ({
  contractType,
  size = 'small',
}) => {
  const isBounty = contractType === 'bounty';

  return (
    <Chip
      icon={isBounty ? <EmojiEvents /> : <Gavel />}
      label={isBounty ? 'BOUNTY' : 'BID'}
      size={size}
      color={isBounty ? 'success' : 'info'}
      variant="filled"
      sx={{
        fontWeight: 'bold',
        letterSpacing: '0.5px',
      }}
    />
  );
};
