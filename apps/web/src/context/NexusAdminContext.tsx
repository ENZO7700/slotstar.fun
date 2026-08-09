"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useOptimistic,
  useState,
  useTransition,
} from "react";
import type { AdminRole, GameAdminStatus, GameTag } from "@/types/admin";
import type { AdminStoreSnapshot } from "@/lib/admin/admin-store";
import {
  approveKycAction,
  approveWithdrawalAction,
  createCampaignAction,
  flagWithdrawalAction,
  getAdminDataAction,
  grantFreeSpinsAction,
  rejectWithdrawalAction,
  setGameStatusAction,
  suspendPlayerAction,
  switchRoleAction,
  toggleCampaignAction,
  toggleGameTagAction,
  updatePlayerBalanceAction,
} from "@/actions/adminActions";

type Snapshot = AdminStoreSnapshot;

type CreateCampaignInput = Parameters<typeof createCampaignAction>[0];

interface NexusAdminContextValue {
  data: Snapshot;
  role: AdminRole;
  username: string;
  isPending: boolean;
  refresh: () => Promise<void>;
  switchRole: (role: AdminRole) => Promise<void>;
  creditBalance: (
    playerId: string,
    amount: number,
    type: "REAL" | "BONUS",
    reason: string
  ) => Promise<{ success: boolean; message?: string }>;
  suspendPlayer: (playerId: string, suspend: boolean) => Promise<void>;
  approveKyc: (playerId: string) => Promise<void>;
  grantFreeSpins: (input: {
    playerId: string;
    gameId: string;
    gameTitle: string;
    spinCount: number;
    betValue: number;
    wageringRequirement: number;
    expiryDays: number;
  }) => Promise<{ success: boolean; message?: string }>;
  createCampaign: (
    input: CreateCampaignInput
  ) => Promise<{ success: boolean; message?: string }>;
  toggleCampaign: (id: string) => Promise<void>;
  approveWithdrawal: (
    id: string,
    totp: string
  ) => Promise<{ success: boolean; message?: string }>;
  flagWithdrawal: (id: string) => Promise<void>;
  rejectWithdrawal: (id: string) => Promise<void>;
  setGameStatus: (gameId: string, status: GameAdminStatus) => Promise<void>;
  toggleGameTag: (gameId: string, tag: GameTag) => Promise<void>;
}

const NexusAdminContext = createContext<NexusAdminContextValue | null>(null);

export function NexusAdminProvider({
  initialData,
  role,
  username,
  children,
}: {
  initialData: Snapshot;
  role: AdminRole;
  username: string;
  children: React.ReactNode;
}) {
  const [data, setData] = useState(initialData);
  const [optimisticData, setOptimistic] = useOptimistic(
    data,
    (_current, next: Snapshot) => next
  );
  const [isPending, startTransition] = useTransition();
  const [currentRole, setCurrentRole] = useState(role);

  const refresh = useCallback(async () => {
    const next = await getAdminDataAction();
    setData(next);
  }, []);

  const run = useCallback(
    (optimistic: (draft: Snapshot) => void, action: () => Promise<unknown>) => {
      startTransition(async () => {
        const draft = structuredClone(data);
        optimistic(draft);
        setOptimistic(draft);
        await action();
        const next = await getAdminDataAction();
        setData(next);
      });
    },
    [data, setOptimistic]
  );

  const value = useMemo<NexusAdminContextValue>(
    () => ({
      data: optimisticData,
      role: currentRole,
      username,
      isPending,
      refresh,
      switchRole: async (nextRole) => {
        await switchRoleAction(nextRole);
        setCurrentRole(nextRole);
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = "/admin";
      },
      creditBalance: async (playerId, amount, type, reason) => {
        const res = await updatePlayerBalanceAction(
          playerId,
          amount,
          type,
          reason
        );
        if (res.success) await refresh();
        return res;
      },
      suspendPlayer: async (playerId, suspend) => {
        run(
          (draft) => {
            const p = draft.players.find((x) => x.id === playerId);
            if (p) p.status = suspend ? "SUSPENDED" : "ACTIVE";
          },
          () => suspendPlayerAction(playerId, suspend)
        );
      },
      approveKyc: async (playerId) => {
        run(
          (draft) => {
            const p = draft.players.find((x) => x.id === playerId);
            if (p) p.kycStatus = "VERIFIED";
          },
          () => approveKycAction(playerId)
        );
      },
      grantFreeSpins: async (input) => {
        const res = await grantFreeSpinsAction(input);
        if (res.success) await refresh();
        return res;
      },
      createCampaign: async (input) => {
        const res = await createCampaignAction(input);
        if (res.success) await refresh();
        return { success: res.success, message: res.success ? undefined : "Failed" };
      },
      toggleCampaign: async (id) => {
        run(
          (draft) => {
            const c = draft.campaigns.find((x) => x.id === id);
            if (c && c.status !== "EXPIRED") {
              c.status = c.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
            }
          },
          () => toggleCampaignAction(id)
        );
      },
      approveWithdrawal: async (id, totp) => {
        const res = await approveWithdrawalAction(id, totp);
        if (res.success) await refresh();
        return res;
      },
      flagWithdrawal: async (id) => {
        run(
          (draft) => {
            const w = draft.withdrawals.find((x) => x.id === id);
            if (w) w.status = "FLAGGED";
          },
          () => flagWithdrawalAction(id)
        );
      },
      rejectWithdrawal: async (id) => {
        run(
          (draft) => {
            const w = draft.withdrawals.find((x) => x.id === id);
            if (w) w.status = "REJECTED";
          },
          () => rejectWithdrawalAction(id)
        );
      },
      setGameStatus: async (gameId, status) => {
        run(
          (draft) => {
            const g = draft.games.find((x) => x.id === gameId);
            if (g) g.status = status;
          },
          () => setGameStatusAction(gameId, status)
        );
      },
      toggleGameTag: async (gameId, tag) => {
        run(
          (draft) => {
            const g = draft.games.find((x) => x.id === gameId);
            if (!g) return;
            g.tags = g.tags.includes(tag)
              ? g.tags.filter((t) => t !== tag)
              : [...g.tags, tag];
          },
          () => toggleGameTagAction(gameId, tag)
        );
      },
    }),
    [optimisticData, currentRole, username, isPending, refresh, run]
  );

  return (
    <NexusAdminContext.Provider value={value}>
      {children}
    </NexusAdminContext.Provider>
  );
}

export function useNexusAdmin() {
  const ctx = useContext(NexusAdminContext);
  if (!ctx) {
    throw new Error("useNexusAdmin must be used within NexusAdminProvider");
  }
  return ctx;
}
