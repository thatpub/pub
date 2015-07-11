require(['fastdom', 'fastclick', 'app'], function (fastdom, FastClick, app) {

  require(['helpers', 'handlers'], function () {
    "use strict";

    addEvent(app.send_, "click", app.searchStart);

    addEvent(app.query_, "focus", function () {
      if ( app.queryInvalidated !== true ) {
        return false;
      }
    });

    addEvent(app.query_, "keypress", function ( event ) {
      if ( app.queryInvalidated === true ) {
        app.queryInvalidated = false;
        swapClass(app.query_, "", regValidate);
        app.message_.innerHTML = "";
      }
      if ( event.which === 13 && app.isSearchBoxOpen === true ) {
        // ENTER/RETURN key pressed
        app.searchStart(event);
        return false;
      }
    });

    addEvent(document, "keyup", function ( event ) {
      if ( event.which === 27 ) {
        // ESC key pressed
        event.preventDefault();
        if ( app.isSearchBoxOpen === true && app.isFailure !== true ) {
          app.searchBoxToggle("close");
        }
      }
    });

    addEvent(app.moreContent_, "click", app.more);

    addEvent(app.searchRestore_, "click", function ( event ) {
      event.preventDefault();
      if ( app.isSearchBoxOpen === true &&
        app.isDone === true &&
        app.isFailure !== true ) {
        app.searchBoxToggle("close");
      }
      else {
        app.searchBoxToggle("open");
        app.query_.value = app.term;
        app.query_.focus();
      }
      return false;
    });

    addEvent(app.infiniScroll_, "change", app.infini);

    addEvent(window, "scroll", app.scrollWheeler);

    addEvent(window, "load", function () {
      app.isSearchBoxOpen = true;
      app.isDone = false;
      app.query_.focus();
    });

    addEvent(document, "DOMContentLoaded", function () {
      FastClick.attach(app.wrap_);
    });

  });
});
