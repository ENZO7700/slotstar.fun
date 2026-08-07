<?php

class Slotslaunch_Slots {


	public static function slots( $args = [] ): WP_Query {

		// wordpress already sanitize these
		$provider = $_GET['sl-provider'] ?? '';
		$type     = $_GET['sl-type'] ?? '';
		$theme    = $_GET['sl-theme'] ?? '';
		$filters  = $_GET['sl-filter'] ?? [];
		$search   = $_GET['sl-name'] ?? '';
		$sort     = $_GET['sl-sort'] ?? 'new';
		if( isset( $_GET['upcoming'] ) && 'true' == $_GET['upcoming'] ) {
			$args['upcoming'] = true;
		}
		$ranking_ids = [];

		// passing provider in shortcode?
		if ( ! empty( $args['provider'] ) ) {
			if ( empty( $provider ) ) {
				$provider = $args['provider'];
			}
			unset( $args['provider'] );
		}

		// passing theme in shortcode?
		if ( ! empty( $args['theme'] ) ) {
			if ( empty( $theme ) ) {
				$theme = $args['theme'];
			}
			unset( $args['theme'] );
		}
		// passing type in shortcode?
		if ( ! empty( $args['type'] ) ) {
			if ( empty( $type ) ) {
				$type = $args['type'];
			}
			unset( $args['type'] );
		}

		// passing order_by in shortcode? (can be used for special sorts or standard WordPress orderby)
		$special_sorts = [ 'az', 'za', 'new', 'most_played', 'most_rated', 'highest_rated', 'trending', 'gold', 'silver', 'bronze' ];
		if ( ! empty( $args['order_by'] ) ) {
			// If GET parameter is not set, check if order_by is a special sort
			if ( ! isset( $_GET['sl-sort'] ) ) {
				if ( in_array( $args['order_by'], $special_sorts, true ) ) {
					// Use as special sort
					$sort = $args['order_by'];
					unset( $args['order_by'] );
				}
				// If not a special sort, keep it in $args for standard WordPress orderby handling below
			} else {
				// GET parameter exists, so don't use order_by as sort, but keep it for standard orderby if not special
				if ( ! in_array( $args['order_by'], $special_sorts, true ) ) {
					// Keep for standard WordPress orderby
				} else {
					// It's a special sort but GET takes precedence, so remove it
					unset( $args['order_by'] );
				}
			}
		}

		// passing megaways in shortcode?
		if ( ! empty( $args['megaways'] ) && 'true' == $args['megaways'] ) {
			$filters[] = 'megaways';
			unset( $args['megaways'] );
		}

		if ( ! empty( $args['filters'] ) && is_array( $args['filters'] ) ) {
			$filters =  array_merge( $filters, $args['filters'] );
			unset( $args['filters'] );
		}

		// handle rankings-based sorts
		if ( in_array( $sort, [ 'most_played', 'most_rated', 'highest_rated', 'trending', 'gold', 'silver', 'bronze' ], true ) ) {
			switch ( $sort ) {
				case 'most_played':
					$ranking_ids = self::get_rankings_ids( 'most_played', 'rankings' );
					break;
				case 'most_rated':
				case 'trending':
					$ranking_ids = self::get_rankings_ids( 'most_rated', 'rankings/most-rated' );
					break;
				case 'highest_rated':
					$ranking_ids = self::get_rankings_ids( 'highest_rated', 'rankings/highest-rated' );
					break;
				case 'gold':
				case 'silver':
				case 'bronze':
					$ranking_ids = self::get_rankings_ids( 'medal_' . $sort, 'rankings/medals/' . $sort );
					break;
			}
		}
	

		$query_args = [
			'post_type'      => 'slotsl',
			'posts_per_page' => ! empty( $args['per_page'] ) ? absint( $args['per_page'] ) : 52,
			'paged'          => slotsl_current_page(),
			'post_status'    => 'publish',
			'orderby'        => 'date',
			'order'          => 'desc',
			'meta_key'       => ! empty( $args['upcoming'] ) && 'true' == $args['upcoming'] ? 'slupcoming' : 'slpublish',
			'meta_value'     => '1',
			'meta_compare'   => '=',
		];
		// Handle special sort values (from GET or order_by shortcode attribute)
		if ( in_array( $sort, $special_sorts, true ) ) {
			if ( $sort == 'az' || $sort == 'za' ) {
				$query_args['orderby'] = 'title';
				$query_args['order']   = $sort == 'az' ? 'asc' : 'desc';
			}
			// Note: rankings-based sorts are handled above, and 'new' uses default date/desc
		} elseif ( ! empty( $args['order_by'] ) ) {
			// Standard WordPress orderby (only if not a special sort)
			$query_args['orderby'] = $args['order_by'];
			if ( ! empty( $args['order'] ) ) {
				$query_args['order'] = $args['order'];
			}
		}
		
		// ids passed?
		if ( ! empty( $args['slots'] ) ) {
			$query_args['post__in']       = ! is_array( $args['slots'] ) ? array_map( 'trim', explode( ',', $args['slots'] ) ) : $args['slots'];
			$query_args['orderby']        = 'post__in';
			$query_args['posts_per_page'] = '-1';
			// When slots are specified we want to show them regardless they are off
			unset($query_args['meta_key' ]);
			unset($query_args['meta_value' ]);
			unset($query_args['meta_compare' ]);
		}
		
		// Allow order to override even for special sorts (if explicitly set)
		if ( ! empty( $args['order'] ) && empty( $args['slots'] ) ) {
			// Only override if not using az/za (which already set order)
			if ( $sort != 'az' && $sort != 'za' ) {
				$query_args['order'] = $args['order'];
			}
		}
		
		if ( ! empty( $args['exclude'] ) ) {
			$query_args['post__not_in'] = ! is_array( $args['exclude'] ) ? array_map( 'trim', explode( ',', $args['exclude'] ) ) : $args['exclude'];
		}
		// if provider add to args
		if ( $provider ) {
			$query_args['tax_query'][] =
				[
					'taxonomy' => 'sl-provider',
					'field'    => 'slug',
					'terms'    => array_map( 'trim', explode( ',', $provider ) ),
				];
		}
		$remove_providers = slotsl_setting( 'providers' );
		if ( ! empty( $remove_providers ) ) {
			$query_args['tax_query'][] =
				[
					'taxonomy' => 'sl-provider',
					'field'    => 'term_id',
					'terms'    => array_values( $remove_providers ),
					'operator' => 'NOT IN',
				];
		}
		// if theme add to args
		if ( $theme ) {
			$query_args['tax_query'][] =
				[
					'taxonomy' => 'sl-theme',
					'field'    => 'slug',
					'terms'    => ! is_array( $theme ) ? array_map( 'trim', explode( ',', $theme ) ) : $theme,
				];
		}
		// if type add to args
		if ( $type ) {
			$query_args['tax_query'][] =
				[
					'taxonomy' => 'sl-type',
					'field'    => 'slug',
					'terms'    => ! is_array( $type ) ? array_map( 'trim', explode( ',', $type ) ) : $type,
				];
		}
		// if filters
		if ( $filters ) {
			$query_args['tax_query'][] =
				[
					'taxonomy' => 'sl-filter',
					'field'    => 'slug',
					'terms'    => ! is_array( $filters ) ? array_map( 'trim', explode( ',', $filters ) ) : $filters,
				];
			// fix to three if featured filter is present
			if( in_array('featured', $filters) ) {
				$query_args['posts_per_page'] = '3';
			}
		}
		// if search query add it
		if ( $search ) {
			$query_args['s'] = esc_sql( $search );
		}

		// apply rankings filter if we have ids
		if ( ! empty( $ranking_ids ) && is_array( $ranking_ids ) ) {
			$query_args['meta_query'][] =
				[
					'key'     => 'slpid',
					'value'   => array_map( 'absint', $ranking_ids ),
					'compare' => 'IN',
				];
		}

		//  merge with passed args in case of any and last time to modify
		$args = apply_filters( 'slotsl/slots_query',
			wp_parse_args( $args, $query_args )
		);


		return new WP_Query( $args );
	}


	public static function providers( $args = [] ) {

		$q_args = [
			'taxonomy'   => 'sl-provider',
			'number'     => ! empty( $args['per_page'] ) ? absint( $args['per_page'] ) : 20,
			'hide_empty' => false,
		];
		if ( ! empty( $args['provider'] ) ) {
			$q_args['slug'] = ! is_array( $args['provider'] ) ? array_map( 'trim', explode( ',', $args['provider'] ) ) : $args['provider'];
		}

		if ( ! empty( $args['offset'] ) ) {
			$q_args['offset'] = absint( $args['offset'] );
		}
		if ( ! empty( $args['sl-name'] ) ) {
			$q_args['name__like'] = esc_sql( $args['sl-name'] );
			unset($q_args['offset']);
		}
		$ids = slotsl_setting( 'providers' );
		if ( $ids ) {
			$q_args['exclude'] = array_values( $ids );
		}

		$numProviders = wp_count_terms( 'sl-provider', [
			'hide_empty'=> false
		] );
		return [
			'total'     => $numProviders,
			'providers' => get_terms( apply_filters( 'slotsl/get_providers', $q_args ) )
			];
	}


	public static function types( $args = [] ) {

		$q_args = [
			'taxonomy'   => 'sl-type',
			'hide_empty' => true,
		];
		if ( ! empty( $args['type'] ) ) {
			$q_args['slug'] = ! is_array( $args['type'] ) ? array_map( 'trim', explode( ',', $args['type'] ) ) : $args['type'];
		}
		if ( ! empty( $args['sl-name'] ) ) {
			$q_args['name__like'] = esc_sql( $args['sl-name'] );
		}

		return get_terms(
			apply_filters( 'slotsl/get_types', $q_args )
		);

	}

	public static function themes( $args = [] ) {

		$q_args = [
			'taxonomy'   => 'sl-theme',
			'hide_empty' => true,
		];
		if ( ! empty( $args['theme'] ) ) {
			$q_args['slug'] = ! is_array( $args['theme'] ) ? array_map( 'trim', explode( ',', $args['theme'] ) ) : $args['theme'];
		}
		if ( ! empty( $args['sl-name'] ) ) {
			$q_args['name__like'] = esc_sql( $args['sl-name'] );
		}

		return get_terms(
			apply_filters( 'slotsl/get_themes', $q_args )
		);

	}

	public static function get_attrs( $args = [] ) {
		$game_attrs = get_post_meta( $args['id'], 'slot_attrs', true );
		if( !empty( $args['key'] ) && empty( $game_attrs[$args['key']] ) ) {
			return '';
		}
		return $game_attrs;
	}

	/**
	 * Get cached rankings ids from SlotsLaunch API.
	 *
	 * @param string $cache_key  Unique key for this rankings type.
	 * @param string $endpoint   Endpoint path relative to /api/ (e.g., 'rankings', 'rankings/most-rated').
	 *
	 * @return array
	 */
	private static function get_rankings_ids( string $cache_key, string $endpoint ): array {
		$option_name = 'slotsl_rankings_' . $cache_key;
		$cached      = get_option( $option_name );

		// Return cached ids if still valid (1 week).
		if ( is_array( $cached )
		     && ! empty( $cached['ids'] )
		     && ! empty( $cached['updated'] )
		     && ( $cached['updated'] + WEEK_IN_SECONDS ) > time()
		) {
			return $cached['ids'];
		}

		$host = parse_url( home_url(), PHP_URL_HOST );
		if ( empty( $host ) ) {
			return is_array( $cached ) && ! empty( $cached['ids'] ) ? $cached['ids'] : [];
		}

		// Clean endpoint path
		$endpoint_path = trim( $endpoint, '/' );

		// Call API using SlotsLaunch_Client with host parameter
		$response = SlotsLaunch_Client::get( $endpoint_path, [ 'host' => $host ] );

		// Check for error response
		if ( is_object( $response ) && isset( $response->error ) ) {
			return is_array( $cached ) && ! empty( $cached['ids'] ) ? $cached['ids'] : [];
		}

		// Handle response wrapped in data property or direct array
		$response_data = is_object( $response ) && isset( $response->data ) ? $response->data : $response;

		// Expect the API to return an array of objects with game_id property
		if ( ! is_array( $response_data ) || empty( $response_data ) ) {
			return is_array( $cached ) && ! empty( $cached['ids'] ) ? $cached['ids'] : [];
		}

		// Extract game_id from each object in the response
		$ids = [];
		foreach ( $response_data as $item ) {
			$game_id = null;
			
			// Handle object format from JSON decode (default behavior)
			if ( is_object( $item ) ) {
				$game_id = isset( $item->game_id ) ? $item->game_id : null;
			} elseif ( is_array( $item ) ) {
				$game_id = isset( $item['game_id'] ) ? $item['game_id'] : null;
			}
			
			// Validate and add game_id
			if ( $game_id !== null && $game_id !== '' && is_numeric( $game_id ) ) {
				$game_id_int = (int) $game_id;
				if ( $game_id_int > 0 ) {
					$ids[] = $game_id_int;
				}
			}
		}

		$ids = array_values( array_unique( $ids ) );

		if ( empty( $ids ) ) {
			return is_array( $cached ) && ! empty( $cached['ids'] ) ? $cached['ids'] : [];
		}

		// Cache the results for 1 week
		update_option(
			$option_name,
			[
				'ids'     => $ids,
				'updated' => time(),
			]
		);

		return $ids;
	}
}