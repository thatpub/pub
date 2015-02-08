"use strict";
addEvent(app.query_, "keypress", function ( event ) {
  if ( event.which === 13 ) {
    if ( !this.value ) { /* show notification/input validate here */
      return false;
    }
    app.send_.click();
    /*app.term = _.trim(app.query_.value);
    app.send_.className += " loading";
    sendData(dataResponse, app.term, "content", "search", app.placeContent, app.placeMeta, endLoading);*/
    return false;
  }
});
addEvent(document, "keyup", function ( event ) {
  if ( event.which === 27 ) {
    if (regEmerge.test(app.searchWrap_.className)) {
      app.searchWrap_.className = app.searchWrap_.className.replace(regEmerge, "");
    }
    filterResults();
  }
});
addEvent(app.send_, "click", function () {
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
  classAdd(this, "loading", regLoad);
  sendData(dataResponse, app.term, "content", "search", app.placeContent, app.placeMeta, endLoading);
  return false;
});
addEvent(app.moreContent_, "click", more);
addEvent(app.moreMeta_, "click", function () {
  classAdd(this, "loading", regLoad);
  sendData(dataResponse, ( document.cookie.placeMeta||app.placeMeta ) ? "" : app.term, "meta", "more", null, document.cookie.placeMeta||app.placeMeta, endLoading);
});

addEvent(app.searchRestore_, "click", function () {
  var screenHeight = window.innerHeight;
  if ( regEmerge.test(app.searchWrap_.className) ) {
    snabbt(app.searchWrap_, {
      position: [0, -screenHeight, 0],
      easing: 'spring',
      springConstant: 0.3,
      springDeacceleration: 0.8,
      duration: 150
    }, function() {
    });
    app.searchWrap_.className = app.searchWrap_.className.replace(regEmerge, "");
  }
  else {
    app.query_.value = app.term||"";
    snabbt(app.searchWrap_, {
      position: [0, 0, 0],
      easing: 'spring',
      springConstant: 0.3,
      springDeacceleration: 0.8,
      duration: 150
    }, function() {
    });
    classAdd(app.searchWrap_, "emerge", regEmerge);
  }
  return false;
});

addEvent(app.infiniScroll_, "change", infini);

addEvent(window, "load", function () {
  app.query_.focus();
  if ( window.location.search !== "" ) {
    app.query_.value = decodeURIComponent(window.location.search.slice(3).replace(/\+(?!\%20)/g, "%20"));
    app.term = _.trim(app.query_.value);
    app.send_.click();
  }
  var l = document.createElement('link'); l.rel = 'stylesheet';
  l.href = '//fonts.googleapis.com/css?family=Droid+Serif:400,700|Montserrat:400,700';
  var h = document.getElementsByTagName('head')[0]; h.parentNode.insertBefore(l, h);
  app.colorize();
});
