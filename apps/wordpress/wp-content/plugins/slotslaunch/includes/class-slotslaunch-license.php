<?php

class SlotsLaunch_License {
	/**
	 * Call the API and update if valid license
	 * Return original response for later use
	 *
	 * @param $license
	 *
	 * @return mixed
	 */
	public static function is_valid_license( $license ) {

		$result = SlotsLaunch_Client::get( 'check-license', [ 'token' => $license ] );
		// update license
		if ( ! isset( $result->success ) ) {
			if( isset($result->code) && $result->code === 401 ) {
				$result->error = __('License is invalid, or not valid for the current host.', 'slotslaunch');
			}
		}

		return json_encode( $result );
	}
}