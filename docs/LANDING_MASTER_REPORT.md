# MASTER REPORT — SlotStar Marketing Landing

**Status:** `LANDING ARCHITECTURE COMPLETE — VISUAL INPUTS STILL REQUIRED`

Shipped editorial/industrial marketing `/` under `(marketing)/`. Catalog AppShell unchanged on `/games` and other `(site)` routes.

## Architecture

| Route | Shell |
|-------|--------|
| `/` | `(marketing)` — `.landing` tokens, no sidebar/banner; `AffiliateFloatingButton` only |
| `/games`, `/providers`, … | `(site)` + `AppShell` |

## Funnel (shipped)

1. LandingHeader (sticky scroll state + mobile panel)
2. LandingHero (SLOTSTAR wordmark, editorial copy, HUD, star drift)
3. LandingTrustTicker
4. PartnerStrip (null until Fortuna URL)
5. LandingTrending (landscape chart cards)
6. LandingCategoryNav (numbered links, no pills)
7. LandingFeatured (editor pick + 4)
8. LandingNew (horizontal rail)
9. LandingProviders (monochrome wall)
10. LandingHow
11. LandingEditorial (omitted if no posts)
12. LandingFinalCta
13. LandingResponsible
14. LandingFooter

## Tokens / type / assets

- `.landing` blood tokens + noise/radial + HUD helpers in `globals.css`
- Barlow Condensed → `--font-display-landing`
- `public/brand/landing-hero-ref.png` (PNG SSOT)
- `public/brand/landing-star.svg` (watermark)

## Validation

```
typecheck  OK
lint       OK
unit tests OK (9)
build      OK
e2e        OK (33)
git diff --check OK
```

## UNRESOLVED VISUAL INPUTS

- Non-hero sections use token-only editorial structure (no dedicated artboards for Trending/Featured/New/Providers/Footer).
- Star watermark is SVG approximation of PNG brushed star — swap for extracted PNG crop if pixel fidelity required.
- Hero PNG legal line was not used; editorial microcopy locked per plan.
- Catalog amber AppShell chrome intentionally untouched.

## Do-not-touch (honored)

`lib/api/*` signatures, GameCard API, admin, launch/canonical, Fortuna yellow outside `.partner-fortuna`.
