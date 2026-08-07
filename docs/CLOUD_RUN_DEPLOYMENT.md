# Google Cloud Run Deployment Guide

This document describes how to deploy the custom WordPress container image (`slotstars-wordpress`) to Google Cloud Run.

---

## 1. Local Image Construction & Registry Upload

To build and push the container manually from your machine, execute the custom registry scripts:

```bash
# Define project parameters
export GCP_PROJECT_ID="your-gcp-project-id"
export GCP_REGION="europe-west3"
export IMAGE_TAG="v1.0.0"

# Build and push
./infra/scripts/build-wordpress-image.sh
```

---

## 2. Service Deployment

Use the deployment script to substitute placeholders and apply changes to Cloud Run:

```bash
# Execute deployment script
./infra/scripts/deploy-wordpress.sh
```

Alternatively, deploy manually via CLI:

```bash
gcloud run deploy slotstars-wordpress \
  --image="${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/slotstars-containers/slotstars-wordpress:${IMAGE_TAG}" \
  --service-account="slotstars-run-sa@${GCP_PROJECT_ID}.iam.gserviceaccount.com" \
  --add-cloudsql-instances="${GCP_PROJECT_ID}:${GCP_REGION}:slotstars-mysql" \
  --allow-unauthenticated \
  --region="${GCP_REGION}" \
  --project="${GCP_PROJECT_ID}"
```

---

## 3. Scale & Performance Settings

We apply conservative, budget-friendly defaults to prevent cost overruns:

- **CPU**: `1.0`
- **Memory**: `1024Mi` (Ensures enough headroom for PHP memory limits of `512M`).
- **Minimum Instances**: `0` (Containers shut down during inactive periods, reducing runtime charges).
- **Maximum Instances**: `5` (Protects against database connection limits).
- **Concurrency**: `80` (A single container processes up to 80 concurrent connections before scaling up).
- **Request Timeout**: `300` seconds (5 minutes).
