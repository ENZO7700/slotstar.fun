<?php

use function GeotWP\makeRandomString;

/**
 *
 */
class SlotsLaunch_Client {

	/**
	 * @param $endpoint
	 * @param $args
	 *
	 * @return false|float|int|mixed|Services_JSON_Error|string|void
	 */
	public static function get( $endpoint, $args ) {
		// Ensure $args is always an array
		if ( !is_array( $args ) ) {
			$args = [];
		}
		
		// every request needs license
		if( empty( $args['token'] ) ) {
			$opts = slotsl_settings();
			$args['token'] = $opts['license'];
		}

		//$args['host'] = $_SERVER['HTTP_HOST'];
		add_filter( 'http_request_timeout', function(){ return 30;} );
		try {
			$res = self::client()->get( 
				add_query_arg( apply_filters( 'slotsl/api_args', $args, $endpoint ),  SlotsLaunch_Client::api_url() . $endpoint ),
			[
				'headers'     => [
					'Content-Type'  => 'application/json',
					'Accept'  => 'application/json',
					'Origin'  => empty($_SERVER['HTTP_HOST']) ? parse_url(get_site_url(),PHP_URL_HOST ) : $_SERVER['HTTP_HOST']
				],
				'sslverify' => false,
				'timeout'     => 30,
			]);
			$body = wp_remote_retrieve_body($res);
			$code = wp_remote_retrieve_response_code( $res );
			if ( is_wp_error($res) ) {
				return slots_to_obj( [
					'error' => 'Code: ' . $code . ' - Something wrong happened:' . strip_tags( $res->get_error_message() ),
					'code'  => $code
				] );
			}
			if( $code != '200') {
				return slots_to_obj( [
					'error' => 'Code: ' . $code . ' - Something wrong happened:' . strip_tags( $body ),
					'code'  => $code
				] );
			}
		} catch ( \Exception $e ) {
			return slots_to_obj( [ 'error' => $e->getMessage() ] );
		}

		return json_decode(strip_tags($body));
	}
	/**
	 * Create a client instance
	 */
	private static function client() {

		return _wp_http_get_object();
	}

	/**
	 * Return API URL
	 */
	public static function api_url() {
		return apply_filters('slotsl/api_url', 'https://slotslaunch.com/api/');
	}

	/**
	 * Iframe urls
	 * @param $url
	 *
	 * @return string
	 */
	public static function generateUrl( $id ): string {
		return slotsl_cache_remember( 'slotsl-url.' . $id, function () use ($id) {
			$url = str_replace('http:','https:', get_post_meta( $id, 'slot_url', true) );
			$opts = slotsl_settings();
			$license = $opts['license'] ?? '';
			return add_query_arg( apply_filters( 'slotsl/url_args', [
				'token'       => $license,
				'o'           => 'wp',
			]), $url);
		} );

	}

}
