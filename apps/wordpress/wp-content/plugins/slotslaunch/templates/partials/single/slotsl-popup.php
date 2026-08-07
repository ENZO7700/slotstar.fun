<div class="sl-popup" data-trigger="<?php echo slotsl_setting( 'popup-seconds', 30 ); ?>"
     style="display: none;">
	<div class="sl-close-popup"></div>
	<?php echo stripslashes(
		str_replace(
			[ '[slot-name]', '[slot-image]', '[play-for-real]' ],
			[ strip_tags($game->post_title), slotsl_img_url( $game->ID ), $play_for_real ],
			slotsl_setting( 'popup-content', slotsl_default_single_popup_text() )
		)
	); ?>
</div>