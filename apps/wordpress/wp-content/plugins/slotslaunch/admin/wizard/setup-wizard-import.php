<div class="slotsl-setup-content">
	<form action="" method="POST">
		<?php
			wp_nonce_field( 'slotsl-setup' );
			$providers =  slotsl_providers();
		?>



		<p><?php _e( 'Click the button below to import all games in the background. We will show an admin notice once the proccess is completed.', 'slotslaunch' ); ?></p>

		<div class="location-row">
			<label for="region" class="location-label "><?php _e( 'Import games From:', 'geot' ); ?></label>
			<select name="geot_settings[import_provider]" class="choicesjs-select sl-providers" multiple>
				<option value="all" selected><?php _e( 'All providers', 'slotslaunch' ); ?></option>

				<?php foreach ( $providers as $p ) : ?>
					<option value="<?php echo $p->id ?>" > <?php echo $p->name; ?></option>
				<?php endforeach; ?>
			</select>
			<div class="location-help"><?php _e( 'Import all providers or just some of them', 'geot' ); ?></div>
		</div>

		<div class="location-row text-center">
			<input type="hidden" name="save_step" value="1"/>
			<?php
			$import = wp_nonce_url(
				add_query_arg(
						['slotsl_import' => 'true'],
						admin_url()
				),
				'slotsl_import',
				'slotsl_import_nonce'
			);
			?>
			<a href="<?php echo $import;?>" class="sl-import-btn button-primary button button-hero button-next location-button"><?php _e( 'Import', 'slotslaunch' ); ?></a>
		</div>
	</form>
</div>