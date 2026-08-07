<div class="slotls-header">
	<?php if( slotsl_setting( 'display-broken', true ) ) : ?>
	<a class="sl-broken-link" href="#report-broken-game"
	   title="<?php _e( 'Report an issue with this game', 'slotslaunch' ); ?>">
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
		     stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round"
			      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
		</svg>
	</a>
	<?php endif; ?>
	<a class="sl-fullscreen"
	   href="#" title="<?php _e( 'Go Full Screen', 'slotslaunch' ); ?>">
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
		     stroke="currentColor" class="w-24 h-24">
			<path stroke-linecap="round" stroke-linejoin="round"
			      d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"/>
		</svg>
	</a>
	<div class="sl-banner-container">
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
	<?php if( slotsl_setting( 'display-ratings', true ) ) : ?>
	<div class="sl-rating-container">
		<span class="sl-rating_text"><?php _e( 'Rate Game', 'slotslaunch' ); ?></span>
		<div class="sl-rating_stars"></div>
		<span class="sl-rating_votes"
		      data-votes="<?php echo $rating->total;?>"
		      data-rating="<?php echo $rating->rating;?>"
		      data-gid="<?php echo slotsl_id( $game->ID ); ?>"
		      data-slotid="<?php echo esc_attr($game->ID);?>">(<span><?php echo $rating->total;?></span> <?php _e( 'Votes', 'slotslaunch' ); ?>)</span>
	</div>
	<?php endif; ?>
</div>
