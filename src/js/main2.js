"use strict";

/**
  * If you don't use block-style comments and strict-mode, you, sir, are wrong.
  */

var App = function () {
  var months = {
    "01": "Jan",
    "02": "Feb",
    "03": "Mar",
    "04": "Apr",
    "05": "May",
    "06": "Jun",
    "07": "Jul",
    "08": "Aug",
    "09": "Sep",
    "10": "Oct",
    "11": "Nov",
    "12": "Dec"
    },
    /*Result = Backbone.Model.extend({}),
    Results = Backbone.Collection.extend({ model: Result }),*/
    wrap_ = document.getElementById("wrap"),
    searchWrap_ = document.getElementById("search-wrap"),
    searchRestore_ = document.getElementById("search-restore"),
    page_ = document.getElementById("page"),
    pageHeader_ = document.getElementById("page-header"),
    results_ = document.getElementById("results"),
    summary_ = document.getElementById("summary"),
    count_ = document.getElementById("count"),
    term_ = document.getElementById("term"),
    total_ = document.getElementById("total"),
    query_ = document.getElementById("query"),
    send_ = document.getElementById("send"),
    moreMeta_ = document.getElementById("more-meta"),
    moreContent_ = document.getElementById("more-content"),
    related_ = document.getElementById("related"),
    infiniLabel_ = document.getElementById("infini-label"),
    infiniScroll_ = document.getElementById("infini-scroll"),
    infiniStatus_ = document.getElementById("infini-status"),
    loader_ = document.getElementById("loader"),
    placeContent = document.cookie.placeContent||"",
    placeMeta = document.cookie.placeMeta||"",
    bodyRect,
    relatedRect,
    resultsRect,
    relatedOffsetTop,
    stickyBarPosition;

  CSSStyleSheet.prototype.addCSSRule = function ( selector, rules, index ) {
    if ( "insertRule" in this ) {
      this.insertRule(selector + "{" + rules + "}", index);
    }
    else if ( "addRule" in this ) {
      this.addRule(selector, rules, index);
    }
  };

  function filterOutliers ( someArray ) {
    var values = someArray.concat();
    values.sort( function ( a, b ) {
      return a - b;
    });
    var q1 = values[Math.floor((values.length / 4))];
    var q3 = values[Math.ceil((values.length * (3 / 4)))];
    var iqr = q3 - q1;
    var maxValue = q3 + (iqr * 1.5);
    return values.filter( function ( x ) {
        return (x > maxValue);
    });
  }

  /**
   * Placeholder for colorize();
   */

  return {
    /*result: new Result(),
    results: new Results(),*/
    wrap_: wrap_,
    searchWrap_: searchWrap_,
    searchRestore_: searchRestore_,
    page_: page_,
    pageHeader_: pageHeader_,
    results_: results_,
    summary_: summary_,
    count_: count_,
    term_: term_,
    total_: total_,
    query_: query_,
    send_: send_,
    moreMeta_: moreMeta_,
    moreContent_: moreContent_,
    related_: related_,
    placeContent: placeContent,
    placeMeta: placeMeta,
    infiniLabel_: infiniLabel_,
    infiniScroll_: infiniScroll_,
    infiniStatus_: infiniStatus_,
    loader_: loader_,
    infiniScroll: true,
    done: false,
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
    /*colorize: colorize,*/
    colors: {},
    dataRender: function ( data, allScores ) {
      var output = {},
          regType = /chapter|section/,
          index,
          group,
          number,
          fullPub,
          rawText,
          text,
          date,
          highlights,
          fileFormat;
      if ( !data._source && data.key && data.score ) {
          /**
           *  This won't work without more fields in the aggregation to give me
           *  info to use.  File type is unknown, date, URL, etc.
           */
        index = _.indexOf(allScores, data.score);
        group = ( index > -1 ) ? " match-" + index : "";
        app.colors[data.key] = index;
        output = {
          url: ("https:" == document.location.protocol ? "https://that.pub/get/" : "http://get.that.pub/") + data.key.toLowerCase() + ".pdf",
          key: data.key,
          score: data.score,
          gravitas: (
            _.contains(
              filterOutliers(allScores), data.score
            ) || data.score >= 1
          ) ? " pretty" + group : " boring" + group
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
        group = ( _.isNumber(index) && (index >= 0 || index < 5)) ? " match-" + index : "";
        output = {
          score: data._score,
          gravitas: (
            _.contains(
              filterOutliers(allScores), data._score
              ) || data._score >= 1
            ) ? " pretty" + group : " boring" + group,
          date: date,
          url: ("https:" == document.location.protocol ? "https://that.pub/get/" : "http://get.that.pub/") + data._source.productNo.toLowerCase() + fileFormat,
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
          concatText: (data.highlight["text"] && data.highlight["text"][0]) || null,
          parts: (Array.isArray(text)) ? text : null,
          fileFormat: fileFormat,
          type: ( rawText ) ? " content" : " doc"
        };

      }
      return output || null;
    },
    querySetup: function ( term ) {
      return (function ( name ) {
        return {
          term: term,
          pubName: name.extract,
          noPubName: name.remove
        };
      })(term.toPubName());
    },
    addItem: function ( results, templateCode, allScores ) {
      var tmp = "",
        that = this,
        rl = results.length,
        a = 0;
      for (; a < rl; ++a) {
        tmp += _.template(templateCode)(that.dataRender(results[a], allScores));
      }
      return tmp;
    },
    searchToggle: function ( action ) {
      var screenHeight = window.innerHeight;
      if ( action === "close" ) {
        // snabbt(this.searchWrap_, {
        //   position: [0, -screenHeight, 0],
        //   opacity: 0,
        //   fromOpacity: 1,
        //   easing: 'easeOut',
        //   duration: 250
        // });
        // snabbt(this.wrap_, {
        //   opacity: 1,
        //   fromOpacity: 0,
        //   easing: 'easeOut',
        //   delay: 250
        // });
        swapClass(document.body, "", regEmerge);
        // removeEvent(this.searchWrap_, "click", modalClose);
        this.infiniScroll = (this.infiniScroll_) ?
          this.infiniScroll_.checked || (!!this.infiniScroll_.checked) : true;
      }
      else if ( action === "open" ) {
        // snabbt(this.wrap_, {
        //   opacity: 0,
        //   fromOpacity: 1,
        //   easing: 'easeOut',
        //   duration: 250
        // });
        // snabbt(this.searchWrap_, {
        //   position: [0, 0, 0],
        //   opacity: 1,
        //   fromOpacity: 0,
        //   easing: 'easeOut',
        //   duration: 250
        // });
        swapClass(document.body, "emerge", regEmerge);
        // addEvent(this.searchWrap_, "click", modalClose);
        this.infiniScroll = false;
      }
    },
    isDone: function ( done ) {
      var answer;
      if ( typeof done === "undefined" ) {
        /**
         * Just wants the current state.  So let's give it to em.
         */
        answer = this.done;
      }
      else if ( done === true ) {
        swapClass(document.body, "done", regDone);
        this.done = done;
        answer = done;
      }
      else if ( done === false ) {
        swapClass(document.body, "failed", regFail);
        this.done = done;
        answer = done;
      }
      return answer;
    }
  };
};
