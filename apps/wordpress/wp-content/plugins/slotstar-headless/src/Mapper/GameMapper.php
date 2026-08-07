<?php

namespace SlotStar\Headless\Mapper;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class GameMapper {

	public static function to_array( \WP_Post $post ): array {
		$post_id    = $post->ID;
		$external_id_raw = get_post_meta( $post_id, 'slpid', true );
		$external_id     = ! empty( $external_id_raw ) ? (int) $external_id_raw : null;

		$game_name = get_the_title( $post );
		$base_slug = sanitize_title( $game_name );
		$slug      = $external_id ? "{$base_slug}-{$external_id}" : $base_slug;

		// Provider taxonomy (sl-provider)
		$provider_data = null;
		$provider_terms = get_the_terms( $post_id, 'sl-provider' );
		if ( ! empty( $provider_terms ) && ! is_wp_error( $provider_terms ) ) {
			$term = reset( $provider_terms );
			$provider_data = [
				'id'   => (int) $term->term_id,
				'name' => $term->name,
				'slug' => $term->slug,
			];
		}

		$provider_slug = $provider_data ? $provider_data['slug'] : 'unknown';
		$canonical_path = "/games/{$provider_slug}/{$slug}";

		// Thumbnail (slimg meta or featured image)
		$thumb_url = get_post_meta( $post_id, 'slimg', true );
		if ( empty( $thumb_url ) && has_post_thumbnail( $post_id ) ) {
			$thumb_url = get_the_post_thumbnail_url( $post_id, 'full' );
		}

		$thumbnail = [
			'src' => ! empty( $thumb_url ) ? esc_url_raw( $thumb_url ) : null,
			'alt' => $game_name,
		];

		// Themes (sl-theme)
		$themes = [];
		$theme_terms = get_the_terms( $post_id, 'sl-theme' );
		if ( ! empty( $theme_terms ) && ! is_wp_error( $theme_terms ) ) {
			foreach ( $theme_terms as $term ) {
				$themes[] = [
					'id'   => (int) $term->term_id,
					'name' => $term->name,
					'slug' => $term->slug,
				];
			}
		}

		// Type (sl-type)
		$type_data = null;
		$type_terms = get_the_terms( $post_id, 'sl-type' );
		if ( ! empty( $type_terms ) && ! is_wp_error( $type_terms ) ) {
			$term = reset( $type_terms );
			$type_data = [
				'id'   => (int) $term->term_id,
				'name' => $term->name,
				'slug' => $term->slug,
			];
		}

		// Filters (sl-filter)
		$filters = [];
		$filter_terms = get_the_terms( $post_id, 'sl-filter' );
		if ( ! empty( $filter_terms ) && ! is_wp_error( $filter_terms ) ) {
			foreach ( $filter_terms as $term ) {
				$filters[] = [
					'id'   => (int) $term->term_id,
					'name' => $term->name,
					'slug' => $term->slug,
				];
			}
		}

		// Game Attributes (slot_attrs)
		$attrs = get_post_meta( $post_id, 'slot_attrs', true );
		if ( ! is_array( $attrs ) ) {
			$attrs = maybe_unserialize( $attrs );
			if ( ! is_array( $attrs ) ) {
				$attrs = [];
			}
		}

		$rtp          = isset( $attrs['rtp'] ) ? sanitize_text_field( $attrs['rtp'] ) : null;
		$volatility   = isset( $attrs['volatility'] ) ? sanitize_text_field( $attrs['volatility'] ) : null;
		$release_date = isset( $attrs['release'] ) ? sanitize_text_field( $attrs['release'] ) : null;

		$embed_url = '';
		if ( class_exists( '\SlotsLaunch_Client' ) ) {
			$embed_url = \SlotsLaunch_Client::generateUrl( $post_id );
		} else {
			$raw_url = get_post_meta( $post_id, 'slot_url', true );
			if ( ! empty( $raw_url ) ) {
				$embed_url = str_replace( 'http:', 'https:', $raw_url );
			}
		}

		return [
			'id'            => (int) $post_id,
			'externalId'    => $external_id,
			'name'          => $game_name,
			'slug'          => $slug,
			'canonicalPath' => $canonical_path,
			'thumbnail'     => $thumbnail,
			'provider'      => $provider_data,
			'themes'        => $themes,
			'type'          => $type_data,
			'filters'       => $filters,
			'releaseDate'   => $release_date,
			'description'   => $description,
			'rtp'           => $rtp,
			'volatility'    => $volatility,
			'featured'      => false,
			'upcoming'      => $upcoming,
			'modifiedAt'    => $post->post_modified_gmt ? $post->post_modified_gmt : $post->post_date_gmt,
			'embedUrl'      => $embed_url,
		];
	}
}
