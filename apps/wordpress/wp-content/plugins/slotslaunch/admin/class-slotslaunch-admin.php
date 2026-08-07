<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://slotslaunch.com
 * @since      1.0.0
 *
 * @package    Slotslaunch
 * @subpackage Slotslaunch/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Slotslaunch
 * @subpackage Slotslaunch/admin
 * @author     Damian Logghe <newgames@slotslaunch.com>
 */
class Slotslaunch_Admin {

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 */
	public function __construct(  ) {
		global $pagenow;
		add_action( 'admin_menu', [ $this, 'add_settings_menu' ], 8 );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts'] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_styles'] );
		add_action( 'wp_ajax_slots_check_license', [ $this, 'ajax_check_license' ], 1 );
		add_action( 'wp_ajax_slots_save_import', [ $this, 'save_import_providers' ], 1 );

		add_filter( 'manage_slotsl_posts_columns', [ $this, 'set_custom_cpt_columns' ] );
		add_action( 'manage_slotsl_posts_custom_column', [ $this, 'custom_columns' ], 10, 2 );
		add_filter( 'manage_edit-slotsl_sortable_columns', [ $this, 'my_set_sortable_columns'] );
		add_action( 'restrict_manage_posts',  [ $this, 'filter_posts_by_taxonomy' ] );
		add_action( 'pre_get_posts', [ $this, 'filter_posts_by_upcoming' ] );

		if ( is_admin() && 'edit.php' == $pagenow && isset($_GET['post_type']) && 'slotsl' == $_GET['post_type'] ) {
			// set query to sort
			add_action( 'posts_clauses', [ $this, 'my_sort_custom_column_query' ], 10, 2 );
		}
	}

	/**
	 * Add menu for Settings page of the plugin
	 * @return  void
	 */
	public function add_settings_menu() {

		add_menu_page( 'Slots Launch', 'Slots Launch', apply_filters( 'slotsl/settings_page_role', 'manage_options' ), 'slotsl-settings', [
			$this,
			'settings_page',
		], 'dashicons-admin-site' );

		add_submenu_page( 'slotsl-settings', 'Settings', 'Settings', apply_filters( 'slotsl/settings_page_role', 'manage_options' ), 'slotsl-settings', [
			$this,
			'settings_page',
		] );
		add_submenu_page( 'slotsl-settings', 'Themes', 'Themes', apply_filters( 'slotsl/settings_page_role', 'manage_options' ), 'edit-tags.php?taxonomy=sl-theme&post_type=slotsl',  );
		add_submenu_page( 'slotsl-settings', 'Types', 'Types', apply_filters( 'slotsl/settings_page_role', 'manage_options' ), 'edit-tags.php?taxonomy=sl-type&post_type=slotsl',  );

	}

	/**
	 * Settings page for plugin
	 * @since 1.0.0
	 */
	public function settings_page() {
		do_action( 'slotsl_admin_page' );
	}



	/**
	 * Ajax callback for check license button
	 */
	public function ajax_check_license() {
		if ( empty( $_POST['license'] ) ) {
			echo json_encode( [ 'error' => 'Please enter the license' ] );
			die();
		}
		$license  = esc_attr( $_POST['license'] );
		$response = SlotsLaunch_License::is_valid_license( $license );
		$res = json_decode($response);
		$opts            = slotsl_settings();
		$opts['license'] = $license;

		$opts['type'] = isset( $res->plan ) && 'Free' == $res->plan ? 'free' : 'premium';
		// cancel schedule to refresh
		if( function_exists('as_unschedule_action') ) {
			as_unschedule_action( 'sl_daily_import', [], '' );
		}

		update_option( 'slotsl_settings', $opts );
		echo $response; // send result to javascript
		die();
	}

	/**
	 * Ajax callback that will save the providers the user want to import from
	 * @return void
	 */
	public function save_import_providers() {
		$providers = ! empty( $_POST['providers'] ) ? $_POST['providers'] : 'all';

		$opts            = slotsl_settings();
		$opts['import_providers'] = $providers;

		update_option( 'slotsl_settings', $opts );
		wp_send_json_success('Starting slots import');
		die();
	}
	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {
		if( isset( $_GET['page'] ) && 'slotsl-settings' == $_GET['page'] ) {
			wp_enqueue_style( 'slotsl-admin-css', plugin_dir_url( __FILE__ ) . 'css/slotslaunch-admin.css', [], SLOTSLAUNCH_VERSION );
			wp_enqueue_style( 'slotsl-color', plugin_dir_url( __FILE__ ) . 'css/spectrum.min.css', [], SLOTSLAUNCH_VERSION );
			wp_enqueue_style( 'slotsl-choices', plugin_dir_url( __FILE__ ) . 'css/choices.min.css', [], SLOTSLAUNCH_VERSION );
		}

	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		if( isset( $_GET['page'] ) &&( 'slotsl-settings' == $_GET['page'] || 'slotsl-setup' == $_GET['page'] ) ) {
			wp_enqueue_script( 'jquery-ui-sortable' );
			wp_enqueue_script( 'slotsl-admin', plugin_dir_url( __FILE__ ) . 'js/slotslaunch-admin.js', [ 'jquery', 'jquery-ui-sortable' ], SLOTSLAUNCH_VERSION, true );
			wp_enqueue_script( 'slotsl-color', plugin_dir_url( __FILE__ ) . 'js/spectrum.min.js', [ 'jquery','slotsl-admin' ], SLOTSLAUNCH_VERSION, true );
			wp_enqueue_script( 'slotsl-choices', plugin_dir_url( __FILE__ ) . 'js/choices.min.js', [ 'jquery','slotsl-admin' ], SLOTSLAUNCH_VERSION, true );
		}

		wp_localize_script( 'slotsl-admin', 'slotsl', [
			'ajax_url' => admin_url( 'admin-ajax.php' ),
		] );

	}
	/**
	 * Add callbacks for custom colums
	 *
	 * @param array $column [description]
	 * @param int $post_id [description]
	 *
	 * @return echo html
	 * @since  1.2
	 */
	function custom_columns( $column, $post_id ) {

		switch ( $column ) {

			case 'sl_release_date':
				$slot_attrs = get_post_meta( $post_id, 'slot_attrs', true );
				$release    = is_array( $slot_attrs ) && ! empty( $slot_attrs['release'] ) ? $slot_attrs['release'] : '';
				if ( $release && strtotime( $release ) ) {
					echo esc_html( date_i18n( get_option( 'date_format' ), strtotime( $release ) ) );
				} else {
					echo '—';
				}
				break;

			case 'sl_upcoming':
				$upcoming = get_post_meta( $post_id, 'slupcoming', true );
				if ( '1' === $upcoming ) {
					echo '<span style="color:#d63638;">' . esc_html__( 'Upcoming', 'slotslaunch' ) . '</span>';
				} else {
					echo esc_html__( 'Live', 'slotslaunch' );
				}
				break;

			case 'sl_shortcode' :
				echo '[slotsl-game slot_id="'.$post_id.'"]';
				break;
		}
	}


	function my_set_sortable_columns( $columns ) {
		$columns['taxonomy-sl-provider'] = 'sl-provider';
		$columns['taxonomy-sl-theme']    = 'sl-theme';
		$columns['taxonomy-sl-type']    = 'sl-type';
		$columns['sl_upcoming']         = 'slupcoming';
		return $columns;
	}

	function my_sort_custom_column_query( $clauses, $wp_query ) {
		global $wpdb;

		if ( isset( $wp_query->query['orderby'] ) &&
		     ( 'sl-provider' == $wp_query->query['orderby'] ||
		       'sl-theme' == $wp_query->query['orderby'] ||
		       'sl-type' == $wp_query->query['orderby'] )
		) {
			$tax = $wp_query->query['orderby'];
			$clauses['join'] .= "
LEFT OUTER JOIN {$wpdb->term_relationships} ON {$wpdb->posts}.ID={$wpdb->term_relationships}.object_id
LEFT OUTER JOIN {$wpdb->term_taxonomy} USING (term_taxonomy_id)
LEFT OUTER JOIN {$wpdb->terms} USING (term_id)";

			$clauses['where']  .= " AND (taxonomy = '{$tax}' OR taxonomy IS NULL)";
			$clauses['groupby'] = "object_id";
			$clauses['orderby']  = "GROUP_CONCAT({$wpdb->terms}.name ORDER BY name ASC) ";
			$clauses['orderby'] .= ( 'ASC' == strtoupper( $wp_query->get( 'order' ) ) ) ? 'ASC' : 'DESC';
		}

		if ( isset( $wp_query->query['orderby'] ) && 'slupcoming' == $wp_query->query['orderby'] ) {
			$clauses['join'] .= " LEFT JOIN {$wpdb->postmeta} AS slupcoming_meta ON {$wpdb->posts}.ID = slupcoming_meta.post_id AND slupcoming_meta.meta_key = 'slupcoming'";
			$clauses['orderby'] = "CAST(slupcoming_meta.meta_value AS UNSIGNED) " . ( 'ASC' == strtoupper( $wp_query->get( 'order' ) ) ? 'ASC' : 'DESC' ) . ", {$wpdb->posts}.ID ASC";
		}

		return $clauses;
	}


	/**
	 * Add custom columns to cpt
	 *
	 * @param [type] $columns [description]
	 *
	 * @return mixed
	 * @since  1.2
	 */
	public function set_custom_cpt_columns( $columns ) {
		$new_column = [];
		unset( $columns['author'] );
		unset( $columns['comments'] );

		foreach ( $columns as $key => $value ) {
			if ( $key == 'date' ) {
				$new_column['sl_release_date'] = __( 'Release date', 'slotslaunch' );
				$new_column['sl_upcoming']     = __( 'Upcoming', 'slotslaunch' );
				$new_column['sl_shortcode']   = __( 'Embed slot', 'slotslaunch' );
			}
			$new_column[ $key ] = $value;
		}

		return $new_column;
	}

	/**
	 * Let's users filter by taxonmies
	 * @return void
	 */
	public function filter_posts_by_taxonomy() {
		global $typenow;

		if ( $typenow == 'slotsl' ) {
			$current = isset( $_GET['sl_upcoming_filter'] ) ? sanitize_text_field( $_GET['sl_upcoming_filter'] ) : '';
			echo '<select name="sl_upcoming_filter" id="sl_upcoming_filter" class="postform">';
			echo '<option value="">' . esc_html__( 'All games', 'slotslaunch' ) . '</option>';
			echo '<option value="1"' . selected( '1', $current, false ) . '>' . esc_html__( 'Upcoming only', 'slotslaunch' ) . '</option>';
			echo '<option value="0"' . selected( '0', $current, false ) . '>' . esc_html__( 'Not upcoming', 'slotslaunch' ) . '</option>';
			echo '</select>';

			$terms = get_terms( 'sl-provider' );
			$this->printFilterDropdown( $terms, 'sl-provider', __( 'All Providers', 'slotslaunch' ) );
			$terms = get_terms( 'sl-theme' );
			$this->printFilterDropdown( $terms, 'sl-theme', __( 'All Themes', 'slotslaunch' ) );
			$terms = get_terms( 'sl-type' );
			$this->printFilterDropdown( $terms, 'sl-type', __( 'All Types', 'slotslaunch' ) );
		}
	}

	/**
	 * Filter the slotsl list by upcoming status when sl_upcoming_filter is set.
	 *
	 * @param WP_Query $query The main query.
	 * @return void
	 */
	public function filter_posts_by_upcoming( $query ) {
		global $pagenow, $typenow;

		if ( 'edit.php' !== $pagenow || 'slotsl' !== $typenow || ! $query->is_main_query() ) {
			return;
		}

		$filter = isset( $_GET['sl_upcoming_filter'] ) ? sanitize_text_field( $_GET['sl_upcoming_filter'] ) : '';
		if ( '' === $filter ) {
			return;
		}

		if ( '1' === $filter ) {
			$query->set( 'meta_key', 'slupcoming' );
			$query->set( 'meta_value', '1' );
			$query->set( 'meta_compare', '=' );
			return;
		}

		if ( '0' === $filter ) {
			$query->set( 'meta_query', [
				'relation' => 'OR',
				[
					'key'     => 'slupcoming',
					'value'   => '0',
					'compare' => '=',
				],
				[
					'key'     => 'slupcoming',
					'compare' => 'NOT EXISTS',
				],
			] );
		}
	}

	/**
	 * @param WP_Error|array|int $terms
	 * @param $taxonomy
	 * @param $all
	 *
	 * @return void
	 */
	private function printFilterDropdown( $terms, $taxonomy, $all ) {
		if ( !empty( $terms ) ) {
			echo '<select name="' . $taxonomy . '" id="' . $taxonomy . '" class="postform">';
			echo '<option value="">' . $all . '</option>';

			foreach ($terms as $term) {
				$selected = isset($_GET[$taxonomy]) && $_GET[$taxonomy] == $term->slug ? ' selected="selected"' : '';
				echo '<option value="' . $term->slug . '"' . $selected . '>' . $term->name . '</option>';
			}

			echo '</select>';
		}
	}
}
