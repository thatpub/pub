;(function ( app ) {
  "use strict";

  addEvent(app.send_, "click", app.searchStart);

  addEvent(app.query_, "focus", app.handleFocus);

  addEvent(app.query_, "keypress", app.handleInput);

  addEvent(document, "keyup", app.closeModal);

  addEvent(app.moreContent_, "click", app.more);

  addEvent(app.searchRestore_, "click", app.toggleSearch);

  addEvent(app.infiniScroll_, "change", app.infini);

  addEvent(window, "scroll", app.scrollWheeler);

  addEvent(window, "load", function () {
    app.isSearchBoxOpen = regEmerge.test(app.searchWrap_.className);
    app.query_.focus();
  });

  addEvent(document, "DOMContentLoaded", function () {
    FastClick.attach(document.body);
  });

  var loaderEvent = new Event();
  loaderEvent.on("begin", function() {
    swapClass(app.searchWrap_, "", regEmerge);
    swapClass(app.loader_, "loading", regLoad);
  });
  loaderEvent.on("end", function() {
    swapClass(app.loader_, "", regLoad);

    if ( app.isFailure === true ) {
      swapClass(app.searchWrap_, "emerge failed", regFail);
    }
    else if ( app.isFailure === false ) {
      app.wrap_.style.display = "block";
      app.wrap_.style.opacity = 1;
    }
  });

})( app );
