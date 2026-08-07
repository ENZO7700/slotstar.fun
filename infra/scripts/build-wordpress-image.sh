#!/usr/bin/env bash

# ==================================================
# SLOTSTARS.FUN - DOCKER BUILD & PUSH TO ARTIFACT REGISTRY
# ==================================================

set -euo pipefail

# Required configurations
GCP_PROJECT_ID="${GCP_PROJECT_ID:-}"
GCP_REGION="${GCP_REGION:-}"
ARTIFACT_REGISTRY_REPOSITORY="${ARTIFACT_REGISTRY_REPOSITORY:-slotstars-containers}"
IMAGE_NAME="${IMAGE_NAME:-slotstars-wordpress}"
IMAGE_TAG="${IMAGE_TAG:-latest}"

if [ -z "${GCP_PROJECT_ID}" ] || [ -z "${GCP_REGION}" ]; then
  echo "Error: GCP_PROJECT_ID and GCP_REGION environment variables must be defined."
  echo "Usage: GCP_PROJECT_ID=project GCP_REGION=region IMAGE_TAG=v1 ./build-wordpress-image.sh"
  exit 1
fi

DEST_IMAGE="${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/${ARTIFACT_REGISTRY_REPOSITORY}/${IMAGE_NAME}:${IMAGE_TAG}"

echo "Building WordPress production container..."
# Build context must be repository root to import apps/wordpress plugins
docker build -f infra/docker/wordpress/Dockerfile -t "${DEST_IMAGE}" .

echo "Configuring docker credentials helper..."
gcloud auth configure-docker "${GCP_REGION}-docker.pkg.dev" --quiet

echo "Pushing image to GCP Artifact Registry..."
docker push "${DEST_IMAGE}"

echo "WordPress image successfully pushed to: ${DEST_IMAGE}"
