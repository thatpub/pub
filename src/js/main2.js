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
    regPubMatch = /productNo(?:\.exact|\.raw)?(?=\:|$)/,
    Result = Backbone.Model.extend({}),
    ResultStore = Backbone.Collection.extend({ model: Result }),
    wrap_ = document.getElementById("wrap"),
    searchWrap_ = document.getElementById("search-wrap"),
    searchRestore_ = document.getElementById("search-restore"),
    page_ = document.getElementById("page"),
    results_ = document.getElementById("results"),
    summary_ = document.getElementById("summary"),
    term_ = document.getElementById("term"),
    total_ = document.getElementById("total"),
    query_ = document.getElementById("query"),
    send_ = document.getElementById("send"),
    moreMeta_ = document.getElementById("more-meta"),
    moreContent_ = document.getElementById("more-content"),
    related_ = document.getElementById("related"),
    infiniScroll_ = document.getElementById("infini-scroll"),
    infiniStatus_ = document.getElementById("infini-status"),
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
    var filteredValues = values.filter( function ( x ) {
        return (x > maxValue);
    });
    return filteredValues;
  }

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
      sheet.addCSSRule(".result.doc.match-" + k + ":hover", "border-color: " + color + ";", 0);
      sheet.addCSSRule(".filtered .result.doc.selected.match-" + k, "border-color: " + color + ";", 0);
      sheet.addCSSRule(".result.content.match-" + k + " .number", "background-color: " + color + ";", 0);
      sheet.addCSSRule(".result.content.match-" + k + " .text", "border-left-color: " + color + ";", 0);
      sheet.addCSSRule(".result.content.match-" + k + " .text .reveal", "background-color: " + color + "; color: #FEFEFE;", 0);
      /*sheet.addCSSRule(".result.content.match-" + k + " .text .reveal:hover", "color: " + color + "; background-color: transparent;", 0);*/
      sheet.addCSSRule(".result.content.match-" + k + " .text.opened .reveal", "color: " + color + "; background-color: transparent;", 0);
      /*sheet.addCSSRule(".result.content.match-" + k + " .text.opened .reveal:hover", "background-color: " + color + "; color: #FEFEFE;", 0);*/
      /*sheet.addCSSRule(".result.content.match-" + k + " .info:hover span", "border-bottom-color: " + color + "; color: " + color + ";", 0);*/
      sheet.addCSSRule(".result.content.match-" + k + " em", "color: " + color + ";", 0);
    }
  }

  return {
    result: new Result(),
    resultStore: new ResultStore(),
    wrap_: wrap_,
    searchWrap_: searchWrap_,
    searchRestore_: searchRestore_,
    page_: page_,
    results_: results_,
    summary_: summary_,
    term_: term_,
    total_: total_,
    query_: query_,
    send_: send_,
    moreMeta_: moreMeta_,
    moreContent_: moreContent_,
    related_: related_,
    placeContent: placeContent,
    placeMeta: placeMeta,
    infiniScroll_: infiniScroll_,
    infiniStatus_: infiniStatus_,
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
    colorize: colorize,
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
          url: "http://get.that.pub/" + data.key.toLowerCase() + ".pdf",
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
          number = _.capitalize(data._type) + " " + data._source.number;
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
          url: "http://get.that.pub/" + data._source.productNo.toLowerCase() + fileFormat,
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
          that = this;
      _.forEach(results, function ( result ) {
        tmp += _.template(templateCode)(that.dataRender(result, allScores));
      });
      return tmp;
    },
    loader: function ( parent ) {
      if ( parent ) {
        var loader = document.createElement("div"),
          spinner = document.createElement("div"),
          blobTop = document.createElement("div"),
          blobBottom = document.createElement("div"),
          blobLeft = document.createElement("div"),
          blobMove = document.createElement("div");

        loader.className = "loader";
        spinner.className = "spinner";
        blobTop.className = "blob top";
        blobBottom.className = "blob bottom";
        blobLeft.className = "blob left";
        blobMove.className = "blob move-blob";

        spinner.appendChild(blobTop);
        spinner.appendChild(blobBottom);
        spinner.appendChild(blobLeft);
        spinner.appendChild(blobMove);

        loader.appendChild(spinner);

        return parent.appendChild(loader);
      }
      else {
        console.error("Parent object doesn't exist or it's not a DOM node.");
      }
    },
    filterBy: ""
  };
};
