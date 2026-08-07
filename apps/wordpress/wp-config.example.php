<?php
/**
 * The base configuration for WordPress
 *
 * Safe template for SlotStar WordPress configuration.
 */

// ** Database settings - loaded from environment variables or defaults ** //
define( 'DB_NAME',     getenv('WORDPRESS_DB_NAME') ?: 'wordpress' );
define( 'DB_USER',     getenv('WORDPRESS_DB_USER') ?: 'root' );
define( 'DB_PASSWORD', getenv('WORDPRESS_DB_PASSWORD') ?: '' );
define( 'DB_HOST',     getenv('WORDPRESS_DB_HOST') ?: 'db' );
define( 'DB_CHARSET',  'utf8mb4' );
define( 'DB_COLLATE',  '' );

/**#@+
 * Authentication unique keys and salts.
 * Replace these placeholders with unique phrases or load from environment.
 */
define( 'AUTH_KEY',          getenv('WP_AUTH_KEY') ?: 'put your unique phrase here' );
define( 'SECURE_AUTH_KEY',   getenv('WP_SECURE_AUTH_KEY') ?: 'put your unique phrase here' );
define( 'LOGGED_IN_KEY',     getenv('WP_LOGGED_IN_KEY') ?: 'put your unique phrase here' );
define( 'NONCE_KEY',         getenv('WP_NONCE_KEY') ?: 'put your unique phrase here' );
define( 'AUTH_SALT',         getenv('WP_AUTH_SALT') ?: 'put your unique phrase here' );
define( 'SECURE_AUTH_SALT',  getenv('WP_SECURE_AUTH_SALT') ?: 'put your unique phrase here' );
define( 'LOGGED_IN_SALT',    getenv('WP_LOGGED_IN_SALT') ?: 'put your unique phrase here' );
define( 'NONCE_SALT',        getenv('WP_NONCE_SALT') ?: 'put your unique phrase here' );

$table_prefix = 'wp_';

if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

require_once ABSPATH . 'wp-settings.php';
