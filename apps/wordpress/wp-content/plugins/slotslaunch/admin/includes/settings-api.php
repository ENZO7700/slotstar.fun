<?php
/**
 * Settings API.
 */

/**
 * Settings output wrapper.
 *
 * @param array $args
 *
 * @return string
 * @since 2.0.0
 *
 */
function slotsl_settings_output_field( $args ) {

	// Define default callback for this field type.
	$callback = ! empty( $args['type'] ) && function_exists( 'slotsl_settings_' . $args['type'] . '_callback' ) ? 'slotsl_settings_' . $args['type'] . '_callback' : 'slotsl_settings_missing_callback';

	// Allow custom callback to be provided via arg.
	if ( ! empty( $args['callback'] ) && function_exists( $args['callback'] ) ) {
		$callback = $args['callback'];
	}

	// Store returned markup from callback.
	$field = call_user_func( $callback, $args );

	// Allow arg to bypass standard field wrap for custom display.
	if ( ! empty( $args['wrap'] ) ) {
		return $field;
	}

	// Custom row classes.
	$class = ! empty( $args['class'] ) ? slotsl_sanitize_classes( (array) $args['class'], true ) : '';

	// Build standard field markup and return.
	$output = '<div class="slotsl-setting-row slotsl-setting-row-' . sanitize_html_class( $args['type'] ) . ' slotsl-clear ' . $class . '" id="slotsl-setting-row-' . slotsl_sanitize_key( $args['id'] ) . '">';

	if ( ! empty( $args['name'] ) && empty( $args['no_label'] ) ) {
		$output .= '<span class="slotsl-setting-label ' . ( isset( $args['premium_field'] ) && $args['premium_field'] ? 'premium-only' : '' ) . '">';
		$output .= '<label for="slotsl-setting-' . slotsl_sanitize_key( $args['id'] ) . '">' . esc_html( $args['name'] ) . '</label>';
		$output .= '</span>';
	}

	$output .= '<span class="slotsl-setting-field ' . ( isset( $args['premium_field'] ) && $args['premium_field'] ? 'premium-only' : '' ) . '">';
	$output .= $field;
	$output .= '</span>';

	$output .= '</div>';

	$output = apply_filters( 'slotsl_output_field_' . $args['type'], $output, $args );

	return $output;
}

/**
 * Missing Callback.
 *
 * If a function is missing for settings callbacks alert the user.
 *
 * @param array $args Arguments passed by the setting.
 *
 * @return string
 * @since 2.0.0
 *
 */
function slotsl_settings_missing_callback( $args ) {

	return sprintf(
	/* translators: %s - ID of a setting. */
		esc_html__( 'The callback function used for the %s setting is missing.', 'slotslaunch' ),
		'<strong>' . slotsl_sanitize_key( $args['id'] ) . '</strong>'
	);
}

/**
 * Settings content field callback.
 *
 * @param array $args
 *
 * @return string
 * @since 2.0.0
 *
 */
function slotsl_settings_content_callback( $args ) {
	return ! empty( $args['content'] ) ? $args['content'] : '';
}

/**
 * Settings license field callback.
 *
 * @param array $args
 *
 * @return string
 * @since 2.0.0
 *
 */
function slotsl_settings_license_callback( $args ) {

	$option_name = isset( $args['addon_license'] ) ? $args['addon_license'] : 'slotsl_settings';
	$id = isset( $args['id'] ) ? $args['id'] : '';
	$key = slotsl_setting( 'license', '', $option_name );

	$output = '<input type="password" class="slotsl-setting-license-key" id="license" value="' . esc_attr( $key ) . '" name="' . $id . '" />';
	$output .= '<button type="button" id="button-' . esc_attr( $option_name ) . '" data-key="' . esc_attr( $option_name ) . '" class="slotsl-setting-license-key-verify slotsl-btn slotsl-btn-md slotsl-btn-blue">' . esc_html__( 'Verify Key', 'slotslaunch' ) . '</button>';
	$output .= '<div id="response_error"></div>';
	return $output;
}

/**
 * Settings license field callback.
 *
 * @param array $args
 *
 * @return string
 * @since 2.0.0
 *
 */
function slotsl_settings_button_callback( $args ) {

	$id = isset( $args['id'] ) ? $args['id'] : '';
	$name = $args['button_text'];

	$output = '<button type="button" id="button-' . esc_attr( $id ) . '" data-id="' . esc_attr( $id ) .'" data-action="' . esc_attr( $args['action'] ) . '" class="sl-settings-ajax-button slotsl-btn slotsl-btn-md slotsl-btn-blue">' . $name . '</button>';
	$output .= '<div id="response_error-' . esc_attr( $id ) .'"></div>';
	if ( ! empty( $args['desc'] ) ) {
		$output .= '<p class="desc">' . wp_kses_post( $args['desc'] ) . '</p>';
	}
	return $output;
}
/**
 * Settings text input field callback.
 *
 * @param array $args
 *
 * @return string
 * @since 2.0.0
 *
 */
function slotsl_settings_text_callback( $args ) {

	$default  = isset( $args['default'] ) ? esc_html( $args['default'] ) : '';
	$placeholder  = isset( $args['placeholder'] ) ? esc_html( $args['placeholder'] ) : '';
	$value    = slotsl_setting( $args['id'], $default );
	$id       = slotsl_sanitize_key( $args['id'] );
	$disabled = isset( $args['premium_field'] ) && $args['premium_field'] ? 'disabled' : '';

	$output = '<input type="text" id="slotsl-setting-' . $id . '" name="' . $id . '" placeholder="' . esc_attr( $placeholder ) . '" value="' . esc_attr( $value ) . '" ' . $disabled . '>';

	if ( ! empty( $args['desc'] ) ) {
		$output .= '<p class="desc">' . wp_kses_post( $args['desc'] ) . '</p>';
	}
	if ( isset( $args['premium_field'] ) && $args['premium_field'] ) {

		$output .=
			'<p>' .
			sprintf(
				wp_kses(
				/* translators: %s - WPPopups.com upgrade URL. */
					__( 'To unlock all features consider <a href="%s" target="_blank" rel="noopener noreferrer" class="slotsl-upgrade-modal">upgrading to Pro</a>.', 'slotslaunch' ),
					[
						'a' => [
							'href'   => [],
							'class'  => [],
							'target' => [],
							'rel'    => [],
						],
					]
				),
				slotsl_admin_upgrade_link()
			) .
			'</p>';
	}


	return $output;
}

/**
 * Settings text input field callback.
 *
 * @param array $args
 *
 * @return string
 * @since 2.0.0
 *
 */
function slotsl_settings_textarea_callback( $args ) {

	$default  = isset( $args['default'] ) ? esc_html( $args['default'] ) : '';
	$value    = slotsl_setting( $args['id'], $default );
	$id       = slotsl_sanitize_key( $args['id'] );
	$disabled = isset( $args['premium_field'] ) && $args['premium_field'] ? 'disabled' : '';

	$output = '';
	if ( isset( $args['premium_field'] ) && $args['premium_field'] ) {
		$output .= slotsl_premium_text();
	} else {
		ob_start();
		add_filter( 'wp_default_editor', function () { 'return "html";'; } );
		wp_editor( stripslashes( html_entity_decode( $value ) ),  $id, ['tinymce' => false ] );

		$output .= ob_get_clean();
		if ( ! empty( $args['desc'] ) ) {
			$output .= '<p class="desc">' . wp_kses_post( $args['desc'] ) . '</p>';
		}
	}


	return $output;
}

function slotsl_settings_debug_callback( $args ) {


	$value    = get_option( 'slots_error' );
	
	$disabled = 'disabled';

	$output = '';

	$output .= '<textarea rows="10" cols="100" disabled>';
	if ( ! empty( $value ) ) {
		foreach ( $value as $error ) {
			$output .= 'Date: ' . $error['date'] . "\nMessage: " . $error['msg'] . "\n\n";
		}
	} else {
		$output .= 'No errors found';
	}
	$output .= '</textarea>';
	if ( ! empty( $args['desc'] ) ) {
		$output .= '<p class="desc">' . wp_kses_post( $args['desc'] ) . '</p>';
	}
	

	return $output;
}

/**
 * Settings number input field callback.
 *
 * @param array $args
 *
 * @return string
 * @since 2.0.0
 *
 */
function slotsl_settings_number_callback( $args ) {

	$default  = isset( $args['default'] ) ? esc_html( $args['default'] ) : '';
	$placeholder  = isset( $args['placeholder'] ) ? esc_html( $args['placeholder'] ) : '';
	$value    = slotsl_setting( $args['id'], $default );
	$id       = slotsl_sanitize_key( $args['id'] );
	$step     = isset($args['step']) ? abs( $args['step'] ) : 1;
	$disabled = isset( $args['premium_field'] ) && $args['premium_field'] ? 'disabled' : '';

	$output = '<input type="number" step="'.$step.'" id="slotsl-setting-' . $id . '" name="' . $id . '" placeholder="' . esc_attr( $placeholder ) . '" value="' . esc_attr( $value ) . '" ' . $disabled . '>';

	if ( ! empty( $args['desc'] ) ) {
		$output .= '<p class="desc">' . wp_kses_post( $args['desc'] ) . '</p>';
	}
	if ( isset( $args['premium_field'] ) && $args['premium_field'] ) {
		$output .=  slotsl_premium_text();
	}


	return $output;
}


/**
 * Settings select field callback.
 *
 * @param array $args
 *
 * @return string
 * @since 2.0.0
 *
 */
function slotsl_settings_select_callback( $args ) {

	$default = isset( $args['default'] ) ? esc_html( $args['default'] ) : '';
	$value   = slotsl_setting( $args['id'], $default );
	$id      = slotsl_sanitize_key( $args['id'] );
	$disabled = isset( $args['premium_field'] ) && $args['premium_field'] ? 'disabled' : '';
	$class   = ! empty( $args['choicesjs'] )  && empty( $disabled ) ? 'choicesjs-select' : '';
	$choices = ! empty( $args['choicesjs'] ) && empty( $disabled ) ? true : false;
	$multiple = $choices ? 'multiple data-search="true"': '';
	$data    = '';

	if ( $choices && ! empty( $args['search'] ) ) {
		$data = ' data-search="true"';
	}

	$output = $choices ? '<span class="choicesjs-select-wrap">' : '';
	$output .= '<select id="slotsl-setting-' . $id . '" name="' . $id .($choices ? '[]':''). '" class="' . $class . '"' . $data . ' ' . $disabled . ' ' . $multiple . '>';

	foreach ( $args['options'] as $index => $opt ) {
		if( is_object($opt)) {
			$selected = is_array($value) ? ( in_array( $opt->id, $value ) ? 'selected' :'') : selected( $value, $opt->id, false );
			$output   .= '<option value="' . esc_attr( $opt->id ) . '" ' . $selected . '>' . esc_html( $opt->name ) . '</option>';
		} else {
			$selected = is_array($value) ? ( in_array( $index, $value ) ? 'selected' :'') : selected( $value, $index, false );
			$output   .= '<option value="' . esc_attr( $index ) . '" ' . $selected . '>' . esc_html( $opt ) . '</option>';
		}

	}

	$output .= '</select>';
	$output .= $choices ? '</span>' : '';

	if ( ! empty( $args['desc'] ) ) {
		$output .= '<p class="desc">' . wp_kses_post( $args['desc'] ) . '</p>';
	}
	if ( isset( $args['premium_field'] ) && $args['premium_field'] ) {
		$output .=  slotsl_premium_text();
	}
	return $output;
}

/**
 * Settings checkbox field callback.
 *
 * @param array $args
 *
 * @return string
 * @since 2.0.0
 *
 */
function slotsl_settings_checkbox_callback( $args ) {

	$value   = slotsl_setting( $args['id'] );
	$id      = slotsl_sanitize_key( $args['id'] );
	$checked = ! empty( $value ) ? checked( 1, $value, false ) : '';

	$output = '<input type="checkbox" id="slotsl-setting-' . $id . '" name="' . $id . '" ' . $checked . '>';

	if ( ! empty( $args['desc'] ) ) {
		$output .= '<p class="desc">' . wp_kses_post( $args['desc'] ) . '</p>';
	}

	return $output;
}

/**
 * Settings radio field callback.
 *
 * @param array $args
 *
 * @return string
 * @since 2.0.0
 *
 */
function slotsl_settings_radio_callback( $args ) {

	$default = isset( $args['default'] ) ? esc_html( $args['default'] ) : '';
	$value   = slotsl_setting( $args['id'], $default );
	$id      = slotsl_sanitize_key( $args['id'] );
	$output  = '';
	$x       = 1;

	foreach ( $args['options'] as $option => $name ) {

		$checked = checked( $value, $option, false );
		$output  .= '<label for="slotsl-setting-' . $id . '[' . $x . ']" class="option-' . sanitize_html_class( $option ) . '">';
		$output  .= '<input type="radio" id="slotsl-setting-' . $id . '[' . $x . ']" name="' . $id . '" value="' . esc_attr( $option ) . '" ' . $checked . '>';
		$output  .= esc_html( $name );
		$output  .= '</label>';
		$x ++;
	}

	if ( ! empty( $args['desc'] ) ) {
		$output .= '<p class="desc">' . wp_kses_post( $args['desc'] ) . '</p>';
	}

	return $output;
}

/**
 * Settings image upload field callback.
 *
 * @param array $args
 *
 * @return string
 * @since 2.0.0
 *
 */
function slotsl_settings_image_callback( $args ) {

	$default = isset( $args['default'] ) ? esc_html( $args['default'] ) : '';
	$value   = slotsl_setting( $args['id'], $default );
	$id      = slotsl_sanitize_key( $args['id'] );
	$output  = '';

	if ( ! empty( $value ) ) {
		$output .= '<img src="' . esc_url_raw( $value ) . '">';
	}

	$output .= '<input type="text" id="slotsl-setting-' . $id . '" name="' . $id . '" value="' . esc_url_raw( $value ) . '">';
	$output .= '<button class="slotsl-btn slotsl-btn-md slotsl-btn-light-grey">' . esc_html__( 'Upload Image', 'slotslaunch' ) . '</button>';

	if ( ! empty( $args['desc'] ) ) {
		$output .= '<p class="desc">' . wp_kses_post( $args['desc'] ) . '</p>';
	}

	return $output;
}

/**
 * Settings color picker field callback.
 *
 * @param array $args
 *
 * @return string
 * @since 2.0.0
 *
 */
function slotsl_settings_color_callback( $args ) {

	$default = isset( $args['default'] ) ? esc_html( $args['default'] ) : '';
	$value   = slotsl_setting( $args['id'], $default );
	$id      = slotsl_sanitize_key( $args['id'] );
	$disabled = isset( $args['premium_field'] ) && $args['premium_field'] ? 'disabled' : '';
	
	$output = '<input type="text" id="slotsl-setting-' . $id . '" class="slotsl-color-picker" name="' . $id . '" value="' . esc_attr( $value ) . '" ' . $disabled . '>';

	if ( ! empty( $args['desc'] ) ) {
		$output .= '<p class="desc">' . wp_kses_post( $args['desc'] ) . '</p>';
	}
	if ( isset( $args['premium_field'] ) && $args['premium_field'] ) {
		$output .=  slotsl_premium_text();
	}
	return $output;
}

function slotsl_premium_text() {
	return '<p>' .
	sprintf(
		wp_kses(
		/* translators: %s - WPPopups.com upgrade URL. */
			__( 'To unlock all features consider <a href="%s" target="_blank" rel="noopener noreferrer" class="slotsl-upgrade-modal">upgrading to a Premium Plan</a>.', 'slotslaunch' ),
			[
				'a' => [
					'href'   => [],
					'class'  => [],
					'target' => [],
					'rel'    => [],
				],
			]
		),
		slotsl_admin_upgrade_link()
	) .
	'</p>';
}

/**
 * Settings sortable field callback.
 *
 * @param array $args
 *
 * @return string
 * @since 2.0.0
 *
 */
function slotsl_settings_sortable_callback( $args ) {
	$default = isset( $args['default'] ) ? esc_html( $args['default'] ) : '';
	$value   = slotsl_setting( $args['id'], $default );
	$id      = slotsl_sanitize_key( $args['id'] );
	
	// Define section labels
	$section_labels = [
		'editors-pick' => __( 'Editor\'s Pick', 'slotslaunch' ),
		'seasonal' => __( 'Seasonal', 'slotslaunch' ),
		'newest' => __( 'Newest Games', 'slotslaunch' ),
		'most-played' => __( 'Most Played', 'slotslaunch' ),
		'top-rated' => __( 'Top Rated', 'slotslaunch' ),
		'trending' => __( 'Trending Games', 'slotslaunch' ),
		'licensed' => __( 'Licensed Games', 'slotslaunch' ),
		'gold-medal' => __( 'Gold Medal Games', 'slotslaunch' ),
		'upcoming-games' => __( 'Upcoming Games', 'slotslaunch' ),
	];
	
	/**
	 * Allow developers to add custom section labels for admin sortable list
	 * 
	 * @param array $section_labels Array of section keys => labels
	 * @return array Modified labels array
	 */
	$section_labels = apply_filters( 'slotsl_lobby_section_labels', $section_labels );
	
	// Parse current order
	$current_order = ! empty( $value ) ? explode( ',', $value ) : explode( ',', $default );
	$current_order = array_map( 'trim', $current_order );
	
	// Get all available sections
	$all_sections = array_keys( $section_labels );
	
	// Merge to include any new sections that might not be in the saved order
	$ordered_sections = array_merge( array_intersect( $current_order, $all_sections ), array_diff( $all_sections, $current_order ) );
	
	$output = '<ul id="slotsl-sortable-' . $id . '" class="slotsl-sortable-list">';
	
	foreach ( $ordered_sections as $section_key ) {
		if ( isset( $section_labels[ $section_key ] ) ) {
			$output .= '<li class="slotsl-sortable-item" data-section="' . esc_attr( $section_key ) . '">';
			$output .= '<span class="slotsl-sortable-handle">☰</span>';
			$output .= '<span class="slotsl-sortable-label">' . esc_html( $section_labels[ $section_key ] ) . '</span>';
			$output .= '</li>';
		}
	}
	
	$output .= '</ul>';
	$output .= '<input type="hidden" id="slotsl-setting-' . $id . '" name="' . $id . '" value="' . esc_attr( $value ) . '">';
	
	if ( ! empty( $args['desc'] ) ) {
		$output .= '<p class="desc">' . wp_kses_post( $args['desc'] ) . '</p>';
	}
	
	return $output;
}

/**
 * Sanitizes hex color.
 *
 * @param string $color
 *
 * @return string
 */
function slotsl_sanitize_color( $color ) {

	// This pattern will check and match 3/6/8-character hex, rgb, rgba, hsl, & hsla colors.
	$pattern = '/^(\#[\da-f]{3}|\#[\da-f]{6}|\#[\da-f]{8}|rgba\(((\d{1,2}|1\d\d|2([0-4]\d|5[0-5]))\s*,\s*){2}((\d{1,2}|1\d\d|2([0-4]\d|5[0-5]))\s*)(,\s*(0\.\d+|1))\)|hsla\(\s*((\d{1,2}|[1-2]\d{2}|3([0-5]\d|60)))\s*,\s*((\d{1,2}|100)\s*%)\s*,\s*((\d{1,2}|100)\s*%)(,\s*(0\.\d+|1))\)|rgb\(((\d{1,2}|1\d\d|2([0-4]\d|5[0-5]))\s*,\s*){2}((\d{1,2}|1\d\d|2([0-4]\d|5[0-5]))\s*)|hsl\(\s*((\d{1,2}|[1-2]\d{2}|3([0-5]\d|60)))\s*,\s*((\d{1,2}|100)\s*%)\s*,\s*((\d{1,2}|100)\s*%)\))$/';
	\preg_match( $pattern, $color, $matches );
	// Return the 1st match found.
	if ( isset( $matches[0] ) ) {
		if ( is_string( $matches[0] ) ) {
			return $matches[0];
		}
		if ( is_array( $matches[0] ) && isset( $matches[0][0] ) ) {
			return $matches[0][0];
		}
	}
	// If no match was found, return an empty string.
	return '';
}