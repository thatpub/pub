"use strict";

addEvent(app.send_, "click", function ( event ) {
  event.preventDefault();
  if ( !_.trim(app.query_.value) ) { /* show notification/input validate here */
    app.query_.focus();
    snabbt(app.query_, 'attention', {
      rotation: [0, 0, Math.PI/2],
      springConstant: 1.9,
      springDeacceleration: 0.9
    });
    return false;
  }
  swapClass(app.loader_, "loading", regLoad);
  app.term = _.trim(app.query_.value);
  sendData(dataResponse, app.term, "content", "search", app.placeContent, app.placeMeta, endLoading);
  return false;
});

addEvent(app.query_, "focus", function () {
  return false;
});

addEvent(app.query_, "keypress", function ( event ) {
  if ( event.which === 13 ) {
    app.send_.click();
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
    if (regEmerge.test(document.body.className)) {
      app.searchToggle("hidden");
    }
    else {
      /**
       * DISABLED
       *
       * Until we can handle huge amounts of results, turn this shit off.
       */
      /*filterResults(false);*/
    }
  }
});

addEvent(app.moreContent_, "click", more);

addEvent(app.moreMeta_, "click", function ( event ) {
  if ( event.preventDefault ) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
  swapClass(app.loader_, "loading", regLoad);
  sendData(dataResponse, ( document.cookie.placeMeta||app.placeMeta ) ? "" : app.term, "meta", "more", null, document.cookie.placeMeta||app.placeMeta, endLoading);
  return false;
});

addEvent(app.searchRestore_, "click", function ( event ) {
  event.preventDefault();
  if ( regEmerge.test(document.body.className) ) {
    app.searchToggle("hidden");
  }
  else {
    app.searchToggle("visible");
    app.query_.value = app.term||"";
    app.query_.focus();
  }
  return false;
});

addEvent(app.infiniScroll_, "change", infini);

addEvent(window, "scroll", scrollWheeler);

addEvent(window, "load", function () {
  app.query_.focus();
  // This was a debugging experiment but could actually use later for direct
  // searching from URL.
  //
  // if ( window.location.search !== "" ) {
  //   app.query_.value = decodeURIComponent(window.location.search.slice(3).replace(/\+(?!\%20)/g, "%20"));
  //   app.term = _.trim(app.query_.value);
  //   app.send_.click();
  // }
  var l = document.createElement("link"); l.rel = "stylesheet"; l.type = "text/css";
  // l.href = '//fonts.googleapis.com/css?family=Droid+Serif:400,700|Ubuntu:300,400,700';
  // l.href = '//fonts.googleapis.com/css?family=Cantarell:400,700|Ubuntu:300,700';
  l.href = "https://fonts.googleapis.com/css?family=Cantarell:400,700|Roboto:300,700";
  // var h = document.getElementsByTagName('head')[0]; h.parentNode.insertBefore(l, h);
  document.getElementsByTagName('head')[0].appendChild(l);
  /*app.colorize();*/
});
