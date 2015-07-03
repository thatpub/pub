
// filter stuff - from handleResponse() - or is it sticky header stuff?
// DISABLED
// Until we can handle huge amounts of results, turn this shit off.

// app.bodyRect = document.body.getBoundingClientRect();
// app.related_ = document.querySelector("#related")||document.getElementById("related");
// app.relatedRect = document.querySelector("#related").getBoundingClientRect();
// app.relatedOffsetTop = Math.abs(app.bodyRect.height) - Math.abs(app.bodyRect.top);


// Scroll wheel stuff:

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



  // var urlHx = url + (action !== "more" ?  "/" + encodeURIComponent(query).replace("%20", "+") : "");
  // var url = "//that.pub/find/" + type + "/" + action;

  /*regSticky = / ?sticky/g,*/
  // regFiltered = / ?filtered/g,
  // regDone = / ?done|$/gm,


  // This was a debugging experiment but could actually use later for direct
  // searching from URL.
  //
  // if ( window.location.search !== "" ) {
  //   app.query_.value = decodeURIComponent(window.location.search.slice(3).replace(/\+(?!\%20)/g, "%20"));
  //   app.term = _.trim(app.query_.value);
  //   app.send_.click();
  // }


    // snabbt(app.query_, 'attention', {
    //   rotation: [0, 0, Math.PI/2],
    //   springConstant: 1.9,
    //   springDeacceleration: 0.9
    // });

// addEvent(app.moreMeta_, "click", function ( event ) {
//   event.preventDefault();
//   swapClass(app.loader_, "loading", regLoad);
//   sendData(dataResponse, ( document.cookie.placeMeta||app.placeMeta ) ? "" : app.term, "meta", "more", null, document.cookie.placeMeta||app.placeMeta, endLoading);
//   return false;
// });

      // var screenHeight = window.innerHeight;
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
        // removeEvent(this.searchWrap_, "click", modalClose);
        // // ------ open --------

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
        // addEvent(this.searchWrap_, "click", modalClose);


  /**
   * Yup, I am just this lazy.
   */
  /*var d = {
    el: function(data) {
      return document.createElement(data);
    },
    txt: function(data) {
      return document.createTextNode(data);
    }
  };

  function newResult(parent, data) {
    var _result, _number, _meta, _info, _details, _pub, _pubTitle, _chapter, _chapterTitle, _section, _sectionTitle, _text, _fullText;
    parent = parent || document.getElementById("results") || app.results_ || null;
    if ( data && parent ) {
      _result = d.el("div");
      _number = d.el("h2");
      parent.appendChild(
        _result.appendChild(
          _number.appendChild(
            d.txt("Result Test")
          )
        )
      );
    }
  }

  app.newResult = newResult;*/

  /**
   * For IE8 obviously
   */

  var el = event.currentTarget || event.sourceElement || this;
  if ( event.preventDefault ) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }

  /*addEvent(app.searchWrap_, 'webkitTransitionEnd', function () {
   if ( regEmerge.test(app.searchWrap_.className) ) {
   app.query_.focus();
   }
   });*/
  /*addEvent(app.searchWrap_, 'transitionend', function () {
   if ( regEmerge.test(app.searchWrap_.className) ) {
   app.query_.focus();
   }
   });*/



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
      sheet.addCSSRule(".result.doc.match-" + k, "color: " + color + "; border-color: " + color + "; background-color: transparent;", 0);
      /*sheet.addCSSRule(".result.doc.match-" + k + ":hover", "border-color: " + color + ";", 0);*/
      sheet.addCSSRule(".filtered .result.doc.selected.match-" + k, "color: #FEFEFE; background-color: " + color + ";", 0);
      sheet.addCSSRule(".result.content.match-" + k + " .number", "background-color: " + color + ";", 0);
      sheet.addCSSRule(".result.content.match-" + k + " .text", "border-left-color: " + color + ";", 0);
      sheet.addCSSRule(".result.content.match-" + k + " .text .reveal", "background-color: " + color + "; color: #FEFEFE;", 0);
      /*sheet.addCSSRule(".result.content.match-" + k + " .text .reveal:hover", "color: " + color + "; background-color: transparent;", 0);*/
      sheet.addCSSRule(".result.content.match-" + k + " .text.opened .reveal", "color: " + color + "; background-color: transparent;", 0);
      /*sheet.addCSSRule(".result.content.match-" + k + " .text.opened .reveal:hover", "background-color: " + color + "; color: #FEFEFE;", 0);*/
      /*sheet.addCSSRule(".result.content.match-" + k + " .info:hover span", "border-bottom-color: " + color + "; color: " + color + ";", 0);*/
      sheet.addCSSRule(".result.content.match-" + k + " em", "color: " + color + ";", 0);
      sheet.addCSSRule(".result.content.match-" + k + " .meta .info .pub, .result.content.match-" + k + " .meta .info .title", "color: " + color + ";", 0);
      sheet.addCSSRule(".result.content.match-" + k + " .meta .info:hover .pub, .result.content.match-" + k + " .meta .info:hover .title", "border-bottom-color: " + color + ";", 0);
    }
  }
