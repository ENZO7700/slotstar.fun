<?php

namespace SlotStar\Headless\Support;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Validation {

	public static function sanitize_page( $val ): int {
		$page = (int) $val;
		return $page > 0 ? $page : 1;
	}

	public static function sanitize_per_page( $val, int $default = 24, int $max = 48 ): int {
		$per_page = (int) $val;
		if ( $per_page <= 0 ) {
			return $default;
		}
		return min( $per_page, $max );
	}

	public static function sanitize_order( $val ): string {
		$val = strtolower( trim( (string) $val ) );
		return in_array( $val, [ 'asc', 'desc' ], true ) ? $val : 'desc';
	}

	public static function sanitize_order_by( $val ): string {
		$val = strtolower( trim( (string) $val ) );
		$allowed = [
			'name'     => 'title',
			'title'    => 'title',
			'date'     => 'date',
			'modified' => 'modified',
		];
		return $allowed[ $val ] ?? 'date';
	}

	public static function sanitize_slug( $val ): string {
		return sanitize_title( (string) $val );
	}

	public static function sanitize_search( $val ): string {
		return sanitize_text_field( (string) $val );
	}
}
