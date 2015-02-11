"use strict";

addEvent(app.send_, "click", function ( event ) {
  if ( event.preventDefault ) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
  if ( !app.query_.value ) { /* show notification/input validate here */
    app.query_.focus();
    snabbt(app.query_, 'attention', {
      rotation: [0, 0, Math.PI/2],
      springConstant: 1.9,
      springDeacceleration: 0.9,
    });
    return false;
  }
  app.term = _.trim(app.query_.value);
  swapClass(this, "loading", regLoad);
  sendData(dataResponse, app.term, "content", "search", app.placeContent, app.placeMeta, endLoading);
  return false;
});

addEvent(app.query_, "keypress", function ( event ) {
  if ( event.which === 13 ) {
    if ( this.value ) { /* show notification/input validate here */
      app.send_.click();
    }
    /*app.term = _.trim(app.query_.value);
    app.send_.className += " loading";
    sendData(dataResponse, app.term, "content", "search", app.placeContent, app.placeMeta, endLoading);*/
    return false;
  }
});

addEvent(document, "keyup", function ( event ) {
  if ( event.which === 27 ) {
    if ( event.preventDefault ) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
    if (regEmerge.test(app.wrap_.className)) {
      app.searchToggle("hidden");
    }
    filterResults(false);
    return false;
  }
});

addEvent(app.moreContent_, "click", more);

addEvent(app.moreMeta_, "click", function ( event ) {
  if ( event.preventDefault ) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
  swapClass(this, "loading", regLoad);
  sendData(dataResponse, ( document.cookie.placeMeta||app.placeMeta ) ? "" : app.term, "meta", "more", null, document.cookie.placeMeta||app.placeMeta, endLoading);
  return false;
});

addEvent(app.searchRestore_, "click", function ( event ) {
  if ( event.preventDefault ) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
  if ( regEmerge.test(app.wrap_.className) ) {
    app.searchToggle("hidden");
    app.infiniScroll = app.infiniScrollTemp;
  }
  else {
    app.searchToggle("visible");
    app.infiniScrollTemp = app.infiniScroll;
    app.infiniScroll = false;
    app.query_.value = app.term||"";
  }
  return false;
});

addEvent(app.infiniScroll_, "change", infini);

