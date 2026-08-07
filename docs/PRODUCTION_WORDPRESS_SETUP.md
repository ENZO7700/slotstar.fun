# Production WordPress Hardening & Scheduled Jobs

This document outlines the security hardening policies, cron setups, and Action Scheduler compatibility for running WordPress on Google Cloud Run.

---

## 1. Security Hardening Configurations

Apply these rules inside `wp-config.php` or filter plugins:

- **Disable File Edits**: `define( 'DISALLOW_FILE_EDIT', true );` (Blocks themes and plugin code modifications from the dashboard).
- **Turn off Debugging**: `define( 'WP_DEBUG', false );` (Prevents database queries and warnings from exposing inside client HTTP payloads).
- **Block XML-RPC**: XML-RPC is historically prone to DDoS and brute-force attacks. Disable it using WordPress hooks inside your plugin:
  ```php
  add_filter( 'xmlrpc_enabled', '__return_false' );
  ```
- **Force HTTPS**: Ensure users can only interact with secure SSL resources:
  ```php
  define( 'FORCE_SSL_ADMIN', true );
  ```

---

## 2. WordPress Cron & Background Scheduler

Google Cloud Run is **serverless and ephemeral**. If no traffic reaches the site, the container scales to 0 and shuts down. WordPress's default visitor-driven cron (`wp-cron.php`) will not execute regularly.

### Solution: Cloud Scheduler external trigger

1. Disable default visitor-driven cron in `wp-config.php`:
   ```php
   define( 'DISABLE_WP_CRON', true );
   ```
2. Create a secure **Google Cloud Scheduler** job that calls the cron endpoint externally every 15 minutes:
   ```bash
   gcloud scheduler jobs create http slotstar-cron \
     --schedule="*/15 * * * *" \
     --uri="https://cms.slotstar.fun/wp-cron.php?doing_wp_cron" \
     --http-method=GET \
     --location="europe-west3" \
     --project="your-gcp-project-id"
   ```

---

## 3. SlotsLaunch Action Scheduler Compatibility

SlotsLaunch uses **Action Scheduler** to process large catalog imports in the background.

- **Storage**: Action Scheduler jobs are stored in standard WordPress database tables (`wp_actionscheduler_actions` and `wp_actionscheduler_logs`), ensuring durability when containers shut down.
- **Worker Execution**: When the Cloud Scheduler trigger wakes up the container via `wp-cron.php`, the Action Scheduler queue is automatically processed. If the container shuts down mid-import, the pending queue state remains intact in the database and resumes on the next scheduler invocation.
