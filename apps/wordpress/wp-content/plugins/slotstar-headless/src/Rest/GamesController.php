<?php

namespace SlotStar\Headless\Rest;

use SlotStar\Headless\Cache\Cache;
use SlotStar\Headless\Repository\GamesRepository;
use SlotStar\Headless\Support\Response;
use SlotStar\Headless\Support\Validation;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class GamesController {

	private GamesRepository $repository;

	public function __construct() {
		$this->repository = new GamesRepository();
	}

	public function register_routes( string $namespace ): void {
		register_rest_route(
			$namespace,
			'/games',
			[
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => [ $this, 'get_games' ],
				'permission_callback' => '__return_true',
			]
		);

		register_rest_route(
			$namespace,
			'/games/(?P<externalId>\d+)',
			[
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => [ $this, 'get_game' ],
				'permission_callback' => '__return_true',
			]
		);

		register_rest_route(
			$namespace,
			'/internal/launch/(?P<externalId>\d+)',
			[
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => [ $this, 'launch_game' ],
				'permission_callback' => '__return_true',
			]
		);
	}

	public function get_games( \WP_REST_Request $request ): \WP_REST_Response {
		$params = [
			'q'        => Validation::sanitize_search( $request->get_param( 'q' ) ),
			'page'     => Validation::sanitize_page( $request->get_param( 'page' ) ),
			'perPage'  => Validation::sanitize_per_page( $request->get_param( 'per_page' ) ),
			'provider' => Validation::sanitize_slug( $request->get_param( 'provider' ) ),
			'theme'    => Validation::sanitize_slug( $request->get_param( 'theme' ) ),
			'type'     => Validation::sanitize_slug( $request->get_param( 'type' ) ),
			'filter'   => Validation::sanitize_slug( $request->get_param( 'filter' ) ),
			'order'    => Validation::sanitize_order( $request->get_param( 'order' ) ),
			'orderBy'  => Validation::sanitize_order_by( $request->get_param( 'order_by' ) ),
		];

		$cache_key = 'games_list_public_' . md5( (string) wp_json_encode( $params ) );
		$cached = Cache::get( $cache_key );

		if ( false !== $cached && is_array( $cached ) ) {
			return Response::success( $cached['items'], $cached['pagination'] );
		}

		$result = $this->repository->find_all( $params );

		// Always strip sensitive fields on public endpoints
		foreach ( $result['items'] as &$item ) {
			unset( $item['embedUrl'] );
			unset( $item['slot_url'] );
			unset( $item['iframeUrl'] );
			unset( $item['launchUrl'] );
			unset( $item['token'] );
			unset( $item['license'] );
		}
		unset( $item );

		$pagination = [
			'page'       => $params['page'],
			'perPage'    => $params['perPage'],
			'total'      => $result['total'],
			'totalPages' => $result['totalPages'],
		];

		Cache::set( $cache_key, [
			'items'      => $result['items'],
			'pagination' => $pagination,
		], 120 );

		return Response::success( $result['items'], $pagination );
	}

	public function get_game( \WP_REST_Request $request ): \WP_REST_Response {
		$external_id = (int) $request->get_param( 'externalId' );
		if ( $external_id <= 0 ) {
			return Response::error( 'INVALID_GAME_ID', 'Invalid game ID provided.', 400 );
		}

		$cache_key = 'game_detail_public_' . $external_id;
		$cached = Cache::get( $cache_key );

		if ( false !== $cached && is_array( $cached ) ) {
			return new \WP_REST_Response( $cached, 200 );
		}

		$game = $this->repository->find_by_external_id( $external_id );

		if ( null === $game ) {
			return Response::error( 'GAME_NOT_FOUND', 'Game was not found.', 404 );
		}

		// Always strip sensitive fields on public endpoints
		unset( $game['embedUrl'] );
		unset( $game['slot_url'] );
		unset( $game['iframeUrl'] );
		unset( $game['launchUrl'] );
		unset( $game['token'] );
		unset( $game['license'] );

		Cache::set( $cache_key, $game, 300 );

		return new \WP_REST_Response( $game, 200 );
	}

	public function launch_game( \WP_REST_Request $request ): \WP_REST_Response {
		$external_id = (int) $request->get_param( 'externalId' );
		if ( $external_id <= 0 ) {
			return Response::error( 'INVALID_GAME_ID', 'Invalid game ID provided.', 400 );
		}

		$signature = $request->get_header( 'X-SlotStar-Signature' );
		$timestamp = (int) $request->get_header( 'X-SlotStar-Timestamp' );

		if ( empty( $signature ) || empty( $timestamp ) ) {
			return Response::error( 'UNAUTHORIZED', 'Missing authentication headers.', 401 );
		}

		// Validate timestamp skew (maximum 5 minutes)
		$now = time();
		if ( abs( $now - $timestamp ) > 300 ) {
			return Response::error( 'UNAUTHORIZED', 'Request timestamp has expired.', 401 );
		}

		// Retrieve bridge secret
		$secret = defined( 'SLOTSTAR_BRIDGE_SECRET' ) ? SLOTSTAR_BRIDGE_SECRET : 'local_bridge_secret_secure_928374';

		// Recompute signature for validation
		$method = $request->get_method();
		$path = '/slotstar/v1/internal/launch/' . $external_id;
		$body = $request->get_body();
		$body_hash = hash( 'sha256', $body );

		$message = $timestamp . '.' . $method . '.' . $path . '.' . $body_hash;
		$expected_signature = hash_hmac( 'sha256', $message, $secret );

		if ( ! hash_equals( $expected_signature, $signature ) ) {
			return Response::error( 'UNAUTHORIZED', 'Invalid signature signature.', 401 );
		}

		// Secure call to repository to retrieve game embed URL (using non-public bypass)
		$game = $this->repository->find_by_external_id( $external_id );
		if ( null === $game ) {
			return Response::error( 'GAME_NOT_FOUND', 'Game was not found.', 404 );
		}

		// Construct secure SlotsLaunch URL using the client utility directly
		$db_game = $this->repository->find_by_external_id( $external_id );
		
		// Wait, GameMapper contains generateUrl mapping. Let's look up how Mapper generates it.
		// Let's find the original post ID for slotsl since SlotsLaunch_Client::generateUrl requires WP Post ID, not external id.
		$query = new \WP_Query( [
			'post_type'      => 'slotsl',
			'post_status'    => 'publish',
			'posts_per_page' => 1,
			'meta_query'     => [
				[
					'key'     => 'slpid',
					'value'   => $external_id,
					'compare' => '=',
				],
			],
		] );

		if ( empty( $query->posts ) ) {
			return Response::error( 'GAME_NOT_FOUND', 'Game post was not found.', 404 );
		}

		$post_id = $query->posts[0]->ID;
		$embed_url = \SlotsLaunch_Client::generateUrl( $post_id );

		return new \WP_REST_Response( [
			'embedUrl' => $embed_url,
		], 200 );
	}
}
