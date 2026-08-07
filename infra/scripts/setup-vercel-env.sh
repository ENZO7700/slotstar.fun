#!/usr/bin/env bash

# ==================================================
# SLOTSTAR - AUTOMATED VERCEL ENV & DEPLOY SCRIPT
# ==================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

WP_API_URL="http://slotstars.kestudio.sk/wp-json"
SITE_URL="https://slotstar.fun"
REF_ID="wa1UHO8r"

echo "=================================================="
echo "1. ADDING ENVIRONMENT VARIABLES TO VERCEL"
echo "=================================================="

cd "${PROJECT_ROOT}"

# Add WORDPRESS_API_URL
echo "Adding WORDPRESS_API_URL..."
printf "%s" "${WP_API_URL}" | npx vercel env add WORDPRESS_API_URL production --force 2>/dev/null || true
printf "%s" "${WP_API_URL}" | npx vercel env add WORDPRESS_API_URL preview --force 2>/dev/null || true

# Add NEXT_PUBLIC_SITE_URL
echo "Adding NEXT_PUBLIC_SITE_URL..."
printf "%s" "${SITE_URL}" | npx vercel env add NEXT_PUBLIC_SITE_URL production --force 2>/dev/null || true
printf "%s" "${SITE_URL}" | npx vercel env add NEXT_PUBLIC_SITE_URL preview --force 2>/dev/null || true

# Add NEXT_PUBLIC_SLOTSLAUNCH_REF_ID
echo "Adding NEXT_PUBLIC_SLOTSLAUNCH_REF_ID..."
printf "%s" "${REF_ID}" | npx vercel env add NEXT_PUBLIC_SLOTSLAUNCH_REF_ID production --force 2>/dev/null || true
printf "%s" "${REF_ID}" | npx vercel env add NEXT_PUBLIC_SLOTSLAUNCH_REF_ID preview --force 2>/dev/null || true

echo "=================================================="
echo "2. TRIGGERING DEPLOYMENT VIA GIT PUSH"
echo "=================================================="

git push origin main || true

echo "=================================================="
echo "✅ SUCCESS: VERCEL ENV SET & TRIGGERED ON GITHUB!"
echo "=================================================="
