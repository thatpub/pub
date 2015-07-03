(function() {
    function Z(a, b, c) {
        if (b !== b) {
            a: {
                b = a.length;
                for (c = (c || 0) - 1; ++c < b; ) {
                    var d = a[c];
                    if (d !== d) {
                        a = c;
                        break a;
                    }
                }
                a = -1;
            }
            return a;
        }
        c = (c || 0) - 1;
        for (d = a.length; ++c < d; ) if (a[c] === b) return c;
        return -1;
    }
    function v(a) {
        return typeof a == "string" ? a : null == a ? "" : a + "";
    }
    function ra(a, b) {
        for (var c = -1, d = a.length; ++c < d && -1 < b.indexOf(a.charAt(c)); ) ;
        return c;
    }
    function sa(a, b) {
        for (var c = a.length; c-- && -1 < b.indexOf(a.charAt(c)); ) ;
        return c;
    }
    function ta(a) {
        return ua[a];
    }
    function va(a) {
        return "\\" + wa[a];
    }
    function t(a) {
        return a && typeof a == "object" || false;
    }
    function $(a) {
        return 160 >= a && 9 <= a && 13 >= a || 32 == a || 160 == a || 5760 == a || 6158 == a || 8192 <= a && (8202 >= a || 8232 == a || 8233 == a || 8239 == a || 8287 == a || 12288 == a || 65279 == a);
    }
    function f() {}
    function aa(a, b, c, d) {
        return typeof a != "undefined" && u.call(d, c) ? a : b;
    }
    function D(a, b, c) {
        var d = E(b);
        if (!c) {
            d || (d = a, a = {});
            c = -1;
            for (var e = d.length; ++c < e; ) {
                var f = d[c];
                a[f] = b[f];
            }
            return a;
        }
        e = -1;
        for (f = d.length; ++e < f; ) {
            var p = d[e], m = a[p], g = c(m, b[p], p, a, b);
            (g === g ? g === m : m !== m) && (typeof m != "undefined" || p in a) || (a[p] = g);
        }
        return a;
    }
    function xa(a) {
        var b, c = 1, d = -1, e = a.length, c = null == c ? 0 : +c || 0;
        0 > c && (c = -c > e ? 0 : e + c);
        b = typeof b == "undefined" || b > e ? e : +b || 0;
        0 > b && (b += e);
        e = c > b ? 0 : b - c >>> 0;
        c >>>= 0;
        for (b = Array(e); ++d < e; ) b[d] = a[d + c];
        return b;
    }
    function ba(a, b) {
        for (var c = -1, d = b.length, e = Array(d); ++c < d; ) e[c] = a[b[c]];
        return e;
    }
    function O(a, b) {
        a = +a;
        b = null == b ? ca : b;
        return -1 < a && 0 == a % 1 && a < b;
    }
    function P(a, b, c) {
        if (!w(c)) return false;
        var d = typeof b;
        "number" == d ? (d = c.length, d = s(d) && O(b, d)) : d = "string" == d && b in c;
        return d && c[b] === a;
    }
    function s(a) {
        return typeof a == "number" && -1 < a && 0 == a % 1 && a <= ca;
    }
    function da(a) {
        for (var b = ea(a), c = b.length, d = c && a.length, e = f.support, e = d && s(d) && (F(a) || e.nonEnumStrings && G(a) || e.nonEnumArgs && H(a)), g = -1, p = []; ++g < c; ) {
            var m = b[g];
            (e && O(m, d) || u.call(a, m)) && p.push(m);
        }
        return p;
    }
    function Q(a, b, c) {
        var d = a ? a.length : 0;
        if (!d) return -1;
        if (typeof c == "number") c = 0 > c ? fa(d + c, 0) : c || 0; else if (c) {
            c = 0;
            d = a ? a.length : c;
            if (typeof b == "number" && b === b && d <= ya) {
                for (;c < d; ) {
                    var e = c + d >>> 1;
                    a[e] < b ? c = e + 1 : d = e;
                }
                c = d;
            } else {
                d = ga;
                c = d(b);
                for (var e = 0, f = a ? a.length : 0, g = c !== c, m = typeof c == "undefined"; e < f; ) {
                    var k = za((e + f) / 2), h = d(a[k]), l = h === h;
                    (g ? l : m ? l && typeof h != "undefined" : h < c) ? e = k + 1 : f = k;
                }
                c = Aa(f, Ba);
            }
            a = a[c];
            return (b === b ? b === a : a !== a) ? c : -1;
        }
        return Z(a, b, c);
    }
    function R(a, b, c) {
        var d = a ? a.length : 0;
        s(d) || (a = ha(a), d = a.length);
        if (!d) return false;
        c = typeof c == "number" ? 0 > c ? fa(d + c, 0) : c || 0 : 0;
        typeof a == "string" || !F(a) && G(a) ? a = c < d && -1 < a.indexOf(b, c) : (d = f.indexOf || Q, 
        d = d === Q ? Z : d, a = -1 < (a ? d(a, b, c) : d));
        return a;
    }
    function H(a) {
        return s(t(a) ? a.length : I) && q.call(a) == ia || false;
    }
    function S(a) {
        return t(a) && typeof a.message == "string" && q.call(a) == T || false;
    }
    function x(a) {
        return typeof a == "function" || false;
    }
    function w(a) {
        var b = typeof a;
        return "function" == b || a && "object" == b || false;
    }
    function A(a) {
        return null == a ? false : q.call(a) == U ? ja.test(Ca.call(a)) : t(a) && (Da(a) ? ja : Ea).test(a) || false;
    }
    function ka(a) {
        return w(a) && q.call(a) == la || false;
    }
    function G(a) {
        return typeof a == "string" || t(a) && q.call(a) == V || false;
    }
    function ea(a) {
        if (null == a) return [];
        w(a) || (a = Object(a));
        for (var b = a.length, c = f.support, b = b && s(b) && (F(a) || c.nonEnumStrings && G(a) || c.nonEnumArgs && H(a)) && b || 0, d = a.constructor, e = -1, d = x(d) && d.prototype || y, k = d === a, p = Array(b), m = 0 < b, n = c.enumErrorProps && (a === J || a instanceof Error), h = c.enumPrototypes && x(a); ++e < b; ) p[e] = e + "";
        for (var l in a) h && "prototype" == l || n && ("message" == l || "name" == l) || m && O(l, b) || "constructor" == l && (k || !u.call(a, l)) || p.push(l);
        if (c.nonEnumShadows && a !== y) for (b = a === Fa ? V : a === J ? T : q.call(a), 
        c = g[b] || g[W], b == W && (d = y), b = X.length; b--; ) l = X[b], e = c[l], k && e || (e ? !u.call(a, l) : a[l] === d[l]) || p.push(l);
        return p;
    }
    function ha(a) {
        return ba(a, E(a));
    }
    function ma(a) {
        return (a = v(a)) && Ga.test(a) ? a.replace(na, "\\$&") : a;
    }
    function oa(a) {
        try {
            return a.apply(I, xa(arguments));
        } catch (b) {
            return S(b) ? b : Error(b);
        }
    }
    function ga(a) {
        return a;
    }
    var I, ia = "[object Arguments]", T = "[object Error]", U = "[object Function]", W = "[object Object]", la = "[object RegExp]", V = "[object String]", Ha = /\b__p\+='';/g, Ia = /\b(__p\+=)''\+/g, Ja = /(__e\(.*?\)|\b__t\))\+'';/g, pa = /[&<>"'`]/g, Ka = RegExp(pa.source), qa = /<%=([\s\S]+?)%>/g, La = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, Ma = /\w*$/, Ea = /^\[object .+?Constructor\]$/, K = /($^)/, na = /[.*+?^${}()|[\]\/\\]/g, Ga = RegExp(na.source), Na = /\bthis\b/, Oa = /['\n\r\u2028\u2029\\]/g, X = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" "), ua = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "`": "&#96;"
    }, r = {
        function: true,
        object: true
    }, wa = {
        "\\": "\\",
        "'": "'",
        "\n": "n",
        "\r": "r",
        "\u2028": "u2028",
        "\u2029": "u2029"
    }, B = r[typeof window] && window !== (this && this.window) ? window : this, C = r[typeof exports] && exports && !exports.nodeType && exports, r = r[typeof module] && module && !module.nodeType && module, n = C && r && typeof global == "object" && global;
    !n || n.global !== n && n.window !== n && n.self !== n || (B = n);
    var n = r && r.exports === C && C, Da = function() {
        try {
            Object({
                toString: 0
            } + "");
        } catch (a) {
            return function() {
                return false;
            };
        }
        return function(a) {
            return typeof a.toString != "function" && typeof (a + "") == "string";
        };
    }(), L = Array.prototype, J = Error.prototype, y = Object.prototype, Fa = String.prototype, Ca = Function.prototype.toString, u = y.hasOwnProperty, q = y.toString, ja = RegExp("^" + ma(q).replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"), za = Math.floor, z = y.propertyIsEnumerable, Pa = L.splice, M = A(M = B.Uint8Array) && M, Y = A(Y = Array.isArray) && Y, N = A(N = Object.keys) && N, fa = Math.max, Aa = Math.min, L = Math.pow(2, 32) - 1, Ba = L - 1, ya = L >>> 1, ca = Math.pow(2, 53) - 1, g = {};
    g["[object Array]"] = g["[object Date]"] = g["[object Number]"] = {
        constructor: true,
        toLocaleString: true,
        toString: true,
        valueOf: true
    };
    g["[object Boolean]"] = g[V] = {
        constructor: true,
        toString: true,
        valueOf: true
    };
    g[T] = g[U] = g[la] = {
        constructor: true,
        toString: true
    };
    g[W] = {
        constructor: true
    };
    (function(a, b) {
        for (var c = -1, d = a.length; ++c < d && false !== b(a[c], c, a); ) ;
        return a;
    })(X, function(a) {
        for (var b in g) if (u.call(g, b)) {
            var c = g[b];
            c[a] = u.call(c, a);
        }
    });
    var k = f.support = {};
    (function(a) {
        function b() {
            this.x = 1;
        }
        var c = {
            0: 1,
            length: 1
        }, d = [];
        b.prototype = {
            valueOf: 1,
            y: 1
        };
        for (var e in new b()) d.push(e);
        k.argsTag = q.call(arguments) == ia;
        k.enumErrorProps = z.call(J, "message") || z.call(J, "name");
        k.enumPrototypes = z.call(b, "prototype");
        k.funcDecomp = !A(B.WinRTError) && Na.test(function() {
            return this;
        });
        k.funcNames = typeof Function.name == "string";
        k.nonEnumStrings = !z.call("x", 0);
        k.nonEnumShadows = !/valueOf/.test(d);
        k.spliceObjects = (Pa.call(c, 0, 1), !c[0]);
        k.unindexedChars = "xx" != "x"[0] + Object("x")[0];
        try {
            k.nonEnumArgs = !z.call(arguments, 1);
        } catch (f) {
            k.nonEnumArgs = true;
        }
    })(0, 0);
    f.templateSettings = {
        escape: /<%-([\s\S]+?)%>/g,
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: qa,
        variable: "",
        imports: {
            _: f
        }
    };
    k.argsTag || (H = function(a) {
        return s(t(a) ? a.length : I) && u.call(a, "callee") && !z.call(a, "callee") || false;
    });
    var F = Y || function(a) {
        return t(a) && s(a.length) && "[object Array]" == q.call(a) || false;
    };
    if (x(/x/) || M && !x(M)) x = function(a) {
        return q.call(a) == U;
    };
    var E = N ? function(a) {
        if (a) var b = a.constructor, c = a.length;
        return typeof b == "function" && b.prototype === a || (typeof a == "function" ? f.support.enumPrototypes : c && s(c)) ? da(a) : w(a) ? N(a) : [];
    } : da;
    f.keys = E;
    f.keysIn = ea;
    f.values = ha;
    f.attempt = oa;
    f.escape = function(a) {
        return (a = v(a)) && Ka.test(a) ? a.replace(pa, ta) : a;
    };
    f.escapeRegExp = ma;
    f.identity = ga;
    f.includes = R;
    f.indexOf = Q;
    f.isArguments = H;
    f.isArray = F;
    f.isError = S;
    f.isFunction = x;
    f.isNative = A;
    f.isNumber = function(a) {
        return typeof a == "number" || t(a) && "[object Number]" == q.call(a) || false;
    };
    f.isObject = w;
    f.isRegExp = ka;
    f.isString = G;
    f.template = function(a, b, c) {
        var d = f.templateSettings;
        c && P(a, b, c) && (b = c = null);
        a = v(a);
        b = D(D({}, c || b), d, aa);
        c = D(D({}, b.imports), d.imports, aa);
        var e = E(c), g = ba(c, e), k, m, n = 0;
        c = b.interpolate || K;
        var h = "__p+='", l = "sourceURL" in b ? "//# sourceURL=" + b.sourceURL + "\n" : "";
        a.replace(RegExp((b.escape || K).source + "|" + c.source + "|" + (c === qa ? La : K).source + "|" + (b.evaluate || K).source + "|$", "g"), function(b, c, d, e, f, g) {
            d || (d = e);
            h += a.slice(n, g).replace(Oa, va);
            c && (k = true, h += "'+__e(" + c + ")+'");
            f && (m = true, h += "';" + f + ";\n__p+='");
            d && (h += "'+((__t=(" + d + "))==null?'':__t)+'");
            n = g + b.length;
            return b;
        });
        h += "';";
        (b = b.variable) || (h = "with(obj){" + h + "}");
        h = (m ? h.replace(Ha, "") : h).replace(Ia, "$1").replace(Ja, "$1;");
        h = "function(" + (b || "obj") + "){" + (b ? "" : "obj||(obj={});") + "var __t,__p=''" + (k ? ",__e=_.escape" : "") + (m ? ",__j=Array.prototype.join;function print(){__p+=__j.call(arguments,'')}" : ";") + h + "return __p}";
        b = oa(function() {
            return Function(e, l + "return " + h).apply(I, g);
        });
        b.source = h;
        if (S(b)) throw b;
        return b;
    };
    f.trim = function(a, b, c) {
        var d = a;
        a = v(a);
        if (!a) return a;
        if (c ? P(d, b, c) : null == b) {
            for (b = a.length; b-- && $(a.charCodeAt(b)); ) ;
            c = -1;
            for (d = a.length; ++c < d && $(a.charCodeAt(c)); ) ;
            return a.slice(c, b + 1);
        }
        b += "";
        return a.slice(ra(a, b), sa(a, b) + 1);
    };
    f.trunc = function(a, b, c) {
        c && P(a, b, c) && (b = null);
        var d = 30;
        c = "...";
        if (null != b) if (w(b)) {
            var e = "separator" in b ? b.separator : e, d = "length" in b ? +b.length || 0 : d;
            c = "omission" in b ? v(b.omission) : c;
        } else d = +b || 0;
        a = v(a);
        if (d >= a.length) return a;
        d -= c.length;
        if (1 > d) return c;
        b = a.slice(0, d);
        if (null == e) return b + c;
        if (ka(e)) {
            if (a.slice(d).search(e)) {
                var f, g = a.slice(0, d);
                e.global || (e = RegExp(e.source, (Ma.exec(e) || "") + "g"));
                for (e.lastIndex = 0; a = e.exec(g); ) f = a.index;
                b = b.slice(0, null == f ? d : f);
            }
        } else a.indexOf(e, d) != d && (e = b.lastIndexOf(e), -1 < e && (b = b.slice(0, e)));
        return b + c;
    };
    f.contains = R;
    f.include = R;
    f.VERSION = "3.2.0";
    typeof define == "function" && typeof define.amd == "object" && define.amd ? (B._ = f, 
    define(function() {
        return f;
    })) : C && r ? n ? (r.exports = f)._ = f : C._ = f : B._ = f;
}).call(this);

"use strict";

var regPubMatch = /productNo(?:\.exact|\.raw)?(?=\:|$)/, regCheckInput = /[A-Za-z0-9\s\-\_\.\,\&]/g, regFixInput = /[^A-Za-z0-9\s\-\_\.\,\&]/g, regEmerge = / ?emerge/g, regHidden = / ?hidden/g, regLoad = / ?loading/g, regSelected = / ?selected/g, regOpened = / ?opened/g, regFail = / ?failed/g, regValidate = / ?invalidated/g;

function addEvent(element, evt, fnc) {
    return element.addEventListener(evt, fnc, false);
}

function removeEvent(element, evt, fnc) {
    return element.removeEventListener(evt, fnc, false);
}

function swapClass(element, string, regex) {
    if (string !== "" && typeof string === "string") {
        element.className = regex.test(element.className) ? element.className.replace(regex, "") + " " + string : element.className + " " + string;
    } else {
        element.className = element.className.replace(regex, "");
    }
}

function txt(string) {
    if (string && typeof string === "string" && string.length > 0) {
        return document.createTextNode(string);
    }
}

String.prototype.toTitle = function() {
    return this.replace(/(?:\W?)\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

String.prototype.toPubName = function() {
    var removed, count = 0, extraction = [], regQueryPubName = /(?:\b[\-_a-zA-Z]{1,3})?[ \t\-]*(?:(?:[\.\-]|[0-9]+)+)+(?:_?(?:sup|SUP)[A-Za-z]*)?/g, regEOLDashCheck = /[\-\cI\v\0\f]$/m;
    removed = this.replace(regQueryPubName, function(txt) {
        if (extraction && extraction.length > 0 && regEOLDashCheck.test(extraction[count - 1])) {
            extraction[count - 1] += txt.toUpperCase().replace(/\s/g, "");
        } else {
            extraction.push(txt.toUpperCase().replace(/\s/g, ""));
        }
        count += 1;
        return "";
    });
    return {
        extract: extraction,
        remove: removed
    };
};

window.downloader = function(el) {
    var link = document.createElement("a"), file = el.href || el.getAttribute("href") || "";
    if (file === "") {
        return false;
    }
    link.download = el.download || el.getAttribute("download");
    link.href = file;
    link.target = "_blank";
    try {
        link.click();
    } catch (e) {
        try {
            window.open(file);
        } catch (ee) {
            window.location.href = file;
        }
    }
    return false;
};

var App = function() {
    "use strict";
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
    }, wrap_ = document.getElementById("wrap"), searchWrap_ = document.getElementById("search-wrap"), searchRestore_ = document.getElementById("search-restore"), page_ = document.getElementById("page"), pageHeader_ = document.getElementById("page-header"), results_ = document.getElementById("results"), noResults_ = document.getElementById("no-results"), summary_ = document.getElementById("summary"), count_ = document.getElementById("count"), term_ = document.getElementById("term"), total_ = document.getElementById("total"), message_ = document.getElementById("message"), query_ = document.getElementById("query"), send_ = document.getElementById("send"), moreContent_ = document.getElementById("more-content"), related_ = document.getElementById("related"), infiniLabel_ = document.getElementById("infini-label"), infiniScroll_ = document.getElementById("infini-scroll"), loader_ = document.getElementById("loader"), placeContent = document.cookie.placeContent || "", placeMeta = document.cookie.placeMeta || "", bodyRect, relatedRect, resultsRect, relatedOffsetTop, stickyBarPosition;
    CSSStyleSheet.prototype.addCSSRule = function(selector, rules, index) {
        if ("insertRule" in this) {
            this.insertRule(selector + "{" + rules + "}", index);
        } else if ("addRule" in this) {
            this.addRule(selector, rules, index);
        }
    };
    function filterOutliers(someArray) {
        var values = someArray.concat();
        values.sort(function(a, b) {
            return a - b;
        });
        var q1 = values[Math.floor(values.length / 4)];
        var q3 = values[Math.ceil(values.length * (3 / 4))];
        var iqr = q3 - q1;
        var maxValue = q3 + iqr * 1.5;
        return values.filter(function(x) {
            return x > maxValue;
        });
    }
    return {
        wrap_: wrap_,
        searchWrap_: searchWrap_,
        searchRestore_: searchRestore_,
        page_: page_,
        pageHeader_: pageHeader_,
        results_: results_,
        noResults_: noResults_,
        summary_: summary_,
        count_: count_,
        term_: term_,
        total_: total_,
        message_: message_,
        query_: query_,
        send_: send_,
        moreContent_: moreContent_,
        related_: related_,
        placeContent: placeContent,
        placeMeta: placeMeta,
        infiniLabel_: infiniLabel_,
        infiniScroll_: infiniScroll_,
        loader_: loader_,
        infiniScroll: true,
        loading: {
            now: false,
            stillMore: false,
            currentHeight: 0
        },
        bodyRect: bodyRect,
        relatedRect: relatedRect,
        resultsRect: resultsRect,
        relatedOffsetTop: relatedOffsetTop,
        stickyBarPosition: stickyBarPosition,
        traveling: false,
        pos: 0,
        term: "",
        scoresContent: [],
        scoresRelatives: [],
        selectedResults: [],
        selectedTotal: 0,
        colors: {},
        isSearchOpen: null,
        isFailure: null,
        isDone: null,
        dataRender: function(data, allScores) {
            var output = {}, regType = /chapter|section/, index, group, number, fullPub, rawText, text, date, highlights, fileFormat;
            if (!data._source && data.key && data.score) {
                index = _.indexOf(allScores, data.score);
                group = index > -1 ? " match-" + index : "";
                app.colors[data.key] = index;
                output = {
                    url: ("https:" == document.location.protocol ? "https://that.pub/get/" : "http://get.that.pub/") + data.key.toLowerCase() + ".pdf",
                    key: data.key,
                    score: data.score,
                    gravitas: _.contains(filterOutliers(allScores), data.score) || data.score >= 1 ? " pretty" + group : " boring" + group
                };
            } else if (data._source.text) {
                number = data._source.number;
                text = data.highlight["text.english2"];
                rawText = data._source.text;
                fullPub = data._source.productNo;
                highlights = Object.keys(data.highlight);
                fileFormat = data._type !== "form" ? ".pdf" : ".xfdl";
                if (regPubMatch.test(highlights.join(":"))) {
                    fullPub = data.highlight["productNo.exact"] || data.highlight["productNo.raw"] || data.highlight.productNo;
                    fullPub = fullPub.shift();
                }
                date = data._source.releaseDate ? data._source.releaseDate.substring(6, 8) + " " + months[data._source.releaseDate.substring(4, 6)] + " " + data._source.releaseDate.substring(0, 4) : data._source.publishedDate.substring(0, 2) + " " + months[data._source.publishedDate.substring(2, 4)] + " " + data._source.publishedDate.substring(4, 8);
                if (regType.test(data._type) && data._type.length == 7) {
                    number = data._type.toTitle() + " " + data._source.number;
                }
                index = app.colors[data._source.productNo || data._source.pubName];
                group = _.isNumber(index) && (index >= 0 || index < 5) ? " match-" + index : "";
                output = {
                    score: data._score,
                    gravitas: _.contains(filterOutliers(allScores), data._score) || data._score >= 1 ? " pretty" + group : " boring" + group,
                    date: date,
                    url: ("https:" == document.location.protocol ? "https://that.pub/get/" : "http://get.that.pub/") + data._source.productNo.toLowerCase() + fileFormat,
                    fullPub: fullPub,
                    title: data.highlight.title || data._source.title || null,
                    rawTitle: data._source.title,
                    sub: rawText ? number : "",
                    details: {
                        chapter: data._source.chapter && data._source.chapter.number || null,
                        chapterTitle: data.highlight["chapter.title"] || data._source.chapter && data._source.chapter.title || null,
                        section: data._source.section && data._source.section.number || null,
                        sectionTitle: data.highlight["section.title"] || data._source.section && data._source.section.title || null
                    },
                    rawText: rawText,
                    concatText: data.highlight["text"] && data.highlight["text"][0] || null,
                    parts: Array.isArray(text) ? text : null,
                    fileFormat: fileFormat,
                    type: rawText ? " content" : " doc"
                };
            }
            return output || null;
        },
        querySetup: function(term) {
            return function(name) {
                return {
                    term: term,
                    pubName: name.extract,
                    noPubName: name.remove
                };
            }(term.toPubName());
        },
        addItem: function(results, templateCode, allScores) {
            var tmp = "", that = this, rl = results.length, a = 0;
            for (;a < rl; ++a) {
                tmp += _.template(templateCode)(that.dataRender(results[a], allScores));
            }
            return tmp;
        },
        searchToggle: function(action) {
            if (action === "close" && (this.loading.init === true || this.isDone === true && this.isFailure !== true)) {
                this.isSearchOpen = false;
                this.infiniScroll = this.infiniScroll_ ? this.infiniScroll_.checked || !!this.infiniScroll_.checked : true;
                swapClass(this.searchWrap_, "", regEmerge);
            } else if (action === "open") {
                swapClass(this.searchWrap_, "emerge", regEmerge);
                if (this.isDone === true && this.isFailure === true) {
                    this.isFailure = false;
                    this.isDone = false;
                    swapClass(app.noResults_, "", regFail);
                }
                this.isSearchOpen = true;
                this.infiniScroll = false;
            }
        }
    };
};

"use strict";

function revealText(event) {
    var open = regOpened.test(this.parentNode.className);
    this.innerHTML = "";
    if (!open) {
        swapClass(this.parentNode, "opened", regOpened);
        this.innerHTML = "collapse";
    } else {
        swapClass(this.parentNode, "", regOpened);
        this.innerHTML = "expand";
    }
    event.preventDefault();
    return false;
}

"use strict";

var app = new App();

app.resultTemplate = document.getElementById("result-template");

app.relatedTemplate = document.getElementById("related-template");

function dataResponse(httpRequest, action, callback) {
    var response = JSON.parse(httpRequest.responseText), content = response[0] || null, meta = response[1] || null;
    app.isDone = true;
    if (content && content.hits.total === 0 && (meta && meta.hits.total === 0)) {
        app.isFailure = true;
        app.infiniScroll = false;
        document.cookie = "placeContent=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        document.cookie = "placeMeta=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        app.message_.innerHTML = null;
        app.message_.appendChild(txt("Your search returned no results.\nGive 'er another go."));
        swapClass(app.search_, "failed", regFail);
        return callback();
    }
    var a = 0, b = 0, reveals, rl;
    var expires = new Date(Date.now() + 36e5);
    expires = expires.toUTCString();
    if (content) {
        var currentContent = content.hits.hits.length;
        app.term_.innerHTML = app.term;
        app.total_.innerHTML = content.hits.total;
        app.placeContent = content._scroll_id;
        document.cookie = "placeContent=" + app.placeContent + "; expires=" + expires;
        if (action !== "more") {
            var currentRelatives = content.aggregations.related_doc.buckets.length;
            window.scroll(0, 0);
            for (;b < currentContent; ++b) {
                app.scoresContent[b] = content.hits.hits[b]._score;
            }
            for (b = 0; b < currentRelatives; ++b) {
                app.scoresContent[b] = content.aggregations.related_doc.buckets[b].score;
            }
            app.related_.innerHTML = app.addItem(content.aggregations.related_doc.buckets, app.relatedTemplate.textContent || app.relatedTemplate.innerText, app.scoresRelatives);
            app.results_.innerHTML = app.addItem(content.hits.hits, app.resultTemplate.textContent || app.resultTemplate.innerText, app.scoresContent);
            app.count_.innerHTML = currentContent;
            app.relatedRect = app.related_.getBoundingClientRect();
            app.bodyRect = document.body.getBoundingClientRect();
            app.stickyBarPosition = Math.abs(app.relatedRect.top) + Math.abs(app.bodyRect.top) + Math.abs(app.relatedRect.height);
        } else {
            var contentGathered = app.scoresContent.length;
            for (b = 0; b < currentContent; ++b) {
                app.scoresContent[b + contentGathered] = content.hits.hits[b]._score;
            }
            app.results_.innerHTML += app.addItem(content.hits.hits, app.resultTemplate.textContent || app.resultTemplate.innerText, app.scoresContent);
            app.count_.innerHTML = app.scoresContent.length;
        }
        reveals = document.querySelectorAll(".reveal-text");
        rl = reveals.length;
        for (;a < rl; ++a) {
            addEvent(reveals[a], "click", revealText);
        }
        if (content.hits.hits.length < 20) {
            swapClass(app.moreContent_, "hidden", regHidden);
            app.loading.stillMore = false;
        } else {
            swapClass(app.moreContent_, "", regHidden);
            app.loading.stillMore = true;
        }
    }
    if (meta) {
        app.placeMeta = meta._scroll_id;
        document.cookie = "placeMeta=" + app.placeMeta + "; expires=" + expires;
    }
    app.resultsRect = app.results_.getBoundingClientRect();
    app.loading.currentHeight = Math.abs(app.resultsRect.height);
    callback();
}

function sendData(responder, query, type, action, spot, dot, callback) {
    var httpRequest = new XMLHttpRequest();
    var url = ("https:" === document.location.protocol ? "https://that.pub/find/" : "http://find.that.pub/") + type + "/" + action;
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                responder(httpRequest, action, callback);
            }
        }
    };
    httpRequest.open("POST", url, true);
    httpRequest.setRequestHeader("Content-type", "application/json");
    httpRequest.send(JSON.stringify({
        t: app.querySetup(query),
        g: spot,
        s: dot
    }));
}

function more(event) {
    if (event && event.preventDefault) {
        event.preventDefault();
    }
    if (app.loading.now !== true) {
        swapClass(app.loader_, "loading", regLoad);
    }
    sendData(dataResponse, document.cookie.placeContent || app.placeContent ? "" : app.term, "content", "more", document.cookie.placeContent || app.placeContent, null, endLoading);
    return false;
}

function modalClose(event) {
    if (event.target === event.currentTarget) {
        app.searchToggle("close");
    }
}

function scrollWheeler() {
    var t = document.documentElement || document.body.parentNode, pos = (t && typeof t.ScrollTop === "number" ? t : document.body).ScrollTop || window.pageYOffset, delta = pos - app.pos;
    if (app.infiniScroll === true && app.loading.now === false && app.loading.stillMore === true && delta > 0 && pos > app.loading.currentHeight - 1200) {
        app.loading.now = true;
        more();
    }
    app.pos = pos;
}

function infini() {
    var status, doThis;
    app.infiniScroll = this.checked || !!this.checked;
    status = app.infiniScroll ? "enabled" : "disabled";
    doThis = app.infiniScroll ? "Disable" : "Enable";
    app.infiniLabel_.className = status;
    app.infiniLabel_.setAttribute("title", doThis + " infinite scroll");
    if (!status) {
        this.removeAttribute("checked");
    }
}

function endLoading(el) {
    swapClass(app.loader_, "", regLoad);
    app.loading.now = false;
    app.loading.init = false;
    return false;
}

"use strict";

addEvent(app.send_, "click", function(event) {
    event.preventDefault();
    var val = _.trim(app.query_.value);
    if (!val) {
        app.queryInvalidated = true;
        swapClass(app.query_, "invalidated", regValidate);
        app.message_.appendChild(document.createTextNode("You gotta type something first."));
        app.query_.focus();
        return false;
    }
    swapClass(app.loader_, "loading", regLoad);
    if (app.isSearchOpen === true) {
        app.loading.init = true;
        app.searchToggle("close");
    }
    app.term = _.trim(app.query_.value);
    sendData(dataResponse, app.term, "content", "search", app.placeContent, app.placeMeta, endLoading);
    return false;
});

addEvent(app.query_, "focus", function() {
    if (app.queryInvalidated !== true) {
        return false;
    }
});

addEvent(app.query_, "keydown", function(event) {
    console.log("code, charCode, keyCode, which, ctrlKey, shiftKey, altKey, metaKey");
    console.log(event.code, event.charCode, event.keyCode, event.which, event.ctrlKey, event.shiftKey, event.altKey, event.metaKey);
    console.log("value is currently: ", this.value);
});

addEvent(app.query_, "keypress", function(event) {
    if (app.queryInvalidated === true) {
        app.queryInvalidated = false;
        swapClass(app.query_, "", regValidate);
        app.message_.innerHTML = "";
    }
    if (event.which === 13) {
        app.send_.click();
        return false;
    }
});

addEvent(document, "keyup", function(event) {
    if (event.which === 27) {
        event.preventDefault();
        if (app.isSearchOpen === true && app.isFailure !== true) {
            app.searchToggle("close");
        }
    }
});

addEvent(app.moreContent_, "click", more);

addEvent(app.noResults_.getElementsByTagName("a")[0], "click", function(event) {
    event.preventDefault();
    if (app.isSearchOpen !== true) {
        console.log("Search box is closed apparently");
        console.log(app.isDone, app.isFailure, app.loading);
        app.searchToggle("open");
    }
    app.query_.value = "";
    app.query_.focus();
});

addEvent(app.searchRestore_, "click", function(event) {
    event.preventDefault();
    if (app.isSearchOpen === true) {
        if (app.isDone === true && app.isFailure !== true) {
            app.searchToggle("close");
        } else {
            return false;
        }
    } else {
        app.searchToggle("open");
        app.query_.value = app.term || "";
        app.query_.focus();
    }
    return false;
});

addEvent(app.infiniScroll_, "change", infini);

addEvent(window, "scroll", scrollWheeler);

addEvent(window, "load", function() {
    app.isSearchOpen = true;
    app.isDone = false;
    app.query_.focus();
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = document.location.protocol + "//fonts.googleapis.com/css?family=Lato:300,700,300italic:latin";
    var h = document.getElementsByTagName("head")[0];
    h.parentNode.insertBefore(l, h);
});
//# sourceMappingURL=script.js.map