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
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  FormHelperText,
  Paper,
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
  const [contractType, setContractType] = useState<'bid' | 'bounty'>('bounty');

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateWorkFormSchema>({
    resolver: zodResolver(createWorkFormSchema),
    defaultValues: {
      description: '',
      contractType: 'bounty',
      bounty: DEFAULT_BOUNTY,
      deadline: new Date(
        Date.now() + DEFAULT_DEADLINE_DAYS * 24 * 60 * 60 * 1000
      ),
    },
  });

  const onSubmit = async (data: CreateWorkFormSchema) => {
    try {
      // For BID contracts, set bounty to 1 satoshi (furnishers name their price)
      const actualBounty = data.contractType === 'bid' ? 1 : data.bounty;
      await createWorkMutation.mutateAsync({
        ...data,
        bounty: actualBounty,
      });
      onSuccess?.();
    } catch (error) {
      // Error is handled by React Query
      console.error('Failed to create work:', error);
    }
  };

  const handleContractTypeChange = (type: 'bid' | 'bounty') => {
    setContractType(type);
    setValue('contractType', type);

    // Update bounty field based on contract type
    if (type === 'bid') {
      setBountyInput('1');
      setValue('bounty', 1);
    } else {
      setBountyInput(DEFAULT_BOUNTY.toString());
      setValue('bounty', DEFAULT_BOUNTY);
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
              name="contractType"
              control={control}
              render={({ field }) => (
                <FormControl component="fieldset" error={!!errors.contractType}>
                  <FormLabel component="legend">Contract Type</FormLabel>
                  <RadioGroup
                    row
                    value={field.value}
                    onChange={(e) => handleContractTypeChange(e.target.value as 'bid' | 'bounty')}
                  >
                    <FormControlLabel
                      value="bounty"
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body1" fontWeight="bold">
                            Bounty Contract
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Fixed reward amount - furnishers compete to complete the work for your set bounty
                          </Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="bid"
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body1" fontWeight="bold">
                            Bid Contract
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Furnishers propose their own prices - you choose the best bid
                          </Typography>
                        </Box>
                      }
                    />
                  </RadioGroup>
                  {errors.contractType && (
                    <FormHelperText>{errors.contractType.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>

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
              label={contractType === 'bounty' ? 'Bounty Amount' : 'Initial Amount (1 sat)'}
              fullWidth
              value={bountyInput}
              onChange={(e) => handleBountyChange(e.target.value)}
              error={!!errors.bounty}
              disabled={contractType === 'bid'}
              helperText={
                errors.bounty?.message ||
                (contractType === 'bid'
                  ? 'BID contracts start at 1 satoshi - furnishers will propose their prices'
                  : `Preview: ${formatSatoshis(parseSatoshis(bountyInput))}`)
              }
              placeholder={contractType === 'bid' ? 'Fixed at 1 satoshi' : 'Enter amount in satoshis or BSV'}
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
