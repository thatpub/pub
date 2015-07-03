"use strict";

addEvent(app.send_, "click", function ( event ) {
  event.preventDefault();
  var val = _.trim(app.query_.value);
  if ( !val ) { // show notification/input validate here
    app.queryInvalidated = true;
    swapClass(app.query_, "invalidated", regValidate);
    app.message_.appendChild(document.createTextNode("You gotta type something first."));
    app.query_.focus();
    return false;
  }
  swapClass(app.loader_, "loading", regLoad);
  if ( app.isSearchOpen === true ) {
    app.loading.init = true;
    app.searchToggle("close");
  }
  app.term = _.trim(app.query_.value);
  sendData(dataResponse, app.term, "content", "search", app.placeContent, app.placeMeta, endLoading);
  return false;
});

addEvent(app.query_, "focus", function () {
  if (app.queryInvalidated !== true) {
    return false;
  }
});

addEvent(app.query_, "keypress", function ( event ) {
  if ( app.queryInvalidated === true ) {
    app.queryInvalidated = false;
    swapClass(app.query_, "", regValidate);
    app.message_.innerHTML = "";
  }
  // this.value = this.value.replace(regFixInput, "");
  if ( regFixInput.test(this.value) ) {
    console.log(event);
    return false;
  }
  if ( event.which === 13 ) { // ENTER/RETURN key pressed
    app.send_.click();
    return false;
  }
});

addEvent(document, "keyup", function ( event ) {
  if ( event.which === 27 ) { // ESC key pressed
    event.preventDefault();
    if ( app.isSearchOpen === true && app.isFailure !== true ) {
      app.searchToggle("close");
    }
    // else {
      // DISABLED
      // Until we can handle huge amounts of results, turn this shit off.

      // filterResults(false);
    // }
  }
});

addEvent(app.moreContent_, "click", more);

addEvent(app.noResults_.getElementsByTagName("a")[0], "click", function ( event ) {
  event.preventDefault();
  if ( app.isSearchOpen !== true ) {
    console.log("Search box is closed apparently");
    console.log(app.isDone, app.isFailure, app.loading)
    app.searchToggle("open");
  }
  app.query_.value = "";
  app.query_.focus();
});

addEvent(app.searchRestore_, "click", function ( event ) {
  event.preventDefault();
  if ( app.isSearchOpen === true ) {
    if ( app.isDone === true && app.isFailure !== true ) {
      app.searchToggle("close");
    }
    else {
      return false;
    }
  }
  else {
    app.searchToggle("open");
    app.query_.value = app.term||"";
    app.query_.focus();
  }
  return false;
});

addEvent(app.infiniScroll_, "change", infini);

addEvent(window, "scroll", scrollWheeler);

addEvent(window, "load", function () {
  app.isSearchOpen = true;
  app.isDone = false;
  app.query_.focus();
  var l = document.createElement("link"); l.rel = "stylesheet"; l.href = document.location.protocol + "//fonts.googleapis.com/css?family=Lato:300,700,300italic:latin";
  var h = document.getElementsByTagName('head')[0]; h.parentNode.insertBefore(l, h);
  // h.appendChild(l);
  // app.colorize();
});
