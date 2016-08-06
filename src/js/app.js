(function ( window, document, template, forEach, undefined ) {
    "use strict";
    var resetSearch = null;

    var maps = {
        "colors": Immutable.Map(),
        "layout": Immutable.Map(),
        "results": Immutable.Map(),
        "scores": Immutable.Map({
            "content": [],
            "related": []
        }),
        "state": Immutable.Map({
            "moreToLoad": false,
            "isLoading": false,
            "isDone": false,
            "isSearchBoxOpen": false,
            "placeContent": '',
            "placeMeta": ''
        })
    };

    var setMap = function ( type, key, data ) {
        var _map = maps[ type ];
        var value = _map.get(key);
        if ( data !== null ) {
            if ( typeof value === 'undefined' ) {
                maps[ type ] = _map.set(key, data);
            }
            else {
                if ( typeof data === 'function' ) {
                    maps[ type ] = _map.update(key, data);
                }
                else {
                    maps[ type ] = _map.update(key, function ( current ) {
                        if ( Array.isArray(current) && Array.isArray(data) ) {
                            return current.concat(data);
                        }
                        if ( typeof current !== 'object' ) {
                            return data;
                        }
                        return Object.assign({}, current, data);
                    });
                }
            }
        }
        else {
            if ( typeof value !== 'undefined' ) {
                maps[ type ] = _map.delete(key);
            }
            else {
                maps[ type ] = Immutable.Map();
            }
        }
        return maps[ type ];
    };

    var resetMap = function ( type, key, data ) {
        var _map = maps[ type ];
        var value = _map.get(key);
        if ( typeof value !== 'undefined' ) {
            maps[ type ] = _map.delete(key, null);
        }
        return setMap(type, key, data);
    };

    var showMessage = function ( message ) {
        fastdom.mutate(function () {
            this.innerHTML = message;
        }, document.getElementById("message"), message || '');
    };

    var showLoader = function () {
        var regLoad = / ?loading/g;
        swapClass(document.getElementById("loader"), "loading", regLoad);
    };

    var hideLoader = function () {
        var regLoad = / ?loading/g;
        swapClass(document.getElementById("loader"), "", regLoad);
    };

    var processRelated = function ( related, template ) {
        var b = 0;
        var count = related.length;
        var score = new Array(count);
        for ( ; b < count; ++b ) {
            score[ b ] = related[ b ].score;
        }
        fastdom.mutate(function ( relatedHTML ) {
            this.innerHTML = relatedHTML;
        }, document.getElementById("related-list"), renderRelated(related, template));
    };

    var processContent = function ( _hits, template ) {
        var hits = _hits.hits;
        var count = hits.length;
        var scores = new Array(count);
        var b = 0;
        for ( ; b < count; ++b ) {
            scores[ b ] = hits[ b ]._score;
        }
        resetMap('scores', 'content', scores);
        fastdom.mutate(function ( term ) {
            this.innerHTML = term;
        }, document.getElementById("term"), maps.state.get('term'));
        fastdom.mutate(function ( count ) {
            this.innerHTML = count;
        }, document.getElementById("count"), hits.length);
        fastdom.mutate(function ( total ) {
            this.innerHTML = total;
        }, document.getElementById("total"), _hits.total);
        fastdom.mutate(function ( resultsHTML ) {
            forEach.call(this.querySelectorAll('.reveal-text'), function ( el ) {
                el.parentNode.removeChild(el);
                el = null;
            });
            this.innerHTML = resultsHTML;
        }, document.getElementById("results"), renderResults(hits, template));
    };

    var processMoreContent = function ( hits, templates ) {
        var count = hits.length;
        var scores = new Array(count);
        for ( var b = 0; b < count; ++b ) {
            scores[ b ] = hits[ b ]._score;
        }
        setMap('scores', 'content', scores);
        fastdom.mutate(function ( total ) {
            this.innerHTML = total;
        }, document.getElementById("count"), count);
        fastdom.mutate(function ( resultsHTML ) {
            this.innerHTML += resultsHTML;
        }, document.getElementById("results"), renderResults(hits, templates.results));
    };

    var searchReset = function () {
        // Server is only caching the scroll/page position for 1 minute.
        // Sorry bucko.
        var regHidden = / ?hidden/g;
        swapClass(document.getElementById("more-content"), "hidden", regHidden);
        setMap('state', 'moreToLoad', false);
    };

    var handleTimer = function () {
        if ( resetSearch ) {
            clearTimeout(resetSearch);
        }
        resetSearch = setTimeout(searchReset, 60000);
    };

    var handleResponse = function ( response, action ) {
        var content = response[ 0 ] || null;
        var meta = response[ 1 ] || null;
        var regFail = / ?failed/g;
        var regHidden = / ?hidden/g;

        if ( (content && content.hits.total === 0) &&
            (meta && meta.hits.total === 0) ) {
            document.cookie = "placeContent=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            document.cookie = "placeMeta=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";

            setMap('state', 'isFailure', true);
            setMap('state', 'infiniScroll', false);

            showMessage("Your search returned no results.  Give \'er another go.");
            hideLoader();
            fastdom.mutate(function () {
                this.style.display = "none";
            }, document.getElementById("x"));
            swapClass(document.getElementById("search-wrap"), "failed", regFail);
            return false;
        }

        setMap('state', 'isFailure', false);

        var expires = new Date(Date.now() + 60000);
        expires = expires.toUTCString();

        handleTimer();

        if ( content ) {
            var templates = makeTemplates(template);
            var placeContent = content._scroll_id;
            setMap('state', 'placeContent', placeContent);
            document.cookie = "placeContent=" + placeContent + "; expires=" + expires;
            if ( action !== "more" ) {
                fastdom.mutate(function () {
                    this.scroll(0, 0);
                }, window);
                processContent(content, templates.results);
                processRelated(content.aggregations.related_doc.buckets, templates.related);
            }
            else {
                processMoreContent(content.hits.hits, templates.results);
            }

            fastdom.measure(function () {
                var rect = this.getBoundingClientRect();
                var bodyRect = document.body.getBoundingClientRect();
                setMap('layout', 'relatedRect', rect);
                setMap('layout', 'bodyRect', bodyRect);
                setMap('layout', 'stickyBarPosition', Math.abs(rect.top) + Math.abs(bodyRect.top) + Math.abs(rect.height));
            }, document.getElementById("related-list"));

            var reveals = document.getElementById("results").querySelectorAll(".reveal-text");
            var total = reveals.length;
            var a = 0;
            for ( ; a < total; ++a ) {
                addEvent(reveals[ a ], "click", revealText);
            }

            if ( content.hits.hits.length < 20 ) {
                setMap('state', 'moreToLoad', false);
                swapClass(document.getElementById("more-content"), "hidden", regHidden);
            }
            else {
                setMap('state', 'moreToLoad', true);
                swapClass(document.getElementById("more-content"), "", regHidden);
            }
        }

        if ( meta ) {
            var placeMeta = meta._scroll_id;
            setMap('state', 'placeMeta', placeMeta);
            document.cookie = "placeMeta=" + placeMeta + "; expires=" + expires;
        }

        fastdom.measure(function () {
            var rect = this.getBoundingClientRect();
            setMap('layout', 'resultsRect', rect);
            setMap('layout', 'currentHeight', Math.abs(rect.height));
            setMap('state', 'isLoading', false);
        }, document.getElementById("results"));

        searchBoxToggle(false);
        hideLoader();
    };

    var submitQuery = function ( type, action, contentPager, metaPager ) {
        var query = maps.state.get('term');
        var url = document.location.protocol + "//that.pub/find/" + type + "/" + action;
        var dataString = JSON.stringify({
            "term": querySetup(query),
            "contentPage": contentPager,
            "metaPage": metaPager
        });
        connect(url, dataString, function ( request ) {
            setMap('state', 'isDone', true);
            handleResponse(JSON.parse(request.responseText), action);
        });
    };

    var getContent = function () {
        var state = maps.state;
        if ( state.get('isLoading') !== true ) {
            showLoader();
        }
        submitQuery("content", "more", document.cookie.placeContent || state.get('placeContent'), null);
    };

    var searchBoxToggle = function ( open ) {
        var state = maps.state;
        var regEmerge = / ?emerge/g;
        var regFail = / ?failed/g;
        var term = state.get('term');
        var query_ = document.getElementById("query");
        var searchWrap_ = document.getElementById("search-wrap");
        if ( open ) {
            // Prep the elements before showtime
            fastdom.mutate(function ( term ) {
                this.value = term;
            }, query_, term);
            fastdom.mutate(function () {
                this.style.display = "none";
            }, document.getElementById("ico"));
            fastdom.mutate(function () {
                this.style.display = "";
            }, document.getElementById("x"));

            swapClass(searchWrap_, "emerge", regEmerge);

            if ( state.get('isFailure') === true ) {
                swapClass(searchWrap_, "failed", regFail);
            }

            setMap('state', 'isSearchBoxOpen', true);
            setMap('state', 'infiniScroll', false);
        }
        else if ( state.get('isDone') === true ) {
            swapClass(searchWrap_, "", regEmerge);
            swapClass(searchWrap_, "", regFail);
            var infiniState = state.get('infiniScroll') ?
                              !!this.infiniScroll_.checked :
                              true;
            setMap('state', 'infiniScroll', infiniState);
            setMap('state', 'term', query_.value.trim());
            fastdom.mutate(function () {
                this.style.display = "";
            }, document.getElementById("ico"));
            fastdom.mutate(function () {
                this.style.display = "none";
            }, document.getElementById("x"));
            showMessage();
            setMap('state', 'isSearchBoxOpen', false);
        }
    };

    var searchStart = function ( event ) {
        var regValidate = / ?invalidated/g;
        var query_ = document.getElementById("query");
        var val = query_.value.trim();
        var state = maps.state;

        event.preventDefault();
        event.stopPropagation();

        setMap('state', 'isFailure', false);
        setMap('state', 'isDone', false);

        // show notification/validate input here
        if ( !val ) {
            setMap('state', 'queryInvalidated', true);
            swapClass(query_, "invalidated", regValidate);
            showMessage("You gotta type something first.");
            query_.focus();
        }

        setMap('state', 'term', val);
        showLoader();
        submitQuery("content", "search", state.get('placeContent'), state.get('placeMeta'));
    };

    addEvent(document.getElementById("send"), "click", searchStart);

    var handleFocus = function () {
        if ( maps.state.get('queryInvalidated') !== true ) {
            return false;
        }
    };

    addEvent(document.getElementById("query"), "focus", handleFocus);

    var handleInput = function ( event ) {
        var regValidate = / ?invalidated/g;
        var state = maps.state;

        // Enter key pressed > submit query
        if ( event.which === 13 && state.get('isSearchBoxOpen') === true ) {
            searchStart(event);
        }
        // After error they decide to type something
        if ( state.get('queryInvalidated') === true && event.which !== 13 ) {
            setMap('state', 'queryInvalidated', false);
            swapClass(event.currentTarget, "", regValidate);
            showMessage(null);
        }
        event.stopPropagation();
    };

    addEvent(document.getElementById("query"), "keypress", handleInput);

    var closeModal = function ( event ) {
        var state = maps.state;
        if ( event.which === 27 &&
            state.get('isSearchBoxOpen') === true &&
            state.get('isFailure') === false ) {
            event.preventDefault();
            searchBoxToggle(false);
        }
    };

    addEvent(document, "keyup", closeModal);

    var handleMoreContent = function ( event ) {
        event.preventDefault();
        event.stopPropagation();
        getContent(false);
    };

    addEvent(document.getElementById("more-content"), "click", handleMoreContent);

    var handleRestore = function ( event ) {
        event.preventDefault();
        event.stopPropagation();
        var state = maps.state;
        if ( state.get('isSearchBoxOpen') === true && state.get('isLoading') !== true && state.get('isFailure') !== true ) {
            searchBoxToggle(false);
        }
        else {
            var query_ = document.getElementById("query");
            searchBoxToggle(true);
            query_.value = state.get('term');
            query_.focus();
        }
    };

    addEvent(document.getElementById("search-restore"), "click", handleRestore);

    var infini = function () {
        var state = maps.state;
        var infiniScroll = !!this.checked;
        setMap('state', 'infiniScroll', infiniScroll);
        var status = infiniScroll ? "enabled" : "disabled";
        var doThis = infiniScroll ? "Disable" : "Enable";
        var infiniLabel_ = document.getElementById("infini-label");
        fastdom.mutate(function ( status ) {
            this.className = status;
        }, infiniLabel_, status);
        infiniLabel_.setAttribute("title", doThis + " infinite scroll");

        // Unreachable code
        /*if ( !status ) {
         this.removeAttribute("checked");
         }*/
    };

    addEvent(document.getElementById('infini-scroll'), "change", infini);

    var scrollWheeler = function () {
        var state = maps.state;
        var layout = maps.layout;
        fastdom.measure(function () {
            var position = (
                        rootElement && typeof rootElement.ScrollTop === "number" ?
                        rootElement :
                        document.body
                    ).ScrollTop || window.pageYOffset,
                delta = position - layout.get('position');
            if (
                delta > 0 &&
                state.get('infiniScroll') === true &&
                state.get('nowLoading') === false &&
                state.get('moreToLoad') === true &&
                position > layout.get('currentHeight') - 1200
            ) {
                getContent(true);
            }
            setMap('layout', 'position', position);
        });
    };

    addEvent(window, "scroll", scrollWheeler);

    var handleWindowLoad = function () {
        setMap('state', 'isSearchBoxOpen', true);
        document.getElementById("query").focus();
    };

    addEvent(window, "load", handleWindowLoad);

    var handleDOMReady = function () {
        FastClick.attach(document.body);
    };

    addEvent(document, "DOMContentLoaded", handleDOMReady);

    var revealText = function ( event ) {
        var regOpened = / ?opened/g;
        var target = event.currentTarget;
        var open = target.getAttribute("data-opened");
        event.preventDefault();
        event.stopPropagation();
        if ( open !== "true" ) {
            swapClass(target.parentNode, "opened", regOpened);
            fastdom.mutate(function () {
                this.innerHTML = "consolidate";
                this.setAttribute("data-opened", "true");
            }, target);
        }
        else {
            swapClass(target.parentNode, "", regOpened);
            fastdom.mutate(function () {
                this.innerHTML = "expand";
                this.setAttribute("data-opened", "false");
            }, target);
        }
    };

    var makeDetails = function ( chapter, section, highlight ) {
        return {
            "chapter": chapter && chapter.number || null,
            "chapterTitle": highlight[ "chapter.title" ] || chapter && chapter.title || null,
            "section": section && section.number || null,
            "sectionTitle": highlight[ "section.title" ] || section && section.title || null
        };
    };

    var makeScoreObj = function ( score, key, allScores, upperMax ) {
        var index = allScores.indexOf(score);
        var group = index > -1 ?
                    " match-" + index :
                    "";
        setMap('colors', key, index);
        return {
            "key": key,
            "url": document.location.protocol + "//that.pub/get/" + key.toLowerCase() + ".pdf",
            "score": score,
            "gravitas": ( upperMax < score || score >= 1 ) ?
                        " pretty" + group :
                        " boring" + group
        };
    };

    /**
     * I really outta come in and comment this shit at some point.
     **/
    var organizeData = function ( data, allScores, upperMax ) {
        var regPubMatch = /productNo(?:\.exact|\.raw)?(?=\:|$)/;
        var regType = /chapter|section/;
        var source = data._source;
        var key = data.key;
        var score = data.score;
        var type = data._type;
        var _score = data._score;
        if ( !source && key && score ) {
            //  This won't work without more fields in the aggregation to give me
            //  info to use.  File type is unknown, date, URL, etc.
            return makeScoreObj(score, key, allScores, upperMax);
        }
        else if ( source.text ) {
            var highlight = data.highlight;
            var number = source.number;
            var text = highlight[ "text.english2" ];
            var rawText = source.text;
            var fullPub = source.productNo;
            var highlights = Object.keys(highlight);
            var fileFormat = ( type !== "form" ) ? ".pdf" : ".xfdl";

            if ( regPubMatch.test(highlights.join(/:/)) ) {
                fullPub = highlight[ "productNo.exact" ] || highlight[ "productNo.raw" ] || highlight.productNo;
                fullPub = fullPub.shift();
            }
            var date = ( source.releaseDate ) ?
                       source.releaseDate.substring(6, 8) + " " + months[ source.releaseDate.substring(4, 6) ] + " " + source.releaseDate.substring(0, 4) :
                       source.publishedDate.substring(0, 2) + " " + months[ source.publishedDate.substring(2, 4) ] + " " + source.publishedDate.substring(4, 8);

            if ( regType.test(type) && type.length == 7 ) {
                number = type.toTitle() + " " + data._source.number;
            }
            var index = maps.colors.get(data._source.productNo || data._source.pubName);
            var group = ( index && typeof index === "number" && (index > 0 || index < 5)) ?
                        " match-" + index :
                        "";
            return {
                "score": _score,
                "gravitas": ( upperMax < data.score || data.score >= 1 ) ?
                            " pretty" + group :
                            " boring" + group,
                "date": date,
                "url": document.location.protocol + "//that.pub/get/" + data._source.productNo.toLowerCase() + fileFormat,
                "fullPub": fullPub,
                "title": highlight.title || data._source.title || null,
                "rawTitle": source.title,
                "sub": rawText ? number : "",
                "details": makeDetails(source.chapter, source.section, highlight),
                "rawText": rawText,
                "concatText": Array.isArray(highlight.text) && highlight.text[ 0 ] || null,
                "parts": Array.isArray(text) && text || null,
                "fileFormat": fileFormat,
                "type": rawText ? " content" : " doc"
            };
        }
        return null;
    };

    var makeRenderString = function ( results, template, scores ) {
        var upperMax = upperOutlier(scores);
        var count = results.length;
        var renderArr = new Array(count);
        var a = 0;
        var dataObj;
        for ( ; a < count; ++a ) {
            dataObj = organizeData(results[ a ], scores, upperMax);
            renderArr[ a ] = template(dataObj);
        }
        return renderArr.join('');
    };

    var renderRelated = function ( results, template ) {
        var scores = maps.scores.get('related');
        return makeRenderString(results, template, scores);
    };

    var renderResults = function ( results, template ) {
        var scores = maps.scores.get('content');
        return makeRenderString(results, template, scores);
    };

})(this, this.document, _.template, Array.prototype.forEach);
