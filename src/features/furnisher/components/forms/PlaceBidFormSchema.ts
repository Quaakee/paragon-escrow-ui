/**
 * Zod validation schema for Place Bid form
 */

import { z } from 'zod';
import { MIN_BID_AMOUNT, MIN_TIME_REQUIRED } from '../../constants';

export const placeBidFormSchema = z.object({
  bidAmount: z
    .number()
    .min(MIN_BID_AMOUNT, `Bid must be at least ${MIN_BID_AMOUNT} satoshis`)
    .int('Bid amount must be a whole number'),

  plans: z
    .string()
    .min(20, 'Work plan must be at least 20 characters')
    .max(2000, 'Work plan must be less than 2000 characters'),

  bond: z
    .number()
    .min(0, 'Bond cannot be negative')
    .int('Bond must be a whole number')
    .optional(),

  timeRequired: z
    .number()
    .min(MIN_TIME_REQUIRED, `Time required must be at least ${MIN_TIME_REQUIRED / 3600} hours`)
    .int('Time required must be a whole number')
    .optional(),
});

export type PlaceBidFormSchema = z.infer<typeof placeBidFormSchema>;
