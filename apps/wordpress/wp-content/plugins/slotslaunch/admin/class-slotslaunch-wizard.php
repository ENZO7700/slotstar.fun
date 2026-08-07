<?php


/**
 * Class SlotsLaunch_Wizard
 * Pretty much the same as Woocommerce wizard
 * @package slotslCore\Setting
 */
class SlotsLaunch_Wizard {

	/**
	 * Plugin Instance
	 * @since 1.0.0
	 * @var The Fbl plugin instance
	 */
	protected static $_instance = null;

	/**
	 * Current view inside settings
	 * @var string
	 */
	private $view;
	/**
	 * @var string
	 */
	private $plugin_url;
	/**
	 * @var mixed|void
	 */
	private $steps;
	/**
	 * @var mixed|void
	 */
	private $step;



	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {
		add_action( 'init', [ $this, 'setup' ] );
		add_action( 'slotsl/wizard/steps', [ $this, 'add_steps' ], 10, 1 );
	}

	/**
	 * Main plugin_name Instance
	 *
	 * Ensures only one instance of WSI is loaded or can be loaded.
	 *
	 * @return plugin_name - Main instance
	 * @see slotslr()
	 * @since 1.0.0
	 * @static
	 */
	public static function init() {

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
	 * Wizard setup func
	 */
	public function setup() {

		if ( apply_filters( 'slotsl/wizard/enable', true ) && current_user_can( 'manage_options' ) ) {
			add_action( 'admin_init', [ $this, 'redirect_wizard' ], 1 );
			add_action( 'admin_menu', [ $this, 'admin_menus' ] );

			if ( isset( $_GET['page'] ) && $_GET['page'] == 'slotsl-setup' ) {

				add_action( 'admin_init', [ $this, 'wizard' ] );
				add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
			}
		}

		$this->plugin_url = plugin_dir_url( SLOTSL_ROOT_PLUGIN_FILE ) . 'admin/';
	}

	/**
	 * Lets add steps to wizard
	 * @param ARRAY $steps
	 */
	function add_steps( $steps ) {

		$steps['import'] = [
			'name'    => __( 'Import Games', 'slotslaunch' ),
			'view'    => [ $this, 'setup_wizard_import_games' ],
			'handler' => [ $this, 'setup_wizard_import_save' ],
		];

		return $steps;
	}

	/**
	 * Wizard Addons
	 */
	public function setup_wizard_import_games() {
		require_once SLOTSL_PLUGIN_DIR . 'admin/wizard/setup-wizard-import.php';
	}

	/**
	 * Wizard Addons save
	 */
	public function setup_wizard_import_save() {


	}


	/**
	 * Redirect to Wizard
	 */
	public function redirect_wizard() {

		if ( ! get_transient( 'slotsl_activator' ) ) {
			return;
		}

		// Bail if activating from network, or bulk
		if ( is_network_admin() || isset( $_GET['activate-multi'] ) ) {
			return;
		}

		if ( get_transient( 'slotsl_activator' ) ) {

			// Delete the redirect transient
			delete_transient( 'slotsl_activator' );

			// Redirect to panel welcome
			wp_redirect(
				add_query_arg(
					[ 'page' => 'slotsl-setup' ],
					admin_url( 'admin.php' )
				)
			);

		}
		exit;
	}
	/**
	 * Add admin menus/screens.
	 */
	public function admin_menus() {
		add_dashboard_page( '', '', 'manage_options', 'slotsl-setup', '' );
	}


	/**
	 * Show the setup wizard.
	 */
	public function wizard() {

		$default_steps = [
			'basic' => [
				'name'    => __( 'Basic', 'slotsl' ),
				'view'    => [ $this, 'setup_wizard_basic' ],
				'handler' => [ $this, 'setup_wizard_basic_save' ],
			],
		];

		$this->steps = apply_filters( 'slotsl/wizard/steps', $default_steps );
		$this->step  = isset( $_GET['step'] ) ? sanitize_key( $_GET['step'] ) : current( array_keys( $this->steps ) );

		if ( ! empty( $_POST['save_step'] ) && isset( $this->steps[ $this->step ]['handler'] ) ) {
			call_user_func( $this->steps[ $this->step ]['handler'], $this );

			wp_redirect( esc_url_raw( $this->get_next_step_link() ) );
			exit();
		}

		// @codingStandardsIgnoreEnd
		ob_start();
		set_current_screen();
		$this->setup_wizard_header();
		$this->setup_wizard_steps();
		$this->setup_wizard_content();
		$this->setup_wizard_footer();
		exit;
	}

	/**
	 * Get the URL for the next step's screen.
	 *
	 * @param string $step slug (default: current step).
	 *
	 * @return string       URL for next step if a next step exists.
	 *                      Admin URL if it's the last step.
	 *                      Empty string on failure.
	 * @since 1.0.0
	 */
	public function get_next_step_link( $step = '' ) {

		if ( ! $step ) {
			$step = $this->step;
		}

		$keys = array_keys( $this->steps );
		if ( end( $keys ) === $step ) {
			return admin_url( 'admin.php?page=slotsl-settings&view=general' );
		}

		$step_index = array_search( $step, $keys, true );
		if ( false === $step_index ) {
			return '';
		}

		return add_query_arg( 'step', $keys[ $step_index + 1 ], remove_query_arg( 'activate_error' ) );
	}

	/**
	 * Setup Wizard Header.
	 */
	public function setup_wizard_header() {
		require_once dirname( __FILE__ ) . '/wizard/setup-wizard-header.php';
	}

	/**
	 * Output the steps.
	 */
	public function setup_wizard_steps() {
		$step_all     = $this->steps;
		$step_current = $this->step;

		require_once dirname( __FILE__ ) . '/wizard/setup-wizard-steps.php';
	}

	/**
	 * Output the content for the current step.
	 */
	public function setup_wizard_content() {
		if ( ! empty( $this->steps[ $this->step ]['view'] ) ) {
			call_user_func( $this->steps[ $this->step ]['view'], $this );
		}
	}

	/**
	 * Setup Wizard Footer.
	 */
	public function setup_wizard_footer() {
		require_once dirname( __FILE__ ) . '/wizard/setup-wizard-footer.php';
	}

	/**
	 * @return void
	 */
	public function setup_wizard_basic() {

		$opts     = slotsl_settings();
		$defaults = [
			'license'          => '',
		];
		$opts     = wp_parse_args( $opts, apply_filters( 'slotsl/default_settings', $defaults ) );


		require_once dirname( __FILE__ ) . '/wizard/setup-wizard-basic.php';
	}

	/**
	 * @return void
	 */
	public function setup_wizard_basic_save() {
		check_admin_referer( 'slotsl-setup' );

		$settings = array_map( 'esc_html', $_POST['slotsl_settings'] );
		$settings = array_map( 'trim', $settings );

		// update license field
		if ( ! empty( $settings['license'] ) ) {
			$license = esc_attr( $settings['license'] );
			SlotsLaunch_License::is_valid_license( $license );
		}

		// old settings
		$old_settings = slotsl_settings();

		// checkboxes dirty hack
		$inputs = [
			'license',
		];

		foreach ( $inputs as $input ) {
			if ( empty( $settings[ $input ] ) ) {
				$settings[ $input ] = '';
			}
		}

		if ( is_array( $old_settings ) ) {
			$settings = array_merge( $old_settings, $settings );
		}

		update_option( 'slotsl_settings', $settings );
	}

	/**
	 * Register/enqueue scripts and styles for the Setup Wizard.
	 * Hooked onto 'admin_enqueue_scripts'.
	 */
	public function enqueue_scripts() {
		wp_enqueue_style( 'slotsl-choices', $this->plugin_url  . 'css/choices.min.css', [], SLOTSLAUNCH_VERSION );
		wp_enqueue_style( 'buttons' );
		wp_enqueue_style( 'slotsl-setup', $this->plugin_url . 'wizard/assets/wizard.css', [ 'buttons' ], SLOTSLAUNCH_VERSION, 'all' );
	}
}