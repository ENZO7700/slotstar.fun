# Fortuna RebuildSpec — affiliate affinity (forbid / allow)

SlotStar marketing SSOT: void black + `#E1001A` + radius `0` + Barlow Condensed / Geist.  
Fortuna žltá / Roboto / rounded radii **nie** sú globálny SlotStar theme.

Podobnosť s partnerom = **partner-scoped surfaces** + zdieľané UX patterns.

## Zakázané na SlotStar chrome

| Item | Dôvod |
|------|--------|
| Brand yellow `#FFDB01` / `#ffef01` ako primary accent | Konfliktuje s SlotStar `#E1001A` |
| Fortuna green win/live ako demo identity | Betting UI, nie discovery brand |
| Roboto Variable | SlotStar = Barlow Condensed + Geist |
| Radius 8–24px | SlotStar `--landing-radius: 0` |
| Wholesale `.ftn` light/dark CSS dump | Brand theft |
| Fortuna page IA (šport / live / betslip) | Demo magazine funnel |

## Povolené (brand-safe)

| Item | Kde |
|------|-----|
| Shell metrics (`header-height`, `fab-height`, bottom-nav clearance) | `.landing` + platform vars v `globals.css` |
| Semantic role aliases (`surface-brand`, `content-on-brand`, …) remapované na SlotStar hex | `.landing` |
| Sticky header / dense uppercase nav / HUD borders | Marketing landing |
| `reduce-motion` / focus-visible / tap-highlight | Globálne utility |
| Fortuna yellow **iba** v `.partner-fortuna` | Affiliate banner, floating CTA, PartnerStrip, footer partner column |
| `rel="sponsored noopener noreferrer"` + 18+ | `AFFILIATE_LINK_PROPS` |

## Aktivácia Fortuna affinity

1. Do [`apps/web/src/lib/affiliate.ts`](../apps/web/src/lib/affiliate.ts) nastav `FORTUNA_AFFILIATE_URL` na reálny sponsored link.
2. Nastav `AFFILIATE_PARTNER = 'fortuna'` (alebo nechaj auto: partner sa zapne keď je URL non-empty).
3. Partner surfaces (`partner-fortuna`) sa použijú na outbound affiliate CTA; SlotStar `HRAŤ DEMO` ostáva red.

## Nikdy

Nemeniť PNG-locked hero SLOT/STAR farby ani display font kvôli Fortune.
