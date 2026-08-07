<?php

class Slotslaunch_Updates {

	private $name = '';
	private $slug = '';
	private $version = '';
	private $wp_override = false;
	private $cache_key = '';

	/**
	 * Class constructor.
	 *
	 *
	 * @uses plugin_basename()
	 * @uses hook()
	 *
	 */
	public function __construct() {

		$this->name        = plugin_basename( SLOTSL_ROOT_PLUGIN_FILE );
		$this->slug        = basename( SLOTSL_ROOT_PLUGIN_FILE, '.php' );
		$this->version     = SLOTSLAUNCH_VERSION;
		$this->cache_key   = 'slotsl_' . md5( serialize( $this->slug ) );

		// Set up hooks.
		$this->init();

		add_action('init', [ $this, 'check_updates'] );
	}

	/**
	 * Set up WordPress filters to hook into WP's update process.
	 *
	 * @return void
	 * @uses add_filter()
	 *
	 */
	public function init() {

		add_filter( 'pre_set_site_transient_update_plugins', [ $this, 'check_update' ] );
		add_filter( 'plugins_api', [ $this, 'plugins_api_filter' ], 10, 3 );
		add_action( 'sl_update_1_0_0_6', [ $this, 'sl_update_1_0_0_6_callback'] );
		add_action( 'sl_update_1_3_2_6', [ $this, 'sl_update_1_3_2_6_callback'] );
		add_action( 'sl_update_set_slupcoming_meta', [ $this, 'sl_update_set_slupcoming_meta_callback'] );
	}

	public function check_updates() {
		$version = get_option('slotsl_version', '1.0.0');
		// Run only if not first install
		if( $version != '1.0.0' && version_compare( $version, '1.0.0.7','<' ) ) {
			as_schedule_single_action(
				time(),
				'sl_update_1_0_0_6',
				[],
				'slots-update'
			);
		}

		// Run only if not first install
		if( $version != '1.0.0' && version_compare( $version, '1.3.2.4','<' ) ) {
			// force update of all games to add missing ones
			update_option('sl_force_update',1);
		}
		// Run only if not first install
		if( $version != '1.0.0' && version_compare( $version, '1.3.2.6','<' ) ) {
			as_schedule_single_action(
				time(),
				'sl_update_1_3_2_6',
				[],
				'slots-update'
			);
		}
		// Run only if not first install
		if( $version != '1.0.0' && version_compare( $version, '1.3.7','<' ) ) {
			// force update of all games to add missing ones
			update_option('sl_force_update',1);
		}
		// Run only if not first install
		if( $version != '1.0.0' && version_compare( $version, '1.3.8.3','<' ) ) {
			// force update of all games to add attributes
			update_option('sl_force_update',1);
		}
		// Run only if not first install
		if( $version != '1.0.0' && version_compare( $version, '1.4.1','<' ) ) {
			as_schedule_single_action(
				time(),
				'sl_update_set_slupcoming_meta',
				[],
				'slots-update'
			);
		}
		update_option('slotsl_version', SLOTSLAUNCH_VERSION);
	}

	/**
	 * Fix games without shortcodes after failed updates on 1.0.0.6
	 * @return void
	 */
	public function sl_update_1_0_0_6_callback() {
		global $wpdb;

		 $wpdb->query( "UPDATE {$wpdb->prefix}posts p1 SET p1.post_content = '[slotsl-game]' WHERE p1.ID IN ( SELECT p2.ID FROM ( SELECT ID, post_type, post_content FROM {$wpdb->prefix}posts ) p2 WHERE p2.post_type = 'slotsl' AND TRIM(p2.post_content) = '')");
	}

	/**
	 * Fix broken powered by button
	 * @return void
	 */
	public function sl_update_1_3_2_6_callback() {
		$settings = slotsl_settings();
		$settings['launch-game'] = str_replace('wp-content/plugins/slotslaunch-wp/','wp-content/plugins/slotslaunch/',$settings['launch-game'] );
		update_option( 'slotsl_settings', $settings );
	}

	/**
	 * Set slupcoming post meta for all slots based on release date
	 * @return void
	 */
	public function sl_update_set_slupcoming_meta_callback() {
		$args = [
			'post_type'      => 'slotsl',
			'posts_per_page' => -1,
			'post_status'    => 'any',
			'meta_key'       => 'slpublish',
			'meta_value'     => '0',
			'meta_compare'   => '=',
		];

		$query = new WP_Query( $args );
		
		if ( $query->have_posts() ) {
			foreach ( $query->posts as $slot ) {
				$slot_attrs = get_post_meta( $slot->ID, 'slot_attrs', true );
				$is_upcoming = 0;
				
				if ( ! empty( $slot_attrs['release'] ) && strtotime( $slot_attrs['release'] ) > time() ) {
					$is_upcoming = 1;
				}
				
				update_post_meta( $slot->ID, 'slupcoming', $is_upcoming );
			}
		}
		
		wp_reset_postdata();
	}

	/**
	 * Check for Updates at the defined API endpoint and modify the update array.
	 *
	 * @param array $_transient_data Update array build by WordPress.
	 *
	 * @return array Modified update array with custom plugin data.
	 * @uses api_request()
	 *
	 */
	public function check_update( $_transient_data ) {

		global $pagenow;

		if ( ! is_object( $_transient_data ) ) {
			$_transient_data = new \stdClass();
		}

		if ( 'plugins.php' == $pagenow && is_multisite() ) {
			return $_transient_data;
		}

		if ( ! empty( $_transient_data->response ) && ! empty( $_transient_data->response[ $this->name ] ) && false === $this->wp_override ) {
			return $_transient_data;
		}

		$plugin_info = $this->get_cached_version_info();

		if ( false === $plugin_info ) {
			$plugin_info = $this->api_request( 'info' );
		}

		if ( false !== $plugin_info && is_object( $plugin_info ) && isset( $plugin_info->version ) ) {

			if ( version_compare( $this->version, $plugin_info->version, '<' ) ) {
				$_transient_data->response[ $this->name ] = (object) [
					'new_version' => $plugin_info->version,
					'package'     => $plugin_info->download_link,
					'slug'        => $this->slug,
				];
			}

			$_transient_data->last_checked           = current_time( 'timestamp' );
			$_transient_data->checked[ $this->name ] = $this->version;

		}

		return $_transient_data;
	}

	public function get_cached_version_info( $cache_key = '' ) {

		if ( empty( $cache_key ) ) {
			$cache_key = $this->cache_key;
		}

		$cache = get_option( $cache_key );

		if ( empty( $cache['timeout'] ) || current_time( 'timestamp' ) > $cache['timeout'] ) {
			return false; // Cache is expired
		}

		return json_decode( $cache['value'] );

	}

	/**
	 * Calls the API and, if successfull, returns the object delivered by the API.
	 *
	 * @param string $_action The requested action.
	 *
	 * @return false|object
	 * @uses is_wp_error()
	 *
	 * @uses get_bloginfo()
	 * @uses wp_remote_post()
	 */
	private function api_request( $_action ) {

		$slotsl_api_request_transient = $this->get_cached_version_info( $this->cache_key );

		if ( ! empty( $slotsl_api_request_transient ) ) {
			return $slotsl_api_request_transient;
		}

		$api_params = [
			'slug' => $this->slug,
		];

		$request = SlotsLaunch_Client::get( 'plugins/' . $_action, $api_params);

		if ( isset( $request->error ) ) {
			return;
		}

		$data = $this->parseRequest( $request );
		$this->set_version_info_cache( $data );

		return $data;
	}

	/**
	 * Convert API response to wordpress plugins API needed object
	 *
	 * @param $request
	 *
	 * @return object
	 */
	private function parseRequest( $request ) {
		// if request fail or plugin don't exit
		if ( ! isset( $request->id ) ) {
			return;
		}

		$res = (object) [
			'name'          => isset( $request->name ) ? $request->name : '',
			'version'       => $request->version,
			'slug'          => $request->slug,
			'download_link' => $request->download_link,

			'tested'       => isset( $request->tested ) ? $request->tested : '',
			'requires'     => isset( $request->requires ) ? $request->requires : '',
			'last_updated' => isset( $request->updated_at ) ? $request->updated_at : '',
			'homepage'     => isset( $request->plugin_url ) ? $request->plugin_url : '',

			'sections' => [
				'description' => $request->description,
				'changelog'   => $request->changelog,
			],

			'banners' => [
				'low'  => isset( $request->banner_low ) ? $request->banner_low : '',
				'high' => isset( $request->banner_high ) ? $request->banner_high : '',
			],

			'external' => true,
		];

		return $res;
	}

	public function set_version_info_cache( $value = '' ) {

		$data = [
			'timeout' => strtotime( '+3 hours', current_time( 'timestamp' ) ),
			'value'   => json_encode( $value ),
		];

		update_option( $this->cache_key, $data );

	}

	/**
	 * Updates information on the "View version x.x details" page with custom data.
	 *
	 * @param $_data
	 * @param string $_action
	 * @param object $_args
	 *
	 * @return object $_data
	 * @uses api_request()
	 *
	 */
	public function plugins_api_filter( $_data, $_action = '', $_args = null ) {

		if ( $_action != 'plugin_information' ) {
			return $_data;
		}


		if ( ! isset( $_args->slug ) || ( $_args->slug != $this->slug ) ) {
			return $_data;
		}

		$_data = $this->api_request( 'info' );

		// Convert sections into an associative array, since we're getting an object, but Core expects an array.
		if ( isset( $_data->sections ) && ! is_array( $_data->sections ) ) {
			$new_sections = [];
			foreach ( $_data->sections as $key => $data ) {
				$new_sections[ $key ] = $data;
			}
			$_data->sections = $new_sections;
		}

		// Convert banners into an associative array, since we're getting an object, but Core expects an array.
		if ( isset( $_data->banners ) && ! is_array( $_data->banners ) ) {
			$new_banners = [];
			foreach ( $_data->banners as $key => $data ) {
				$new_banners[ $key ] = $data;
			}
			$_data->banners = $new_banners;
		}

		return $_data;
	}

}