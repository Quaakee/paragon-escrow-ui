/**
 * Wallet Store - Zustand state management for wallet connection
 * Manages wallet connection state, public key, network, and error handling
 */

import { create } from 'zustand';
import { walletService } from '@/services/wallet/WalletService';

interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  publicKey: string | null;
  identityKey: string | null;
  network: string | null;
  error: string | null;

  // Actions
  connect: () => Promise<void>;
  disconnect: () => void;
  checkConnection: () => void;
  clearError: () => void;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  isConnected: false,
  isConnecting: false,
  publicKey: null,
  identityKey: null,
  network: null,
  error: null,

  /**
   * Connect to MetaNet Desktop wallet
   */
  connect: async () => {
    set({ isConnecting: true, error: null });

    try {
      await walletService.initialize();

      const publicKey = walletService.getPublicKey();
      const identityKey = walletService.getIdentityKey();
      const network = walletService.getNetwork();

      set({
        isConnected: true,
        isConnecting: false,
        publicKey,
        identityKey,
        network,
        error: null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to connect wallet';

      set({
        isConnected: false,
        isConnecting: false,
        publicKey: null,
        identityKey: null,
        network: null,
        error: errorMessage,
      });

      throw error;
    }
  },

  /**
   * Disconnect wallet and reset state
   */
  disconnect: () => {
    walletService.disconnect();

    set({
      isConnected: false,
      isConnecting: false,
      publicKey: null,
      identityKey: null,
      network: null,
      error: null,
    });
  },

  /**
   * Check if wallet is still connected
   */
  checkConnection: () => {
    const isConnected = walletService.isConnected();

    if (!isConnected && get().isConnected) {
      // Wallet was disconnected externally
      set({
        isConnected: false,
        publicKey: null,
        identityKey: null,
        network: null,
      });
    }
  },

  /**
   * Clear any error messages
   */
  clearError: () => {
    set({ error: null });
  },
}));
