<?php

/**
 * Fired when the plugin is uninstalled.
 *
 * @link       https://slotslaunch.com
 * @since      1.0.0
 *
 * @package    Slotslaunch
 */

// If uninstall not called from WordPress, then exit.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}
require_once plugin_dir_path( __FILE__ ) . 'includes/functions.php';
$uninstall = slotsl_setting( 'uninstall' );

if ( isset( $uninstall ) && '1' == $uninstall ) {
	// delete settings
	delete_transient( 'slotsl_activator' );
	delete_option( 'slotsl_settings' );
	delete_option( 'slotsl_install' );
	delete_option( 'slotsl_version' );
	delete_option( 'sl_force_update' );
	// delete slots related
	slotsl_clear_slots();

}
