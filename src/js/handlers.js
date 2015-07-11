"use strict";

app.revealText = function ( event ) {
  var that = event.currentTarget||event.srcElement||event.target,
    open;
  event.preventDefault();
  open = that.getAttribute("data-opened");
  if (open !== "true") {
    swapClass(that.parentNode, "opened", regOpened);
    that.innerHTML = "consolidate";
    that.setAttribute("data-opened", "true");
  }
  else {
    swapClass(that.parentNode, "", regOpened);
    that.innerHTML = "expand";
    that.setAttribute("data-opened", "false");
  }
  return false;
};

app.more = function ( event ) {
  if ( event && event.preventDefault ) {
    event.preventDefault();
  }
  if ( app.loading.now !== true ) {
    swapClass(app.loader_, "loading", regLoad);
  }
  app.submitQuery("content", "more", document.cookie.placeContent||app.placeContent, null);
  return false;
};

app.infini = function () {
  // There's clearly something...in excess here.  Just not in the mood to care.
  var status, doThis;
  app.infiniScroll = this.checked || (!!this.checked);
  status = (app.infiniScroll) ? "enabled" : "disabled";
  doThis = (app.infiniScroll) ? "Disable" : "Enable";
  app.infiniLabel_.className = status;
  app.infiniLabel_.setAttribute("title", doThis + " infinite scroll");
  if ( !status ) {
    this.removeAttribute("checked");
  }
};

app.scrollWheeler = function () {
  fastdom.read(function() {
    var pos = (rootElement && typeof rootElement.ScrollTop === "number" ? rootElement : document.body).ScrollTop || window.pageYOffset,
      delta = pos - app.pos;
    if ( app.infiniScroll === true && app.loading.now === false && app.loading.stillMore === true && (delta > 0) && pos > (app.loading.currentHeight - 1200) ) {
      app.loading.now = true;
      app.more();
    }
    app.pos = pos;
  });
};

app.searchStart = function ( event ) {
  ( event &&
    event.preventDefault &&
    event.preventDefault());
  var that = this,
    val = app.query_.value.trim();
  app.isFailure = false;
  app.isDone = false;
  if ( !val ) { // show notification/input validate here
    app.queryInvalidated = true;
    swapClass(app.query_, "invalidated", regValidate);
      that.message_.innerHTML = "You gotta type something first.";
      that.query_.focus();
    return false;
  }
  app.term = val;
  swapClass(app.loader_, "loading", regLoad);
  app.submitQuery("content", "search", app.placeContent, app.placeMeta);
  return false;
};

app.handleFocus = function () {
  if (app.queryInvalidated !== true) {
    return false;
  }
};

app.handleInput = function ( event ) {
  // Enter key pressed > submit query
  if ( event.which === 13 && app.isSearchBoxOpen === true ) {
    app.searchStart(event);
    return false;
  }
  // After error they decide to type something
  if ( app.queryInvalidated === true && event.which !== 13 ) {
    app.queryInvalidated = false;
    swapClass(app.query_, "", regValidate);
    app.message_.innerHTML = "";
  }
};

/**
 * I really outta come in and comment this shit at some point.
 **/
app.organizeData = function ( data, allScores, upperMax ) {
  var output = {},
    regType = /chapter|section/,
    index, group, number, fullPub, rawText, text, date,
    highlights, fileFormat;

  if ( !data._source && data.key && data.score ) {
    //  This won't work without more fields in the aggregation to give me
    //  info to use.  File type is unknown, date, URL, etc.
    index = allScores.indexOf(data.score);
    group = ( index > -1 ) ? " match-" + index : "";
    app.colors[data.key] = index;
    output = {
      key: data.key,
      url: document.location.protocol + "//that.pub/get/" + data.key.toLowerCase() + ".pdf",
      score: data.score,
      gravitas: ( upperMax < data.score || data.score >= 1 ) ?
      " pretty" + group :
      " boring" + group
    };
  }
  else if ( data._source.text ) {
    number = data._source.number;
    text = data.highlight["text.english2"];
    rawText = data._source.text;
    fullPub = data._source.productNo;
    highlights = Object.keys(data.highlight);
    fileFormat = ( data._type !== "form" ) ? ".pdf" : ".xfdl";

    if ( regPubMatch.test(highlights.join(":")) ) {
      fullPub = data.highlight["productNo.exact"] || data.highlight["productNo.raw"] || data.highlight.productNo;
      fullPub = fullPub.shift();
    }
    date = ( data._source.releaseDate ) ?
    data._source.releaseDate.substring(6, 8) + " " + months[data._source.releaseDate.substring(4, 6)] + " " + data._source.releaseDate.substring(0, 4) :
    data._source.publishedDate.substring(0, 2) + " " + months[data._source.publishedDate.substring(2, 4)] + " " + data._source.publishedDate.substring(4, 8);

    if ( regType.test(data._type) && data._type.length == 7 ) {
      number = data._type.toTitle() + " " + data._source.number;
    }
    index = app.colors[data._source.productNo||data._source.pubName];
    group = ( index && typeof index === "number" && (index >= 0 || index < 5)) ? " match-" + index : "";
    output = {
      score: data._score,
      gravitas: ( upperMax < data.score || data.score >= 1 ) ?
      " pretty" + group :
      " boring" + group,
      date: date,
      url: document.location.protocol + "//that.pub/get" + data._source.productNo.toLowerCase() + fileFormat,
      fullPub: fullPub,
      title: data.highlight.title || data._source.title || null,
      rawTitle: data._source.title,
      sub: ( rawText ) ? number : "",
      details: {
        chapter: data._source.chapter && data._source.chapter.number || null,
        chapterTitle: data.highlight["chapter.title"] || data._source.chapter && data._source.chapter.title || null,
        section: data._source.section && data._source.section.number || null,
        sectionTitle: data.highlight["section.title"] || data._source.section && data._source.section.title || null
      },
      rawText: rawText,
      concatText: ( data.highlight.text && data.highlight.text[0] ) || null,
      parts: ( Array.isArray(text) ) ? text : null,
      fileFormat: fileFormat,
      type: ( rawText ) ? " content" : " doc"
    };
  }
  return output || null;
};

app.renderResults = function ( itemType, results ) {
  var stringToRender = "",
    objWithData = {},
    rl = results.length,
    a = 0, upperMax, templateCode, scores;
  if ( itemType === "results" ) {
    templateCode = this.resultTemplate;
    scores = this.scoresContent;
    upperMax = upperOutlier(scores);
  }
  else {
    templateCode = this.relatedTemplate;
    scores = this.scoresRelatives;
    upperMax = upperOutlier(scores);
  }
  for (; a < rl; ++a) {
    objWithData = this.organizeData(results[a], scores, upperMax);
    stringToRender += templateCode(objWithData);
  }
  return stringToRender;
};

app.searchBoxToggle = function ( action ) {
  if ( action === "open" ) {
    // Prep the elements before showtime
    this.query_.value = this.term;
    this.searchIcon_.style.display = "none";
    this.xIcon_.style.display = "";

    swapClass(this.searchWrap_, "emerge", regEmerge);

    if ( this.isFailure === true ) {
      swapClass(this.searchWrap_, "failed", regFail);
    }

    this.isSearchBoxOpen = true;
    this.infiniScroll = false;
  }
  if ( action === "close" ) {
    swapClass(this.searchWrap_, "", regEmerge);
    swapClass(this.searchWrap_, "", regFail);
    this.infiniScroll = (this.infiniScroll_) ? (this.infiniScroll_.checked||(!!this.infiniScroll_.checked)) : true;
    this.term = this.query_.value.trim();
    this.searchIcon_.style.display = "";
    this.xIcon_.style.display = "none";
    this.message_.innerHTML = "";
    this.isSearchBoxOpen = false;
  }
};

app.closeModal = function ( event ) {
  if (  event.which === 27 &&
        app.isSearchBoxOpen === true &&
        app.isFailure === false ) {
    event.preventDefault();
    app.searchBoxToggle("close");
  }
};

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
    thit.message_.innerHTML = "Your search returned no results.  Give \'er another go.";
    swapClass(this.loader_, "", regLoad);
    this.xIcon_.style.display = "none";
    swapClass(this.searchWrap_, "failed", regFail);
    return false;
  }

  this.isFailure = false;
  expires = new Date(Date.now() + 60000)
  expires = expires.toUTCString();
  if ( that.resetSearch ) {
    clearTimeout(that.resetSearch);
  }
  that.resetSearch = setTimeout(function() {
    // Server is only caching the scroll/page position for 1 minute.
    // Sorry bucko.
    swapClass(that.moreContent_, "hidden", regHidden);
    that.loading.stillMore = false;
  }, 60000);

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
    url = document.location.protocol + "//that.pub/find/" + type + "/" + action,
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
};
