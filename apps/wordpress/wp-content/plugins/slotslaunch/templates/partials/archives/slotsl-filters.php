<div class="slotsl-filters" <?php echo  'false' === $atts['show_header'] ? 'style="display:none">' :'';?> >
	<form id="slotsl-filters" action="" method="get" data-id="<?php echo md5(json_encode($atts).esc_attr($_SERVER['REQUEST_URI']));?>">
		<div class="sl-filter-container">
			<div class="slotsl-search">
				<input type="text" id="sl-name" name="sl-name"
				       placeholder="<?php _e( 'Search Slots', 'slotslaunch' ); ?>"
				       value="<?php echo esc_html( $_GET['sl-name'] ?? '' ); ?>">
				<button type="submit" class="sl-submit-search">
					<svg xmlns="http://www.w3.org/2000/svg" style="height: 22px;width: 22px;" fill="none"
					     viewBox="0 0 24 24" stroke="#666" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round"
						      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
					</svg>
				</button>
			</div>

			<div class="slotsl-providers">
				<select  class="slots-select-providers  slotsl-select" name="sl-provider"
				         data-providers="<?php echo isset( $atts['provider'] ) ? esc_attr( $atts['provider'] ) : ''; ?>">
					<option value=""><?php _e( 'All Providers', 'slotslaunch' ); ?></option>
					<?php
					if ( !empty( $providers['providers'] ) ) {
						$selected = ! empty( $_GET['sl-provider'] ) ? $_GET['sl-provider'] : (isset( $atts['provider'] ) ? esc_attr( $atts['provider'] ) : '');

						foreach ( $providers['providers'] as $pr ) {
							?>
							<option
							value="<?php echo $pr->slug; ?>" <?php selected( $selected, $pr->slug ); ?> ><?php echo $pr->name; ?></option><?php
						}
					}
					?>
				</select>
			</div>

			<div class="slotsl-providers slotsl-providers-sortby">

				<select id="slots-sort" name="sl-sort" placeholder="">
					<option value="<?php isset($_atts['order_by']) ? esc_attr($_atts['order_by']) : 'new';?>"><?php _e( 'Sort By', 'slotslaunch' ); ?></option>
					<option value="az" <?php selected( esc_attr( $_GET['sl-sort'] ?? '' ), 'az' ); ?>><?php _e( 'A-Z', 'slotslaunch' ); ?></option>
					<option value="za" <?php selected( esc_attr( $_GET['sl-sort'] ?? '' ), 'za' ); ?>><?php _e( 'Z-A', 'slotslaunch' ); ?></option>
					<option value="new" <?php selected( esc_attr( $_GET['sl-sort'] ?? '' ), 'new' ); ?>><?php _e( 'Newest to Oldest', 'slotslaunch' ); ?></option>
					<option value="most_played" <?php selected( esc_attr( $_GET['sl-sort'] ?? '' ), 'most_played' ); ?>><?php _e( 'Most Played', 'slotslaunch' ); ?></option>
					<option value="trending" <?php selected( esc_attr( $_GET['sl-sort'] ?? '' ), 'trending' ); ?>><?php _e( 'Trending Games', 'slotslaunch' ); ?></option>
					<option value="most_rated" <?php selected( esc_attr( $_GET['sl-sort'] ?? '' ), 'most_rated' ); ?>><?php _e( 'Most Rated', 'slotslaunch' ); ?></option>
					<option value="highest_rated" <?php selected( esc_attr( $_GET['sl-sort'] ?? '' ), 'highest_rated' ); ?>><?php _e( 'Highest Rated', 'slotslaunch' ); ?></option>
					<option value="gold" <?php selected( esc_attr( $_GET['sl-sort'] ?? '' ), 'gold' ); ?>><?php _e( 'Gold Games', 'slotslaunch' ); ?></option>
					<option value="silver" <?php selected( esc_attr( $_GET['sl-sort'] ?? '' ), 'silver' ); ?>><?php _e( 'Silver Games', 'slotslaunch' ); ?></option>
					<option value="bronze" <?php selected( esc_attr( $_GET['sl-sort'] ?? '' ), 'bronze' ); ?>><?php _e( 'Bronze Games', 'slotslaunch' ); ?></option>				
				</select>
			</div>
		</div>
		<?php
		if( ! get_option('sl_force_update') ) {
			?>
			<div class="sl-mobile-filter-button">
				<?php _e('Filter', 'slotslaunch' );?>
				<div class="sl-filter-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#666" style="width: 30px;height: 30px;">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
					</svg>
				</div>
			</div>
			<?php
		}
		?>
		<div class="sl-filter-container sl-mobile-filters">
			<div class="slotsl-providers ">
				<?php
				if ( $types ) { ?>
					<select  class="slots-select-types" name="sl-type"
					         data-types="<?php echo isset( $atts['type'] ) ? esc_attr( $atts['type'] ) : ''; ?>">
						<option value=""><?php _e( 'All Types', 'slotslaunch' ); ?></option>
						<?php
						$selected = ! empty( $_GET['sl-type'] ) ? $_GET['sl-type'] : (isset( $atts['type'] ) ? esc_attr( $atts['type'] ) : '');

						foreach ( $types as $ty ) {
							?>
							<option
							value="<?php echo $ty->slug; ?>" <?php selected( $selected, $ty->slug ); ?> ><?php echo $ty->name; ?></option><?php
						}
						?>
					</select>
					<?php
				}
				?>
			</div>
			<div class="slotsl-providers ">
				<?php
				if ( $themes ) {
					?>
				<select  class="slots-select-themes" name="sl-theme"
				         data-themes="<?php echo isset( $atts['theme'] ) ? esc_attr( $atts['theme'] ) : ''; ?>">
					<option value=""><?php _e( 'All Themes', 'slotslaunch' ); ?></option>
					<?php
					$selected = ! empty( $_GET['sl-theme'] ) ? $_GET['sl-theme'] : (isset( $atts['theme'] ) ? esc_attr( $atts['theme'] ) : '');

					foreach ( $themes as $th ) {
						?>
						<option
						value="<?php echo $th->slug; ?>" <?php selected( $selected, $th->slug ); ?> ><?php echo $th->name; ?></option><?php
					}
					?></select><?php
				}
				?>

			</div>
			<?php
			if( ! get_option('sl_force_update') ) {
				?>
				<div class="slotsl-providers slotsl-megaways ">
					<div style="margin-right: 10px">Megaways</div>
					<label class="switch">
						<input  type="checkbox" name="sl-megaways" id="sl-megaways" class="sl-filters" value="megaways"/>
						<span class="slider round"></span>
					</label>
				</div>
				<?php
			}
			?>
		</div>
	</form>
</div>