function App () {
  "use strict";
  return {
    loader_: document.getElementById("loader"),
    searchWrap_: document.getElementById("search-wrap"),
    query_: document.getElementById("query"),
    send_: document.getElementById("send"),
    message_: document.getElementById("message"),
    wrap_: document.getElementById("wrap"),
    page_: document.getElementById("page"),
    searchRestore_: document.getElementById("search-restore"),
    searchIcon_: document.getElementById("ico"),
    xIcon_: document.getElementById("x"),
    pageHeader_: document.getElementById("page-header"),
    related_: document.getElementById("related-list"),
    results_: document.getElementById("results"),
    term_: document.getElementById("term"),
    count_: document.getElementById("count"),
    total_: document.getElementById("total"),
    moreContent_: document.getElementById("more-content"),
    infiniLabel_: document.getElementById("infini-label"),
    infiniScroll_: document.getElementById("infini-scroll"),
    placeContent: document.cookie.placeContent||"",
    placeMeta: document.cookie.placeMeta||"",
    infiniScroll: true,
    loading: {
      now: false,
      stillMore: false,
      currentHeight: 0
    },
    bodyRect: null,
    relatedRect: null,
    resultsRect: null,
    relatedOffsetTop: null,
    stickyBarPosition: null,
    pos: 0,
    term: "",
    scoresContent: [],
    scoresRelatives: [],
    colors: {},
    isSearchBoxOpen: true,
    isFailure: false,
    isDone: false
  };
};

var app = new App();
