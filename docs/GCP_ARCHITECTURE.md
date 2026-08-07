# GCP Architecture & Topography Blueprint

This document details the production architecture for the **SlotStars** casino affiliate catalog.

## Architecture Topography

```mermaid
graph TD
    Client[Browser Client]
    
    subgraph Frontend [Vercel Hosting]
        NextApp[Next.js App Router]
    end
    
    subgraph Backend [Google Cloud Platform]
        GCLB[Cloud Load Balancer / Domain Map]
        CloudRun[Google Cloud Run: WordPress Container]
        CloudSQL[(Google Cloud SQL: MySQL)]
        GCS[Google Cloud Storage: uploads-bucket]
        GSM[Secret Manager: Salts & Passwords]
        Scheduler[Cloud Scheduler: External Cron]
    end
    
    Client -->|Browse Website| NextApp
    NextApp -->|Fetch Public Catalogue API| GCLB
    GCLB -->|REST Requests| CloudRun
    
    CloudRun -->|Write/Read Data| CloudSQL
    CloudRun -->|Offload uploads/media| GCS
    CloudRun -->|Fetch Credentials on startup| GSM
    Scheduler -->|Trigger Externally| CloudRun
```

---

## Component Role Matrix

1. **Next.js Frontend (Vercel)**: Serves the static page layouts and fetches clean JSON catalogs from the WordPress REST API endpoint on-demand.
2. **WordPress Core (Google Cloud Run)**: Running stateless, containerized Apache/PHP execution instances. Scales down to zero when idle to minimize costs.
3. **Database Layer (Google Cloud SQL)**: Fully-managed MySQL 8.0 instance configured with automated daily backups and Point-In-Time-Recovery (PITR).
4. **Media uploads (Google Cloud Storage)**: Standard multi-regional bucket holding persistent media. Cloud Run container directories are ephemeral, so media uploads are offloaded directly to GCS.
5. **Key Management (Secret Manager)**: Securely stores sensitive variables (salts, database passwords, bridge secrets). Mounted as server-only environment configurations in Cloud Run.
6. **Background Tasks (Cloud Scheduler)**: Sends periodic authenticated HTTP requests to run the WordPress cron loop.
