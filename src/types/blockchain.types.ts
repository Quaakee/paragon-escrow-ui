/**
 * Blockchain type definitions
 * Matching the backend types for consistency
 */

import type { BEEF, PubKeyHex, WalletProtocol } from '@bsv/sdk';

export interface Bid {
  furnisherKey: string;
  plans: string;
  bidAmount: number;
  bond: number;
  timeOfBid: number;
  timeRequired: number;
}

export interface EscrowRecord {
  txid: string;
  outputIndex: number;
  minAllowableBid: number;
  escrowServiceFeeBasisPoints: number;
  platformAuthorizationRequired: boolean;
  escrowMustBeFullyDecisive: boolean;
  bountySolversNeedApproval: boolean;
  furnisherBondingMode: 'forbidden' | 'optional' | 'required';
  requiredBondAmount: number;
  maxWorkStartDelay: number;
  maxWorkApprovalDelay: number;
  delayUnit: 'blocks' | 'seconds';
  workCompletionDeadline: number;
  approvalMode: 'seeker' | 'platform' | 'seeker-or-platform';
  contractType: 'bid' | 'bounty';
  contractSurvivesAdverseFurnisherDisputeResolution: boolean;
  bountyIncreaseAllowanceMode:
    | 'forbidden'
    | 'by-seeker'
    | 'by-platform'
    | 'by-seeker-or-platform'
    | 'by-anyone';
  bountyIncreaseCutoffPoint:
    | 'bid-acceptance'
    | 'start-of-work'
    | 'submission-of-work'
    | 'acceptance-of-work';
  bids: Array<Bid>;
  seekerKey: string;
  platformKey: string;
  acceptedBid: Bid;
  bidAcceptedBy: 'platform' | 'seeker' | 'not-yet-accepted';
  workCompletionTime: number;
  status:
    | 'initial'
    | 'bid-accepted'
    | 'work-started'
    | 'work-submitted'
    | 'resolved'
    | 'disputed-by-seeker'
    | 'disputed-by-furnisher';
  workDescription: string;
  workCompletionDescription: string;
}

export interface EscrowTX {
  record: EscrowRecord;
  contract: any; // EscrowContract
  beef: BEEF;
  script: string;
  satoshis: number;
}

export interface UTXOReference {
  txid: string;
  outputIndex: number;
}

export interface GlobalConfig {
  minAllowableBid: number;
  escrowServiceFeeBasisPoints: number;
  platformAuthorizationRequired: boolean;
  escrowMustBeFullyDecisive: boolean;
  bountySolversNeedApproval: boolean;
  furnisherBondingMode: 'forbidden' | 'optional' | 'required';
  requiredBondAmount: number;
  maxWorkStartDelay: number;
  maxWorkApprovalDelay: number;
  delayUnit: 'blocks' | 'seconds';
  approvalMode: 'seeker' | 'platform' | 'seeker-or-platform';
  contractType: 'bid' | 'bounty';
  contractSurvivesAdverseFurnisherDisputeResolution: boolean;
  bountyIncreaseAllowanceMode:
    | 'forbidden'
    | 'by-seeker'
    | 'by-platform'
    | 'by-seeker-or-platform'
    | 'by-anyone';
  bountyIncreaseCutoffPoint:
    | 'bid-acceptance'
    | 'start-of-work'
    | 'submission-of-work'
    | 'acceptance-of-work';
  platformKey: PubKeyHex;
  topic: string;
  service: string;
  keyDerivationProtocol: WalletProtocol;
  networkPreset: 'mainnet' | 'testnet' | 'local';
}

/**
 * Frontend-specific type extensions
 */

export interface WalletInfo {
  isConnected: boolean;
  publicKey: string | null;
  identityKey: string | null;
}

export interface TransactionStatus {
  txid: string;
  status: 'pending' | 'confirmed' | 'failed';
  confirmations?: number;
  error?: string;
}

export interface BroadcastResult {
  txid: string;
  status: string;
  message?: string;
}

export type ContractStatus =
  | 'initial'
  | 'bid-accepted'
  | 'work-started'
  | 'work-submitted'
  | 'resolved'
  | 'disputed-by-seeker'
  | 'disputed-by-furnisher';

export type UserRole = 'seeker' | 'furnisher' | 'platform';

export type ContractType = 'bid' | 'bounty';

export type ApprovalMode = 'seeker' | 'platform' | 'seeker-or-platform';

export type BondingMode = 'forbidden' | 'optional' | 'required';

export type DelayUnit = 'blocks' | 'seconds';

export type BountyIncreaseMode =
  | 'forbidden'
  | 'by-seeker'
  | 'by-platform'
  | 'by-seeker-or-platform'
  | 'by-anyone';

export type BountyCutoffPoint =
  | 'bid-acceptance'
  | 'start-of-work'
  | 'submission-of-work'
  | 'acceptance-of-work';
