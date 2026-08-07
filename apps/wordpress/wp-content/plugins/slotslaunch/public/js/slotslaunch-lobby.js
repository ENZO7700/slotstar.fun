/**
 * Netflix-style Lobby JavaScript
 */

(function($) {
	'use strict';

	$(document).ready(function() {
		initLobbySliders();
	});

	function initLobbySliders() {
		$('.slotsl-lobby-section').each(function() {
			const $section = $(this);
			const $slider = $section.find('.slotsl-lobby-slider');
			const $track = $section.find('.slotsl-lobby-slider-track');
			const $leftArrow = $section.find('.slotsl-lobby-arrow-left');
			const $rightArrow = $section.find('.slotsl-lobby-arrow-right');
			const $items = $section.find('.slotsl-lobby-item');
			
			if ($items.length === 0) {
				return;
			}

			const itemWidth = $items.first().outerWidth(true);
			const containerWidth = $slider.find('.slotsl-lobby-slider-container').width();
			const visibleItems = Math.floor(containerWidth / itemWidth);
			const totalItems = $items.length;
			const maxScroll = Math.max(0, (totalItems - visibleItems) * itemWidth);
			
			let currentPosition = 0;

			// Update arrow states
			function updateArrows() {
				$leftArrow.prop('disabled', currentPosition <= 0);
				$rightArrow.prop('disabled', currentPosition >= maxScroll);
			}

			// Scroll function
			function scrollTo(position) {
				currentPosition = Math.max(0, Math.min(position, maxScroll));
				$track.css('transform', 'translateX(-' + currentPosition + 'px)');
				updateArrows();
			}

			// Left arrow click
			$leftArrow.on('click', function() {
				if (currentPosition > 0) {
					const newPosition = currentPosition - (itemWidth * visibleItems);
					scrollTo(newPosition);
				}
			});

			// Right arrow click
			$rightArrow.on('click', function() {
				if (currentPosition < maxScroll) {
					const newPosition = currentPosition + (itemWidth * visibleItems);
					scrollTo(newPosition);
				}
			});

			// Initialize arrow states
			updateArrows();

			// Handle window resize
			let resizeTimer;
			$(window).on('resize', function() {
				clearTimeout(resizeTimer);
				resizeTimer = setTimeout(function() {
					const newContainerWidth = $slider.find('.slotsl-lobby-slider-container').width();
					const newVisibleItems = Math.floor(newContainerWidth / itemWidth);
					const newMaxScroll = Math.max(0, (totalItems - newVisibleItems) * itemWidth);
					
					if (newMaxScroll !== maxScroll) {
						maxScroll = newMaxScroll;
						currentPosition = Math.min(currentPosition, maxScroll);
						scrollTo(currentPosition);
					}
				}, 250);
			});

			// Touch/swipe support for mobile
			let touchStartX = 0;
			let touchEndX = 0;
			let isDragging = false;
			let startPosition = 0;

			$track.on('touchstart', function(e) {
				touchStartX = e.originalEvent.touches[0].clientX;
				startPosition = currentPosition;
				isDragging = true;
			});

			$track.on('touchmove', function(e) {
				if (!isDragging) return;
				touchEndX = e.originalEvent.touches[0].clientX;
				const diff = touchStartX - touchEndX;
				const newPosition = startPosition + diff;
				scrollTo(Math.max(0, Math.min(newPosition, maxScroll)));
			});

			$track.on('touchend', function() {
				isDragging = false;
			});

			// Mouse drag support for desktop
			let mouseDown = false;
			let mouseStartX = 0;
			let mouseStartPosition = 0;

			$track.on('mousedown', function(e) {
				mouseDown = true;
				mouseStartX = e.clientX;
				mouseStartPosition = currentPosition;
				$track.css('cursor', 'grabbing');
				e.preventDefault();
			});

			$(document).on('mousemove', function(e) {
				if (!mouseDown) return;
				const diff = mouseStartX - e.clientX;
				const newPosition = mouseStartPosition + diff;
				scrollTo(Math.max(0, Math.min(newPosition, maxScroll)));
			});

			$(document).on('mouseup', function() {
				if (mouseDown) {
					mouseDown = false;
					$track.css('cursor', 'grab');
				}
			});
		});
	}

})(jQuery);

