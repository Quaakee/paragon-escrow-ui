import type { GlobalConfig } from '@/types/blockchain.types';
import type { PubKeyHex, WalletProtocol } from '@bsv/sdk';

/**
 * Get the global configuration based on the environment
 * This configuration defines the rules that all parties in the system must agree upon.
 */
export const getGlobalConfig = (): GlobalConfig => {
  const network = import.meta.env.VITE_NETWORK || 'local';
  const platformKey = import.meta.env.VITE_PLATFORM_KEY as PubKeyHex;

  const baseConfig = {
    minAllowableBid: 1000,
    escrowServiceFeeBasisPoints: 250, // 2.5%
    platformAuthorizationRequired: true,
    escrowMustBeFullyDecisive: true,
    bountySolversNeedApproval: true,
    furnisherBondingMode: 'optional' as const,
    requiredBondAmount: 0,
    maxWorkStartDelay: 7 * 24 * 60 * 60, // 7 days in seconds
    maxWorkApprovalDelay: 3 * 24 * 60 * 60, // 3 days in seconds
    delayUnit: 'seconds' as const,
    approvalMode: 'seeker-or-platform' as const,
    contractType: 'bid' as const,
    contractSurvivesAdverseFurnisherDisputeResolution: false,
    bountyIncreaseAllowanceMode: 'by-seeker-or-platform' as const,
    bountyIncreaseCutoffPoint: 'bid-acceptance' as const,
    platformKey,
    keyDerivationProtocol: [2, 'paragon escrow'] as WalletProtocol,
  };

  // Environment-specific configurations
  // Using standard LARS overlay topics and services
  switch (network) {
    case 'mainnet':
      return {
        ...baseConfig,
        topic: 'tm_escrow',
        service: 'ls_escrow',
        networkPreset: 'mainnet' as const,
      };

    case 'testnet':
      return {
        ...baseConfig,
        topic: 'tm_escrow',
        service: 'ls_escrow',
        networkPreset: 'testnet' as const,
      };

    case 'local':
    default:
      return {
        ...baseConfig,
        topic: 'tm_escrow',
        service: 'ls_escrow',
        networkPreset: 'local' as const,
      };
  }
};

// Export the singleton instance
export const globalConfig = getGlobalConfig();

// Export environment helpers
export const isProduction = import.meta.env.PROD;
export const isDevelopment = import.meta.env.DEV;
export const networkPreset = globalConfig.networkPreset;
