<?php

/**
 * SlotsLaunch plugin
 *
 * @link              https://slotslaunch.com
 * @since             1.0.0
 * @package           Slotslaunch
 *
 * @wordpress-plugin
 * Plugin Name:       SlotsLaunch
 * Plugin URI:        https://slotslaunch.com
 * Description:       Free demo games for online casino affiliates.
 * Version:           1.4.1.6
 * Author:            Slots Launch
 * Author URI:        https://slotslaunch.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       slotslaunch
 * Domain Path:       /languages
 * Update URI:        https://slotslaunch.com
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'SLOTSLAUNCH_VERSION', '1.4.1.6' );
define( 'SLOTSL_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'SLOTSL_PARTIALS',  SLOTSL_PLUGIN_DIR . '/templates/partials/' );
define( 'SLOTSL_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'SLOTSL_PLUGIN_FILE', __FILE__ );
if ( ! defined( 'SLOTSL_ROOT_PLUGIN_FILE' ) ) {
	define( 'SLOTSL_ROOT_PLUGIN_FILE', SLOTSL_PLUGIN_FILE );
}
/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-slotslaunch-activator.php
 */
function activate_slotslaunch() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-slotslaunch-activator.php';
	Slotslaunch_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-slotslaunch-deactivator.php
 */
function deactivate_slotslaunch() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-slotslaunch-deactivator.php';
	Slotslaunch_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_slotslaunch' );
register_deactivation_hook( __FILE__, 'deactivate_slotslaunch' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-slotslaunch.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function slotslaunch() {

	return Slotslaunch::instance();

}
slotslaunch();
