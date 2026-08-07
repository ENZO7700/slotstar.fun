<?php
/**
 * Plugin Name: SlotStar Headless API
 * Plugin URI: https://slotstar.fun
 * Description: Headless REST API adapter for SlotStar connecting SlotsLaunch data with Next.js frontend.
 * Version: 1.0.0
 * Author: SlotStar Team
 * Text Domain: slotstar-headless
 */

namespace SlotStar\Headless;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Simple PSR-4 Autoloader for SlotStar\Headless
spl_autoload_register( function ( $class ) {
	$prefix   = 'SlotStar\\Headless\\';
	$base_dir = __DIR__ . '/src/';

	$len = strlen( $prefix );
	if ( 0 !== strncmp( $prefix, $class, $len ) ) {
		return;
	}

	$relative_class = substr( $class, $len );
	$file           = $base_dir . str_replace( '\\', '/', $relative_class ) . '.php';

	if ( file_exists( $file ) ) {
		require_once $file;
	}
} );

// Initialize plugin
add_action( 'plugins_loaded', function() {
	Plugin::get_instance();
} );

// Programmatically clean up/delete the experimental SlotsLaunch iframe test page
add_action( 'init', function() {
	$page_title = 'SlotsLaunch Test';
	$page = get_page_by_title( $page_title );
	if ( $page ) {
		wp_delete_post( $page->ID, true );
	}
} );

