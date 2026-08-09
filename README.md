# SlotStar.fun — WordPress & Next.js Monorepo

Tento repozitár obsahuje kompletný zdrojový kód pre casino affiliate portál **SlotStar.fun**. Projekt spája headless WordPress backend bežiaci na WebSupporte s moderným Next.js frontendom nasadeným na Verceli.

---

## 1. Rýchly prehľad (Production Overview)

| Komponent | Služba / Registrátor | URL / Repozitár |
| :--- | :--- | :--- |
| **GitHub Repozitár** | GitHub (`ENZO7700`) | `https://github.com/ENZO7700/slotstar.fun` |
| **Frontend (Next.js)** | Vercel | `https://slotstar-fun.vercel.app` (alebo `https://slotstar.fun`) |
| **Backend (WordPress CMS)** | WebSupport | `http://slotstars.kestudio.sk` |
| **WP Admin Panel** | WebSupport | `http://slotstars.kestudio.sk/wp-admin` |
| **Headless REST API** | WordPress | `http://slotstars.kestudio.sk/wp-json/slotstar/v1` |
| **Databáza** | WebSupport MySQL 8.4 | Host: `db.r1.websupport.sk:3317` (DB: `b4xq5Yx9`) |
| **Affiliate Ref ID** | SlotsLaunch | `wa1UHO8r` |

---

## 2. Architektúra & Štruktúra Repozitára

```text
├── apps/
│   ├── web/                     # Next.js App Router (React 19, TypeScript, Tailwind CSS)
│   └── wordpress/               # WordPress Core, custom headless plugins & themes
│       └── wp-content/plugins/
│           ├── slotslaunch/     # Oficiálny SlotsLaunch Importer plugin (v1.4.1.6)
│           └── slotstar-headless/# Custom SlotStar Headless REST API plugin
├── infra/
│   ├── cloud-run/               # Cloud Run service definitions (GCP ready)
│   ├── docker/                  # Dockerfile & php.ini pre WordPress kontajner
│   └── scripts/                 # Automatizačné skripty (Vercel env setup, GCP bootstrap)
├── docs/                        # Detailné technické špecifikácie (API, DNS, DB, Logy)
├── DEVELOPER.md                 # Kompletný vývojársky manuál, endpointy a príručka
├── package.json                 # Monorepo workspaces definícia
└── setup-websupport-wp.sh       # Skript pre balenie a nasadenie na WebSupport
```

---

## 3. Lokálny Vývoj (Local Development)

### 3.1 Prerekvizity
- **Node.js**: verzia 20+
- **PHP**: verzia 8.2+
- **MySQL**: verzia 8.0+

### 3.2 Spustenie Next.js Vývojového Servera
```bash
# Nainštalovať závislosti pre celý monorepo workspace
npm install

# Spustiť vývojový server
cd apps/web
npm run dev
```
Aplikácia pobeží na `http://localhost:3377`.

---

## 4. Nasadenie (Deployment Workflow)

### Next.js (Vercel)
Každý push do vetvy `main` na GitHube (`ENZO7700/slotstar.fun`) automaticky spustí produkčný build na Verceli.

Automatické pridanie Environment Variables a trigger redeployu z terminálu:
```bash
./infra/scripts/setup-vercel-env.sh
```

---

## 5. Dokumentácia

Pre podrobné príručky pozrite:
- **[DEVELOPER.md](file:///Users/erikbabcan/HUB/01-Projekty/slotstar.fun/DEVELOPER.md)**: Kompletný vývojársky a administrátorský manuál, zoznam všetkých endpointov a návod na obsluhu.
- **[docs/REST_API.md](file:///Users/erikbabcan/HUB/01-Projekty/slotstar.fun/docs/REST_API.md)**: Detailná špecifikácia REST API endpointov `/games`, `/providers` a `/health`.
- **[docs/DNS_SETUP.md](file:///Users/erikbabcan/HUB/01-Projekty/slotstar.fun/docs/DNS_SETUP.md)**: DNS konfigurácie pre Vercel a WebSupport.
