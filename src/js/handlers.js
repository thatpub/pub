"use strict";

function revealText ( event ) {
  var that = this,
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
}

function endLoading () {
  app.loading.now = false;
  app.loading.init = false;
  swapClass(app.loader_, "", regLoad);
  if (app.isFailure !== true) {
    app.searchBoxToggle("close");
  }
  return false;
}

function modalClose ( event ) {
  if ( event.target === event.currentTarget ) {
    app.searchBoxToggle("close");
  }
}

function more ( event ) {
  if ( event && event.preventDefault ) {
    event.preventDefault();
  }
  if ( app.loading.now !== true ) {
    swapClass(app.loader_, "loading", regLoad);
  }
  submitQuery("content", "more", document.cookie.placeContent||app.placeContent, null);
  return false;
}

function infini ( event ) {
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
}

function scrollWheeler ( event ) {
  fastdom.read(function() {
    var pos = (rootElement && typeof rootElement.ScrollTop === "number" ? rootElement : document.body).ScrollTop || window.pageYOffset,
      delta = pos - app.pos;
    if ( app.infiniScroll === true && app.loading.now === false && app.loading.stillMore === true && (delta > 0) && pos > (app.loading.currentHeight - 1200) ) {
      app.loading.now = true;
      more();
    }
    app.pos = pos;
  });
}

function searchStart ( event ) {
  ( event &&
    event.preventDefault &&
    event.preventDefault());
  var val = app.query_.value.trim();
  app.isFailure = false;
  app.isDone = false;
  if ( !val ) { // show notification/input validate here
    app.queryInvalidated = true;
    swapClass(app.query_, "invalidated", regValidate);
    fastdom.write(function() {
      app.message_.innerHTML = "You gotta type something first.";
      app.query_.focus();
    });
    return false;
  }
  app.term = val;
  swapClass(app.loader_, "loading", regLoad);
  submitQuery("content", "search", app.placeContent, app.placeMeta);
  return false;
}
