"use server";

import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import type {
  AdminRole,
  AuditAction,
  BonusCampaign,
  BonusType,
  GameAdminStatus,
  GameTag,
} from "@/types/admin";
import { ADMIN_SESSION_COOKIE } from "@/types/admin";
import {
  formatTs,
  getAdminSnapshot,
  mutateAdminStore,
  nextId,
} from "@/lib/admin/admin-store";
import {
  canApproveWithdrawals,
  canGrantFreeSpins,
  canMutateBalance,
} from "@/lib/admin/roles";
import {
  createSessionPayload,
  DEMO_ADMINS,
  encodeSession,
  getServerSession,
} from "@/lib/admin/session";

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
}

async function appendAudit(input: {
  action: AuditAction;
  targetPlayerId: string;
  details: string;
  oldValue?: string;
  newValue?: string;
}) {
  const session = await getServerSession();
  if (!session) return;
  const ip = await clientIp();
  mutateAdminStore((store) => {
    store.auditLogs.unshift({
      id: nextId("AUD"),
      adminUsername: session.username,
      adminRole: session.role,
      action: input.action,
      targetPlayerId: input.targetPlayerId,
      details: input.details,
      oldValue: input.oldValue,
      newValue: input.newValue,
      ipAddress: ip,
      timestamp: formatTs(),
    });
  });
}

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") || "");
  const password = String(formData.get("password") || "");
  const roleOverride = String(formData.get("role") || "") as AdminRole | "";

  const user =
    DEMO_ADMINS.find((a) => a.username === username && a.password === password) ||
    DEMO_ADMINS.find((a) => a.role === roleOverride && password === "nexus");

  if (!user && !(roleOverride && password === "nexus")) {
    return { success: false as const, message: "Invalid credentials" };
  }

  const resolved = user ?? {
    userId: "ADM-DEMO",
    username: `Demo_${roleOverride}`,
    role: roleOverride as AdminRole,
  };

  const session = createSessionPayload(
    resolved.userId,
    resolved.username,
    resolved.role
  );
  const jar = await cookies();
  jar.set(ADMIN_SESSION_COOKIE, encodeSession(session), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  const ip = await clientIp();
  mutateAdminStore((store) => {
    store.auditLogs.unshift({
      id: nextId("AUD"),
      adminUsername: resolved.username,
      adminRole: resolved.role,
      action: "LOGIN",
      targetPlayerId: "-",
      details: `Admin login as ${resolved.role}`,
      ipAddress: ip,
      timestamp: formatTs(),
    });
  });

  return { success: true as const, role: resolved.role };
}

export async function logoutAction() {
  const jar = await cookies();
  jar.delete(ADMIN_SESSION_COOKIE);
  return { success: true as const };
}

export async function switchRoleAction(role: AdminRole) {
  const session = await getServerSession();
  if (!session) return { success: false as const, message: "Not authenticated" };
  const next = createSessionPayload(session.userId, session.username, role);
  const jar = await cookies();
  jar.set(ADMIN_SESSION_COOKIE, encodeSession(next), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return { success: true as const, role };
}

export async function getAdminDataAction() {
  return getAdminSnapshot();
}

export async function updatePlayerBalanceAction(
  playerId: string,
  amount: number,
  type: "REAL" | "BONUS",
  reason: string
) {
  const session = await getServerSession();
  if (!session) return { success: false as const, message: "Unauthorized" };
  if (!canMutateBalance(session.role)) {
    return { success: false as const, message: "Role cannot mutate balances" };
  }

  await new Promise((r) => setTimeout(r, 250));

  let oldValue = "";
  let newValue = "";
  mutateAdminStore((store) => {
    const player = store.players.find((p) => p.id === playerId);
    if (!player) return;
    if (type === "REAL") {
      oldValue = `RealBalance: €${player.realBalance.toFixed(2)}`;
      player.realBalance = Number((player.realBalance + amount).toFixed(2));
      newValue = `RealBalance: €${player.realBalance.toFixed(2)}`;
    } else {
      oldValue = `BonusBalance: €${player.bonusBalance.toFixed(2)}`;
      player.bonusBalance = Number((player.bonusBalance + amount).toFixed(2));
      newValue = `BonusBalance: €${player.bonusBalance.toFixed(2)}`;
    }
    store.transactions.unshift({
      id: nextId("TX"),
      playerId,
      username: player.username,
      type: "ADJUSTMENT",
      amount,
      method: "SEPA",
      status: "COMPLETED",
      createdAt: new Date().toISOString(),
      note: reason,
    });
  });

  await appendAudit({
    action: "BALANCE_CREDIT",
    targetPlayerId: playerId,
    details: `${type} balance adjusted ${amount >= 0 ? "+" : ""}€${amount.toFixed(2)} (${reason})`,
    oldValue,
    newValue,
  });

  revalidatePath(`/admin/players/${playerId}`);
  revalidatePath("/admin/finance");
  revalidatePath("/admin/audit-logs");
  return { success: true as const, message: "Balance updated" };
}

export async function suspendPlayerAction(playerId: string, suspend: boolean) {
  const session = await getServerSession();
  if (!session) return { success: false as const, message: "Unauthorized" };
  if (session.role === "SUPPORT_AGENT" || session.role === "FINANCE_ADMIN") {
    return { success: false as const, message: "Insufficient permissions" };
  }

  let username = playerId;
  mutateAdminStore((store) => {
    const player = store.players.find((p) => p.id === playerId);
    if (!player) return;
    username = `${player.id} (${player.username})`;
    player.status = suspend ? "SUSPENDED" : "ACTIVE";
  });

  await appendAudit({
    action: suspend ? "PLAYER_BAN" : "PLAYER_UNBAN",
    targetPlayerId: username,
    details: suspend ? "Player account suspended" : "Player account reactivated",
    oldValue: suspend ? "ACTIVE" : "SUSPENDED",
    newValue: suspend ? "SUSPENDED" : "ACTIVE",
  });

  revalidatePath(`/admin/players/${playerId}`);
  revalidatePath("/admin/players");
  revalidatePath("/admin/audit-logs");
  return { success: true as const };
}

export async function approveKycAction(playerId: string) {
  const session = await getServerSession();
  if (!session) return { success: false as const, message: "Unauthorized" };
  if (session.role === "SUPPORT_AGENT" || session.role === "FINANCE_ADMIN") {
    return { success: false as const, message: "Insufficient permissions" };
  }

  mutateAdminStore((store) => {
    const player = store.players.find((p) => p.id === playerId);
    if (!player) return;
    player.kycStatus = "VERIFIED";
    player.kycDocuments = player.kycDocuments.map((d) => ({
      ...d,
      status: "VERIFIED" as const,
    }));
  });

  await appendAudit({
    action: "KYC_APPROVED",
    targetPlayerId: playerId,
    details: "KYC documents approved",
    oldValue: "PENDING/UNVERIFIED",
    newValue: "VERIFIED",
  });

  revalidatePath(`/admin/players/${playerId}`);
  revalidatePath("/admin/audit-logs");
  return { success: true as const };
}

export async function grantFreeSpinsAction(input: {
  playerId: string;
  gameId: string;
  gameTitle: string;
  spinCount: number;
  betValue: number;
  wageringRequirement: number;
  expiryDays: number;
}) {
  const session = await getServerSession();
  if (!session) return { success: false as const, message: "Unauthorized" };
  if (!canGrantFreeSpins(session.role, input.spinCount)) {
    return {
      success: false as const,
      message: "Support agents may grant max 20 free spins",
    };
  }

  const expires = new Date();
  expires.setDate(expires.getDate() + input.expiryDays);

  mutateAdminStore((store) => {
    store.freeSpins.unshift({
      id: nextId("FS"),
      playerId: input.playerId,
      gameId: input.gameId,
      gameTitle: input.gameTitle,
      spinCount: input.spinCount,
      remainingSpins: input.spinCount,
      betValue: input.betValue,
      wageringRequirement: input.wageringRequirement,
      wageringCompleted: 0,
      status: "ACTIVE",
      expiresAt: expires.toISOString(),
      grantedAt: new Date().toISOString(),
      grantedBy: session.username,
    });
  });

  await appendAudit({
    action: "FREE_SPINS_ISSUED",
    targetPlayerId: input.playerId,
    details: `Issued ${input.spinCount} FS on ${input.gameTitle} @ €${input.betValue} (${input.wageringRequirement}x WR)`,
  });

  revalidatePath(`/admin/players/${input.playerId}`);
  revalidatePath("/admin/promotions");
  revalidatePath("/admin/audit-logs");
  return { success: true as const };
}

export async function createCampaignAction(input: {
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
  maxRedemptions: number;
}) {
  const session = await getServerSession();
  if (!session) return { success: false as const, message: "Unauthorized" };

  const campaign: BonusCampaign = {
    id: nextId("CMP"),
    name: input.name,
    type: input.type,
    promoCode: input.promoCode.toUpperCase(),
    spinCount: input.spinCount,
    betValue: input.betValue,
    gameId: input.gameId,
    gameTitle: input.gameTitle,
    matchPercent: input.matchPercent,
    cashbackPercent: input.cashbackPercent,
    wageringRequirement: input.wageringRequirement,
    expiryDays: input.expiryDays,
    redemptions: 0,
    maxRedemptions: input.maxRedemptions,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
  };

  mutateAdminStore((store) => {
    store.campaigns.unshift(campaign);
  });

  await appendAudit({
    action: "CAMPAIGN_CREATED",
    targetPlayerId: "-",
    details: `Created campaign ${campaign.name} (${campaign.promoCode})`,
  });

  revalidatePath("/admin/bonuses");
  revalidatePath("/admin/promotions");
  revalidatePath("/admin");
  revalidatePath("/admin/audit-logs");
  return { success: true as const, campaign };
}

export async function toggleCampaignAction(campaignId: string) {
  const session = await getServerSession();
  if (!session) return { success: false as const, message: "Unauthorized" };

  let details = "";
  mutateAdminStore((store) => {
    const c = store.campaigns.find((x) => x.id === campaignId);
    if (!c || c.status === "EXPIRED") return;
    const prev = c.status;
    c.status = c.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
    details = `${c.name}: ${prev} → ${c.status}`;
  });

  await appendAudit({
    action: "CAMPAIGN_TOGGLED",
    targetPlayerId: "-",
    details,
  });

  revalidatePath("/admin/promotions");
  revalidatePath("/admin/bonuses");
  revalidatePath("/admin");
  revalidatePath("/admin/audit-logs");
  return { success: true as const };
}

export async function approveWithdrawalAction(
  requestId: string,
  totpCode: string
) {
  const session = await getServerSession();
  if (!session) return { success: false as const, message: "Unauthorized" };
  if (!canApproveWithdrawals(session.role)) {
    return { success: false as const, message: "Insufficient permissions" };
  }
  if (totpCode !== "123456") {
    return { success: false as const, message: "Invalid 2FA code (use 123456)" };
  }

  await new Promise((r) => setTimeout(r, 300));

  let target = requestId;
  let details = "";
  mutateAdminStore((store) => {
    const w = store.withdrawals.find((x) => x.id === requestId);
    if (!w) return;
    w.status = "APPROVED";
    target = `${w.playerId} (${w.username})`;
    details = `Approved €${w.amount.toFixed(2)} ${w.method} withdrawal (Risk Score: ${w.riskScore})`;
    store.transactions.unshift({
      id: nextId("TX"),
      playerId: w.playerId,
      username: w.username,
      type: "WITHDRAWAL",
      amount: w.amount,
      method: w.method,
      status: "COMPLETED",
      createdAt: new Date().toISOString(),
      note: "Approved via Risk Queue",
    });
  });

  await appendAudit({
    action: "WITHDRAWAL_APPROVED",
    targetPlayerId: target,
    details,
  });

  revalidatePath("/admin/risk/withdrawals");
  revalidatePath("/admin/finance");
  revalidatePath("/admin/audit-logs");
  return { success: true as const, requestId };
}

export async function flagWithdrawalAction(requestId: string) {
  const session = await getServerSession();
  if (!session) return { success: false as const, message: "Unauthorized" };

  mutateAdminStore((store) => {
    const w = store.withdrawals.find((x) => x.id === requestId);
    if (!w) return;
    w.status = "FLAGGED";
  });

  await appendAudit({
    action: "WITHDRAWAL_FLAGGED",
    targetPlayerId: requestId,
    details: `Withdrawal ${requestId} flagged for manual review`,
  });

  revalidatePath("/admin/risk/withdrawals");
  revalidatePath("/admin/audit-logs");
  return { success: true as const };
}

export async function rejectWithdrawalAction(requestId: string) {
  const session = await getServerSession();
  if (!session) return { success: false as const, message: "Unauthorized" };
  if (!canApproveWithdrawals(session.role)) {
    return { success: false as const, message: "Insufficient permissions" };
  }

  let target = requestId;
  let details = "";
  mutateAdminStore((store) => {
    const w = store.withdrawals.find((x) => x.id === requestId);
    if (!w) return;
    w.status = "REJECTED";
    const player = store.players.find((p) => p.id === w.playerId);
    if (player) {
      player.realBalance = Number((player.realBalance + w.amount).toFixed(2));
    }
    target = `${w.playerId} (${w.username})`;
    details = `Rejected & refunded €${w.amount.toFixed(2)} ${w.method}`;
  });

  await appendAudit({
    action: "WITHDRAWAL_REJECTED",
    targetPlayerId: target,
    details,
  });

  revalidatePath("/admin/risk/withdrawals");
  revalidatePath("/admin/finance");
  revalidatePath("/admin/audit-logs");
  return { success: true as const };
}

export async function setGameStatusAction(
  gameId: string,
  status: GameAdminStatus
) {
  const session = await getServerSession();
  if (!session) return { success: false as const, message: "Unauthorized" };
  if (session.role !== "SUPER_ADMIN") {
    return { success: false as const, message: "Only SuperAdmin can change game status" };
  }

  let oldValue = "";
  let title = gameId;
  mutateAdminStore((store) => {
    const g = store.games.find((x) => x.id === gameId);
    if (!g) return;
    oldValue = g.status;
    g.status = status;
    title = g.title;
  });

  await appendAudit({
    action: "GAME_STATUS_CHANGED",
    targetPlayerId: "-",
    details: `Game ${title} status changed`,
    oldValue,
    newValue: status,
  });

  revalidatePath("/admin/games");
  revalidatePath("/admin/audit-logs");
  return { success: true as const };
}

export async function toggleGameTagAction(gameId: string, tag: GameTag) {
  const session = await getServerSession();
  if (!session) return { success: false as const, message: "Unauthorized" };
  if (session.role !== "SUPER_ADMIN") {
    return { success: false as const, message: "Only SuperAdmin can edit tags" };
  }

  mutateAdminStore((store) => {
    const g = store.games.find((x) => x.id === gameId);
    if (!g) return;
    if (g.tags.includes(tag)) {
      g.tags = g.tags.filter((t) => t !== tag);
    } else {
      g.tags = [...g.tags, tag];
    }
  });

  revalidatePath("/admin/games");
  return { success: true as const };
}

export async function pushLiveBetTickAction() {
  mutateAdminStore((store) => {
    const player = store.players[Math.floor(Math.random() * store.players.length)];
    const game = store.games.filter((g) => g.status === "ACTIVE")[
      Math.floor(Math.random() * 3)
    ] ?? store.games[0];
    const bet = [0.2, 0.5, 1, 2, 5][Math.floor(Math.random() * 5)];
    const big = Math.random() > 0.92;
    const mult = big ? 100 + Math.random() * 80 : 0.1 + Math.random() * 8;
    const event = {
      id: nextId("LIVE"),
      playerId: player.id,
      username: player.username,
      gameTitle: game.title,
      betAmount: bet,
      winAmount: Number((bet * mult).toFixed(2)),
      multiplier: Number(mult.toFixed(2)),
      suspicious: Math.random() > 0.95,
      timestamp: new Date().toISOString(),
    };
    store.liveBets = [event, ...store.liveBets].slice(0, 40);
  });
  return { success: true as const, liveBets: getAdminSnapshot().liveBets };
}
