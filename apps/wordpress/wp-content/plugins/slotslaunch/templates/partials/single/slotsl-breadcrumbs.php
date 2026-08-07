<?php
$home_url    = apply_filters( 'slotsl/breadcrumbs/home_url', site_url() );
$separator   = apply_filters( 'slotsl/breadcrumbs/separator', '&raquo;' );
$home        = __( 'Home', 'slotslaunch' );
$breadcrumbs = [
	[
		'url'  => $home_url,
		'name' => $home,
	],
	[
		'url'  => slotsl_setting( 'lobby-url', site_url() ),
		'name' => apply_filters( 'slotsl/breadcrumbs/lobby_name', __( 'Slots', 'slotslaunch' ) ),
	],
];
if ( $provider ) {
	$breadcrumbs[] = [
		'url'  => apply_filters( 'slotsl/provider_url', slotsl_setting( 'lobby-url', site_url() ) . '?sl-provider=' . $provider->slug, $provider ),
		'name' => $provider->name,
	];
}
$breadcrumbs[] = [
	'url'  => $home_url,
	'name' => $game->post_title,
];

?>
<div class="sl-breadcrumbs">
	<ol itemscope itemtype="https://schema.org/BreadcrumbList">
		<?php
		$total_items = count( $breadcrumbs );
		foreach ( $breadcrumbs as $i => $bread ) {
			?>
			<li itemprop="itemListElement" itemscope
			    itemtype="https://schema.org/ListItem">
				<?php
				if ( $total_items == ( $i + 1 ) ) {
					?>
					<span itemprop="name"><?php echo $bread['name']; ?></span>
					<meta itemprop="position" content="<?php echo $i + 1; ?>"/>
					<?php
				} else {
					?>
					<a itemprop="item" href="<?php echo $bread['url']; ?>">
						<span itemprop="name"><?php echo $bread['name']; ?></span></a>
					<meta itemprop="position" content="<?php echo $i + 1; ?>"/>
					<?php
				}
				?>

			</li>
			<?php
			if ( $total_items != ( $i + 1 ) ) {
				echo '<span class="sl-separator">' . $separator . '</span>';
			}
		}
		?>
	</ol>
</div>