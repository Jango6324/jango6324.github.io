window.HELP_IMPROVE_VIDEOJS = false;


$(document).ready(function() {
    // Check for click events on the navbar burger icon

    var options = {
			slidesToScroll: 1,
			slidesToShow: 1,
			loop: true,
			infinite: true,
			autoplay: true,
			autoplaySpeed: 5000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

		function restartAutoplay(carousel) {
			if (!carousel || !carousel.options || !carousel.options.autoplay) {
				return;
			}

			if (typeof carousel.stop === 'function') {
				carousel.stop();
			}
			if (typeof carousel.start === 'function') {
				carousel.start();
			}
		}

		function isManualControlTarget(target) {
			if (!target || typeof target.closest !== 'function') {
				return false;
			}

			return !!target.closest('.slider-navigation-next, .slider-navigation-previous, .slider-page');
		}

		(carousels || []).forEach(function(carousel) {
			if (!carousel || !carousel.wrapper) {
				return;
			}

			carousel.wrapper.addEventListener('click', function(event) {
				if (isManualControlTarget(event.target)) {
					restartAutoplay(carousel);
				}
			});

			carousel.wrapper.addEventListener('touchend', function() {
				restartAutoplay(carousel);
			}, { passive: true });
		});
	
    bulmaSlider.attach();

})
