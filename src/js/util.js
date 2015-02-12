"use strict";

var regPubMatch = /productNo(?:\.exact|\.raw)?(?=\:|$)/,
  regEmerge = / ?emerge/g,
  regHidden = / ?hidden/g,
  regLoad = / ?loading/g,
  regSelected = / ?selected/g,
  regSticky = / ?sticky/g,
  regFiltered = / ?filtered/g,
  regOpened = / ?opened/g,
  regDone = / ?done|$/gm,
  regFail = / ?failed/g;

function addEvent ( element, evt, fnc ) {
  return ((element.addEventListener) ? element.addEventListener(evt, fnc, false) : element.attachEvent("on" + evt, fnc));
}

function swapClass ( element, string, regex ) {
  if ( string !== "" ) {
    element.className = (regex.test(element.className)) ?
    element.className.replace(regex, "") + " " + string :
    element.className + " " + string;
  }
  else {
    element.className = element.className.replace(regex, "");
  }
}

function removeEvent ( element, evt, fnc ) {
  return ((element.removeEventListener) ? element.removeEventListener(evt, fnc, false) : element.detachEvent("on" + evt, fnc));
}

String.prototype.toTitle = function () {
  return this.replace(/(?:\W?)\w\S*/g, function( txt ) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

String.prototype.toPubName = function() {
  var removed,
      count = 0,
      extraction = [],
      regQueryPubName = /(?:\b[\-_a-zA-Z]{1,3})?[ \t\-]*(?:(?:[\.\-]|[0-9]+)+)+(?:_?(?:sup|SUP)[A-Za-z]*)?/g,
      regEOLDashCheck = /[\-\cI\v\0\f]$/m;
  removed = this.replace(regQueryPubName, function( txt ) {
    if ( extraction && (extraction.length > 0) && regEOLDashCheck.test(extraction[count-1]) ) {
      extraction[count-1] += txt.toUpperCase().replace(/\s/g, "");
    }
    else {
      extraction.push( txt.toUpperCase().replace(/\s/g, "") );
    }
    count += 1;
    return "";
  });
  return {
    extract: extraction,
    remove: removed
  };
};

window.downloader = function ( el ) {
  var link = document.createElement("a"),
      file = el.href||el.getAttribute("href")||"";
  if ( file === "" ) { return false; }
  link.download = el.download||el.getAttribute("download");
  link.href = file;
  link.target = "_blank";
  try { link.click(); }
  catch (e) {
    try { window.open( file ); }
    catch (ee) {
      window.location.href = file;
    }
  }
  return false;
};

