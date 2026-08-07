<?php

/**
 * Fired during plugin activation
 *
 * @link       https://slotslaunch.com
 * @since      1.0.0
 *
 * @package    Slotslaunch
 * @subpackage Slotslaunch/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    Slotslaunch
 * @subpackage Slotslaunch/includes
 * @author     Damian Logghe <newgames@slotslaunch.com>
 */
class Slotslaunch_Activator {

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    1.0.0
	 */
	public static function activate() {
		// if no settings trigger wizard
		$settings = slotsl_settings();
		if ( ! $settings ) {
			set_transient( 'slotsl_activator', true, 30 );
		}
		// Check PHP version
		$phpversion = phpversion();
		if (version_compare($phpversion, '7.4', '<')) {
			// Deactivate the plugin
			deactivate_plugins(basename(SLOTSL_PLUGIN_FILE));
			// Show an error message
			wp_die('Slots Launch plugin requires PHP version 7.4 or higher. Please update your PHP version to use this plugin.');
		}

	}

}
