"use strict";
addEvent(app.query_, "keypress", function ( event ) {
  if ( event.which === 13 ) {
    if ( !app.query_.value ) { /* show notification/input validate here */
      return false;
    }
    app.term = _.trim(app.query_.value);
    app.send_.className += " loading";
    app.loader_ = app.loader(el);
    app.filterBy = "";
    sendData(dataResponse, app.term, "content", "search", app.placeContent, app.placeMeta, endLoading);
    return false;
  }
});
addEvent(document, "keyup", function ( event ) {
  if ( event.which === 27 ) {
    if (/emerge/g.test(app.searchWrap_.className)) {
      app.searchWrap_.className = app.searchWrap_.className.replace(regEmerge, "");
    }
    app.filterBy = "";
    filterResults();
  }
});
addEvent(app.send_, "click", function ( event ) {
  var el = event.currentTarget || event.sourceElement || this;
  if ( event.preventDefault ) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
  if ( !app.query_.value ) { /* show notification/input validate here */
    app.query_.focus();
    return false;
  }
  app.term = _.trim(app.query_.value);
  el.className += " loading";
  app.loader_ = app.loader(el);
  app.filterBy = "";
  sendData(dataResponse, app.term, "content", "search", app.placeContent, app.placeMeta, endLoading);
  return false;
});
addEvent(app.moreContent_, "click", more);
addEvent(app.moreMeta_, "click", function ( event ) {
  var el = event.currentTarget || event.sourceElement || this;
  if ( event.preventDefault ) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
  el.className += " loading";
  app.loader_ = app.loader(el);
  sendData(dataResponse, ( document.cookie.placeMeta||app.placeMeta ) ? "" : app.term, "meta", "more", null, document.cookie.placeMeta||app.placeMeta, endLoading);

});
addEvent(app.searchRestore_, "click", function ( event ) {
  if ( event.preventDefault ) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
  var screenHeight = window.innerHeight;
  if ( regEmerge.test(app.searchWrap_.className) ) {
    if ( !/no-js/g.test(document.body.parentNode.className) ) {
      snabbt(app.searchWrap_, {
        position: [0, -screenHeight, 0],
        easing: 'spring',
        springConstant: 0.3,
        springDeacceleration: 0.8,
        duration: 150
      });
    }
    app.searchWrap_.className = app.searchWrap_.className.replace(regEmerge, "");
    return false;
  }
  else {
    app.query_.value = app.term||"";
    if ( !/no-js/g.test(document.body.parentNode.className) ) {
      snabbt(app.searchWrap_, {
        position: [0, 0, 0],
        easing: 'spring',
        springConstant: 0.3,
        springDeacceleration: 0.8,
        duration: 150
      });
    }
    app.searchWrap_.className += " emerge";
  }
  return false;
});
/*addEvent(app.searchWrap_, 'webkitTransitionEnd', function () {
  if ( regEmerge.test(app.searchWrap_.className) ) {
    app.query_.focus();
  }
});*/
/*addEvent(app.searchWrap_, 'transitionend', function () {
  if ( regEmerge.test(app.searchWrap_.className) ) {
    app.query_.focus();
  }
});*/
addEvent(app.infiniScroll_, "change", infini);
addEvent(window, "load", function () {
  var cb = function() {
    var l = document.createElement('link'); l.rel = 'stylesheet';
    l.href = '//fonts.googleapis.com/css?family=Droid+Serif:400,700|Montserrat:400,700';
    var h = document.getElementsByTagName('head')[0]; h.parentNode.insertBefore(l, h);
  };
  app.query_.focus();
  if ( window.location.search !== "" ) {
    app.query_.value = decodeURIComponent(window.location.search.slice(3).replace(/\+(?!\%20)/g, "%20"));
    app.term = _.trim(app.query_.value);
    app.send_.click();
  }
  cb();
  app.colorize();
});
