/**
 * Header Component - App header with logo, title, and wallet connection
 * Displays network indicator and user role
 */

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Chip,
  Container,
} from '@mui/material';
import {
  AccountBalance as EscrowIcon,
  Person as SeekerIcon,
  Build as FurnisherIcon,
  Gavel as PlatformIcon,
} from '@mui/icons-material';
import { WalletConnect } from '@/components/wallet/WalletConnect';
import { useUserStore } from '@/stores/useUserStore';
import { useWallet } from '@/hooks/useWallet';

export const Header: React.FC = () => {
  const { role } = useUserStore();
  const { network } = useWallet();

  const getRoleIcon = () => {
    switch (role) {
      case 'seeker':
        return <SeekerIcon fontSize="small" />;
      case 'furnisher':
        return <FurnisherIcon fontSize="small" />;
      case 'platform':
        return <PlatformIcon fontSize="small" />;
      default:
        return null;
    }
  };

  const getRoleLabel = () => {
    if (!role) return null;
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <AppBar position="static" elevation={2}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo and Title */}
          <EscrowIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            PARAGON
          </Typography>

          {/* Mobile Logo */}
          <EscrowIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            PARAGON
          </Typography>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Role Indicator */}
          {role && (
            <Chip
              icon={getRoleIcon() || undefined}
              label={getRoleLabel()}
              color="secondary"
              variant="outlined"
              sx={{
                mr: 2,
                color: 'white',
                borderColor: 'white',
                '& .MuiChip-icon': {
                  color: 'white',
                },
              }}
            />
          )}

          {/* Network Indicator */}
          {network && (
            <Chip
              label={network}
              size="small"
              sx={{
                mr: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
              }}
            />
          )}

          {/* Wallet Connect Button */}
          <WalletConnect />
        </Toolbar>
      </Container>
    </AppBar>
  );
};
