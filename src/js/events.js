;(function(window, document, app, FastClick, undefined) {
  "use strict";
  addEvent(app.send_, "click", app.searchStart);

  addEvent(app.query_, "focus", function () {
    if (app.queryInvalidated !== true) {
      return false;
    }
  });

  // addEvent(app.query_, "keydown", function ( event ) {
    // console.log("code, charCode, keyCode, which, ctrlKey, shiftKey, altKey, metaKey");
    // console.log(event.code, event.charCode, event.keyCode, event.which, event.ctrlKey, event.shiftKey, event.altKey, event.metaKey)
    // console.log("value is currently: ", this.value);

    // if ( regCheckInput.test(this.value) ) {
    //   console.log("good match", event);
    // }
    // else {
    //   console.log("bad match", event);
    //   this.value = this.value.replace(regFixInput, "");
    // }
  // });

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
    //var l = document.createElement("link"); l.rel = "stylesheet"; l.href = document.location.protocol + "//fonts.googleapis.com/css?family=Lato:300,700,300italic:latin";
    //var h = document.getElementsByTagName("head")[0]; h.parentNode.insertBefore(l, h);
  });

  addEvent(document, "DOMContentLoaded", function() {
    FastClick.attach(app.wrap_);
  });

})(this, this.document, app, FastClick);
