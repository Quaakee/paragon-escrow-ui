/**
 * CreateWorkForm Component
 * Form for creating new work contracts
 */

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  Grid,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useCreateWork } from '../../hooks/useCreateWork';
import {
  createWorkFormSchema,
  type CreateWorkFormSchema,
} from './CreateWorkFormSchema';
import { DEFAULT_BOUNTY, DEFAULT_DEADLINE_DAYS } from '../../constants';
import { formatSatoshis, parseSatoshis } from '@/utils/formatting';

interface CreateWorkFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CreateWorkForm: React.FC<CreateWorkFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const createWorkMutation = useCreateWork();
  const [bountyInput, setBountyInput] = useState(DEFAULT_BOUNTY.toString());

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateWorkFormSchema>({
    resolver: zodResolver(createWorkFormSchema),
    defaultValues: {
      description: '',
      bounty: DEFAULT_BOUNTY,
      deadline: new Date(
        Date.now() + DEFAULT_DEADLINE_DAYS * 24 * 60 * 60 * 1000
      ),
    },
  });

  const onSubmit = async (data: CreateWorkFormSchema) => {
    try {
      await createWorkMutation.mutateAsync(data);
      onSuccess?.();
    } catch (error) {
      // Error is handled by React Query
      console.error('Failed to create work:', error);
    }
  };

  const handleBountyChange = (value: string) => {
    setBountyInput(value);
    const satoshis = parseSatoshis(value);
    setValue('bounty', satoshis, { shouldValidate: true });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ maxWidth: 800, mx: 'auto' }}
      >
        <Typography variant="h5" gutterBottom>
          Create New Work Contract
        </Typography>

        {createWorkMutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {createWorkMutation.error instanceof Error
              ? createWorkMutation.error.message
              : 'Failed to create work contract'}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Work Description"
                  fullWidth
                  multiline
                  rows={8}
                  error={!!errors.description}
                  helperText={
                    errors.description?.message ||
                    'Start with a brief title on the first line, then provide detailed requirements. Example:\nBuild a responsive landing page\n\nRequirements: Mobile-friendly design, modern UI/UX, contact form integration...'
                  }
                  placeholder="Example:&#10;Build a responsive landing page&#10;&#10;Requirements:&#10;- Mobile-friendly design&#10;- Modern UI/UX&#10;- Contact form integration&#10;- SEO optimized"
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Bounty Amount"
              fullWidth
              value={bountyInput}
              onChange={(e) => handleBountyChange(e.target.value)}
              error={!!errors.bounty}
              helperText={
                errors.bounty?.message ||
                `Preview: ${formatSatoshis(parseSatoshis(bountyInput))}`
              }
              placeholder="Enter amount in satoshis or BSV"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">sats</InputAdornment>
                  ),
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="deadline"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  {...field}
                  label="Completion Deadline"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.deadline,
                      helperText: errors.deadline?.message,
                    },
                  }}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              {onCancel && (
                <Button
                  variant="outlined"
                  onClick={onCancel}
                  disabled={createWorkMutation.isPending}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                disabled={createWorkMutation.isPending}
                startIcon={
                  createWorkMutation.isPending ? (
                    <CircularProgress size={20} />
                  ) : null
                }
              >
                {createWorkMutation.isPending
                  ? 'Creating Contract...'
                  : 'Create Work Contract'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};
