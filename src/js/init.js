"use strict";
var app = new App();

app.resultTemplate = document.getElementById("result-template");
app.relatedTemplate = document.getElementById("related-template");

function handleResponse ( httpRequest, action, callback ) {
  var response = JSON.parse(httpRequest.responseText),
    content = response[0] || null,
    meta = response[1] || null,
    a, b, reveals, rl;

  app.isDone = true;

  if ((content && content.hits.total === 0) &&
      (meta && meta.hits.total === 0)) {
    app.isFailure = true;
    app.infiniScroll = false;
    document.cookie = "placeContent=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie = "placeMeta=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    app.message_.innerHTML = null;
    app.message_.appendChild(txt("Your search returned no results.\nGive \'er another go."));
    swapClass(app.searchWrap_, "failed", regFail);
    return callback();
  }

  var expires = new Date(Date.now() + 3600000);
  expires = expires.toUTCString();

  if ( content ) {
    var currentContent = content.hits.hits.length;
    app.term_.innerHTML = app.term;
    app.total_.innerHTML = content.hits.total;
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
        app.scoresContent[b] = content.aggregations.related_doc.buckets[b].score;
      }
      app.related_.innerHTML = app.addItem(content.aggregations.related_doc.buckets, app.relatedTemplate.textContent||app.relatedTemplate.innerText, app.scoresRelatives);
      app.results_.innerHTML = app.addItem(content.hits.hits, app.resultTemplate.textContent||app.resultTemplate.innerText, app.scoresContent);
      app.count_.innerHTML = currentContent;

      app.relatedRect = app.related_.getBoundingClientRect();
      app.bodyRect = document.body.getBoundingClientRect();
      app.stickyBarPosition = Math.abs(app.relatedRect.top) + Math.abs(app.bodyRect.top) + Math.abs(app.relatedRect.height);
    }
    else {
      var contentGathered = app.scoresContent.length;
      for (b = 0; b < currentContent; ++b) {
        app.scoresContent[(b + contentGathered)] = content.hits.hits[b]._score;
      }
      app.results_.innerHTML += app.addItem(content.hits.hits, app.resultTemplate.textContent||app.resultTemplate.innerText, app.scoresContent);
      app.count_.innerHTML = app.scoresContent.length;
    }

    reveals = document.querySelectorAll(".reveal-text");
    rl = reveals.length;
    a = 0;
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
    }
  }

  if ( meta ) {
    app.placeMeta = meta._scroll_id;
    document.cookie = "placeMeta=" + app.placeMeta + "; expires=" + expires;
  }
  app.resultsRect = app.results_.getBoundingClientRect();
  app.loading.currentHeight = Math.abs(app.resultsRect.height);
  callback();
}

function submitQuery ( responder, query, type, action, spot, dot, callback ) {
  var request = new XMLHttpRequest(),
    url = (('https:' === document.location.protocol) ?
      "https://that.pub/find/" :
      "http://find.that.pub/") + type + "/" + action,
    data = {
      t:querySetup(query),
      g:spot,
      s:dot
    },
    dataString = JSON.stringify(data);

  request.onreadystatechange = function() {
    if (request.readyState === 4 && request.status === 200) {
      responder(request, action, callback);
    }
  };

  request.open("POST", url, true);
  request.setRequestHeader("Content-type", "application/json");
  request.send(dataString);
}

function endLoading () {
  swapClass(app.loader_, "", regLoad);
  app.loading.now = false;
  app.loading.init = false;
  if ( app.isSearchBoxOpen === true ) {
    app.searchBoxToggle("close");
  }
  return false;
}
