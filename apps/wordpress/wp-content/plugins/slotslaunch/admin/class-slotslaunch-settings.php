<?php

/**
 * Settings class.
 */
class Slotslaunch_Settings {

	/**
	 * The current active tab.
	 *
	 * @since 2.0.0
	 * @var string
	 */
	public string $view;

	/**
	 * Primary class constructor.
	 *
	 * @since 2.0.0
	 */
	public function __construct() {
		add_action( 'admin_init', [ $this, 'init' ] );
	}

	/**
	 * Determine if the user is viewing the settings page, if so, party on.
	 *
	 * @since 2.0.0
	 */
	public function init() {

		// Check what page we are on.
		$page = isset( $_GET['page'] ) ? sanitize_key( $_GET['page'] ) : '';

		// Only load if we are actually on the settings page.
		if ( 'slotsl-settings' === $page ) {

			// Include API callbacks and functions.
			require_once SLOTSL_PLUGIN_DIR . 'admin/includes/settings-api.php';

			// Watch for triggered save.
			$this->save_settings();

			// Determine the current active settings tab.
			$this->view = isset( $_GET['view'] ) ? sanitize_key( $_GET['view'] ) : 'general';

			add_action( 'admin_enqueue_scripts', [ $this, 'enqueues' ] );
			add_action( 'slotsl_admin_page', [ $this, 'output' ] );

			// Hook for addons.
			do_action( 'slotsl_settings_init' );
		}
	}

	/**
	 * Sanitize and save settings.
	 *
	 * @since 2.0.0
	 */
	public function save_settings() {

		if ( ! isset( $_POST['slotsl-settings-submit'] ) ) {
			return;
		}

		if ( ! wp_verify_nonce( $_POST['nonce'], 'slotsl-settings-nonce' ) ) {
			return;
		}

		if ( ! slotsl_current_user_can() ) {
			return;
		}

		if ( empty( $_POST['view'] ) ) {
			return;
		}

		// Get registered fields and current settings.
		$fields   = $this->get_registered_settings( $_POST['view'] );
		$settings = get_option( 'slotsl_settings', [] );

		if ( empty( $fields ) || ! is_array( $fields ) ) {
			return;
		}

		// Sanitize and prep each field.
		foreach ( $fields as $id => $field ) {

			// Certain field types are not valid for saving and are skipped.
			$exclude = apply_filters( 'slotsl_settings_exclude_type', [
				'content',
				'license',
				'button',
				'premium-text',
			] );

			if ( empty( $field['type'] ) || in_array( $field['type'], $exclude, true ) ) {
				continue;
			}

			$value      = isset( $_POST[ $id ] ) ? $_POST[ $id ] : false;
			$value_prev = isset( $settings[ $id ] ) ? $settings[ $id ] : false;

			// Custom filter can be provided for sanitizing, otherwise use
			// defaults.
			if ( ! empty( $field['filter'] ) && function_exists( $field['filter'] ) ) {

				$value = call_user_func( $field['filter'], $value, $id, $field, $value_prev );

			} else {

				switch ( $field['type'] ) {
					case 'checkbox':
						$value = (bool) trim( $value );
						break;
					case 'image':
						$value = esc_url_raw( trim( $value ) );
						break;
					case 'color':
						$value = slotsl_sanitize_color( trim( $value ) );
						break;
					case 'text':
					case 'radio':
					case 'select':
						if( is_array( $value ) ) {
							$value = array_map( 'sanitize_text_field', $value );
						} else{
							$value = sanitize_text_field( trim( $value ) );
						}
						break;
					default:
						$value = apply_filters('slotsl_sanitize_field_' . $field['type'], $value, $id, $field, $value_prev );
						break;
				}
			}

			// refresh permalinks in case of slug change
			if( 'slots-slug' == $id && $settings[ $id ] != $value ) {
				flush_rewrite_rules();
			}

			// trigger update in case of providers change
			if( 'import_providers' == $id && $settings[ $id ] != $value ) {
				update_option('sl_force_update', true);
				SlotsLaunch_Importer::update_schedule();
				SlotsLaunch_Importer::$_in_progress_notices[] = __( 'Games are being update. We will let you know once it finish.', 'slotslaunch' );

			}
			// Add to settings.
			$settings[ $id ] = $value;

		}

		// Save settings.
		update_option( 'slotsl_settings', $settings );

		SlotsLaunch_Notices::success( esc_html__( 'Settings were successfully saved.', 'slotslaunch' ) );
	}

	/**
	 * Enqueue assets for the settings page.
	 *
	 * @since 2.0.0
	 */
	public function enqueues() {

		$es6 = defined( 'SLOTL_DEBUG' ) || isset( $_GET['SLOTL_DEBUG'] ) ? 'es6/' : '';

		/*wp_enqueue_script(
			'choicesjs',
			SLOTSL_PLUGIN_URL . 'assets/js/' . $es6 . 'choices.min.js',
			[],
			'2.8.10',
			false
		);*/

		do_action( 'slotsl_settings_enqueue' );
	}

	/**
	 * Return registered settings tabs.
	 *
	 * @return array
	 * @since 2.0.0
	 */
	public function get_tabs() {

		$tabs = [
			'general' => [
				'name'   => esc_html__( 'General', 'slotslaunch' ),
				'form'   => true,
				'submit' => esc_html__( 'Save Settings', 'slotslaunch' ),
			],
			'monetization' => [
				'name'   => esc_html__( 'Monetization', 'slotslaunch' ),
				'form'   => true,
				'submit' => esc_html__( 'Save Settings', 'slotslaunch' ),
			],
			'lobby' => [
				'name'   => esc_html__( 'Lobby', 'slotslaunch' ),
				'form'   => true,
				'submit' => esc_html__( 'Save Settings', 'slotslaunch' ),
			],
			'misc' => [
				'name'   => esc_html__( 'Misc', 'slotslaunch' ),
				'form'   => true,
				'submit' => esc_html__( 'Save Settings', 'slotslaunch' ),
			],
		];

		return apply_filters( 'slotsl_settings_tabs', $tabs );
	}

	/**
	 * Output tab navigation area.
	 *
	 * @since 2.0.0
	 */
	public function tabs() {

		$tabs = $this->get_tabs();

		echo '<ul class="slotsl-admin-tabs">';
		foreach ( $tabs as $id => $tab ) {

			$active = $id === $this->view ? 'active' : '';
			$name   = $tab['name'];
			$link   = add_query_arg( 'view', $id, admin_url( 'admin.php?page=slotsl-settings' ) );
			echo '<li><a href="' . esc_url_raw( $link ) . '" class="' . esc_attr( $active ) . '">' . esc_html( $name ) . '</a></li>';
		}
		echo '</ul>';
	}

	/**
	 * Return all the default registered settings fields.
	 *
	 * @param string $view
	 *
	 * @return array
	 * @since 2.0.0
	 *
	 */
	public function get_registered_settings( $view = '' ) {

		$defaults = [
			// General Settings tab.
			'general' => [
				'license-heading'   => [
					'id'       => 'license-heading',
					'content'  => '<h4>' . esc_html__( 'License', 'slotslaunch' ) . '</h4><p>' . esc_html__( 'Your license key provides access to updates and addons.', 'slotslaunch' ) . '</p>',
					'type'     => 'content',
					'no_label' => true,
					'class'    => [ 'section-heading' ],
				],
				'license-key'       => [
					'id'   => 'license-key',
					'name' => esc_html__( 'License Key', 'slotslaunch' ),
					'type' => 'license',
				],
				'slots-heading' => [
					'id'       => 'slots-heading',
					'content'  => '<h4>' . esc_html__( 'Slots Archives', 'slotslaunch' ) . '</h4>',
					'type'     => 'content',
					'no_label' => true,
					'class'    => [ 'section-heading', 'no-desc' ],
				],
				'slots-slug'  => [
					'id'            => 'slots-slug',
					'name'          => esc_html__( 'Url Slug', 'slotslaunch' ),
					'desc'          => esc_html__( 'Set the default base slug for single slots page', 'slotslaunch' ),
					'type'          => 'text',
					'default'       => 'slots',
				],

				'lobby-url'  => [
					'id'            => 'lobby-url',
					'name'          => esc_html__( 'Lobby url', 'slotslaunch' ),
					'desc'          => esc_html__( 'Set the url where you are using [slotsl-game-archives]. This is mandatory for breadcrumbs', 'slotslaunch' ),
					'type'          => 'text',
					'default'       => site_url('slots'),
				],

				'breadcrumbs'  => [
					'id'            => 'breadcrumbs',
					'name'          => esc_html__( 'Enable Breadcrumbs', 'slotslaunch' ),
					'desc'          => esc_html__( 'Set yes to load breacrumbs on the game pages. Lobby url must be set.', 'slotslaunch' ),
					'type'          => 'select',
					'default'       => '',
					'options'       => ['0' => 'No', '1' => 'Yes']
				],
				'single-slots'  => [
					'id'            => 'single-slots',
					'name'          => esc_html__( 'Standalone Slots Page', 'slotslaunch' ),
					'desc'          => esc_html__( 'Set yes to load single slots page on your main [slotsl-game-archives] page via AJAX.', 'slotslaunch' ),
					'type'          => 'select',
					'default'       => '',
					'options'       => ['0' => 'No', '1' => 'Yes']
				],

				'single-popup'  => [
					'id'            => 'single-popup',
					'name'          => esc_html__( 'Single Slot Popup', 'slotslaunch' ),
					'desc'          => esc_html__( 'Set yes to show a popup instead of loading the game in the same page. Only works if Standalone Slots Page is enabled.', 'slotslaunch' ),
					'type'          => 'select',
					'default'       => '0',
					'options'       => ['0' => 'No', '1' => 'Yes'],
					'premium_field' => (slotsl_setting('type') == 'free'),
				],
				'demo-btn'  => [
					'id'            => 'demo-btn',
					'name'          => esc_html__( 'Button Text', 'slotslaunch' ),
					'desc'          => esc_html__( 'Optional: Customize demo button text', 'slotslaunch' ),
					'type'          => 'text',
					'default'       => 'Try Demo',
					'premium_field' => (slotsl_setting('type') == 'free'),
				],
				'providers'  => [
					'id'            => 'providers',
					'name'          => esc_html__( 'Hide Games', 'slotslaunch' ),
					'desc'          => esc_html__( 'If you want to hide games from some providers, select them here.', 'slotslaunch' ),
					'type'          => 'select',
					'choicesjs'     => true,
					'options'       =>  self::providers(),
					'premium_field' => (slotsl_setting('type') == 'free'),
				],

				'slots-single-heading' => [
					'id'       => 'slots-single-heading',
					'content'  => '<h4>' . esc_html__( 'Slots Single Plage', 'slotslaunch' ) . '</h4>',
					'type'     => 'content',
					'no_label' => true,
					'class'    => [ 'section-heading', 'no-desc' ],
				],

				'launch-game'  => [
					'id'            => 'launch-game',
					'name'          => esc_html__( 'Launch Screen Settings', 'slotslaunch' ),
					'desc'          => esc_html__( 'Optional: Customize the launch screen with your own logo and phrasing for the launch button. Shortcodes available [slot-name] [slot-image]', 'slotslaunch' ),
					'type'          => 'textarea',
					'default'       => slotsl_default_single_slot_text(),
					'premium_field' => (slotsl_setting('type') == 'free'),
				],

				'play-for-free-text'  => [
					'id'            => 'play-for-free-text',
					'name'          => esc_html__( 'Play for Free', 'slotslaunch' ),
					'desc'          => esc_html__( 'Button text', 'slotslaunch' ),
					'type'          => 'text',
					'default'       => esc_html__( 'Play for Free', 'slotslaunch' ),
				],
				'color'  => [
					'id'            => 'color',
					'name'          => esc_html__( 'Game Frame Color', 'slotslaunch' ),
					'desc'          => esc_html__( 'Optional: Customize theme color.', 'slotslaunch' ),
					'type'          => 'color',
					'default'       => '#e23940',
					'premium_field' => (slotsl_setting('type') == 'free'),
				],

				'display-info'  => [
					'id'            => 'display-info',
					'name'          => esc_html__( 'Display Game Information', 'slotslaunch' ),
					'desc'          => esc_html__( 'Set No to hide the game information on the game page', 'slotslaunch' ),
					'type'          => 'select',
					'default'       => '1',
					'options'       => ['0' => 'No', '1' => 'Yes'],
					'premium_field' => (slotsl_setting('type') == 'free'),
				],				
				'display-info-position'  => [
					'id'            => 'display-info-position',
					'name'          => esc_html__( 'Display Game Information Position', 'slotslaunch' ),
					'desc'          => esc_html__( 'Set the position of the game information on the game page', 'slotslaunch' ),
					'type'          => 'select',
					'default'       => 'top',
					'options'       => ['top' => 'Top', 'bottom' => 'Bottom'],
				],
				'display-ratings'  => [
					'id'            => 'display-ratings',
					'name'          => esc_html__( 'Display Ratings', 'slotslaunch' ),
					'desc'          => esc_html__( 'Set No to hide the ratings and rating json schema on the game page', 'slotslaunch' ),
					'type'          => 'select',
					'default'       => '1',
					'options'       => ['0' => 'No', '1' => 'Yes'],
					'premium_field' => (slotsl_setting('type') == 'free'),
				],
				'display-broken'  => [
					'id'            => 'display-broken',
					'name'          => esc_html__( 'Display Broken Game Form', 'slotslaunch' ),
					'desc'          => esc_html__( 'Set No to hide the broken game form on the game page', 'slotslaunch' ),
					'type'          => 'select',
					'default'       => '1',
					'options'       => ['0' => 'No', '1' => 'Yes'],
					'premium_field' => (slotsl_setting('type') == 'free'),
				],
				'featured-widget'  => [
					'id'            => 'featured-widget',
					'name'          => esc_html__( 'Featured Games Widget', 'slotslaunch' ),
					'desc'          => esc_html__( 'Set yes to show the featured games widget', 'slotslaunch' ),
					'type'          => 'select',
					'default'       => '1',
					'options'       => ['0' => 'No', '1' => 'Yes'],
					'premium_field' => (slotsl_setting('type') == 'free'),
				],

				'featured-widget-ids'  => [
					'id'            => 'featured-widget-ids',
					'name'          => esc_html__( 'Featured Games', 'slotslaunch' ),
					'desc'          => esc_html__( 'Enter up to three IDs that will show as featured games', 'slotslaunch' ),
					'type'          => 'text',
					'default'       => '',
					'premium_field' => (slotsl_setting('type') == 'free'),
				],
			],
			'monetization' => [
				'play-for-real'  => [
					'id'            => 'play-for-real',
					'name'          => esc_html__( 'Play for Real URL', 'slotslaunch' ),
					'desc'          => esc_html__( 'Add your affiliate link to show at launch screen. If empty only "Play for free" button will show.', 'slotslaunch' ),
					'type'          => 'text',
					'default'       => '',
				],
				'play-for-real-text'  => [
					'id'            => 'play-for-real-text',
					'name'          => esc_html__( 'Play for Real', 'slotslaunch' ),
					'desc'          => esc_html__( 'Button text', 'slotslaunch' ),
					'type'          => 'text',
					'default'       => esc_html__( 'Play for Real', 'slotslaunch' ),
				],
				'popup-heading' => [
					'id'       => 'popup-heading',
					'content'  => '<h4>' . esc_html__( 'Popup', 'slotslaunch' ) . '</h4>',
					'type'     => 'content',
					'no_label' => true,
					'class'    => [ 'section-heading', 'no-desc' ],
				],

				'enable-popup'  => [
					'id'            => 'enable-popup',
					'name'          => esc_html__( 'Enable game frame Popup?', 'slotslaunch' ),
					'desc'          => esc_html__( 'Set yes to show a popup in the game frame with your play for real link', 'slotslaunch' ),
					'type'          => 'select',
					'default'       => '0',
					'options'       => ['0' => 'No', '1' => 'Yes'],
					'premium_field' => (slotsl_setting('type') == 'free'),
				],
				'popup-content'  => [
					'id'            => 'popup-content',
					'name'          => esc_html__( 'Popup content', 'slotslaunch' ),
					'desc'          => esc_html__( 'Optional: Customize the popup with your own phrasing. Shortcodes available [slot-name]', 'slotslaunch' ),
					'type'          => 'textarea',
					'default'       => slotsl_default_single_popup_text(),
					'premium_field' => (slotsl_setting('type') == 'free'),
				],
				'popup-seconds'  => [
					'id'            => 'popup-seconds',
					'name'          => esc_html__( 'Seconds to trigger popup?', 'slotslaunch' ),
					'desc'          => esc_html__( 'By default the popup will show after 30 seconds once the user clicks on "play button"', 'slotslaunch' ),
					'type'          => 'number',
					'default'       => 30,
					'premium_field' => (slotsl_setting('type') == 'free'),
				],
				'scroll-heading' => [
					'id'       => 'scroll-heading',
					'content'  => '<h4>' . esc_html__( 'Scrolling banner', 'slotslaunch' ) . '</h4>',
					'type'     => 'content',
					'no_label' => true,
					'class'    => [ 'section-heading', 'no-desc' ],
				],
				'enable-scrolling-banner'  => [
					'id'            => 'enable-scrolling-banner',
					'name'          => esc_html__( 'Enable game frame scrolling banner?', 'slotslaunch' ),
					'desc'          => esc_html__( 'Set yes to show a scrolling text banner on single slot pages', 'slotslaunch' ),
					'type'          => 'select',
					'default'       => '0',
					'options'       => ['0' => 'No', '1' => 'Yes'],
					'premium_field' => (slotsl_setting('type') == 'free'),
				],
				'scrolling-banner-content'  => [
					'id'            => 'scrolling-banner-content',
					'name'          => esc_html__( 'Scrolling banner content', 'slotslaunch' ),
					'desc'          => esc_html__( 'Optional: Customize the popup with your own phrasing. Shortcodes available [slot-name] and [play-for-real-url]', 'slotslaunch' ),
					'type'          => 'textarea',
					'default'       => slotsl_default_banner_text(),
					'premium_field' => (slotsl_setting('type') == 'free'),
				],
				'banner-heading' => [
					'id'       => 'banner-heading',
					'content'  => '<h4>' . esc_html__( 'Slot Archives Banner', 'slotslaunch' ) . '</h4>',
					'type'     => 'content',
					'no_label' => true,
					'class'    => [ 'section-heading', 'no-desc' ],
				],
				'enable-banner'  => [
					'id'            => 'enable-banner',
					'name'          => esc_html__( 'Enable Banner?', 'slotslaunch' ),
					'desc'          => esc_html__( 'This will enable it globally. It can be disable with shortcode attrs if needed', 'slotslaunch' ),
					'type'          => 'select',
					'default'       => '0',
					'options'       => ['0' => 'No', '1' => 'Yes'],
					'premium_field' => (slotsl_setting('type') == 'free'),
				],
				'banner-text'  => [
					'id'            => 'banner-text',
					'name'          => esc_html__( 'Banner text', 'slotslaunch' ),
					'desc'          => esc_html__( 'CTA banner will show every X games in your archives pages', 'slotslaunch' ),
					'type'          => 'text',
					'default'       => esc_html__( 'Play slots for Real Money', 'slotslaunch' ),
					'premium_field' => (slotsl_setting('type') == 'free'),
				],

				'banner-number'  => [
					'id'            => 'banner-number',
					'name'          => esc_html__( 'Every x games', 'slotslaunch' ),
					'desc'          => esc_html__( 'The banner will show after the number of games of your choice', 'slotslaunch' ),
					'type'          => 'number',
					'default'       => '20',
					'premium_field' => (slotsl_setting('type') == 'free'),
				],
			] ,
			// Lobby settings tab.
			'lobby'    => [
				'lobby-heading' => [
					'id'       => 'lobby-heading',
					'content'  => '<h4>' . esc_html__( 'Lobby Sections', 'slotslaunch' ) . '</h4><p>' . esc_html__( 'Configure which sections to display in the Netflix-style lobby and their order.', 'slotslaunch' ) . '</p>',
					'type'     => 'content',
					'no_label' => true,
					'class'    => [ 'section-heading' ],
				],
				'lobby-sections-order' => [
					'id'      => 'lobby-sections-order',
					'name'    => esc_html__( 'Sections Order', 'slotslaunch' ),
					'desc'    => esc_html__( 'Drag and drop to reorder sections. Sections can be enabled/disabled below.', 'slotslaunch' ),
					'type'    => 'sortable',
					'default' => 'editors-pick,seasonal,newest,most-played,top-rated,trending,licensed,gold-medal,upcoming-games',
				],
				'lobby-section-editors-pick' => [
					'id'      => 'lobby-section-editors-pick',
					'name'    => esc_html__( 'Editor\'s Pick Section', 'slotslaunch' ),
					'desc'    => esc_html__( 'Enable Editor\'s Pick section (shows featured games + manually selected games)', 'slotslaunch' ),
					'type'    => 'select',
					'default' => '1',
					'options' => ['0' => 'Disabled', '1' => 'Enabled'],
				],
				'lobby-editors-pick-ids' => [
					'id'      => 'lobby-editors-pick-ids',
					'name'    => esc_html__( 'Editor\'s Pick Game IDs', 'slotslaunch' ),
					'desc'    => esc_html__( 'Enter comma-separated game post IDs to include in Editor\'s Pick (in addition to featured games)', 'slotslaunch' ),
					'type'    => 'text',
					'default' => '',
				],
				'lobby-section-seasonal' => [
					'id'      => 'lobby-section-seasonal',
					'name'    => esc_html__( 'Seasonal Section', 'slotslaunch' ),
					'desc'    => esc_html__( 'Enable Seasonal section', 'slotslaunch' ),
					'type'    => 'select',
					'default' => '1',
					'options' => ['0' => 'Disabled', '1' => 'Enabled'],
				],
				'lobby-seasonal-theme' => [
					'id'      => 'lobby-seasonal-theme',
					'name'    => esc_html__( 'Seasonal Theme', 'slotslaunch' ),
					'desc'    => esc_html__( 'Select the theme slug for seasonal section (e.g., "christmas")', 'slotslaunch' ),
					'type'    => 'text',
					'default' => 'christmas',
				],
				'lobby-section-newest' => [
					'id'      => 'lobby-section-newest',
					'name'    => esc_html__( 'Newest Games Section', 'slotslaunch' ),
					'desc'    => esc_html__( 'Enable Newest Games section', 'slotslaunch' ),
					'type'    => 'select',
					'default' => '1',
					'options' => ['0' => 'Disabled', '1' => 'Enabled'],
				],
				'lobby-section-most-played' => [
					'id'      => 'lobby-section-most-played',
					'name'    => esc_html__( 'Most Played Section', 'slotslaunch' ),
					'desc'    => esc_html__( 'Enable Most Played section', 'slotslaunch' ),
					'type'    => 'select',
					'default' => '1',
					'options' => ['0' => 'Disabled', '1' => 'Enabled'],
				],
				'lobby-section-top-rated' => [
					'id'      => 'lobby-section-top-rated',
					'name'    => esc_html__( 'Top Rated Section', 'slotslaunch' ),
					'desc'    => esc_html__( 'Enable Top Rated section', 'slotslaunch' ),
					'type'    => 'select',
					'default' => '1',
					'options' => ['0' => 'Disabled', '1' => 'Enabled'],
				],
				'lobby-section-trending' => [
					'id'      => 'lobby-section-trending',
					'name'    => esc_html__( 'Trending Games Section', 'slotslaunch' ),
					'desc'    => esc_html__( 'Enable Trending Games section', 'slotslaunch' ),
					'type'    => 'select',
					'default' => '1',
					'options' => ['0' => 'Disabled', '1' => 'Enabled'],
				],
				'lobby-section-licensed' => [
					'id'      => 'lobby-section-licensed',
					'name'    => esc_html__( 'Licensed Games Section', 'slotslaunch' ),
					'desc'    => esc_html__( 'Enable Licensed Games section (games with "licensed" theme)', 'slotslaunch' ),
					'type'    => 'select',
					'default' => '1',
					'options' => ['0' => 'Disabled', '1' => 'Enabled'],
				],
				'lobby-section-gold-medal' => [
					'id'      => 'lobby-section-gold-medal',
					'name'    => esc_html__( 'Gold Medal Games Section', 'slotslaunch' ),
					'desc'    => esc_html__( 'Enable Gold Medal Games section', 'slotslaunch' ),
					'type'    => 'select',
					'default' => '1',
					'options' => ['0' => 'Disabled', '1' => 'Enabled'],
				],
				'lobby-section-upcoming-games' => [
					'id'      => 'lobby-section-upcoming-games',
					'name'    => esc_html__( 'Upcoming Games Section', 'slotslaunch' ),
					'desc'    => esc_html__( 'Enable Upcoming Games section (games with future release date)', 'slotslaunch' ),
					'type'    => 'select',
					'default' => '1',
					'options' => ['0' => 'Disabled', '1' => 'Enabled'],
				],
			],
			// Misc. settings tab.
			'misc'    => [
				'misc-heading' => [
					'id'       => 'misc-heading',
					'content'  => '<h4>' . esc_html__( 'Misc', 'slotslaunch' ) . '</h4>',
					'type'     => 'content',
					'no_label' => true,
					'class'    => [ 'section-heading', 'no-desc' ],
				],

				'uninstall'    => [
					'id'      => 'uninstall',
					'name'    => esc_html__( 'Delete all data on Uninstall', 'slotslaunch' ),
					'desc'    => esc_html__( 'When you uninstall the plugin all slots, settings, etc will be deleted from your db', 'slotslaunch' ),
					'type'    => 'checkbox',
					'default' => '',
				],
				'reinstall'    => [
					'id'      => 'reinstall',
					'name'    => esc_html__( 'Reinstall all Slots', 'slotslaunch' ),
					'desc'    => esc_html__( 'WARNING: This will delete all your slots posts and reinstall everything from scratch.', 'slotslaunch' ),
					'type'    => 'button',
					'action'  => 'reinstall_all_slots',
					'button_text'    => esc_html__( 'Reinstall', 'slotslaunch' ),
					'default' => '',
				],
				'import_providers'    => [
					'id'      => 'import_providers',
					'name'    => esc_html__( 'Import games from provider', 'slotslaunch' ),
					'desc'    => esc_html__( 'Import games from selected provider in case you installed just some of them', 'slotslaunch' ),
					'type'    => 'select',
					'choicesjs'     => true,
					'options'       =>  slotsl_providers(),
					'premium_field' => (slotsl_setting('type') == 'free'),
				],
				'debug' => [
					'id'      => 'debug',
					'name'    => esc_html__( 'Debug', 'slotslaunch' ),
					'desc'    => esc_html__( 'This will show latest errors produced by the importer', 'slotslaunch' ),
					'type'    => 'debug',
					'default' => '',
				],
			],
		];
		
		/**
		 * Allow developers to add custom lobby section settings
		 * 
		 * @param array $lobby_settings Array of lobby settings fields
		 * @return array Modified settings array
		 * 
		 * @example
		 * add_filter( 'slotsl_lobby_settings', function( $settings ) {
		 *     $settings['lobby-section-my-custom'] = [
		 *         'id'      => 'lobby-section-my-custom',
		 *         'name'    => esc_html__( 'My Custom Section', 'textdomain' ),
		 *         'desc'    => esc_html__( 'Enable My Custom section', 'textdomain' ),
		 *         'type'    => 'select',
		 *         'default' => '1',
		 *         'options' => ['0' => 'Disabled', '1' => 'Enabled'],
		 *     ];
		 *     return $settings;
		 * } );
		 */
		if ( isset( $defaults['lobby'] ) ) {
			$defaults['lobby'] = apply_filters( 'slotsl_lobby_settings', $defaults['lobby'] );
		}
		
		$defaults = apply_filters( 'slotsl_settings_defaults', $defaults );

		return empty( $view ) ? $defaults : $defaults[ $view ];
	}

	/**
	 * REturn all providers for dropdown in settings
	 * @return array
	 */
	public static function providers() {

		$q_args = [
			'taxonomy' => 'sl-provider',
			'hide_empty' => false,
		];

		$terms = get_terms( $q_args );

		$old = $terms;
		$terms = [];
		foreach ($old as $term) {
			$terms[$term->term_id] = $term->name;
		}

		return $terms;
	}
	/**
	 * Return array containing markup for all the appropriate settings fields.
	 *
	 * @param string $view
	 *
	 * @return array
	 * @since 2.0.0
	 *
	 */
	public function get_settings_fields( $view = '' ) {

		$fields   = [];
		$settings = $this->get_registered_settings( $view );

		foreach ( $settings as $id => $args ) {

			$fields[ $id ] = slotsl_settings_output_field( $args );
		}

		return apply_filters( 'slotsl_settings_fields', $fields, $view );
	}

	/**
	 * Build the output for the plugin settings page.
	 *
	 * @since 2.0.0
	 */
	public function output() {

		$tabs   = $this->get_tabs();
		$fields = $this->get_settings_fields( $this->view );
		?>
		<div id="slotsl-header-temp"></div>
		<div id="slotsl-header" class="slotsl-header">
			<img class="slotsl-header-logo" src="<?php echo SLOTSL_PLUGIN_URL; ?>admin/img/rocket-logo.webp"
			     alt="Slots Launch" width="320" />
		</div>
		<div id="slotsl-settings" class="wrap slotsl-admin-wrap slotsl-admin-page">

			<?php $this->tabs(); ?>

			<h1 class="slotsl-h1-placeholder"></h1>


			<div class="slotsl-admin-content slotsl-admin-settings">

				<?php
				// Some tabs rely on AJAX and do not contain a form, such as Integrations.
				if ( ! empty( $tabs[ $this->view ]['form'] ) ) :
				?>
				<form class="slotsl-admin-settings-form" method="post">
					<input type="hidden" name="action" value="update-settings">
					<input type="hidden" name="view" value="<?php echo esc_attr( $this->view ); ?>">
					<input type="hidden" name="nonce"
					       value="<?php echo wp_create_nonce( 'slotsl-settings-nonce' ); ?>">
					<?php endif; ?>

					<?php do_action( 'slotsl_admin_settings_before', $this->view, $fields ); ?>

					<?php
					foreach ( $fields as $field ) {
						echo $field;
					}
					?>

					<?php if ( ! empty( $tabs[ $this->view ]['submit'] ) ) : ?>
						<p class="submit">
							<button type="submit" class="slotsl-btn slotsl-btn-md slotsl-btn-blue"
							        name="slotsl-settings-submit"><?php echo $tabs[ $this->view ]['submit']; ?></button>
						</p>
					<?php endif; ?>

					<?php do_action( 'slotsl_admin_settings_after', $this->view, $fields ); ?>

					<?php if ( ! empty( $tabs[ $this->view ]['form'] ) ) : ?>
				</form>
			<?php endif; ?>

			</div>

		</div>

		<?php
	}

}

new Slotslaunch_Settings();
