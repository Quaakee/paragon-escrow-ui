/**
 * CreateWorkPage
 * Page for creating new work contracts
 */

import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Paper, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { CreateWorkForm } from '../components/forms/CreateWorkForm';

export const CreateWorkPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // Navigate back to dashboard after successful creation
    navigate('/seeker/dashboard');
  };

  const handleCancel = () => {
    // Navigate back to dashboard on cancel
    navigate('/seeker/dashboard');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/seeker/dashboard')}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>
        <Typography variant="h4" fontWeight="bold">
          Create New Work Contract
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Define your work requirements and bounty. Once created, furnishers can
          submit bids to complete the work.
        </Typography>
      </Box>

      {/* Form */}
      <Paper sx={{ p: 4 }}>
        <CreateWorkForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </Paper>

      {/* Information */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          How it works
        </Typography>
        <Box component="ol" sx={{ pl: 2 }}>
          <li>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Create a work contract with clear requirements and a fair bounty
            </Typography>
          </li>
          <li>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Furnishers submit bids with their proposed plans and pricing
            </Typography>
          </li>
          <li>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Review and accept the best bid
            </Typography>
          </li>
          <li>
            <Typography variant="body2" sx={{ mb: 1 }}>
              The furnisher completes the work and submits it
            </Typography>
          </li>
          <li>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Review the submission and approve to release the bounty
            </Typography>
          </li>
        </Box>
      </Box>
    </Container>
  );
};
