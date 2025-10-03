/**
 * Formatting Utilities
 * Helper functions for formatting data for display
 */

import { format, formatDistance, fromUnixTime } from 'date-fns';
import type { ContractStatus } from '@/types/blockchain.types';

/**
 * Format satoshis to BSV with appropriate decimal places
 */
export const formatSatoshis = (satoshis: number | bigint): string => {
  const amount = typeof satoshis === 'bigint' ? Number(satoshis) : satoshis;
  const bsv = amount / 100000000; // 1 BSV = 100,000,000 satoshis

  if (bsv >= 1) {
    return `${bsv.toFixed(8)} BSV`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(2)}k sats`;
  } else {
    return `${amount} sats`;
  }
};

/**
 * Format satoshis to a number string (for inputs)
 */
export const formatSatoshisToNumber = (satoshis: number | bigint): string => {
  const amount = typeof satoshis === 'bigint' ? Number(satoshis) : satoshis;
  return amount.toString();
};

/**
 * Parse satoshis from user input
 */
export const parseSatoshis = (input: string): number => {
  const trimmed = input.trim();

  // Handle BSV input
  if (trimmed.toLowerCase().includes('bsv')) {
    const bsv = parseFloat(trimmed.replace(/[^0-9.]/g, ''));
    return Math.floor(bsv * 100000000);
  }

  // Handle direct satoshi input
  return parseInt(trimmed.replace(/[^0-9]/g, ''), 10) || 0;
};

/**
 * Format Unix timestamp to readable date string
 */
export const formatDate = (timestamp: number, includeTime = true): string => {
  try {
    const date = fromUnixTime(timestamp);
    if (includeTime) {
      return format(date, 'PPpp'); // e.g., "Apr 29, 2023, 12:00:00 PM"
    } else {
      return format(date, 'PP'); // e.g., "Apr 29, 2023"
    }
  } catch (error) {
    return 'Invalid date';
  }
};

/**
 * Format Unix timestamp to relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (timestamp: number): string => {
  try {
    const date = fromUnixTime(timestamp);
    return formatDistance(date, new Date(), { addSuffix: true });
  } catch (error) {
    return 'Unknown time';
  }
};

/**
 * Format contract status to human-readable string
 */
export const formatStatus = (status: ContractStatus): string => {
  const statusMap: Record<ContractStatus, string> = {
    'initial': 'Open for Bids',
    'bid-accepted': 'Bid Accepted',
    'work-started': 'Work in Progress',
    'work-submitted': 'Work Submitted',
    'resolved': 'Completed',
    'disputed-by-seeker': 'Disputed by Seeker',
    'disputed-by-furnisher': 'Disputed by Furnisher',
  };

  return statusMap[status] || status;
};

/**
 * Get status color for Material-UI
 */
export const getStatusColor = (
  status: ContractStatus
): 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' => {
  const colorMap: Record<ContractStatus, 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
    'initial': 'info',
    'bid-accepted': 'primary',
    'work-started': 'warning',
    'work-submitted': 'secondary',
    'resolved': 'success',
    'disputed-by-seeker': 'error',
    'disputed-by-furnisher': 'error',
  };

  return colorMap[status] || 'default';
};

/**
 * Truncate public key or address for display
 */
export const truncateAddress = (address: string, startChars = 6, endChars = 4): string => {
  if (!address || address.length <= startChars + endChars) {
    return address;
  }

  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

/**
 * Truncate transaction ID for display
 */
export const truncateTxid = (txid: string): string => {
  return truncateAddress(txid, 8, 8);
};

/**
 * Format duration in seconds to human-readable string
 */
export const formatDuration = (seconds: number): string => {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);

  const parts: string[] = [];

  if (days > 0) {
    parts.push(`${days}d`);
  }
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0 || parts.length === 0) {
    parts.push(`${minutes}m`);
  }

  return parts.join(' ');
};

/**
 * Format percentage (basis points to %)
 */
export const formatPercentage = (basisPoints: number): string => {
  return `${(basisPoints / 100).toFixed(2)}%`;
};

/**
 * Format network name for display
 */
export const formatNetwork = (network: string): string => {
  const networkMap: Record<string, string> = {
    'mainnet': 'Mainnet',
    'testnet': 'Testnet',
    'local': 'Local',
    'regtest': 'RegTest',
  };

  return networkMap[network.toLowerCase()] || network;
};

/**
 * Convert hex string to ASCII text
 */
export const hexToAscii = (hex: string): string => {
  if (!hex || typeof hex !== 'string') {
    return hex || '';
  }

  // Check if it's already ASCII (not hex) - allow common punctuation and whitespace
  if (!/^[0-9a-fA-F]+$/.test(hex.trim())) {
    return hex;
  }

  // Ensure even length for hex pairs
  const cleanHex = hex.trim();
  if (cleanHex.length % 2 !== 0) {
    return hex; // Invalid hex, return as-is
  }

  try {
    let str = '';
    for (let i = 0; i < cleanHex.length; i += 2) {
      const charCode = parseInt(cleanHex.substring(i, i + 2), 16);

      // Handle all valid characters including newlines, tabs, etc
      if (charCode === 9 || charCode === 10 || charCode === 13 || (charCode >= 32 && charCode <= 126)) {
        str += String.fromCharCode(charCode);
      } else if (charCode > 126) {
        // Extended ASCII or Unicode - try to include it
        str += String.fromCharCode(charCode);
      } else {
        // Control characters (besides tab, newline, carriage return) - return original
        return hex;
      }
    }
    return str;
  } catch (error) {
    return hex;
  }
};

/**
 * Extract a contract title from work description
 * Returns the first line or first N characters of the description
 * @param workDescription - The work description (hex or ASCII)
 * @param maxLength - Maximum length of the extracted title (default: 60)
 * @returns Extracted title or 'Untitled Contract' if empty
 */
export const extractContractTitle = (
  workDescription: string,
  maxLength = 60
): string => {
  if (!workDescription || workDescription.trim().length === 0) {
    return 'Untitled Contract';
  }

  // Convert hex to ASCII if needed
  const asciiText = hexToAscii(workDescription);

  // Try to get first line
  const lines = asciiText.split('\n');
  const firstLine = lines[0].trim();

  // If first line is reasonable length, use it
  if (firstLine.length > 0 && firstLine.length <= maxLength) {
    return firstLine;
  }

  // If first line is too long, truncate it
  if (firstLine.length > maxLength) {
    return firstLine.substring(0, maxLength) + '...';
  }

  // If first line is empty but there are other lines, try second line
  if (firstLine.length === 0 && lines.length > 1) {
    const secondLine = lines[1].trim();
    if (secondLine.length > 0) {
      return secondLine.length > maxLength
        ? secondLine.substring(0, maxLength) + '...'
        : secondLine;
    }
  }

  // Otherwise truncate entire text to maxLength
  return asciiText.length > maxLength
    ? asciiText.substring(0, maxLength) + '...'
    : asciiText;
};

/**
 * Extracts description content without the title (first line)
 * This is used for description previews where the title is shown separately
 *
 * @param workDescription - Work description (may be hex or ASCII)
 * @param maxLength - Maximum length for preview (default: 150)
 * @returns Description without first line, or empty string if only one line
 */
export const extractContractDescription = (
  workDescription: string,
  maxLength = 150
): string => {
  if (!workDescription || workDescription.trim().length === 0) {
    return '';
  }

  // Convert hex to ASCII if needed
  const asciiText = hexToAscii(workDescription);

  // Split into lines and skip the first line (title)
  const lines = asciiText.split('\n');

  // If only one line exists, return empty (title is shown separately)
  if (lines.length <= 1) {
    return '';
  }

  // Join remaining lines (skip first line which is the title)
  const descriptionWithoutTitle = lines.slice(1).join('\n').trim();

  // If description is empty after removing title, return empty
  if (descriptionWithoutTitle.length === 0) {
    return '';
  }

  // Truncate if needed
  return descriptionWithoutTitle.length > maxLength
    ? descriptionWithoutTitle.substring(0, maxLength) + '...'
    : descriptionWithoutTitle;
};
