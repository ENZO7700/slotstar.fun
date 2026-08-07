<?php if( slotsl_setting( 'display-info', true ) && slotsl_setting( 'display-info-position', 'top' ) == 'top' ) : ?>
	<?php include SLOTSL_PARTIALS . 'single/slotsl-game-attributes.php'; ?>
<?php endif; ?>
<div class="sl-single-game-container">
	<?php
do_action('slotsl/single_page/top');
include SLOTSL_PARTIALS . 'single/slotsl-css.php';

$featured_widget = slotsl_setting( 'featured-widget', true );
if ( isset( $atts['featured_games_widget'] ) ) {
	$featured_widget = 'true' === $atts['featured_games_widget'];
}
$play_for_real_url = slotsl_setting( 'play-for-real', false );
$play_for_real_url = ! empty( $atts['aff_url'] ) ? $atts['aff_url'] : $play_for_real_url;
$play_for_real_url = apply_filters( 'slotsl/play_for_real_url', $play_for_real_url, $game );
$rating = new Slotslaunch_Rating( $game->ID );

if ( slotsl_setting( 'breadcrumbs', false ) && ( ! isset( $atts['breadcrumbs'] ) || 'false' != $atts['breadcrumbs'] ) ) {
	include SLOTSL_PARTIALS . 'single/slotsl-breadcrumbs.php';
} ?>

<?php if( slotsl_setting( 'display-ratings', true ) ) : ?>
	<?php include SLOTSL_PARTIALS . 'single/slotsl-schema.php'; ?>
<?php endif; ?>
	<div class="sl-container <?php echo $featured_widget ? 'sl-basis-9/12' : ''; ?>">
		<?php include SLOTSL_PARTIALS . 'single/slotsl-header.php'; ?>
		<div class="sl-slots">
			<?php include SLOTSL_PARTIALS . 'single/slotsl-fullscreen-button.php'; ?>
			<iframe class="sl-responsive-iframe"
			        title="<?php echo $game->post_title; ?>"
					data-src="<?php echo SlotsLaunch_Client::generateUrl( $game->ID ); ?>"></iframe>
			<?php
			include SLOTSL_PARTIALS . 'single/slotsl-placeholder.php';

			if ( slotsl_setting( 'enable-popup', 0 ) ) {
				include SLOTSL_PARTIALS . 'single/slotsl-popup.php';
			}
			?>
		</div>
		<?php
		if( slotsl_setting( 'display-broken', true ) ) {
			include SLOTSL_PARTIALS . 'single/slotsl-broken-game-form.php';
		}
		include SLOTSL_PARTIALS . 'single/slotsl-scrolling-banner.php'; ?>
	</div>
	<?php
	if ( $featured_widget ) {
		include SLOTSL_PARTIALS . 'single/slotsl-featured-games-widget.php';
	} ?>
<?php do_action('slotsl/single_page/bottom');?>
</div>
<?php if( slotsl_setting( 'display-info', true ) && slotsl_setting( 'display-info-position', 'top' ) == 'bottom' ) : ?>
	<?php include SLOTSL_PARTIALS . 'single/slotsl-game-attributes.php'; ?>
<?php endif; ?>