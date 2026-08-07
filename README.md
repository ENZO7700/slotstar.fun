# SlotStars.fun — WordPress & Next.js Monorepo

Tento repozitár obsahuje kompletný zdrojový kód pre casino affiliate portál **SlotStars.fun**. Projekt spája robustný backend postavený na WordPress s moderným, vysoko optimalizovaným Next.js frontendom.

---

## 1. Informácie o projekte
- **Názov**: SlotStars
- **Hlavná produkčná doména**: `https://slotstars.fun`
- **Subdoména administrácie (CMS)**: `https://cms.slotstars.fun`
- **Affiliate Ref ID**: `wa1UHO8r` (Slots Launch Marketing Ref Link: `https://slotslaunch.com?ref=wa1UHO8r`)

---

## 2. Architektúra & Štruktúra repozitára

Projekt je organizovaný ako monorepo pre zjednodušenú správu verzií a bezpečné nasadenie:

```text
├── apps/
│   ├── web/                     # Next.js App Router (React, TypeScript, Tailwind CSS)
│   └── wordpress/               # WordPress Core configuration, custom headless plugins & themes
├── infra/
│   ├── cloud-run/               # Google Cloud Run configuration service.yaml
│   ├── docker/                  # Dockerfile & php.ini definitions for custom WordPress image
│   └── scripts/                 # Automation scripts (GCP bootstrap, build & deploy)
├── docs/                        # Complete technical specifications & architectures
├── .github/
│   └── workflows/               # CI/CD action templates (validation checks, deploy workflows)
└── package.json                 # Monorepo workspaces definition
```

---

## 3. Vývojársky manuál (Local Development)

### 3.1 Prerekvizity
- **Node.js**: verzia 20+
- **PHP**: verzia 8.2+
- **MySQL**: verzia 8.0+
- **WP-CLI**: globálne nainštalované

### 3.2 Spustenie MySQL databázy (macOS)
```bash
brew services start mysql@8.0
```
Uistite sa, že databáza `slotstar_db` existuje na vašom porte 3306.

### 3.3 Spustenie WordPress lokálneho servera
```bash
php -d memory_limit=512M /opt/homebrew/bin/wp server --host=127.0.0.1 --port=8080 --path=/Users/erikbabcan/HUB/01-Projekty/slotstar.fun/apps/wordpress
```
- Administrácia: `http://localhost:8080/wp-admin`
- Prihlasovacie údaje: `admin` / `Password123!`

### 3.4 Spustenie Next.js frontendu
Nainštalujte dependencies a spustite vývojový server Next.js:
```bash
# Nainštalovať dependencies pre celý workspace
npm install

# Spustiť Next.js vývojový server
cd apps/web
npm run dev
```
Vývojová verzia Next.js beží na `http://localhost:3000`.

---

## 4. Architektúra & GCP nasadenie (Production)

Pre nasadenie v prostredí Google Cloud Platform (GCP) sú predpripravené nasledovné komponenty:
1. **Google Cloud Run**: Pre prevádzku bezstavového custom WordPress kontajnera (`infra/docker/wordpress/Dockerfile`).
2. **Google Cloud SQL**: MySQL 8.0 databáza pre bezpečné ukladanie dát.
3. **Google Cloud Storage**: Vedro (`slotstars-media-${GCP_PROJECT_ID}`) pre persistentný uploads offload.
4. **Google Secret Manager**: Pre bezpečné uloženie prístupových saltov a hesiel.
5. **Google Cloud Scheduler**: Pre pravidelné spúšťanie external cron triggeru (`wp-cron.php`).

### 4.1 Užitočné skripty v `infra/scripts/`
- **[gcp-bootstrap.sh](file:///Users/erikbabcan/HUB/01-Projekty/slotstar.fun/infra/scripts/gcp-bootstrap.sh)**: Automaticky povolí Google API, vytvorí SQL inštanciu, media vedro, Secret Manager a nastaví IAM roly s minimálnymi oprávneniami.
- **[build-wordpress-image.sh](file:///Users/erikbabcan/HUB/01-Projekty/slotstar.fun/infra/scripts/build-wordpress-image.sh)**: Postaví produkčný Docker kontajner a nahrá ho na GCP Artifact Registry.
- **[deploy-wordpress.sh](file:///Users/erikbabcan/HUB/01-Projekty/slotstar.fun/infra/scripts/deploy-wordpress.sh)**: Nasadí skompilovaný kontajner priamo do Cloud Run podľa parametrov v `infra/cloud-run/service.yaml`.

---

## 5. Kompletná dokumentácia (docs/)

Pre detailné technické špecifikácie si prečítajte nasledovné príručky:

1. **[GCP_ARCHITECTURE.md](file:///Users/erikbabcan/HUB/01-Projekty/slotstar.fun/docs/GCP_ARCHITECTURE.md)**: Topografia, architektúra a dátový tok.
2. **[CLOUD_RUN_DEPLOYMENT.md](file:///Users/erikbabcan/HUB/01-Projekty/slotstar.fun/docs/CLOUD_RUN_DEPLOYMENT.md)**: Podrobný postup pre nasadzovanie kontajnerov.
3. **[CLOUD_SQL_SETUP.md](file:///Users/erikbabcan/HUB/01-Projekty/slotstar.fun/docs/CLOUD_SQL_SETUP.md)**: Konfigurácia databáz, privátna sieť, limity pripojení a zálohovanie.
4. **[GCS_MEDIA.md](file:///Users/erikbabcan/HUB/01-Projekty/slotstar.fun/docs/GCS_MEDIA.md)**: Integrácia offloadu médií s Google Cloud Storage.
5. **[SECRET_MANAGER.md](file:///Users/erikbabcan/HUB/01-Projekty/slotstar.fun/docs/SECRET_MANAGER.md)**: Zoznam požadovaných tajných premenných a správa verzií.
6. **[IAM.md](file:///Users/erikbabcan/HUB/01-Projekty/slotstar.fun/docs/IAM.md)**: Prístupy a role (least-privilege model) a Workload Identity Federation pre GitHub Actions.
7. **[DATABASE_MIGRATION.md](file:///Users/erikbabcan/HUB/01-Projekty/slotstar.fun/docs/DATABASE_MIGRATION.md)**: Inicializácia databázy a WP-CLI search-replace postupy.
8. **[PRODUCTION_WORDPRESS_SETUP.md](file:///Users/erikbabcan/HUB/01-Projekty/slotstar.fun/docs/PRODUCTION_WORDPRESS_SETUP.md)**: Bezpečnostné pravidlá, Cloud Scheduler a Action Scheduler.
9. **[DNS_SETUP.md](file:///Users/erikbabcan/HUB/01-Projekty/slotstar.fun/docs/DNS_SETUP.md)**: Prepojenie domén (Vercel A záznamy, GCP CNAME záznamy).
10. **[LOGGING.md](file:///Users/erikbabcan/HUB/01-Projekty/slotstar.fun/docs/LOGGING.md)**: Zber logov a pravidlá pre maskovanie citlivých údajov.
11. **[REST_API.md](file:///Users/erikbabcan/HUB/01-Projekty/slotstar.fun/docs/REST_API.md)**: Kompletná dokumentácia API endpointov `/games`, `/providers` a zabezpečeného HMAC launcheru `/internal/launch`.
12. **[NEXTJS_DATA_LAYER.md](file:///Users/erikbabcan/HUB/01-Projekty/slotstar.fun/docs/NEXTJS_DATA_LAYER.md)**: Spôsob načítavania a cachovania dát na strane Next.js.
13. **[DOMAIN_BLOCKER.md](file:///Users/erikbabcan/HUB/01-Projekty/slotstar.fun/docs/DOMAIN_BLOCKER.md)**: Záznam o overení a zosúladení whitelistu domén (Stav: **VYRIEŠENÉ**).
14. **[SLOTSLAUNCH_PLUGIN_AUDIT.md](file:///Users/erikbabcan/HUB/01-Projekty/slotstar.fun/docs/SLOTSLAUNCH_PLUGIN_AUDIT.md)**: Bezpečnostný a architektonický audit fungovania pluginu SlotsLaunch.
15. **[VERCEL_DEPLOYMENT.md](file:///Users/erikbabcan/HUB/01-Projekty/slotstar.fun/docs/VERCEL_DEPLOYMENT.md)**: Nasadenie Next.js frontendu.

---

## 6. Kvalita kódu & CI (GitHub Actions)

Každý pull request a commit spúšťa automatizované testy kvality definované v [ci.yml](file:///Users/erikbabcan/HUB/01-Projekty/slotstar.fun/.github/workflows/ci.yml):
- **Next.js**: `eslint` linting, `typescript` typecheck a produkčný `build`.
- **WordPress**: Kontrola syntaxe všetkých custom PHP súborov a linter validácie.
- **Shell**: Validácia syntaxe bash skriptov pomocou `bash -n`.
