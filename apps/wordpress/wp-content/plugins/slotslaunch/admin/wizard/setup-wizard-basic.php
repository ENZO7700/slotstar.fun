<div class="slotsl-setup-content">
	<form action="" method="POST">
		<?php wp_nonce_field( 'slotsl-setup' ); ?>

		<?php do_action( 'slotsl/wizard/basic/before' ); ?>

		<p><?php _e( 'Thanks for installing SlotsLaunch!! The wizard below will help you configure the plugin correctly.', 'slotsl' ); ?></p>

		<div class="location-row">
			<label for="license" class="location-label"><?php _e( 'Enter your API key', 'slotslaunch' ); ?></label>
			<input type="text" id="license" name="slotsl_settings[license]" value="<?php echo $opts['license']; ?>"
			       class="location-input api-keys" required/>
			<!--button class="button-secondary button button-hero button-next location-button-secondary"><?php //_e('Check Credits/Subscriptions','slotslaunch') ?></button-->
			<div class="location-help"><?php _e( 'Enter your api key in order to connect with the API and also get automatic updates', 'slotslaunch' ); ?></div>
		</div>

		<?php do_action( 'slotsl/wizard/basic/after' ); ?>

		<div class="location-row text-center">
			<input type="hidden" name="save_step" value="1"/>
			<button class="button-primary button button-hero button-next location-button sl-check-license"
			        name="slotsl_settings[button]"><?php _e( 'Next', 'slotslaunch' ); ?></button>
			<div id="response_error"></div>
		</div>
	</form>
</div>