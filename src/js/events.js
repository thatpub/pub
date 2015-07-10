;(function(window, document, _, app, undefined) {
  "use strict";
  addEvent(app.send_, "click", searchStart);

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
    if ( event.which === 13 ) { // ENTER/RETURN key pressed
      searchStart(event);
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
      app.query_.value = app.term;
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
    //var l = document.createElement("link"); l.rel = "stylesheet"; l.href = document.location.protocol + "//fonts.googleapis.com/css?family=Lato:300,700,300italic:latin";
    //var h = document.getElementsByTagName("head")[0]; h.parentNode.insertBefore(l, h);

    var f2 = document.createDocumentFragment();
    var j = document.createElement("script"); j.src = "/js/templates.js";
    f2.appendChild(j);
    document.body.appendChild(f2);
    fastdom.write(function() {
      var f1 = document.createDocumentFragment();
      var l = document.createElement("link"); l.rel = "stylesheet"; l.href = "/css/after.css";
      var h = document.getElementsByTagName("head")[0]; f1.appendChild(l);
      h.appendChild(f1);
    });
  });

  addEvent(document, "DOMContentLoaded", function() {
    FastClick.attach(document.body);
  });

})(this, this.document, _, app);
