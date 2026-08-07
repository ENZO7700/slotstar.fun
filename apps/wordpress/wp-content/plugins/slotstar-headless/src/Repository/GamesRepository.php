<?php

namespace SlotStar\Headless\Repository;

use SlotStar\Headless\Mapper\GameMapper;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class GamesRepository {

	public function find_all( array $params ): array {
		$args = [
			'post_type'      => 'slotsl',
			'post_status'    => 'publish',
			'paged'          => $params['page'],
			'posts_per_page' => $params['perPage'],
			'orderby'        => $params['orderBy'],
			'order'          => $params['order'],
		];

		if ( ! empty( $params['q'] ) ) {
			$args['s'] = $params['q'];
		}

		$tax_query = [];

		if ( ! empty( $params['provider'] ) ) {
			$tax_query[] = [
				'taxonomy' => 'sl-provider',
				'field'    => 'slug',
				'terms'    => $params['provider'],
			];
		}

		if ( ! empty( $params['theme'] ) ) {
			$tax_query[] = [
				'taxonomy' => 'sl-theme',
				'field'    => 'slug',
				'terms'    => $params['theme'],
			];
		}

		if ( ! empty( $params['type'] ) ) {
			$tax_query[] = [
				'taxonomy' => 'sl-type',
				'field'    => 'slug',
				'terms'    => $params['type'],
			];
		}

		if ( ! empty( $params['filter'] ) ) {
			$tax_query[] = [
				'taxonomy' => 'sl-filter',
				'field'    => 'slug',
				'terms'    => $params['filter'],
			];
		}

		if ( count( $tax_query ) > 1 ) {
			$tax_query['relation'] = 'AND';
		}

		if ( ! empty( $tax_query ) ) {
			$args['tax_query'] = $tax_query;
		}

		$query = new \WP_Query( $args );
		$games = [];

		if ( $query->have_posts() ) {
			foreach ( $query->posts as $post ) {
				$games[] = GameMapper::to_array( $post );
			}
		}

		return [
			'items'      => $games,
			'total'      => (int) $query->found_posts,
			'totalPages' => (int) $query->max_num_pages,
		];
	}

	public function find_by_external_id( int $external_id ): ?array {
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
			return null;
		}

		return GameMapper::to_array( $query->posts[0] );
	}
}
