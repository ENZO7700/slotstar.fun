<div class="slotsl-container">
	<?php

	$slots     = Slotslaunch_Slots::slots( $atts );
	$providers = Slotslaunch_Slots::providers( array_merge($atts, ['per_page' => 1000 ] ) );
	$types     = Slotslaunch_Slots::types( $atts );
	$themes    = Slotslaunch_Slots::themes( $atts );

	if(  ( 'false' !== $atts['show_header'] ) ||
	     ( 'false' === $atts['show_header'] && 'false' !== $atts['show_pagination'] )
	){
		include SLOTSL_PARTIALS . 'archives/slotsl-filters.php';
	}
	include SLOTSL_PARTIALS . 'archives/slotsl-loader.php';?>
	<div class="slotsl-grid"  data-atts="<?php echo esc_attr(json_encode($atts));?>"><?php
		// The Loop
		if ( $slots->have_posts() ) {
			while ( $slots->have_posts() ) {
				$slots->the_post();
				$game = get_post();
				if( ( slotsl_setting('enable-banner', 0 ) || ( isset($atts['cta_banner'] ) && 'true' == $atts['cta_banner'] ) )
					&& (  ! isset($atts['cta_banner'] ) ||  'false' !== $atts['cta_banner'] )
				) {
					$number = !empty($atts['cta_banner_number'] ) ? absint($atts['cta_banner_number']) : slotsl_setting('banner-number', 20 );
					if ( empty( $i ) ) {
						$i = 0;
					}
					$i++;
					if( $i == $number ) {
						?>
						<div class="slotsl-game">
							<?php include SLOTSL_PARTIALS . 'archives/slotsl-banner.php';?>
						</div>
							<?php
						$i = 0;
					}
				}
				?>
				<div class="slotsl-game">
					<?php include SLOTSL_PARTIALS . 'archives/slotsl-thumb.php';?>
					<?php include SLOTSL_PARTIALS . 'archives/slotsl-meta.php';?>
				</div><?php
			}
		} else {
			echo '<div class="slotsl-not-found">' . __( 'No Slots found', 'slotslanuch' ) . '</div>';
		}
		?>
	</div>
	<?php

	if (  'false' !== $atts['show_pagination'] ) {
		include SLOTSL_PARTIALS . 'archives/slotsl-pagination.php';
	}
	/* Restore original Post Data */
	wp_reset_postdata();
	if( 'false' !== $atts['show_upcoming'] ) {
		$upcoming_slots =  Slotslaunch_Slots::slots( [
			'upcoming' => true,
			'per_page' => 16,
		] );
		if ( $upcoming_slots->have_posts() && ! isset( $_GET['upcoming'] ) ) {
			?>
			<h2 class="slotsl-lobby-section-title"><?php _e( 'Upcoming Games', 'slotslaunch' ); ?></h2>
			<div class="slotsl-grid">
			<?php
			while ( $upcoming_slots->have_posts() ) {
				$upcoming_slots->the_post();
				$game = get_post();
				?>
			
			<div class="slotsl-game">
				<?php include SLOTSL_PARTIALS . 'archives/slotsl-thumb.php';?>
				<?php include SLOTSL_PARTIALS . 'archives/slotsl-meta.php';?>
			</div>
			<?php
			}
			?>
		</div>
		<?php
		}
		?>
	<?php
	/* Restore original Post Data */
	wp_reset_postdata(); 
	}?>
</div>
