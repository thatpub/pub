"use strict";

function handleResponse ( httpRequest, action ) {
  var response = JSON.parse(httpRequest.responseText),
    content = response[0] || null,
    meta = response[1] || null,
    expires, a = 0, b = 0, reveals, rl;

  app.isDone = true;

  if ((content && content.hits.total === 0) &&
      (meta && meta.hits.total === 0)) {
    app.isFailure = true;
    app.infiniScroll = false;
    document.cookie = "placeContent=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie = "placeMeta=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    fastdom.write(function() {
      app.message_.innerHTML = null;
      app.message_.appendChild(txt("Your search returned no results.  Give \'er another go."));
    });
    swapClass(app.loader_, "", regLoad);
    swapClass(app.searchWrap_, "failed", regFail);
    return false;
  }

  // app.searchBoxToggle("close");
  expires = new Date(Date.now() + 60000)
  expires = expires.toUTCString();
  fastdom.defer(function() {
    if ( app.resetSearch ) {
      clearTimeout(app.resetSearch);
    }
    app.resetSearch = setTimeout(function() {
      // Server is only caching the scroll/page position for 1 minute.
      // Sorry bucko.
      swapClass(app.moreContent_, "hidden", regHidden);
      app.loading.stillMore = false;
    }, 60000);
  });

  if ( content ) {
    var currentContent = content.hits.hits.length;
    app.placeContent = content._scroll_id;
    document.cookie = "placeContent=" + app.placeContent + "; expires=" + expires;
    if ( action !== "more" ) {
      var currentRelatives = content.aggregations.related_doc.buckets.length;
      window.scroll(0, 0);
      b = 0;
      for (; b < currentContent; ++b) {
        app.scoresContent[b] = content.hits.hits[b]._score;
      }
      for (b = 0; b < currentRelatives; ++b) {
        app.scoresRelatives[b] = content.aggregations.related_doc.buckets[b].score;
      }
      fastdom.write(function() {
        app.term_.innerHTML = app.term;
        app.count_.innerHTML = content.hits.hits.length;
        app.total_.innerHTML = content.hits.total;
        app.related_.innerHTML = app.renderResults("relatives", content.aggregations.related_doc.buckets);
        app.results_.innerHTML = app.renderResults("results", content.hits.hits);
      });

/*      fastdom.read(function() {
        app.relatedRect = app.related_.getBoundingClientRect();
        app.bodyRect = document.body.getBoundingClientRect();
        app.stickyBarPosition = Math.abs(app.relatedRect.top) + Math.abs(app.bodyRect.top) + Math.abs(app.relatedRect.height);
      });*/
    }
    else {
      // var contentReceived = app.scoresContent.length;
      for (b = 0; b < currentContent; ++b) {
        // app.scoresContent[(b + contentReceived)] = content.hits.hits[b]._score;
        app.scoresContent.push(content.hits.hits[b]._score);
      }
      fastdom.write(function() {
        app.count_.innerHTML = app.scoresContent.length;
        app.results_.innerHTML += app.renderResults("results", content.hits.hits);
      });
    }

    fastdom.defer(function() {
      app.relatedRect = app.related_.getBoundingClientRect();
      app.bodyRect = document.body.getBoundingClientRect();
      app.stickyBarPosition = Math.abs(app.relatedRect.top) + Math.abs(app.bodyRect.top) + Math.abs(app.relatedRect.height);
    });

    fastdom.defer(function() {
      reveals = document.querySelectorAll(".reveal-text");
      rl = reveals.length;
      a = 0;
      for (; a < rl; ++a) {
        addEvent(reveals[a], "click", revealText);
      }
    });

    if ( content.hits.hits.length < 20 ) {
      app.loading.stillMore = false;
      swapClass(app.moreContent_, "hidden", regHidden);
    }
    else {
      app.loading.stillMore = true;
      swapClass(app.moreContent_, "", regHidden);
    }
  }

  if ( meta ) {
    app.placeMeta = meta._scroll_id;
    document.cookie = "placeMeta=" + app.placeMeta + "; expires=" + expires;
  }

  fastdom.defer(function() {
    app.resultsRect = app.results_.getBoundingClientRect();
    app.loading.currentHeight = Math.abs(app.resultsRect.height);
    app.loading.now = false;
  });

  app.searchBoxToggle("close");
  swapClass(app.loader_, "", regLoad);
}

function submitQuery ( type, action, contentPager, metaPager ) {
  var request = new XMLHttpRequest(),
    query = app.term,
    url = document.location.protocol + "//that.pub/find/" + type + "/" + action,
    data = {
      t:querySetup(query),
      g:contentPager,
      s:metaPager
    },
    dataString = JSON.stringify(data);
  request.onreadystatechange = function() {
    if (request.readyState === 4 && request.status === 200) {
      handleResponse(request, action);
    }
  };

  request.open("POST", url, true);
  request.setRequestHeader("Content-type", "application/json");
  request.send(dataString);
}
