# Nexus Core — Casino Admin Panel

Implemented in `apps/web` under `/admin`.

## Modules

1. **Core** — Dashboard, Players CRM, Bonuses, Finance, Games
2. **Risk & Marketing** — Promotions / Free Spins, Withdrawal Risk Queue, Live Bet Monitor
3. **Enterprise** — RBAC middleware, Immutable Audit Log (CSV/JSON export), Server Actions + optimistic UI

## Demo login

- URL: `/admin/login`
- Password: `nexus`
- Quick roles: SuperAdmin, Risk Manager, Support Agent, Finance Admin

## Notes

- Data is an in-memory mock store (resets on server restart).
- Withdrawal approval 2FA mock code: `123456`
- Public site shell lives in `src/app/(site)`; admin is isolated from `AppShell`.
