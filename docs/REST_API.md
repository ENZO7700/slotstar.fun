# SlotStar Headless REST API Specification (`slotstar/v1`)

The `slotstar-headless` WordPress plugin exposes clean, read-only headless REST API endpoints for Next.js frontend consumption.

Base URL: `http://localhost:8080/wp-json/slotstar/v1` (Production: `https://cms.slotstars.fun/wp-json/slotstar/v1`)

---

## 1. System Health

### `GET /health`
Returns backend health status, active plugin detection, and game counts.

**Response (200 OK):**
```json
{
  "status": "ok",
  "wordpress": true,
  "slotsLaunchPluginActive": true,
  "sourceMode": "official-plugin",
  "gamesDetected": 0,
  "providersDetected": 0
}
```

---

## 2. Games API

### `GET /games`
Fetch paginated, filtered, and searchable list of published games.

**Query Parameters:**
- `q` (string): Search query for game titles
- `page` (int, default: 1): Page number
- `per_page` (int, default: 24, max: 48): Items per page
- `provider` (string): Provider taxonomy term slug (`sl-provider`)
- `theme` (string): Theme taxonomy term slug (`sl-theme`)
- `type` (string): Type taxonomy term slug (`sl-type`)
- `filter` (string): Filter taxonomy term slug (`sl-filter`)
- `order` (string, `asc` | `desc`, default: `desc`): Sort direction
- `order_by` (string, `date` | `name` | `modified`, default: `date`): Sort field

**Response Envelope (200 OK):**
```json
{
  "data": [
    {
      "id": 123,
      "externalId": 5001,
      "name": "Gates of Olympus",
      "slug": "gates-of-olympus-5001",
      "canonicalPath": "/games/pragmatic-play/gates-of-olympus-5001",
      "thumbnail": {
        "src": "https://cdn.slotslaunch.com/images/gates-of-olympus.webp",
        "alt": "Gates of Olympus"
      },
      "provider": {
        "id": 12,
        "name": "Pragmatic Play",
        "slug": "pragmatic-play"
      },
      "themes": [
        {
          "id": 4,
          "name": "Greece",
          "slug": "greece"
        }
      ],
      "type": {
        "id": 2,
        "name": "Video Slot",
        "slug": "video-slot"
      },
      "filters": [],
      "releaseDate": "2021-02-13",
      "description": null,
      "rtp": "96.50%",
      "volatility": "High",
      "featured": false,
      "upcoming": false,
      "modifiedAt": "2026-08-07 00:00:00"
    }
  ],
  "pagination": {
    "page": 1,
    "perPage": 24,
    "total": 1,
    "totalPages": 1
  }
}
```

---

### `GET /games/{externalId}`
Fetch detailed game metadata by SlotsLaunch external game ID (`slpid`).

**Response (200 OK):**
*Note: Public catalogs contain zero sensitive URLs or token variables.*
```json
{
  "id": 123,
  "externalId": 5001,
  "name": "Gates of Olympus",
  "slug": "gates-of-olympus-5001",
  "canonicalPath": "/games/pragmatic-play/gates-of-olympus-5001",
  "thumbnail": {
    "src": "https://cdn.slotslaunch.com/images/gates-of-olympus.webp",
    "alt": "Gates of Olympus"
  },
  "provider": {
    "id": 12,
    "name": "Pragmatic Play",
    "slug": "pragmatic-play"
  },
  "themes": [
    {
      "id": 4,
      "name": "Greece",
      "slug": "greece"
    }
  ],
  "type": {
    "id": 2,
    "name": "Video Slot",
    "slug": "video-slot"
  },
  "filters": [],
  "releaseDate": "2021-02-13",
  "description": "Play Gates of Olympus demo slot for free.",
  "rtp": "96.50%",
  "volatility": "High",
  "featured": false,
  "upcoming": false,
  "modifiedAt": "2026-08-07 00:00:00"
}
```

---

## 3. Secure Game Launch API

### `POST /internal/launch/{externalId}`
Request the secure authenticated SlotsLaunch game iframe URL.

**Required Headers:**
- `X-SlotStar-Signature` (string): HMAC SHA-256 signature calculated as `hash_hmac('sha256', timestamp . '.' . method . '.' . path . '.' . bodyHash, SLOTSTAR_BRIDGE_SECRET)`
- `X-SlotStar-Timestamp` (int): Epoch timestamp in seconds. Requests outside a 5-minute skew window are rejected.

**Response (200 OK):**
```json
{
  "embedUrl": "https://slotslaunch.com/iframe/5001?token=abc123exampletoken"
}
```

---

## 4. Taxonomies API

### `GET /providers`
Fetch list of game providers (`sl-provider` taxonomy terms).

**Query Parameters:**
- `q` (string): Search query
- `page` (int, default: 1): Page number
- `per_page` (int, default: 24, max: 48): Items per page
- `letter` (string): Filters providers starting with the specified alphabetical character

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 12,
      "name": "Pragmatic Play",
      "slug": "pragmatic-play",
      "count": 250
    }
  ],
  "pagination": {
    "page": 1,
    "perPage": 24,
    "total": 1,
    "totalPages": 1
  }
}
```

---

### `GET /providers/{slug}`
Fetch single provider metadata by slug.

---

### `GET /themes`
Fetch theme categories (`sl-theme`).

### `GET /types`
Fetch game types (`sl-type`).

### `GET /filters`
Fetch general filters (`sl-filter`).

---

## 5. Security & Privacy Guarantees
1. **Zero Secret Exposure**: Public endpoints **never** expose `slot_url`, `token`, `slotsl_settings`, admin options, or database credentials.
2. **Dynamic HMAC Verification**: Secure game launcher acts as a server-to-server gateway verified with a pre-shared bridge signature.
3. **Strict Sanitization**: All inputs are type-cast and sanitized.
