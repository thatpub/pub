"use strict";

var regPubMatch = /productNo(?:\.exact|\.raw)?(?=\:|$)/;
//regCheckInput = /[A-Za-z0-9\s\-\_\.\,\&]/g,
//regFixInput = /[^A-Za-z0-9\s\-\_\.\,\&]/g,
var regEmerge = / ?emerge/g;
var regHidden = / ?hidden/g;
var regLoad = / ?loading/g;
//regSelected = / ?selected/g,
var regOpened = / ?opened/g;
var regFail = / ?failed/g;
var regValidate = / ?invalidated/g;
var regQueryPubName = /\d* ?[-_a-z]+[\s\.\-]*[0-9]+(?:-|\.)[0-9]+(?:_?sup[a-z]*)?/gi;
var regEOLDashCheck = /[\-\cI\v\0\f]$/m;
var regPreTitle = /(?:\W?)\w\S*/g;

function addEvent ( element, evt, fnc ) {
    return element.addEventListener(evt, fnc, false);
}

//function removeEvent ( element, evt, fnc ) {
//  return element.removeEventListener(evt, fnc, false);
//}

function swapClass ( element, string, regex ) {
    var className = element.className;
    if ( string !== "" ) {
        if ( regex.test(className) ) {
            return false;
        }
        element.className += " " + string;
    }
    else {
        element.className = className.replace(regex, "");
    }
}

// Because I type it enough to get lazy.
//function txt ( string ) {
//  if (string && typeof string === "string" && string.length > 0) {
//    return document.createTextNode(string);
//  }
//}

String.prototype.toTitle = function () {
    return this.replace(regPreTitle, function ( txt ) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

String.prototype.toPubName = function () {
    var regSpace = /\s/g;
    var removed;
    var count = 0;
    var extraction = [];
    removed = this.replace(regQueryPubName, function ( txt ) {
        if ( extraction.length > 0 && regEOLDashCheck.test(extraction[ count - 1 ]) ) {
            extraction[ count - 1 ] += txt.toUpperCase().replace(regSpace, "");
        }
        else {
            extraction.push(txt.toUpperCase().replace(regSpace, ""));
        }
        count += 1;
        return "";
    });
    return {
        removed: removed,
        extract: extraction
    };
};

CSSStyleSheet.prototype.addCSSRule = function ( selector, rules, index ) {
    if ( "insertRule" in this ) {
        this.insertRule(selector + "{" + rules + "}", index);
    }
    else if ( "addRule" in this ) {
        this.addRule(selector, rules, index);
    }
};

window.downloader = function ( el ) {
    var link = document.createElement("a"),
        file = el.href || el.getAttribute("href") || "";
    if ( file === "" ) {
        return false;
    }
    link.download = el.download || el.getAttribute("download");
    link.href = file;
    link.target = "_blank";
    try {
        link.click();
    }
    catch ( e ) {
        try {
            window.open(file);
        }
        catch ( ee ) {
            window.location.href = file;
        }
    }
    return false;
};

// Like my own calendar hash table.
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
};

function querySetup ( text ) {
    if ( !text ) return {
        term: "",
        pubName: "",
        noPubName: ""
    };
    return (function ( name ) {
        return {
            term: text,
            pubName: name.extract,
            noPubName: name.removed
        };
    })(text.toPubName());
}

function upperOutlier ( someArray ) {
    // Courtesy of http://stackoverflow.com/a/20811670/2780033
    // thanks jpau
    var values = someArray.concat();
    values.sort(function ( a, b ) {
        return a - b;
    });
    var q1 = values[ Math.floor((values.length / 4)) ];
    var q3 = values[ Math.ceil((values.length * (3 / 4))) ];
    var iqr = q3 - q1;
    return q3 + (iqr * 1.5);
}
