<?php

namespace SlotStar\Headless\Rest;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class HealthController {

	public function register_routes( string $namespace ): void {
		register_rest_route(
			$namespace,
			'/health',
			[
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => [ $this, 'get_health' ],
				'permission_callback' => '__return_true',
			]
		);
	}

	public function get_health( \WP_REST_Request $request ): \WP_REST_Response {
		$slotslaunch_active = is_plugin_active( 'slotslaunch/slotslaunch.php' );
		
		$games_count     = 0;
		$providers_count = 0;

		if ( post_type_exists( 'slotsl' ) ) {
			$counts = wp_count_posts( 'slotsl' );
			$games_count = isset( $counts->publish ) ? (int) $counts->publish : 0;
		}

		if ( taxonomy_exists( 'sl-provider' ) ) {
			$providers_count = (int) wp_count_terms( [
				'taxonomy'   => 'sl-provider',
				'hide_empty' => false,
			] );
		}

		return rest_ensure_response( [
			'status'                  => 'ok',
			'wordpress'               => true,
			'slotsLaunchPluginActive' => $slotslaunch_active,
			'sourceMode'              => 'official-plugin',
			'gamesDetected'           => $games_count,
			'providersDetected'       => $providers_count,
		] );
	}
}
