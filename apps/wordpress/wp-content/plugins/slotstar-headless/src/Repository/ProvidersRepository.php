<?php

namespace SlotStar\Headless\Repository;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class ProvidersRepository {

	public function find_terms( string $taxonomy, array $params ): array {
		if ( ! taxonomy_exists( $taxonomy ) ) {
			return [
				'items'      => [],
				'total'      => 0,
				'totalPages' => 0,
			];
		}

		$args = [
			'taxonomy'   => $taxonomy,
			'hide_empty' => true,
			'number'     => $params['perPage'],
			'offset'     => ( $params['page'] - 1 ) * $params['perPage'],
		];

		if ( ! empty( $params['q'] ) ) {
			$args['name__like'] = $params['q'];
		}

		if ( ! empty( $params['letter'] ) ) {
			$args['search'] = '^' . $params['letter'];
		}

		$terms_query = new \WP_Term_Query( $args );
		$terms = $terms_query->get_terms();

		$count_args = [
			'taxonomy'   => $taxonomy,
			'hide_empty' => true,
			'fields'     => 'count',
		];
		if ( ! empty( $params['q'] ) ) {
			$count_args['name__like'] = $params['q'];
		}
		if ( ! empty( $params['letter'] ) ) {
			$count_args['search'] = '^' . $params['letter'];
		}
		$total_count = (int) wp_count_terms( $count_args );

		$items = [];
		if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
			foreach ( $terms as $term ) {
				$items[] = [
					'id'    => (int) $term->term_id,
					'name'  => $term->name,
					'slug'  => $term->slug,
					'count' => (int) $term->count,
				];
			}
		}

		$total_pages = $params['perPage'] > 0 ? (int) ceil( $total_count / $params['perPage'] ) : 0;

		return [
			'items'      => $items,
			'total'      => $total_count,
			'totalPages' => $total_pages,
		];
	}

	public function find_by_slug( string $taxonomy, string $slug ): ?array {
		if ( ! taxonomy_exists( $taxonomy ) ) {
			return null;
		}

		$term = get_term_by( 'slug', $slug, $taxonomy );
		if ( ! $term || is_wp_error( $term ) ) {
			return null;
		}

		return [
			'id'    => (int) $term->term_id,
			'name'  => $term->name,
			'slug'  => $term->slug,
			'count' => (int) $term->count,
		];
	}
}
