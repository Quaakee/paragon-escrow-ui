/**
 * PlaceBidForm Component
 * Form for placing bids on work contracts
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
import { usePlaceBid } from '../../hooks/usePlaceBid';
import {
  placeBidFormSchema,
  type PlaceBidFormSchema,
} from './PlaceBidFormSchema';
import { DEFAULT_BID_AMOUNT, DEFAULT_TIME_REQUIRED, SECONDS_PER_DAY } from '../../constants';
import { formatSatoshis, parseSatoshis } from '@/utils/formatting';
import type { EscrowTX } from '@/types/blockchain.types';

interface PlaceBidFormProps {
  contract: EscrowTX;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const PlaceBidForm: React.FC<PlaceBidFormProps> = ({
  contract,
  onSuccess,
  onCancel,
}) => {
  const placeBidMutation = usePlaceBid();
  const [bidAmountInput, setBidAmountInput] = useState(DEFAULT_BID_AMOUNT.toString());

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PlaceBidFormSchema>({
    resolver: zodResolver(placeBidFormSchema),
    defaultValues: {
      bidAmount: DEFAULT_BID_AMOUNT,
      plans: '',
      bond: 0,
      timeRequired: DEFAULT_TIME_REQUIRED,
    },
  });

  const bondRequired = contract.record.furnisherBondingMode === 'required';
  const bondOptional = contract.record.furnisherBondingMode === 'optional';
  const showBondField = bondRequired || bondOptional;

  const onSubmit = async (data: PlaceBidFormSchema) => {
    try {
      await placeBidMutation.mutateAsync({
        contract,
        bidData: data,
      });
      onSuccess?.();
    } catch (error) {
      console.error('Failed to place bid:', error);
    }
  };

  const handleBidAmountChange = (value: string) => {
    setBidAmountInput(value);
    const satoshis = parseSatoshis(value);
    setValue('bidAmount', satoshis, { shouldValidate: true });
  };

  const formatTimeDisplay = (seconds: number): string => {
    const days = Math.floor(seconds / SECONDS_PER_DAY);
    const hours = Math.floor((seconds % SECONDS_PER_DAY) / 3600);
    if (days > 0) {
      return `${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`;
    }
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  };

  const timeRequired = watch('timeRequired') || DEFAULT_TIME_REQUIRED;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ maxWidth: 600, mx: 'auto' }}
    >
      <Typography variant="h6" gutterBottom>
        Place Bid
      </Typography>

      {placeBidMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {placeBidMutation.error instanceof Error
            ? placeBidMutation.error.message
            : 'Failed to place bid'}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Bid Amount"
            fullWidth
            value={bidAmountInput}
            onChange={(e) => handleBidAmountChange(e.target.value)}
            error={!!errors.bidAmount}
            helperText={
              errors.bidAmount?.message ||
              `Preview: ${formatSatoshis(parseSatoshis(bidAmountInput))} | Min: ${formatSatoshis(contract.record.minAllowableBid)}`
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

        {showBondField && (
          <Grid size={{ xs: 12 }}>
            <Controller
              name="bond"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={`Bond ${bondRequired ? '(Required)' : '(Optional)'}`}
                  fullWidth
                  type="number"
                  error={!!errors.bond}
                  helperText={
                    errors.bond?.message ||
                    (bondRequired
                      ? `Required: ${formatSatoshis(contract.record.requiredBondAmount)}`
                      : 'Optional security bond to show commitment')
                  }
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">sats</InputAdornment>
                      ),
                    },
                  }}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </Grid>
        )}

        <Grid size={{ xs: 12 }}>
          <Controller
            name="timeRequired"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Time Required"
                fullWidth
                type="number"
                error={!!errors.timeRequired}
                helperText={
                  errors.timeRequired?.message ||
                  `Estimated time: ${formatTimeDisplay(timeRequired)}`
                }
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">seconds</InputAdornment>
                    ),
                  },
                }}
                value={field.value || ''}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Controller
            name="plans"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Work Plan"
                fullWidth
                multiline
                rows={6}
                error={!!errors.plans}
                helperText={
                  errors.plans?.message ||
                  'Describe your approach, timeline, and deliverables'
                }
                placeholder="Example:&#10;&#10;Approach:&#10;- Phase 1: Design mockups&#10;- Phase 2: Development&#10;- Phase 3: Testing & deployment&#10;&#10;Timeline: 7 days&#10;Deliverables: Fully responsive website with source code"
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
                disabled={placeBidMutation.isPending}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              disabled={placeBidMutation.isPending}
              startIcon={
                placeBidMutation.isPending ? (
                  <CircularProgress size={20} />
                ) : null
              }
            >
              {placeBidMutation.isPending ? 'Placing Bid...' : 'Place Bid'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
