/**
 * PlatformService - Singleton class wrapping backend Platform entity
 * Provides methods for platform to manage and resolve disputes
 */

import Platform from '../../../../backend/src/entities/Platform';
import { walletService } from '../wallet/WalletService';
import { globalConfig } from '@/config/globalConfig';
import type { EscrowTX, EscrowRecord } from '@/types/blockchain.types';

export class PlatformService {
  private static instance: PlatformService;
  private platform: Platform | null = null;

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): PlatformService {
    if (!PlatformService.instance) {
      PlatformService.instance = new PlatformService();
    }
    return PlatformService.instance;
  }

  /**
   * Initialize the Platform entity with wallet and overlay network services
   */
  public initialize(): void {
    if (this.platform) {
      return; // Already initialized
    }

    const wallet = walletService.getWallet();

    // Use 'DEFAULT' to let the backend entities create their own broadcaster/resolver
    this.platform = new Platform(globalConfig, wallet, 'DEFAULT', 'DEFAULT');
  }

  /**
   * Ensure the platform is initialized
   */
  private ensureInitialized(): void {
    if (!this.platform) {
      throw new Error(
        'PlatformService not initialized. Ensure wallet is connected first.'
      );
    }
  }

  /**
   * List all active disputes requiring resolution
   */
  public async listActiveDisputes(): Promise<EscrowTX[]> {
    this.ensureInitialized();
    return await this.platform!.listActiveDisputes();
  }

  /**
   * List historical disputes that have been resolved
   */
  public async listHistoricalDisputes(): Promise<any[]> {
    this.ensureInitialized();
    return await this.platform!.listHistoricalDisputes();
  }

  /**
   * Decide a dispute and distribute funds
   * @param escrow - The disputed escrow record
   * @param awardToFurnisher - True to award to furnisher, false to award to seeker
   */
  public async decideDispute(
    escrow: EscrowRecord,
    awardToFurnisher: boolean
  ): Promise<void> {
    this.ensureInitialized();

    // Calculate amounts based on decision
    const totalAmount = escrow.acceptedBid.bidAmount;
    const platformFee = Math.floor(
      Number(totalAmount) * escrow.escrowServiceFeeBasisPoints / 10000
    );

    let amountForSeeker = 0;
    let amountForFurnisher = 0;

    if (awardToFurnisher) {
      // Award bounty to furnisher, return bond if applicable
      amountForFurnisher = Number(totalAmount) - platformFee;
      amountForSeeker = 0;
    } else {
      // Award bounty back to seeker
      amountForSeeker = Number(totalAmount) - platformFee;
      amountForFurnisher = 0;
    }

    // Empty notes array (could be used for dispute resolution details)
    const notes: number[] = [];

    await this.platform!.decideDispute(
      escrow,
      amountForSeeker,
      amountForFurnisher,
      notes
    );
  }

  /**
   * Reset the service (used when disconnecting wallet)
   */
  public reset(): void {
    this.platform = null;
  }
}

// Export the singleton instance
export const platformService = PlatformService.getInstance();
