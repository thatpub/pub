;(function () {
  "use strict";

  var regEmerge = / ?emerge/g,
      regHidden = / ?hidden/g,
      regLoad = / ?loading/g,
      regSelected = / ?selected/g,
      regSticky = / ?sticky/g,
      regFiltered = / ?filtered/g;

  app.resultTemplate = document.getElementById("result-template");
  app.relatedTemplate = document.getElementById("related-template");

  function addEvent ( element, evt, fnc ) {
    return ((element.addEventListener) ? element.addEventListener(evt, fnc, false) : element.attachEvent("on" + evt, fnc));
  }

/*  function removeEvent ( element, evt, fnc ) {
    return ((element.removeEventListener) ? element.removeEventListener(evt, fnc, false) : element.detachEvent("on" + evt, fnc));
  }*/

  function colorize() {
    var k = 0,
        c = ['blue', 'green', 'purple', 'pink', 'orange'],
        color = '',
        head = document.head || document.getElementsByTagName("head")[0];
    var sheet = (function() {
      if ( document.getElementById("color-stylez") ) {
        head.removeChild(document.getElementById("color-stylez"));
      }
      var style = document.createElement("style");
      style.appendChild(document.createTextNode(""));
      style.setAttribute("id", "color-stylez");
      head.appendChild(style);
      return style.sheet;
    })();
    for (; k < 5; ++k) {
      color = randomColor({hue: c[k], luminosity: "dark"});
      sheet.addCSSRule(".result.doc.match-" + k, "color: " + color + ";", 0);
      sheet.addCSSRule(".result.doc.match-" + k + ":hover", "border-bottom-color: " + color + ";", 0);
      sheet.addCSSRule(".result.content.match-" + k + " .number", "background-color: "+ color + ";", 0);
      sheet.addCSSRule(".result.content.match-" + k + " .text", "border-left-color: "+ color + ";", 0);
      /*sheet.addCSSRule(".result.content.match-" + k + " .info:hover span", "border-bottom-color: "+ color + "; color: "+ color + ";", 0);*/
      sheet.addCSSRule(".result.content.match-" + k + " em", "color: "+ color + ";", 0);
    }
  }

  function revealText ( event ) {
    if ( event.preventDefault ) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
    this.parentNode.className += " opened";
    return false;
  }

  addEvent(app.searchWrap_, 'transitionend', function ( event ) {
    if ( _.indexOf(app.searchWrap_.className, "emerge") > -1 ) {
      app.query_.focus();
      alert("wtf");
    }
  });

  function filterResults ( event ) {
    var el = ( event ) ? event.currentTarget || event.sourceElement : null;
    var filter = (el) ? el.getAttribute("id") : app.filterBy;
    app.filterBy = filter;
    if ( app.filterBy === "" ) {
      app.filtered_ = null;
      _.forEach(document.querySelectorAll(".doc, .result"), function ( a ) {
        a.className = a.className.replace(regSelected, "");
      });
      app.results_.className = app.results_.className.replace(regFiltered, "");
      return false;
    }
    try {
      el = document.getElementById(filter);
    } catch (error) {
      console.error(error);
    }
    _.forEach(document.querySelectorAll(".selected"), function ( sel ) {
      sel.className = sel.className.replace(regSelected, "");
    });

    app.results_.className = ( _.indexOf(app.results_.className, "filtered") < 0 ) ? app.results_.className + " filtered" : app.results_.className;

    if ( app.filtered_ !== document.querySelectorAll("[data-pub='" + filter + "']") ){
      app.filtered_ = document.querySelectorAll("[data-pub='" + filter + "']");
      _.forEach(app.filtered_, function (found) {
        found.className += " selected";
      });
      if (el) {
        el.className += " selected";
      }
    }
    return false;
  }

  function dataResponse ( httpRequest, action ) {
    var response = JSON.parse(httpRequest.responseText);
    var content = response[0] || null;
    var meta = response[1] || null;
    var expires = new Date(Date.now() + 3600000);

    if ( content && content.hits.total === 0 && meta && meta.hits.total === 0 ) {
      app.wrap_.className += " failed";
      return false;
    }

    app.searchWrap_.className = app.searchWrap_.className.replace(regEmerge, "");
    app.wrap_.className = app.wrap_.className.replace(/ ?done|$/gm, ' done');
    expires = expires.toUTCString();

    if ( content ) {
      app.summary_.className = app.summary_.className.replace(regHidden, "");
      app.term_.innerHTML = "\"" + app.term + "\"";
      app.total_.innerHTML = content.hits.total;
      app.placeContent = content._scroll_id;
      document.cookie = "placeContent=" + app.placeContent + "; expires=" + expires;
      if ( action !== "more" ) {
        colorize();
        if ( window.scroll ) {
          window.scroll(0, 0);
        }
        else if ( window.scrollY ) {
          window.scrollY(0);
        }
        app.scoresContent = _.pluck(content.hits.hits, "_score");
        app.scoresRelatives = _.pluck(content.aggregations.related_doc.buckets, "score");
        app.results_.innerHTML = "";
        app.results_.innerHTML = "<h2 class='label'>Related Documents<br\/><small>(click to filter locally, press ESC to reset)<\/small><\/h2><ul class='related' id='related'>" + app.addItem(content.aggregations.related_doc.buckets, app.relatedTemplate.textContent||app.relatedTemplate.innerText, app.scoresRelatives) + "<\/ul><hr\/>" + app.addItem(content.hits.hits, app.resultTemplate.textContent||app.resultTemplate.innerText, app.scoresContent);
        app.related_ = app.related_ || document.getElementById("related");
        app.relatedRect = app.related_.getBoundingClientRect();
        app.bodyRect = document.body.getBoundingClientRect();
        app.stickyBarPosition = Math.abs(app.relatedRect.top) + Math.abs(app.bodyRect.top) + Math.abs(app.relatedRect.height);
      }
      else {
        app.scoresContent = app.scoresContent.concat(_.pluck(content.hits.hits, "_score"));
        app.results_.innerHTML += app.addItem(content.hits.hits, app.resultTemplate.textContent||app.resultTemplate.innerText, app.scoresContent);
      }

      if ( content.hits.hits.length < 20 ) {
        app.moreContent_.className += " hidden";
        app.loading.stillMore = false;
      }
      else {
        app.moreContent_.className = app.moreContent_.className.replace(regHidden, "");
        app.loading.stillMore = true;
        app.bodyRect = document.body.getBoundingClientRect();
        app.related_ = document.querySelector("#related")||document.getElementById("related");
        app.relatedRect = document.querySelector("#related").getBoundingClientRect();
        app.relatedOffsetTop = Math.abs(app.bodyRect.height) - Math.abs(app.bodyRect.top);
      }

      _.forEach(document.querySelectorAll(".reveal"), function ( opener ) {
        addEvent(opener, "click", revealText);
      });
      _.forEach(document.querySelectorAll(".doc"), function (el) {
        addEvent(el, "click", filterResults);
      });
      filterResults();
    }
    if ( meta ) {
      app.placeMeta = meta._scroll_id;
      document.cookie = "placeMeta=" + app.placeMeta + "; expires=" + expires;
    }
    app.resultsRect = app.results_.getBoundingClientRect();
    app.loading.currentHeight = Math.abs(app.resultsRect.height);
    addEvent(window, "scroll", scrollWheeler);
    addEvent(window, 'DOMMouseScroll', scrollWheeler);
  }

  function scrollWheeler () {
    var t = document.documentElement||document.body.parentNode,
      pos = (t && typeof t.ScrollTop === "number" ? t : document.body).ScrollTop || window.pageYOffset,
      delta = pos - app.pos;

    if ( app.infiniScroll === true && app.loading.now === false && app.loading.stillMore === true && (delta > 0) && pos > app.loading.currentHeight - 1200 ) {
      app.loading.now = true;
      more();
    }

      if ( !app.traveling && pos > app.stickyBarPosition ) {
        app.related_.className += " sticky";
        app.traveling = true;
        console.log("ADD sticky to: ", app.related_);
      }
      if ( app.traveling && pos <= app.stickyBarPosition ) {
        app.related_.className = app.related_.className.replace(regSticky, "");
        app.traveling = false;
        console.log("remove sticky from: ", app.related_);
      }
    app.pos = pos;
  }

  function sendData ( responder, query, type, action, spot, dot, clbk ) {
    var httpRequest = new XMLHttpRequest();
    var url = "http://find.that.pub/" + type + "/" + action;
    /*var urlHx = url + (action !== "more" ?  "/" + encodeURIComponent(query).replace("%20", "+") : "");*/

    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
          responder(httpRequest, action);
          clbk((action === "more") ? app.moreContent_ : app.send_);
        }
      }
    };
    httpRequest.open("POST", url, true);
    httpRequest.setRequestHeader("Content-type", "application/json");
    httpRequest.send(
      JSON.stringify({
        t:app.querySetup(query),
        g:spot,
        s:dot
      })
    );
  }

  function more ( event ) {
    if ( event ) {
      app.moreContent_.className += " loading";
      if ( event.preventDefault ) {
        event.preventDefault();
      } else {
        event.returnValue = false;
      }
    }
    sendData(dataResponse, ( document.cookie.placeContent||app.placeContent ) ? "" : app.term, "content", "more", document.cookie.placeContent||app.placeContent, null, loader);
  }

  function loader( el ) {
    el.className = el.className.replace(regLoad, "");
    app.loading.now = false;
  }

  addEvent(app.query_, "keypress", function ( event ) {
    if ( event.which === 13 ) {
      if ( !app.query_.value ) { /* show notification/input validate here */
        return false;
      }
      app.term = _.trim(app.query_.value);
      app.send_.className += " loading";
      app.filterBy = "";
      sendData(dataResponse, app.term, "content", "search", app.placeContent, app.placeMeta, loader);
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
    if ( !app.query_.value ) { /* show notification/input validate here */
      app.query_.focus();
      return false;
    }
    app.term = _.trim(app.query_.value);
    app.send_.className += " loading";
    app.filterBy = "";
    sendData(dataResponse, app.term, "content", "search", app.placeContent, app.placeMeta, loader);
    if ( event.preventDefault ) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
    return false;
  });
  addEvent(app.moreContent_, "click", more);
  addEvent(app.moreMeta_, "click", function ( event ) {
    this.className += " loading";
    sendData(dataResponse, ( document.cookie.placeMeta||app.placeMeta ) ? "" : app.term, "meta", "more", null, document.cookie.placeMeta||app.placeMeta, loader);
    if ( event.preventDefault ) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
  });
  addEvent(app.searchRestore_, "click", function ( event ) {
    if ( event.preventDefault ) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
    if ( / ?emerge/gi.test(app.searchWrap_.className) ) {
      app.searchWrap_.className = app.searchWrap_.className.replace(/ ?emerge/gmi, "");
      return false;
    }
    else {
      app.query_.value = app.term||"";
      app.searchWrap_.className += " emerge";
    }
    return false;
  });
  addEvent(app.infiniScroll_, "change", function () {
    var status;
    app.infiniScroll = this.checked || (!!this.checked);
    status = (app.infiniScroll) ? "enabled" : "disabled";
    document.getElementById("inf-status").innerHTML = status;
    document.getElementById("inf-status").className = status;
    console.log("changed infiniScroll to (direct, app storage): ", app.infiniScroll, ", ", this.checked, !!this.checked);
    console.log("auto-launching event handler to see if infinite scroll is allowed at scroll location");
    scrollWheeler();
  });
  addEvent(window, "load", function () {
    colorize();
    app.query_.focus();
    if ( window.location.search !== "" ) {
      app.query_.value = decodeURIComponent(window.location.search.slice(3).replace(/\+(?!\%20)/g, "%20"));
      app.term = _.trim(app.query_.value);
      app.send_.click();
    }
  });
})();
