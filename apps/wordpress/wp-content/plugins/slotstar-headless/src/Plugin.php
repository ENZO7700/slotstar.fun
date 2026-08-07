<?php

namespace SlotStar\Headless;

use SlotStar\Headless\Cache\Cache;
use SlotStar\Headless\Rest\GamesController;
use SlotStar\Headless\Rest\HealthController;
use SlotStar\Headless\Rest\ProvidersController;
use SlotStar\Headless\Rest\TaxonomiesController;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Plugin {

	private const REST_NAMESPACE = 'slotstar/v1';
	private static ?self $instance = null;

	public static function get_instance(): self {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		Cache::init();
		add_action( 'rest_api_init', [ $this, 'register_rest_routes' ] );
	}

	public function register_rest_routes(): void {
		( new HealthController() )->register_routes( self::REST_NAMESPACE );
		( new GamesController() )->register_routes( self::REST_NAMESPACE );
		( new ProvidersController() )->register_routes( self::REST_NAMESPACE );
		( new TaxonomiesController() )->register_routes( self::REST_NAMESPACE );
	}
}
