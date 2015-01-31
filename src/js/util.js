;(function( undefined ) {
  "use strict";
  String.prototype.toPubName = function() {
    var removed = "",
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
})();
