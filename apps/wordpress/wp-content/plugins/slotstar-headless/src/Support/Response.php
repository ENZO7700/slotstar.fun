<?php

namespace SlotStar\Headless\Support;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Response {

	public static function success( $data, ?array $pagination = null, int $status = 200 ): \WP_REST_Response {
		$body = [
			'data' => $data,
		];

		if ( null !== $pagination ) {
			$body['pagination'] = $pagination;
		}

		return new \WP_REST_Response( $body, $status );
	}

	public static function error( string $code, string $message, int $status = 400 ): \WP_REST_Response {
		return new \WP_REST_Response( [
			'error' => [
				'code'    => $code,
				'message' => $message,
			],
		], $status );
	}
}
