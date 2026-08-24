# SlotStar.fun

Headless WordPress CMS + Next.js frontend for the [SlotStar.fun](https://slotstar.fun) demo casino catalog.

## Quick start

**Requirements:** Node.js 22+, npm

```bash
# Install dependencies (monorepo root)
npm install

# Copy environment template and fill in values locally
cp .env.example .env.local

# Start the Next.js dev server (http://localhost:3377)
npm run dev
```

### Production build

```bash
npm run build
npm run start -w @slotstar/web
```

## Health checks

| Endpoint | Purpose |
| :--- | :--- |
| `GET /api/health` | Liveness — app process is running |
| `GET /api/ready` | Readiness — WordPress backend is reachable |

## Environment variables

Copy `.env.example` to `.env.local` for local development. Set the same keys in Vercel for production. **Never commit real secret values.**

| Key | Scope | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Public | Canonical site URL |
| `NEXT_PUBLIC_SLOTSLAUNCH_REF_ID` | Public | SlotsLaunch affiliate reference ID |
| `WORDPRESS_API_URL` | Server | WordPress REST API base URL |
| `SLOTSTAR_BRIDGE_SECRET` | Server | HMAC secret for WordPress launch bridge |
| `KSL_BRIDGE_SHARED_SECRET` | Server | Shared bridge secret (WordPress side) |
| `KSL_REVALIDATE_SECRET` | Server | On-demand revalidation secret |
| `KSL_NEXT_REVALIDATE_URL` | Server | Next.js revalidation webhook URL |
| `KSL_NEXT_REVALIDATE_SECRET` | Server | Next.js revalidation webhook secret |
| `SLOTSLAUNCH_REGISTERED_HOST` | Server | Registered SlotsLaunch host |
| `SLOTSLAUNCH_ORIGIN` | Server | SlotsLaunch origin header |
| `KSL_SLOTSLAUNCH_TOKEN` | Server | SlotsLaunch API token |
| `KSL_SLOTSLAUNCH_EMBED_TOKEN` | Server | SlotsLaunch embed token |
| `KSL_SLOTSLAUNCH_ORIGIN` | Server | SlotsLaunch request origin |
| `KSL_SLOTSLAUNCH_RATE_LIMIT_RPS` | Server | SlotsLaunch rate limit (requests/sec) |
| `KSL_SOURCE_MODE` | Server | Data source mode (`auto`, etc.) |
| `KSL_REQUEST_TIMEOUT_MS` | Server | Upstream request timeout |
| `KSL_ENABLE_LAUNCH` | Server | Enable game launch bridge |
| `KSL_USE_FIXTURES` | Server | Use local fixtures instead of CMS |
| `PORT` | Server | Dev server port (default `3377`) |

For Docker-based WordPress development, see `.env.docker.example`.

## Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run test` | Unit tests (Vitest) |
| `npm run test:e2e` | Playwright E2E tests |

## Repository layout

```text
apps/web/          Next.js frontend (Vercel)
apps/wordpress/    WordPress plugins & themes (WebSupport CMS)
infra/             Docker, deployment scripts
docs/              Technical documentation
```

See [DEVELOPER.md](./DEVELOPER.md) for detailed developer documentation.
