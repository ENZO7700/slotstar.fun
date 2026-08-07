<?php

namespace SlotStar\Headless\Cache;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Cache {

	private const PREFIX = 'slotstar_cache_';
	private const GROUP  = 'slotstar_headless';

	public static function init(): void {
		add_action( 'save_post_slotsl', [ __CLASS__, 'flush_games_cache' ] );
		add_action( 'deleted_post', [ __CLASS__, 'on_post_delete' ] );

		$taxonomies = [ 'sl-provider', 'sl-theme', 'sl-type', 'sl-filter' ];
		foreach ( $taxonomies as $tax ) {
			add_action( "created_{$tax}", [ __CLASS__, 'flush_taxonomies_cache' ] );
			add_action( "edited_{$tax}", [ __CLASS__, 'flush_taxonomies_cache' ] );
			add_action( "delete_{$tax}", [ __CLASS__, 'flush_taxonomies_cache' ] );
		}
	}

	public static function get( string $key ) {
		return wp_cache_get( self::PREFIX . $key, self::GROUP );
	}

	public static function set( string $key, $data, int $ttl = 300 ): bool {
		return wp_cache_set( self::PREFIX . $key, $data, self::GROUP, $ttl );
	}

	public static function flush_games_cache(): void {
		wp_cache_flush_group( self::GROUP );
	}

	public static function flush_taxonomies_cache(): void {
		wp_cache_flush_group( self::GROUP );
	}

	public static function on_post_delete( int $post_id ): void {
		if ( 'slotsl' === get_post_type( $post_id ) ) {
			self::flush_games_cache();
		}
	}
}
