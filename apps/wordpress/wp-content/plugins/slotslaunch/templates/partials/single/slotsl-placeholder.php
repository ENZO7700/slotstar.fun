<div class="sl-placeholder">
	<?php
	$poweredby           = '<img src="' . SLOTSL_PLUGIN_URL . 'public/img/powered-by.webp' . '" alt="Powered by Slots Launch" class="sl-powered"/>';
	$play_for_free_class = '';
	$play_for_real       = '';
	if ( $play_for_real_url ) {
		$play_for_real = apply_filters( 'slotsl/play_for_real_url_button', '<a class="slaunch-button sl-bounce sl-button-solid sl-play-for-real" href="' . esc_attr( $play_for_real_url ) . '" rel="nofollow noindex" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
</svg>' . slotsl_setting( 'play-for-real-text', __( 'Play for Real', 'slotslaunch' ) ) . '</a>', $play_for_real_url );
	} else {
		$play_for_free_class = 'sl-bounce sl-button-solid';
	}
	$play_for_free = apply_filters( 'slotsl/play_for_free_url_button', '<button class="slaunch-button slaunch-game ' . esc_attr( $play_for_free_class ) . '"><svg xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
</svg>
' . slotsl_setting( 'play-for-free-text', __( 'Play for Free', 'slotslaunch' ) ) . '</button>', $play_for_free_class );
$coming_soon = apply_filters( 'slotsl/coming_soon_button', '<button class="slaunch-button sl-coming-soon" ' . esc_attr( $play_for_free_class ) . '">
  ' . slotsl_setting( 'upcoming-btn', __( 'Coming Soon', 'slotslaunch' ) ) . '</button>', $play_for_free_class );
  
	echo stripslashes(
		str_replace(
			[ '[slot-name]', '[slot-image]', '[play-for-real]', '[play-for-free]', '[powered-by-img]' ],
			[ strip_tags($game->post_title), slotsl_img_url( $game->ID ), $play_for_real, slotsl_meta( $game->ID, 'slpublish' ) == '1' ? $play_for_free : $coming_soon, $poweredby ],
			slotsl_setting( 'launch-game', slotsl_default_single_slot_text() )
		)
	); ?>
</div>