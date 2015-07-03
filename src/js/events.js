"use strict";

addEvent(app.send_, "click", function ( event ) {
  event.preventDefault();
  var val = _.trim(app.query_.value);
  if ( !val ) { // show notification/input validate here
    app.queryInvalidated = true;
    swapClass(app.query_, "invalidated", regValidate);
    app.message_.innerHTML = null;
    app.message_.appendChild(txt("You gotta type something first."));
    app.query_.focus();
    return false;
  }
  swapClass(app.loader_, "loading", regLoad);
  app.term = _.trim(app.query_.value);
  submitQuery(handleResponse, app.term, "content", "search", app.placeContent, app.placeMeta, endLoading);
  return false;
});

addEvent(app.query_, "focus", function () {
  if (app.queryInvalidated !== true) {
    return false;
  }
});

addEvent(app.query_, "keydown", function ( event ) {
  console.log("code, charCode, keyCode, which, ctrlKey, shiftKey, altKey, metaKey");
  console.log(event.code, event.charCode, event.keyCode, event.which, event.ctrlKey, event.shiftKey, event.altKey, event.metaKey)
  console.log("value is currently: ", this.value);

  // if ( regCheckInput.test(this.value) ) {
  //   console.log("good match", event);
  // }
  // else {
  //   console.log("bad match", event);
  //   this.value = this.value.replace(regFixInput, "");
  // }
});

addEvent(app.query_, "keypress", function ( event ) {
  if ( app.queryInvalidated === true ) {
    app.queryInvalidated = false;
    swapClass(app.query_, "", regValidate);
    app.message_.innerHTML = "";
  }
  if ( event.which === 13 ) { // ENTER/RETURN key pressed
    app.send_.click();
    return false;
  }
});

addEvent(document, "keyup", function ( event ) {
  if ( event.which === 27 ) { // ESC key pressed
    event.preventDefault();
    if ( app.isSearchBoxOpen === true && app.isFailure !== true ) {
      app.searchBoxToggle("close");
    }
  }
});

addEvent(app.moreContent_, "click", more);

addEvent(app.searchRestore_, "click", function ( event ) {
  event.preventDefault();
  if ( app.isSearchBoxOpen === true ) {
    if ( app.isDone === true && app.isFailure !== true ) {
      app.searchBoxToggle("close");
    }
    else {
      return false;
    }
  }
  else {
    app.searchBoxToggle("open");
    app.query_.value = app.term||"";
    app.query_.focus();
  }
  return false;
});

addEvent(app.infiniScroll_, "change", infini);

addEvent(window, "scroll", scrollWheeler);

addEvent(window, "load", function () {
  app.isSearchBoxOpen = true;
  app.isDone = false;
  app.query_.focus();
  var l = document.createElement("link"); l.rel = "stylesheet"; l.href = document.location.protocol + "//fonts.googleapis.com/css?family=Lato:300,700,300italic:latin";
  var h = document.getElementsByTagName("head")[0]; h.parentNode.insertBefore(l, h);
});
