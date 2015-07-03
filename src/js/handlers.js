"use strict";
function revealText ( event ) {
  var open = regOpened.test(this.parentNode.className);
  this.innerHTML = "";
  if (!open) {
    swapClass(this.parentNode, "opened", regOpened);
    this.innerHTML = "expand";
  }
  else {
    swapClass(this.parentNode, "", regOpened);
    this.innerHTML = "consolidate";
  }
  event.preventDefault();
  return false;
}

function modalClose ( event ) {
  if ( event.target === event.currentTarget ) {
    app.searchBoxToggle("close");
  }
}

function more ( event ) {
  if ( event && event.preventDefault ) {
    event.preventDefault();
  }
  if ( app.loading.now !== true ) {
    swapClass(app.loader_, "loading", regLoad);
  }
  submitQuery(handleResponse, ( document.cookie.placeContent||app.placeContent ) ? "" : app.term, "content", "more", document.cookie.placeContent||app.placeContent, null, endLoading);
  return false;
}

function infini ( event ) {
  var status, doThis;
  app.infiniScroll = this.checked || (!!this.checked);
  status = (app.infiniScroll) ? "enabled" : "disabled";
  doThis = (app.infiniScroll) ? "Disable" : "Enable";
  app.infiniLabel_.className = status;
  app.infiniLabel_.setAttribute("title", doThis + " infinite scroll");
  if ( !status ) {
    this.removeAttribute("checked");
  }
}

function scrollWheeler ( event ) {
  var t = document.documentElement||document.body.parentNode,
    pos = (t && typeof t.ScrollTop === "number" ? t : document.body).ScrollTop || window.pageYOffset,
    delta = pos - app.pos;

  if ( app.infiniScroll === true && app.loading.now === false && app.loading.stillMore === true && (delta > 0) && pos > app.loading.currentHeight - 1200 ) {
    app.loading.now = true;
    more();
  }
  app.pos = pos;
}
