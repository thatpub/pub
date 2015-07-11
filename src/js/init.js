;(function ( app ) {
  "use strict";

  addEvent(app.send_, "click", app.searchStart);

  addEvent(app.query_, "focus", app.handleFocus);

  addEvent(app.query_, "keypress", app.handleInput);

  addEvent(app.searchWrap_, "keyup", app.closeModal);

  addEvent(app.moreContent_, "click", app.more);

  addEvent(app.searchRestore_, "click", app.searchBoxToggle);

  addEvent(app.infiniScroll_, "change", app.infini);

  addEvent(window, "scroll", app.scrollWheeler);

  addEvent(window, "load", function () {
    app.isSearchBoxOpen = regEmerge.test(app.searchWrap_.className);
    app.query_.focus();
  });

  addEvent(document, "DOMContentLoaded", function () {
    FastClick.attach(document.body);
  });

})( app );
