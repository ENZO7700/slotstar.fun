# Production Logging & Security Policies

This document outlines the standard logging and privacy requirements for SlotStars production hosts on Google Cloud.

---

## 1. Cloud Logging Integration

WordPress in our container writes all output errors directly to standard out (`stdout` or `stderr`) streams using standard PHP error handling logs.

- Cloud Run automatically aggregates container output logs and forwards them to **Google Cloud Logging**.
- Do not write log files inside the container directory (`wp-content/debug.log`) since container storage is ephemeral and writing to local files blocks concurrent container scaling performance.

---

## 2. PII & Secret Data Stripping Policy

To ensure compliance with GDPR and protect security endpoints, configurations must **never** write the following details to logging streams:

1. **Database Passwords**: Do not log connection errors containing raw `DB_PASSWORD` or database connection strings.
2. **Access tokens**: Strip the `token` parameter from any SlotsLaunch API query error logs.
3. **Bridge secrets**: Never log the `SLOTSTAR_BRIDGE_SECRET` payload or header variables.
4. **Authorization headers**: Strip the client headers `X-SlotStar-Signature` and `Authorization` from API request dumps.

---

## 3. Querying Production Logs

Filter and query logs inside the Google Cloud Logging dashboard using the following Log Explorer queries:

```text
# Query WordPress container logs
resource.type="cloud_run_revision"
resource.labels.service_name="slotstars-wordpress"

# Filter PHP Errors
resource.type="cloud_run_revision"
textPayload =~ "PHP Fatal error" OR textPayload =~ "PHP Warning"
```
