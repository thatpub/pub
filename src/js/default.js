;(function () {
  'use strict';
  app.resultTemplate = document.getElementById('result-template');
  app.relatedTemplate = document.getElementById('related-template');

  function addEvent ( element, evt, fnc ) {
    return ((element.attachEvent) ? element.attachEvent('on' + evt, fnc) : element.addEventListener(evt, fnc, false));
  }

  function filterResults (event) {
    var el = ( event ) ? event.currentTarget || event.sourceElement : null;
    var filter = (el) ? el.getAttribute('id') : app.filterBy;
    app.filterBy = filter;
    if ( app.filterBy === '' ) {
      app.filtered_ = null;
      _.forEach(document.querySelectorAll('.doc a, .result'), function ( a ) {
        a.className = a.className.replace('selected', '');
      });
      app.results_.className = app.results_.className.replace(/ ?filtered/gi, '');
      return false;
    }
    try {
      el = document.getElementById(filter);
    } catch (error) {
      console.error(error);
    }
    if ( app.filtered_ ) {
      _.forEach(app.filtered_, function (found) {
        found.className = found.className.replace('selected', '');
      });
      _.forEach(document.querySelectorAll('.doc a'), function ( a ) {
        a.className = a.className.replace('selected', '');
      });
    }
    else {
      app.results_.className += ' filtered';
    }
    app.filtered_ = document.querySelectorAll('[data-pub="' + filter + '"]');
    _.forEach(app.filtered_, function (found) {
      found.className += ' selected';
    });
    if (el) {
      el.className += ' selected';
    }
    return false;
  }

  function dataResponse ( httpRequest, action ) {
    var response = JSON.parse(httpRequest.responseText);
    var content = response[0] || null;
    var meta = response[1] || null;
    var expires = new Date(Date.now() + 3600000);

    if ( content && content.hits.total === 0 && meta && meta.hits.total === 0 ) {
      app.page_.className += ' failed';
      return false;
    }

    app.searchWrap_.className = app.searchWrap_.className.replace(/ ?overlay|mini ?/g, ' done ');
    app.page_.className = app.page_.className.replace(/ ?loading/, ' ');
    expires = expires.toUTCString();

    if ( content ) {
      app.summary_.className = app.summary_.className.replace(/hidden ?/g, ' ');
      app.term_.innerHTML = app.term;
      app.total_.innerHTML = content.hits.total;
      app.placeContent = content._scroll_id;
      document.cookie = 'placeContent=' + app.placeContent + '; expires=' + expires;
      if ( action !== 'more' ) {
        window.scroll(0, 0);
        app.scoresContent = _.pluck(content.hits.hits, '_score');
        app.scoresRelatives = _.pluck(content.aggregations.related_doc.buckets, 'score');
        app.results_.innerHTML = "";
        app.results_.innerHTML = "<h4 class='label'>Related Documents</h4><ul class='related' id='related'>" + app.addItem(content.aggregations.related_doc.buckets, app.relatedTemplate.textContent||app.relatedTemplate.innerText, app.scoresRelatives) + "</ul><h4 class='label'>Results</h4>" + app.addItem(content.hits.hits, app.resultTemplate.textContent||app.resultTemplate.innerText, app.scoresContent);
      }
      else {
        app.scoresContent = app.scoresContent.concat(_.pluck(content.hits.hits, '_score'));
        app.results_.innerHTML += app.addItem(content.hits.hits, app.resultTemplate.textContent||app.resultTemplate.innerText, app.scoresContent);
      }
      if ( content.hits.hits.length < 20 ) {
        app.moreContent_.className += ' hidden';
      }
      else {
        app.moreContent_.className = app.moreContent_.className.replace(/ ?hidden/g, ' ');
      }
      _.forEach(document.querySelectorAll('.doc > a'), function (el) {
        addEvent(el, 'click', filterResults);
      });
      filterResults();
    }
    if ( meta ) {
      app.placeMeta = meta._scroll_id;
      document.cookie = 'placeMeta=' + app.placeMeta + '; expires=' + expires;
    }
  }

  function sendData ( responder, query, type, action, spot, dot ) {
    var httpRequest = new XMLHttpRequest(),
        url = 'http://find.that.pub/' + type + '/' + action,
        urlHx = url + (action !== 'more' ?  '/' + encodeURIComponent(query).replace('%20', '+') : '');

    httpRequest.onreadystatechange = function(){
      if (httpRequest.readyState === 4) {

        if (httpRequest.status === 200) {
          responder(httpRequest, action);
        }
        else {
          /*console.log(httpRequest);
          console.log('what the hell you do');*/
        }
      }
    };
    /*console.log(query);
    console.log(app.querySetup(query));*/
    httpRequest.open('POST', url, true);
    httpRequest.setRequestHeader('Content-type', 'application/json');
    httpRequest.send(
      JSON.stringify({
        t:app.querySetup(query),
        g:spot,
        s:dot
      })
    );
  }

  addEvent(app.query_, 'keypress', function ( event ) {
    if ( event.which === 13 ) {
      app.term = _.trim(app.query_.value);
      if ( !app.term ) { /* show notification/input validate here */
        return false;
      }
      app.page_.className += ' loading';
      app.filterBy = '';
      sendData(dataResponse, app.term, 'content', 'search', app.placeContent, app.placeMeta);
      return false;
    }
  });
  addEvent(document, 'keyup', function ( event ) {
    if ( event.which === 27 ) {
      if ( app.regMini.test(app.searchWrap_.className) ) {
        app.searchWrap_.className = app.searchWrap_.className.replace(app.regMini, ' done ');
        app.query_.blur();
        return false;
      }
      else {
        app.filterBy = '';
        filterResults();
      }
    }
  });
  addEvent(app.send_, 'click', function ( event ) {
    app.term = _.trim(app.query_.value);
    if ( !app.term ) { /* show notification/input validate here */
      return false;
    }
    app.page_.className += ' loading';
    app.filterBy = '';
    sendData(dataResponse, app.term, 'content', 'search', app.placeContent, app.placeMeta);
    if ( event.preventDefault ) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
    return false;
  });
  addEvent(app.moreContent_, 'click', function ( event ) {
    app.page_.className += ' loading';
    sendData(dataResponse, ( document.cookie.placeContent||app.placeContent ) ? '' : app.term, 'content', 'more', document.cookie.placeContent||app.placeContent, null);
    if ( event.preventDefault ) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
  });
  addEvent(app.moreMeta_, 'click', function ( event ) {
    app.page_.className += ' loading';
    sendData(dataResponse, ( document.cookie.placeMeta||app.placeMeta ) ? '' : app.term, 'meta', 'more', null, document.cookie.placeMeta||app.placeMeta);
    if ( event.preventDefault ) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
  });
  addEvent(app.page_, 'click', function ( event ) {
    if ( app.regMini.test(app.searchWrap_.className) ) {
      app.searchWrap_.className = app.searchWrap_.className.replace(app.regMini, ' done ');
      if ( event.preventDefault ) {
        event.preventDefault();
      } else {
        event.returnValue = false;
      }
    }
  });
  addEvent(app.searchRestore_, 'click', function ( event ) {
    app.query_.value = app.term||'';
    app.searchWrap_.className = app.searchWrap_.className.replace(/done(?=\b)/, ' mini ');
    app.query_.focus();
    if ( event.preventDefault ) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
    event.stopPropagation();
    return false;
  });
  addEvent(window, 'load', function ( event ) {
    if ( window.location.search !== '' ) {
      app.query_.value = decodeURIComponent(window.location.search.slice(3).replace(/\+(?!\%20)/g, '%20'));
      app.send_.click();
    }
  });

/*  addEvent(window, 'hashchange', function ( event ) {
    var hash = event.newURL.slice(_.indexOf(event.newURL, '#') + 1);
    if ( hash !== 'page' && hash !== '' ) {
      if ( app.filtered_ !== null ) {
        _.forEach(app.filtered_, function (found) {
          found.className = found.className.replace(/ ?selected| ?filtered/gi, '');
        });
      }
      app.results_.className += ' filtered';
      app.filtered_ = document.querySelectorAll('[data-pub="' + hash + '"]');
      _.forEach(app.filtered_, function (found) {
        found.className += ' selected';
      });
    }
  });*/

})();
