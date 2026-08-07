#!/usr/bin/env bash

# ==================================================
# SLOTSTARS.FUN - CLOUD RUN DEPLOYMENT SCRIPT
# ==================================================

set -euo pipefail

# Required configurations
export GCP_PROJECT_ID="${GCP_PROJECT_ID:-}"
export GCP_REGION="${GCP_REGION:-}"
export CLOUD_SQL_INSTANCE="${CLOUD_SQL_INSTANCE:-slotstars-mysql}"
export SERVICE_ACCOUNT_EMAIL="${SERVICE_ACCOUNT_EMAIL:-slotstars-run-sa@${GCP_PROJECT_ID}.iam.gserviceaccount.com}"
export ARTIFACT_REGISTRY_REPOSITORY="${ARTIFACT_REGISTRY_REPOSITORY:-slotstars-containers}"
export IMAGE_NAME="${IMAGE_NAME:-slotstars-wordpress}"
export IMAGE_TAG="${IMAGE_TAG:-latest}"
export DB_NAME="${DB_NAME:-slotstars_db}"
export DB_USER="${DB_USER:-wp_user}"

if [ -z "${GCP_PROJECT_ID}" ] || [ -z "${GCP_REGION}" ]; then
  echo "Error: GCP_PROJECT_ID and GCP_REGION environment variables must be defined."
  echo "Usage: GCP_PROJECT_ID=project GCP_REGION=region ./deploy-wordpress.sh"
  exit 1
fi

TEMPLATE_FILE="infra/cloud-run/service.yaml"
DEPLOY_FILE="infra/cloud-run/service.deployed.yaml"

if [ ! -f "${TEMPLATE_FILE}" ]; then
  echo "Error: Template file ${TEMPLATE_FILE} not found."
  exit 1
fi

echo "Substituting environment placeholders in service.yaml..."
# Replaces env placeholders safely using perl or sed to create deploy configuration
sed -e "s/\${GCP_PROJECT_ID}/${GCP_PROJECT_ID}/g" \
    -e "s/\${GCP_REGION}/${GCP_REGION}/g" \
    -e "s/\${CLOUD_SQL_INSTANCE}/${CLOUD_SQL_INSTANCE}/g" \
    -e "s/\${SERVICE_ACCOUNT_EMAIL}/${SERVICE_ACCOUNT_EMAIL}/g" \
    -e "s/\${ARTIFACT_REGISTRY_REPOSITORY}/${ARTIFACT_REGISTRY_REPOSITORY}/g" \
    -e "s/\${IMAGE_NAME}/${IMAGE_NAME}/g" \
    -e "s/\${IMAGE_TAG}/${IMAGE_TAG}/g" \
    -e "s/\${DB_NAME}/${DB_NAME}/g" \
    -e "s/\${DB_USER}/${DB_USER}/g" \
    "${TEMPLATE_FILE}" > "${DEPLOY_FILE}"

echo "Deploying SlotStars WordPress to Cloud Run..."
gcloud run services replace "${DEPLOY_FILE}" \
  --project="${GCP_PROJECT_ID}" \
  --region="${GCP_REGION}" \
  --quiet

echo "Cleaning up temporary deployment file..."
rm -f "${DEPLOY_FILE}"

echo "WordPress deployed successfully to Cloud Run."
echo "Map your custom domain cms.slotstar.fun in GCP settings."
