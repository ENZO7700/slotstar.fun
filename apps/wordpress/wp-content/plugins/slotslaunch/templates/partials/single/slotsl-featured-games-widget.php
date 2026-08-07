<?php
$featured_ids = slotsl_setting( 'featured-widget-ids', false );
$args         = [ 'filters' => [ 'featured' ], 'per_page' => 3, 'orderby'        => 'rand'];
if ( ! empty( $featured_ids ) ) {
	$args['slots'] = $featured_ids;
	unset( $args['filters'] );
}
$featured = Slotslaunch_Slots::slots( $args );
$featured_count = $featured->post_count;

// If fewer than 3 posts are returned, fetch additional posts without the 'featured' filter
if ($featured_count < 3) {
	$additional_args = [
		'per_page' => 3 - $featured_count,
		'exclude'  => wp_list_pluck($featured->posts, 'ID') // Exclude already fetched posts
	];
	$additional_posts = Slotslaunch_Slots::slots($additional_args);

	// Merge the original featured posts with the additional posts
	$featured->posts = array_merge($featured->posts, $additional_posts->posts);
	$featured->post_count += $additional_posts->post_count;
}
if ( $featured->have_posts() ) {
	?>
	<div class="sl-featured-widget sl-basis-3/12">
	<div class="sl-featured-widget-container">
		<div class="sl-featured-title">
			<?php _e( 'Try Our Featured Games', 'slotslaunch' ); ?>
		</div>
		<div class="sl-widget-games">
			<?php
			$original_game = $game;
			while ( $featured->have_posts() ) {
				$featured->the_post();
				$game = get_post();
				?>
				<div class="slotsl-game">
				<?php include SLOTSL_PARTIALS . 'archives/slotsl-thumb.php'; ?>
				</div><?php
			}
			?>
		</div>
	</div>
	</div><?php
	$game = $original_game;
	wp_reset_postdata();
}