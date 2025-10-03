/**
 * DashboardStats Component
 * Displays contract statistics overview
 */

import { Paper, Typography, Box, Grid } from '@mui/material';
import {
  Work,
  Pending,
  CheckCircle,
  Warning,
  AttachMoney,
} from '@mui/icons-material';
import type { ContractStats } from '../../types';
import { formatSatoshis } from '@/utils/formatting';

interface DashboardStatsProps {
  stats: ContractStats;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'primary' | 'warning' | 'success' | 'error' | 'info';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <Paper sx={{ p: 3 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
      <Box sx={{ color: `${color}.main` }}>{icon}</Box>
    </Box>
    <Typography variant="h4" fontWeight="bold">
      {value}
    </Typography>
  </Paper>
);

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <StatCard
          title="Total Contracts"
          value={stats.totalContracts}
          icon={<Work />}
          color="primary"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <StatCard
          title="Open for Bids"
          value={stats.openContracts}
          icon={<Pending />}
          color="info"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <StatCard
          title="In Progress"
          value={stats.activeContracts}
          icon={<Pending />}
          color="warning"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <StatCard
          title="Completed"
          value={stats.completedContracts}
          icon={<CheckCircle />}
          color="success"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <StatCard
          title="Disputed"
          value={stats.disputedContracts}
          icon={<Warning />}
          color="error"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <StatCard
          title="Total Locked"
          value={formatSatoshis(stats.totalBountyLocked)}
          icon={<AttachMoney />}
          color="primary"
        />
      </Grid>
    </Grid>
  );
};
