/**
 * Zod validation schema for Place Bid form
 */

import { z } from 'zod';
import { MIN_BID_AMOUNT, MIN_TIME_REQUIRED } from '../../constants';
import type { EscrowTX } from '../../../../types/blockchain.types';

/**
 * Factory function to create a PlaceBidFormSchema with contract-type-specific validation
 * @param contract - The escrow contract containing validation constraints
 * @returns A Zod schema configured for the specific contract type
 */
export const createPlaceBidFormSchema = (contract: EscrowTX) => {
  const isBountyContract = contract.record.contractType === 'bounty';
  const minAllowableBid = contract.record.minAllowableBid;
  const bountyAmount = contract.satoshis;

  return z.object({
    bidAmount: z
      .number()
      .min(MIN_BID_AMOUNT, `Bid must be at least ${MIN_BID_AMOUNT} satoshis`)
      .int('Bid amount must be a whole number')
      .refine(
        (val) => {
          if (isBountyContract) {
            // For BOUNTY contracts, bid amount MUST equal the bounty amount
            return val === bountyAmount;
          }
          // For BID contracts, bid amount must meet the minimum allowable bid
          return val >= minAllowableBid;
        },
        {
          message: isBountyContract
            ? `For BOUNTY contracts, bid amount must be exactly ${bountyAmount} satoshis`
            : `Bid must be at least ${minAllowableBid} satoshis (minimum allowable bid for this contract)`,
        }
      ),

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
};

/**
 * Type inference for the PlaceBidFormSchema
 * Uses a sample schema instance to derive the type
 */
export type PlaceBidFormSchema = z.infer<ReturnType<typeof createPlaceBidFormSchema>>;
