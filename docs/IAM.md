# GCP IAM Identity & Least-Privilege Configurations

This document describes the runtime service accounts and minimal access control rules required to run SlotStars safely without over-privileged credentials.

---

## 1. Cloud Run Runtime Identity Service Account

- **Service Account Name**: `slotstars-run-sa`
- **Full Email**: `slotstars-run-sa@${GCP_PROJECT_ID}.iam.gserviceaccount.com`

---

## 2. Minimal Required IAM Roles

To allow the container to start and access services, bind the following standard roles to the service account:

### A. Cloud SQL Client (`roles/cloudsql.client`)
Allows the Cloud Run container to establish secure connections with the SQL instance proxy socket.
```bash
gcloud projects add-iam-policy-binding "${GCP_PROJECT_ID}" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/cloudsql.client"
```

### B. Secret Manager Secret Accessor (`roles/secretmanager.secretAccessor`)
Allows the container to fetch auth salts and database passwords at startup.
```bash
gcloud projects add-iam-policy-binding "${GCP_PROJECT_ID}" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/secretmanager.secretAccessor"
```

### C. GCS Storage Object Admin (`roles/storage.objectAdmin`)
Allows the WordPress media offload plugin to write, delete, and read assets directly inside the media GCS bucket.
```bash
gcloud storage buckets add-iam-policy-binding "gs://${BUCKET_NAME}" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/storage.objectAdmin"
```

---

## 3. GitHub Actions Deploy Role

To deploy to Cloud Run via GitHub Actions without storing high-risk Service Account keys inside GitHub secrets, use **Workload Identity Federation (WIF)**:

- **WIF Pool Name**: `slotstars-actions-pool`
- **WIF Provider Name**: `slotstars-actions-provider`
- **Service Account Email**: `slotstars-deploy-sa@${GCP_PROJECT_ID}.iam.gserviceaccount.com`
- **Required roles**:
  - `roles/run.admin` (to update Cloud Run services)
  - `roles/iam.serviceAccountUser` (to assign `slotstars-run-sa` to the service)
  - `roles/artifactregistry.writer` (to push built images to registry)
