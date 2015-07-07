var app = (function (window, document, _, undefined) {
  "use strict";
  var wrap_ = document.getElementById("wrap"),
    searchWrap_ = document.getElementById("search-wrap"),
    searchRestore_ = document.getElementById("search-restore"),
    searchIcon_ = searchRestore_.getElementsByTagName("svg")[0],
    xIcon_ = searchRestore_.getElementsByTagName("svg")[1],
    page_ = document.getElementById("page"),
    pageHeader_ = document.getElementById("page-header"),
    results_ = document.getElementById("results"),
    summary_ = document.getElementById("summary"),
    count_ = document.getElementById("count"),
    term_ = document.getElementById("term"),
    total_ = document.getElementById("total"),
    message = document.createDocumentFragment(),
    message_ = document.getElementById("message"),
    query_ = document.getElementById("query"),
    send_ = document.getElementById("send"),
    moreContent_ = document.getElementById("more-content"),
    related_ = document.getElementById("related"),
    infiniLabel_ = document.getElementById("infini-label"),
    infiniScroll_ = document.getElementById("infini-scroll"),
    loader_ = document.getElementById("loader"),
    resultTemplate_ = document.getElementById("result-template"),
    relatedTemplate_ = document.getElementById("related-template"),
    placeContent = document.cookie.placeContent||"",
    placeMeta = document.cookie.placeMeta||"",
    bodyRect, relatedRect, resultsRect, relatedOffsetTop, stickyBarPosition;

  return {
    wrap_: wrap_,
    searchWrap_: searchWrap_,
    searchRestore_: searchRestore_,
    searchIcon_: searchIcon_,
    xIcon_: xIcon_,
    page_: page_,
    pageHeader_: pageHeader_,
    results_: results_,
    summary_: summary_,
    count_: count_,
    term_: term_,
    total_: total_,
    message_: message_,
    query_: query_,
    send_: send_,
    moreContent_: moreContent_,
    related_: related_,
    placeContent: placeContent,
    placeMeta: placeMeta,
    infiniLabel_: infiniLabel_,
    infiniScroll_: infiniScroll_,
    loader_: loader_,
    resultTemplate: resultTemplate_.textContent||resultTemplate_.innerText,
    relatedTemplate: relatedTemplate_.textContent||relatedTemplate_.innerText,
    infiniScroll: true,
    loading: {
      now: false,
      stillMore: false,
      currentHeight: 0
    },
    bodyRect: bodyRect,
    relatedRect: relatedRect,
    resultsRect: resultsRect,
    relatedOffsetTop: relatedOffsetTop,
    stickyBarPosition: stickyBarPosition,
    traveling: false,
    pos: 0,
    term: "",
    scoresContent: [],
    scoresRelatives: [],
    selectedResults: [],
    selectedTotal: 0,
    colors: {},
    // I'm really not worried about these three.  My makeshift state system.
    isSearchBoxOpen: null,
    isFailure: null,
    isDone: false,
    organizeData: function ( data, allScores, upperMax ) {
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
//          url: (("https:" === document.location.protocol) ?
//              "https://that.pub/get/" :
//              "http://get.that.pub/") + data.key.toLowerCase() + ".pdf",
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
          url: document.location.protocol + "//that.pub/get/" + data._source.productNo.toLowerCase() + fileFormat,
//          url: (("https:" === document.location.protocol) ?
  //          "https://that.pub/get/" :
    //        "http://get.that.pub/") + data._source.productNo.toLowerCase() + fileFormat,
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
    },
    addItem: function ( results, templateCode, allScores ) {
      var stringToRender = "",
        rl = results.length,
        a = 0,
        upperMax = upperOutlier(allScores);
      for (; a < rl; ++a) {
        stringToRender += _.template(templateCode)(this.organizeData(results[a], allScores, upperMax));
      }
      return stringToRender;
    },
    searchBoxToggle: function ( action ) {
      var that = this;
      if (action === "close" &&
            (this.loading.init === true ||
            (this.isDone === true && this.isFailure !== true))
        ) {
        this.infiniScroll = (this.infiniScroll_) ?
          (this.infiniScroll_.checked||(!!this.infiniScroll_.checked)) :
          true;
        swapClass(this.searchWrap_, "", regEmerge);
        this.searchIcon_.style.display = "";
        this.xIcon_.style.display = "none";
        this.isSearchBoxOpen = false;
        this.message_.innerHTML = null;
      }
      else {
        if ( this.isDone === true && this.isFailure === true ) {
          this.isFailure = false;
          this.isDone = false;
          swapClass(this.searchWrap_, "", regFail);
        }
        swapClass(this.searchWrap_, "emerge", regEmerge);
        this.searchIcon_.style.display = "none";
        this.xIcon_.style.display = "";
        this.isSearchBoxOpen = true;
        this.infiniScroll = false;
      }
    }
  };
})(this, this.document, _);
