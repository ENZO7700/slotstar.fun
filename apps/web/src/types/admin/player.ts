export type KycStatus = "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";
export type VipTier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND";
export type PlayerStatus = "ACTIVE" | "SUSPENDED" | "SELF_EXCLUDED";

export interface PlayerLimits {
  dailyDepositLimit: number | null;
  weeklyDepositLimit: number | null;
  selfExclusionUntil: string | null;
}

export interface KycDocument {
  id: string;
  type: "ID_CARD" | "DRIVERS_LICENSE" | "PASSPORT";
  status: KycStatus;
  uploadedAt: string;
  fileName: string;
}

export interface Player {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  status: PlayerStatus;
  kycStatus: KycStatus;
  vipTier: VipTier;
  realBalance: number;
  bonusBalance: number;
  country: string;
  createdAt: string;
  lastLoginAt: string;
  limits: PlayerLimits;
  kycDocuments: KycDocument[];
  loginIps: string[];
}
