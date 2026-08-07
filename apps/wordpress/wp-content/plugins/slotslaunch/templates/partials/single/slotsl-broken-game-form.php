<div class="report-broken-game mfp-hide" id="report-broken-game">
	<div class="rbg-step step-1 active">
		<p class="sl-heading"><?php echo sprintf( __( 'Having issues with <strong>%s</strong> ?', 'slotslaunch' ), $game->post_title ); ?></p>
		<form id="sl-broken-link-form">
			<div class="flex flex-col">
                 <textarea id="sl-issue" name="issue" cols="30" rows="5"
                           class="mt-20 block w-full text-black-color bg-[#F5F0E8] rounded-sm p-15 placeholder:text-optional-color outline-0 placeholder:ease-in placeholder:duration-300 focus:placeholder:text-transparent text-13px md:text-15px lg:text-16px"
                           name="message"
                           placeholder="<?php _e( 'Describe the issue here...', 'slotslaunch' ); ?>"
                           required></textarea>
			</div>
			<input type="hidden" name="gid" value="<?php echo slotsl_id( $game->ID ); ?>">
			<button id="sl-broken-submit" class="btn btn-primary" type="submit"><?php _e( 'Submit', 'slotslaunch' ); ?></button>
		</form>
	</div>
</div>