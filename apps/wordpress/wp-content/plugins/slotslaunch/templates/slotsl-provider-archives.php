<div class="slotsl-container slotsl-providers-archives">
<?php
$providers = Slotslaunch_Slots::providers($atts);

$url = $atts['slots_url'] ?? slotsl_setting( 'lobby-url', site_url() );

?>
	<div class="slotsl-filters">
		<form id="slotsl-filters" action="" method="get">
		<div class="slotsl-search">
				<input type="text" id="sl-name" name="sl-name" data-search="providers" placeholder="<?php _e('Search Providers', 'slotslaunch');?>" value="<?php echo esc_html( $_GET['sl-name'] ?? '');?>">
				<button type="submit" class="sl-submit-search">
					<svg xmlns="http://www.w3.org/2000/svg" style="height: 22px;width: 22px;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
					</svg>
				</button>
		</div>
		</form>
	</div>

	<div class="slotsl-loader">
		<svg version="1.1" id="L1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">
    <circle fill="none" stroke="#333" stroke-width="6" stroke-miterlimit="15" stroke-dasharray="14.2472,14.2472" cx="50" cy="50" r="47" >
	    <animateTransform
			    attributeName="transform"
			    attributeType="XML"
			    type="rotate"
			    dur="5s"
			    from="0 50 50"
			    to="360 50 50"
			    repeatCount="indefinite" />
    </circle>
			<circle fill="none" stroke="#333" stroke-width="1" stroke-miterlimit="10" stroke-dasharray="10,10" cx="50" cy="50" r="39">
				<animateTransform
						attributeName="transform"
						attributeType="XML"
						type="rotate"
						dur="5s"
						from="0 50 50"
						to="-360 50 50"
						repeatCount="indefinite" />
			</circle>
			<g fill="#333">
				<rect x="30" y="35" width="5" height="30">
					<animateTransform
							attributeName="transform"
							dur="1s"
							type="translate"
							values="0 5 ; 0 -5; 0 5"
							repeatCount="indefinite"
							begin="0.1"/>
				</rect>
				<rect x="40" y="35" width="5" height="30" >
					<animateTransform
							attributeName="transform"
							dur="1s"
							type="translate"
							values="0 5 ; 0 -5; 0 5"
							repeatCount="indefinite"
							begin="0.2"/>
				</rect>
				<rect x="50" y="35" width="5" height="30" >
					<animateTransform
							attributeName="transform"
							dur="1s"
							type="translate"
							values="0 5 ; 0 -5; 0 5"
							repeatCount="indefinite"
							begin="0.3"/>
				</rect>
				<rect x="60" y="35" width="5" height="30" >
					<animateTransform
							attributeName="transform"
							dur="1s"
							type="translate"
							values="0 5 ; 0 -5; 0 5"
							repeatCount="indefinite"
							begin="0.4"/>
				</rect>
				<rect x="70" y="35" width="5" height="30" >
					<animateTransform
							attributeName="transform"
							dur="1s"
							type="translate"
							values="0 5 ; 0 -5; 0 5"
							repeatCount="indefinite"
							begin="0.5"/>
				</rect>
			</g>
</svg>
	</div>
	<div class="slotsl-grid" data-url="<?php echo esc_url( $url );?>"><?php
		// The Loop
		if ( ! empty( $providers['providers'] ) ) {
			foreach ($providers['providers'] as $provider) {

				?>
				<div class="slotsl-game">
				<div class="slotsl-thumb">
					<a href="<?php echo esc_url( apply_filters( 'slotsl/provider_url', $url .'?sl-provider='.$provider->slug, $provider ) );?>" class="slotsl-url " data-sid="<?php echo $provider->term_id;?>">
					<?php
					$img = provider_img_url($provider->term_id);
					if ( ! $img ) {
						$img = SLOTSL_PLUGIN_URL . 'public/img/no-image-available.png';
					}
					echo '<img src="' . $img . '" alt="'.$provider->name.'"/>';
					?>
					</a>
				</div>
				<div class="slotsl-meta slotsl-providers-meta">
					<p class="slotsl-title">
						<a href="<?php echo esc_url( apply_filters( 'slotsl/provider_url', $url .'?sl-provider='.$provider->slug, $provider ) );?>" class="slotsl-url" data-sid="<?php echo $provider->term_id;?>">
							<?php echo $provider->name;?>
						</a>
						<span class="sl-count"><?php echo $provider->count;?> SLOTS</span>
					</p>
				</div>
				</div><?php
			}
		} else {
			echo '<div class="slotsl-not-found">'. __('No Providers found', 'slotslanuch') . '</div>';
		}
	?>
	</div>
	<?php
	if ( ! isset( $atts['show_pagination'] ) || 'false' !== $atts['show_pagination'] ) {
		$per_page = ! empty( $atts['per_page'] ) ? esc_html( (int) $atts['per_page'] ) : 20;
		$total    = $per_page * 1;
		$total_found = count($providers['providers']);
		?>
		<div class="slotsl-progress">
			<p class=""><?php echo sprintf( __('%s of %s providers!','slotslaunch'),
					'<span class="sl_total_viewed" data-viewed="'. $per_page.'" data-per-page="'. $per_page.'">'. min( $total, $total_found ).'</span>',
					'<span class="sl_total_found">'.$providers['total'].'</span>'
				);?></p>
			<div class="slotsl-progress-bar">
				<div class="slotsl-progress-bar-line">
					<div class="slotsl-progress-bar-fill" data-viewed="<?php echo min( $total, $total_found ); ?>"
					     data-total="<?php echo $total_found; ?>"
					     style="width: <?php echo $total_found > 0 ? ( min( $total, $total_found ) * 100 ) / $providers['total'] : '0';?>%;">
					</div>
				</div>
			</div>
		</div>

		<div class="slotsl-load-more" style="<?php echo $total <= $total_found ? 'none' : '';?>">
			<button class="btn slotsl-load-more-btn-providers" id=""
			        data-page="<?php echo slotsl_current_page(); ?>"><?php _e( 'Load More', 'slotslaunch' ); ?></button>
		</div>

		<?php
	}

	/*
	if( ! isset($atts['show_pagination']) || 'false' !== $atts['show_pagination'] ) {
	?>
		<div class="slotsl-pagination">
			<?php echo paginate_links( array(
				//'base' => str_replace( 999999999, '%#%', esc_url( get_pagenum_link( 999999999 ) ) ),
				'format' => '?sl-page=%#%',
				'current' => max( 1, slotsl_current_page() ),
				'total' => $slots->max_num_pages,
				'before_page_number' => '<span class="screen-reader-text">'. __( 'Page', 'slotslaunch' ) .' </span>'
			) );?>
		</div><?php
	}*/
/* Restore original Post Data */
wp_reset_postdata();?>
</div>
