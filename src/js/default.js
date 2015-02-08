"use strict";

  var regEmerge = / ?emerge/g,
      regHidden = / ?hidden/g,
      regLoad = / ?loading/g,
      regSelected = / ?selected/g,
      regSticky = / ?sticky/g,
      regFiltered = / ?filtered/g,
      regOpened = / ?opened/g,
      regDone = / ?done|$/gm,
      app = App();

  app.resultTemplate = document.getElementById("result-template");
  app.relatedTemplate = document.getElementById("related-template");

  function revealText () {
    var open = regOpened.test(this.parentNode.className);
    this.innerHTML = null;
    classAdd(this.parentNode, "opened", regOpened);
    this.appendChild(document.createTextNode((!open) ? "make it smaller" : "show me more"));
    return false;
  }

  function filterResults ( event ) {
    var reset, o, rl, h, i, j, exists, group, count;
    var el = ( event ) ? event.currentTarget || event.sourceElement : null;
    var filter = ( event === null && el === null ) ?
      false : ( event === "" ) ?
      true : el.getAttribute("id") || this.id;
    if ( filter === true ) {
      console.log("this better not show up");
      app.selectedResults = [];
      app.selectedTotal = 0;
      reset = document.querySelectorAll(".selected");
      o = 0,
      rl = reset.length;
      for (; o < rl; ++o) {
        reset[o].className = reset[o].className.replace(regSelected, "");
      }
      app.results_.className = app.results_.className.replace(regFiltered, "");
      app.count_.innerHTML = app.scoresContent.length;
      return false;
    }

    group = document.querySelectorAll("[data-pub='" + filter + "']");
    count = group.length;
    i = 0;
    j = 0;
    h = 0;
    for (; j < app.selectedResults.length; ++j) {
      if ( app.selectedResults[j] == filter ) {
        exists = j;
        break;
      }
    }
    if ( exists > -1 ) {
      for (; i < count; ++i) {
        group[i].className = group[i].className.replace(regSelected, "");
      }
      app.selectedResults.splice(exists, 1);
      app.selectedTotal = app.selectedTotal - count;
      if (el) {
        el.className = el.className.replace(regSelected, "");
      }
    }
    else {
      for (; h < count; ++h) {
        group[h].className += " selected";
      }
      app.selectedResults.push(filter);
      app.selectedTotal = app.selectedTotal + count;
      if (el) {
        el.className += " selected";
      }
    }
    app.count_.innerHTML = (app.selectedResults.length > 0) ?
      app.selectedTotal : app.scoresContent.length;

    if ( app.selectedResults.length > 0 ) {
      classAdd(app.results_, "filtered", regFiltered);
    } else {
      app.results_.className = app.results_.className.replace(regFiltered, "");
    }
    return false;
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
    scrollWheeler();
  }

  function dataResponse ( httpRequest, action ) {
    var response = JSON.parse(httpRequest.responseText);
    var content = response[0] || null;
    var meta = response[1] || null;
    var expires = new Date(Date.now() + 3600000);

    if ( content && content.hits.total === 0 && meta && meta.hits.total === 0 ) {
      classAdd(app.wrap_, "failed", / ?failed/g);
      return false;
    }

    classAdd(app.searchWrap_, "emerge", regEmerge);
    classAdd(app.wrap_, "done", regDone);
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

        app.results_.innerHTML = "<h2 class='label'>Related Documents<br\/><small>(click to filter locally, press ESC to reset)<\/small><\/h2><ul class='related' id='related'>" + app.addItem(content.aggregations.related_doc.buckets, app.relatedTemplate.textContent||app.relatedTemplate.innerText, app.scoresRelatives) + "<\/ul><hr\/>" + app.addItem(content.hits.hits, app.resultTemplate.textContent||app.resultTemplate.innerText, app.scoresContent);
        app.related_ = app.related_ || document.getElementById("related");
        app.relatedRect = app.related_.getBoundingClientRect();
        app.bodyRect = document.body.getBoundingClientRect();
        app.stickyBarPosition = Math.abs(app.relatedRect.top) + Math.abs(app.bodyRect.top) + Math.abs(app.relatedRect.height);
      }
      else {
        app.scoresContent = app.scoresContent.concat(_.pluck(content.hits.hits, "_score"));
        app.results_.innerHTML += app.addItem(content.hits.hits, app.resultTemplate.textContent||app.resultTemplate.innerText, app.scoresContent);
      }

      if ( content.hits.hits.length < 20 ) {
        classAdd(app.moreContent_, "hidden", regHidden);
        app.loading.stillMore = false;
      }
      else {
        app.moreContent_.className = app.moreContent_.className.replace(regHidden, "");
        app.loading.stillMore = true;
        app.bodyRect = document.body.getBoundingClientRect();
        app.related_ = document.querySelector("#related")||document.getElementById("related");
        app.relatedRect = document.querySelector("#related").getBoundingClientRect();
        app.relatedOffsetTop = Math.abs(app.bodyRect.height) - Math.abs(app.bodyRect.top);
      }

      var reveals = document.querySelectorAll(".text > .reveal"),
        docs = document.querySelectorAll(".doc"),
        a = 0,
        b = 0,
        rl = reveals.length,
        dl = docs.length;

      for (; a < rl; ++a) {
        addEvent(reveals[a], "click", revealText);
      }
      for (; b < dl; ++b) {
        addEvent(docs[b], "click", filterResults);
      }
      filterResults( (action !== "more") ? "" : null );
    }

    if ( meta ) {
      app.placeMeta = meta._scroll_id;
      document.cookie = "placeMeta=" + app.placeMeta + "; expires=" + expires;
    }
    app.resultsRect = app.results_.getBoundingClientRect();
    app.loading.currentHeight = Math.abs(app.resultsRect.height);
    addEvent(window, "scroll", scrollWheeler);
    addEvent(window, 'DOMMouseScroll', scrollWheeler);
  }

  function scrollWheeler () {
    var t = document.documentElement||document.body.parentNode,
      pos = (t && typeof t.ScrollTop === "number" ? t : document.body).ScrollTop || window.pageYOffset,
      delta = pos - app.pos;

    if ( app.infiniScroll === true && app.loading.now === false && app.loading.stillMore === true && (delta > 0) && pos > app.loading.currentHeight - 1200 ) {
      app.loading.now = true;
      more();
    }

      if ( !app.traveling && pos > app.stickyBarPosition ) {
        classAdd(app.related_, "sticky", regSticky);
        app.traveling = true;
      }
      if ( app.traveling && pos <= app.stickyBarPosition ) {
        app.related_.className = app.related_.className.replace(regSticky, "");
        app.traveling = false;
      }
    app.pos = pos;
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
    event.preventDefault();
    classAdd(app.moreContent_, "loading", regLoad);
    sendData(dataResponse, ( document.cookie.placeContent||app.placeContent ) ? "" : app.term, "content", "more", document.cookie.placeContent||app.placeContent, null, endLoading);
    return false;
  }

  function endLoading ( el ) {
    el = ( el === null ) ? app.moreContent_ :
          ( el === "" ) ? app.send_ : null;
    el.className = el.className.replace(regLoad, "");
    app.loading.now = false;
    if ( el == app.send_ && !regEmerge.test(app.searchWrap_.className) ) {
      app.searchRestore_.click();
    }
  }
