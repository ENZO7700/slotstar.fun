# ADR 0002: SlotsLaunch as Primary Source of Truth (MODE A)

## Context
The official SlotsLaunch WordPress plugin imports, stores, and manages game data, providers, themes, types, and iframe URLs inside standard WordPress Custom Post Types (`slotsl`), Custom Taxonomies (`sl-provider`, `sl-theme`, `sl-type`), and Post Meta (`slot_attrs`, `slot_url`, `slimg`, `slpid`).

## Decision
We select **MODE A**:
- The official SlotsLaunch plugin is the single source of truth for casino catalogue data.
- We will NOT create a duplicate database structure or separate sync layer for game metadata.
- Our custom plugin `slotstar-headless` acts as a clean REST API adapter over the existing SlotsLaunch post data.

## Consequences
- SlotsLaunch remains 100% upgradeable without breaking custom code.
- Reduced database overhead and zero data redundancy.
- Seamless synchronization when SlotsLaunch background ActionScheduler tasks update game statuses or add new titles.
