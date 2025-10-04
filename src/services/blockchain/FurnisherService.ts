/**
 * FurnisherService - Singleton class wrapping backend Furnisher entity
 * Provides methods for furnishers to bid on work, start work, submit work, etc.
 */

import Furnisher from '../../../../backend/src/entities/Furnisher';
import { walletService } from '../wallet/WalletService';
import { globalConfig } from '@/config/globalConfig';
import type { EscrowTX } from '@/types/blockchain.types';

export class FurnisherService {
  private static instance: FurnisherService;
  private furnisher: Furnisher | null = null;

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): FurnisherService {
    if (!FurnisherService.instance) {
      FurnisherService.instance = new FurnisherService();
    }
    return FurnisherService.instance;
  }

  /**
   * Initialize the Furnisher entity with wallet and overlay network services
   */
  public initialize(): void {
    if (this.furnisher) {
      return; // Already initialized
    }

    const wallet = walletService.getWallet();

    // Use 'DEFAULT' to let the backend entities create their own broadcaster/resolver
    this.furnisher = new Furnisher(globalConfig, wallet, 'DEFAULT', 'DEFAULT');
  }

  /**
   * Ensure the furnisher is initialized
   */
  private ensureInitialized(): void {
    if (!this.furnisher) {
      throw new Error(
        'FurnisherService not initialized. Ensure wallet is connected first.'
      );
    }
  }

  /**
   * List all available work contracts
   */
  public async listAvailableWork(): Promise<EscrowTX[]> {
    this.ensureInitialized();
    return await this.furnisher!.listAvailableWork();
  }

  /**
   * Place a bid on a work contract
   * @param escrow - The escrow contract to bid on
   * @param plans - Description of proposed work plan
   * @param bidAmount - Bid amount in satoshis
   * @param bond - Optional bond amount in satoshis
   * @param timeRequired - Time required to complete work (seconds)
   * @throws Error if TYPE_BOUNTY contract bid amount doesn't match bounty value
   */
  public async placeBid(
    escrow: EscrowTX,
    plans: string,
    bidAmount: number,
    bond?: number,
    timeRequired?: number
  ): Promise<void> {
    this.ensureInitialized();

    // CRITICAL VALIDATION: For BOUNTY contracts, bid amount MUST equal the bounty value
    const isBountyContract = escrow.record.contractType === 'bounty';
    if (isBountyContract && bidAmount !== escrow.satoshis) {
      throw new Error(
        `Invalid bid amount for BOUNTY contract. ` +
        `Bid amount must be exactly ${escrow.satoshis} satoshis (the fixed bounty amount), ` +
        `but received ${bidAmount} satoshis. ` +
        `BOUNTY contracts have a fixed reward that cannot be changed.`
      );
    }

    // Validate minimum bid for BID contracts
    if (!isBountyContract && bidAmount < escrow.record.minAllowableBid) {
      throw new Error(
        `Bid amount ${bidAmount} is below the minimum allowable bid of ${escrow.record.minAllowableBid} satoshis.`
      );
    }

    // CRITICAL: Convert timeRequired from duration (seconds) to future Unix timestamp
    // The contract expects a Unix timestamp (> 500000000), not a duration
    // This matches SimpleBidFlow.test.ts: Math.floor(Date.now() / 1000) + duration
    const timeRequiredTimestamp = timeRequired
      ? Math.floor(Date.now() / 1000) + timeRequired
      : Math.floor(Date.now() / 1000) + 86400; // Default 1 day from now

    await this.furnisher!.placeBid(
      escrow,
      bidAmount,
      plans,
      timeRequiredTimestamp,
      bond ?? 0
    );
  }

  /**
   * Start work after bid acceptance
   * @param escrow - The escrow contract with accepted bid
   */
  public async startWork(escrow: EscrowTX): Promise<void> {
    this.ensureInitialized();
    await this.furnisher!.startWork(escrow);
  }

  /**
   * Submit completed work
   * @param escrow - The escrow contract
   * @param workDescription - Description of completed work
   */
  public async submitWork(
    escrow: EscrowTX,
    workDescription: string
  ): Promise<void> {
    this.ensureInitialized();
    await this.furnisher!.completeWork(escrow, workDescription);
  }

  /**
   * Claim bounty after work approval or timeout
   * @param escrow - The escrow contract with approved work
   */
  public async claimBounty(escrow: EscrowTX): Promise<void> {
    this.ensureInitialized();
    await this.furnisher!.claimBounty(escrow);
  }

  /**
   * Raise a dispute when work approval is delayed
   * @param escrow - The escrow contract
   */
  public async raiseDispute(escrow: EscrowTX): Promise<void> {
    this.ensureInitialized();
    await this.furnisher!.raiseDispute(escrow);
  }

  /**
   * List disputes (active and/or historical)
   * @param active - true for active, false for historical, undefined for both
   */
  public async listDisputes(
    active?: boolean
  ): Promise<{ active: EscrowTX[]; historical: any[] }> {
    this.ensureInitialized();
    return await this.furnisher!.listDisputes(active);
  }

  /**
   * Claim funds after dispute resolution
   * @param escrow - The escrow contract
   */
  public async claimAfterDispute(escrow: EscrowTX): Promise<void> {
    this.ensureInitialized();
    await this.furnisher!.claimAfterDispute(escrow);
  }

  /**
   * Reset the service (used when disconnecting wallet)
   */
  public reset(): void {
    this.furnisher = null;
  }
}

// Export the singleton instance
export const furnisherService = FurnisherService.getInstance();
