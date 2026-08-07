# Developer & Administrator Manual — SlotStar.fun

Tento dokument je kompletným sprievodcom pre vývojárov a správcov portálu **SlotStar.fun**. Obsahuje prehľad architektúry, zoznam všetkých endpointov, návod na obsluhu WordPressu, štruktúru frontendu a riešenie problémov.

---

## 1. Zoznam Systémových URL & Prístupov

### 🌐 Produkčné Odkazy
| Služba | Adresa | Popis |
| :--- | :--- | :--- |
| **Live Frontend (Vercel)** | `https://slotstar-fun.vercel.app` / `https://slotstar.fun` | Hlavná užívateľská aplikácia |
| **WordPress CMS** | `http://slotstars.kestudio.sk` | Backend headless CMS |
| **WP Admin Administrácia** | `http://slotstars.kestudio.sk/wp-admin` | Správa hier, pluginov a obsahu |
| **REST API Base URL** | `http://slotstars.kestudio.sk/wp-json/slotstar/v1` | Headless REST API |
| **GitHub Repozitár** | `https://github.com/ENZO7700/slotstar.fun` | Zdrojový kód (branch `main`) |

### 🗄️ Databázové Parametre (WebSupport MySQL 8.4)
- **Hostiteľ databázy**: `db.r1.websupport.sk:3317`
- **Meno databázy**: `b4xq5Yx9`
- **Používateľ**: `bYynBm5S`
- **Socket**: `/tmp/mysql84.sock`

---

## 2. Kompletná Špecifikácia REST API (`/slotstar/v1`)

Custom WordPress plugin `slotstar-headless` poskytuje nasledovné bezpečné, read-only REST API endpointy pre Next.js frontend:

### 2.1 `GET /slotstar/v1/health`
Overenie stavu API, detekcia nainštalovaných pluginov a celkového počtu hier.
- **URL**: `http://slotstars.kestudio.sk/wp-json/slotstar/v1/health`
- **Odpoveď**:
  ```json
  {
    "status": "ok",
    "wordpress": true,
    "slotsLaunchPluginActive": true,
    "sourceMode": "official-plugin",
    "gamesDetected": 1500,
    "providersDetected": 45
  }
  ```

### 2.2 `GET /slotstar/v1/games`
Načítanie zoznamu publikovaných hier s podporou stránkovania, vyhľadávania a filtrovania.
- **URL**: `http://slotstars.kestudio.sk/wp-json/slotstar/v1/games`
- **Query Parametre**:
  - `page` (int, default: 1): Číslo stránky.
  - `per_page` (int, default: 24, max: 48): Počet položiek na stránku.
  - `q` (string): Vyhľadávací text v názve hry.
  - `provider` (string): Slug poskytovateľa (`sl-provider`).
  - `featured` (bool): Filtrovať odporúčané hry (`1` alebo `0`).
  - `upcoming` (bool): Filtrovať pripravované hry (`1` alebo `0`).
- **Príklad Odpovede**:
  ```json
  {
    "items": [
      {
        "id": "123",
        "title": "Gates of Olympus",
        "slug": "gates-of-olympus",
        "provider": {
          "id": "12",
          "name": "Pragmatic Play",
          "slug": "pragmatic-play"
        },
        "thumbnail": "https://cdn.slotslaunch.com/.../gates.jpg",
        "rating": 4.9,
        "isFeatured": true,
        "isUpcoming": false
      }
    ],
    "pagination": {
      "page": 1,
      "perPage": 24,
      "totalItems": 1250,
      "totalPages": 53
    }
  }
  ```

### 2.3 `GET /slotstar/v1/games/:id`
Detail konkrétnej hry podľa ID alebo slugu.
- **URL**: `http://slotstars.kestudio.sk/wp-json/slotstar/v1/games/gates-of-olympus`

### 2.4 `GET /slotstar/v1/providers`
Zoznam všetkých poskytovateľov hier s počtom hier a ikonami.
- **URL**: `http://slotstars.kestudio.sk/wp-json/slotstar/v1/providers`

### 2.5 `POST /slotstar/v1/internal/launch` (Zabezpečený Launcher)
Bypass pre bezpečné vygenerovanie Iframe launch URL cez HMAC podpis bez expozície SlotsLaunch API tokenu navonok.

---

## 3. Sekcie & Štruktúra Next.js Frontendu

Aplikácia je postavená na Next.js App Router a pozostáva z týchto hlavných sekcií:

| Trasa (Route) | Súbor v kódobáze | Popis Sekcie |
| :--- | :--- | :--- |
| `/` | `apps/web/src/app/page.tsx` | Hlavná stránka (Hero, Populárne hry, Poskytovatelia, Bleskový vyhľadávač) |
| `/games` | `apps/web/src/app/games/page.tsx` | Kompletný katalóg hier s filtrom a stránkovaním |
| `/games/[provider]/[game]` | `apps/web/src/app/games/[provider]/[game]/page.tsx` | Detail hry + Iframe prehrávač s pokynmi a atribútmi |
| `/providers` | `apps/web/src/app/providers/page.tsx` | Prehľad všetkých herných štúdií a vývojárov |
| `/providers/[slug]` | `apps/web/src/app/providers/[slug]/page.tsx` | Hry konkrétneho poskytovateľa |
| `/new-games` | `apps/web/src/app/new-games/page.tsx` | Najnovšie pridané demo sloty |
| `/featured` | `apps/web/src/app/featured/page.tsx` | Zoznam odporúčaných top hier |
| `/upcoming` | `apps/web/src/app/upcoming/page.tsx` | Pripravované hry pred oficiálnym vydaním |
| `/responsible-gaming` | `apps/web/src/app/responsible-gaming/page.tsx` | Informácie a pravidlá pre Zodpovedné hranie (18+) |
| `/privacy` | `apps/web/src/app/privacy/page.tsx` | Zásady ochrany osobných údajov |
| `/terms` | `apps/web/src/app/terms/page.tsx` | Všeobecné obchodné podmienky |

---

## 4. Konfigurácia Environment Variables

### Soubor `apps/web/.env.local` / Vercel Environment Variables:

```env
# URL vašeho Headless WordPress backendu
WORDPRESS_API_URL=http://slotstars.kestudio.sk/wp-json

# Kanonická URL Vašej Next.js aplikácie
NEXT_PUBLIC_SITE_URL=https://slotstar.fun

# SlotsLaunch Affiliate Ref ID
NEXT_PUBLIC_SLOTSLAUNCH_REF_ID=wa1UHO8r
```

---

## 5. Návod na Obsluhu WordPress Administrácie

### 5.1 Prihlásenie
- **URL**: `http://slotstars.kestudio.sk/wp-admin`
- **Meno**: `admin`
- **Heslo**: *(Vše heslo zadané pri inštalácii)*

### 5.2 Správa hier a importu (SlotsLaunch Importer)
1. V menu vľavo kliknite na **SlotsLaunch**.
2. Zadajte váš **SlotsLaunch License Key**.
3. Pre spustenie automatického naťahovania nových hier kliknite na **Run Importer**.
4. Import prebieha na pozadí pomocou **Action Scheduler**. Stav môžete sledovať v menu **Nástroje → Action Scheduler**.

### 5.3 Nastavenie trvalých odkazov (Kritické pre REST API)
Pre správne fungovanie REST API endpointov musí byť vo WordPress nastavená permalink štruktúra:
- Choďte do **Nastavenia → Trvalé odkazy** (Settings → Permalinks).
- Zvoľte možnosť **Názov príspevku** (`/%postname%/`).
- Kliknite **Uložiť zmeny**.

---

## 6. Riešenie Problémov (Troubleshooting)

### Problém: "Pripojenie k serveru zlyhalo / fetch failed" na frontende
- **Príčina**: Vercel nevie dosiahnuť WordPress API.
- **Riešenie**: Uistite sa, že na Verceli je v **Settings → Environment Variables** pridaná premenná `WORDPRESS_API_URL = http://slotstars.kestudio.sk/wp-json` a kliknite na **Redeploy**.

### Problém: REST API vracia 404 pre `/slotstar/v1/...`
- **Príčina**: Plugin `slotstar-headless` nie je aktivovaný alebo neboli uložené trvalé odkazy.
- **Riešenie**: V WP Adminu choďte do **Pluginy** a uistite sa, že `SlotStar Headless API` je AKTÍVNY. Potom choďte do **Nastavenia → Trvalé odkazy** a kliknite **Uložiť zmeny**.

---

## 7. Automatizované Skripty

| Skript | Umístnenie | Popis |
| :--- | :--- | :--- |
| **`setup-vercel-env.sh`** | `infra/scripts/setup-vercel-env.sh` | Automatické pridanie Vercel env premenných a redeploy |
| **`setup-websupport-wp.sh`** | `./setup-websupport-wp.sh` | Zabalenie pluginov a príprava balíčkov pre WebSupport |
