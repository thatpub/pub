"use strict";

addEvent(app.send_, "click", app.searchStart);

addEvent(app.query_, "focus", app.handleFocus);

addEvent(app.query_, "keypress", app.handleInput);

addEvent(document, "keyup", app.closeModal);

addEvent(app.moreContent_, "click", app.more);

addEvent(app.searchRestore_, "click", function ( event ) {
  event.preventDefault();
  if ( app.isSearchBoxOpen === true && app.isDone === true && app.isFailure !== true) {
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

addEvent(document, "DOMContentLoaded", function() {
  FastClick.attach(app.wrap_);
});
