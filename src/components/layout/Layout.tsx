/**
 * Layout Component - Main layout wrapper
 * Provides consistent structure with header, main content, and footer
 */

import React, { type ReactNode } from 'react';
import { Box, Container, Typography, Link } from '@mui/material';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

export const Layout: React.FC<LayoutProps> = ({ children, maxWidth = 'xl' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <Header />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: '#f5f5f5',
          paddingY: 4,
        }}
      >
        <Container maxWidth={maxWidth}>
          {children}
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="body2" color="text.secondary" align="center">
            {'Paragon Escrow © '}
            {new Date().getFullYear()}
            {' - Powered by '}
            <Link
              color="inherit"
              href="https://whatsonchain.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              BSV Blockchain
            </Link>
          </Typography>
          <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mt: 1 }}>
            Decentralized escrow platform with smart contracts and overlay network integration
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};
