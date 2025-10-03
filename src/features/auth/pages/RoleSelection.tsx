/**
 * RoleSelection Page - Select user role (Seeker, Furnisher, or Platform)
 * First page after wallet connection
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Container,
  Paper,
  Grid,
} from '@mui/material';
import {
  Person as SeekerIcon,
  Build as FurnisherIcon,
  Gavel as PlatformIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { useUserStore } from '@/stores/useUserStore';
import { useWallet } from '@/hooks/useWallet';
import type { UserRole } from '@/types/blockchain.types';

interface RoleCardProps {
  role: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  onSelect: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({
  title,
  description,
  icon,
  features,
  onSelect,
}) => {
  return (
    <Card
      elevation={3}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            {icon}
          </Box>
        </Box>

        <Typography variant="h5" component="h2" gutterBottom align="center">
          {title}
        </Typography>

        <Typography variant="body2" color="text.secondary" paragraph align="center">
          {description}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Features:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {features.map((feature, index) => (
              <li key={index}>
                <Typography variant="body2" color="text.secondary">
                  {feature}
                </Typography>
              </li>
            ))}
          </ul>
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          endIcon={<ArrowIcon />}
          onClick={onSelect}
          size="large"
        >
          Select {title}
        </Button>
      </CardActions>
    </Card>
  );
};

export const RoleSelection: React.FC = () => {
  const navigate = useNavigate();
  const { setRole } = useUserStore();
  const { isConnected } = useWallet();

  const handleRoleSelect = (role: UserRole) => {
    setRole(role);

    // Navigate to appropriate dashboard
    switch (role) {
      case 'seeker':
        navigate('/seeker/dashboard');
        break;
      case 'furnisher':
        navigate('/furnisher/dashboard');
        break;
      case 'platform':
        navigate('/platform/dashboard');
        break;
    }
  };

  if (!isConnected) {
    return (
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Wallet Connection Required
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please connect your MetaNet Desktop wallet to continue.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Select Your Role
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Choose how you want to use Paragon Escrow
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Seeker Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <RoleCard
            role="seeker"
            title="Seeker"
            description="Post work requirements and hire furnishers to complete tasks"
            icon={<SeekerIcon sx={{ fontSize: 48 }} />}
            features={[
              'Create work contracts',
              'Review and accept bids',
              'Approve completed work',
              'Manage bounties',
            ]}
            onSelect={() => handleRoleSelect('seeker')}
          />
        </Grid>

        {/* Furnisher Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <RoleCard
            role="furnisher"
            title="Furnisher"
            description="Find work opportunities and earn bounties by completing tasks"
            icon={<FurnisherIcon sx={{ fontSize: 48 }} />}
            features={[
              'Browse available work',
              'Place competitive bids',
              'Complete tasks',
              'Claim bounties',
            ]}
            onSelect={() => handleRoleSelect('furnisher')}
          />
        </Grid>

        {/* Platform Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <RoleCard
            role="platform"
            title="Platform"
            description="Manage disputes and ensure fair resolution for all parties"
            icon={<PlatformIcon sx={{ fontSize: 48 }} />}
            features={[
              'View active disputes',
              'Review work evidence',
              'Make fair decisions',
              'Earn platform fees',
            ]}
            onSelect={() => handleRoleSelect('platform')}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          You can change your role at any time from the settings
        </Typography>
      </Box>
    </Container>
  );
};
