(function() {
    "use strict";
    function FastClick(layer, options) {
        var oldOnClick;
        options = options || {};
        this.trackingClick = false;
        this.trackingClickStart = 0;
        this.targetElement = null;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.lastTouchIdentifier = 0;
        this.touchBoundary = options.touchBoundary || 10;
        this.layer = layer;
        this.tapDelay = options.tapDelay || 200;
        this.tapTimeout = options.tapTimeout || 700;
        if (FastClick.notNeeded(layer)) {
            return;
        }
        function bind(method, context) {
            return function() {
                return method.apply(context, arguments);
            };
        }
        var methods = [ "onMouse", "onClick", "onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel" ];
        var context = this;
        for (var i = 0, l = methods.length; i < l; i++) {
            context[methods[i]] = bind(context[methods[i]], context);
        }
        if (deviceIsAndroid) {
            layer.addEventListener("mouseover", this.onMouse, true);
            layer.addEventListener("mousedown", this.onMouse, true);
            layer.addEventListener("mouseup", this.onMouse, true);
        }
        layer.addEventListener("click", this.onClick, true);
        layer.addEventListener("touchstart", this.onTouchStart, false);
        layer.addEventListener("touchmove", this.onTouchMove, false);
        layer.addEventListener("touchend", this.onTouchEnd, false);
        layer.addEventListener("touchcancel", this.onTouchCancel, false);
        if (!Event.prototype.stopImmediatePropagation) {
            layer.removeEventListener = function(type, callback, capture) {
                var rmv = Node.prototype.removeEventListener;
                if (type === "click") {
                    rmv.call(layer, type, callback.hijacked || callback, capture);
                } else {
                    rmv.call(layer, type, callback, capture);
                }
            };
            layer.addEventListener = function(type, callback, capture) {
                var adv = Node.prototype.addEventListener;
                if (type === "click") {
                    adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
                        if (!event.propagationStopped) {
                            callback(event);
                        }
                    }), capture);
                } else {
                    adv.call(layer, type, callback, capture);
                }
            };
        }
        if (typeof layer.onclick === "function") {
            oldOnClick = layer.onclick;
            layer.addEventListener("click", function(event) {
                oldOnClick(event);
            }, false);
            layer.onclick = null;
        }
    }
    var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;
    var deviceIsAndroid = navigator.userAgent.indexOf("Android") > 0 && !deviceIsWindowsPhone;
    var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;
    var deviceIsIOS4 = deviceIsIOS && /OS 4_\d(_\d)?/.test(navigator.userAgent);
    var deviceIsIOSWithBadTarget = deviceIsIOS && /OS [6-7]_\d/.test(navigator.userAgent);
    var deviceIsBlackBerry10 = navigator.userAgent.indexOf("BB10") > 0;
    FastClick.prototype.needsClick = function(target) {
        switch (target.nodeName.toLowerCase()) {
          case "button":
          case "select":
          case "textarea":
            if (target.disabled) {
                return true;
            }
            break;

          case "input":
            if (deviceIsIOS && target.type === "file" || target.disabled) {
                return true;
            }
            break;

          case "label":
          case "iframe":
          case "video":
            return true;
        }
        return /\bneedsclick\b/.test(target.className);
    };
    FastClick.prototype.needsFocus = function(target) {
        switch (target.nodeName.toLowerCase()) {
          case "textarea":
            return true;

          case "select":
            return !deviceIsAndroid;

          case "input":
            switch (target.type) {
              case "button":
              case "checkbox":
              case "file":
              case "image":
              case "radio":
              case "submit":
                return false;
            }
            return !target.disabled && !target.readOnly;

          default:
            return /\bneedsfocus\b/.test(target.className);
        }
    };
    FastClick.prototype.sendClick = function(targetElement, event) {
        var clickEvent, touch;
        if (document.activeElement && document.activeElement !== targetElement) {
            document.activeElement.blur();
        }
        touch = event.changedTouches[0];
        clickEvent = document.createEvent("MouseEvents");
        clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
        clickEvent.forwardedTouchEvent = true;
        targetElement.dispatchEvent(clickEvent);
    };
    FastClick.prototype.determineEventType = function(targetElement) {
        if (deviceIsAndroid && targetElement.tagName.toLowerCase() === "select") {
            return "mousedown";
        }
        return "click";
    };
    FastClick.prototype.focus = function(targetElement) {
        var length;
        if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf("date") !== 0 && targetElement.type !== "time" && targetElement.type !== "month") {
            length = targetElement.value.length;
            targetElement.setSelectionRange(length, length);
        } else {
            targetElement.focus();
        }
    };
    FastClick.prototype.updateScrollParent = function(targetElement) {
        var scrollParent, parentElement;
        scrollParent = targetElement.fastClickScrollParent;
        if (!scrollParent || !scrollParent.contains(targetElement)) {
            parentElement = targetElement;
            do {
                if (parentElement.scrollHeight > parentElement.offsetHeight) {
                    scrollParent = parentElement;
                    targetElement.fastClickScrollParent = parentElement;
                    break;
                }
                parentElement = parentElement.parentElement;
            } while (parentElement);
        }
        if (scrollParent) {
            scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
        }
    };
    FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {
        if (eventTarget.nodeType === Node.TEXT_NODE) {
            return eventTarget.parentNode;
        }
        return eventTarget;
    };
    FastClick.prototype.onTouchStart = function(event) {
        var targetElement, touch, selection;
        if (event.targetTouches.length > 1) {
            return true;
        }
        targetElement = this.getTargetElementFromEventTarget(event.target);
        touch = event.targetTouches[0];
        if (deviceIsIOS) {
            selection = window.getSelection();
            if (selection.rangeCount && !selection.isCollapsed) {
                return true;
            }
            if (!deviceIsIOS4) {
                if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
                    event.preventDefault();
                    return false;
                }
                this.lastTouchIdentifier = touch.identifier;
                this.updateScrollParent(targetElement);
            }
        }
        this.trackingClick = true;
        this.trackingClickStart = event.timeStamp;
        this.targetElement = targetElement;
        this.touchStartX = touch.pageX;
        this.touchStartY = touch.pageY;
        if (event.timeStamp - this.lastClickTime < this.tapDelay) {
            event.preventDefault();
        }
        return true;
    };
    FastClick.prototype.touchHasMoved = function(event) {
        var touch = event.changedTouches[0], boundary = this.touchBoundary;
        if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
            return true;
        }
        return false;
    };
    FastClick.prototype.onTouchMove = function(event) {
        if (!this.trackingClick) {
            return true;
        }
        if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
            this.trackingClick = false;
            this.targetElement = null;
        }
        return true;
    };
    FastClick.prototype.findControl = function(labelElement) {
        if (labelElement.control !== undefined) {
            return labelElement.control;
        }
        if (labelElement.htmlFor) {
            return document.getElementById(labelElement.htmlFor);
        }
        return labelElement.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea");
    };
    FastClick.prototype.onTouchEnd = function(event) {
        var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;
        if (!this.trackingClick) {
            return true;
        }
        if (event.timeStamp - this.lastClickTime < this.tapDelay) {
            this.cancelNextClick = true;
            return true;
        }
        if (event.timeStamp - this.trackingClickStart > this.tapTimeout) {
            return true;
        }
        this.cancelNextClick = false;
        this.lastClickTime = event.timeStamp;
        trackingClickStart = this.trackingClickStart;
        this.trackingClick = false;
        this.trackingClickStart = 0;
        if (deviceIsIOSWithBadTarget) {
            touch = event.changedTouches[0];
            targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
            targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
        }
        targetTagName = targetElement.tagName.toLowerCase();
        if (targetTagName === "label") {
            forElement = this.findControl(targetElement);
            if (forElement) {
                this.focus(targetElement);
                if (deviceIsAndroid) {
                    return false;
                }
                targetElement = forElement;
            }
        } else if (this.needsFocus(targetElement)) {
            if (event.timeStamp - trackingClickStart > 100 || deviceIsIOS && window.top !== window && targetTagName === "input") {
                this.targetElement = null;
                return false;
            }
            this.focus(targetElement);
            this.sendClick(targetElement, event);
            if (!deviceIsIOS || targetTagName !== "select") {
                this.targetElement = null;
                event.preventDefault();
            }
            return false;
        }
        if (deviceIsIOS && !deviceIsIOS4) {
            scrollParent = targetElement.fastClickScrollParent;
            if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
                return true;
            }
        }
        if (!this.needsClick(targetElement)) {
            event.preventDefault();
            this.sendClick(targetElement, event);
        }
        return false;
    };
    FastClick.prototype.onTouchCancel = function() {
        this.trackingClick = false;
        this.targetElement = null;
    };
    FastClick.prototype.onMouse = function(event) {
        if (!this.targetElement) {
            return true;
        }
        if (event.forwardedTouchEvent) {
            return true;
        }
        if (!event.cancelable) {
            return true;
        }
        if (!this.needsClick(this.targetElement) || this.cancelNextClick) {
            if (event.stopImmediatePropagation) {
                event.stopImmediatePropagation();
            } else {
                event.propagationStopped = true;
            }
            event.stopPropagation();
            event.preventDefault();
            return false;
        }
        return true;
    };
    FastClick.prototype.onClick = function(event) {
        var permitted;
        if (this.trackingClick) {
            this.targetElement = null;
            this.trackingClick = false;
            return true;
        }
        if (event.target.type === "submit" && event.detail === 0) {
            return true;
        }
        permitted = this.onMouse(event);
        if (!permitted) {
            this.targetElement = null;
        }
        return permitted;
    };
    FastClick.prototype.destroy = function() {
        var layer = this.layer;
        if (deviceIsAndroid) {
            layer.removeEventListener("mouseover", this.onMouse, true);
            layer.removeEventListener("mousedown", this.onMouse, true);
            layer.removeEventListener("mouseup", this.onMouse, true);
        }
        layer.removeEventListener("click", this.onClick, true);
        layer.removeEventListener("touchstart", this.onTouchStart, false);
        layer.removeEventListener("touchmove", this.onTouchMove, false);
        layer.removeEventListener("touchend", this.onTouchEnd, false);
        layer.removeEventListener("touchcancel", this.onTouchCancel, false);
    };
    FastClick.notNeeded = function(layer) {
        var metaViewport;
        var chromeVersion;
        var blackberryVersion;
        var firefoxVersion;
        if (typeof window.ontouchstart === "undefined") {
            return true;
        }
        chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [ , 0 ])[1];
        if (chromeVersion) {
            if (deviceIsAndroid) {
                metaViewport = document.querySelector("meta[name=viewport]");
                if (metaViewport) {
                    if (metaViewport.content.indexOf("user-scalable=no") !== -1) {
                        return true;
                    }
                    if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
                        return true;
                    }
                }
            } else {
                return true;
            }
        }
        if (deviceIsBlackBerry10) {
            blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);
            if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
                metaViewport = document.querySelector("meta[name=viewport]");
                if (metaViewport) {
                    if (metaViewport.content.indexOf("user-scalable=no") !== -1) {
                        return true;
                    }
                    if (document.documentElement.scrollWidth <= window.outerWidth) {
                        return true;
                    }
                }
            }
        }
        if (layer.style.msTouchAction === "none" || layer.style.touchAction === "manipulation") {
            return true;
        }
        firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [ , 0 ])[1];
        if (firefoxVersion >= 27) {
            metaViewport = document.querySelector("meta[name=viewport]");
            if (metaViewport && (metaViewport.content.indexOf("user-scalable=no") !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
                return true;
            }
        }
        if (layer.style.touchAction === "none" || layer.style.touchAction === "manipulation") {
            return true;
        }
        return false;
    };
    FastClick.attach = function(layer, options) {
        return new FastClick(layer, options);
    };
    if (typeof define === "function" && typeof define.amd === "object" && define.amd) {
        define(function() {
            return FastClick;
        });
    } else if (typeof module !== "undefined" && module.exports) {
        module.exports = FastClick.attach;
        module.exports.FastClick = FastClick;
    } else {
        window.FastClick = FastClick;
    }
})();

(function() {
    function G(a) {
        return typeof a == "string" ? a : null == a ? "" : a + "";
    }
    function ca(a) {
        return da[a];
    }
    function ea(a) {
        return "\\" + fa[a];
    }
    function s(a) {
        return a && typeof a == "object" || false;
    }
    function e(a) {
        if (s(a) && !x(a)) {
            if (a instanceof LodashWrapper) return a;
            if (q.call(a, "__wrapped__")) return new LodashWrapper(a.__wrapped__, a.__chain__, arrayCopy(a.__actions__));
        }
        return new LodashWrapper(a);
    }
    function R(a, b, c, d) {
        return typeof a != "undefined" && q.call(d, c) ? a : b;
    }
    function y(a, b, c) {
        var d = H(b);
        if (!c) {
            d || (d = a, a = {});
            c = -1;
            for (var e = d.length; ++c < e; ) {
                var g = d[c];
                a[g] = b[g];
            }
            return a;
        }
        e = -1;
        for (g = d.length; ++e < g; ) {
            var k = d[e], m = a[k], f = c(m, b[k], k, a, b);
            (f === f ? f === m : m !== m) && (typeof m != "undefined" || k in a) || (a[k] = f);
        }
        return a;
    }
    function ga(a, b) {
        for (var c = -1, d = b.length, e = Array(d); ++c < d; ) e[c] = a[b[c]];
        return e;
    }
    function I(a, b) {
        a = +a;
        b = null == b ? S : b;
        return -1 < a && 0 == a % 1 && a < b;
    }
    function ha(a, b, c) {
        if (!z(c)) return false;
        var d = typeof b;
        "number" == d ? (d = c.length, d = t(d) && I(b, d)) : d = "string" == d && b in c;
        return d && c[b] === a;
    }
    function t(a) {
        return typeof a == "number" && -1 < a && 0 == a % 1 && a <= S;
    }
    function T(a) {
        for (var b = U(a), c = b.length, d = c && a.length, g = e.support, g = d && t(d) && (x(a) || g.nonEnumStrings && J(a) || g.nonEnumArgs && A(a)), f = -1, k = []; ++f < c; ) {
            var m = b[f];
            (g && I(m, d) || q.call(a, m)) && k.push(m);
        }
        return k;
    }
    function A(a) {
        return t(s(a) ? a.length : K) && r.call(a) == V || false;
    }
    function L(a) {
        return s(a) && typeof a.message == "string" && r.call(a) == M || false;
    }
    function z(a) {
        var b = typeof a;
        return "function" == b || a && "object" == b || false;
    }
    function B(a) {
        return null == a ? false : r.call(a) == W ? X.test(ia.call(a)) : s(a) && (ja(a) ? X : ka).test(a) || !1;
    }
    function J(a) {
        return typeof a == "string" || s(a) && r.call(a) == N || false;
    }
    function U(a) {
        if (null == a) return [];
        z(a) || (a = Object(a));
        for (var b = a.length, c = e.support, b = b && t(b) && (x(a) || c.nonEnumStrings && J(a) || c.nonEnumArgs && A(a)) && b || 0, d = a.constructor, f = -1, d = typeof d == "function" && d.prototype || u, l = d === a, k = Array(b), m = 0 < b, p = c.enumErrorProps && (a === C || a instanceof Error), h = c.enumPrototypes && typeof a == "function"; ++f < b; ) k[f] = f + "";
        for (var n in a) h && "prototype" == n || p && ("message" == n || "name" == n) || m && I(n, b) || "constructor" == n && (l || !q.call(a, n)) || k.push(n);
        if (c.nonEnumShadows && a !== u) for (b = a === la ? N : a === C ? M : r.call(a), 
        c = g[b] || g[O], b == O && (d = u), b = P.length; b--; ) n = P[b], f = c[n], l && f || (f ? !q.call(a, n) : a[n] === d[n]) || k.push(n);
        return k;
    }
    function Y(a) {
        return (a = G(a)) && ma.test(a) ? a.replace(Z, "\\$&") : a;
    }
    function $(a) {
        try {
            return a();
        } catch (b) {
            return L(b) ? b : Error(b);
        }
    }
    var K, V = "[object Arguments]", M = "[object Error]", W = "[object Function]", O = "[object Object]", N = "[object String]", na = /\b__p\+='';/g, oa = /\b(__p\+=)''\+/g, pa = /(__e\(.*?\)|\b__t\))\+'';/g, aa = /[&<>"'`]/g, qa = RegExp(aa.source), ba = /<%=([\s\S]+?)%>/g, ra = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, ka = /^\[object .+?Constructor\]$/, D = /($^)/, Z = /[.*+?^${}()|[\]\/\\]/g, ma = RegExp(Z.source), sa = /\bthis\b/, ta = /['\n\r\u2028\u2029\\]/g, P = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" "), da = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "`": "&#96;"
    }, p = {
        function: true,
        object: true
    }, fa = {
        "\\": "\\",
        "'": "'",
        "\n": "n",
        "\r": "r",
        "\u2028": "u2028",
        "\u2029": "u2029"
    }, E = p[typeof window] && window !== (this && this.window) ? window : this, w = p[typeof exports] && exports && !exports.nodeType && exports, p = p[typeof module] && module && !module.nodeType && module, l = w && p && typeof global == "object" && global;
    !l || l.global !== l && l.window !== l && l.self !== l || (E = l);
    var l = p && p.exports === w && w, ja = function() {
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
    }(), ua = Array.prototype, C = Error.prototype, u = Object.prototype, la = String.prototype, ia = Function.prototype.toString, q = u.hasOwnProperty, r = u.toString, X = RegExp("^" + Y(r).replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"), v = u.propertyIsEnumerable, va = ua.splice, Q = B(Q = Array.isArray) && Q, F = B(F = Object.keys) && F, S = Math.pow(2, 53) - 1, g = {};
    g["[object Array]"] = g["[object Date]"] = g["[object Number]"] = {
        constructor: true,
        toLocaleString: true,
        toString: true,
        valueOf: true
    };
    g["[object Boolean]"] = g[N] = {
        constructor: true,
        toString: true,
        valueOf: true
    };
    g[M] = g[W] = g["[object RegExp]"] = {
        constructor: true,
        toString: true
    };
    g[O] = {
        constructor: true
    };
    (function(a, b) {
        for (var c = -1, d = a.length; ++c < d && false !== b(a[c], c, a); ) ;
        return a;
    })(P, function(a) {
        for (var b in g) if (q.call(g, b)) {
            var c = g[b];
            c[a] = q.call(c, a);
        }
    });
    var f = e.support = {};
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
        f.argsTag = r.call(arguments) == V;
        f.enumErrorProps = v.call(C, "message") || v.call(C, "name");
        f.enumPrototypes = v.call(b, "prototype");
        f.funcDecomp = !B(E.WinRTError) && sa.test(function() {
            return this;
        });
        f.funcNames = typeof Function.name == "string";
        f.nonEnumStrings = !v.call("x", 0);
        f.nonEnumShadows = !/valueOf/.test(d);
        f.spliceObjects = (va.call(c, 0, 1), !c[0]);
        f.unindexedChars = "xx" != "x"[0] + Object("x")[0];
        try {
            f.nonEnumArgs = !v.call(arguments, 1);
        } catch (g) {
            f.nonEnumArgs = true;
        }
    })(0, 0);
    e.templateSettings = {
        escape: /<%-([\s\S]+?)%>/g,
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: ba,
        variable: "",
        imports: {
            _: e
        }
    };
    f.argsTag || (A = function(a) {
        return t(s(a) ? a.length : K) && q.call(a, "callee") && !v.call(a, "callee") || false;
    });
    var x = Q || function(a) {
        return s(a) && t(a.length) && "[object Array]" == r.call(a) || false;
    }, H = F ? function(a) {
        if (a) var b = a.constructor, c = a.length;
        return typeof b == "function" && b.prototype === a || (typeof a == "function" ? e.support.enumPrototypes : c && t(c)) ? T(a) : z(a) ? F(a) : [];
    } : T;
    e.keys = H;
    e.keysIn = U;
    e.attempt = $;
    e.escape = function(a) {
        return (a = G(a)) && qa.test(a) ? a.replace(aa, ca) : a;
    };
    e.escapeRegExp = Y;
    e.isArguments = A;
    e.isArray = x;
    e.isError = L;
    e.isNative = B;
    e.isObject = z;
    e.isString = J;
    e.template = function(a, b, c) {
        var d = e.templateSettings;
        c && ha(a, b, c) && (b = c = null);
        a = G(a);
        b = y(y({}, c || b), d, R);
        c = y(y({}, b.imports), d.imports, R);
        var f = H(c), g = ga(c, f), k, m, l = 0;
        c = b.interpolate || D;
        var h = "__p+='", n = "sourceURL" in b ? "//# sourceURL=" + b.sourceURL + "\n" : "";
        a.replace(RegExp((b.escape || D).source + "|" + c.source + "|" + (c === ba ? ra : D).source + "|" + (b.evaluate || D).source + "|$", "g"), function(b, c, d, e, f, g) {
            d || (d = e);
            h += a.slice(l, g).replace(ta, ea);
            c && (k = true, h += "'+__e(" + c + ")+'");
            f && (m = true, h += "';" + f + ";\n__p+='");
            d && (h += "'+((__t=(" + d + "))==null?'':__t)+'");
            l = g + b.length;
            return b;
        });
        h += "';";
        (b = b.variable) || (h = "with(obj){" + h + "}");
        h = (m ? h.replace(na, "") : h).replace(oa, "$1").replace(pa, "$1;");
        h = "function(" + (b || "obj") + "){" + (b ? "" : "obj||(obj={});") + "var __t,__p=''" + (k ? ",__e=_.escape" : "") + (m ? ",__j=Array.prototype.join;function print(){__p+=__j.call(arguments,'')}" : ";") + h + "return __p}";
        b = $(function() {
            return Function(f, n + "return " + h).apply(K, g);
        });
        b.source = h;
        if (L(b)) throw b;
        return b;
    };
    e.VERSION = "3.1.0";
    typeof define == "function" && typeof define.amd == "object" && define.amd ? (E._ = e, 
    define(function() {
        return e;
    })) : w && p ? l ? (p.exports = e)._ = e : w._ = e : E._ = e;
}).call(this);

(function(fastdom) {
    "use strict";
    var raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || function(cb) {
        return window.setTimeout(cb, 1e3 / 60);
    };
    function FastDom() {
        this.frames = [];
        this.lastId = 0;
        this.raf = raf;
        this.batch = {
            hash: {},
            read: [],
            write: [],
            mode: null
        };
    }
    FastDom.prototype.read = function(fn, ctx) {
        var job = this.add("read", fn, ctx);
        var id = job.id;
        this.batch.read.push(job.id);
        var doesntNeedFrame = this.batch.mode === "reading" || this.batch.scheduled;
        if (doesntNeedFrame) return id;
        this.scheduleBatch();
        return id;
    };
    FastDom.prototype.write = function(fn, ctx) {
        var job = this.add("write", fn, ctx);
        var mode = this.batch.mode;
        var id = job.id;
        this.batch.write.push(job.id);
        var doesntNeedFrame = mode === "writing" || mode === "reading" || this.batch.scheduled;
        if (doesntNeedFrame) return id;
        this.scheduleBatch();
        return id;
    };
    FastDom.prototype.defer = function(frame, fn, ctx) {
        if (typeof frame === "function") {
            ctx = fn;
            fn = frame;
            frame = 1;
        }
        var self = this;
        var index = frame - 1;
        return this.schedule(index, function() {
            self.run({
                fn: fn,
                ctx: ctx
            });
        });
    };
    FastDom.prototype.clear = function(id) {
        if (typeof id === "function") {
            return this.clearFrame(id);
        }
        id = Number(id);
        var job = this.batch.hash[id];
        if (!job) return;
        var list = this.batch[job.type];
        var index = list.indexOf(id);
        delete this.batch.hash[id];
        if (~index) list.splice(index, 1);
    };
    FastDom.prototype.clearFrame = function(frame) {
        var index = this.frames.indexOf(frame);
        if (~index) this.frames.splice(index, 1);
    };
    FastDom.prototype.scheduleBatch = function() {
        var self = this;
        this.schedule(0, function() {
            self.batch.scheduled = false;
            self.runBatch();
        });
        this.batch.scheduled = true;
    };
    FastDom.prototype.uniqueId = function() {
        return ++this.lastId;
    };
    FastDom.prototype.flush = function(list) {
        var id;
        while (id = list.shift()) {
            this.run(this.batch.hash[id]);
        }
    };
    FastDom.prototype.runBatch = function() {
        try {
            this.batch.mode = "reading";
            this.flush(this.batch.read);
            this.batch.mode = "writing";
            this.flush(this.batch.write);
            this.batch.mode = null;
        } catch (e) {
            this.runBatch();
            throw e;
        }
    };
    FastDom.prototype.add = function(type, fn, ctx) {
        var id = this.uniqueId();
        return this.batch.hash[id] = {
            id: id,
            fn: fn,
            ctx: ctx,
            type: type
        };
    };
    FastDom.prototype.run = function(job) {
        var ctx = job.ctx || this;
        var fn = job.fn;
        delete this.batch.hash[job.id];
        if (!this.onError) {
            return fn.call(ctx);
        }
        try {
            fn.call(ctx);
        } catch (e) {
            this.onError(e);
        }
    };
    FastDom.prototype.loop = function() {
        var self = this;
        var raf = this.raf;
        if (this.looping) return;
        raf(function frame() {
            var fn = self.frames.shift();
            if (!self.frames.length) {
                self.looping = false;
            } else {
                raf(frame);
            }
            if (fn) fn();
        });
        this.looping = true;
    };
    FastDom.prototype.schedule = function(index, fn) {
        if (this.frames[index]) {
            return this.schedule(index + 1, fn);
        }
        this.loop();
        return this.frames[index] = fn;
    };
    fastdom = fastdom || new FastDom();
    if (typeof module !== "undefined" && module.exports) {
        module.exports = fastdom;
    } else if (typeof define === "function" && define.amd) {
        define(function() {
            return fastdom;
        });
    } else {
        window["fastdom"] = fastdom;
    }
})(window.fastdom);

"use strict";

var regPubMatch = /productNo(?:\.exact|\.raw)?(?=\:|$)/, regCheckInput = /[A-Za-z0-9\s\-\_\.\,\&]/g, regFixInput = /[^A-Za-z0-9\s\-\_\.\,\&]/g, regEmerge = / ?emerge/g, regHidden = / ?hidden/g, regLoad = / ?loading/g, regSelected = / ?selected/g, regOpened = / ?opened/g, regFail = / ?failed/g, regValidate = / ?invalidated/g, regQueryPubName = /(?:\b[\-_a-zA-Z]{1,3})?[ \t\-]*(?:(?:[\.\-]|[0-9]+)+)+(?:_?(?:sup|SUP)[A-Za-z]*)?/g, regEOLDashCheck = /[\-\cI\v\0\f]$/m, regPreTitle = /(?:\W?)\w\S*/g;

function addEvent(element, evt, fnc) {
    return element.addEventListener(evt, fnc, false);
}

function removeEvent(element, evt, fnc) {
    return element.removeEventListener(evt, fnc, false);
}

function swapClass(element, string, regex) {
    if (string !== "" && typeof string === "string") {
        fastdom.write(function() {
            var className = element.className;
            if (regex.test(className)) {
                return false;
            }
            element.className += " " + string;
        });
    } else {
        fastdom.write(function() {
            element.className = element.className.replace(regex, "");
        });
    }
}

function txt(string) {
    if (string && typeof string === "string" && string.length > 0) {
        return document.createTextNode(string);
    }
}

String.prototype.toTitle = function() {
    return this.replace(regPreTitle, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

String.prototype.toPubName = function() {
    var removed, count = 0, extraction = [];
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
        remove: removed,
        extract: extraction
    };
};

CSSStyleSheet.prototype.addCSSRule = function(selector, rules, index) {
    if ("insertRule" in this) {
        this.insertRule(selector + "{" + rules + "}", index);
    } else if ("addRule" in this) {
        this.addRule(selector, rules, index);
    }
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

function querySetup(term) {
    if (!term) return {
        term: "",
        pubName: "",
        noPubName: ""
    };
    return function(name) {
        return {
            term: term,
            pubName: name.extract,
            noPubName: name.remove
        };
    }(term.toPubName());
}

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

function upperOutlier(someArray) {
    var values = someArray.concat();
    values.sort(function(a, b) {
        return a - b;
    });
    var q1 = values[Math.floor(values.length / 4)];
    var q3 = values[Math.ceil(values.length * (3 / 4))];
    var iqr = q3 - q1;
    var maxValue = q3 + iqr * 1.5;
    return maxValue;
}

var relatedTemplateString = "" + '<li class="result doc<%= gravitas %>" data-score="<%= score %>" id="<%= key %>">' + "<%= key %>" + "</li>";

var resultTemplateString = "" + '<div class="result<%= type %><%= gravitas %> clearfix" data-score="<%= score %>" data-pub="<%= fullPub %>">' + '<% if ( type === " content" ) { %>' + '<div class="text clearfix">' + "<% if ( parts && concatText ) { %>" + '<span class="combined"><%= concatText %><br/></span>' + '<span class="parts"><%  var i = 0, count = parts.length;' + "for (; i < count; ++i) {" + "if ( count > 1 || concatText.length > parts[0].length ) { %>" + "<q>...<%= parts[i] %>...</q>" + "<% } else { %>" + "<%= parts[0] %>" + "<% } %>" + "<% } %></span>" + '<% if ( count > 1 || concatText.length > parts[0].length ) { %><a href="#" class="reveal-text clickable">expand</a><% } %>' + "<% } else { %>" + '<span class="combined"><%= rawText %></span>' + '<span class="parts"></span>' + '<a href="#" class="reveal-text clickable">expand</a>' + "<% } %>" + "</div>" + '<div class="meta">' + '<div class="details">' + '<span class="number"><%= sub %></span><br/>' + "<% if ( details && details.chapter && details.chapterTitle ) { %>" + '<span class="chapter">Chapter <%= details.chapter %><br/><span class="title"><%= details.chapterTitle %></span></span><br/>' + "<% } if ( details && details.section && details.sectionTitle ) { %>" + '<span class="section">Section <%= details.section %><br/><span class="title"><%= details.sectionTitle %></span></span><br/>' + "<% } %>" + "</div>" + '<a class="info clickable" href="<%= url %>" title="<%= date %>" download="<%= fullPub %>.pdf" target="_blank">' + '<span class="pub"><%= fullPub %></span><br/>' + '<span class="title"><%= title %></span>' + "</a>" + "</div>" + "<% } else { %>" + '<a class="info clickable" href="<%= url %>" title="<%= date %>" download="<%= fullPub %>.pdf" target="_blank">' + '<span class="pub"><%= fullPub %></span><br/>' + '<span class="title"><%= title %></span>' + "</a>" + "<% } %>" + "</div>";

var app = function(window, document, _, undefined) {
    "use strict";
    var loader_ = document.getElementById("loader"), searchWrap_ = document.getElementById("search-wrap"), wrap_ = document.getElementById("wrap"), page_ = document.getElementById("page"), searchRestore_ = document.getElementById("search-restore"), searchIcon_ = document.getElementById("ico"), xIcon_ = document.getElementById("x"), pageHeader_ = document.getElementById("page-header"), related_ = document.getElementById("related-list"), results_ = document.getElementById("results"), count_ = document.getElementById("count"), term_ = document.getElementById("term"), total_ = document.getElementById("total"), message_ = document.getElementById("message"), query_ = document.getElementById("query"), send_ = document.getElementById("send"), moreContent_ = document.getElementById("more-content"), infiniLabel_ = document.getElementById("infini-label"), infiniScroll_ = document.getElementById("infini-scroll"), placeContent = document.cookie.placeContent || "", placeMeta = document.cookie.placeMeta || "", bodyRect, relatedRect, resultsRect, relatedOffsetTop, stickyBarPosition;
    return {
        loader_: loader_,
        searchWrap_: searchWrap_,
        wrap_: wrap_,
        page_: page_,
        searchRestore_: searchRestore_,
        searchIcon_: searchIcon_,
        xIcon_: xIcon_,
        pageHeader_: pageHeader_,
        related_: related_,
        results_: results_,
        count_: count_,
        term_: term_,
        total_: total_,
        message_: message_,
        query_: query_,
        send_: send_,
        moreContent_: moreContent_,
        placeContent: placeContent,
        placeMeta: placeMeta,
        infiniLabel_: infiniLabel_,
        infiniScroll_: infiniScroll_,
        relatedTemplate: _.template(relatedTemplateString),
        resultTemplate: _.template(resultTemplateString),
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
        isSearchBoxOpen: null,
        isFailure: null,
        isDone: false,
        organizeData: function(data, allScores, upperMax) {
            var output = {}, regType = /chapter|section/, index, group, number, fullPub, rawText, text, date, highlights, fileFormat;
            if (!data._source && data.key && data.score) {
                index = allScores.indexOf(data.score);
                group = index > -1 ? " match-" + index : "";
                app.colors[data.key] = index;
                output = {
                    key: data.key,
                    url: document.location.protocol + "//get.that.pub/" + data.key.toLowerCase() + ".pdf",
                    score: data.score,
                    gravitas: upperMax < data.score || data.score >= 1 ? " pretty" + group : " boring" + group
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
                group = index && typeof index === "number" && (index >= 0 || index < 5) ? " match-" + index : "";
                output = {
                    score: data._score,
                    gravitas: upperMax < data.score || data.score >= 1 ? " pretty" + group : " boring" + group,
                    date: date,
                    url: document.location.protocol + "//get.that.pub/" + data._source.productNo.toLowerCase() + fileFormat,
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
                    concatText: data.highlight.text && data.highlight.text[0] || null,
                    parts: Array.isArray(text) ? text : null,
                    fileFormat: fileFormat,
                    type: rawText ? " content" : " doc"
                };
            }
            return output || null;
        },
        renderResults: function(itemType, results) {
            var stringToRender = "", objWithData = {}, rl = results.length, a = 0, upperMax, templateCode, scores;
            if (itemType === "results") {
                templateCode = this.resultTemplate;
                scores = this.scoresContent;
                upperMax = upperOutlier(scores);
            } else {
                templateCode = this.relatedTemplate;
                scores = this.scoresRelatives;
                upperMax = upperOutlier(scores);
            }
            for (;a < rl; ++a) {
                objWithData = this.organizeData(results[a], scores, upperMax);
                stringToRender += templateCode(objWithData);
            }
            return stringToRender;
        },
        searchBoxToggle: function(action) {
            var that = this;
            if (action === "close") {
                this.infiniScroll = this.infiniScroll_ ? this.infiniScroll_.checked || !!this.infiniScroll_.checked : true;
                this.term = this.query_.value.trim();
                swapClass(this.searchWrap_, "", regEmerge);
                swapClass(this.searchWrap_, "", regFail);
                fastdom.write(function() {
                    that.searchIcon_.style.display = "";
                    that.xIcon_.style.display = "none";
                    that.message_.innerHTML = "";
                });
                this.isSearchBoxOpen = false;
            } else if (action === "open") {
                fastdom.write(function() {
                    that.query_.value = that.term;
                    that.searchIcon_.style.display = "none";
                    that.xIcon_.style.display = "";
                });
                swapClass(this.searchWrap_, "emerge", regEmerge);
                if (this.isFailure === true) {
                    this.isFailure = false;
                    swapClass(this.searchWrap_, "failed", regFail);
                }
                this.isSearchBoxOpen = true;
                this.infiniScroll = false;
            }
        }
    };
}(this, this.document, _);

(function(window, document, app, undefined) {
    "use strict";
    app.revealText = function(event) {
        var that = event.currentTarget || event.srcElement || event.target, open;
        event.preventDefault();
        open = that.getAttribute("data-opened");
        if (open !== "true") {
            fastdom.write(function() {
                swapClass(that.parentNode, "opened", regOpened);
                that.innerHTML = "consolidate";
                that.setAttribute("data-opened", "true");
            });
        } else {
            fastdom.write(function() {
                swapClass(that.parentNode, "", regOpened);
                that.innerHTML = "expand";
                that.setAttribute("data-opened", "false");
            });
        }
        return false;
    };
    app.more = function(event) {
        if (event && event.preventDefault) {
            event.preventDefault();
        }
        if (app.loading.now !== true) {
            swapClass(app.loader_, "loading", regLoad);
        }
        app.submitQuery("content", "more", document.cookie.placeContent || app.placeContent, null);
        return false;
    };
    app.infini = function(event) {
        var status, doThis;
        app.infiniScroll = this.checked || !!this.checked;
        status = app.infiniScroll ? "enabled" : "disabled";
        doThis = app.infiniScroll ? "Disable" : "Enable";
        app.infiniLabel_.className = status;
        app.infiniLabel_.setAttribute("title", doThis + " infinite scroll");
        if (!status) {
            this.removeAttribute("checked");
        }
    };
    app.scrollWheeler = function(event) {
        fastdom.read(function() {
            var pos = (rootElement && typeof rootElement.ScrollTop === "number" ? rootElement : document.body).ScrollTop || window.pageYOffset, delta = pos - app.pos;
            if (app.infiniScroll === true && app.loading.now === false && app.loading.stillMore === true && delta > 0 && pos > app.loading.currentHeight - 1200) {
                app.loading.now = true;
                app.more();
            }
            app.pos = pos;
        });
    };
    app.searchStart = function(event) {
        event && event.preventDefault && event.preventDefault();
        var that = this, val = app.query_.value.trim();
        app.isFailure = false;
        app.isDone = false;
        if (!val) {
            app.queryInvalidated = true;
            swapClass(app.query_, "invalidated", regValidate);
            fastdom.write(function() {
                that.message_.innerHTML = "You gotta type something first.";
                that.query_.focus();
            });
            return false;
        }
        app.term = val;
        swapClass(app.loader_, "loading", regLoad);
        app.submitQuery("content", "search", app.placeContent, app.placeMeta);
        return false;
    };
})(this, this.document, app);

(function(window, document, app, undefined) {
    "use strict";
    app.handleResponse = function(httpRequest, action) {
        var that = this, response = JSON.parse(httpRequest.responseText), content = response[0] || null, meta = response[1] || null, expires, a = 0, b = 0, reveals, rl;
        this.isDone = true;
        if (content && content.hits.total === 0 && (meta && meta.hits.total === 0)) {
            this.isFailure = true;
            this.infiniScroll = false;
            document.cookie = "placeContent=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            document.cookie = "placeMeta=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            fastdom.write(function() {
                that.message_.innerHTML = "Your search returned no results.  Give 'er another go.";
            });
            swapClass(this.loader_, "", regLoad);
            this.xIcon_.style.display = "none";
            swapClass(this.searchWrap_, "failed", regFail);
            return false;
        }
        expires = new Date(Date.now() + 6e4);
        expires = expires.toUTCString();
        fastdom.defer(function() {
            if (that.resetSearch) {
                clearTimeout(that.resetSearch);
            }
            that.resetSearch = setTimeout(function() {
                swapClass(that.moreContent_, "hidden", regHidden);
                that.loading.stillMore = false;
            }, 6e4);
        });
        if (content) {
            var currentContent = content.hits.hits.length;
            this.placeContent = content._scroll_id;
            document.cookie = "placeContent=" + this.placeContent + "; expires=" + expires;
            if (action !== "more") {
                var currentRelatives = content.aggregations.related_doc.buckets.length;
                window.scroll(0, 0);
                b = 0;
                for (;b < currentContent; ++b) {
                    this.scoresContent[b] = content.hits.hits[b]._score;
                }
                for (b = 0; b < currentRelatives; ++b) {
                    this.scoresRelatives[b] = content.aggregations.related_doc.buckets[b].score;
                }
                fastdom.write(function() {
                    that.term_.innerHTML = that.term;
                    that.count_.innerHTML = content.hits.hits.length;
                    that.total_.innerHTML = content.hits.total;
                    that.related_.innerHTML = that.renderResults("relatives", content.aggregations.related_doc.buckets);
                    that.results_.innerHTML = that.renderResults("results", content.hits.hits);
                });
            } else {
                for (b = 0; b < currentContent; ++b) {
                    this.scoresContent.push(content.hits.hits[b]._score);
                }
                fastdom.write(function() {
                    that.count_.innerHTML = that.scoresContent.length;
                    that.results_.innerHTML += that.renderResults("results", content.hits.hits);
                });
            }
            fastdom.defer(function() {
                that.relatedRect = that.related_.getBoundingClientRect();
                that.bodyRect = document.body.getBoundingClientRect();
                that.stickyBarPosition = Math.abs(that.relatedRect.top) + Math.abs(that.bodyRect.top) + Math.abs(that.relatedRect.height);
            });
            fastdom.defer(function() {
                reveals = that.results_.querySelectorAll(".reveal-text");
                rl = reveals.length;
                a = 0;
                for (;a < rl; ++a) {
                    addEvent(reveals[a], "click", that.revealText);
                }
            });
            if (content.hits.hits.length < 20) {
                this.loading.stillMore = false;
                swapClass(this.moreContent_, "hidden", regHidden);
            } else {
                this.loading.stillMore = true;
                swapClass(this.moreContent_, "", regHidden);
            }
        }
        if (meta) {
            this.placeMeta = meta._scroll_id;
            document.cookie = "placeMeta=" + this.placeMeta + "; expires=" + expires;
        }
        fastdom.defer(function() {
            that.resultsRect = that.results_.getBoundingClientRect();
            that.loading.currentHeight = Math.abs(that.resultsRect.height);
            that.loading.now = false;
        });
        this.searchBoxToggle("close");
        swapClass(this.loader_, "", regLoad);
    };
    app.submitQuery = function(type, action, contentPager, metaPager) {
        var that = this, request = new XMLHttpRequest(), query = this.term, url = "/find/" + type + "/" + action, data = {
            t: querySetup(query),
            g: contentPager,
            s: metaPager
        }, dataString = JSON.stringify(data);
        request.onreadystatechange = function() {
            if (request.readyState === 4 && request.status === 200) {
                that.handleResponse(request, action);
            }
        };
        request.open("POST", url, true);
        request.setRequestHeader("Content-type", "application/json");
        request.send(dataString);
    };
})(this, this.document, app);

(function(window, document, app, FastClick, undefined) {
    "use strict";
    addEvent(app.send_, "click", app.searchStart);
    addEvent(app.query_, "focus", function() {
        if (app.queryInvalidated !== true) {
            return false;
        }
    });
    addEvent(app.query_, "keypress", function(event) {
        if (app.queryInvalidated === true) {
            app.queryInvalidated = false;
            swapClass(app.query_, "", regValidate);
            app.message_.innerHTML = "";
        }
        if (event.which === 13 && app.isSearchBoxOpen === true) {
            app.searchStart(event);
            return false;
        }
    });
    addEvent(document, "keyup", function(event) {
        if (event.which === 27) {
            event.preventDefault();
            if (app.isSearchBoxOpen === true && app.isFailure !== true) {
                app.searchBoxToggle("close");
            }
        }
    });
    addEvent(app.moreContent_, "click", app.more);
    addEvent(app.searchRestore_, "click", function(event) {
        event.preventDefault();
        if (app.isSearchBoxOpen === true) {
            if (app.isDone === true && app.isFailure !== true) {
                app.searchBoxToggle("close");
            } else {
                return false;
            }
        } else {
            app.searchBoxToggle("open");
            app.query_.value = app.term;
            app.query_.focus();
        }
        return false;
    });
    addEvent(app.infiniScroll_, "change", app.infini);
    addEvent(window, "scroll", app.scrollWheeler);
    addEvent(window, "load", function() {
        app.isSearchBoxOpen = true;
        app.isDone = false;
        app.query_.focus();
    });
    addEvent(document, "DOMContentLoaded", function() {
        FastClick.attach(app.wrap_);
    });
})(this, this.document, app, FastClick);
//# sourceMappingURL=script.js.map