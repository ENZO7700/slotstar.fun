import type { KycStatus, PaymentMethod, Player } from "@/types/admin";

export interface RiskInput {
  kycStatus: KycStatus;
  method: PaymentMethod;
  depositMethod?: PaymentMethod;
  winRatio: number;
  wageredDepositRatio: number;
  isNewWallet: boolean;
}

export function calculateRiskScore(input: RiskInput): {
  score: number;
  flags: string[];
} {
  let score = 10;
  const flags: string[] = [];

  if (input.kycStatus !== "VERIFIED") {
    score += 35;
    flags.push("Unverified_KYC");
  }
  if (input.isNewWallet) {
    score += 25;
    flags.push("New_Wallet");
  }
  if (input.depositMethod && input.depositMethod !== input.method) {
    score += 15;
    flags.push("Method_Mismatch");
  } else if (input.depositMethod && input.depositMethod === input.method) {
    score -= 8;
  }
  if (input.wageredDepositRatio < 1) {
    score += 20;
    flags.push("Unwagered_Deposit");
  }
  if (input.winRatio > 2.5) {
    score += 18;
    flags.push("High_Win_Ratio");
  }

  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    flags,
  };
}

export function riskFromPlayer(
  player: Player,
  method: PaymentMethod,
  opts?: Partial<RiskInput>
) {
  return calculateRiskScore({
    kycStatus: player.kycStatus,
    method,
    depositMethod: opts?.depositMethod ?? method,
    winRatio: opts?.winRatio ?? 1.2,
    wageredDepositRatio: opts?.wageredDepositRatio ?? 1.4,
    isNewWallet: opts?.isNewWallet ?? false,
  });
}

export function riskTone(score: number): "low" | "mid" | "high" {
  if (score < 30) return "low";
  if (score > 70) return "high";
  return "mid";
}
