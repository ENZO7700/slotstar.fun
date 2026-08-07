<?php


/**
 *
 */
class SlotsLaunch_Ajax {

	public function __construct() {
		add_action('wp_ajax_sl_get_slots', [$this, 'get_slots']);
		add_action('wp_ajax_nopriv_sl_get_slots', [$this, 'get_slots']);
		add_action('wp_ajax_sl_get_providers', [$this, 'get_providers']);
		add_action('wp_ajax_nopriv_sl_get_providers', [$this, 'get_providers']);
		add_action('wp_ajax_reinstall_all_slots', [$this, 'reinstall_slots']);
		add_action('wp_ajax_slotsl_save_rating', [$this, 'save_rating']);
		add_action('wp_ajax_nopriv_slotsl_save_rating', [$this, 'save_rating'] );
		add_action('wp_ajax_slotsl_load_single', [ $this, 'load_single_game' ] );
		add_action('wp_ajax_nopriv_slotsl_load_single', [ $this, 'load_single_game' ] );
		add_action('wp_ajax_slotsl_game_url', [ $this, 'game_url' ] );
		add_action('wp_ajax_nopriv_slotsl_game_url', [ $this, 'game_url' ] );
	}

	function reinstall_slots(){
		slotsl_clear_slots();
		update_option('sl_admin_id',get_current_user_id() );
		SlotsLaunch_Importer::install_schedule();
		SlotsLaunch_Importer::$_in_progress_notices[] = __( 'Initial Games & Providers installation has started. We will let you know once it finish.', 'slotslaunch' );

		wp_send_json_success( 'Import started, once it finish you will see a notice in your dashboard' );

	}
	function get_slots() {
		$slots = Slotslaunch_Slots::slots($_GET);
		$response = [];
		if ( $slots->have_posts() ) {
			$response = $this->map($slots->posts);
		}
		wp_reset_postdata();
		wp_send_json_success( [ 'slots' => $response, 'page' => absint( $_GET['sl-page'] ?? 1 ), 'found' => $slots->found_posts, 'total' => count($response) ] );
	}

	function get_providers() {
		$providers = Slotslaunch_Slots::providers($_GET);
		$response = [];
		if ( !empty( $providers['providers'] ) ) {
			$response = $this->mapProviders($providers['providers']);
		}

		wp_send_json_success( [ 'providers' => $response, 'total' => $providers['total'] ]);
	}

	private function map( array $posts ) {
		$lobby_url = slotsl_setting( 'lobby-url', site_url() );
		$mapped = [];
		if( $posts ) {
			foreach ($posts as $p ) {
				if( slotsl_setting('enable-banner', 0 ) ) {
					$number = slotsl_setting('banner-number', 20 );
					if ( empty( $i ) ) {
						$i = 0;
					}
					$i++;
					if( $i == $number ) {
						$mapped[] = [
							'id'    => 0,
							'title'  => slotsl_setting('banner-text', 20 ),
							'url'   => '',
							'img' => '',
							'provider_url' => '',
							'provider_name' => '',
						];
						$i = 0;
					}
				}
				$img = slotsl_img_url($p->ID);
				if ( ! $img ) {
					$img = SLOTSL_PLUGIN_URL . 'public/img/no-image-available.png';
				}
				$terms = get_the_terms($p->ID, 'sl-provider' );
				$mapped[] = [
					'id'    => $p->ID,
					'title'  => slotsl_game_link( [ 'game_id' => $p->ID ], $p->post_title ),
					'url'   => slotsl_game_link( [ 'game_id' => $p->ID, 'class' => 'slotsl-thumb-url' ], slotsl_setting( 'demo-btn', __( 'Try Demo', 'slotslaunch' ) ) ),
					'img' => slotsl_game_link( [ 'game_id' => $p->ID ], '<img src="'. $img .'" alt="'. $p->post_title .'"/>' ),
					'provider_url' => apply_filters( 'slotsl/provider_url', $lobby_url . '?sl-provider='. $terms[0]->slug, $terms[0] ),
					'provider_name' => $terms[0]->name,
				];
			}
		}
		return $mapped;
	}
	private function mapProviders( array $providers ) {
		$mapped = [];

		foreach ($providers as $p ) {
			$img = provider_img_url($p->term_id);
			if ( ! $img ) {
				$img = SLOTSL_PLUGIN_URL . 'public/img/no-image-available.png';
			}
			$mapped[] = [
				'id'    => $p->term_id,
				'title'  => $p->name,
				'url'   => '?sl-provider='. $p->slug,
				'img' => $img,
				'count' => $p->count,
			];
		}

		return $mapped;
	}

	public function save_rating() {

		$rating = isset($_POST['rating']) ? array_map( 'sanitize_text_field',$_POST['rating']) : [];

		$rating['date'] = current_time( 'mysql' );

		update_post_meta( absint( $_POST['slot_id'] ), 'slotsl_rating', $rating );

		wp_send_json_success( $rating );
	}


	public function load_single_game() {

		$sid = $_GET['sid'];
		define('DOING_SLOTSLAUNCH_AJAX', true);

		if( empty( $sid ) || ! is_numeric( $sid ) || ! ( $post = get_post($sid) ) ) {
			wp_send_json_error(__( 'Slot not found', 'slotslaunch') );
		}

		wp_send_json_success( Slotslaunch_Public::embed_game(['post' => $post, 'slot_id' => $sid]) );

	}

	public function game_url() {
		$sid = $_GET['sid'];
		define('DOING_SLOTSLAUNCH_AJAX', true);

		if( empty( $sid ) || ! is_numeric( $sid ) || ! ( $post = get_post($sid) ) ) {
			wp_send_json_error(__( 'Slot not found', 'slotslaunch') );
		}
		$url = SlotsLaunch_Client::generateUrl( $sid );
		$response = [ 'url' => $url ];

		if ( slotsl_setting( 'enable-popup', 0 ) ) {
			$game              = $post;
			$play_for_real_url = slotsl_setting( 'play-for-real', false );
			$play_for_real_url = apply_filters( 'slotsl/play_for_real_url', $play_for_real_url, $game );
			$play_for_real     = '';
			if ( $play_for_real_url ) {
				$play_for_real = apply_filters(
					'slotsl/play_for_real_url_button',
					'<a class="slaunch-button sl-bounce sl-button-solid sl-play-for-real" href="' . esc_attr( $play_for_real_url ) . '" rel="nofollow noindex" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
</svg>' . slotsl_setting( 'play-for-real-text', __( 'Play for Real', 'slotslaunch' ) ) . '</a>',
					$play_for_real_url
				);
			}
			ob_start();
			include SLOTSL_PARTIALS . 'single/slotsl-popup.php';
			$response['popup_html'] = ob_get_clean();
		}

		wp_send_json_success( $response );
	}
}
new SlotsLaunch_Ajax();