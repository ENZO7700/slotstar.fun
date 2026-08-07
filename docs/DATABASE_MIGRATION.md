# Production WordPress Provisioning & Database Migration

This document outlines the migration options and preferred strategy to initialize database contents on Google Cloud SQL.

---

## OPTION A: Fresh Production WordPress + SlotsLaunch Import (PREFERRED)

To avoid importing local configurations, broken URL paths, and development test records, provision the database from scratch:

1. **Deploy Clean Container**: Link the container image to the production Cloud SQL database.
2. **Install WordPress Core**: Open `https://cms.slotstars.fun/wp-admin` and run the initial setup wizard (choose a secure non-default username, do not use `admin`).
3. **Configure Media Storage**: Install and configure `wp-stateless` to offload uploads to your GCS bucket.
4. **Enter SlotsLaunch License Key**: Add the production license token inside WordPress SlotsLaunch settings page.
5. **Run Initial Importer**: Trigger the SlotsLaunch background importer.
6. **Wait for Completion**: Monitor the progress via WordPress Action Scheduler logs.
7. **Deploy Next.js Frontend**: Connect Vercel after verification of catalog endpoint payload outputs.

---

## OPTION B: Database Export & SQL Migration

If you must migrate existing local contents:

### Risks
- **Domain Serializations**: WordPress stores site URLs serialized inside the database (e.g. `http://localhost:8080`). Direct search-and-replace using raw queries can corrupt serialized arrays.
- **Development Cruft**: Compromised passwords, old test pages, and development users will be migrated to the live database.

### Action Plan
1. Export the database dump:
   ```bash
   mysqldump -u root -p slotstar_db > local_backup.sql
   ```
2. Use **WP-CLI Search-Replace** tool or database replacement scripts (like `srdb` or `wp-cli` command) to change domains safely:
   ```bash
   wp search-replace "http://localhost:8080" "https://cms.slotstars.fun" --allow-blob
   ```
3. Import the updated dump to Google Cloud SQL:
   ```bash
   gcloud sql import sql slotstars-mysql gs://slotstars-migration-bucket/local_backup_replaced.sql \
     --database=slotstars_db \
     --project="your-gcp-project-id"
   ```
