<?php

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       https://slotslaunch.com
 * @since      1.0.0
 *
 * @package    Slotslaunch
 * @subpackage Slotslaunch/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.0
 * @package    Slotslaunch
 * @subpackage Slotslaunch/includes
 * @author     Damian Logghe <newgames@slotslaunch.com>
 */
class Slotslaunch_i18n {


	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {

		load_plugin_textdomain(
			'slotslaunch',
			false,
			dirname( plugin_basename( __FILE__ ), 2 ) . '/languages/'
		);

	}



}
