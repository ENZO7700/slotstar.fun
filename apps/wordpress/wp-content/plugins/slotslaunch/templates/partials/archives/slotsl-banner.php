<div class="slotsl-banner">
	<a href="<?php echo  apply_filters('slotsl/play_for_real_url', slotsl_setting('play-for-real'), $game );?>" class="slaunch-button sl-bounce sl-button-solid sl-play-for-real" rel="nofollow noindex"><svg xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
			<path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
		</svg><?php echo slotsl_setting( 'play-for-real-text', __( 'Play for Real', 'slotslaunch' ) );?></a>
	<div class="slotsl-meta">
		<p class="slotsl-title">
			<?php echo slotsl_setting('banner-text', 20 );?>
		</p>
	</div>
</div>