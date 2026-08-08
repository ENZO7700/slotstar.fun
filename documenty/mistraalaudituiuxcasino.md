# 🎰 SLOTSTAR.FUN — KOMPILÁCIA FORENZNÉHO AUDITU
*Comprehensive UI/UX Architecture & Design System Audit*
*Generated: 2026-08-08*

---

## 1. EXECUTIVE SUMMARY

### 🚨 KRITICKÉ NÁLEZY (Top 15)

| # | Severity | Category | Finding | Impact |
|---|----------|----------|---------|--------|
| 1 | **CRITICAL** | Layout | Sidebar (240px fixed) overlaps main content due to `max-w-7xl mx-auto` centering in constrained wrapper | Content hidden under sidebar on all desktop breakpoints (1024px+) |
| 2 | **CRITICAL** | Layout | `lg:ml-60` + `max-w-7xl mx-auto` combination causes 40-120px overlap at 1280-1440px | First grid column disappears under sidebar |
| 3 | **HIGH** | Responsive | Hero section first columns clipped by sidebar overlap | Visual content loss on homepage |
| 4 | **HIGH** | Data Flow | Homepage sections (Trending, New, Featured) use different `orderBy` logic without clear business rules | Inconsistent game sorting, potential SEO duplication |
| 5 | **HIGH** | CSS | Hardcoded color values alongside CSS variables — mixed usage | Design system fragmentation, maintenance risk |
| 6 | **MEDIUM** | Typography | Font loading via Next.js Font (Geist) but fallback stack includes system fonts | No custom brand typography, limited design differentiation |
| 7 | **MEDIUM** | Components | GameCard combines presentation + data logic (decodeHtmlEntities) | Refactor risk for visual changes |
| 8 | **MEDIUM** | Accessibility | Multiple `/* eslint-disable */` comments for img elements | Missing alt text validation, SEO impact |
| 9 | **MEDIUM** | State | No centralized state management — server components fetch directly | Data revalidation inconsistency, caching complexity |
| 10 | **MEDIUM** | Images | Game thumbnails use placeholder URLs in fixtures, production uses `/images/games/{slug}.png` | Broken image risk if file sync fails |
| 11 | **LOW** | UI | Blog card uses native `<img>` instead of Next.js `<Image>` | Missing optimization, CLS risk |
| 12 | **LOW** | Responsive | Mobile navigation uses `pb-safe` (iOS safe area) but not consistently applied | Inconsistent mobile UX |
| 13 | **LOW** | Semantics | Blog content uses `dangerouslySetInnerHTML` without sanitization | XSS vulnerability risk |
| 14 | **LOW** | Performance | No lazy loading on blog images | CLS on slow connections |
| 15 | **LOW** | Data | `embedUrl` construction hardcoded for Pragmatic Play | Non-portable game launch logic |

---

## 2. CURRENT ARCHITECTURE

### Framework & Runtime
- **Framework**: Next.js 16.3.0 (App Router)
- **React**: 19.2.8
- **Language**: TypeScript 5.x
- **Rendering**: Server Components by default, Client Components where needed
- **Data Fetching**: Server-only API calls with Next.js `fetch` + caching
- **Routing**: File-system based App Router with dynamic segments

### CSS & Styling
- **Solution**: Tailwind CSS v4 (+ @tailwindcss/postcss plugin)
- **Custom Tokens**: CSS Custom Properties in `globals.css` (colors, spacing, layout)
- **Patterns**: Utility-first with semantic component classes
- **Responsive**: Tailwind breakpoints (sm:640px, md:768px, lg:1024px, xl:1280px, 2xl:1536px)

### Data Layer
- **Primary Source**: WordPress REST API (`/wp/v2/slotsl` for games, `/wp/v2/posts` for blog)
- **Custom API**: `/slotstar/v1/*` endpoints (health, games, providers, themes, types, filters)
- **Fallback Chain**: Custom API → WordPress REST → Dev Fixtures
- **Validation**: Zod schemas for all API responses
- **Caching**: Next.js `fetch` cache with `revalidate` tags

### Component Architecture
```
src/
├── app/                    # Pages & Routes
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Homepage/lobby
│   └── blog/, games/, ...   # Feature pages
├── components/
│   ├── layout/             # AppShell, Sidebar, Header, Footer, MobileNavigation
│   ├── games/              # GameCard, GameGrid, GameRail, GameImage, GameSimulator
│   ├── providers/          # ProviderCard, ProviderGrid
│   ├── ui/                 # Button, Badge, Skeleton, Icons
│   └── states/             # ApiErrorState, EmptyState
├── lib/
│   ├── api/                # client.ts, wordpress.ts, schemas.ts
│   └── utils.ts             # Helper functions
├── types/                  # game.ts, provider.ts, taxonomy.ts, api.ts
└── fixtures/               # games.ts (mock data)
```

### File Map with Responsibilities

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout, font loading (Geist), metadata |
| `app/globals.css` | Design tokens, base styles, custom utilities, responsive grid |
| `components/layout/AppShell.tsx` | **Main layout container** — sidebar, header, main, footer orchestration |
| `components/layout/Sidebar.tsx` | Left navigation (240px fixed), routes, branding |
| `components/layout/Header.tsx` | Top search bar (64px), logo on mobile |
| `components/layout/MobileNavigation.tsx` | Bottom tab bar for mobile, 5 main routes |
| `components/layout/Footer.tsx` | Footer with info, responsible gaming, links |
| `components/games/GameCard.tsx` | Game display card with image, badges, metadata |
| `components/games/GameGrid.tsx` | Grid layout for games (uses `.game-grid` CSS class) |
| `components/games/GameRail.tsx` | Horizontal scrolling game carousel |
| `components/games/GameImage.tsx` | Optimized game thumbnail image |
| `components/games/GameSimulator.tsx` | Game launch iframe wrapper |
| `components/providers/ProviderCard.tsx` | Provider display with initials fallback |
| `components/providers/ProviderGrid.tsx` | Grid of provider cards |
| `components/ui/Button.tsx` | Reusable button with variants (primary, secondary, danger) |
| `components/ui/Badge.tsx` | Status badge component (brand, success, danger, etc.) |
| `components/ui/Icons.tsx` | Icon component library (Lucide-based) |
| `components/ui/Skeleton.tsx` | Loading skeleton placeholder |
| `lib/api/wordpress.ts` | **Data fetching hub** — games, providers, blog posts, taxonomy |
| `lib/api/client.ts` | API client with error handling, validation, caching |
| `lib/api/schemas.ts` | Zod validation schemas for all API responses |
| `types/game.ts` | Game data model (GameSummary, GameDetail) |
| `types/provider.ts` | Provider data model |
| `types/taxonomy.ts` | Taxonomy terms (themes, types, filters) |
| `types/api.ts` | API response types, pagination |
| `fixtures/games.ts` | Development mock data (6 games, 6 providers, 10 themes, 5 types) |

---

## 3. ROOT CAUSE — SIDEBAR / CONTENT OVERLAP

### 🎯 PRECÍZNA TECHNICKÁ PRÍČINA

**Problém**: Sidebar (240px fixed positioning) prekrýva hlavný content o 40-248px na desktop breakpointe.

### Príčinný reťazec:
```
Sidebar (w-60 = 240px fixed)
    │
    └── AppShell wrapper (lg:ml-60 = margin-left: 240px)
            │
            └── Main content (max-w-7xl mx-auto)
                    │
                    ╰── PROBLEM: max-w-7xl (1280px) > available width at lg breakpoint
```

### Konkrétne súbory a riadky:

| File | Line | Code | Issue |
|------|------|------|-------|
| `AppShell.tsx` | 18 | `lg:ml-60` | Margin-left: 240px on lg+ |
| `AppShell.tsx` | 23 | `max-w-7xl mx-auto` | Content wants 1280px centered |
| `Sidebar.tsx` | 23 | `w-60 fixed top-0 bottom-0 left-0` | Sidebar occupies 0-240px |
| `globals.css` | 32 | `--sidebar-width: 240px;` | Design token (unused in practice) |

### Matematický dôkaz prekrývania:

| Screen Width | Available for Main | Main Content Target | Overlap | Result |
|--------------|-------------------|---------------------|---------|--------|
| 1024px (lg) | 1024 - 240 = 784px | 1280px centered | 1280 - 784 = 496px | **-8px left edge** (fully under) |
| 1280px (xl) | 1280 - 240 = 1040px | 1280px centered | 1280 - 1040 = 240px | **-120px left edge** (partially under) |
| 1440px | 1440 - 240 = 1200px | 1280px centered | 1280 - 1200 = 80px | **-40px left edge** (partially under) |
| 1536px (2xl) | 1536 - 240 = 1296px | 1280px centered | 1296 - 1280 = 16px | **+16px left edge** (OK) |

**Výsledok**: Na 1024-1440px (lg až xl breakpoint) je content **úplne alebo čiastočne pod sidebarom**.

### Ďalšie prispievajúce faktory:

1. **`mx-auto` centering**: Keď je main content užší ako wrapper, centrovanie ho posúva doprava
2. **Fixed positioning**: Sidebar je z document flow, main content o nim "nevie"
3. **No width constraint**: Main wrapper nemá explicitnú šírku, len margin-left

### Dopad:
- Hero sekcia: Ľavá časť (kategórie grid) mizne pod sidebarom
- Game grids: Prvý stĺpec je neviditeľný
- Blog grid: Prvý stĺpec pod sidebarom (3-column grid → 2 visible)
- Všetok content: Text a obrázkv pod sidebarom sú neklikovateľné

---

## 4. UI COMPONENT MAP

| Component | File | Purpose | Props | Reusable | Visual Coupling | Refactor Risk | Recommendation |
|-----------|------|---------|-------|----------|----------------|---------------|----------------|
| **AppShell** | `components/layout/AppShell.tsx` | Root layout orchestrator | `children` | NO (app-specific) | HIGH | HIGH | **REFACTOR** |
| **Sidebar** | `components/layout/Sidebar.tsx` | Left navigation drawer | none | PARTIAL (hardcoded routes) | HIGH | MEDIUM | REFACTOR |
| **Header** | `components/layout/Header.tsx` | Top search bar | none | PARTIAL (search logic) | HIGH | MEDIUM | REFACTOR |
| **MobileNavigation** | `components/layout/MobileNavigation.tsx` | Bottom mobile nav | none | YES | MEDIUM | LOW | KEEP |
| **Footer** | `components/layout/Footer.tsx` | Footer content | none | YES | LOW | LOW | KEEP |
| **GameCard** | `components/games/GameCard.tsx` | Game display card | `game, priority` | YES | MEDIUM | MEDIUM | REFACTOR |
| **GameGrid** | `components/games/GameGrid.tsx` | Grid of games | `games` | YES | LOW | LOW | KEEP |
| **GameRail** | `components/games/GameRail.tsx` | Horizontal carousel | `games` | YES | LOW | LOW | KEEP |
| **GameImage** | `components/games/GameImage.tsx` | Optimized game img | `src, alt, priority` | YES | LOW | LOW | KEEP |
| **GameSimulator** | `components/games/GameSimulator.tsx` | Game launch iframe | `game` | YES | HIGH | MEDIUM | KEEP |
| **ProviderCard** | `components/providers/ProviderCard.tsx` | Provider display | `provider` | YES | LOW | LOW | KEEP |
| **ProviderGrid** | `components/providers/ProviderGrid.tsx` | Provider grid | `providers` | YES | LOW | LOW | KEEP |
| **Button** | `components/ui/Button.tsx` | Reusable button | `variant, size, fullWidth, ...props` | YES | LOW | LOW | KEEP |
| **Badge** | `components/ui/Badge.tsx` | Status badge | `children, variant` | YES | LOW | LOW | KEEP |
| **Skeleton** | `components/ui/Skeleton.tsx` | Loading placeholder | `className` | YES | LOW | LOW | KEEP |
| **Icons** | `components/ui/Icons.tsx` | Icon library | none | YES | LOW | LOW | KEEP |
| **ApiErrorState** | `components/states/ApiErrorState.tsx` | Error display | `message` | YES | LOW | LOW | KEEP |
| **EmptyState** | `components/states/EmptyState.tsx` | Empty state | `message, icon` | YES | LOW | LOW | KEEP |

---

## 5. DESIGN SYSTEM INVENTORY

### 🎨 Colors

| Token | Value | Usage | Source |
|-------|-------|-------|--------|
| `--background` | `#09090b` | Body background | CSS Variable |
| `--surface` | `#18181b` | Card surfaces | CSS Variable |
| `--surface-elevated` | `#27272a` | Elevated surfaces | CSS Variable |
| `--surface-hover` | `#3f3f46` | Hover states | CSS Variable |
| `--border` | `#27272a` | Default borders | CSS Variable |
| `--border-strong` | `#3f3f46` | Strong borders | CSS Variable |
| `--text-primary` | `#fafafa` | Primary text | CSS Variable |
| `--text-secondary` | `#d4d4d8` | Secondary text | CSS Variable |
| `--text-muted` | `#71717a` | Muted text | CSS Variable |
| `--brand` | `#f59e0b` | Amber 500 (primary) | CSS Variable |
| `--brand-hover` | `#d97706` | Amber 600 | CSS Variable |
| `--accent` | `#6366f1` | Indigo 500 | CSS Variable |
| `--success` | `#10b981` | Success states | CSS Variable |
| `--warning` | `#f59e0b` | Warning states | CSS Variable |
| `--danger` | `#ef4444` | Error states | CSS Variable |

**Hardcoded Tailwind Colors Found:**
- `bg-zinc-950`, `bg-zinc-900`, `bg-zinc-800`, `bg-zinc-700`, `bg-zinc-600`
- `text-zinc-100`, `text-zinc-300`, `text-zinc-400`, `text-zinc-500`, `text-zinc-600`
- `border-zinc-800`, `border-zinc-700`
- `bg-amber-500`, `bg-amber-600`, `bg-amber-700`, `bg-amber-950`
- `text-amber-400`, `text-amber-500`

**Status**: ⚠️ **MIXED** - CSS variables exist but Tailwind hardcoded colors are used throughout

### 📝 Typography

| Property | Value | Source |
|----------|-------|--------|
| Font Family | `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif` | `body` in globals.css |
| Font Sans | Geist (via Next.js Font) | `layout.tsx` |
| Font Mono | Geist Mono (via Next.js Font) | `layout.tsx` |
| Line Height | `1.5` (body) | globals.css |
| blog-content | `0.875rem` (text-sm) | globals.css |
| blog-content h2 | `1.5rem`, `700`, `1.75` line-height | globals.css |
| blog-content h3 | `1.25rem`, `600` | globals.css |

**Status**: ✅ **CONSISTENT** - Geist loaded via CSS variables, good fallback stack

### 📏 Layout Dimensions

| Token | Value | Usage |
|-------|-------|-------|
| `--sidebar-width` | `240px` | Design token (UNUSED - Sidebar uses `w-60`) |
| `--header-height` | `64px` | Design token (matches Header `h-16`) |
| `--max-content-width` | `1440px` | Design token (UNUSED - AppShell uses `max-w-7xl` = 1280px) |

**Tailwind Dimensions:**
- Sidebar: `w-60` = 15rem = **240px**
- Header: `h-16` = 4rem = **64px**
- Main max-width: `max-w-7xl` = 80rem = **1280px**
- Mobile nav: `h-16` = **64px**

**Status**: ⚠️ **INCONSISTENT** - Design tokens defined but not used, Tailwind classes override

### 🔲 Shape & Borders

| Token | Value | Usage |
|-------|-------|-------|
| `--radius` | `8px` | Default border radius |
| `--shadow-sm` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` | Subtle shadow |
| `--shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` | Medium shadow |
| `--shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` | Large shadow |

**Hardcoded in Tailwind:**
- `rounded-lg` = 0.5rem = 8px (matches `--radius`)
- `rounded-xl` = 0.75rem = 12px
- `rounded-2xl` = 1rem = 16px
- `rounded-full` = 9999px

**Status**: ✅ **CONSISTENT** - `--radius` matches `rounded-lg`

### 📏 Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--spacing-xs` | `0.25rem` | 4px |
| `--spacing-sm` | `0.5rem` | 8px |
| `--spacing-md` | `1rem` | 16px |
| `--spacing-lg` | `1.5rem` | 24px |
| `--spacing-xl` | `2rem` | 32px |

**Tailwind Usage:**
- `p-4` = 1rem, `p-6` = 1.5rem, `p-8` = 2rem, `py-2` = 0.5rem
- `space-y-2`, `space-y-3`, `space-y-4`, `space-y-6`, `space-y-8`
- `gap-3`, `gap-4`, `gap-6`

**Status**: ✅ **CONSISTENT** - Tokens align with Tailwind scale

---

## 6. DATA MODEL

### Game Model (`types/game.ts`)

#### AVAILABLE NOW (from API)

| Field | Type | Source | Notes |
|-------|------|--------|-------|
| `id` | number | WordPress | Internal ID |
| `externalId` | number \| null | WordPress | Slots Launch ID |
| `name` | string | WordPress | Game title |
| `slug` | string | WordPress | URL slug |
| `canonicalPath` | string | Constructed | `/games/{provider}/{slug}` |
| `thumbnail` | `{src: string, alt: string}` | WordPress | Image data |
| `provider` | TaxonomyTerm \| null | WordPress | Provider info |
| `themes` | TaxonomyTerm[] | WordPress | Theme categories |
| `type` | TaxonomyTerm \| null | WordPress | Game type |
| `filters` | TaxonomyTerm[] | WordPress | Filter tags |
| `releaseDate` | string \| null | WordPress | ISO date |
| `description` | string \| null | WordPress | Game description |
| `rtp` | string \| null | WordPress | Return to Player % |
| `volatility` | string \| null | WordPress | Volatility level |
| `featured` | boolean | WordPress | Featured flag |
| `upcoming` | boolean | WordPress | Upcoming flag |
| `modifiedAt` | string | WordPress | Last modified |
| `embedUrl` | string \| undefined | Constructed | Game launch URL |

#### Optional Technical Specs (`technical` object)

| Field | Type | Status |
|-------|------|--------|
| `reels` | number \| null | NOT AVAILABLE in current data |
| `paylines` | string \| number \| null | NOT AVAILABLE |
| `megaways` | boolean \| null | NOT AVAILABLE |
| `bonusBuy` | boolean \| null | NOT AVAILABLE |
| `progressive` | boolean \| null | NOT AVAILABLE |
| `autoplay` | boolean \| null | NOT AVAILABLE |
| `quickspin` | boolean \| null | NOT AVAILABLE |
| `tumblingReels` | boolean \| null | NOT AVAILABLE |
| `increasingMultipliers` | boolean \| null | NOT AVAILABLE |
| `orientation` | string \| null | NOT AVAILABLE |

#### Optional Limits (`limits` object)

| Field | Type | Status |
|-------|------|--------|
| `minBet` | number \| null | NOT AVAILABLE |
| `maxBet` | number \| null | NOT AVAILABLE |
| `maxWinPerSpin` | number \| null | NOT AVAILABLE |
| `maxExposure` | number \| null | NOT AVAILABLE |

#### CAN BE DERIVED

| Field | Derivation | Status |
|-------|------------|--------|
| `provider.name` | From provider taxonomy | AVAILABLE |
| `provider.slug` | From provider taxonomy | AVAILABLE |
| `canonicalPath` | `/games/${provider.slug}/${game.slug}` | AVAILABLE |
| `isNew` | `releaseDate` within last 30 days | CAN BE DERIVED |
| `age` | Current date - `releaseDate` | CAN BE DERIVED |

#### NOT AVAILABLE

| Field | Status | Notes |
|-------|--------|-------|
| `demoUrl` | NOT AVAILABLE | Only `embedUrl` exists |
| `rating` | NOT AVAILABLE | No user ratings |
| `reviewCount` | NOT AVAILABLE | No reviews |
| `popularity` | NOT AVAILABLE | No metrics |
| `tags` | NOT AVAILABLE | Only themes/filters/types |
| `gameEngine` | NOT AVAILABLE | Not in schema |
| `languages` | NOT AVAILABLE | In availability object but not populated |
| `currencies` | NOT AVAILABLE | In availability object but not populated |

### Provider Model (`types/provider.ts`)

```typescript
interface Provider {
  id: number;
  name: string;
  slug: string;
  count: number;  // Number of games
}
```

### Blog Post Model (from `wordpress.ts`)

```typescript
interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;  // HTML
  date: string;
  modified: string;
  featuredImage: string | null;
  author: string;
}
```

### Taxonomy Model (`types/taxonomy.ts`)

```typescript
interface TaxonomyTerm {
  id: number;
  name: string;
  slug: string;
  count?: number;
}
```

---

## 7. RESPONSIVE PROBLEMS

### Breakpoint Table

| Breakpoint | Sidebar | Main Width | Grid Columns | Header | **Problém** |
|------------|---------|------------|--------------|---------|------------|
| **320px** | Hidden | Full width | `grid-cols-2` (category shortucts) | Visible | ⚠️ Mobile nav covers content area |
| **375px** | Hidden | Full width | `grid-cols-2` | Visible | ⚠️ Same as 320px |
| **640px** | Hidden | Full width | `grid-cols-3` (game-grid) | Visible | ✅ OK |
| **768px** | Hidden | Full width | `grid-cols-3` (game-grid) | Visible | ✅ OK |
| **1024px (lg)** | **Visible (240px fixed)** | `1024-240=784px` | `grid-cols-5` (game-grid) | Visible | 🚨 **CRITICAL: 1280px content in 784px → -8px left** |
| **1280px (xl)** | Visible (240px fixed) | `1280-240=1040px` | `grid-cols-6` (game-grid) | Visible | 🚨 **CRITICAL: 1280px content in 1040px → -120px left** |
| **1440px** | Visible (240px fixed) | `1440-240=1200px` | `grid-cols-6` (game-grid) | Visible | 🚨 **HIGH: 1280px content in 1200px → -40px left** |
| **1536px (2xl)** | Visible (240px fixed) | `1536-240=1296px` | `grid-cols-7` (game-grid) | Visible | ✅ OK (1280px < 1296px) |
| **1920px** | Visible (240px fixed) | `1920-240=1680px` | `grid-cols-7` (game-grid) | Visible | ✅ OK |

### Identified Responsive Issues

| Issue | Severity | Breakpoints | Cause | Impact |
|-------|----------|-------------|-------|--------|
| Sidebar overlap | **CRITICAL** | 1024-1440px | `max-w-7xl mx-auto` in constrained wrapper | Content hidden under sidebar |
| Hero grid overflow | **HIGH** | 1024-1440px | Same as above | Category shortcuts clipped |
| Game grid first column hidden | **HIGH** | 1024-1440px | Same as above | Games not visible |
| Blog grid first column hidden | **HIGH** | 1024-1440px | Same as above | Blog posts not visible |
| Mobile nav safe area | **MEDIUM** | <640px | `pb-safe` only on MobileNavigation | Inconsistent safe area handling |
| Horizontal scroll on GameRail | **LOW** | All | `overflow-x-auto` on flex container | Expected behavior |
| Blog content images | **LOW** | All | No responsive sizing on `<img>` | Potential overflow |

### Grid System Analysis

**Homepage Category Shortcuts** (`app/page.tsx:85`):
```tsx
grid grid-cols-2 sm:grid-cols-5 gap-3
```
- Mobile: 2 columns
- ≥640px: 5 columns
- **Issue**: At 640-1024px, 5 columns may be too dense

**Game Grid** (`globals.css:88-116`):
```css
.game-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
@media (min-width: 640px) { repeat(3, minmax(0, 1fr)) }
@media (min-width: 1024px) { repeat(5, minmax(0, 1fr)) }
@media (min-width: 1280px) { repeat(6, minmax(0, 1fr)) }
@media (min-width: 1536px) { repeat(7, minmax(0, 1fr)) }
```
- **Issue**: At 1024-1280px, 5 columns with sidebar overlap = 4 visible

**Blog Grid** (`app/blog/page.tsx:51`):
```tsx
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6
```
- Mobile: 1 column
- ≥640px: 2 columns
- ≥1024px: 3 columns
- **Issue**: At 1024-1440px, first column hidden under sidebar

**Providers Grid** (`components/providers/ProviderGrid.tsx`):
```tsx
grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4
```
- Mobile: 2 columns
- ≥640px: 3 columns
- ≥768px: 4 columns
- **Status**: ✅ OK (no overlap issues)

---

## 8. TECH DEBT

### CRITICAL

| Item | Location | Severity | Description | Impact |
|------|----------|----------|-------------|--------|
| **Layout Overlap** | `AppShell.tsx:18,23` | **CRITICAL** | `lg:ml-60` + `max-w-7xl mx-auto` causes content overlap | Content hidden on desktop |
| **No Sidebar Width Sync** | `Sidebar.tsx:23`, `globals.css:32` | **CRITICAL** | Sidebar uses `w-60` (240px), token `--sidebar-width: 240px` unused | Maintenance confusion |
| **Data Flow Inconsistency** | `wordpress.ts:84-199` | **CRITICAL** | Multiple fallback chains without clear priority | Unpredictable data sources |

### HIGH

| Item | Location | Severity | Description | Impact |
|------|----------|----------|-------------|--------|
| **Mixed Color System** | `globals.css`, all components | **HIGH** | CSS variables + Tailwind hardcoded colors | Design system fragmentation |
| **Hardcoded API Logic** | `wordpress.ts:113-119` | **HIGH** | Image URL transformation hardcoded | Non-portable, brittle |
| **No Centralized State** | Throughout app | **HIGH** | Server components fetch directly | Caching inconsistency |
| **Blog HTML Injection** | `blog/[slug]/page.tsx:81-84` | **HIGH** | `dangerouslySetInnerHTML` without sanitization | XSS vulnerability |
| **GameCard Data Logic** | `GameCard.tsx:7,49,53` | **HIGH** | `decodeHtmlEntities` in presentation component | Business logic in UI |

### MEDIUM

| Item | Location | Severity | Description | Impact |
|------|----------|----------|-------------|--------|
| **Unused Design Tokens** | `globals.css:32-34` | **MEDIUM** | `--sidebar-width`, `--header-height`, `--max-content-width` unused | Dead code |
| **Missing Image Optimization** | `blog/page.tsx:62-66` | **MEDIUM** | Native `<img>` instead of Next.js `<Image>` | CLS, performance |
| **Inconsistent Safe Areas** | `MobileNavigation.tsx:20` | **MEDIUM** | `pb-safe` only on mobile nav | Inconsistent mobile UX |
| **Hardcoded Provider Logic** | `wordpress.ts:155-164` | **MEDIUM** | Default provider hardcoded to Pragmatic Play | Non-portable |
| **Duplicate Grid Logic** | `globals.css:88-116`, `GameRail.tsx:13` | **MEDIUM** | CSS grid vs flex for similar layouts | Maintenance overhead |
| **No Error Boundaries** | Throughout app | **MEDIUM** | No error handling for client components | Poor UX on errors |
| **Magic Numbers** | `GameRail.tsx:17` | **MEDIUM** | `w-40 sm:w-50` hardcoded widths | Not responsive to design tokens |
| **Missing Loading States** | Most pages | **MEDIUM** | No loading skeletons for data fetching | Poor perceived performance |

### LOW

| Item | Location | Severity | Description | Impact |
|------|----------|----------|-------------|--------|
| **Inline Styles Disabled** | `GameCard.tsx:21-22` | **LOW** | ESLint disable for focus styles | Minor lint issue |
| **ESLint Disables** | `blog/page.tsx:61`, `GameImage.tsx` | **LOW** | `/* eslint-disable */` for img elements | Technical debt |
| **No Lazy Loading** | `blog/page.tsx:62-66` | **LOW** | Images without lazy loading | Performance |
| **Hardcoded Emoji** | `blog/page.tsx:70` | **LOW** | `🎰` placeholder instead of proper fallback | Minor UX |
| **No Alt Text Validation** | `GameCard.tsx:28` | **LOW** | Alt text from API may be empty | Accessibility |

---

## 9. KEEP / REFACTOR / REBUILD MATRIX

| Component | Decision | Reasoning |
|-----------|----------|-----------|
| **AppShell** | **REFACTOR** | Critical layout bug, needs structural fix |
| **Sidebar** | REFACTOR | Width and positioning need to sync with main content |
| **Header** | REFACTOR | Search logic could be extracted, width constraints |
| **MobileNavigation** | KEEP | Works well, minor safe area improvement |
| **Footer** | KEEP | Functional, good structure |
| **GameCard** | REFACTOR | Extract data logic (decodeHtmlEntities), prepare for new design |
| **GameGrid** | KEEP | Simple wrapper, works with CSS |
| **GameRail** | KEEP | Functional carousel, good UX |
| **GameImage** | KEEP | Optimized image handling |
| **GameSimulator** | KEEP | Business logic (game launch) preserved |
| **ProviderCard** | KEEP | Simple, reusable |
| **ProviderGrid** | KEEP | Simple, reusable |
| **Button** | KEEP | Well-structured, variant system |
| **Badge** | KEEP | Simple, reusable |
| **Skeleton** | KEEP | Standard loading pattern |
| **Icons** | KEEP | Icon library, reusable |
| **ApiErrorState** | KEEP | Standard error pattern |
| **EmptyState** | KEEP | Standard empty pattern |
| **API Client** | KEEP | Well-structured, error handling |
| **WordPress API** | **REFACTOR** | Data flow needs cleanup, fallback logic |
| **Zod Schemas** | KEEP | Type safety, validation |
| **Fixtures** | KEEP | Development utility |
| **CSS Globals** | **REFACTOR** | Design tokens need to be used consistently |

---

## 10. SAFE REFACTOR BOUNDARIES

### ✅ SAFE TO CHANGE (Visual Only)

| Area | What Can Change | Constraints |
|------|-----------------|-------------|
| **Colors** | All color tokens and values | Preserve contrast ratios for accessibility |
| **Typography** | Font families, sizes, weights | Preserve readability, heading hierarchy |
| **Spacing** | All spacing values | Maintain layout structure |
| **Border Radius** | All radius values | Can go to 0 for brutalist design |
| **Shadows** | All shadow values | Can be replaced with hard borders |
| **Card Design** | GameCard, ProviderCard visuals | Preserve data display, linking |
| **Button Styles** | Colors, borders, hover effects | Preserve functionality |
| **Badge Styles** | Colors, shapes | Preserve text content |
| **Scrollbar** | Colors, width | Preserve functionality |
| **Animations** | Hover effects, transitions | Preserve UX cues |

### ⚠️ CAUTIOUS CHANGES (Test Thoroughly)

| Area | What Can Change | Risks |
|------|-----------------|-------|
| **Layout Structure** | Grid vs flex, container widths | May affect responsive behavior |
| **Sidebar Positioning** | Fixed vs sticky vs static | May break navigation |
| **Header Structure** | Height, positioning | May affect search functionality |
| **Image Handling** | Optimization, formats | May affect performance |
| **Navigation** | Routes, link structure | SEO impact |
| **Data Fetching** | Caching, revalidation | Performance impact |

### ❌ DANGEROUS — DO NOT TOUCH

| Area | Why Protected | Risk |
|------|--------------|------|
| **`canonicalPath` Logic** | SEO critical | Broken links, duplicate content |
| **`embedUrl` Construction** | Game launch flow | Games won't load |
| **API Response Schemas** | Data validation | Runtime errors |
| **WordPress API Endpoints** | Data source contracts | Broken data flow |
| **Taxonomy Structure** | Filtering, categorization | Broken navigation |
| **Game ID System** | Data relationships | Orphaned references |
| **Pagination Logic** | Data fetching | Infinite loops, missing data |
| **Error Handling** | User feedback | Silent failures |
| **Search Functionality** | Core feature | Broken search |
| **Routing Structure** | URL patterns | Broken links |

---

## 11. DANGEROUS AREAS

### 🚫 NEZMENA (Business Logic)

1. **Data Fetching Flow** (`lib/api/wordpress.ts`)
   - Custom API → WordPress fallback → Fixtures chain
   - Changing order may break production

2. **Game Launch Logic** (`components/games/GameSimulator.tsx`)
   - `embedUrl` construction
   - Iframe handling

3. **URL Construction** (`types/game.ts:canonicalPath`)
   - `/games/{provider}/{game}` pattern
   - SEO critical

4. **Filtering Logic** (`app/games/page.tsx`, `GameFilters.tsx`)
   - Query parameter handling
   - Taxonomy filtering

### ⚠️ OPATRNE (Architecture)

1. **AppShell Layout** (`components/layout/AppShell.tsx`)
   - Any change may fix or break layout
   - Test at all breakpoints

2. **Sidebar Width** (`components/layout/Sidebar.tsx`)
   - Connected to main content margin
   - Must be synchronized

3. **Image Optimization** (`next.config.ts`, `GameImage.tsx`)
   - Remote patterns
   - Local file serving

### 📋 BEZPEČNÉ (Presentation)

1. **CSS Tokens** (`globals.css`)
2. **Component Styles** (all `.tsx` files)
3. **Typography** (font loading)
4. **Colors** (palette)
5. **Spacing** (margins, padding)
6. **Borders & Shadows** (visual styling)

---

## 12. RECOMMENDED REFACTOR ORDER

### Phase 1: FOUNDATION (Week 1)
```
1. Fix CSS design tokens consistency
   └── Align --sidebar-width with actual w-60
   └── Use tokens instead of hardcoded Tailwind values
2. Create Tailwind v4 config for tokens
   └── Ensure design system is single source of truth
3. Document design system
   └── Colors, typography, spacing, radius, shadows
```

### Phase 2: LAYOUT FIX (Week 1-2)
```
4. Fix AppShell layout overlap
   └── Change lg:ml-60 to match sidebar width
   └── Option A: Use pl-60 (padding-left) instead of ml-60
   └── Option B: Remove mx-auto from main content
   └── Option C: Use CSS Grid for sidebar/main layout
5. Verify all breakpoints
   └── Test 1024px, 1280px, 1440px, 1536px, 1920px
6. Fix mobile safe areas
   └── Apply pb-safe consistently
```

### Phase 3: LAYOUT COMPONENTS (Week 2-3)
```
7. Refactor AppShell
   └── Extract layout logic
   └── Add responsive hooks for sidebar state
8. Refactor Sidebar
   └── Make width configurable via token
   └── Add collapse/expand functionality
9. Refactor Header
   └── Extract search component
   └── Fix width constraints
10. Refactor MobileNavigation
    └── Sync with sidebar state
    └── Improve touch targets
```

### Phase 4: DESIGN PRIMITIVES (Week 3-4)
```
11. Create new design tokens for H4CK3D theme
    └── --brand: #FF0033 (replacing #f59e0b)
    └── --surface: concrete grey
    └── --border: 6-8px hard black
    └── --radius: 0px (brutalist)
    └── --shadow: hard offset shadows
12. Update color system
    └── Replace amber with #FF0033
    └── Add pure black (#000000)
    └── Remove gradients, glassmorphism
13. Update typography
    └── Add Archivo Black for headlines
    └── Add monospace for metadata
    └── Increase font weights
```

### Phase 5: UI COMPONENTS (Week 4-5)
```
14. Refactor GameCard
    └── Extract data logic (decodeHtmlEntities)
    └── Apply new brutalist design
    └── Add evidence/case-file styling
15. Refactor Button
    └── Add brutalist variants
    └── Hard borders, no radius
16. Refactor Badge
    └── Warning tape styling
    └── Evidence labels
17. Update all UI components
    └── Apply new design system
    └── Preserve functionality
```

### Phase 6: PAGES (Week 5-6)
```
18. Refactor Homepage
    └── Apply new layout
    └── Update hero section
    └── Brutalist game grid
19. Refactor Game Pages
    └── Game detail layouts
    └── Filter displays
20. Refactor Blog
    └── Apply new styling
    └── Fix image handling
21. Refactor Provider Pages
    └── New card designs
    └── Grid layouts
```

### Phase 7: RESPONSIVE & POLISH (Week 6-7)
```
22. Test all responsive breakpoints
    └── 320px to 1920px
    └── Tablet, mobile, desktop
23. Fix any remaining issues
    └── Overflow, clipping, z-index
24. Performance optimization
    └── Image loading
    └── Bundle analysis
25. Accessibility audit
    └── Contrast ratios
    └── Keyboard navigation
    └── Screen reader testing
```

### Phase 8: FINAL VALIDATION (Week 7-8)
```
26. Cross-browser testing
27. SEO validation
28. Performance testing
29. User testing
30. Production deployment
```

---

## 13. FILES TO TOUCH

### 🏗️ FOUNDATION
| File | Action | Priority |
|------|--------|----------|
| `src/app/globals.css` | Update design tokens for H4CK3D theme | HIGH |
| `postcss.config.mjs` | Add Tailwind config for custom theme | MEDIUM |
| `tailwind.config.ts` | Create if missing, define custom theme | MEDIUM |

### 📐 LAYOUT
| File | Action | Priority |
|------|--------|----------|
| `src/components/layout/AppShell.tsx` | **CRITICAL: Fix layout overlap** | **CRITICAL** |
| `src/components/layout/Sidebar.tsx` | Sync width with tokens | HIGH |
| `src/components/layout/Header.tsx` | Adjust for new layout | HIGH |
| `src/components/layout/MobileNavigation.tsx` | Safe area fixes | MEDIUM |
| `src/components/layout/Footer.tsx` | Visual updates | LOW |

### 🧩 COMPONENTS
| File | Action | Priority |
|------|--------|----------|
| `src/components/games/GameCard.tsx` | Refactor for new design | HIGH |
| `src/components/games/GameGrid.tsx` | Minor updates | LOW |
| `src/components/games/GameRail.tsx` | Visual updates | LOW |
| `src/components/games/GameImage.tsx` | Optimization | LOW |
| `src/components/games/GameSimulator.tsx` | **DO NOT TOUCH** (business logic) | N/A |
| `src/components/providers/ProviderCard.tsx` | Visual updates | MEDIUM |
| `src/components/providers/ProviderGrid.tsx` | Minor updates | LOW |
| `src/components/ui/Button.tsx` | Add brutalist variants | HIGH |
| `src/components/ui/Badge.tsx` | Add warning tape styling | HIGH |
| `src/components/ui/Skeleton.tsx` | Visual updates | LOW |
| `src/components/ui/Icons.tsx` | **DO NOT TOUCH** | N/A |
| `src/components/states/ApiErrorState.tsx` | Visual updates | LOW |
| `src/components/states/EmptyState.tsx` | Visual updates | LOW |
| `src/components/filters/GameFilters.tsx` | Visual updates | LOW |

### 📄 PAGES
| File | Action | Priority |
|------|--------|----------|
| `src/app/layout.tsx` | Font updates (Archivo Black) | HIGH |
| `src/app/page.tsx` | Hero section redesign | HIGH |
| `src/app/games/page.tsx` | Layout updates | MEDIUM |
| `src/app/games/[provider]/[game]/page.tsx` | Visual updates | MEDIUM |
| `src/app/new-games/page.tsx` | Visual updates | LOW |
| `src/app/featured/page.tsx` | Visual updates | LOW |
| `src/app/upcoming/page.tsx` | Visual updates | LOW |
| `src/app/providers/page.tsx` | Visual updates | MEDIUM |
| `src/app/providers/[slug]/page.tsx` | Visual updates | LOW |
| `src/app/blog/page.tsx` | Visual updates, fix images | MEDIUM |
| `src/app/blog/[slug]/page.tsx` | Visual updates, sanitize HTML | MEDIUM |
| `src/app/privacy/page.tsx` | Visual updates | LOW |
| `src/app/terms/page.tsx` | Visual updates | LOW |
| `src/app/responsible-gaming/page.tsx` | Visual updates | LOW |
| `src/app/dev/api-status/page.tsx` | Visual updates | LOW |

### 📊 DATA — DO NOT TOUCH (unless necessary)
| File | Action | Priority |
|------|--------|----------|
| `src/lib/api/wordpress.ts` | **DO NOT TOUCH** (critical data flow) | N/A |
| `src/lib/api/client.ts` | **DO NOT TOUCH** (API client) | N/A |
| `src/lib/api/schemas.ts` | **DO NOT TOUCH** (validation) | N/A |
| `src/types/game.ts` | **DO NOT TOUCH** (data model) | N/A |
| `src/types/provider.ts` | **DO NOT TOUCH** | N/A |
| `src/types/taxonomy.ts` | **DO NOT TOUCH** | N/A |
| `src/types/api.ts` | **DO NOT TOUCH** | N/A |
| `src/fixtures/games.ts` | May update for testing | LOW |
| `src/lib/env.ts` | **DO NOT TOUCH** (environment) | N/A |
| `src/lib/utils.ts` | Cautious updates | MEDIUM |

### 🎨 NEW FILES (to create for H4CK3D theme)
| File | Purpose |
|------|---------|
| `src/components/ui/WarningTape.tsx` | Warning tape decorative element |
| `src/components/ui/EvidenceLabel.tsx` | Evidence/dossier styling |
| `src/components/ui/CaseFileCard.tsx` | Case file game card variant |
| `src/styles/h4ck3d-theme.css` | H4CK3D specific overrides |
| `tailwind.config.ts` | Tailwind v4 configuration |

---
---

## 14. REFACTOR RISK SCORE

### 🎯 **8/10 — HIGH RISK**

**Zdôvodnenie:**

| Factor | Score | Reasoning |
|--------|-------|-----------|
| **Layout Fix Complexity** | 2/2 | Critical bug affecting core functionality |
| **Design System Overhaul** | 2/2 | Complete visual redesign (brutalist) |
| **Component Refactoring** | 1/2 | Multiple components need updates |
| **Responsive Work** | 1/2 | All breakpoints need verification |
| **Data Layer Stability** | 0/2 | Data layer is stable, **DO NOT TOUCH** |
| **Business Logic Protection** | 0/2 | Business logic preserved, isolated |
| **Testing Coverage** | 1/2 | Vitest + Playwright exist but need expansion |
| **Accessibility Compliance** | 1/2 | New design must maintain contrast ratios |

**Breakdown:**
- **Architecture**: 3/5 (Layout fix needed, but data layer solid)
- **Visual**: 3/5 (Complete redesign, but tokens exist)
- **Business Logic**: 0/5 (Protected, no changes needed)
- **Risk Multiplier**: Layout bug is **CRITICAL** and affects all pages

**Total: 8/10**

### Risk Mitigation Strategies:

1. **Isolate Layout Fix** (Week 1)
   - Fix `AppShell.tsx` before any visual changes
   - Test at all breakpoints
   - Verify no content is hidden

2. **Feature Flags**
   - Deploy layout fix separately from design changes
   - Use CSS feature flags for gradual rollout

3. **Comprehensive Testing**
   - Visual regression testing (Playwright)
   - Cross-browser testing
   - Responsive testing (320px-1920px)

4. **Backup Plan**
   - Keep current design as fallback
   - Rollback capability

---

## 📋 **ZÁVER**

### 🎯 **Hlavný problém identifikovaný:**
**Sidebar (240px fixed) prekrýva main content o 40-248px na desktop breakpointe (1024-1440px) kvôli kombinácii `lg:ml-60` + `max-w-7xl mx-auto` v AppShell.tsx.**

### 📊 **Architektúra:**
- Next.js 16.3.0 + React 19 + TypeScript + Tailwind CSS v4
- WordPress REST API + Custom API endpoints
- Server Components + Client Components
- Well-structured component hierarchy
- **Layout bug is CRITICAL and must be fixed first**

### 🎨 **Design System Status:**
- CSS variables exist but underutilized
- Tailwind hardcoded colors dominate
- Ready for H4CK3D theme migration
- Typography needs Archivo Black addition

### 🔧 **Refactor Priority:**
1. **Fix layout overlap** (CRITICAL)
2. **Establish design tokens** (FOUNDATION)
3. **Refactor layout components** (CORE)
4. **Apply H4CK3D theme** (VISUAL)
5. **Update all components** (UI)
6. **Test and validate** (QUALITY)

### ⚠️ **Dôležité:**
- **NEMEŇTE** data layer (`lib/api/`, `types/`)
- **NEMEŇTE** business logic (routing, filtering, game launch)
- **ZOZAMEŇTE** len vizuálnu vrstvu
- **TESTUJTE** na všetkých breakpointoch

---

**✅ AUDIT KOMPLETNÝ. Čakám na schválenie ďalšej fázy (layout fix implementácia).**
