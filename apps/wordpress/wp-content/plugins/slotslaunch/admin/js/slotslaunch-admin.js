(function( $ ) {
	'use strict';
	$(document).ready(function (){
		$('.notice').show();


		$('.slotsl-color-picker').spectrum({
			showAlpha: true,
			allowEmpty: true,
			showInput: true,
			preferredFormat: "hsl",
		});

		$( '.choicesjs-select' ).each( function() {
			const $this = $( this ),
				args  = { searchEnabled: false };
			if ( $this.attr( 'multiple' ) ) {
				args.searchEnabled = true;
				args.removeItemButton = true;
			}
			if ( $this.data( 'placeholder' ) ) {
				args.placeholderValue = $this.data( 'placeholder' );
			}
			if ( $this.data( 'sorting' ) === 'off' ) {
				args.shouldSort = false;
			}
			if ( $this.data( 'search' ) ) {
				args.searchEnabled = true;
			}
			new Choices( $this[0], args );
		});

		// Initialize sortable lists
		$( '.slotsl-sortable-list' ).each( function() {
			const $list = $( this );
			const $hiddenInput = $list.siblings( 'input[type="hidden"]' );
			
			$list.sortable({
				handle: '.slotsl-sortable-handle',
				axis: 'y',
				update: function( event, ui ) {
					const order = [];
					$list.find( '.slotsl-sortable-item' ).each( function() {
						order.push( $( this ).data( 'section' ) );
					});
					$hiddenInput.val( order.join( ',' ) );
				}
			});
		});
	});
	$('.sl-import-btn').on( 'click', function (e) {
		e.preventDefault();
		var button = $(this);
		button.prop('disabled', true).addClass('btn-spinner');
		$.ajax({
			'url': slotsl.ajax_url,
			'method': 'POST',
			'dataType': 'json',
			'data': {action: 'slots_save_import', providers: $('.sl-providers').val()},
			'success': function (response) {
				if (response.error) {
					$('#response_error').html('<p style="color:red">' + response.error + '</p>').hide().fadeIn();
					button.prop('disabled', false).removeClass('btn-spinner');
				}
				if (response.success) {
					button.prop('disabled', false).removeClass('btn-spinner');
					$('.sl-import-btn').off('click');
					$(this).click();
					$('#response_error').html('<p style="color:green">' + response.data + '</p>').hide().fadeIn();
				}
			},
			'error': function (response) {
				$('#response_error').html('<p style="color:red">' + response.error + '</p>').hide().fadeIn();
				button.prop('disabled', false).removeClass('btn-spinner');
			}
		});
	});
	$('.sl-settings-ajax-button').on('click', function (e) {
		e.preventDefault();
		var button = $(this);
		button.prop('disabled', true).addClass('btn-spinner');
		$.ajax({
			'url': slotsl.ajax_url,
			'method': 'POST',
			'dataType': 'json',
			'data': {action: button.data('action'), value: button.data('value')},
			'success': function (response) {
				if (response.error) {
					$('#response_error-'+button.data('id')).html('<p style="color:red">' + response.error + '</p>').hide().fadeIn();
					button.prop('disabled', false).removeClass('btn-spinner');
				}
				if (response.success) {
					button.prop('disabled', false).removeClass('btn-spinner');

					$('#response_error-'+button.data('id')).html('<p style="color:green">' + response.data + '</p>').hide().fadeIn();
				}
			},
			'error': function (response) {
				$('#response_error').html('<p style="color:red">' + response.error + '</p>').hide().fadeIn();
				button.prop('disabled', false).removeClass('btn-spinner');
			}
		});
	});
	$('.sl-check-license,.slotsl-setting-license-key-verify').on('click', function (e) {

		e.preventDefault();
		var button = $(this),
			license = $('#license').val();
		button.prop('disabled', true).addClass('btn-spinner');
		$.ajax({
			'url': slotsl.ajax_url,
			'method': 'POST',
			'dataType': 'json',
			'data': {action: 'slots_check_license', license: license},
			'success': function (response) {
				if (response.error) {
					$('#response_error').html('<p style="color:red">' + response.error + '</p>').hide().fadeIn();
					button.prop('disabled', false).removeClass('btn-spinner');
				}
				if (response.success) {
					button.prop('disabled', false).removeClass('btn-spinner');
					$('.sl-check-license').off('click').click();
					button.prop('disabled', false);
					$('#response_error').html('<p style="color:green">' + response.success + '</p>').hide().fadeIn();
				}
			},
			'error': function (response) {
				$('#response_error').html('<p style="color:red">' + response.error + '</p>').hide().fadeIn();
				$('#license').removeClass('geot_license_valid')
				button.prop('disabled', false).removeClass('btn-spinner');
			}
		});
	});

})( jQuery );
