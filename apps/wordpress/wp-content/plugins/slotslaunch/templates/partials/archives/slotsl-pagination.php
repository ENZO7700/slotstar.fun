<?php
$per_page = ! empty( $atts['per_page'] ) ? esc_html( (int) $atts['per_page'] ) : 52;
$total    = $per_page * slotsl_current_page();
?>
<div class="slotsl-progress">
	<p class=""><?php echo sprintf( __('You have viewed %s of %s games!','slotslaunch'),
			'<span class="sl_total_viewed" data-viewed="'. $per_page.'" data-per-page="'. $per_page.'">'. min( $total, $slots->found_posts ).'</span>',
			'<span class="sl_total_found">'.$slots->found_posts.'</span>'
		);?></p>
	<div class="slotsl-progress-bar">
		<div class="slotsl-progress-bar-line">
			<div class="slotsl-progress-bar-fill" data-viewed="<?php echo min( $total, $slots->found_posts ); ?>"
			     data-total="<?php echo $slots->found_posts; ?>"
			     style="width: <?php echo $slots->found_posts > 0 ? ( min( $total, $slots->found_posts ) * 100 ) / $slots->found_posts : '0';?>%;">
			</div>
		</div>
	</div>
</div>

<div class="slotsl-load-more" style="<?php echo $total < $slots->found_posts ? 'none' : '';?>">
	<button class="btn slotsl-load-more-btn" id=""
	        data-page="<?php echo slotsl_current_page(); ?>"><?php _e( 'Load More', 'slotslaunch' ); ?></button>
</div>