<?php
/**
 * Netflix-style Lobby Template
 */

// Get lobby settings
$sections_order = slotsl_setting( 'lobby-sections-order', 'editors-pick,seasonal,newest,most-played,top-rated,trending,licensed,gold-medal,upcoming-games' );
$sections_order = explode( ',', $sections_order );
$lobby_url = slotsl_setting( 'lobby-url', site_url() );

// Close any existing containers and start full-width wrapper
?>
<div class="slotsl-lobby-wrapper">
<?php

// Define all available sections
$available_sections = [
	'editors-pick' => [
		'enabled' => slotsl_setting( 'lobby-section-editors-pick', '1' ),
		'title' => __( 'Editor\'s Pick', 'slotslaunch' ),
		'type' => 'editors-pick',
	],
	'seasonal' => [
		'enabled' => slotsl_setting( 'lobby-section-seasonal', '1' ),
		'title' => '', // Will be set dynamically based on theme
		'type' => 'seasonal',
	],
	'newest' => [
		'enabled' => slotsl_setting( 'lobby-section-newest', '1' ),
		'title' => __( 'Newest Games', 'slotslaunch' ),
		'type' => 'newest',
	],
	'most-played' => [
		'enabled' => slotsl_setting( 'lobby-section-most-played', '1' ),
		'title' => __( 'Most Played', 'slotslaunch' ),
		'type' => 'most-played',
	],
	'top-rated' => [
		'enabled' => slotsl_setting( 'lobby-section-top-rated', '1' ),
		'title' => __( 'Top Rated', 'slotslaunch' ),
		'type' => 'top-rated',
	],
	'trending' => [
		'enabled' => slotsl_setting( 'lobby-section-trending', '1' ),
		'title' => __( 'Trending Games', 'slotslaunch' ),
		'type' => 'trending',
	],
	'licensed' => [
		'enabled' => slotsl_setting( 'lobby-section-licensed', '1' ),
		'title' => __( 'Licensed Games', 'slotslaunch' ),
		'type' => 'licensed',
	],
	'gold-medal' => [
		'enabled' => slotsl_setting( 'lobby-section-gold-medal', '1' ),
		'title' => __( 'Gold Medal Games', 'slotslaunch' ),
		'type' => 'gold-medal',
	],
	'upcoming-games' => [
		'enabled' => slotsl_setting( 'lobby-section-upcoming-games', '1' ),
		'title' => __( 'Upcoming Games', 'slotslaunch' ),
		'type' => 'upcoming-games',
	],
];

/**
 * Allow developers to add custom lobby sections
 * 
 * @param array $available_sections Array of available sections
 * @return array Modified sections array
 * 
 * @example
 * // Example 1: Using slot IDs
 * add_filter( 'slotsl_lobby_sections', function( $sections ) {
 *     $sections['my-custom-section'] = [
 *         'enabled' => slotsl_setting( 'lobby-section-my-custom', '1' ),
 *         'title' => __( 'My Custom Section', 'textdomain' ),
 *         'type' => 'custom',
 *         'slot_ids' => [123, 456, 789], // Specific slot IDs
 *         'per_page' => 16, // Optional
 *         'see_all_url' => 'https://example.com/custom-slots', // Optional
 *     ];
 *     return $sections;
 * } );
 * 
 * // Example 2: Using query arguments
 * add_filter( 'slotsl_lobby_sections', function( $sections ) {
 *     $sections['netent-slots'] = [
 *         'enabled' => slotsl_setting( 'lobby-section-netent', '1' ),
 *         'title' => __( 'NetEnt Slots', 'textdomain' ),
 *         'type' => 'custom',
 *         'query_args' => [
 *             'provider' => 'netent',
 *             'per_page' => 16,
 *         ],
 *     ];
 *     return $sections;
 * } );
 * 
 * // Example 3: Using a callback function
 * add_filter( 'slotsl_lobby_sections', function( $sections ) {
 *     $sections['custom-query'] = [
 *         'enabled' => slotsl_setting( 'lobby-section-custom-query', '1' ),
 *         'title' => __( 'Custom Query Section', 'textdomain' ),
 *         'type' => 'custom',
 *         'callback' => 'my_custom_section_query', // Must return WP_Query or array with 'slots' key
 *     ];
 *     return $sections;
 * } );
 * 
 * function my_custom_section_query( $section_key, $section_config ) {
 *     // Return WP_Query object
 *     return Slotslaunch_Slots::slots( [ 'provider' => 'netent', 'per_page' => 16 ] );
 *     
 *     // OR return array with slots and optional see_all_url
 *     // return [
 *     //     'slots' => Slotslaunch_Slots::slots( [ 'provider' => 'netent' ] ),
 *     //     'see_all_url' => 'https://example.com/netent',
 *     //     'title' => 'Custom Title', // Optional: override title
 *     // ];
 * }
 * 
 * // Also add the section label for admin sortable list
 * add_filter( 'slotsl_lobby_section_labels', function( $labels ) {
 *     $labels['my-custom-section'] = __( 'My Custom Section', 'textdomain' );
 *     return $labels;
 * } );
 * 
 * // Add admin setting for enabling/disabling the custom section
 * add_filter( 'slotsl_lobby_settings', function( $settings ) {
 *     $settings['lobby-section-my-custom'] = [
 *         'id'      => 'lobby-section-my-custom',
 *         'name'    => esc_html__( 'My Custom Section', 'textdomain' ),
 *         'desc'    => esc_html__( 'Enable My Custom section', 'textdomain' ),
 *         'type'    => 'select',
 *         'default' => '1',
 *         'options' => ['0' => 'Disabled', '1' => 'Enabled'],
 *     ];
 *     return $settings;
 * } );
 */
$available_sections = apply_filters( 'slotsl_lobby_sections', $available_sections );

// Merge saved order with any sections that exist in available_sections but are missing (e.g. after plugin update)
$sections_order = array_map( 'trim', $sections_order );
$all_available_keys = array_keys( $available_sections );
$missing_sections = array_diff( $all_available_keys, $sections_order );
if ( ! empty( $missing_sections ) ) {
	$sections_order = array_merge( $sections_order, array_values( $missing_sections ) );
}

// Filter and order sections based on settings
$active_sections = [];
foreach ( $sections_order as $section_key ) {
	$section_key = trim( $section_key );
	if ( isset( $available_sections[ $section_key ] ) && $available_sections[ $section_key ]['enabled'] === '1' ) {
		$active_sections[ $section_key ] = $available_sections[ $section_key ];
	}
}

?>
<div class="slotsl-lobby">
	<?php foreach ( $active_sections as $section_key => $section_config ): ?>
		<?php
		$section_type = $section_config['type'];
		$section_title = $section_config['title'];
		$slots = null;
		$see_all_url = '';
		
		// Query slots based on section type
		switch ( $section_type ) {
			case 'editors-pick':
				// Get featured games
				$featured_args = [
					'filters' => [ 'featured' ],
					'per_page' => 16,
				];
				$featured_slots = Slotslaunch_Slots::slots( $featured_args );
				$featured_ids = [];
				if ( $featured_slots->have_posts() ) {
					while ( $featured_slots->have_posts() ) {
						$featured_slots->the_post();
						$featured_ids[] = get_the_ID();
					}
					wp_reset_postdata();
				}
				
				// Get manually selected games
				$manual_ids = slotsl_setting( 'lobby-editors-pick-ids', '' );
				if ( ! empty( $manual_ids ) ) {
					$manual_ids = array_map( 'trim', explode( ',', $manual_ids ) );
					$manual_ids = array_map( 'absint', $manual_ids );
					$featured_ids = array_merge( $featured_ids, $manual_ids );
					$featured_ids = array_unique( $featured_ids );
				}
				
				if ( ! empty( $featured_ids ) ) {
					$slots = Slotslaunch_Slots::slots( [
						'slots' => $featured_ids,
						'per_page' => 16,
					] );
				}
				$see_all_url = $lobby_url . '?sl-filter[]=featured';
				break;
				
			case 'seasonal':
				$seasonal_theme = slotsl_setting( 'lobby-seasonal-theme', 'christmas' );
				// Format theme name for display (e.g., "christmas" -> "Christmas", "st-patricks" -> "St Patricks")
				if ( ! empty( $seasonal_theme ) ) {
					$theme_parts = explode( '-', $seasonal_theme );
					$theme_parts = array_map( 'ucfirst', $theme_parts );
					$theme_display = implode( ' ', $theme_parts );
					$section_title = $theme_display . ' ' . __( 'Slots', 'slotslaunch' );
				} else {
					$section_title = __( 'Seasonal Slots', 'slotslaunch' );
				}
				$slots = Slotslaunch_Slots::slots( [
					'theme' => $seasonal_theme,
					'per_page' => 16,
				] );
				$see_all_url = $lobby_url . '?sl-theme=' . esc_attr( $seasonal_theme );
				break;
				
			case 'newest':
				$slots = Slotslaunch_Slots::slots( [
					'per_page' => 16,
					'orderby' => 'date',
					'order' => 'desc',
				] );
				$see_all_url = $lobby_url . '?sl-sort=new';
				break;
				
			case 'most-played':
				$original_sort = $_GET['sl-sort'] ?? null;
				$_GET['sl-sort'] = 'most_played';
				$slots = Slotslaunch_Slots::slots( [
					'per_page' => 16,
				] );
				if ( $original_sort !== null ) {
					$_GET['sl-sort'] = $original_sort;
				} else {
					unset( $_GET['sl-sort'] );
				}
				$see_all_url = $lobby_url . '?sl-sort=most_played';
				break;
				
			case 'top-rated':
				$original_sort = $_GET['sl-sort'] ?? null;
				$_GET['sl-sort'] = 'highest_rated';
				$slots = Slotslaunch_Slots::slots( [
					'per_page' => 16,
				] );
				if ( $original_sort !== null ) {
					$_GET['sl-sort'] = $original_sort;
				} else {
					unset( $_GET['sl-sort'] );
				}
				$see_all_url = $lobby_url . '?sl-sort=highest_rated';
				break;
				
			case 'trending':
				$original_sort = $_GET['sl-sort'] ?? null;
				$_GET['sl-sort'] = 'trending';
				$slots = Slotslaunch_Slots::slots( [
					'per_page' => 16,
				] );
				if ( $original_sort !== null ) {
					$_GET['sl-sort'] = $original_sort;
				} else {
					unset( $_GET['sl-sort'] );
				}
				$see_all_url = $lobby_url . '?sl-sort=trending';
				break;
				
			case 'licensed':
				$slots = Slotslaunch_Slots::slots( [
					'theme' => 'licensed',
					'per_page' => 16,
				] );
				$see_all_url = $lobby_url . '?sl-theme=licensed';
				break;
				
			case 'gold-medal':
				$original_sort = $_GET['sl-sort'] ?? null;
				$_GET['sl-sort'] = 'gold';
				$slots = Slotslaunch_Slots::slots( [
					'per_page' => 16,
				] );
				if ( $original_sort !== null ) {
					$_GET['sl-sort'] = $original_sort;
				} else {
					unset( $_GET['sl-sort'] );
				}
				$see_all_url = $lobby_url . '?sl-sort=gold';
				break;

			case 'upcoming-games':
				$slots = Slotslaunch_Slots::slots( [
					'upcoming' => 'true',
					'per_page' => 16,
					'orderby'  => 'date',
					'order'    => 'asc',
				] );
				$see_all_url = $lobby_url . '?upcoming=true';
				break;

			default:
				// Handle custom sections
				$custom_section = $section_config;
				
				// Check if custom section has a callback function
				if ( ! empty( $custom_section['callback'] ) && is_callable( $custom_section['callback'] ) ) {
					$result = call_user_func( $custom_section['callback'], $section_key, $custom_section );
					if ( is_array( $result ) ) {
						$slots = isset( $result['slots'] ) ? $result['slots'] : null;
						$see_all_url = isset( $result['see_all_url'] ) ? $result['see_all_url'] : '';
						if ( isset( $result['title'] ) ) {
							$section_title = $result['title'];
						}
					} elseif ( $result instanceof WP_Query ) {
						$slots = $result;
					}
				}
				// Check if custom section has slot IDs
				elseif ( ! empty( $custom_section['slot_ids'] ) ) {
					$slot_ids = is_array( $custom_section['slot_ids'] ) 
						? $custom_section['slot_ids'] 
						: array_map( 'trim', explode( ',', $custom_section['slot_ids'] ) );
					$slot_ids = array_map( 'absint', $slot_ids );
					
					$slots = Slotslaunch_Slots::slots( [
						'slots' => $slot_ids,
						'per_page' => isset( $custom_section['per_page'] ) ? absint( $custom_section['per_page'] ) : 16,
					] );
					
					// Build "See All" URL with slot IDs if not provided
					if ( empty( $custom_section['see_all_url'] ) ) {
						$see_all_url = $lobby_url . '?sl-slots=' . implode( ',', $slot_ids );
					} else {
						$see_all_url = $custom_section['see_all_url'];
					}
				}
				// Check if custom section has query arguments
				elseif ( ! empty( $custom_section['query_args'] ) && is_array( $custom_section['query_args'] ) ) {
					$query_args = wp_parse_args( $custom_section['query_args'], [
						'per_page' => 16,
					] );
					$slots = Slotslaunch_Slots::slots( $query_args );
					
					// Build "See All" URL from query args if not provided
					if ( empty( $custom_section['see_all_url'] ) ) {
						$see_all_url = $lobby_url . '?' . http_build_query( $query_args );
					} else {
						$see_all_url = $custom_section['see_all_url'];
					}
				}
				// Allow filtering the query for custom sections
				else {
					/**
					 * Filter custom section query
					 * 
					 * @param WP_Query|null $slots Query result (null if not handled)
					 * @param string $section_key Section key/ID
					 * @param array $section_config Section configuration
					 * @return WP_Query|null
					 */
					$slots = apply_filters( 'slotsl_lobby_section_query_' . $section_key, null, $section_key, $custom_section );
					
					/**
					 * Filter custom section "See All" URL
					 * 
					 * @param string $see_all_url URL for "See All" link
					 * @param string $section_key Section key/ID
					 * @param array $section_config Section configuration
					 * @return string
					 */
					$see_all_url = apply_filters( 'slotsl_lobby_section_see_all_url_' . $section_key, '', $section_key, $custom_section );
					
					// If still no URL provided, use default
					if ( empty( $see_all_url ) && ! empty( $custom_section['see_all_url'] ) ) {
						$see_all_url = $custom_section['see_all_url'];
					}
				}
				
				// Use custom "See All" URL if provided
				if ( ! empty( $custom_section['see_all_url'] ) ) {
					$see_all_url = $custom_section['see_all_url'];
				}
				break;
		}
		
		if ( ! $slots || ! $slots->have_posts() ) {
			continue;
		}
		?>
		<div class="slotsl-lobby-section" data-section="<?php echo esc_attr( $section_key ); ?>">
			<div class="slotsl-lobby-section-header">
				<h2 class="slotsl-lobby-section-title"><?php echo esc_html( $section_title ); ?></h2>
				<?php if ( ! empty( $see_all_url ) ): ?>
					<a href="<?php echo esc_url( $see_all_url ); ?>" class="slotsl-lobby-see-all">
						<?php _e( 'See All', 'slotslaunch' ); ?> →
					</a>
				<?php endif; ?>
			</div>
			<div class="slotsl-lobby-slider">
				<button class="slotsl-lobby-arrow slotsl-lobby-arrow-left" aria-label="<?php esc_attr_e( 'Previous', 'slotslaunch' ); ?>">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<polyline points="15 18 9 12 15 6"></polyline>
					</svg>
				</button>
				<div class="slotsl-lobby-slider-container">
					<div class="slotsl-lobby-slider-track">
						<?php
						global $post;
						$default_atts = [ 'show_button' => 'true', 'provider_link' => 'true' ];
						while ( $slots->have_posts() ) {
							$slots->the_post();
							$game = get_post();
							$atts = $default_atts; // Make sure $atts is available for partials
							?>
							<div class="slotsl-lobby-item">
								<div class="slotsl-game">
									<?php 
									include SLOTSL_PARTIALS . 'archives/slotsl-thumb.php'; 
									include SLOTSL_PARTIALS . 'archives/slotsl-meta.php'; 
									?>
								</div>
							</div>
							<?php
						}
						wp_reset_postdata();
						?>
					</div>
				</div>
				<button class="slotsl-lobby-arrow slotsl-lobby-arrow-right" aria-label="<?php esc_attr_e( 'Next', 'slotslaunch' ); ?>">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<polyline points="9 18 15 12 9 6"></polyline>
					</svg>
				</button>
			</div>
		</div>
	<?php endforeach; ?>
</div>
</div><!-- .slotsl-lobby-wrapper -->

