#!/usr/bin/env bash

# ==================================================
# SLOTSTAR - WEBSUPPORT WORDPRESS AUTOMATED SETUP
# ==================================================

set -euo pipefail

SSH_HOST="shell.r1.websupport.sk"
SSH_PORT="25589"
SSH_USER="uid6447068"
SSH_PASS="a4b56fc344"
TARGET_DIR="sub/slotstars"

WP_URL="https://slotstars.kestudio.sk"
WP_TITLE="SlotStar Headless CMS"
WP_ADMIN_USER="admin"
WP_ADMIN_PASS="admin"
WP_ADMIN_EMAIL="admin@slotstar.fun"

echo "=================================================="
echo "1. PACKAGING CUSTOM PLUGINS"
echo "=================================================="

WORKSPACE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUILD_DIR="${WORKSPACE_ROOT}/build-dist"

mkdir -p "${BUILD_DIR}"
rm -rf "${BUILD_DIR}/*"

echo "Creating slotslaunch.zip..."
(cd "${WORKSPACE_ROOT}/apps/wordpress/wp-content/plugins" && zip -r -q "${BUILD_DIR}/slotslaunch.zip" slotslaunch)

echo "Creating slotstar-headless.zip..."
(cd "${WORKSPACE_ROOT}/apps/wordpress/wp-content/plugins" && zip -r -q "${BUILD_DIR}/slotstar-headless.zip" slotstar-headless)

echo "Plugins packaged successfully."

echo "=================================================="
echo "2. CONNECTING TO WEBSUPPORT SSH & SETTING UP WORDPRESS"
echo "=================================================="

# Use expect script for SSH execution if available or direct ssh
cat << 'EOF' > "${BUILD_DIR}/remote_setup.sh"
#!/usr/bin/env bash
set -e

echo "Locating web root..."
if [ -d "web/sub/slotstars" ]; then
  WEB_ROOT="web/sub/slotstars"
elif [ -d "sub/slotstars" ]; then
  WEB_ROOT="sub/slotstars"
elif [ -d "web" ]; then
  WEB_ROOT="web/sub/slotstars"
  mkdir -p "$WEB_ROOT"
else
  WEB_ROOT="sub/slotstars"
  mkdir -p "$WEB_ROOT"
fi

echo "Target web root: $WEB_ROOT"
cd "$WEB_ROOT"

if [ ! -f "wp-config.php" ]; then
  echo "Downloading WordPress..."
  curl -O https://wordpress.org/latest.tar.gz
  tar -xzf latest.tar.gz --strip-components=1
  rm -f latest.tar.gz
  echo "WordPress downloaded."
else
  echo "WordPress already exists in $WEB_ROOT."
fi

EOF

echo "Remote script created."
echo ""
echo "Script created at: ${WORKSPACE_ROOT}/setup-websupport-wp.sh"
echo "Build packages ready in: ${BUILD_DIR}"
