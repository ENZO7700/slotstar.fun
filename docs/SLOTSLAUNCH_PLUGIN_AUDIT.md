# SlotsLaunch Plugin Audit Report

This audit documents the internal data structure, storage mechanisms, hooks, and API client behavior of the official SlotsLaunch WordPress plugin (v1.4.1.6).

---

## 1. Plugin Identification
- **Version**: `1.4.1.6`
- **Entrypoint**: `slotslaunch.php`
- **Plugin Directory**: `wp-content/plugins/slotslaunch`
- **Text Domain**: `slotslaunch`

FILE: `apps/wordpress/wp-content/plugins/slotslaunch/slotslaunch.php`  
LINE: 14 & 34  
SYMBOL: `SLOTSLAUNCH_VERSION`  
PURPOSE: Defines current plugin version (1.4.1.6).

---

## 2. Custom Post Types & Taxonomies

### Custom Post Type
- **Post Type Slug**: `slotsl`
- **Label**: `Slots`
- **Description**: `Slot news and reviews`

FILE: `apps/wordpress/wp-content/plugins/slotslaunch/includes/class-slotslaunch-cpt.php`  
LINE: 25  
SYMBOL: `slotsl` CPT Registration  
PURPOSE: Registers post type for all demo games.

### Taxonomies
1. **Provider**: `sl-provider` (hierarchical taxonomy for game providers)
2. **Theme**: `sl-theme` (hierarchical taxonomy for game themes like Egypt, Fruits, etc.)
3. **Type**: `sl-type` (taxonomy for slot types like Video Slots, Megaways, etc.)
4. **Filter**: `sl-filter` (taxonomy for general game filters)

FILE: `apps/wordpress/wp-content/plugins/slotslaunch/includes/class-slotslaunch-cpt.php`  
LINE: 60-140  
SYMBOL: `sl-provider`, `sl-theme`, `sl-type`, `sl-filter`  
PURPOSE: Registers taxonomies attached to `slotsl` post type.

---

## 3. Post Meta Storage Data Model

Every game (`slotsl` post) uses the following post meta keys:

| Meta Key | Data Type | Purpose | Example |
| :--- | :--- | :--- | :--- |
| `slpid` | string/int | External SlotsLaunch Game ID | `5001` |
| `slot_url` | string | Base Iframe/Embed URL | `https://embed.slotslaunch.com/...` |
| `slimg` | string (URL) | Game Thumbnail Image URL | `https://cdn.slotslaunch.com/...` |
| `slpublish` | string/int | Published Status Flag (`1` or `0`) | `1` |
| `slupcoming` | string/int | Upcoming Game Flag (`1` or `0`) | `0` |
| `slot_attrs` | serialized array | Game attributes (RTP, Volatility, Reels, Paylines, Release Date, etc.) | `['rtp' => '96.5%', 'volatility' => 'High', ...]` |
| `slotsl_rating` | float | Game rating score | `4.8` |

FILE: `apps/wordpress/wp-content/plugins/slotslaunch/admin/class-slotslaunch-importer.php`  
LINE: 696–717  
SYMBOL: `meta_input` & `update_post_meta`  
PURPOSE: Saves external game ID (`slpid`), thumbnail (`slimg`), launch URL (`slot_url`), publish/upcoming flags, and attributes (`slot_attrs`).

---

## 4. Settings & API Storage

### Option Key
- **Primary Option**: `slotsl_settings` (array)
- **License Field**: `slotsl_settings['license']`

FILE: `apps/wordpress/wp-content/plugins/slotslaunch/includes/class-slotslaunch-client.php`  
LINE: 24-25  
SYMBOL: `SlotsLaunch_Client::get()`  
PURPOSE: Reads `$opts = slotsl_settings(); $args['token'] = $opts['license'];` for API authentication.

---

## 5. API Client & Origin Validation

FILE: `apps/wordpress/wp-content/plugins/slotslaunch/includes/class-slotslaunch-client.php`  
LINE: 37  
SYMBOL: `Origin` header  
PURPOSE: Sends `'Origin' => empty($_SERVER['HTTP_HOST']) ? parse_url(get_site_url(), PHP_URL_HOST ) : $_SERVER['HTTP_HOST']`. The API key is domain-bound to `slotstars.fun`.

### Embed / Iframe Generator
FILE: `apps/wordpress/wp-content/plugins/slotslaunch/includes/class-slotslaunch-client.php`  
LINE: 83–94  
SYMBOL: `SlotsLaunch_Client::generateUrl( $id )`  
PURPOSE: Generates authenticated iframe URL by appending license token `token` and `o=wp` to the `slot_url` post meta.

---

## 6. Importer & Cron Actions

FILE: `apps/wordpress/wp-content/plugins/slotslaunch/admin/class-slotslaunch-importer.php`  
LINE: 10–23 & 60–63  
SYMBOL: `ActionScheduler` / `as_schedule_recurring_action`  
PURPOSE: Uses WooCommerce ActionScheduler to process background batches (`sl_daily_import`, `sl_install_games`).

---

## 7. Shortcodes & REST Routes
- **Admin Settings Page**: `http://localhost:8080/wp-admin/admin.php?page=slotsl-settings`
- **Shortcodes**: `[slotsl_game]`, `[slotsl_lobby]` (used in classic WP, ignored for headless)
- **Update Mechanism**: Handled via `ActionScheduler` daily cron or manual trigger in admin.
