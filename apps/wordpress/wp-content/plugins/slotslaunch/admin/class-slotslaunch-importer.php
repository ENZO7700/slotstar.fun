<?php

class SlotsLaunch_Importer {

	public static array $_notices = [];
	public static array $_in_progress_notices = [];

	public function __construct(){

		add_action( 'init', [ $this, 'schedule_daily_import' ] );
		add_action( 'sl_daily_import', [ $this, 'daily_import' ] );

		if( isset( $_GET['daily_test'])) {
			$this->daily_import();
		}

		add_action( 'admin_init', [ $this, 'install_actions' ] );
		add_action( 'sl_success', [ $this, 'add_notices' ], 10, 2 );
		add_action( 'shutdown', [ $this, 'save_notices' ] );
		add_action( 'admin_notices', [ $this, 'display_notices' ]);
		add_action( 'sl_install_games', [ $this, 'sl_install_games_callback' ], 10, 2 );
		add_action( 'sl_cl_status', [ $this, 'sl_cl_status_callback' ] );
	}

	/**
	 * Install actions when a update button is clicked within the admin area.
	 * This function is hooked into admin_init to affect admin only.
	 */
	public function install_actions() {
		if ( ! empty( $_GET['slotsl_import'] ) ) {

			check_admin_referer( 'slotsl_import', 'slotsl_import_nonce' );

			update_option('sl_admin_id',get_current_user_id() );
			self::install_schedule();
			self::$_in_progress_notices[] = __( 'Initial Games & Providers installation has started. We will let you know once it finish.', 'slotslaunch' );
			update_option( 'slots_install', true );
		}
		// delete all and start from scracth
		if ( ! empty( $_GET['slotsl_reset_db'] ) ) {
			slotsl_clear_slots();
			update_option('sl_admin_id',get_current_user_id() );
			self::install_schedule();
			self::$_in_progress_notices[] = __( 'Initial Games & Providers installation has started. We will let you know once it finish.', 'slotslaunch' );
		}
		// update all games
		if ( ! empty( $_GET['slotsl_refresh_db'] ) ) {
			update_option('sl_force_update', true);
			SlotsLaunch_Importer::update_schedule();
			SlotsLaunch_Importer::$_in_progress_notices[] = __( 'Games are being update. We will let you know once it finish.', 'slotslaunch' );

		}
	}

	/**
	 * Will run every day to check for new games
	 * @return void
	 */
	public function schedule_daily_import() {
		if ( false === as_has_scheduled_action( 'sl_daily_import' ) && apply_filters( 'slotslaunch_schedule_daily_import', true ) ) {
			$random_minutes = ( MINUTE_IN_SECONDS * rand( 1, 500 ) );
			as_schedule_recurring_action( strtotime( 'tomorrow' ) + $random_minutes, DAY_IN_SECONDS + $random_minutes, 'sl_daily_import', [], '', true );
		}
	}

	/**
	 * Daily update games
	 * @return void
	 */
	public function daily_import() {
		$this->schedule_single_action('sl_install_games', ['install_callback' => 'update_themes']);
		$this->schedule_single_action('sl_cl_status', []);
	}



	/**
	 * Install Games
	 * @return void
	 */
	public static function install_schedule() {
		// flush rewrite rules on installation
		flush_rewrite_rules();
		$install_callbacks = [
			'install_providers',
		];
		$loop_time = 0;
		foreach( $install_callbacks as $ic ) {

			as_schedule_single_action(
				time() + $loop_time,
				'sl_install_games',
				[ 'install_callback' => $ic ],
				'slots-install'
			);

			$loop_time++;
		}

	}

	/**
	 * Update games when for example providers only changes
	 * @return void
	 */
	public static function update_schedule() {

		as_schedule_single_action(
			time() ,
			'sl_install_games',
			[ 'install_callback' => 'update_games' ],
			'slots-install'
		);
	}

	/**
	 * Hook callback that will run needed actions
	 *
	 * @param $install_callback
	 * @param int $page
	 *
	 * @return void
	 */
	public function sl_install_games_callback( $install_callback, int $page = 1) {

			if ( is_callable( [$this, $install_callback ] ) ) {
				$result = call_user_func( [ $this, $install_callback ], $page );
				$this->run_update_callback_end( $install_callback, $result );
			}
	}

	/**
	 * Triggered when a callback has ran to check if needs to run again
	 *
	 * @param string $callback Callback name.
	 * @param array   $result Return value from callback. True : it is ok, False : run again.
	 *
	 *@since 3.6.0
	 */
	private function run_update_callback_end( string $callback, array $result ) {

		switch( $result['status'] ) {

			case 'repeat' :
				$this->schedule_single_action('sl_install_games', ['install_callback' => $callback, 'page' => $result['page'] ?? 1], 'slots-install');
				break;
			// mainly for debugging we shouldn't get much errors
			case 'error' :
				$this->log_error($result['msg']);
				break;
			case 'success' :
				delete_option( 'sl_importer_in_progress_notices');
				$this->schedule_single_action('sl_success', ['callback' => $callback], 'slots-notices');
				break;
		}
	}

	/**
	 * Initial Providers Install
	 *
	 * @param int $page
	 *
	 * @return array|string[]
	 */
	public function install_providers( int $page = 1 ) {

		$args = [ 'page' => $page, 'per_page' => 50 ];

		$providers_id           = $this->install_only_providers();
		if( $providers_id !== false ) {
			$args['provider'] = $providers_id;
		}

		// install categories
		$providers = SlotsLaunch_Client::get( 'providers', $args );

		$providers_results = $this->insert_providers( $providers, $page );

		if ( $this->needs_repeat_or_error($providers_results) ) {
			return $providers_results;
		}

		// if we installed all providers, it's time to install themes
		$this->schedule_single_action('sl_install_games', [ 'install_callback' => 'install_themes' ], 'slots-install');

		return [ 'status' => 'success' ];
	}


	/**
	 * Initial Themes Install
	 *
	 * @param int $page
	 *
	 * @return array|string[]
	 */
	public function install_themes( int $page = 1 ) {

		$args = [
				'page'     => $page,
				'per_page' => 50,
				'parent'   => 0
		];

		// install categories
		$themes = SlotsLaunch_Client::get( 'themes', $args );

		$themes_results = $this->insert_themes( $themes, $page );

		if ( $this->needs_repeat_or_error($themes_results) ) {
			return $themes_results;
		}
		$this->schedule_single_action('sl_install_games', [ 'install_callback' => 'install_child_themes' ], 'slots-install');

		return [ 'status' => 'success' ];
	}
	/**
	 * Initial Themes Install
	 *
	 * @param int $page
	 *
	 * @return array|string[]
	 */
	public function install_child_themes( int $page = 1 ) {

		$args = [
			'page'     => $page,
			'per_page' => 50,
			'parent'   => -1
		];

		// install categories
		$themes = SlotsLaunch_Client::get( 'themes', $args );

		$themes = $this->update_for_existing_terms( $themes, 'parent_id', 'sl-theme' );

		$themes_results = $this->insert_themes( $themes, $page );

		if ( $this->needs_repeat_or_error($themes_results) ) {
			return $themes_results;
		}
		$this->schedule_single_action('sl_install_games', [ 'install_callback' => 'install_types' ], 'slots-install');

		return [ 'status' => 'success' ];
	}
	/**
	 * Initial Types Install
	 *
	 * @param int $page
	 *
	 * @return array|string[]
	 */
	public function install_types( int $page = 1 ) {

		$args = [ 'page' => $page, 'per_page' => 50 ];

		// install categories
		$types = SlotsLaunch_Client::get( 'types', $args );

		$types_results = $this->insert_types( $types, $page );

		if ( $this->needs_repeat_or_error($types_results) ) {
			return $types_results;
		}

		$this->schedule_single_action('sl_install_games', [ 'install_callback' => 'install_games' ], 'slots-install');

		return [ 'status' => 'success' ];
	}
	/**
	 * Update themes
	 *
	 * @param int $page
	 *
	 * @return array|string[]
	 */
	public function update_themes( int $page = 1 ) {
		$args = [
			'page' => $page,
			'per_page' => 50,
			'updated_at' =>  date("Y-m-d", strtotime("2 days ago") ),
			'order'      => 'desc',
			'order_by'   => 'updated_at',
			'parent'     => '0'
		];
		if( get_option('sl_force_update') ) {
			unset($args['updated_at']);
		}

		// install categories
		$themes = SlotsLaunch_Client::get( 'themes', $args );

		$themes = $this->update_for_existing_terms( $themes, 'id', 'sl-theme' );

		$themes_results = $this->insert_themes( $themes, $page );

		if ( $this->needs_repeat_or_error($themes_results) ) {
			return $themes_results;
		}

		$this->schedule_single_action('sl_install_games', [ 'install_callback' => 'update_child_themes' ], 'slots-install');

		return [ 'status' => 'success' ];
	}
	/**
	 * Update themes
	 *
	 * @param int $page
	 *
	 * @return array|string[]
	 */
	public function update_child_themes( int $page = 1 ) {
		$args = [
			'page' => $page,
			'per_page' => 50,
			'updated_at' =>  date("Y-m-d", strtotime("2 days ago") ),
			'order'      => 'desc',
			'order_by'   => 'updated_at',
			'parent'     => '-1'
		];
		if( get_option('sl_force_update') ) {
			unset($args['updated_at']);
		}

		$themes = SlotsLaunch_Client::get( 'themes', $args );

		$themes = $this->update_for_existing_terms( $themes, 'id', 'sl-theme' );

		$themes = $this->update_for_existing_terms( $themes, 'parent_id', 'sl-theme' );

		$themes_results = $this->insert_themes( $themes, $page );

		if ( $this->needs_repeat_or_error($themes_results) ) {
			return $themes_results;
		}

		$this->schedule_single_action('sl_install_games', [ 'install_callback' => 'update_types' ], 'slots-install');

		return [ 'status' => 'success' ];
	}
	/**
	 * Update Types
	 *
	 * @param int $page
	 *
	 * @return array|string[]
	 */
	public function update_types( int $page = 1 ) {
		$args = [
			'page' => $page,
			'per_page' => 50,
			'updated_at' =>  date("Y-m-d", strtotime("2 days ago") ),
			'order'      => 'desc',
			'order_by'   => 'updated_at'
		];

		if( get_option('sl_force_update') ) {
			unset($args['updated_at']);
		}

		$types = SlotsLaunch_Client::get( 'types', $args );

		$types = $this->update_for_existing_terms( $types, 'id', 'sl-type' );

		$types_results = $this->insert_types( $types, $page );

		if ( $this->needs_repeat_or_error($types_results) ) {
			return $types_results;
		}

		$this->schedule_single_action('sl_install_games', [ 'install_callback' => 'update_providers' ], 'slots-install');

		return [ 'status' => 'success' ];
	}
	/**
	 * Update providers
	 *
	 * @param int $page
	 *
	 * @return array|string[]
	 */
	public function update_providers( int $page = 1 ) {
		$args = [
				'page' => $page,
				'per_page' => 50,
				'updated_at' =>  date("Y-m-d", strtotime("2 days ago") ),
				'order'      => 'desc',
				'order_by'   => 'updated_at'
			];

		if( get_option('sl_force_update') ) {
			unset($args['updated_at']);
		}
		$providers_id           = $this->install_only_providers();
		if( $providers_id !== false ) {
			$args['provider'] = $providers_id;
		}

		$providers = SlotsLaunch_Client::get( 'providers', $args );

		$providers = $this->update_for_existing_terms( $providers, 'id', 'sl-provider' );

		$providers_results = $this->insert_providers( $providers, $page );
		if ( $this->needs_repeat_or_error($providers_results) ) {
			return $providers_results;
		}

		$this->schedule_single_action('sl_install_games', [ 'install_callback' => 'update_games' ], 'slots-install');

		return [ 'status' => 'success' ];
	}

	/**
	 * Initial game installation that runs after providers are installed
	 *
	 * @param int $page
	 *
	 * @return array|string[]
	 */
	public function install_games( int $page = 1 ){
		/* Disable wprocket when installing games */
		add_filter( 'do_rocket_generate_caching_files', '__return_false' );
		add_filter( 'rocket_generate_advanced_cache_file', '__return_false' );
		add_filter( 'rocket_disable_htaccess', '__return_false' );
		add_filter( 'pre_get_rocket_option_sitemap_preload', '__return_zero' );
		add_filter( 'pre_get_rocket_option_sitemap_preload_url_crawl', '__return_zero' );
		add_filter( 'pre_get_rocket_option_sitemaps', '__return_zero' );
		add_filter( 'pre_get_rocket_option_manual_preload', '__return_zero' );
		// install games
		$args = [
				'page' => $page,
				'per_page' => 20
				];

		$providers_id           = $this->install_only_providers();
		if( $providers_id !== false ) {
			$args['provider'] = $providers_id;
		}
		$games = SlotsLaunch_Client::get( 'games', $args );
		return $this->insert_games( $games, $page );
	}

	/**
	 * Function that will update or insert new games daily
	 * @param $page
	 *
	 * @return string[]
	 */
	public function update_games( $page = 1 ){

		$args = [
			'page' => $page,
			'per_page' => 20,
			'updated_at' =>  date("Y-m-d", strtotime("2 days ago")  ),
			'order'      => 'desc',
			'order_by'   => 'updated_at'
		];

		if( get_option('sl_force_update') ) {
			unset($args['updated_at']);
		}
		$providers_id           = $this->install_only_providers();
		if( $providers_id !== false ) {
			$args['provider'] = $providers_id;
		}
		// install games
		$games = SlotsLaunch_Client::get( 'games', $args );
		// check if games exists so we can update them
		if ( ! empty( $games->data ) ) {
			$ids = wp_list_pluck( $games->data, 'id' );

			$args = [
				'post_type'      => 'slotsl',
				'posts_per_page' => -1,
				'post_status'    => 'any',
				'meta_query'     => [
					[
						'key' => 'slpid',
						'value' => $ids,
						'compare' => 'IN',
					]
				],
			];
			$query = new WP_Query($args);

			if( !empty( $query->posts ) ) {
				foreach ( $query->posts as $post ) {
					foreach ($games->data as $i => $g ) {
						$source_id = slotsl_id( $post->ID );
						if( $g->id == $source_id ) {
							$games->data[$i]->update = $post->ID;
						}
					}
				}
			}
		}
		return $this->insert_games( $games, $page );
	}

	/**
	 * @param $providers
	 * @param int $page
	 *
	 * @return array
	 */
	private function insert_providers ( $providers, int $page ): array {
		try{
			if( !empty( $providers->data ) ) {
				foreach ( $providers->data as $p ) {
					if( ! empty( $p->update ) ) {
						$term_id = wp_update_term(
							$p->update,   // the term
							'sl-provider', // the taxonomy
							[
								'name'        => $p->name,
								'slug'        => $p->slug,
							]
						);
					} else {
						$term_id = wp_insert_term(
							$p->name,   // the term
							'sl-provider', // the taxonomy
							[
								'description' => $p->name . ' Slots' ,
								'slug'        => $p->slug,
							]
						);
					}
					if( is_wp_error( $term_id ) ) {
						$term = get_term_by('slug', $p->slug, 'sl-provider');
						if( ! empty( $term ) && ! is_wp_error( $term ) ) {
							update_metadata( 'term', $term->term_id, 'sl_pid', $p->id );
							wp_update_term( $term->term_id, 'sl-provider', ['name' => $p->name ]);
							$term_id =  $term->term_id;
						} else {
							return [ 'status' => 'error', 'msg' => $term_id->get_error_message() . ' - ' . $p->name ];
						}
					}
					$term_id = is_array( $term_id ) ? $term_id['term_id'] : $term_id;

					if ( is_numeric( $term_id ) ) {
						if ( ! empty( $p->markets ) ) {
							update_metadata( 'term', $term_id, 'sl_markets', $p->markets );
						}
						update_metadata( 'term', $term_id, 'sl_pid', $p->id );
						update_metadata( 'term', $term_id, 'sl_img', $p->thumb );
					}
				}
				if( $providers->meta->to !== $providers->meta->total ){
					return [ 'status' => 'repeat' , 'page' => $page + 1 ];
				}
			}
		} catch (Exception $exception) {
			return [ 'status' => 'error', 'msg' => $exception->getMessage() ];
		}

		return [ 'status' => 'success' ];
	}

	/**
	 * Code to insert or update terms
	 * @param $terms
	 * @param $taxonomy
	 * @param $page
	 *
	 * @return array|string[]|void
	 */
	private function insert_term( $terms , $taxonomy ,$page ) {
		try{
			if( !empty( $terms->data ) ) {
				foreach ($terms->data as $t) {
					if( ! empty( $t->update ) ) {
						wp_update_term(
							$t->update,   // the term
							$taxonomy, // the taxonomy
							[
								'name'        => $t->name,
								'slug'        => $t->slug,
								'parent'      => $t->parent ?? 0 ,
							]
						);
					} else {
						$term_id = wp_insert_term(
							$t->name,   // the term
							$taxonomy, // the taxonomy
							[
								'slug'        => $t->slug,
								'parent'      => $t->parent ?? 0
							]
						);
						// If gives error for some reason, update the term, probably was inserted by the game
						if( is_wp_error( $term_id ) ) {
							$term = get_term_by('slug', $t->slug, $taxonomy);
							if( !empty( $term ) && ! is_wp_error( $term ) ) {
								update_metadata( 'term', $term->term_id, 'sl_pid', $t->id );
								wp_update_term( $term->term_id, $taxonomy, ['name' => $t->name,'parent'      => $t->parent ?? 0 ]);
							} else {
								return [
									'status' => 'error',
									'msg'    => $term_id->get_error_message() . ' - ' . $t->name
								];
							}
						} else {
							$term_id = is_array( $term_id ) ? $term_id['term_id'] : $term_id;

							if ( is_numeric( $term_id ) ) {
								update_metadata( 'term', $term_id, 'sl_pid', $t->id );
							}
						}
					}

				}
				if( $terms->meta->to !== $terms->meta->total ){
					return [ 'status' => 'repeat' , 'page' => $page + 1 ];
				}
			}
		} catch (Exception $exception) {
			return [ 'status' => 'error', 'msg' => $exception->getMessage() ];
		}

		return [ 'status' => 'success' ];

	}

	/**
	 * @param $themes
	 * @param int $page
	 *
	 * @return array
	 */
	private function insert_themes ( $themes, int $page ): array {
		return $this->insert_term( $themes, 'sl-theme', $page);
	}

	/**
	 * @param $types
	 * @param int $page
	 *
	 * @return array
	 */
	private function insert_types ( $types, int $page ): array {
		return $this->insert_term( $types, 'sl-type', $page);
	}
	/**
	 * @param $games
	 * @param $page
	 *
	 * @return array|string[]
	 */
	private function insert_games( $games, $page ): array {
		try {
			if ( !empty( $games->error ) ) {
				return [ 'status' => 'error', 'msg' => $games->error ];
			}
			wp_defer_term_counting( true );
			wp_defer_comment_counting( true );
			kses_remove_filters();
			$author = get_option('sl_admin_id');
			if ( !empty( $games->data ) ) {
				foreach ( $games->data as $g ) {
					$gmts = date('Y-m-d H:i:s', strtotime($g->created_at));
					$slot_attrs = [
						'release'                => $g->release ?? '',
						'reels'                  => $g->reels ?? '',
						'payline'                => $g->payline ?? '',
						'rtp'                    => $g->rtp ?? '',
						'volatility'             => $g->volatility ?? '',
						'currencies'             => $g->currencies ?? '',
						'languages'              => $g->languages ?? '',
						'land_based'             => $g->land_based ?? '',
						'markets'                => $g->markets ?? '',
						'progressive'            => $g->progressive ?? '',
						'cluster_slot'           => $g->cluster_slot ?? '',
						'scatter_pays'           => $g->scatter_pays ?? '',
						'max_exposure'           => $g->max_exposure ?? '',
						'min_bet'                => $g->min_bet ?? '',
						'max_bet'                => $g->max_bet ?? '',
						'max_win_per_spin'       => $g->max_win_per_spin ?? '',
						'bonus_buy'              => $g->bonus_buy ?? '',
						'autoplay'               => $g->autoplay ?? '',
						'quickspin'              => $g->quickspin ?? '',
						'tumbling_reels'         => $g->tumbling_reels ?? '',
						'increasing_multipliers' => $g->increasing_multipliers ?? '',
						'orientation'            => $g->orientation ?? '',
						'restrictions'           => $g->restrictions ?? '',
					];
					$my_post = [
						'post_title'    => $g->name,
						'post_content'  => '[slotsl-game]',
						'post_status'   => 'publish',
						'post_date_gmt' => $gmts,
						'post_date'     => get_gmt_from_date($gmts),
						'post_excerpt'  => $g->name,
						'post_type'     => 'slotsl',
						'post_author'   => $author,
						'meta_input'    => [
							'slot_url' 	 => $g->url,
							'slpid'    	 => $g->id,
							'slpublish'  => $g->published,
							'slupcoming'  => $g->upcoming,
							'slimg'      => $g->thumb,
							'slot_attrs' => $slot_attrs,
						]
					];
					// if this is a post update we just update meta
					if( ! empty( $g->update ) ) {
						$pid = $g->update;

						// Previous status values to detect upcoming -> published transition.
						$prev_published = get_post_meta( $pid, 'slpublish', true );
						$prev_upcoming  = get_post_meta( $pid, 'slupcoming', true );

						update_post_meta( $g->update, 'slot_url', $g->url);
						update_post_meta( $g->update, 'slpublish', $g->published);
						update_post_meta( $g->update, 'slupcoming', $g->upcoming);
						update_post_meta( $g->update, 'slimg', $g->thumb);
						update_post_meta( $g->update, 'slot_attrs', $slot_attrs);

						$update_args = [
							'ID'         => $pid,
							'post_title' => $g->name,
							'post_name'  => $g->slug,
						];

						// If game moves from upcoming (1) and not published (0) to published (1) and not upcoming (0),
						// bump post date so it appears as recently added.
						if (
							(string) $prev_published === '0'
							&& (string) $prev_upcoming === '1'
							&& (string) $g->published === '1'
							&& (string) $g->upcoming === '0'
						) {
							$update_args['post_date']     = current_time( 'mysql' );
							$update_args['post_date_gmt'] = current_time( 'mysql', 1 );
							$update_args['edit_date']     = true;
							
						}

						// update the post title, slug and maybe date.
						wp_update_post( $update_args );
					} else {
						$pid = wp_insert_post( apply_filters('slotsl/posts_args', $my_post ) );
					}
					if( is_wp_error( $pid ) ) {
						return [ 'status' => 'error', 'msg' => $pid->get_error_message() ];
					}

					if ( is_numeric( $pid ) ) {
						if( ! empty( $g->provider_slug ) ) {
							wp_set_object_terms( $pid, [ $g->provider_slug ], 'sl-provider' );
						}
						if( ! empty( $g->themes ) ) {
							$tslugs = [];
							foreach ($g->themes as $theme) {
								$tslugs[] = $theme->slug;
							}
							wp_set_object_terms( $pid, $tslugs, 'sl-theme' , true );
						}
						if( ! empty( $g->type_slug ) ) {
							wp_set_object_terms( $pid, [ $g->type_slug ], 'sl-type', true );
						}

						if( ! empty( $g->megaways ) ) {
							wp_add_object_terms( $pid, [ 'megaways' ], 'sl-filter' );
						}
						if( ! empty( $g->bonus_buy ) ) {
							wp_add_object_terms( $pid, [ 'bonus_buy' ], 'sl-filter' );
						}
						if( ! empty( $g->progressive ) ) {
							wp_add_object_terms( $pid, [ 'progressive' ], 'sl-filter' );
						}
						// TODO: move this to remove all featured games on import
						@wp_remove_object_terms( $pid, 'featured', 'sl-filter' );
						if( ! empty( $g->featured ) ) {
							wp_add_object_terms( $pid, [ 'featured' ], 'sl-filter' );
						}
					}

					if ( ! empty( $g->thumb ) ) {
						//$this->set_featured_image( $g->thumb, $pid );
					}
				}
				kses_init_filters();
				wp_defer_term_counting( false );
				wp_defer_comment_counting( false );
				if ( $games->meta->to && $games->meta->total && $games->meta->to !== $games->meta->total ) {
					return [ 'status' => 'repeat', 'page' => $page + 1 ];
				}
			}
		} catch ( Exception $exception ) {
			return [ 'status' => 'error', 'msg' => $exception->getMessage() ];
			delete_option('sl_force_update');
		}

		delete_option('sl_force_update');
		return [ 'status' => 'success' ];
	}
	/**
	 * Download and set featured images per slot
	 * @param $image_url
	 * @param $post_id
	 *
	 * @return void
	 */
	private function set_featured_image( $image_url, $post_id  ){
		$upload_dir = wp_upload_dir();
		$image_data = file_get_contents($image_url);
		$filename = basename($image_url);
		if(wp_mkdir_p($upload_dir['path']))
			$file = $upload_dir['path'] . '/' . $filename;
		else
			$file = $upload_dir['basedir'] . '/' . $filename;
		file_put_contents($file, $image_data);

		$wp_filetype = wp_check_filetype($filename, null );
		$attachment = array(
			'post_mime_type' => $wp_filetype['type'],
			'post_title' => sanitize_file_name($filename),
			'post_content' => '',
			'post_status' => 'inherit'
		);
		$attach_id = wp_insert_attachment( $attachment, $file, $post_id );
		require_once(ABSPATH . 'wp-admin/includes/image.php');
		$attach_data = wp_generate_attachment_metadata( $attach_id, $file );
		wp_update_attachment_metadata( $attach_id, $attach_data );
		set_post_thumbnail( $post_id, $attach_id );
	}

	/**
	 * Show admin notices on settings completion
	 *
	 * @param $callback
	 *
	 * @return void
	 */
	public function add_notices( $callback ): void {
		if( 'install_games' == $callback ) {
			self::$_notices[] = sprintf( __( 'All games installed successfully! You can access all slots <a href="%s">here</a>.', 'slotslaunch' ),
			admin_url('edit.php?post_type=slotsl'));
		}
		if( 'install_providers' == $callback ) {
			self::$_notices[] = __( 'All providers installed successfully! ', 'slotslaunch' );
		}
	}

	public function display_notices(): void {
		$msgs = maybe_unserialize( get_option( 'sl_importer_notices', [] ) );
		$msgs = array_merge( maybe_unserialize( get_option( 'sl_importer_in_progress_notices', [] ) ), $msgs );
		if( empty( $msgs ) ){
			return;
		}
		?>
		<div class="notice notice-success is-dismissible">
			<h2>SlotsLaunch</h2>
			<?php foreach ( $msgs as $m ):?>
				<p><?php echo $m; ?></p>
			<?php endforeach;?>
		</div>
		<?php
		// Clear
		delete_option( 'sl_importer_notices' );
	}

	/**
	 * Save errors to an option
	 */
	public function save_notices() {
		if( ! empty( self::$_notices) ) {
			update_option( 'sl_importer_notices', self::$_notices );
		}
		if( ! empty( self::$_in_progress_notices) ) {
			update_option( 'sl_importer_in_progress_notices', self::$_in_progress_notices );
		}
	}

	public function sl_cl_status_callback() {
		$opts            = slotsl_settings();
		if( empty( $opts['license'] ) ) {
			return;
		}
		$response = SlotsLaunch_License::is_valid_license( $opts['license'] );
		$res = json_decode($response);

		$opts['type'] = isset( $res->plan ) && 'Free' == $res->plan ? 'free' : 'premium';
		// cancel schedule to refresh
		if( function_exists('as_unschedule_action') ) {
			as_unschedule_action( 'sl_daily_import', [], '' );
		}

		if( 'free' == $opts['type'] ) {
			$opts['launch-game'] = slotsl_default_single_slot_text();
			$opts['demo-btn'] = 'Try Demo';
			$opts['providers'] = Slotslaunch_Settings::providers();
			$opts['color'] = 'e23940';
		}

		update_option( 'slotsl_settings', $opts );
	}

	/**
	 * Check if result status is repeat or error.
	 */
	private function needs_repeat_or_error(array $result): bool {
		return isset($result['status']) && ($result['status'] === 'repeat' || $result['status'] === 'error');
	}

	/**
	 * Schedule a single action.
	 */
	private function schedule_single_action(string $hook, array $args, $group = 'slots-update') {
		as_schedule_single_action(time(), $hook, $args, $group );
	}


	/**
	 * Log an error message.
	 */
	private function log_error(string $message) {
		$errors = maybe_unserialize(get_option('slots_error', []));
		$errors[] = ['date' => date('Y-m-d H:i:s'), 'msg' => $message];
		if (count($errors) > 20) {
			array_shift($errors);
		}
		update_option('slots_error', $errors);
	}

	/**
	 * Adds parent Ids or Update Ids to existing terms
	 * @param $terms
	 * @param $field
	 * @param $taxonomy
	 *
	 * @return array|int|mixed|WP_Error
	 */
	private function update_for_existing_terms( $api_terms, $field, $taxonomy ) {
		if( !empty( $api_terms->data ) ) {
			// check if terms exists so we can update them
			$ids   = wp_list_pluck( $api_terms->data, $field );
			$args  = [
				'taxonomy'   => $taxonomy,
				'hide_empty' => false,
				'meta_key'   => 'sl_pid',
				'meta_value' => $ids
			];

			$terms = get_terms( $args );

			if( ! empty( $terms ) ) {
				foreach ( $terms as $term ) {
					if(isset($term->term_id)) {
						foreach ($api_terms->data as $i => $p ) {
							$source_id = get_term_meta( $term->term_id, 'sl_pid', true );
							if( $p->$field == $source_id ) {
								if( 'parent_id' == $field ) {
									$api_terms->data[ $i ]->parent = $term->term_id;
								} else {
									$api_terms->data[ $i ]->update = $term->term_id;
								}
							}
						}
					}
				}
			}
		}
		return $api_terms;
	}


	/**
	 * Check if user selected to install some providers or all
	 * @return false|mixed
	 */
	private function install_only_providers() {
		$opts            = slotsl_settings();
		if( empty( $opts['import_providers'] )
		    ||
		    // how is saved when javascript fails
		    ( isset($opts['import_providers'][0]) && 'all' == $opts['import_providers'][0] )
		    ||
		    // how is saved with selectize
		    'all' == $opts['import_providers']
		) {
			return false;
		}
		return $opts['import_providers'];
	}
}

new SlotsLaunch_Importer();
