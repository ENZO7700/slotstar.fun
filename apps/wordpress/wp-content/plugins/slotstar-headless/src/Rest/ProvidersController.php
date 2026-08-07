<?php

namespace SlotStar\Headless\Rest;

use SlotStar\Headless\Cache\Cache;
use SlotStar\Headless\Repository\ProvidersRepository;
use SlotStar\Headless\Support\Response;
use SlotStar\Headless\Support\Validation;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class ProvidersController {

	private ProvidersRepository $repository;

	public function __construct() {
		$this->repository = new ProvidersRepository();
	}

	public function register_routes( string $namespace ): void {
		register_rest_route(
			$namespace,
			'/providers',
			[
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => [ $this, 'get_providers' ],
				'permission_callback' => '__return_true',
			]
		);

		register_rest_route(
			$namespace,
			'/providers/(?P<slug>[a-zA-Z0-9\-_]+)',
			[
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => [ $this, 'get_provider' ],
				'permission_callback' => '__return_true',
			]
		);
	}

	public function get_providers( \WP_REST_Request $request ): \WP_REST_Response {
		$params = [
			'q'       => Validation::sanitize_search( $request->get_param( 'q' ) ),
			'page'    => Validation::sanitize_page( $request->get_param( 'page' ) ),
			'perPage' => Validation::sanitize_per_page( $request->get_param( 'per_page' ) ),
			'letter'  => Validation::sanitize_slug( $request->get_param( 'letter' ) ),
		];

		$cache_key = 'providers_list_' . md5( (string) wp_json_encode( $params ) );
		$cached = Cache::get( $cache_key );

		if ( false !== $cached && is_array( $cached ) ) {
			return Response::success( $cached['items'], $cached['pagination'] );
		}

		$result = $this->repository->find_terms( 'sl-provider', $params );

		$pagination = [
			'page'       => $params['page'],
			'perPage'    => $params['perPage'],
			'total'      => $result['total'],
			'totalPages' => $result['totalPages'],
		];

		Cache::set( $cache_key, [
			'items'      => $result['items'],
			'pagination' => $pagination,
		], 300 );

		return Response::success( $result['items'], $pagination );
	}

	public function get_provider( \WP_REST_Request $request ): \WP_REST_Response {
		$slug = Validation::sanitize_slug( $request->get_param( 'slug' ) );
		if ( empty( $slug ) ) {
			return Response::error( 'INVALID_SLUG', 'Invalid provider slug.', 400 );
		}

		$cache_key = 'provider_detail_' . $slug;
		$cached = Cache::get( $cache_key );

		if ( false !== $cached && is_array( $cached ) ) {
			return new \WP_REST_Response( $cached, 200 );
		}

		$provider = $this->repository->find_by_slug( 'sl-provider', $slug );

		if ( null === $provider ) {
			return Response::error( 'PROVIDER_NOT_FOUND', 'Provider was not found.', 404 );
		}

		Cache::set( $cache_key, $provider, 300 );

		return new \WP_REST_Response( $provider, 200 );
	}
}
