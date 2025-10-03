/**
 * useWallet Hook - React hook for wallet connection management
 * Provides wallet connection state and actions
 */

import { useCallback } from 'react';
import { useWalletStore } from '@/stores/useWalletStore';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { seekerService } from '@/services/blockchain/SeekerService';
import { furnisherService } from '@/services/blockchain/FurnisherService';
import { platformService } from '@/services/blockchain/PlatformService';

export const useWallet = () => {
  const {
    isConnected,
    isConnecting,
    publicKey,
    identityKey,
    network,
    error,
    connect: walletConnect,
    disconnect: walletDisconnect,
    checkConnection,
    clearError,
  } = useWalletStore();

  const { addNotification } = useNotificationStore();

  /**
   * Connect to wallet and initialize services
   */
  const connect = useCallback(async () => {
    try {
      await walletConnect();

      // Initialize blockchain services after successful wallet connection
      seekerService.initialize();
      furnisherService.initialize();
      platformService.initialize();

      addNotification('success', 'Wallet connected successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to connect wallet';
      addNotification('error', message);
      throw error;
    }
  }, [walletConnect, addNotification]);

  /**
   * Disconnect wallet and reset services
   */
  const disconnect = useCallback(() => {
    walletDisconnect();

    // Reset blockchain services
    seekerService.reset();
    furnisherService.reset();
    platformService.reset();

    addNotification('info', 'Wallet disconnected');
  }, [walletDisconnect, addNotification]);

  return {
    isConnected,
    isConnecting,
    publicKey,
    identityKey,
    network,
    error,
    connect,
    disconnect,
    checkConnection,
    clearError,
  };
};
