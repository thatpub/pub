;(function(window, document, app, undefined) {
  "use strict";
  app.revealText = function ( event ) {
    var that = event.currentTarget||event.srcElement||event.target,
      open;
    event.preventDefault();
    open = that.getAttribute("data-opened");
    if (open !== "true") {
      fastdom.write(function() {
        swapClass(that.parentNode, "opened", regOpened);
        that.innerHTML = "consolidate";
        that.setAttribute("data-opened", "true");
      });
    }
    else {
      fastdom.write(function() {
        swapClass(that.parentNode, "", regOpened);
        that.innerHTML = "expand";
        that.setAttribute("data-opened", "false");
      });
    }
    return false;
  };

  app.more = function ( event ) {
    if ( event && event.preventDefault ) {
      event.preventDefault();
    }
    if ( app.loading.now !== true ) {
      swapClass(app.loader_, "loading", regLoad);
    }
    app.submitQuery("content", "more", document.cookie.placeContent||app.placeContent, null);
    return false;
  }

  app.infini = function ( event ) {
    // There's clearly something...in excess here.  Just not in the mood to care.
    var status, doThis;
    app.infiniScroll = this.checked || (!!this.checked);
    status = (app.infiniScroll) ? "enabled" : "disabled";
    doThis = (app.infiniScroll) ? "Disable" : "Enable";
    app.infiniLabel_.className = status;
    app.infiniLabel_.setAttribute("title", doThis + " infinite scroll");
    if ( !status ) {
      this.removeAttribute("checked");
    }
  };

  app.scrollWheeler = function ( event ) {
    fastdom.read(function() {
      var pos = (rootElement && typeof rootElement.ScrollTop === "number" ? rootElement : document.body).ScrollTop || window.pageYOffset,
        delta = pos - app.pos;
      if ( app.infiniScroll === true && app.loading.now === false && app.loading.stillMore === true && (delta > 0) && pos > (app.loading.currentHeight - 1200) ) {
        app.loading.now = true;
        app.more();
      }
      app.pos = pos;
    });
  };
  app.searchStart = function ( event ) {
    ( event &&
      event.preventDefault &&
      event.preventDefault());
    var that = this,
      val = app.query_.value.trim();
    app.isFailure = false;
    app.isDone = false;
    if ( !val ) { // show notification/input validate here
      app.queryInvalidated = true;
      swapClass(app.query_, "invalidated", regValidate);
      fastdom.write(function() {
        that.message_.innerHTML = "You gotta type something first.";
        that.query_.focus();
      });
      return false;
    }
    app.term = val;
    swapClass(app.loader_, "loading", regLoad);
    app.submitQuery("content", "search", app.placeContent, app.placeMeta);
    return false;
  };

})(this, this.document, app);
