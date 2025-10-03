/**
 * WalletService - Singleton class for MetaNet Desktop wallet connection
 * Manages wallet connection, public key retrieval, and network information
 */

import { WalletClient, type WalletInterface } from '@bsv/sdk';

export class WalletService {
  private static instance: WalletService;
  private wallet: WalletInterface | null = null;
  private publicKey: string | null = null;
  private identityKey: string | null = null;
  private network: string | null = null;
  private isInitialized = false;

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  /**
   * Initialize wallet connection to MetaNet Desktop (localhost:3321)
   */
  public async initialize(): Promise<void> {
    try {
      // Connect to MetaNet Desktop wallet on localhost:3321
      this.wallet = new WalletClient('auto', 'localhost:3321');

      // Get identity key (master public key)
      const identityKeyResult = await this.wallet.getPublicKey({
        identityKey: true,
      });
      this.identityKey = identityKeyResult.publicKey;

      // Get derived public key for the application
      const publicKeyResult = await this.wallet.getPublicKey({
        counterparty: 'self',
        protocolID: [2, 'paragon escrow'],
        keyID: '1',
      });
      this.publicKey = publicKeyResult.publicKey;

      // Get network information
      const networkResult = await this.wallet.getNetwork({});
      this.network = networkResult.network;

      this.isInitialized = true;
    } catch (error) {
      this.wallet = null;
      this.publicKey = null;
      this.identityKey = null;
      this.network = null;
      this.isInitialized = false;
      throw new Error(
        `Failed to initialize wallet connection: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Get the wallet instance
   */
  public getWallet(): WalletInterface {
    if (!this.wallet) {
      throw new Error('Wallet not initialized. Call initialize() first.');
    }
    return this.wallet;
  }

  /**
   * Get the derived public key for the application
   */
  public getPublicKey(): string {
    if (!this.publicKey) {
      throw new Error('Wallet not initialized. Call initialize() first.');
    }
    return this.publicKey;
  }

  /**
   * Get the identity key (master public key)
   */
  public getIdentityKey(): string {
    if (!this.identityKey) {
      throw new Error('Wallet not initialized. Call initialize() first.');
    }
    return this.identityKey;
  }

  /**
   * Get the network the wallet is connected to
   */
  public getNetwork(): string {
    if (!this.network) {
      throw new Error('Wallet not initialized. Call initialize() first.');
    }
    return this.network;
  }

  /**
   * Check if wallet is connected
   */
  public isConnected(): boolean {
    return this.isInitialized && this.wallet !== null;
  }

  /**
   * Disconnect wallet and reset state
   */
  public disconnect(): void {
    this.wallet = null;
    this.publicKey = null;
    this.identityKey = null;
    this.network = null;
    this.isInitialized = false;
  }
}

// Export the singleton instance
export const walletService = WalletService.getInstance();
