export type PaymentMethod = "VISA" | "CRYPTO" | "SEPA" | "MASTERCARD";
export type TransactionType = "DEPOSIT" | "WITHDRAWAL" | "ADJUSTMENT" | "BONUS_CREDIT";
export type TransactionStatus = "PENDING" | "COMPLETED" | "REJECTED" | "FLAGGED";

export interface Transaction {
  id: string;
  playerId: string;
  username: string;
  type: TransactionType;
  amount: number;
  method: PaymentMethod;
  status: TransactionStatus;
  createdAt: string;
  note?: string;
}

export interface WithdrawalRequest {
  id: string;
  playerId: string;
  username: string;
  amount: number;
  method: PaymentMethod;
  riskScore: number;
  riskFlags: string[];
  status: "PENDING" | "APPROVED" | "REJECTED" | "FLAGGED";
  createdAt: string;
}

export interface LiveBetEvent {
  id: string;
  playerId: string;
  username: string;
  gameTitle: string;
  betAmount: number;
  winAmount: number;
  multiplier: number;
  suspicious: boolean;
  timestamp: string;
}

export interface BetHistoryItem {
  id: string;
  playerId: string;
  gameTitle: string;
  betAmount: number;
  winAmount: number;
  createdAt: string;
}
