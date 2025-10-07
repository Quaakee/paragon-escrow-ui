/**
 * SeekerService - Singleton class wrapping backend Seeker entity
 * Provides methods for seekers to create work, manage bids, approve work, etc.
 */

import Seeker from '../../../../backend/src/entities/Seeker';
import { walletService } from '../wallet/WalletService';
import { globalConfig } from '@/config/globalConfig';
import type { EscrowTX } from '@/types/blockchain.types';

export class SeekerService {
  private static instance: SeekerService;
  private seeker: Seeker | null = null;

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): SeekerService {
    if (!SeekerService.instance) {
      SeekerService.instance = new SeekerService();
    }
    return SeekerService.instance;
  }

  /**
   * Initialize the Seeker entity with wallet and overlay network services
   */
  public initialize(): void {
    if (this.seeker) {
      return; // Already initialized
    }

    const wallet = walletService.getWallet();

    // Use 'DEFAULT' to let the backend entities create their own broadcaster/resolver
    this.seeker = new Seeker(globalConfig, wallet, 'DEFAULT', 'DEFAULT');
  }

  /**
   * Ensure the seeker is initialized
   */
  private ensureInitialized(): void {
    if (!this.seeker) {
      throw new Error(
        'SeekerService not initialized. Ensure wallet is connected first.'
      );
    }
  }

  /**
   * Create a new work contract
   * @param description - Description of the work required
   * @param deadline - Unix timestamp for work completion deadline
   * @param bounty - Bounty amount in satoshis
   * @param contractType - Contract type ('bid' or 'bounty')
   */
  public async createWork(
    description: string,
    deadline: number,
    bounty: number,
    contractType: 'bid' | 'bounty'
  ): Promise<void> {
    this.ensureInitialized();
    await this.seeker!.seek(description, deadline, bounty, contractType);
  }

  /**
   * Get all open contracts created by this seeker
   */
  public async getMyContracts(): Promise<EscrowTX[]> {
    this.ensureInitialized();
    return await this.seeker!.getMyOpenContracts();
  }

  /**
   * Accept a bid from a furnisher
   * @param escrow - The escrow contract
   * @param bidIndex - Index of the bid to accept
   */
  public async acceptBid(escrow: EscrowTX, bidIndex: number): Promise<void> {
    this.ensureInitialized();
    await this.seeker!.acceptBid(escrow, bidIndex);
  }

  /**
   * Approve completed work
   * @param escrow - The escrow contract with completed work
   */
  public async approveWork(escrow: EscrowTX): Promise<void> {
    this.ensureInitialized();
    await this.seeker!.approveCompletedWork(escrow);
  }

  /**
   * Raise a dispute for work that doesn't meet requirements
   * @param escrow - The escrow contract to dispute
   * @param reason - Optional reason for the dispute (will be converted to evidence bytes)
   */
  public async raiseDispute(escrow: EscrowTX, reason?: string): Promise<void> {
    this.ensureInitialized();

    // Convert reason to evidence bytes if provided
    const evidence = reason ? Array.from(Buffer.from(reason, 'utf-8')) : undefined;

    await this.seeker!.disputeWork(escrow, evidence);
  }

  /**
   * List disputes (active and/or historical)
   * @param active - true for active, false for historical, undefined for both
   */
  public async listDisputes(
    active?: boolean
  ): Promise<{ active: EscrowTX[]; historical: any[] }> {
    this.ensureInitialized();
    return await this.seeker!.listDisputes(active);
  }

  /**
   * Cancel a contract before bid acceptance
   * @param escrow - The escrow contract to cancel
   */
  public async cancelContract(escrow: EscrowTX): Promise<void> {
    this.ensureInitialized();
    await this.seeker!.cancelBeforeAccept(escrow);
  }

  /**
   * Increase the bounty amount
   * @param escrow - The escrow contract
   * @param amount - Amount to increase by in satoshis
   */
  public async increaseBounty(escrow: EscrowTX, amount: number): Promise<void> {
    this.ensureInitialized();
    await this.seeker!.increaseBounty(escrow, amount);
  }

  /**
   * Reclaim funds after dispute resolution
   * @param escrow - The escrow contract
   * @param reconstitute - Whether to create a new contract with same parameters
   */
  public async reclaimAfterDispute(
    escrow: EscrowTX,
    reconstitute?: boolean
  ): Promise<void> {
    this.ensureInitialized();
    await this.seeker!.reclaimAfterDispute(escrow, reconstitute);
  }

  /**
   * Cancel bid approval after delay expires
   * @param escrow - The escrow contract
   */
  public async cancelBidApproval(escrow: EscrowTX): Promise<void> {
    this.ensureInitialized();
    await this.seeker!.cancelBidApprovalAfterDelay(escrow);
  }

  /**
   * Reset the service (used when disconnecting wallet)
   */
  public reset(): void {
    this.seeker = null;
  }
}

// Export the singleton instance
export const seekerService = SeekerService.getInstance();
