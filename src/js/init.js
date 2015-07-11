;(function(window, document, app, undefined) {
  "use strict";
  app.handleResponse = function ( httpRequest, action ) {
    var that = this,
      response = JSON.parse(httpRequest.responseText),
      content = response[0] || null,
      meta = response[1] || null,
      expires, a = 0, b = 0, reveals, rl;

    this.isDone = true;

    if ((content && content.hits.total === 0) &&
        (meta && meta.hits.total === 0)) {
      this.isFailure = true;
      this.infiniScroll = false;
      document.cookie = "placeContent=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      document.cookie = "placeMeta=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      fastdom.write(function() {
        that.message_.innerHTML = "Your search returned no results.  Give \'er another go.";
      });
      swapClass(this.loader_, "", regLoad);
      this.xIcon_.style.display = "none";
      swapClass(this.searchWrap_, "failed", regFail);
      return false;
    }

    expires = new Date(Date.now() + 60000)
    expires = expires.toUTCString();
    fastdom.defer(function() {
      if ( that.resetSearch ) {
        clearTimeout(that.resetSearch);
      }
      that.resetSearch = setTimeout(function() {
        // Server is only caching the scroll/page position for 1 minute.
        // Sorry bucko.
        swapClass(that.moreContent_, "hidden", regHidden);
        that.loading.stillMore = false;
      }, 60000);
    });

    if ( content ) {
      var currentContent = content.hits.hits.length;
      this.placeContent = content._scroll_id;
      document.cookie = "placeContent=" + this.placeContent + "; expires=" + expires;
      if ( action !== "more" ) {
        var currentRelatives = content.aggregations.related_doc.buckets.length;
        window.scroll(0, 0);
        b = 0;
        for (; b < currentContent; ++b) {
          this.scoresContent[b] = content.hits.hits[b]._score;
        }
        for (b = 0; b < currentRelatives; ++b) {
          this.scoresRelatives[b] = content.aggregations.related_doc.buckets[b].score;
        }
        fastdom.write(function() {
          that.term_.innerHTML = that.term;
          that.count_.innerHTML = content.hits.hits.length;
          that.total_.innerHTML = content.hits.total;
          that.related_.innerHTML = that.renderResults("relatives", content.aggregations.related_doc.buckets);
          that.results_.innerHTML = that.renderResults("results", content.hits.hits);
        });
      }
      else {
        for (b = 0; b < currentContent; ++b) {
          this.scoresContent.push(content.hits.hits[b]._score);
        }
        fastdom.write(function() {
          that.count_.innerHTML = that.scoresContent.length;
          that.results_.innerHTML += that.renderResults("results", content.hits.hits);
        });
      }

      fastdom.defer(function() {
        that.relatedRect = that.related_.getBoundingClientRect();
        that.bodyRect = document.body.getBoundingClientRect();
        that.stickyBarPosition = Math.abs(that.relatedRect.top) + Math.abs(that.bodyRect.top) + Math.abs(that.relatedRect.height);
      });

      fastdom.defer(function() {
        reveals = that.results_.querySelectorAll(".reveal-text");
        rl = reveals.length;
        a = 0;
        for (; a < rl; ++a) {
          addEvent(reveals[a], "click", that.revealText);
        }
      });

      if ( content.hits.hits.length < 20 ) {
        this.loading.stillMore = false;
        swapClass(this.moreContent_, "hidden", regHidden);
      }
      else {
        this.loading.stillMore = true;
        swapClass(this.moreContent_, "", regHidden);
      }
    }

    if ( meta ) {
      this.placeMeta = meta._scroll_id;
      document.cookie = "placeMeta=" + this.placeMeta + "; expires=" + expires;
    }

    fastdom.defer(function() {
      that.resultsRect = that.results_.getBoundingClientRect();
      that.loading.currentHeight = Math.abs(that.resultsRect.height);
      that.loading.now = false;
    });

    this.searchBoxToggle("close");
    swapClass(this.loader_, "", regLoad);
  };
  app.submitQuery = function ( type, action, contentPager, metaPager ) {
    var that = this,
      request = new XMLHttpRequest(),
      query = this.term,
      url = "//that.pub/find/" + type + "/" + action,
      data = {
        t:querySetup(query),
        g:contentPager,
        s:metaPager
      },
      dataString = JSON.stringify(data);
    request.onreadystatechange = function() {
      if (request.readyState === 4 && request.status === 200) {
        that.handleResponse(request, action);
      }
    };

    request.open("POST", url, true);
    request.setRequestHeader("Content-type", "application/json");
    request.send(dataString);
  }
})(this, this.document, app);
