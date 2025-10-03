/**
 * WalletConnect Component - Button to connect/disconnect wallet
 * Shows connection status and handles wallet interactions
 */

import React from 'react';
import { Button, CircularProgress, Tooltip, Box, Typography } from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  CheckCircle as ConnectedIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useWallet } from '@/hooks/useWallet';

export const WalletConnect: React.FC = () => {
  const {
    isConnected,
    isConnecting,
    publicKey,
    network,
    error,
    connect,
    disconnect,
    clearError,
  } = useWallet();

  const handleClick = async () => {
    if (isConnected) {
      disconnect();
    } else {
      clearError();
      try {
        await connect();
      } catch (err) {
        // Error is already handled in the hook
      }
    }
  };

  const truncateKey = (key: string | null): string => {
    if (!key) return '';
    return `${key.slice(0, 6)}...${key.slice(-4)}`;
  };

  if (isConnecting) {
    return (
      <Button
        variant="outlined"
        disabled
        startIcon={<CircularProgress size={20} />}
      >
        Connecting...
      </Button>
    );
  }

  if (error) {
    return (
      <Tooltip title={error}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<ErrorIcon />}
          onClick={handleClick}
        >
          Connection Failed
        </Button>
      </Tooltip>
    );
  }

  if (isConnected) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
        <Tooltip title={`Connected to ${network || 'Unknown'} network`}>
          <Button
            variant="contained"
            color="success"
            startIcon={<ConnectedIcon />}
            onClick={handleClick}
            sx={{ minWidth: 180 }}
          >
            {truncateKey(publicKey)}
          </Button>
        </Tooltip>
        {network && (
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
            {network}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<WalletIcon />}
      onClick={handleClick}
      sx={{ minWidth: 180 }}
    >
      Connect Wallet
    </Button>
  );
};
