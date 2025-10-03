/**
 * QuickActions Component
 * Quick action buttons for common tasks
 */

import { Paper, Typography, Button, Grid } from '@mui/material';
import { Add, Visibility, Gavel } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface QuickActionsProps {
  onCreateWork?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onCreateWork }) => {
  const navigate = useNavigate();

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Quick Actions
      </Typography>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<Add />}
            onClick={onCreateWork || (() => navigate('/seeker/create-work'))}
            sx={{ py: 1.5 }}
          >
            Create New Work
          </Button>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<Visibility />}
            onClick={() => navigate('/seeker/dashboard')}
            sx={{ py: 1.5 }}
          >
            View All Contracts
          </Button>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<Gavel />}
            onClick={() =>
              navigate('/seeker/dashboard?filter=work-submitted')
            }
            sx={{ py: 1.5 }}
          >
            Review Submissions
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};
