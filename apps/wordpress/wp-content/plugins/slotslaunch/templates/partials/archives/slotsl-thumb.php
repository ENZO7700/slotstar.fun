<div class="slotsl-thumb">
		<?php
		$img = slotsl_img_url();
		if ( ! $img ) {
			$img = SLOTSL_PLUGIN_URL . 'public/img/no-image-available.png';
		}
		$img = '<img src="' . $img . '" alt="' . strip_tags(get_the_title()) . '"/>';
		echo slotsl_game_link( [ 'game_id' => $game->ID ], $img  );
		?>
	
	<?php
	if ( ! isset($atts['show_button'] )  || 'false' !== $atts['show_button'] ) {
		?>
		<div class="slotsl-demo-container">
			<div class="slotsl-demo-wrapper">
				<?php echo slotsl_game_link( [ 'game_id' => $game->ID, 'class' => 'slotsl-thumb-url' ], slotsl_meta( $game->ID, 'slpublish' ) == '1' ? slotsl_setting( 'demo-btn', __( 'Try Demo', 'slotslaunch' ) ) : slotsl_setting( 'upcoming-btn', __( 'Coming Soon', 'slotslaunch' ) ) ); ?>
			</div>
		</div>
		<?php
	}
	?>
</div>