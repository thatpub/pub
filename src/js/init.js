"use strict";

addEvent(app.send_, "click", app.searchStart);

addEvent(app.query_, "focus", app.handleFocus);

addEvent(app.query_, "keypress", app.handleInput);

addEvent(document, "keyup", app.closeModal);

addEvent(app.moreContent_, "click", function ( event ) {
    if ( event && event.preventDefault ) {
        event.preventDefault();
    }
    event.stopPropagation();
    app.getContent();
});

addEvent(app.searchRestore_, "click", function ( event ) {
    event.preventDefault();
    if ( app.isSearchBoxOpen === true && app.isDone === true && app.isFailure !== true ) {
        app.searchBoxToggle("close");
    }
    else {
        app.searchBoxToggle("open");
        app.query_.value = app.term;
        app.query_.focus();
    }
    return false;
});

addEvent(app.infiniScroll_, "change", app.infini);

addEvent(window, "scroll", app.scrollWheeler);

addEvent(window, "load", function () {
    // console.log("window.onload @ " + performance.now());
    app.isSearchBoxOpen = true;
    app.query_.focus();
});

addEvent(document, "DOMContentLoaded", function () {
    // console.log("DOMContLoad @ " + performance.now());
    FastClick.attach(document.body);
});
