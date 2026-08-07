<?php
/**
 * Plugin settings
 * @return mixed|void
 */
function slotsl_settings() {

	$settings = get_option( 'slotsl_settings' );

	return apply_filters( 'slotsl/settings_page/opts', $settings );
}

/**
 * Retrieve a value from options
 *
 * @param $key
 * @param mixed|false $default
 * @param string $option
 *
 * @return bool|mixed
 */
function slotsl_setting( $key, $default = false, string $option = 'slotsl_settings' ) {

	$key     = slotsl_sanitize_key( $key );
	$options = get_option( $option, false );
	return is_array( $options ) && isset( $options[ $key ] ) && ( $options[ $key ] === '0' || ! empty( $options[ $key ] ) ) ? apply_filters('slotsl/settings_'.$key, $options[ $key ]) : $default;
}

/**
 * Create an object lazy way
 * @param $string
 *
 * @return array|mixed|object
 */
function slots_to_obj( $string ) {
	return json_decode( json_encode( $string ) );
}

/**
 * Retrieve a value from the object cache. If it doesn't exist, run the $callback to generate and
 * cache the value.
 *
 * @param string   $key      The cache key.
 * @param callable $callback The callback used to generate and cache the value.
 * @param string   $group    Optional. The cache group. Default is empty.
 * @param int      $expire   Optional. The number of seconds before the cache entry should expire.
 *                           Default is 0 (as long as possible).
 *
 * @return mixed The value returned from $callback, pulled from the cache when available.
 */
function slotsl_cache_remember( $key, $callback, $group = '', $expire = DAY_IN_SECONDS ) {
	$found  = false;
	$cached = wp_cache_get( $key, $group, false, $found );

	if ( false !== $found ) {
		return $cached;
	}

	$value = $callback();

	if ( ! is_wp_error( $value ) ) {
		wp_cache_set( $key, $value, $group, $expire );
	}

	return $value;
}


/**
 * Check permissions for currently logged in user.
 *
 * @return bool
 * @since 2.0.0
 *
 */
function slotsl_current_user_can() {

	$capability = slotsl_get_manage_capability();

	return apply_filters( 'slotsl/current_user_can', current_user_can( $capability ), $capability );
}

/**
 * Get the default capability to manage everything for Slots Launch.
 *
 * @return string
 * @since 2.0.0
 *
 */
function slotsl_get_manage_capability() {
	return apply_filters( 'slotsl/manage_capability', 'manage_options' );
}

/**
 * Sanitizes string of CSS classes.
 *
 * @param array|string $classes
 * @param bool $convert True will convert strings to array and vice versa.
 *
 * @return string|array
 * @since 2.0.0
 *
 */
function slotsl_sanitize_classes( $classes, $convert = false ) {

	$array = is_array( $classes );
	$css   = [];

	if ( ! empty( $classes ) ) {
		if ( ! $array ) {
			$classes = explode( ' ', trim( $classes ) );
		}
		foreach ( $classes as $class ) {
			if ( ! empty( $class ) ) {

				if ( strpos( $class, ' ' ) !== false ) {
					$css[] = slotsl_sanitize_classes( $class, false );
				} else {
					$css[] = sanitize_html_class( $class );
				}
			}
		}
	}
	if ( $array ) {
		return $convert ? implode( ' ', $css ) : $css;
	} else {
		return $convert ? $css : implode( ' ', $css );
	}
}

/**
 * Sanitize key, primarily used for looking up options.
 *
 * @param string $key
 *
 * @return string
 */
function slotsl_sanitize_key( string $key = '' ): string {

	return preg_replace( '/[^a-zA-Z0-9_\-\.\:\/]/', '', $key );
}

/**
 * Upgrade link used within the various admin pages.
 */
function slotsl_admin_upgrade_link(): string {

	// Check if there's a constant.
	$aff_url = '';

	$aff_url = apply_filters( 'slotsl_aff_url', $aff_url );

	// If at this point we still don't have
	// Just return the standard upgrade URL.
	if ( empty( $aff_url ) ) {
		return 'https://slotslaunch.com/launch-pad/billing/';
	}

	return esc_url( $aff_url );
}

/**
 * @return string
 */
function slotsl_default_single_slot_text(){
	return '<img class="slaunch-game sl-gamethumb" src="[slot-image]" alt="[slot-name]" role="button" />
						[play-for-real]
						[play-for-free]
	[powered-by-img]';
}
/**
 * @return string
 */
function slotsl_default_single_popup_text(){
	return '<h3>Play [slot-name] for real money</h3>
<img class="slaunch-game sl-gamethumb" src="[slot-image]" alt="[slot-name]" role="button" />
						[play-for-real]';
}
/**
 * @return string
 */
function slotsl_default_banner_text(){
	return '<a href="[play-for-real-url]">Click here to play online slots for real money.</a>';
}

/**
 * Current pagination page
 * @return int
 */
function slotsl_current_page() {
	if( isset( $_GET['sl-page'] ) ) {
		return absint( $_GET['sl-page'] );
	}
	return 1;
}

function slotsl_img_url( $pid = null ) {
	if( ! $pid ) {
		$pid = get_the_ID();
	}
	if ( has_post_thumbnail($pid) ) {
		$img = get_the_post_thumbnail_url( $pid );
	} else {
		$img = slotsl_meta($pid, 'slimg');
	}
	return $img;
}

function slotsl_id( $id ) {
	return slotsl_meta( $id, 'slpid');
}

function slotsl_meta( $id, $key ) {
	return get_post_meta( $id, $key, true );
}

function slotsl_provider_meta( $id, $key ) {
	return get_term_meta( $id, $key, true );
}

function provider_img_url( $pid ) {
	return slotsl_provider_meta($pid, 'sl_img');
}

function slotsl_clear_slots() {
	delete_option( 'slots_error' );
	delete_option( 'sl_importer_notices' );
	delete_option( 'sl_importer_in_progress_notices' );
	delete_option( 'sl_admin_id' );

	// delete slots and taxonomies and meta
	global $wpdb;
	$wpdb->query( "DELETE a,b,c FROM $wpdb->posts a LEFT JOIN $wpdb->term_relationships b ON (a.ID = b.object_id) LEFT JOIN $wpdb->postmeta c ON (a.ID = c.post_id) WHERE a.post_type = 'slotsl'" );
	$wpdb->query( "DELETE t, tt, tr FROM $wpdb->terms AS t LEFT JOIN $wpdb->term_taxonomy AS tt ON t.term_id = tt.term_id LEFT JOIN $wpdb->term_relationships AS tr ON tt.term_taxonomy_id = tr.term_taxonomy_id WHERE tt.taxonomy = 'sl-provider' OR tt.taxonomy = 'sl-theme' OR tt.taxonomy = 'sl-type' OR tt.taxonomy = 'sl-filter'" );
	$wpdb->query( "DELETE FROM  {$wpdb->prefix}actionscheduler_actions WHERE `hook` = 'sl_daily_import' OR `hook` = 'sl_install_games' OR `hook` = 'sl_success'" );
}

function slotsl_providers() {
	return SlotsLaunch_Client::get( 'providers', [ 'pluck' => true ] );
}

/**
 * Print correct url
 * @param $game_id
 *
 * @return false|string|WP_Error
 */
function slotsl_game_url( $game_id ) {

	if( slotsl_setting('single-slots' ) ) {
		$lobby_url = slotsl_setting( 'lobby-url', site_url() );
		return $lobby_url . '#@slot=' . $game_id;
	}
	return get_permalink($game_id);
}

function slotsl_game_link( $atts = [], $content = '' ) {
	$html = '<a href="'. get_permalink( $atts['game_id'] ) .'" class="slotsl-url '. ($atts['class'] ?? '') .'" data-sid="'. $atts['game_id'] .'">'. $content .'</a>';
	if( slotsl_setting('single-slots' ) ) {
		$html = '<span data-url="#@slot=' . $atts['game_id'] . '" class="slotsl-url '. ($atts['class'] ?? '') .'" data-sid="'. $atts['game_id'] .'">'. $content .'</span>';
	}
	return $html;
}

