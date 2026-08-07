# ==================================================
# SLOTSTARS.FUN - PRODUCTION WORDPRESS CONTAINER
# ==================================================

# Pin a stable, secure, and maintained official WordPress image
FROM wordpress:6.6.1-php8.2-apache

# Production PHP configurations
COPY infra/docker/wordpress/php.ini $PHP_INI_DIR/conf.d/slotstars-php.ini

# Copy WordPress Custom Plugins
# Build context should be the repository root
COPY apps/wordpress/wp-content/plugins/slotslaunch /usr/src/wordpress/wp-content/plugins/slotslaunch
COPY apps/wordpress/wp-content/plugins/slotslaunch /var/www/html/wp-content/plugins/slotslaunch

COPY apps/wordpress/wp-content/plugins/slotstar-headless /usr/src/wordpress/wp-content/plugins/slotstar-headless
COPY apps/wordpress/wp-content/plugins/slotstar-headless /var/www/html/wp-content/plugins/slotstar-headless

# Ensure correct permissions for Apache
RUN chown -R www-data:www-data /usr/src/wordpress/wp-content/plugins/ && \
    chown -R www-data:www-data /var/www/html/wp-content/plugins/

# Port configurations (Standard Cloud Run ports will be mapped by environment)
EXPOSE 80
