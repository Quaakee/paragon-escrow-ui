/**
 * Create Work Form Validation Schema
 */

import { z } from 'zod';
import {
  MIN_BOUNTY,
  MAX_BOUNTY,
  MIN_DEADLINE_HOURS,
} from '../../constants';

export const createWorkFormSchema = z.object({
  description: z
    .string()
    .min(10, 'Work description must be at least 10 characters')
    .max(2000, 'Work description must be less than 2000 characters')
    .refine(
      (desc) => desc.trim().length > 0,
      { message: 'Work description cannot be empty' }
    ),

  bounty: z
    .number()
    .int('Bounty must be a whole number')
    .min(MIN_BOUNTY, `Bounty must be at least ${MIN_BOUNTY} satoshis`)
    .max(MAX_BOUNTY, `Bounty must be less than ${MAX_BOUNTY} satoshis`),

  deadline: z.date().refine(
    (date) => {
      const minDate = new Date();
      minDate.setHours(minDate.getHours() + MIN_DEADLINE_HOURS);
      return date >= minDate;
    },
    {
      message: `Deadline must be at least ${MIN_DEADLINE_HOURS} hour(s) from now`,
    }
  ),
});

export type CreateWorkFormSchema = z.infer<typeof createWorkFormSchema>;
