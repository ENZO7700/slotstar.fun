<div class="sl-banner-container sl-mobile-banner">
	<div class="sl-banner-text">
		<?php
		if ( slotsl_setting( 'enable-scrolling-banner', 0 ) ) {
			echo stripslashes(
				str_replace(
					[ '[slot-name]', '[play-for-real-url]' ],
					[ $game->post_title, $play_for_real_url ],
					slotsl_setting( 'scrolling-banner-content', slotsl_default_banner_text() )
				)
			);
		}
		?>
	</div>
</div>