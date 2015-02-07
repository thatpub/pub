"use strict";

  var regEmerge = / ?emerge/g,
      regHidden = / ?hidden/g,
      regLoad = / ?loading/g,
      regSelected = / ?selected/g,
      regSticky = / ?sticky/g,
      regFiltered = / ?filtered/g,
      regOpened = / ?opened/g,
      app = App();

  app.resultTemplate = document.getElementById("result-template");
  app.relatedTemplate = document.getElementById("related-template");

  function revealText ( event ) {
    if ( event.preventDefault ) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
    var open = regOpened.test(this.parentNode.className);

    this.innerHTML = null;
    this.parentNode.className = (!open) ?
      this.parentNode.className + " opened" :
      this.parentNode.className.replace(regOpened, "");
    this.appendChild((!open) ?
      document.createTextNode("make it smaller") :
      document.createTextNode("show me more"));

    return false;
  }

  function filterResults ( event ) {
    var el = ( event ) ? event.currentTarget || event.sourceElement : null;
    var filter = (el) ? el.getAttribute("id") : app.filterBy;
    app.filterBy = filter;
    if ( app.filterBy === "" || app.filterBy === "show-all" ) {
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

  function infini () {
    var status;
    app.infiniScroll = this.checked || (!!this.checked);
    status = (app.infiniScroll) ? "enabled" : "disabled";
    app.infiniStatus_.innerHTML = status;
    app.infiniStatus_.className = status;
    if ( !status ) {
      this.removeAttribute("checked");
    }
    scrollWheeler();
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
        app.colorize();
        if ( window.scroll ) {
          window.scroll(0, 0);
        }
        else if ( window.scrollY ) {
          window.scrollY(0);
        }
        app.scoresContent = _.pluck(content.hits.hits, "_score");
        app.scoresRelatives = _.pluck(content.aggregations.related_doc.buckets, "score");
        app.results_.innerHTML = null;
        app.results_.innerHTML = "<h2 class='label'>Related Documents<br\/><small>(click to filter locally, press ESC to reset)<\/small><\/h2><ul class='related' id='related'>" + app.addItem(content.aggregations.related_doc.buckets, app.relatedTemplate.textContent||app.relatedTemplate.innerText, app.scoresRelatives) + "<li class='show-all doc' id='show-all'>Show all<\/li><\/ul><hr\/>" + app.addItem(content.hits.hits, app.resultTemplate.textContent||app.resultTemplate.innerText, app.scoresContent);
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
      addEvent(document.querySelector("#show-all"), filterResults);
      _.forEach(document.querySelectorAll(".text > .reveal"), function ( opener ) {
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
      }
      if ( app.traveling && pos <= app.stickyBarPosition ) {
        app.related_.className = app.related_.className.replace(regSticky, "");
        app.traveling = false;
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
      var el = event.currentTarget || event.sourceElement || this;
      /*app.moreContent_.className += " loading";*/
      el.className += " loading";
      app.loader_ = app.loader(el);
      if ( event.preventDefault ) {
        event.preventDefault();
      } else {
        event.returnValue = false;
      }
    }
    sendData(dataResponse, ( document.cookie.placeContent||app.placeContent ) ? "" : app.term, "content", "more", document.cookie.placeContent||app.placeContent, null, endLoading);
  }

  function endLoading ( el ) {
    el.className = el.className.replace(regLoad, "");
    app.loader_ = null;
    app.loading.now = false;
  }
