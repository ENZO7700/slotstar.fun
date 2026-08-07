# Next.js Data Layer & WordPress Client

The Next.js frontend (`apps/web`) communicates exclusively with the local/production WordPress REST API namespace (`slotstar/v1`).

---

## 1. Environment Boundary
- **`WORDPRESS_API_URL`**: Private server-only base API address (default: `http://localhost:8080/wp-json`).
- **`SLOTSTAR_BRIDGE_SECRET`**: Private server-only pre-shared signature secret used to authorize game launches.
- **`NEXT_PUBLIC_SITE_URL`**: Public canonical origin.
- **`NEXT_PUBLIC_ENABLE_DEV_FIXTURES`**: Enables fallback mockup fixtures in development environments. Hard-disabled when `NODE_ENV === 'production'`.

---

## 2. Secure Game Launcher (HMAC Flow)

To prevent exposure of the SlotsLaunch API token or raw iframe URLs to client browsers:
1. Public endpoints `/games` and `/games/{id}` omit `embedUrl` and license token variables.
2. Clicking "Play Demo" triggers a fetch request to Next.js API `/api/play?id={externalId}`.
3. Next.js signs the request using **HMAC SHA-256** using the private `SLOTSTAR_BRIDGE_SECRET`:
   - Headers: `X-SlotStar-Signature`, `X-SlotStar-Timestamp`.
   - Path signed: `/slotstar/v1/internal/launch/{externalId}`.
4. WordPress validates the signature and timestamp skew (max 5 minutes) before outputting the dynamic iframe URL.

---

## 3. Data Schema & Models

Data models are validated at runtime using Zod schemas located in `src/lib/api/schemas.ts`:
- **`GameSummarySchema`**: Game card and detail metadata (excludes launch tokens).
- **`ProviderSchema`**: Developer studio details, supports paginated searches.

---

## 4. Client Services (`src/lib/api/wordpress.ts`)

| Client Method | WordPress Endpoint | Cache Strategy | Description |
| :--- | :--- | :--- | :--- |
| `getHealth()` | `GET /health` | No Cache | Health and CPT stats check |
| `getGames(params)` | `GET /games` | 120s | Paginated, filtered games |
| `getGame(externalId)`| `GET /games/{externalId}` | 300s | Game detail metadata |
| `getProviders(params)`| `GET /providers` | 300s | Paginated search of studios |
| `getThemes(params)` | `GET /themes` | 300s | Themes taxonomy terms |
| `getTypes(params)` | `GET /types` | 300s | Types taxonomy terms |
| `getFilters(params)` | `GET /filters` | 300s | Filters taxonomy terms |

---

## 5. Development Diagnostics

Development-only status route available at `/dev/api-status` (`src/app/dev/api-status/page.tsx`). Returns `notFound()` automatically when `NODE_ENV === 'production'`.

---

## 6. Official SlotsLaunch Integration Rules

1. **API for Synchronization Only**:
   - The upstream SlotsLaunch API is strictly used as a sync source.
   - Next.js must **never** call the upstream SlotsLaunch API directly. All runtime data is served from local WordPress database.

2. **Direct Game Embed Rules**:
   - Direct iframe URL: `https://slotslaunch.com/iframe/{gameId}?token={token}`.
   - **No Auto-Play / Auto-Load**: Every loaded iframe counts against the API request quota.
   - Next.js must load the demo game iframe **only after an explicit user interaction** (e.g. clicking "Hrať zadarmo"). Preloading, prefetching, or hidden background loading is forbidden.
