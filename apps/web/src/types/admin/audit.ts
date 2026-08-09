import type { AdminRole } from "./auth";

export type AuditAction =
  | "BALANCE_CREDIT"
  | "PLAYER_BAN"
  | "PLAYER_UNBAN"
  | "KYC_APPROVED"
  | "FREE_SPINS_ISSUED"
  | "CAMPAIGN_CREATED"
  | "CAMPAIGN_TOGGLED"
  | "WITHDRAWAL_APPROVED"
  | "WITHDRAWAL_REJECTED"
  | "WITHDRAWAL_FLAGGED"
  | "GAME_STATUS_CHANGED"
  | "LOGIN";

export interface AuditEntry {
  id: string;
  adminUsername: string;
  adminRole: AdminRole;
  action: AuditAction;
  targetPlayerId: string;
  details: string;
  oldValue?: string;
  newValue?: string;
  ipAddress: string;
  timestamp: string;
}
