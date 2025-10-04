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
  Paper,
} from '@mui/material';
import { usePlaceBid } from '../../hooks/usePlaceBid';
import {
  createPlaceBidFormSchema,
  type PlaceBidFormSchema,
} from './PlaceBidFormSchema';
import { DEFAULT_BID_AMOUNT, DEFAULT_TIME_REQUIRED, SECONDS_PER_DAY } from '../../constants';
import { formatSatoshis, parseSatoshis } from '@/utils/formatting';
import type { EscrowTX } from '@/types/blockchain.types';
import { ContractTypeBadge } from '@/features/shared/components/ContractTypeBadge';

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

  // For BOUNTY contracts, bid amount MUST equal the bounty value
  const isBountyContract = contract.record.contractType === 'bounty';
  const requiredBidAmount = isBountyContract ? contract.satoshis : DEFAULT_BID_AMOUNT;
  const [bidAmountInput, setBidAmountInput] = useState(requiredBidAmount.toString());

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PlaceBidFormSchema>({
    resolver: zodResolver(createPlaceBidFormSchema(contract)),
    defaultValues: {
      bidAmount: requiredBidAmount,
      plans: '',
      bond: 0,
      timeRequired: DEFAULT_TIME_REQUIRED,
    },
  });
  
  const bondRequired = contract.record.furnisherBondingMode === 'required';
  const bondOptional = contract.record.furnisherBondingMode === 'optional';
  const showBondField = bondRequired || bondOptional;

  const onSubmit = async (data: PlaceBidFormSchema) => {
    // Prevent double submission while mutation is in progress
    if (placeBidMutation.isPending) {
      console.log('⏳ Bid submission already in progress, ignoring duplicate submit');
      return;
    }

    try {
      console.log('🔍 CONTRACT DATA BEING PASSED:', {
        txid: contract.record.txid,
        outputIndex: contract.record.outputIndex,
        satoshis: contract.satoshis,
        hasBeef: !!contract.beef,
        beefLength: contract.beef?.length,
        hasScript: !!contract.script,
        scriptLength: contract.script?.length,
        hasContract: !!contract.contract,
        fullContract: contract
      });

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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography variant="h6">
          Place Bid
        </Typography>
        <ContractTypeBadge contractType={contract.record.contractType} size="medium" />
      </Box>

      {isBountyContract && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight="bold">
            This is a BOUNTY contract with a fixed reward of {formatSatoshis(contract.satoshis)}.
          </Typography>
          <Typography variant="body2">
            The bid amount is locked and cannot be changed. You will receive exactly {formatSatoshis(contract.satoshis)} upon successful completion.
          </Typography>
        </Alert>
      )}

      {!isBountyContract && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            This is a BID contract. You can propose your desired payment amount (minimum: {formatSatoshis(contract.record.minAllowableBid)}).
          </Typography>
        </Alert>
      )}

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
            disabled={isBountyContract}
            helperText={
              errors.bidAmount?.message ||
              (isBountyContract
                ? `Fixed bounty amount: ${formatSatoshis(contract.satoshis)}`
                : `Preview: ${formatSatoshis(parseSatoshis(bidAmountInput))} | Min: ${formatSatoshis(contract.record.minAllowableBid)}`)
            }
            placeholder={isBountyContract ? 'Fixed bounty amount' : 'Enter amount in satoshis or BSV'}
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
