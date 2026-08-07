<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta name="viewport" content="width=device-width"/>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	<title><?php esc_html_e( 'SlotsLaunch &rsaquo; Setup Wizard', 'slotslaunch' ); ?></title>
	<?php do_action( 'admin_enqueue_scripts' ); ?>
	<?php wp_print_scripts( 'slotsl-setup' ); ?>
	<?php do_action( 'admin_print_styles' ); ?>
	<?php do_action( 'admin_head' ); ?>
</head>
<body class="wp-core-ui">
<h1 class="slotsl-logo">
	<a href="https://slotslaunch.com/">
		<img style="width: 320px" src="<?php echo SLOTSL_PLUGIN_URL; ?>admin/img/rocket-logo.webp" alt="slotslaunch"/>
	</a>
</h1>

<div class="slotsl-setup">