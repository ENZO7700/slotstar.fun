<div class="slotsl-meta">
	<p class="slotsl-title">
		<?php echo slotsl_game_link( [ 'game_id' => $game->ID ], get_the_title() ); ?>
	</p>
	<?php
	$terms = get_the_terms( get_the_ID(), 'sl-provider' );
	if( 'false' !== $atts['provider_link'] ) {
		$lobby_url = slotsl_setting( 'lobby-url', site_url() );
		?>
		<a href="<?php echo apply_filters( 'slotsl/provider_url', $lobby_url .'?sl-provider='.$terms[0]->slug, $terms[0] ); ?>" class="slotsl-provider" rel="nofollow">
			<?php echo $terms[0]->name; ?>
		</a>
		<?php
	} else {
		echo '<span class="slotsl-provider">'.$terms[0]->name.'</span>';
	}
	?>
</div>