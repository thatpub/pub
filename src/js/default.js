"use strict";

  var app = App();

  app.resultTemplate = document.getElementById("result-template");
  app.relatedTemplate = document.getElementById("related-template");

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

  function revealText ( event ) {
    var open = regOpened.test(this.parentNode.className);
    this.innerHTML = "";
    if (!open) {
      swapClass(this.parentNode, "opened", regOpened);
      this.appendChild(document.createTextNode("make it smaller"));
    }
    else {
      this.parentNode.className = this.parentNode.className.replace(regOpened, "");
      this.appendChild(document.createTextNode("tell me more"));
    }
    if ( event.preventDefault ) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
    return false;
  }

  function filterResults ( event ) {
    /**
     * DISABLED
     *
     * Until we can handle huge amounts of results, turn this shit off.
     */
    return false;

    var filter, reset, group, count,
      rl = app.selectedResults.length,
      i = 0,
      j = 0,
      exists = -1,
      el = ( event ) ? event.currentTarget || event.sourceElement || null : this;
    if ( event && event.preventDefault ) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
    if ( event && event !== false && event !== true ) {
      filter = el.getAttribute("id") || el.id;
      /**
       * Grab all the elements matching the filter and put in `group`
       * with the total number stored in `count`
       */
      group = document.querySelectorAll("[data-pub='" + filter + "']");
      count = group.length;
      /**
       * Test the filter value against any others that may have been
       * stored for future reference in `app.selectedResults`
       */
      for (; j < rl; ++j) {
        if ( app.selectedResults[j] == filter ) {
          exists = j;
          break;
        }
      }
      /**
       * REMOVE FILTER
       *
       * If the filter has already been selected, then this is the time
       * to remove it from the list and reset the elements to non-selectedness.
       */
      if ( exists > -1 ) {
        for (; i < count; ++i) {
          swapClass(group[i], "", regSelected);
        }
        app.selectedResults.splice(exists, 1);
        app.selectedTotal = ( (app.selectedTotal - count) > 0 ) ?
          app.selectedTotal - count : 0;
        if ( el ) {
          swapClass(el, "", regSelected);
        }
      }
      else {
        for (; i < count; ++i) {
          swapClass(group[i], "selected", regSelected);
        }
        app.selectedResults.splice(app.selectedResults.length, 0, filter);
        app.selectedTotal = app.selectedTotal + count;
        if ( el ) {
          swapClass(el, "selected", regSelected);
        }
      }
      app.count_.innerHTML = app.selectedTotal;
      swapClass(app.wrap_, "filtered", regFiltered);
    }
    else if ( event === false ) {
      /**
       * Least likely to run.
       *
       * This happens when a brand new search runs and everything
       * needs to be reset from the old one.
       *
       * Housekeeping, basically.
       */
      app.selectedResults = [];
      app.selectedTotal = 0;
      /*reset = document.querySelectorAll(".selected");
      rl = reset.length;
      for (; i < rl; ++i) {
        swapClass(reset[i], "", regSelected);
      }*/
      swapClass(app.wrap_, "", regFiltered);
      app.count_.innerHTML = app.scoresContent.length;
      return false;
    }
    return false;
  }

  function dataResponse ( httpRequest, action ) {
    var response = JSON.parse(httpRequest.responseText);
    var content = response[0] || null;
    var meta = response[1] || null;
    var expires = new Date(Date.now() + 3600000);
    var docs, dl,
      a = 0,
      b = 0,
      reveals,
      rl;
    if ( content && content.hits.total === 0 && meta && meta.hits.total === 0 ) {
      return app.isDone(false);
    }

    /*swapClass(document.body, "emerge", regEmerge);*/
    app.isDone(true);
    expires = expires.toUTCString();

    if ( content ) {
      app.term_.innerHTML = app.term;
      app.total_.innerHTML = content.hits.total;
      app.placeContent = content._scroll_id;
      document.cookie = "placeContent=" + app.placeContent + "; expires=" + expires;
      if ( action !== "more" ) {
        app.colorize();
        window.scroll(0, 0);
        app.scoresContent = _.pluck(content.hits.hits, "_score");
        app.scoresRelatives = _.pluck(content.aggregations.related_doc.buckets, "score");

        app.related_.innerHTML = app.addItem(content.aggregations.related_doc.buckets, app.relatedTemplate.textContent||app.relatedTemplate.innerText, app.scoresRelatives);
        app.results_.innerHTML = app.addItem(content.hits.hits, app.resultTemplate.textContent||app.resultTemplate.innerText, app.scoresContent);
        app.count_.innerHTML = app.scoresContent.length;

        /**
         * DISABLED
         *
         * Until we can handle huge amounts of results, turn this shit off.
         */
        /*docs = document.querySelectorAll("#related .doc");
        dl = docs.length;
        for (; b < dl; ++b) {
          addEvent(docs[b], "click", filterResults);
        }*/
        app.relatedRect = app.related_.getBoundingClientRect();
        app.bodyRect = document.body.getBoundingClientRect();
        app.stickyBarPosition = Math.abs(app.relatedRect.top) + Math.abs(app.bodyRect.top) + Math.abs(app.relatedRect.height);
      }
      else {
        app.scoresContent = app.scoresContent.concat(_.pluck(content.hits.hits, "_score"));
        app.results_.innerHTML += app.addItem(content.hits.hits, app.resultTemplate.textContent||app.resultTemplate.innerText, app.scoresContent);
        app.count_.innerHTML = app.scoresContent.length;
      }

      reveals = document.querySelectorAll(".text > .reveal");
      rl = reveals.length;
      for (; a < rl; ++a) {
        addEvent(reveals[a], "click", revealText);
      }

      if ( content.hits.hits.length < 20 ) {
        swapClass(app.moreContent_, "hidden", regHidden);
        app.loading.stillMore = false;
      }
      else {
        swapClass(app.moreContent_, "", regHidden);
        app.loading.stillMore = true;

        /**
         * DISABLED
         *
         * Until we can handle huge amounts of results, turn this shit off.
         */
        /*app.bodyRect = document.body.getBoundingClientRect();
        app.related_ = document.querySelector("#related")||document.getElementById("related");
        app.relatedRect = document.querySelector("#related").getBoundingClientRect();
        app.relatedOffsetTop = Math.abs(app.bodyRect.height) - Math.abs(app.bodyRect.top);*/
      }

      /*filterResults(action === "more");*/
    }

    if ( meta ) {
      app.placeMeta = meta._scroll_id;
      document.cookie = "placeMeta=" + app.placeMeta + "; expires=" + expires;
    }
    app.resultsRect = app.results_.getBoundingClientRect();
    app.loading.currentHeight = Math.abs(app.resultsRect.height);
  }

  function sendData ( responder, query, type, action, spot, dot, clbk ) {
    var httpRequest = new XMLHttpRequest();
    var url = "http://find.that.pub/" + type + "/" + action;
    /*var urlHx = url + (action !== "more" ?  "/" + encodeURIComponent(query).replace("%20", "+") : "");*/

    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
          responder(httpRequest, action);
          clbk((action === "more") ? null : "");
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
    if (event) {
      if ( event.preventDefault ) {
        event.preventDefault();
      } else {
        event.returnValue = false;
      }
    }
    swapClass(app.moreContent_, "loading", regLoad);
    sendData(dataResponse, ( document.cookie.placeContent||app.placeContent ) ? "" : app.term, "content", "more", document.cookie.placeContent||app.placeContent, null, endLoading);
    return false;
  }

  function scrollWheeler () {
    var t = document.documentElement||document.body.parentNode,
      pos = (t && typeof t.ScrollTop === "number" ? t : document.body).ScrollTop || window.pageYOffset,
      delta = pos - app.pos;

    if ( app.infiniScroll === true && app.loading.now === false && app.loading.stillMore === true && (delta > 0) && pos > app.loading.currentHeight - 1200 ) {
      app.loading.now = true;
      more();
    }

    /**
     * DISABLED
     *
     * Until we can handle huge amounts of results, turn this shit off.
     */
    /*if ( !app.traveling && pos > app.stickyBarPosition ) {
      swapClass(app.related_, "sticky", regSticky);
      app.traveling = true;
    }
    if ( app.traveling && pos <= app.stickyBarPosition ) {
      swapClass(app.related_, "", regSticky);
      app.traveling = false;
    }*/
    app.pos = pos;
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
  }

  function endLoading ( el ) {
    el = ( el === null ) ? app.moreContent_ :
      ( el === "" ) ? app.send_ : null;

    swapClass(el, "", regLoad);
    app.loading.now = false;
    if ( el == app.send_ ) {
      app.searchToggle("hidden");
    }
  }
