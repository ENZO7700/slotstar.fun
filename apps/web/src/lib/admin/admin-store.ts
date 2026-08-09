import type {
  AuditEntry,
  BetHistoryItem,
  BonusCampaign,
  FreeSpinGrant,
  GameConfig,
  LiveBetEvent,
  Player,
  Transaction,
  WithdrawalRequest,
} from "@/types/admin";

export interface AdminStoreSnapshot {
  players: Player[];
  transactions: Transaction[];
  withdrawals: WithdrawalRequest[];
  campaigns: BonusCampaign[];
  freeSpins: FreeSpinGrant[];
  games: GameConfig[];
  bets: BetHistoryItem[];
  liveBets: LiveBetEvent[];
  auditLogs: AuditEntry[];
  kpi: {
    ggrToday: number;
    ggr30d: number[];
    livePlayers: number;
    depositsToday: number;
    withdrawalsToday: number;
    activeCampaigns: number;
  };
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function seedPlayers(): Player[] {
  return [
    {
      id: "P102",
      username: "WhaleHunter77",
      email: "whale@example.com",
      avatarUrl: "https://api.dicebear.com/9.x/identicon/svg?seed=WhaleHunter77",
      status: "ACTIVE",
      kycStatus: "VERIFIED",
      vipTier: "DIAMOND",
      realBalance: 12450.5,
      bonusBalance: 320,
      country: "SK",
      createdAt: daysAgo(420),
      lastLoginAt: daysAgo(0),
      limits: { dailyDepositLimit: 5000, weeklyDepositLimit: 20000, selfExclusionUntil: null },
      kycDocuments: [
        {
          id: "KYC-1",
          type: "ID_CARD",
          status: "VERIFIED",
          uploadedAt: daysAgo(30),
          fileName: "op-whale.pdf",
        },
      ],
      loginIps: ["193.87.12.4", "85.237.10.2"],
    },
    {
      id: "P405",
      username: "CasualJano",
      email: "jano@example.sk",
      avatarUrl: "https://api.dicebear.com/9.x/identicon/svg?seed=CasualJano",
      status: "ACTIVE",
      kycStatus: "VERIFIED",
      vipTier: "SILVER",
      realBalance: 86.2,
      bonusBalance: 10,
      country: "SK",
      createdAt: daysAgo(90),
      lastLoginAt: daysAgo(1),
      limits: { dailyDepositLimit: 200, weeklyDepositLimit: 500, selfExclusionUntil: null },
      kycDocuments: [
        {
          id: "KYC-2",
          type: "DRIVERS_LICENSE",
          status: "VERIFIED",
          uploadedAt: daysAgo(60),
          fileName: "vp-jano.jpg",
        },
      ],
      loginIps: ["85.237.44.12"],
    },
    {
      id: "P218",
      username: "SpinQueen",
      email: "queen@slots.io",
      avatarUrl: "https://api.dicebear.com/9.x/identicon/svg?seed=SpinQueen",
      status: "ACTIVE",
      kycStatus: "PENDING",
      vipTier: "GOLD",
      realBalance: 540,
      bonusBalance: 150,
      country: "CZ",
      createdAt: daysAgo(45),
      lastLoginAt: daysAgo(0),
      limits: { dailyDepositLimit: 1000, weeklyDepositLimit: 3000, selfExclusionUntil: null },
      kycDocuments: [
        {
          id: "KYC-3",
          type: "PASSPORT",
          status: "PENDING",
          uploadedAt: daysAgo(1),
          fileName: "passport-queen.pdf",
        },
      ],
      loginIps: ["78.12.44.9", "78.12.44.10"],
    },
    {
      id: "P077",
      username: "RiskyRex",
      email: "rex@darkmail.com",
      avatarUrl: "https://api.dicebear.com/9.x/identicon/svg?seed=RiskyRex",
      status: "ACTIVE",
      kycStatus: "UNVERIFIED",
      vipTier: "BRONZE",
      realBalance: 2100,
      bonusBalance: 500,
      country: "HU",
      createdAt: daysAgo(7),
      lastLoginAt: daysAgo(0),
      limits: { dailyDepositLimit: null, weeklyDepositLimit: null, selfExclusionUntil: null },
      kycDocuments: [],
      loginIps: ["45.33.12.8", "185.199.108.1", "104.21.12.3"],
    },
    {
      id: "P501",
      username: "LuckyKatka",
      email: "katka@mail.sk",
      avatarUrl: "https://api.dicebear.com/9.x/identicon/svg?seed=LuckyKatka",
      status: "SUSPENDED",
      kycStatus: "REJECTED",
      vipTier: "BRONZE",
      realBalance: 0,
      bonusBalance: 0,
      country: "SK",
      createdAt: daysAgo(200),
      lastLoginAt: daysAgo(14),
      limits: {
        dailyDepositLimit: 50,
        weeklyDepositLimit: 100,
        selfExclusionUntil: daysAgo(-30),
      },
      kycDocuments: [
        {
          id: "KYC-4",
          type: "ID_CARD",
          status: "REJECTED",
          uploadedAt: daysAgo(20),
          fileName: "blurry-id.jpg",
        },
      ],
      loginIps: ["192.168.1.10"],
    },
    {
      id: "P333",
      username: "NovaSlots",
      email: "nova@play.eu",
      avatarUrl: "https://api.dicebear.com/9.x/identicon/svg?seed=NovaSlots",
      status: "ACTIVE",
      kycStatus: "VERIFIED",
      vipTier: "PLATINUM",
      realBalance: 3200,
      bonusBalance: 80,
      country: "AT",
      createdAt: daysAgo(310),
      lastLoginAt: daysAgo(0),
      limits: { dailyDepositLimit: 2500, weeklyDepositLimit: 10000, selfExclusionUntil: null },
      kycDocuments: [
        {
          id: "KYC-5",
          type: "ID_CARD",
          status: "VERIFIED",
          uploadedAt: daysAgo(100),
          fileName: "id-nova.pdf",
        },
      ],
      loginIps: ["213.81.144.2"],
    },
    {
      id: "P612",
      username: "BotSuspect_01",
      email: "bs01@temp.mail",
      avatarUrl: "https://api.dicebear.com/9.x/identicon/svg?seed=BotSuspect",
      status: "ACTIVE",
      kycStatus: "UNVERIFIED",
      vipTier: "BRONZE",
      realBalance: 45,
      bonusBalance: 200,
      country: "PL",
      createdAt: daysAgo(2),
      lastLoginAt: daysAgo(0),
      limits: { dailyDepositLimit: null, weeklyDepositLimit: null, selfExclusionUntil: null },
      kycDocuments: [],
      loginIps: ["91.200.12.55"],
    },
    {
      id: "P888",
      username: "GoldFinger",
      email: "gold@vip.io",
      avatarUrl: "https://api.dicebear.com/9.x/identicon/svg?seed=GoldFinger",
      status: "ACTIVE",
      kycStatus: "VERIFIED",
      vipTier: "GOLD",
      realBalance: 890,
      bonusBalance: 0,
      country: "DE",
      createdAt: daysAgo(150),
      lastLoginAt: daysAgo(2),
      limits: { dailyDepositLimit: 1500, weeklyDepositLimit: 5000, selfExclusionUntil: null },
      kycDocuments: [
        {
          id: "KYC-6",
          type: "PASSPORT",
          status: "VERIFIED",
          uploadedAt: daysAgo(80),
          fileName: "pass-gold.pdf",
        },
      ],
      loginIps: ["80.12.33.4"],
    },
  ];
}

function seedGames(): GameConfig[] {
  return [
    {
      id: "G-101",
      externalGameId: 101,
      title: "Gates of Olympus",
      provider: "Pragmatic Play",
      rtp: 96.5,
      status: "ACTIVE",
      tags: ["Featured", "Popular", "Gold Tier"],
      playCount30d: 18420,
    },
    {
      id: "G-102",
      externalGameId: 102,
      title: "Sweet Bonanza",
      provider: "Pragmatic Play",
      rtp: 96.48,
      status: "ACTIVE",
      tags: ["Featured", "Bonus Buy"],
      playCount30d: 15210,
    },
    {
      id: "G-103",
      externalGameId: 103,
      title: "Wanted Dead or a Wild",
      provider: "Hacksaw Gaming",
      rtp: 96.38,
      status: "ACTIVE",
      tags: ["Popular"],
      playCount30d: 9840,
    },
    {
      id: "G-104",
      externalGameId: 104,
      title: "San Quentin xWays",
      provider: "Nolimit City",
      rtp: 96.03,
      status: "MAINTENANCE",
      tags: ["Bonus Buy"],
      playCount30d: 4210,
    },
    {
      id: "G-105",
      externalGameId: 105,
      title: "Book of Dead",
      provider: "Play'n GO",
      rtp: 96.21,
      status: "ACTIVE",
      tags: ["Popular"],
      playCount30d: 12100,
    },
    {
      id: "G-106",
      externalGameId: 106,
      title: "Starburst",
      provider: "NetEnt",
      rtp: 96.09,
      status: "ACTIVE",
      tags: ["New", "Featured"],
      playCount30d: 7600,
    },
    {
      id: "G-107",
      externalGameId: 107,
      title: "Reactoonz",
      provider: "Play'n GO",
      rtp: 96.51,
      status: "DISABLED",
      tags: [],
      playCount30d: 2100,
    },
  ];
}

function createSeed(): AdminStoreSnapshot {
  const players = seedPlayers();
  const games = seedGames();

  const transactions: Transaction[] = [
    {
      id: "TX-9001",
      playerId: "P102",
      username: "WhaleHunter77",
      type: "DEPOSIT",
      amount: 2000,
      method: "VISA",
      status: "COMPLETED",
      createdAt: daysAgo(0),
    },
    {
      id: "TX-9002",
      playerId: "P405",
      username: "CasualJano",
      type: "WITHDRAWAL",
      amount: 120,
      method: "SEPA",
      status: "PENDING",
      createdAt: daysAgo(0),
    },
    {
      id: "TX-9003",
      playerId: "P077",
      username: "RiskyRex",
      type: "DEPOSIT",
      amount: 500,
      method: "CRYPTO",
      status: "COMPLETED",
      createdAt: daysAgo(1),
    },
    {
      id: "TX-9004",
      playerId: "P218",
      username: "SpinQueen",
      type: "DEPOSIT",
      amount: 250,
      method: "MASTERCARD",
      status: "COMPLETED",
      createdAt: daysAgo(0),
    },
    {
      id: "TX-9005",
      playerId: "P333",
      username: "NovaSlots",
      type: "WITHDRAWAL",
      amount: 800,
      method: "VISA",
      status: "COMPLETED",
      createdAt: daysAgo(2),
    },
    {
      id: "TX-9006",
      playerId: "P612",
      username: "BotSuspect_01",
      type: "DEPOSIT",
      amount: 50,
      method: "CRYPTO",
      status: "COMPLETED",
      createdAt: daysAgo(0),
    },
  ];

  const withdrawals: WithdrawalRequest[] = [
    {
      id: "WD-1001",
      playerId: "P405",
      username: "CasualJano",
      amount: 120,
      method: "SEPA",
      riskScore: 12,
      riskFlags: [],
      status: "PENDING",
      createdAt: daysAgo(0),
    },
    {
      id: "WD-1002",
      playerId: "P077",
      username: "RiskyRex",
      amount: 1800,
      method: "CRYPTO",
      riskScore: 88,
      riskFlags: ["Unverified_KYC", "New_Wallet", "High_Win_Ratio", "Unwagered_Deposit"],
      status: "PENDING",
      createdAt: daysAgo(0),
    },
    {
      id: "WD-1003",
      playerId: "P218",
      username: "SpinQueen",
      amount: 400,
      method: "VISA",
      riskScore: 52,
      riskFlags: ["Unverified_KYC"],
      status: "PENDING",
      createdAt: daysAgo(0),
    },
    {
      id: "WD-1004",
      playerId: "P612",
      username: "BotSuspect_01",
      amount: 40,
      method: "CRYPTO",
      riskScore: 76,
      riskFlags: ["Unverified_KYC", "New_Wallet", "Unwagered_Deposit"],
      status: "FLAGGED",
      createdAt: daysAgo(0),
    },
  ];

  const campaigns: BonusCampaign[] = [
    {
      id: "CMP-01",
      name: "Welcome Deposit 100%",
      type: "DEPOSIT_MATCH",
      promoCode: "WELCOME100",
      matchPercent: 100,
      wageringRequirement: 35,
      expiryDays: 14,
      redemptions: 842,
      maxRedemptions: 5000,
      status: "ACTIVE",
      createdAt: daysAgo(60),
    },
    {
      id: "CMP-02",
      name: "Olympus Free Spins",
      type: "FREE_SPINS",
      promoCode: "OLY50",
      spinCount: 50,
      betValue: 0.2,
      gameId: "G-101",
      gameTitle: "Gates of Olympus",
      wageringRequirement: 35,
      expiryDays: 7,
      redemptions: 312,
      maxRedemptions: 2000,
      status: "ACTIVE",
      createdAt: daysAgo(20),
    },
    {
      id: "CMP-03",
      name: "Weekend Cashback 10%",
      type: "CASHBACK",
      promoCode: "CASH10",
      cashbackPercent: 10,
      wageringRequirement: 5,
      expiryDays: 3,
      redemptions: 120,
      maxRedemptions: 1000,
      status: "PAUSED",
      createdAt: daysAgo(10),
    },
  ];

  const freeSpins: FreeSpinGrant[] = [
    {
      id: "FS-501",
      playerId: "P102",
      gameId: "G-101",
      gameTitle: "Gates of Olympus",
      spinCount: 50,
      remainingSpins: 22,
      betValue: 0.5,
      wageringRequirement: 35,
      wageringCompleted: 12,
      status: "ACTIVE",
      expiresAt: daysAgo(-5),
      grantedAt: daysAgo(2),
      grantedBy: "Alex_SuperAdmin",
    },
    {
      id: "FS-502",
      playerId: "P218",
      gameId: "G-106",
      gameTitle: "Starburst",
      spinCount: 20,
      remainingSpins: 20,
      betValue: 0.1,
      wageringRequirement: 30,
      wageringCompleted: 0,
      status: "ACTIVE",
      expiresAt: daysAgo(-3),
      grantedAt: daysAgo(0),
      grantedBy: "Eva_Support",
    },
  ];

  const bets: BetHistoryItem[] = [
    {
      id: "BET-1",
      playerId: "P102",
      gameTitle: "Gates of Olympus",
      betAmount: 5,
      winAmount: 420,
      createdAt: daysAgo(0),
    },
    {
      id: "BET-2",
      playerId: "P405",
      gameTitle: "Book of Dead",
      betAmount: 0.4,
      winAmount: 0,
      createdAt: daysAgo(0),
    },
    {
      id: "BET-3",
      playerId: "P333",
      gameTitle: "Sweet Bonanza",
      betAmount: 2,
      winAmount: 48,
      createdAt: daysAgo(1),
    },
  ];

  const liveBets: LiveBetEvent[] = Array.from({ length: 12 }).map((_, i) => {
    const p = players[i % players.length];
    const g = games[i % games.length];
    const bet = [0.2, 0.5, 1, 2, 5][i % 5];
    const mult = i % 7 === 0 ? 120 + i : 0.2 + (i % 9) * 0.7;
    const win = Number((bet * mult).toFixed(2));
    return {
      id: `LIVE-${1000 + i}`,
      playerId: p.id,
      username: p.username,
      gameTitle: g.title,
      betAmount: bet,
      winAmount: win,
      multiplier: Number(mult.toFixed(2)),
      suspicious: i % 11 === 0,
      timestamp: new Date(Date.now() - i * 4000).toISOString(),
    };
  });

  const auditLogs: AuditEntry[] = [
    {
      id: "AUD-88201",
      adminUsername: "Alex_SuperAdmin",
      adminRole: "SUPER_ADMIN",
      action: "BALANCE_CREDIT",
      targetPlayerId: "P102 (WhaleHunter77)",
      details: "Real balance adjusted +€500.00 (Reason: VIP Compensation)",
      oldValue: "RealBalance: €11950.50",
      newValue: "RealBalance: €12450.50",
      ipAddress: "193.87.12.4",
      timestamp: "2026-08-09 11:42:05",
    },
    {
      id: "AUD-88202",
      adminUsername: "Maros_RiskLead",
      adminRole: "RISK_MANAGER",
      action: "WITHDRAWAL_APPROVED",
      targetPlayerId: "P405 (CasualJano)",
      details: "Approved €120.00 SEPA withdrawal (Risk Score: 12)",
      ipAddress: "85.237.44.12",
      timestamp: "2026-08-09 11:50:18",
    },
  ];

  const ggr30d = Array.from({ length: 30 }).map((_, i) =>
    Math.round(18000 + Math.sin(i / 3) * 4000 + (i % 5) * 800)
  );

  return {
    players,
    transactions,
    withdrawals,
    campaigns,
    freeSpins,
    games,
    bets,
    liveBets,
    auditLogs,
    kpi: {
      ggrToday: 42850,
      ggr30d,
      livePlayers: 384,
      depositsToday: 31240,
      withdrawalsToday: 18420,
      activeCampaigns: campaigns.filter((c) => c.status === "ACTIVE").length,
    },
  };
}

const globalKey = "__NEXUS_ADMIN_STORE__";

function getStore(): AdminStoreSnapshot {
  const g = globalThis as typeof globalThis & {
    [globalKey]?: AdminStoreSnapshot;
  };
  if (!g[globalKey]) {
    g[globalKey] = createSeed();
  }
  return g[globalKey];
}

export function getAdminSnapshot(): AdminStoreSnapshot {
  const store = getStore();
  return structuredClone(store);
}

export function mutateAdminStore(
  mutator: (store: AdminStoreSnapshot) => void
): AdminStoreSnapshot {
  const store = getStore();
  mutator(store);
  store.kpi.activeCampaigns = store.campaigns.filter(
    (c) => c.status === "ACTIVE"
  ).length;
  return structuredClone(store);
}

export function nextId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
}

export function formatTs(date = new Date()): string {
  return date.toISOString().replace("T", " ").slice(0, 19);
}
