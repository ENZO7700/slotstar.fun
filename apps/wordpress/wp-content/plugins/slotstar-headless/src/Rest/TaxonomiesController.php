<?php

namespace SlotStar\Headless\Rest;

use SlotStar\Headless\Cache\Cache;
use SlotStar\Headless\Repository\ProvidersRepository;
use SlotStar\Headless\Support\Response;
use SlotStar\Headless\Support\Validation;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class TaxonomiesController {

	private ProvidersRepository $repository;

	public function __construct() {
		$this->repository = new ProvidersRepository();
	}

	public function register_routes( string $namespace ): void {
		register_rest_route(
			$namespace,
			'/themes',
			[
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => [ $this, 'get_themes' ],
				'permission_callback' => '__return_true',
			]
		);

		register_rest_route(
			$namespace,
			'/types',
			[
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => [ $this, 'get_types' ],
				'permission_callback' => '__return_true',
			]
		);

		register_rest_route(
			$namespace,
			'/filters',
			[
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => [ $this, 'get_filters' ],
				'permission_callback' => '__return_true',
			]
		);
	}

	public function get_themes( \WP_REST_Request $request ): \WP_REST_Response {
		return $this->get_taxonomy_terms( 'sl-theme', 'themes', $request );
	}

	public function get_types( \WP_REST_Request $request ): \WP_REST_Response {
		return $this->get_taxonomy_terms( 'sl-type', 'types', $request );
	}

	public function get_filters( \WP_REST_Request $request ): \WP_REST_Response {
		return $this->get_taxonomy_terms( 'sl-filter', 'filters', $request );
	}

	private function get_taxonomy_terms( string $taxonomy, string $name, \WP_REST_Request $request ): \WP_REST_Response {
		$params = [
			'q'       => Validation::sanitize_search( $request->get_param( 'q' ) ),
			'page'    => Validation::sanitize_page( $request->get_param( 'page' ) ),
			'perPage' => Validation::sanitize_per_page( $request->get_param( 'per_page' ) ),
		];

		$cache_key = "{$name}_list_" . md5( (string) wp_json_encode( $params ) );
		$cached = Cache::get( $cache_key );

		if ( false !== $cached && is_array( $cached ) ) {
			return Response::success( $cached['items'], $cached['pagination'] );
		}

		$result = $this->repository->find_terms( $taxonomy, $params );

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
}
