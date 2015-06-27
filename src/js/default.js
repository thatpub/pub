"use strict";

  var app = new App();

  app.resultTemplate = document.getElementById("result-template");
  app.relatedTemplate = document.getElementById("related-template");

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

/**
 * Placeholder for filterResults() definition.
 */

  function dataResponse ( httpRequest, action ) {
    var response = JSON.parse(httpRequest.responseText);
    var content = response[0] || null;
    var meta = response[1] || null;
    var expires = new Date(Date.now() + 3600000);
    var a = 0,
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
      var currentContent = content.hits.hits.length;
      app.term_.innerHTML = app.term;
      app.total_.innerHTML = content.hits.total;
      app.placeContent = content._scroll_id;
      document.cookie = "placeContent=" + app.placeContent + "; expires=" + expires;
      if ( action !== "more" ) {
        var currentRelatives = content.aggregations.related_doc.buckets.length;
        /*app.colorize();*/
        window.scroll(0, 0);
        for (; b < currentContent; ++b) {
          app.scoresContent[b] = content.hits.hits[b]["_score"];
        }
        for (b = 0; b < currentRelatives; ++b) {
          app.scoresContent[b] = content.aggregations.related_doc.buckets[b]["score"];
        }
        app.related_.innerHTML = app.addItem(content.aggregations.related_doc.buckets, app.relatedTemplate.textContent||app.relatedTemplate.innerText, app.scoresRelatives);
        app.results_.innerHTML = app.addItem(content.hits.hits, app.resultTemplate.textContent||app.resultTemplate.innerText, app.scoresContent);
        app.count_.innerHTML = currentContent;

        /**
         * DISABLED
         *
         * Until we can handle huge amounts of results, turn this shit off.
         */
        /*
        var docs = document.querySelectorAll("#related .doc");
        var dl = docs.length;
        for (; b < dl; ++b) {
          addEvent(docs[b], "click", filterResults);
        }
        */
        app.relatedRect = app.related_.getBoundingClientRect();
        app.bodyRect = document.body.getBoundingClientRect();
        app.stickyBarPosition = Math.abs(app.relatedRect.top) + Math.abs(app.bodyRect.top) + Math.abs(app.relatedRect.height);
      }
      else {
        /**
         * Need to append the scores we just grabbed to the scores we already had.
         * First get the total available at the time, then use that + loop index to determine real index.
         */
        var contentGathered = app.scoresContent.length;
        for (b = 0; b < currentContent; ++b) {
          app.scoresContent[(b + contentGathered)] = content.hits.hits[b]["_score"];
        }
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
    var url = ('https:' == document.location.protocol ? "https://that.pub/find/" : "http://find.that.pub/") + type + "/" + action;
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
