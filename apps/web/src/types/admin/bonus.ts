export type BonusType =
  | "DEPOSIT_MATCH"
  | "FREE_SPINS"
  | "NO_DEPOSIT"
  | "CASHBACK";

export type CampaignStatus = "ACTIVE" | "PAUSED" | "EXPIRED";

export interface BonusCampaign {
  id: string;
  name: string;
  type: BonusType;
  promoCode: string;
  spinCount?: number;
  betValue?: number;
  gameId?: string;
  gameTitle?: string;
  matchPercent?: number;
  cashbackPercent?: number;
  wageringRequirement: number;
  expiryDays: number;
  redemptions: number;
  maxRedemptions: number;
  status: CampaignStatus;
  createdAt: string;
}

export type FreeSpinStatus = "ACTIVE" | "COMPLETED" | "EXPIRED";

export interface FreeSpinGrant {
  id: string;
  playerId: string;
  gameId: string;
  gameTitle: string;
  spinCount: number;
  remainingSpins: number;
  betValue: number;
  wageringRequirement: number;
  wageringCompleted: number;
  status: FreeSpinStatus;
  expiresAt: string;
  grantedAt: string;
  grantedBy: string;
}
