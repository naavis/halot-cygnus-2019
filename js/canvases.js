(function() {
  var eventEmitter = new EventEmitter();

  window.canvas_defaults = {
    addListener: function(event, listener) {
      eventEmitter.addListener(event, listener);
    },
    paused: false,
    wireframe: false
  };

  window.canvases = {};
  function createCanvas($el) {
    var index = $el.data('content');
    var instance = window.canvases[index].initialize($el[0]);
    $el.data('instance', instance);
    return instance;
  }

  function runCurrentCanvas(currentSlide) {
    $(currentSlide)
      .find('[data-content]')
      .each(function() {
        var instance = createCanvas($(this));
        if (instance) instance.active = true;
      });
  }

  window.initializeCanvases = function() {
    runCurrentCanvas($('section.present'));

    // Activate appropriate canvas on slide change.
    Reveal.addEventListener('slidechanged', function(event) {
      // Clear all slides
      $('[data-content]').each(function() {
        var instance = $(this).data('instance');
        if (instance) instance.active = false;
      });

      var currentSlide = event.currentSlide;
      runCurrentCanvas(currentSlide);
    });

    eventEmitter.emitEvent('initialized');
  };
})();
