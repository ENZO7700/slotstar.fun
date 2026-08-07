<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://slotslaunch.com
 * @since      1.0.0
 *
 * @package    Slotslaunch
 * @subpackage Slotslaunch/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Slotslaunch
 * @subpackage Slotslaunch/public
 * @author     Damian Logghe <newgames@slotslaunch.com>
 */
class Slotslaunch_Public {

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 */
	public function __construct(  ) {
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_styles'] );
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_scripts'] );

		add_shortcode( 'slotsl-game', [ __CLASS__, 'embed_game'] );
		add_shortcode( 'slotsl-game-archives', [ $this, 'games_archives'] );
		add_shortcode( 'slotsl-provider-archives', [ $this, 'provider_archives'] );
		add_shortcode( 'slotsl-lobby', [ $this, 'lobby' ] );
		add_action( 'wp_footer', [ $this, 'embed_placeholder' ] , 999);

		
		add_filter( 'rocket_lrc_exclusions', [ $this, 'wpr_alr_exclusions' ] );
	}
	/**
	 * Exclude the fullscreen placeholder from the optimization of Wp rocket Lazy Load
	 * @param $exclusions
	 * @return array
	 */
	public function wpr_alr_exclusions( $exclusions ) {
		$exclusions[] = 'id="slotsl-fullscreen-placeholder"';
		return $exclusions;
	}

	/**
	 * Print the game
	 * @return false|string
	 */
	public static function embed_game( $atts, $content = "" ){
		if(! empty($atts['slot_id']) ) {
			wp_enqueue_script( 'slotsl-slots' );
		}
		$game = empty($atts['slot_id']) ? get_post() : get_post($atts['slot_id']);
		if( is_null( $game ) || is_wp_error( $game ) ) {
			if( ! is_admin() ) {
				return 'Game not found';
			}
			return;
		}
		
		// Store the original global post
		global $post;
		$original_post = $post;
		
		// Set the global post to our game for template functions
		$post = $game;
		setup_postdata($post);
		
		$provider = null;
		if( ! apply_filters('slotsl/breadcrumbs/hide_provider', false ) ) {
			$terms = get_the_terms( $game->ID, 'sl-provider' );

			if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
				$provider = $terms[0];
			}
		}
		require_once SLOTSL_PLUGIN_DIR . 'includes/class-slotslaunch-rating.php';
		ob_start();
		
		// Check for theme override
		$template = locate_template('slotslaunch/slotsl-single-game.php');
		if (!$template) {
			$template = SLOTSL_PLUGIN_DIR . 'templates/slotsl-single-game.php';
		}
		include $template;
		
		$output = ob_get_clean();
		
		// Restore the original global post
		$post = $original_post;
		if ($original_post) {
			setup_postdata($original_post);
		}
		
		return $output;
	}

	public function games_archives( $atts ) {
		$atts = shortcode_atts(
			[
				'show_pagination' => 'true',
				'slots'           => '',
				'theme'           => '',
				'type'            => '',
				'provider'        => '',
				'order_by'        => '',
				'order'           => '',
				'show_header'     => 'true',
				'show_button'     => 'true',
				'provider_link'   => 'true',
				'cta_banner'        => '',
				'cta_banner_number' => '',
				'per_page'        => 52,
				'megaways'        => 'false',
				'show_upcoming'   => 'false',
			],
			$atts,
			'slotsl-game-archives'
		);
		wp_enqueue_script( 'slotsl-slots');
		wp_enqueue_script( 'slotsl-select');
		wp_enqueue_style( 'slotsl-select-css');
		ob_start();
		include SLOTSL_PLUGIN_DIR . 'templates/slotsl-game-archives.php';
		return ob_get_clean();
	}

	public function provider_archives( $atts ) {
		wp_enqueue_script( 'slotsl-slots');
		ob_start();
		include_once SLOTSL_PLUGIN_DIR . 'templates/slotsl-provider-archives.php';
		return ob_get_clean();
	}

	public function lobby( $atts ) {
		// Lobby is only available for premium users
		if ( slotsl_setting( 'type' ) === 'free' ) {
			return 'Lobby is only available for premium users.';
		}
		
		wp_enqueue_script( 'slotsl-slots' );
		wp_enqueue_style( 'slotsl-lobby-css' );
		wp_enqueue_script( 'slotsl-lobby-js' );
		ob_start();
		include_once SLOTSL_PLUGIN_DIR . 'templates/slotsl-lobby.php';
		return ob_get_clean();
	}

	
	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		wp_enqueue_style( 'slotsl-css', plugin_dir_url( __FILE__ ) . 'css/slotslaunch-public.css', array(), SLOTSLAUNCH_VERSION, 'all' );
		wp_register_style( 'slotsl-select-css', plugin_dir_url( __FILE__ ) . 'css/choices.min.css', array(), SLOTSLAUNCH_VERSION, 'all' );
		wp_register_style( 'slotsl-lobby-css', plugin_dir_url( __FILE__ ) . 'css/slotslaunch-lobby.css', array(), SLOTSLAUNCH_VERSION, 'all' );

	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {
		$args = [
			'api'           => SlotsLaunch_Client::api_url() ,
			'single_page'   => slotsl_setting('single-slots' ),
			'single_popup'   => slotsl_setting('single-popup' ),
			'ajax_url'      => admin_url('admin-ajax.php'),
			'button_text'   => slotsl_setting('demo-btn', __('Try Demo', 'slotslaunch') ),
			'show_button'   => 'true',
			'play_for_real' => slotsl_setting('play-for-real'),
			'banner_text'   => slotsl_setting('banner-text'),
			'play_for_real_text' => slotsl_setting( 'play-for-real-text', __( 'Play for Real', 'slotslaunch' ) ),
			'grid'          => apply_filters('slotsl/grid','sl-grid-4'),
			'remember_filters'          => apply_filters('slotsl/remember_filters', true ),
			'lobby_url' => slotsl_setting( 'lobby-url', site_url() ),
		];
		wp_register_script( 'slotsl-slots', plugin_dir_url( __FILE__ ) . 'js/slotslaunch-slots.js', [ 'jquery' ], SLOTSLAUNCH_VERSION, true );
		wp_register_script( 'slotsl-select', plugin_dir_url( __FILE__ ) . 'js/choices.min.js', [ 'jquery' ], SLOTSLAUNCH_VERSION, true );
		wp_register_script( 'slotsl-lobby-js', plugin_dir_url( __FILE__ ) . 'js/slotslaunch-lobby.js', [ 'jquery' ], SLOTSLAUNCH_VERSION, true );
		wp_localize_script( 'slotsl-slots', 'slotsl', $args );
		if( is_singular('slotsl' ) ) {
			wp_enqueue_script( 'slotsl-slots' );
		}
	}

	public function embed_placeholder() {
		echo '<div id="slotsl-fullscreen-placeholder"></div>';
		if( slotsl_setting('single-slots' ) && slotsl_setting('single-popup' ) ) {
			$color = slotsl_setting('color');
			echo '<div id="sl-single-game-popup" ><iframe src="" style="border: 4px solid '.$color.';border-radius: 10px;width: 100%; height: 100%;" frameborder="0"></iframe></div>';
		}
	}
}
