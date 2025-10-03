/**
 * Validation Utilities
 * Helper functions for validating user input
 */

import { globalConfig } from '@/config/globalConfig';

/**
 * Validate bounty amount meets minimum requirements
 */
export const validateBounty = (amount: number): { valid: boolean; error?: string } => {
  if (isNaN(amount) || amount <= 0) {
    return {
      valid: false,
      error: 'Bounty must be a positive number',
    };
  }

  if (amount < globalConfig.minAllowableBid) {
    return {
      valid: false,
      error: `Bounty must be at least ${globalConfig.minAllowableBid} satoshis`,
    };
  }

  return { valid: true };
};

/**
 * Validate deadline is in the future
 */
export const validateDeadline = (timestamp: number): { valid: boolean; error?: string } => {
  const now = Math.floor(Date.now() / 1000); // Current Unix timestamp in seconds

  if (isNaN(timestamp) || timestamp <= 0) {
    return {
      valid: false,
      error: 'Please select a valid deadline',
    };
  }

  if (timestamp <= now) {
    return {
      valid: false,
      error: 'Deadline must be in the future',
    };
  }

  // Check if deadline is too far in the future (more than 1 year)
  const oneYearFromNow = now + (365 * 24 * 60 * 60);
  if (timestamp > oneYearFromNow) {
    return {
      valid: false,
      error: 'Deadline cannot be more than 1 year in the future',
    };
  }

  return { valid: true };
};

/**
 * Validate work description
 */
export const validateWorkDescription = (text: string): { valid: boolean; error?: string } => {
  const trimmed = text.trim();

  if (!trimmed) {
    return {
      valid: false,
      error: 'Work description is required',
    };
  }

  if (trimmed.length < 10) {
    return {
      valid: false,
      error: 'Work description must be at least 10 characters',
    };
  }

  if (trimmed.length > 5000) {
    return {
      valid: false,
      error: 'Work description must be less than 5000 characters',
    };
  }

  return { valid: true };
};

/**
 * Validate bid amount
 */
export const validateBidAmount = (amount: number, bounty: number): { valid: boolean; error?: string } => {
  if (isNaN(amount) || amount <= 0) {
    return {
      valid: false,
      error: 'Bid amount must be a positive number',
    };
  }

  if (amount < globalConfig.minAllowableBid) {
    return {
      valid: false,
      error: `Bid amount must be at least ${globalConfig.minAllowableBid} satoshis`,
    };
  }

  if (amount > bounty) {
    return {
      valid: false,
      error: 'Bid amount cannot exceed the bounty',
    };
  }

  return { valid: true };
};

/**
 * Validate bond amount
 */
export const validateBond = (amount: number): { valid: boolean; error?: string } => {
  if (globalConfig.furnisherBondingMode === 'forbidden' && amount > 0) {
    return {
      valid: false,
      error: 'Bonds are not allowed in this configuration',
    };
  }

  if (globalConfig.furnisherBondingMode === 'required') {
    if (amount < globalConfig.requiredBondAmount) {
      return {
        valid: false,
        error: `Bond must be at least ${globalConfig.requiredBondAmount} satoshis`,
      };
    }
  }

  if (amount < 0) {
    return {
      valid: false,
      error: 'Bond amount cannot be negative',
    };
  }

  return { valid: true };
};

/**
 * Validate time required (in seconds)
 */
export const validateTimeRequired = (seconds: number): { valid: boolean; error?: string } => {
  if (isNaN(seconds) || seconds <= 0) {
    return {
      valid: false,
      error: 'Time required must be a positive number',
    };
  }

  // Maximum 1 year
  const maxSeconds = 365 * 24 * 60 * 60;
  if (seconds > maxSeconds) {
    return {
      valid: false,
      error: 'Time required cannot exceed 1 year',
    };
  }

  return { valid: true };
};

/**
 * Validate bid plans/proposal
 */
export const validateBidPlans = (text: string): { valid: boolean; error?: string } => {
  const trimmed = text.trim();

  if (!trimmed) {
    return {
      valid: false,
      error: 'Bid proposal is required',
    };
  }

  if (trimmed.length < 20) {
    return {
      valid: false,
      error: 'Bid proposal must be at least 20 characters',
    };
  }

  if (trimmed.length > 3000) {
    return {
      valid: false,
      error: 'Bid proposal must be less than 3000 characters',
    };
  }

  return { valid: true };
};

/**
 * Validate public key format
 */
export const validatePublicKey = (key: string): { valid: boolean; error?: string } => {
  const trimmed = key.trim();

  if (!trimmed) {
    return {
      valid: false,
      error: 'Public key is required',
    };
  }

  // BSV public keys are 66 characters (33 bytes in hex) for compressed keys
  if (trimmed.length !== 66) {
    return {
      valid: false,
      error: 'Invalid public key format',
    };
  }

  // Check if it's valid hex
  if (!/^[0-9a-fA-F]+$/.test(trimmed)) {
    return {
      valid: false,
      error: 'Public key must be hexadecimal',
    };
  }

  return { valid: true };
};

/**
 * Validate transaction ID format
 */
export const validateTxid = (txid: string): { valid: boolean; error?: string } => {
  const trimmed = txid.trim();

  if (!trimmed) {
    return {
      valid: false,
      error: 'Transaction ID is required',
    };
  }

  // Transaction IDs are 64 characters (32 bytes in hex)
  if (trimmed.length !== 64) {
    return {
      valid: false,
      error: 'Invalid transaction ID format',
    };
  }

  // Check if it's valid hex
  if (!/^[0-9a-fA-F]+$/.test(trimmed)) {
    return {
      valid: false,
      error: 'Transaction ID must be hexadecimal',
    };
  }

  return { valid: true };
};

/**
 * Validate output index
 */
export const validateOutputIndex = (index: number): { valid: boolean; error?: string } => {
  if (isNaN(index) || index < 0 || !Number.isInteger(index)) {
    return {
      valid: false,
      error: 'Output index must be a non-negative integer',
    };
  }

  return { valid: true };
};
