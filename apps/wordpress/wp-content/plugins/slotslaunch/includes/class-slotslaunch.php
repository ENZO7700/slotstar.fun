<?php

/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       https://slotslaunch.com
 * @since      1.0.0
 *
 * @package    Slotslaunch
 * @subpackage Slotslaunch/includes
 */

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      1.0.0
 * @package    Slotslaunch
 * @subpackage Slotslaunch/includes
 * @author     Damian Logghe <newgames@slotslaunch.com>
 */
class Slotslaunch {

	/**
	 * Plugin Instance
	 * @since 1.0.0
	 * @var The Slotslaunch plugin instance
	 */
	protected static $_instance = null;

	/**
	 * Main  Instance
	 *
	 * @return Slotslaunch - Main instance
	 * @see Slotslaunch()
	 * @since 1.0.0
	 * @static
	 */
	public static function instance() {
		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self();
		}

		return self::$_instance;
	}

	/**
	 * Cloning is forbidden.
	 * @since 1.0.0
	 */
	public function __clone() {
		_doing_it_wrong( __FUNCTION__, __( 'Cheatin&#8217; huh?', 'wsi' ), '2.1' );
	}

	/**
	 * Unserializing instances of this class is forbidden.
	 * @since 1.0.0
	 */
	public function __wakeup() {
		_doing_it_wrong( __FUNCTION__, __( 'Cheatin&#8217; huh?', 'wsi' ), '2.1' );
	}


	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {


		$this->load_dependencies();
		$this->set_locale();
		$this->define_global_hooks();
		if( is_admin() ) {
			$this->define_admin_hooks();
		}
		$this->define_public_hooks();

	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Include the following files that make up the plugin:
	 *
	 * - Slotslaunch_Loader. Orchestrates the hooks of the plugin.
	 * - Slotslaunch_i18n. Defines internationalization functionality.
	 * - Slotslaunch_Admin. Defines all hooks for the admin area.
	 * - Slotslaunch_Public. Defines all hooks for the public side of the site.
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function load_dependencies() {


		require_once plugin_dir_path( dirname( __FILE__ ) ) . '/vendor/woocommerce/action-scheduler/action-scheduler.php';
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/functions.php';
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-slotslaunch-client.php';
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-slotslaunch-cpt.php';
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-slotslaunch-license.php';
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-slotslaunch-i18n.php';
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-slotslaunch-slots.php';
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-slotslaunch-ajax.php';
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-slotslaunch-widget.php';

		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-slotslaunch-updates.php';
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-slotslaunch-settings.php';
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-slotslaunch-notices.php';

		if( is_admin() ) {
			require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-slotslaunch-admin.php';
			require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-slotslaunch-wizard.php';
		}

		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-slotslaunch-importer.php';
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'public/class-slotslaunch-public.php';



	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the Slotslaunch_i18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function set_locale() {

		$plugin_i18n = new Slotslaunch_i18n();

		add_action( 'plugins_loaded', [ $plugin_i18n, 'load_plugin_textdomain'] );

	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_global_hooks() {

		new SlotsLaunch_CPT();


	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_admin_hooks() {

		$plugin_admin = new Slotslaunch_Admin( );
		SlotsLaunch_Wizard::init();
		new SlotsLaunch_Notices();

	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_public_hooks() {

		$plugin_public = new Slotslaunch_Public(  );
		new Slotslaunch_Updates();

	}

}
