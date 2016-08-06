"use strict";

var addEvent = function ( element, evt, fnc ) {
    return element.addEventListener(evt, fnc, false);
};

var removeEvent = function ( element, evt, fnc ) {
    return element.removeEventListener(evt, fnc, false);
};

var swapClass = function ( element, string, regex ) {
    if ( string !== "" ) {
        if ( regex.test(element.className) ) {
            return false;
        }
        fastdom.mutate(function () {
            this.className += " " + string;
        }, element);
    }
    else {
        fastdom.mutate(function () {
            this.className = this.className.replace(regex, "");
        }, element);
    }
};

String.prototype.toTitle = function () {
    var regPreTitle = /(?:\W?)\w\S*/g;
    return this.replace(regPreTitle, function ( txt ) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

String.prototype.toPubName = function () {
    var regQueryPubName = /\d* ?[-_a-z]+[\s\.\-]*[0-9]+(?:-|\.)[0-9]+(?:_?sup[a-z]*)?/gi;
    var regEOLDashCheck = /[\-\cI\v\0\f]$/m;
    var regSpace = /\s/g;
    var removed;
    var count = 0;
    var extraction = [];
    removed = this.replace(regQueryPubName, function ( txt ) {
        var text = txt.toUpperCase().replace(regSpace, "");
        if ( extraction.length > 0 && regEOLDashCheck.test(extraction[ count - 1 ]) ) {
            extraction[ count - 1 ] += text;
        }
        else {
            extraction[ extraction.length ] = text;
        }
        count += 1;
        return "";
    });
    return {
        "removed": removed,
        "extract": extraction
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

// Was originally for IE < OLD so no need for it now.
/*window.downloader = function ( el ) {
 var link = document.createElement("a"),
 file = el.href || el.getAttribute("href") || "";
 if ( file === "" ) {
 return false;
 }
 link.download = el.download || el.getAttribute("download");
 link.href = file;
 link.target = "_blank";
 if ( typeof link.click === 'function' ) {
 link.click();
 }
 else {
 window.open(file);
 }
 return false;
 };*/

// Like my own calendar hash table.
var months = Object.defineProperties(
    Object.create(null), {
        "01": { "value": "Jan" },
        "02": { "value": "Feb" },
        "03": { "value": "Mar" },
        "04": { "value": "Apr" },
        "05": { "value": "May" },
        "06": { "value": "Jun" },
        "07": { "value": "Jul" },
        "08": { "value": "Aug" },
        "09": { "value": "Sep" },
        "10": { "value": "Oct" },
        "11": { "value": "Nov" },
        "12": { "value": "Dec" }
    }
);

var querySetup = function ( text ) {
    if ( !text ) {
        return {
            "term": "",
            "pubName": "",
            "noPubName": ""
        };
    }
    var name = text.toPubName();
    return {
        "term": text,
        "pubName": name.extract,
        "noPubName": name.removed
    };
};

var upperOutlier = function ( someArray ) {
    // Courtesy of http://stackoverflow.com/a/20811670/2780033
    // thanks jpau
    var values = someArray.slice();
    var total = values.length;
    values.sort(function ( a, b ) {
        return a - b;
    });
    var q1 = values[ Math.floor(total / 4) ];
    var q3 = values[ Math.ceil(total * 3 / 4) ];
    var iqr = q3 - q1;
    return q3 + (iqr * 3 / 2);
};

var connect = function ( url, dataString, callback ) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if ( request.readyState === 4 && request.status === 200 ) {
            callback(request);
        }
    };

    request.open("POST", url, true);
    request.setRequestHeader("Content-type", "application/json");
    request.send(dataString);
};
