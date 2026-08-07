#!/usr/bin/env bash

# ==================================================
# SLOTSTARS.FUN - GOOGLE CLOUD REGION BOOTSTRAP SCRIPT
# ==================================================

set -euo pipefail

# Check for required variables
if [ -z "${GCP_PROJECT_ID:-}" ] || [ -z "${GCP_REGION:-}" ]; then
  echo "Error: GCP_PROJECT_ID and GCP_REGION environment variables must be defined."
  echo "Usage: GCP_PROJECT_ID=your-project GCP_REGION=europe-west3 ./gcp-bootstrap.sh"
  exit 1
fi

# Cost notification & confirmation check
echo "=================================================="
echo "COST IMPACTION NOTICE:"
echo "- Database: Cloud SQL MySQL instance using standard micro size."
echo "- Storage: Cloud Storage bucket for media storage."
echo "- Key Management: Secret Manager keys creation."
echo "API enablement is free, but active DB and storage incur cost."
echo "=================================================="
read -p "Do you want to proceed with bootstrap configuration? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Bootstrap aborted."
  exit 0
fi

# 1. Enable Required Services
echo "Enabling necessary Google APIs..."
gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  storage.googleapis.com \
  cloudscheduler.googleapis.com \
  iamcredentials.googleapis.com \
  --project="${GCP_PROJECT_ID}"

# 2. Create Artifact Registry Repository
echo "Creating Artifact Registry Repository..."
gcloud artifacts repositories create slotstars-containers \
  --repository-format=docker \
  --location="${GCP_REGION}" \
  --description="Docker repository for SlotStars WordPress" \
  --project="${GCP_PROJECT_ID}" || echo "Repository already exists."

# 3. Create Service Account
echo "Creating Cloud Run runtime identity service account..."
SA_NAME="slotstars-run-sa"
SA_EMAIL="${SA_NAME}@${GCP_PROJECT_ID}.iam.gserviceaccount.com"

gcloud iam service-accounts create "${SA_NAME}" \
  --display-name="SlotStars Cloud Run Service Account" \
  --project="${GCP_PROJECT_ID}" || echo "Service account already exists."

# 4. Create Cloud SQL Instance
echo "Creating Cloud SQL MySQL Instance (micro instance for cost efficiency)..."
# Micro tier db-f1-micro is standard for low cost start, pitr is recommended for production.
gcloud sql instances create slotstars-mysql \
  --database-version=MYSQL_8_0 \
  --tier=db-f1-micro \
  --region="${GCP_REGION}" \
  --project="${GCP_PROJECT_ID}" || echo "SQL Instance already exists."

# 5. Create Cloud Storage bucket
echo "Creating Cloud Storage bucket for uploads offloading..."
BUCKET_NAME="slotstars-media-${GCP_PROJECT_ID}"
gsutil mb -l "${GCP_REGION}" -p "${GCP_PROJECT_ID}" "gs://${BUCKET_NAME}" || echo "Bucket already exists."
gsutil iam ch allUsers:objectViewer "gs://${BUCKET_NAME}" || echo "Bucket public permission already configured."

# 6. Create Secret Manager placeholders
echo "Creating Secret Manager secret placeholders..."
SECRETS=(
  "slotstars-db-password"
  "slotstars-bridge-secret"
  "slotstars-wp-auth-key"
  "slotstars-wp-secure-auth-key"
  "slotstars-wp-logged-in-key"
  "slotstars-wp-nonce-key"
  "slotstars-wp-auth-salt"
  "slotstars-wp-secure-auth-salt"
  "slotstars-wp-logged-in-salt"
  "slotstars-wp-nonce-salt"
)

for secret in "${SECRETS[@]}"; do
  gcloud secrets create "${secret}" \
    --replication-policy="automatic" \
    --project="${GCP_PROJECT_ID}" || echo "Secret ${secret} already exists."
done

# 7. IAM Bindings for Service Account
echo "Assigning least-privilege roles to the service account..."
gcloud projects add-iam-policy-binding "${GCP_PROJECT_ID}" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/cloudsql.client"

gcloud projects add-iam-policy-binding "${GCP_PROJECT_ID}" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/secretmanager.secretAccessor"

gcloud storage buckets add-iam-policy-binding "gs://${BUCKET_NAME}" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/storage.objectAdmin"

echo "=================================================="
echo "BOOTSTRAP COMPLETED SUCCESSFULLY"
echo "- Cloud Run Service Account: ${SA_EMAIL}"
echo "- GCS Media Bucket: gs://${BUCKET_NAME}"
echo "Configure secret values in Secret Manager before deploying."
echo "=================================================="
