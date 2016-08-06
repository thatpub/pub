(function(e) {
    if ("function" == typeof bootstrap) bootstrap("event", e); else if ("object" == typeof exports) module.exports = e(); else if ("function" == typeof define && define.amd) define(e); else if ("undefined" != typeof ses) {
        if (!ses.ok()) return;
        ses.makeEvent = e;
    } else "undefined" != typeof window ? window.Event = e() : global.Event = e();
})(function() {
    return function(e, t, n) {
        function i(n, o) {
            if (!t[n]) {
                if (!e[n]) {
                    var s = "function" == typeof require && require;
                    if (!o && s) return s(n, !0);
                    if (r) return r(n, !0);
                    throw Error("Cannot find module '" + n + "'");
                }
                var f = t[n] = {
                    exports: {}
                };
                e[n][0](function(t) {
                    var r = e[n][1][t];
                    return i(r ? r : t);
                }, f, f.exports);
            }
            return t[n].exports;
        }
        for (var r = "function" == typeof require && require, o = 0; n.length > o; o++) i(n[o]);
        return i;
    }({
        1: [ function(e, t) {
            function n(e) {
                return this instanceof n ? e ? i(e, r) : void 0 : new n(e);
            }
            function i(e, t) {
                for (var n in t) e[n] = t[n];
                return e;
            }
            var r = n.prototype;
            t.exports = n, r.on = function(e, t) {
                return this._cbs = this._cbs || {}, (this._cbs[e] || (this._cbs[e] = [])).unshift(t), 
                this;
            }, r.off = function(e, t) {
                if (this._cbs = this._cbs || {}, !e) return this._cbs = {};
                if (!t) return delete this._cbs[e];
                for (var n, i = this._cbs[e] || []; i && ~(n = i.indexOf(t)); ) i.splice(n, 1);
                return this;
            }, r.fire = function(e) {
                this._cbs = this._cbs || {};
                var t = e.name || e, n = e.ctx || this, i = this._cbs[t];
                if (i) for (var r = [].slice.call(arguments, 1), o = i.length; o--; ) i[o].apply(n, r);
                return this;
            };
        }, {} ]
    }, {}, [ 1 ])(1);
});

!function(t) {
    "use strict";
    function e() {
        var e = this;
        e.reads = [], e.writes = [], e.raf = a.bind(t);
    }
    function n(t) {
        t.scheduled || (t.scheduled = !0, t.raf(i.bind(null, t)));
    }
    function i(t) {
        var e, i = t.writes, o = t.reads;
        try {
            r(o), r(i);
        } catch (s) {
            e = s;
        }
        if (t.scheduled = !1, (o.length || i.length) && n(t), e) {
            if (!t["catch"]) throw e;
            t["catch"](e);
        }
    }
    function r(t) {
        for (var e; e = t.shift(); ) e();
    }
    function o(t, e) {
        var n = t.indexOf(e);
        return !!~n && !!t.splice(n, 1);
    }
    function s(t, e) {
        for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
    }
    var a = t.requestAnimationFrame || t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame || t.msRequestAnimationFrame || function(t) {
        return setTimeout(t, 16);
    };
    e.prototype = {
        constructor: e,
        measure: function(t, e) {
            var i = e ? t.bind(e) : t;
            return this.reads.push(i), n(this), i;
        },
        mutate: function(t, e) {
            var i = e ? t.bind(e) : t;
            return this.writes.push(i), n(this), i;
        },
        clear: function(t) {
            return o(this.reads, t) || o(this.writes, t);
        },
        extend: function(t) {
            if ("object" != typeof t) throw new Error("expected object");
            var e = Object.create(this);
            return s(e, t), e.fastdom = this, e.initialize && e.initialize(), e;
        },
        "catch": null
    };
    var exports = t.fastdom = t.fastdom || new e();
    "f" == (typeof define)[0] ? define(function() {
        return exports;
    }) : "o" == (typeof module)[0] && (module.exports = exports);
}(this);

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
    function t(t, e, n) {
        switch (n.length) {
          case 0:
            return t.call(e);

          case 1:
            return t.call(e, n[0]);

          case 2:
            return t.call(e, n[0], n[1]);

          case 3:
            return t.call(e, n[0], n[1], n[2]);
        }
        return t.apply(e, n);
    }
    function e(t, e) {
        for (var n = -1, r = t ? t.length : 0, o = Array(r); ++n < r; ) o[n] = e(t[n], n, t);
        return o;
    }
    function n(t, n) {
        return e(n, function(e) {
            return t[e];
        });
    }
    function r(t) {
        return "\\" + G[t];
    }
    function o(t) {
        var e = Object;
        return function(n) {
            return t(e(n));
        };
    }
    function u() {}
    function c(t, e, n, r) {
        return t === L || g(t, B[n]) && !C.call(r, n) ? e : t;
    }
    function l(t) {
        t = null == t ? t : Object(t);
        var e, n = [];
        for (e in t) n.push(e);
        return n;
    }
    function i(e) {
        var n;
        return n = Y(n === L ? e.length - 1 : n, 0), function() {
            for (var r = arguments, o = -1, u = Y(r.length - n, 0), c = Array(u); ++o < u; ) c[o] = r[n + o];
            for (o = -1, u = Array(n + 1); ++o < n; ) u[o] = r[o];
            return u[n] = c, t(e, this, u);
        };
    }
    function a(t) {
        var e = t ? t.length : L;
        if (h(e) && (rt(t) || d(t) || b(t))) {
            t = String;
            for (var n = -1, r = Array(e); ++n < e; ) r[n] = t(n);
            e = r;
        } else e = null;
        return e;
    }
    function f(t, e) {
        return e = null == e ? 9007199254740991 : e, !!e && (typeof t == "number" || P.test(t)) && -1 < t && 0 == t % 1 && t < e;
    }
    function s(t, e, n) {
        if (!m(n)) return false;
        var r = typeof e;
        return !!("number" == r ? y(n) && f(e, n.length) : "string" == r && e in n) && g(n[e], t);
    }
    function p(t) {
        var e = t && t.constructor;
        return t === (typeof e == "function" && e.prototype || B);
    }
    function g(t, e) {
        return t === e || t !== t && e !== e;
    }
    function b(t) {
        return _(t) && C.call(t, "callee") && (!Q.call(t, "callee") || "[object Arguments]" == D.call(t));
    }
    function y(t) {
        return null != t && h(et(t)) && !v(t);
    }
    function _(t) {
        return O(t) && y(t);
    }
    function j(t) {
        return !!O(t) && ("[object Error]" == D.call(t) || typeof t.message == "string" && typeof t.name == "string");
    }
    function v(t) {
        return t = m(t) ? D.call(t) : "", "[object Function]" == t || "[object GeneratorFunction]" == t;
    }
    function h(t) {
        return typeof t == "number" && -1 < t && 0 == t % 1 && 9007199254740991 >= t;
    }
    function m(t) {
        var e = typeof t;
        return !!t && ("object" == e || "function" == e);
    }
    function O(t) {
        return !!t && typeof t == "object";
    }
    function d(t) {
        return typeof t == "string" || !rt(t) && O(t) && "[object String]" == D.call(t);
    }
    function S(t) {
        return typeof t == "symbol" || O(t) && "[object Symbol]" == D.call(t);
    }
    function A(t) {
        if (null == t) t = ""; else if (typeof t != "string") if (S(t)) t = Z ? Z.call(t) : ""; else {
            var e = t + "";
            t = "0" == e && 1 / t == -R ? "-0" : e;
        }
        return t;
    }
    function x(t) {
        var e = p(t);
        if (!e && !y(t)) return tt(t);
        var n, r = a(t), o = !!r, r = r || [], u = r.length;
        for (n in t) {
            var c = t, l = n;
            null == c || !(C.call(c, l) || typeof c == "object" && l in c && null === nt(c)) || o && ("length" == n || f(n, u)) || e && "constructor" == n || r.push(n);
        }
        return r;
    }
    function E(t) {
        for (var e = -1, n = p(t), r = l(t), o = r.length, u = a(t), c = !!u, u = u || [], i = u.length; ++e < o; ) {
            var s = r[e];
            c && ("length" == s || f(s, i)) || "constructor" == s && (n || !C.call(t, s)) || u.push(s);
        }
        return u;
    }
    var L, R = 1 / 0, k = /\b__p\+='';/g, $ = /\b(__p\+=)''\+/g, F = /(__e\(.*?\)|\b__t\))\+'';/g, w = /[&<>"'`]/g, I = RegExp(w.source), U = /<%=([\s\S]+?)%>/g, q = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, P = /^(?:0|[1-9]\d*)$/, T = /($^)/, W = /['\n\r\u2028\u2029\\]/g, G = {
        "\\": "\\",
        "'": "'",
        "\n": "n",
        "\r": "r",
        "\u2028": "u2028",
        "\u2029": "u2029"
    }, M = typeof self == "object" && self && self.Object === Object && self, M = typeof global == "object" && global && global.Object === Object && global || M || Function("return this")(), N = typeof exports == "object" && exports && !exports.nodeType && exports, V = N && typeof module == "object" && module && !module.nodeType && module, z = function(t) {
        return function(e) {
            return null == t ? L : t[e];
        };
    }({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "`": "&#96;"
    }), B = Object.prototype, C = B.hasOwnProperty, D = B.toString, H = M.Reflect, J = M.Symbol, K = H ? H.a : L, Q = B.propertyIsEnumerable, H = Object.getPrototypeOf, X = Object.keys, Y = Math.max, Z = (J = J ? J.prototype : L) ? J.toString : L;
    u.templateSettings = {
        escape: /<%-([\s\S]+?)%>/g,
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: U,
        variable: "",
        imports: {
            _: u
        }
    };
    var tt = o(X);
    K && !Q.call({
        valueOf: 1
    }, "valueOf") && (l = function(t) {
        t = K(t);
        for (var e, n = []; !(e = t.next()).done; ) n.push(e.value);
        return n;
    });
    var et = function(t) {
        return function(e) {
            return null == e ? L : e[t];
        };
    }("length"), nt = o(H), rt = Array.isArray, ot = function(t) {
        return i(function(e, n) {
            var r = -1, o = n.length, u = 1 < o ? n[o - 1] : L, c = 2 < o ? n[2] : L, u = 3 < t.length && typeof u == "function" ? (o--, 
            u) : L;
            for (c && s(n[0], n[1], c) && (u = 3 > o ? L : u, o = 1), e = Object(e); ++r < o; ) (c = n[r]) && t(e, c, r, u);
            return e;
        });
    }(function(t, e, n, r) {
        n = E(e), t || (t = {});
        for (var o = -1, u = n.length; ++o < u; ) {
            var c = n[o], l = r ? r(t[c], e[c], c, t, e) : L, i = t, a = c, c = l === L ? e[c] : l, l = i[a];
            C.call(i, a) && g(l, c) && (c !== L || a in i) || (i[a] = c);
        }
    }), ut = i(function(e, n) {
        try {
            return t(e, L, n);
        } catch (t) {
            return j(t) ? t : Error(t);
        }
    });
    u.assignInWith = ot, u.keys = x, u.keysIn = E, u.extendWith = ot, u.attempt = ut, 
    u.eq = g, u.escape = function(t) {
        return (t = A(t)) && I.test(t) ? t.replace(w, z) : t;
    }, u.isArguments = b, u.isArray = rt, u.isArrayLike = y, u.isArrayLikeObject = _, 
    u.isError = j, u.isFunction = v, u.isLength = h, u.isObject = m, u.isObjectLike = O, 
    u.isString = d, u.isSymbol = S, u.template = function(t, e, o) {
        var l = u.templateSettings;
        o && s(t, e, o) && (e = L), t = A(t), e = ot({}, e, l, c), o = ot({}, e.imports, l.imports, c);
        var i, a, f = x(o), p = n(o, f), g = 0;
        o = e.interpolate || T;
        var b = "__p+='", y = "sourceURL" in e ? "//# sourceURL=" + e.sourceURL + "\n" : "";
        if (t.replace(RegExp((e.escape || T).source + "|" + o.source + "|" + (o === U ? q : T).source + "|" + (e.evaluate || T).source + "|$", "g"), function(e, n, o, u, c, l) {
            return o || (o = u), b += t.slice(g, l).replace(W, r), n && (i = true, b += "'+__e(" + n + ")+'"), 
            c && (a = true, b += "';" + c + ";\n__p+='"), o && (b += "'+((__t=(" + o + "))==null?'':__t)+'"), 
            g = l + e.length, e;
        }), b += "';", (e = e.variable) || (b = "with(obj){" + b + "}"), b = (a ? b.replace(k, "") : b).replace($, "$1").replace(F, "$1;"), 
        b = "function(" + (e || "obj") + "){" + (e ? "" : "obj||(obj={});") + "var __t,__p=''" + (i ? ",__e=_.escape" : "") + (a ? ",__j=Array.prototype.join;function print(){__p+=__j.call(arguments,'')}" : ";") + b + "return __p}", 
        e = ut(function() {
            return Function(f, y + "return " + b).apply(L, p);
        }), e.source = b, j(e)) throw e;
        return e;
    }, u.toString = A, u.VERSION = "4.14.1", typeof define == "function" && typeof define.amd == "object" && define.amd ? (M._ = u, 
    define(function() {
        return u;
    })) : V ? ((V.exports = u)._ = u, N._ = u) : M._ = u;
}).call(this);

!function(t, e) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : t.Immutable = e();
}(this, function() {
    "use strict";
    function t(t, e) {
        e && (t.prototype = Object.create(e.prototype)), t.prototype.constructor = t;
    }
    function e(t) {
        return o(t) ? t : O(t);
    }
    function r(t) {
        return u(t) ? t : x(t);
    }
    function n(t) {
        return s(t) ? t : k(t);
    }
    function i(t) {
        return o(t) && !a(t) ? t : A(t);
    }
    function o(t) {
        return !(!t || !t[ar]);
    }
    function u(t) {
        return !(!t || !t[hr]);
    }
    function s(t) {
        return !(!t || !t[fr]);
    }
    function a(t) {
        return u(t) || s(t);
    }
    function h(t) {
        return !(!t || !t[cr]);
    }
    function f(t) {
        return t.value = !1, t;
    }
    function c(t) {
        t && (t.value = !0);
    }
    function _() {}
    function p(t, e) {
        e = e || 0;
        for (var r = Math.max(0, t.length - e), n = Array(r), i = 0; r > i; i++) n[i] = t[i + e];
        return n;
    }
    function v(t) {
        return void 0 === t.size && (t.size = t.__iterate(y)), t.size;
    }
    function l(t, e) {
        if ("number" != typeof e) {
            var r = e >>> 0;
            if ("" + r !== e || 4294967295 === r) return NaN;
            e = r;
        }
        return 0 > e ? v(t) + e : e;
    }
    function y() {
        return !0;
    }
    function d(t, e, r) {
        return (0 === t || void 0 !== r && -r >= t) && (void 0 === e || void 0 !== r && e >= r);
    }
    function m(t, e) {
        return w(t, e, 0);
    }
    function g(t, e) {
        return w(t, e, e);
    }
    function w(t, e, r) {
        return void 0 === t ? r : 0 > t ? Math.max(0, e + t) : void 0 === e ? t : Math.min(e, t);
    }
    function S(t) {
        this.next = t;
    }
    function z(t, e, r, n) {
        var i = 0 === t ? e : 1 === t ? r : [ e, r ];
        return n ? n.value = i : n = {
            value: i,
            done: !1
        }, n;
    }
    function I() {
        return {
            value: void 0,
            done: !0
        };
    }
    function b(t) {
        return !!M(t);
    }
    function q(t) {
        return t && "function" == typeof t.next;
    }
    function D(t) {
        var e = M(t);
        return e && e.call(t);
    }
    function M(t) {
        var e = t && (zr && t[zr] || t[Ir]);
        return "function" == typeof e ? e : void 0;
    }
    function E(t) {
        return t && "number" == typeof t.length;
    }
    function O(t) {
        return null === t || void 0 === t ? T() : o(t) ? t.toSeq() : C(t);
    }
    function x(t) {
        return null === t || void 0 === t ? T().toKeyedSeq() : o(t) ? u(t) ? t.toSeq() : t.fromEntrySeq() : B(t);
    }
    function k(t) {
        return null === t || void 0 === t ? T() : o(t) ? u(t) ? t.entrySeq() : t.toIndexedSeq() : W(t);
    }
    function A(t) {
        return (null === t || void 0 === t ? T() : o(t) ? u(t) ? t.entrySeq() : t : W(t)).toSetSeq();
    }
    function j(t) {
        this._array = t, this.size = t.length;
    }
    function R(t) {
        var e = Object.keys(t);
        this._object = t, this._keys = e, this.size = e.length;
    }
    function U(t) {
        this._iterable = t, this.size = t.length || t.size;
    }
    function K(t) {
        this._iterator = t, this._iteratorCache = [];
    }
    function L(t) {
        return !(!t || !t[qr]);
    }
    function T() {
        return Dr || (Dr = new j([]));
    }
    function B(t) {
        var e = Array.isArray(t) ? new j(t).fromEntrySeq() : q(t) ? new K(t).fromEntrySeq() : b(t) ? new U(t).fromEntrySeq() : "object" == typeof t ? new R(t) : void 0;
        if (!e) throw new TypeError("Expected Array or iterable object of [k, v] entries, or keyed object: " + t);
        return e;
    }
    function W(t) {
        var e = J(t);
        if (!e) throw new TypeError("Expected Array or iterable object of values: " + t);
        return e;
    }
    function C(t) {
        var e = J(t) || "object" == typeof t && new R(t);
        if (!e) throw new TypeError("Expected Array or iterable object of values, or keyed object: " + t);
        return e;
    }
    function J(t) {
        return E(t) ? new j(t) : q(t) ? new K(t) : b(t) ? new U(t) : void 0;
    }
    function N(t, e, r, n) {
        var i = t._cache;
        if (i) {
            for (var o = i.length - 1, u = 0; o >= u; u++) {
                var s = i[r ? o - u : u];
                if (e(s[1], n ? s[0] : u, t) === !1) return u + 1;
            }
            return u;
        }
        return t.__iterateUncached(e, r);
    }
    function P(t, e, r, n) {
        var i = t._cache;
        if (i) {
            var o = i.length - 1, u = 0;
            return new S(function() {
                var t = i[r ? o - u : u];
                return u++ > o ? I() : z(e, n ? t[0] : u - 1, t[1]);
            });
        }
        return t.__iteratorUncached(e, r);
    }
    function H(t, e) {
        return e ? V(e, t, "", {
            "": t
        }) : Y(t);
    }
    function V(t, e, r, n) {
        return Array.isArray(e) ? t.call(n, r, k(e).map(function(r, n) {
            return V(t, r, n, e);
        })) : Q(e) ? t.call(n, r, x(e).map(function(r, n) {
            return V(t, r, n, e);
        })) : e;
    }
    function Y(t) {
        return Array.isArray(t) ? k(t).map(Y).toList() : Q(t) ? x(t).map(Y).toMap() : t;
    }
    function Q(t) {
        return t && (t.constructor === Object || void 0 === t.constructor);
    }
    function X(t, e) {
        if (t === e || t !== t && e !== e) return !0;
        if (!t || !e) return !1;
        if ("function" == typeof t.valueOf && "function" == typeof e.valueOf) {
            if (t = t.valueOf(), e = e.valueOf(), t === e || t !== t && e !== e) return !0;
            if (!t || !e) return !1;
        }
        return "function" == typeof t.equals && "function" == typeof e.equals && t.equals(e) ? !0 : !1;
    }
    function F(t, e) {
        if (t === e) return !0;
        if (!o(e) || void 0 !== t.size && void 0 !== e.size && t.size !== e.size || void 0 !== t.__hash && void 0 !== e.__hash && t.__hash !== e.__hash || u(t) !== u(e) || s(t) !== s(e) || h(t) !== h(e)) return !1;
        if (0 === t.size && 0 === e.size) return !0;
        var r = !a(t);
        if (h(t)) {
            var n = t.entries();
            return e.every(function(t, e) {
                var i = n.next().value;
                return i && X(i[1], t) && (r || X(i[0], e));
            }) && n.next().done;
        }
        var i = !1;
        if (void 0 === t.size) if (void 0 === e.size) "function" == typeof t.cacheResult && t.cacheResult(); else {
            i = !0;
            var f = t;
            t = e, e = f;
        }
        var c = !0, _ = e.__iterate(function(e, n) {
            return (r ? t.has(e) : i ? X(e, t.get(n, yr)) : X(t.get(n, yr), e)) ? void 0 : (c = !1, 
            !1);
        });
        return c && t.size === _;
    }
    function G(t, e) {
        if (!(this instanceof G)) return new G(t, e);
        if (this._value = t, this.size = void 0 === e ? 1 / 0 : Math.max(0, e), 0 === this.size) {
            if (Mr) return Mr;
            Mr = this;
        }
    }
    function Z(t, e) {
        if (!t) throw Error(e);
    }
    function $(t, e, r) {
        if (!(this instanceof $)) return new $(t, e, r);
        if (Z(0 !== r, "Cannot step a Range by 0"), t = t || 0, void 0 === e && (e = 1 / 0), 
        r = void 0 === r ? 1 : Math.abs(r), t > e && (r = -r), this._start = t, this._end = e, 
        this._step = r, this.size = Math.max(0, Math.ceil((e - t) / r - 1) + 1), 0 === this.size) {
            if (Er) return Er;
            Er = this;
        }
    }
    function tt() {
        throw TypeError("Abstract");
    }
    function et() {}
    function rt() {}
    function nt() {}
    function it(t) {
        return t >>> 1 & 1073741824 | 3221225471 & t;
    }
    function ot(t) {
        if (t === !1 || null === t || void 0 === t) return 0;
        if ("function" == typeof t.valueOf && (t = t.valueOf(), t === !1 || null === t || void 0 === t)) return 0;
        if (t === !0) return 1;
        var e = typeof t;
        if ("number" === e) {
            if (t !== t || t === 1 / 0) return 0;
            var r = 0 | t;
            for (r !== t && (r ^= 4294967295 * t); t > 4294967295; ) t /= 4294967295, r ^= t;
            return it(r);
        }
        if ("string" === e) return t.length > Kr ? ut(t) : st(t);
        if ("function" == typeof t.hashCode) return t.hashCode();
        if ("object" === e) return at(t);
        if ("function" == typeof t.toString) return st("" + t);
        throw Error("Value type " + e + " cannot be hashed.");
    }
    function ut(t) {
        var e = Br[t];
        return void 0 === e && (e = st(t), Tr === Lr && (Tr = 0, Br = {}), Tr++, Br[t] = e), 
        e;
    }
    function st(t) {
        for (var e = 0, r = 0; t.length > r; r++) e = 31 * e + t.charCodeAt(r) | 0;
        return it(e);
    }
    function at(t) {
        var e;
        if (jr && (e = Or.get(t), void 0 !== e)) return e;
        if (e = t[Ur], void 0 !== e) return e;
        if (!Ar) {
            if (e = t.propertyIsEnumerable && t.propertyIsEnumerable[Ur], void 0 !== e) return e;
            if (e = ht(t), void 0 !== e) return e;
        }
        if (e = ++Rr, 1073741824 & Rr && (Rr = 0), jr) Or.set(t, e); else {
            if (void 0 !== kr && kr(t) === !1) throw Error("Non-extensible objects are not allowed as keys.");
            if (Ar) Object.defineProperty(t, Ur, {
                enumerable: !1,
                configurable: !1,
                writable: !1,
                value: e
            }); else if (void 0 !== t.propertyIsEnumerable && t.propertyIsEnumerable === t.constructor.prototype.propertyIsEnumerable) t.propertyIsEnumerable = function() {
                return this.constructor.prototype.propertyIsEnumerable.apply(this, arguments);
            }, t.propertyIsEnumerable[Ur] = e; else {
                if (void 0 === t.nodeType) throw Error("Unable to set a non-enumerable property on object.");
                t[Ur] = e;
            }
        }
        return e;
    }
    function ht(t) {
        if (t && t.nodeType > 0) switch (t.nodeType) {
          case 1:
            return t.uniqueID;

          case 9:
            return t.documentElement && t.documentElement.uniqueID;
        }
    }
    function ft(t) {
        Z(t !== 1 / 0, "Cannot perform this action with an infinite size.");
    }
    function ct(t) {
        return null === t || void 0 === t ? zt() : _t(t) && !h(t) ? t : zt().withMutations(function(e) {
            var n = r(t);
            ft(n.size), n.forEach(function(t, r) {
                return e.set(r, t);
            });
        });
    }
    function _t(t) {
        return !(!t || !t[Wr]);
    }
    function pt(t, e) {
        this.ownerID = t, this.entries = e;
    }
    function vt(t, e, r) {
        this.ownerID = t, this.bitmap = e, this.nodes = r;
    }
    function lt(t, e, r) {
        this.ownerID = t, this.count = e, this.nodes = r;
    }
    function yt(t, e, r) {
        this.ownerID = t, this.keyHash = e, this.entries = r;
    }
    function dt(t, e, r) {
        this.ownerID = t, this.keyHash = e, this.entry = r;
    }
    function mt(t, e, r) {
        this._type = e, this._reverse = r, this._stack = t._root && wt(t._root);
    }
    function gt(t, e) {
        return z(t, e[0], e[1]);
    }
    function wt(t, e) {
        return {
            node: t,
            index: 0,
            __prev: e
        };
    }
    function St(t, e, r, n) {
        var i = Object.create(Cr);
        return i.size = t, i._root = e, i.__ownerID = r, i.__hash = n, i.__altered = !1, 
        i;
    }
    function zt() {
        return Jr || (Jr = St(0));
    }
    function It(t, e, r) {
        var n, i;
        if (t._root) {
            var o = f(dr), u = f(mr);
            if (n = bt(t._root, t.__ownerID, 0, void 0, e, r, o, u), !u.value) return t;
            i = t.size + (o.value ? r === yr ? -1 : 1 : 0);
        } else {
            if (r === yr) return t;
            i = 1, n = new pt(t.__ownerID, [ [ e, r ] ]);
        }
        return t.__ownerID ? (t.size = i, t._root = n, t.__hash = void 0, t.__altered = !0, 
        t) : n ? St(i, n) : zt();
    }
    function bt(t, e, r, n, i, o, u, s) {
        return t ? t.update(e, r, n, i, o, u, s) : o === yr ? t : (c(s), c(u), new dt(e, n, [ i, o ]));
    }
    function qt(t) {
        return t.constructor === dt || t.constructor === yt;
    }
    function Dt(t, e, r, n, i) {
        if (t.keyHash === n) return new yt(e, n, [ t.entry, i ]);
        var o, u = (0 === r ? t.keyHash : t.keyHash >>> r) & lr, s = (0 === r ? n : n >>> r) & lr, a = u === s ? [ Dt(t, e, r + pr, n, i) ] : (o = new dt(e, n, i), 
        s > u ? [ t, o ] : [ o, t ]);
        return new vt(e, 1 << u | 1 << s, a);
    }
    function Mt(t, e, r, n) {
        t || (t = new _());
        for (var i = new dt(t, ot(r), [ r, n ]), o = 0; e.length > o; o++) {
            var u = e[o];
            i = i.update(t, 0, void 0, u[0], u[1]);
        }
        return i;
    }
    function Et(t, e, r, n) {
        for (var i = 0, o = 0, u = Array(r), s = 0, a = 1, h = e.length; h > s; s++, a <<= 1) {
            var f = e[s];
            void 0 !== f && s !== n && (i |= a, u[o++] = f);
        }
        return new vt(t, i, u);
    }
    function Ot(t, e, r, n, i) {
        for (var o = 0, u = Array(vr), s = 0; 0 !== r; s++, r >>>= 1) u[s] = 1 & r ? e[o++] : void 0;
        return u[n] = i, new lt(t, o + 1, u);
    }
    function xt(t, e, n) {
        for (var i = [], u = 0; n.length > u; u++) {
            var s = n[u], a = r(s);
            o(s) || (a = a.map(function(t) {
                return H(t);
            })), i.push(a);
        }
        return jt(t, e, i);
    }
    function kt(t, e, r) {
        return t && t.mergeDeep && o(e) ? t.mergeDeep(e) : X(t, e) ? t : e;
    }
    function At(t) {
        return function(e, r, n) {
            if (e && e.mergeDeepWith && o(r)) return e.mergeDeepWith(t, r);
            var i = t(e, r, n);
            return X(e, i) ? e : i;
        };
    }
    function jt(t, e, r) {
        return r = r.filter(function(t) {
            return 0 !== t.size;
        }), 0 === r.length ? t : 0 !== t.size || t.__ownerID || 1 !== r.length ? t.withMutations(function(t) {
            for (var n = e ? function(r, n) {
                t.update(n, yr, function(t) {
                    return t === yr ? r : e(t, r, n);
                });
            } : function(e, r) {
                t.set(r, e);
            }, i = 0; r.length > i; i++) r[i].forEach(n);
        }) : t.constructor(r[0]);
    }
    function Rt(t, e, r, n) {
        var i = t === yr, o = e.next();
        if (o.done) {
            var u = i ? r : t, s = n(u);
            return s === u ? t : s;
        }
        Z(i || t && t.set, "invalid keyPath");
        var a = o.value, h = i ? yr : t.get(a, yr), f = Rt(h, e, r, n);
        return f === h ? t : f === yr ? t.remove(a) : (i ? zt() : t).set(a, f);
    }
    function Ut(t) {
        return t -= t >> 1 & 1431655765, t = (858993459 & t) + (t >> 2 & 858993459), t = t + (t >> 4) & 252645135, 
        t += t >> 8, t += t >> 16, 127 & t;
    }
    function Kt(t, e, r, n) {
        var i = n ? t : p(t);
        return i[e] = r, i;
    }
    function Lt(t, e, r, n) {
        var i = t.length + 1;
        if (n && e + 1 === i) return t[e] = r, t;
        for (var o = Array(i), u = 0, s = 0; i > s; s++) s === e ? (o[s] = r, u = -1) : o[s] = t[s + u];
        return o;
    }
    function Tt(t, e, r) {
        var n = t.length - 1;
        if (r && e === n) return t.pop(), t;
        for (var i = Array(n), o = 0, u = 0; n > u; u++) u === e && (o = 1), i[u] = t[u + o];
        return i;
    }
    function Bt(t) {
        var e = Pt();
        if (null === t || void 0 === t) return e;
        if (Wt(t)) return t;
        var r = n(t), i = r.size;
        return 0 === i ? e : (ft(i), i > 0 && vr > i ? Nt(0, i, pr, null, new Ct(r.toArray())) : e.withMutations(function(t) {
            t.setSize(i), r.forEach(function(e, r) {
                return t.set(r, e);
            });
        }));
    }
    function Wt(t) {
        return !(!t || !t[Vr]);
    }
    function Ct(t, e) {
        this.array = t, this.ownerID = e;
    }
    function Jt(t, e) {
        function r(t, e, r) {
            return 0 === e ? n(t, r) : i(t, e, r);
        }
        function n(t, r) {
            var n = r === s ? a && a.array : t && t.array, i = r > o ? 0 : o - r, h = u - r;
            return h > vr && (h = vr), function() {
                if (i === h) return Xr;
                var t = e ? --h : i++;
                return n && n[t];
            };
        }
        function i(t, n, i) {
            var s, a = t && t.array, h = i > o ? 0 : o - i >> n, f = (u - i >> n) + 1;
            return f > vr && (f = vr), function() {
                for (;;) {
                    if (s) {
                        var t = s();
                        if (t !== Xr) return t;
                        s = null;
                    }
                    if (h === f) return Xr;
                    var o = e ? --f : h++;
                    s = r(a && a[o], n - pr, i + (o << n));
                }
            };
        }
        var o = t._origin, u = t._capacity, s = Gt(u), a = t._tail;
        return r(t._root, t._level, 0);
    }
    function Nt(t, e, r, n, i, o, u) {
        var s = Object.create(Yr);
        return s.size = e - t, s._origin = t, s._capacity = e, s._level = r, s._root = n, 
        s._tail = i, s.__ownerID = o, s.__hash = u, s.__altered = !1, s;
    }
    function Pt() {
        return Qr || (Qr = Nt(0, 0, pr));
    }
    function Ht(t, e, r) {
        if (e = l(t, e), e !== e) return t;
        if (e >= t.size || 0 > e) return t.withMutations(function(t) {
            0 > e ? Xt(t, e).set(0, r) : Xt(t, 0, e + 1).set(e, r);
        });
        e += t._origin;
        var n = t._tail, i = t._root, o = f(mr);
        return e >= Gt(t._capacity) ? n = Vt(n, t.__ownerID, 0, e, r, o) : i = Vt(i, t.__ownerID, t._level, e, r, o), 
        o.value ? t.__ownerID ? (t._root = i, t._tail = n, t.__hash = void 0, t.__altered = !0, 
        t) : Nt(t._origin, t._capacity, t._level, i, n) : t;
    }
    function Vt(t, e, r, n, i, o) {
        var u = n >>> r & lr, s = t && t.array.length > u;
        if (!s && void 0 === i) return t;
        var a;
        if (r > 0) {
            var h = t && t.array[u], f = Vt(h, e, r - pr, n, i, o);
            return f === h ? t : (a = Yt(t, e), a.array[u] = f, a);
        }
        return s && t.array[u] === i ? t : (c(o), a = Yt(t, e), void 0 === i && u === a.array.length - 1 ? a.array.pop() : a.array[u] = i, 
        a);
    }
    function Yt(t, e) {
        return e && t && e === t.ownerID ? t : new Ct(t ? t.array.slice() : [], e);
    }
    function Qt(t, e) {
        if (e >= Gt(t._capacity)) return t._tail;
        if (1 << t._level + pr > e) {
            for (var r = t._root, n = t._level; r && n > 0; ) r = r.array[e >>> n & lr], n -= pr;
            return r;
        }
    }
    function Xt(t, e, r) {
        void 0 !== e && (e = 0 | e), void 0 !== r && (r = 0 | r);
        var n = t.__ownerID || new _(), i = t._origin, o = t._capacity, u = i + e, s = void 0 === r ? o : 0 > r ? o + r : i + r;
        if (u === i && s === o) return t;
        if (u >= s) return t.clear();
        for (var a = t._level, h = t._root, f = 0; 0 > u + f; ) h = new Ct(h && h.array.length ? [ void 0, h ] : [], n), 
        a += pr, f += 1 << a;
        f && (u += f, i += f, s += f, o += f);
        for (var c = Gt(o), p = Gt(s); p >= 1 << a + pr; ) h = new Ct(h && h.array.length ? [ h ] : [], n), 
        a += pr;
        var v = t._tail, l = c > p ? Qt(t, s - 1) : p > c ? new Ct([], n) : v;
        if (v && p > c && o > u && v.array.length) {
            h = Yt(h, n);
            for (var y = h, d = a; d > pr; d -= pr) {
                var m = c >>> d & lr;
                y = y.array[m] = Yt(y.array[m], n);
            }
            y.array[c >>> pr & lr] = v;
        }
        if (o > s && (l = l && l.removeAfter(n, 0, s)), u >= p) u -= p, s -= p, a = pr, 
        h = null, l = l && l.removeBefore(n, 0, u); else if (u > i || c > p) {
            for (f = 0; h; ) {
                var g = u >>> a & lr;
                if (g !== p >>> a & lr) break;
                g && (f += (1 << a) * g), a -= pr, h = h.array[g];
            }
            h && u > i && (h = h.removeBefore(n, a, u - f)), h && c > p && (h = h.removeAfter(n, a, p - f)), 
            f && (u -= f, s -= f);
        }
        return t.__ownerID ? (t.size = s - u, t._origin = u, t._capacity = s, t._level = a, 
        t._root = h, t._tail = l, t.__hash = void 0, t.__altered = !0, t) : Nt(u, s, a, h, l);
    }
    function Ft(t, e, r) {
        for (var i = [], u = 0, s = 0; r.length > s; s++) {
            var a = r[s], h = n(a);
            h.size > u && (u = h.size), o(a) || (h = h.map(function(t) {
                return H(t);
            })), i.push(h);
        }
        return u > t.size && (t = t.setSize(u)), jt(t, e, i);
    }
    function Gt(t) {
        return vr > t ? 0 : t - 1 >>> pr << pr;
    }
    function Zt(t) {
        return null === t || void 0 === t ? ee() : $t(t) ? t : ee().withMutations(function(e) {
            var n = r(t);
            ft(n.size), n.forEach(function(t, r) {
                return e.set(r, t);
            });
        });
    }
    function $t(t) {
        return _t(t) && h(t);
    }
    function te(t, e, r, n) {
        var i = Object.create(Zt.prototype);
        return i.size = t ? t.size : 0, i._map = t, i._list = e, i.__ownerID = r, i.__hash = n, 
        i;
    }
    function ee() {
        return Fr || (Fr = te(zt(), Pt()));
    }
    function re(t, e, r) {
        var n, i, o = t._map, u = t._list, s = o.get(e), a = void 0 !== s;
        if (r === yr) {
            if (!a) return t;
            u.size >= vr && u.size >= 2 * o.size ? (i = u.filter(function(t, e) {
                return void 0 !== t && s !== e;
            }), n = i.toKeyedSeq().map(function(t) {
                return t[0];
            }).flip().toMap(), t.__ownerID && (n.__ownerID = i.__ownerID = t.__ownerID)) : (n = o.remove(e), 
            i = s === u.size - 1 ? u.pop() : u.set(s, void 0));
        } else if (a) {
            if (r === u.get(s)[1]) return t;
            n = o, i = u.set(s, [ e, r ]);
        } else n = o.set(e, u.size), i = u.set(u.size, [ e, r ]);
        return t.__ownerID ? (t.size = n.size, t._map = n, t._list = i, t.__hash = void 0, 
        t) : te(n, i);
    }
    function ne(t, e) {
        this._iter = t, this._useKeys = e, this.size = t.size;
    }
    function ie(t) {
        this._iter = t, this.size = t.size;
    }
    function oe(t) {
        this._iter = t, this.size = t.size;
    }
    function ue(t) {
        this._iter = t, this.size = t.size;
    }
    function se(t) {
        var e = Ee(t);
        return e._iter = t, e.size = t.size, e.flip = function() {
            return t;
        }, e.reverse = function() {
            var e = t.reverse.apply(this);
            return e.flip = function() {
                return t.reverse();
            }, e;
        }, e.has = function(e) {
            return t.includes(e);
        }, e.includes = function(e) {
            return t.has(e);
        }, e.cacheResult = Oe, e.__iterateUncached = function(e, r) {
            var n = this;
            return t.__iterate(function(t, r) {
                return e(r, t, n) !== !1;
            }, r);
        }, e.__iteratorUncached = function(e, r) {
            if (e === Sr) {
                var n = t.__iterator(e, r);
                return new S(function() {
                    var t = n.next();
                    if (!t.done) {
                        var e = t.value[0];
                        t.value[0] = t.value[1], t.value[1] = e;
                    }
                    return t;
                });
            }
            return t.__iterator(e === wr ? gr : wr, r);
        }, e;
    }
    function ae(t, e, r) {
        var n = Ee(t);
        return n.size = t.size, n.has = function(e) {
            return t.has(e);
        }, n.get = function(n, i) {
            var o = t.get(n, yr);
            return o === yr ? i : e.call(r, o, n, t);
        }, n.__iterateUncached = function(n, i) {
            var o = this;
            return t.__iterate(function(t, i, u) {
                return n(e.call(r, t, i, u), i, o) !== !1;
            }, i);
        }, n.__iteratorUncached = function(n, i) {
            var o = t.__iterator(Sr, i);
            return new S(function() {
                var i = o.next();
                if (i.done) return i;
                var u = i.value, s = u[0];
                return z(n, s, e.call(r, u[1], s, t), i);
            });
        }, n;
    }
    function he(t, e) {
        var r = Ee(t);
        return r._iter = t, r.size = t.size, r.reverse = function() {
            return t;
        }, t.flip && (r.flip = function() {
            var e = se(t);
            return e.reverse = function() {
                return t.flip();
            }, e;
        }), r.get = function(r, n) {
            return t.get(e ? r : -1 - r, n);
        }, r.has = function(r) {
            return t.has(e ? r : -1 - r);
        }, r.includes = function(e) {
            return t.includes(e);
        }, r.cacheResult = Oe, r.__iterate = function(e, r) {
            var n = this;
            return t.__iterate(function(t, r) {
                return e(t, r, n);
            }, !r);
        }, r.__iterator = function(e, r) {
            return t.__iterator(e, !r);
        }, r;
    }
    function fe(t, e, r, n) {
        var i = Ee(t);
        return n && (i.has = function(n) {
            var i = t.get(n, yr);
            return i !== yr && !!e.call(r, i, n, t);
        }, i.get = function(n, i) {
            var o = t.get(n, yr);
            return o !== yr && e.call(r, o, n, t) ? o : i;
        }), i.__iterateUncached = function(i, o) {
            var u = this, s = 0;
            return t.__iterate(function(t, o, a) {
                return e.call(r, t, o, a) ? (s++, i(t, n ? o : s - 1, u)) : void 0;
            }, o), s;
        }, i.__iteratorUncached = function(i, o) {
            var u = t.__iterator(Sr, o), s = 0;
            return new S(function() {
                for (;;) {
                    var o = u.next();
                    if (o.done) return o;
                    var a = o.value, h = a[0], f = a[1];
                    if (e.call(r, f, h, t)) return z(i, n ? h : s++, f, o);
                }
            });
        }, i;
    }
    function ce(t, e, r) {
        var n = ct().asMutable();
        return t.__iterate(function(i, o) {
            n.update(e.call(r, i, o, t), 0, function(t) {
                return t + 1;
            });
        }), n.asImmutable();
    }
    function _e(t, e, r) {
        var n = u(t), i = (h(t) ? Zt() : ct()).asMutable();
        t.__iterate(function(o, u) {
            i.update(e.call(r, o, u, t), function(t) {
                return t = t || [], t.push(n ? [ u, o ] : o), t;
            });
        });
        var o = Me(t);
        return i.map(function(e) {
            return be(t, o(e));
        });
    }
    function pe(t, e, r, n) {
        var i = t.size;
        if (void 0 !== e && (e = 0 | e), void 0 !== r && (r = r === 1 / 0 ? i : 0 | r), 
        d(e, r, i)) return t;
        var o = m(e, i), u = g(r, i);
        if (o !== o || u !== u) return pe(t.toSeq().cacheResult(), e, r, n);
        var s, a = u - o;
        a === a && (s = 0 > a ? 0 : a);
        var h = Ee(t);
        return h.size = 0 === s ? s : t.size && s || void 0, !n && L(t) && s >= 0 && (h.get = function(e, r) {
            return e = l(this, e), e >= 0 && s > e ? t.get(e + o, r) : r;
        }), h.__iterateUncached = function(e, r) {
            var i = this;
            if (0 === s) return 0;
            if (r) return this.cacheResult().__iterate(e, r);
            var u = 0, a = !0, h = 0;
            return t.__iterate(function(t, r) {
                return a && (a = u++ < o) ? void 0 : (h++, e(t, n ? r : h - 1, i) !== !1 && h !== s);
            }), h;
        }, h.__iteratorUncached = function(e, r) {
            if (0 !== s && r) return this.cacheResult().__iterator(e, r);
            var i = 0 !== s && t.__iterator(e, r), u = 0, a = 0;
            return new S(function() {
                for (;u++ < o; ) i.next();
                if (++a > s) return I();
                var t = i.next();
                return n || e === wr ? t : e === gr ? z(e, a - 1, void 0, t) : z(e, a - 1, t.value[1], t);
            });
        }, h;
    }
    function ve(t, e, r) {
        var n = Ee(t);
        return n.__iterateUncached = function(n, i) {
            var o = this;
            if (i) return this.cacheResult().__iterate(n, i);
            var u = 0;
            return t.__iterate(function(t, i, s) {
                return e.call(r, t, i, s) && ++u && n(t, i, o);
            }), u;
        }, n.__iteratorUncached = function(n, i) {
            var o = this;
            if (i) return this.cacheResult().__iterator(n, i);
            var u = t.__iterator(Sr, i), s = !0;
            return new S(function() {
                if (!s) return I();
                var t = u.next();
                if (t.done) return t;
                var i = t.value, a = i[0], h = i[1];
                return e.call(r, h, a, o) ? n === Sr ? t : z(n, a, h, t) : (s = !1, I());
            });
        }, n;
    }
    function le(t, e, r, n) {
        var i = Ee(t);
        return i.__iterateUncached = function(i, o) {
            var u = this;
            if (o) return this.cacheResult().__iterate(i, o);
            var s = !0, a = 0;
            return t.__iterate(function(t, o, h) {
                return s && (s = e.call(r, t, o, h)) ? void 0 : (a++, i(t, n ? o : a - 1, u));
            }), a;
        }, i.__iteratorUncached = function(i, o) {
            var u = this;
            if (o) return this.cacheResult().__iterator(i, o);
            var s = t.__iterator(Sr, o), a = !0, h = 0;
            return new S(function() {
                var t, o, f;
                do {
                    if (t = s.next(), t.done) return n || i === wr ? t : i === gr ? z(i, h++, void 0, t) : z(i, h++, t.value[1], t);
                    var c = t.value;
                    o = c[0], f = c[1], a && (a = e.call(r, f, o, u));
                } while (a);
                return i === Sr ? t : z(i, o, f, t);
            });
        }, i;
    }
    function ye(t, e) {
        var n = u(t), i = [ t ].concat(e).map(function(t) {
            return o(t) ? n && (t = r(t)) : t = n ? B(t) : W(Array.isArray(t) ? t : [ t ]), 
            t;
        }).filter(function(t) {
            return 0 !== t.size;
        });
        if (0 === i.length) return t;
        if (1 === i.length) {
            var a = i[0];
            if (a === t || n && u(a) || s(t) && s(a)) return a;
        }
        var h = new j(i);
        return n ? h = h.toKeyedSeq() : s(t) || (h = h.toSetSeq()), h = h.flatten(!0), h.size = i.reduce(function(t, e) {
            if (void 0 !== t) {
                var r = e.size;
                if (void 0 !== r) return t + r;
            }
        }, 0), h;
    }
    function de(t, e, r) {
        var n = Ee(t);
        return n.__iterateUncached = function(n, i) {
            function u(t, h) {
                var f = this;
                t.__iterate(function(t, i) {
                    return (!e || e > h) && o(t) ? u(t, h + 1) : n(t, r ? i : s++, f) === !1 && (a = !0), 
                    !a;
                }, i);
            }
            var s = 0, a = !1;
            return u(t, 0), s;
        }, n.__iteratorUncached = function(n, i) {
            var u = t.__iterator(n, i), s = [], a = 0;
            return new S(function() {
                for (;u; ) {
                    var t = u.next();
                    if (t.done === !1) {
                        var h = t.value;
                        if (n === Sr && (h = h[1]), e && !(e > s.length) || !o(h)) return r ? t : z(n, a++, h, t);
                        s.push(u), u = h.__iterator(n, i);
                    } else u = s.pop();
                }
                return I();
            });
        }, n;
    }
    function me(t, e, r) {
        var n = Me(t);
        return t.toSeq().map(function(i, o) {
            return n(e.call(r, i, o, t));
        }).flatten(!0);
    }
    function ge(t, e) {
        var r = Ee(t);
        return r.size = t.size && 2 * t.size - 1, r.__iterateUncached = function(r, n) {
            var i = this, o = 0;
            return t.__iterate(function(t, n) {
                return (!o || r(e, o++, i) !== !1) && r(t, o++, i) !== !1;
            }, n), o;
        }, r.__iteratorUncached = function(r, n) {
            var i, o = t.__iterator(wr, n), u = 0;
            return new S(function() {
                return (!i || u % 2) && (i = o.next(), i.done) ? i : u % 2 ? z(r, u++, e) : z(r, u++, i.value, i);
            });
        }, r;
    }
    function we(t, e, r) {
        e || (e = xe);
        var n = u(t), i = 0, o = t.toSeq().map(function(e, n) {
            return [ n, e, i++, r ? r(e, n, t) : e ];
        }).toArray();
        return o.sort(function(t, r) {
            return e(t[3], r[3]) || t[2] - r[2];
        }).forEach(n ? function(t, e) {
            o[e].length = 2;
        } : function(t, e) {
            o[e] = t[1];
        }), n ? x(o) : s(t) ? k(o) : A(o);
    }
    function Se(t, e, r) {
        if (e || (e = xe), r) {
            var n = t.toSeq().map(function(e, n) {
                return [ e, r(e, n, t) ];
            }).reduce(function(t, r) {
                return ze(e, t[1], r[1]) ? r : t;
            });
            return n && n[0];
        }
        return t.reduce(function(t, r) {
            return ze(e, t, r) ? r : t;
        });
    }
    function ze(t, e, r) {
        var n = t(r, e);
        return 0 === n && r !== e && (void 0 === r || null === r || r !== r) || n > 0;
    }
    function Ie(t, r, n) {
        var i = Ee(t);
        return i.size = new j(n).map(function(t) {
            return t.size;
        }).min(), i.__iterate = function(t, e) {
            for (var r, n = this.__iterator(wr, e), i = 0; !(r = n.next()).done && t(r.value, i++, this) !== !1; ) ;
            return i;
        }, i.__iteratorUncached = function(t, i) {
            var o = n.map(function(t) {
                return t = e(t), D(i ? t.reverse() : t);
            }), u = 0, s = !1;
            return new S(function() {
                var e;
                return s || (e = o.map(function(t) {
                    return t.next();
                }), s = e.some(function(t) {
                    return t.done;
                })), s ? I() : z(t, u++, r.apply(null, e.map(function(t) {
                    return t.value;
                })));
            });
        }, i;
    }
    function be(t, e) {
        return L(t) ? e : t.constructor(e);
    }
    function qe(t) {
        if (t !== Object(t)) throw new TypeError("Expected [K, V] tuple: " + t);
    }
    function De(t) {
        return ft(t.size), v(t);
    }
    function Me(t) {
        return u(t) ? r : s(t) ? n : i;
    }
    function Ee(t) {
        return Object.create((u(t) ? x : s(t) ? k : A).prototype);
    }
    function Oe() {
        return this._iter.cacheResult ? (this._iter.cacheResult(), this.size = this._iter.size, 
        this) : O.prototype.cacheResult.call(this);
    }
    function xe(t, e) {
        return t > e ? 1 : e > t ? -1 : 0;
    }
    function ke(t) {
        var r = D(t);
        if (!r) {
            if (!E(t)) throw new TypeError("Expected iterable or array-like: " + t);
            r = D(e(t));
        }
        return r;
    }
    function Ae(t, e) {
        var r, n = function(o) {
            if (o instanceof n) return o;
            if (!(this instanceof n)) return new n(o);
            if (!r) {
                r = !0;
                var u = Object.keys(t);
                Ue(i, u), i.size = u.length, i._name = e, i._keys = u, i._defaultValues = t;
            }
            this._map = ct(o);
        }, i = n.prototype = Object.create(Gr);
        return i.constructor = n, n;
    }
    function je(t, e, r) {
        var n = Object.create(Object.getPrototypeOf(t));
        return n._map = e, n.__ownerID = r, n;
    }
    function Re(t) {
        return t._name || t.constructor.name || "Record";
    }
    function Ue(t, e) {
        try {
            e.forEach(Ke.bind(void 0, t));
        } catch (r) {}
    }
    function Ke(t, e) {
        Object.defineProperty(t, e, {
            get: function() {
                return this.get(e);
            },
            set: function(t) {
                Z(this.__ownerID, "Cannot set on an immutable record."), this.set(e, t);
            }
        });
    }
    function Le(t) {
        return null === t || void 0 === t ? Ce() : Te(t) && !h(t) ? t : Ce().withMutations(function(e) {
            var r = i(t);
            ft(r.size), r.forEach(function(t) {
                return e.add(t);
            });
        });
    }
    function Te(t) {
        return !(!t || !t[Zr]);
    }
    function Be(t, e) {
        return t.__ownerID ? (t.size = e.size, t._map = e, t) : e === t._map ? t : 0 === e.size ? t.__empty() : t.__make(e);
    }
    function We(t, e) {
        var r = Object.create($r);
        return r.size = t ? t.size : 0, r._map = t, r.__ownerID = e, r;
    }
    function Ce() {
        return tn || (tn = We(zt()));
    }
    function Je(t) {
        return null === t || void 0 === t ? He() : Ne(t) ? t : He().withMutations(function(e) {
            var r = i(t);
            ft(r.size), r.forEach(function(t) {
                return e.add(t);
            });
        });
    }
    function Ne(t) {
        return Te(t) && h(t);
    }
    function Pe(t, e) {
        var r = Object.create(en);
        return r.size = t ? t.size : 0, r._map = t, r.__ownerID = e, r;
    }
    function He() {
        return rn || (rn = Pe(ee()));
    }
    function Ve(t) {
        return null === t || void 0 === t ? Xe() : Ye(t) ? t : Xe().unshiftAll(t);
    }
    function Ye(t) {
        return !(!t || !t[nn]);
    }
    function Qe(t, e, r, n) {
        var i = Object.create(on);
        return i.size = t, i._head = e, i.__ownerID = r, i.__hash = n, i.__altered = !1, 
        i;
    }
    function Xe() {
        return un || (un = Qe(0));
    }
    function Fe(t, e) {
        var r = function(r) {
            t.prototype[r] = e[r];
        };
        return Object.keys(e).forEach(r), Object.getOwnPropertySymbols && Object.getOwnPropertySymbols(e).forEach(r), 
        t;
    }
    function Ge(t, e) {
        return e;
    }
    function Ze(t, e) {
        return [ e, t ];
    }
    function $e(t) {
        return function() {
            return !t.apply(this, arguments);
        };
    }
    function tr(t) {
        return function() {
            return -t.apply(this, arguments);
        };
    }
    function er(t) {
        return "string" == typeof t ? JSON.stringify(t) : t + "";
    }
    function rr() {
        return p(arguments);
    }
    function nr(t, e) {
        return e > t ? 1 : t > e ? -1 : 0;
    }
    function ir(t) {
        if (t.size === 1 / 0) return 0;
        var e = h(t), r = u(t), n = e ? 1 : 0, i = t.__iterate(r ? e ? function(t, e) {
            n = 31 * n + ur(ot(t), ot(e)) | 0;
        } : function(t, e) {
            n = n + ur(ot(t), ot(e)) | 0;
        } : e ? function(t) {
            n = 31 * n + ot(t) | 0;
        } : function(t) {
            n = n + ot(t) | 0;
        });
        return or(i, n);
    }
    function or(t, e) {
        return e = xr(e, 3432918353), e = xr(e << 15 | e >>> -15, 461845907), e = xr(e << 13 | e >>> -13, 5), 
        e = (e + 3864292196 | 0) ^ t, e = xr(e ^ e >>> 16, 2246822507), e = xr(e ^ e >>> 13, 3266489909), 
        e = it(e ^ e >>> 16);
    }
    function ur(t, e) {
        return t ^ e + 2654435769 + (t << 6) + (t >> 2) | 0;
    }
    var sr = Array.prototype.slice;
    t(r, e), t(n, e), t(i, e), e.isIterable = o, e.isKeyed = u, e.isIndexed = s, e.isAssociative = a, 
    e.isOrdered = h, e.Keyed = r, e.Indexed = n, e.Set = i;
    var ar = "@@__IMMUTABLE_ITERABLE__@@", hr = "@@__IMMUTABLE_KEYED__@@", fr = "@@__IMMUTABLE_INDEXED__@@", cr = "@@__IMMUTABLE_ORDERED__@@", _r = "delete", pr = 5, vr = 1 << pr, lr = vr - 1, yr = {}, dr = {
        value: !1
    }, mr = {
        value: !1
    }, gr = 0, wr = 1, Sr = 2, zr = "function" == typeof Symbol && Symbol.iterator, Ir = "@@iterator", br = zr || Ir;
    S.prototype.toString = function() {
        return "[Iterator]";
    }, S.KEYS = gr, S.VALUES = wr, S.ENTRIES = Sr, S.prototype.inspect = S.prototype.toSource = function() {
        return "" + this;
    }, S.prototype[br] = function() {
        return this;
    }, t(O, e), O.of = function() {
        return O(arguments);
    }, O.prototype.toSeq = function() {
        return this;
    }, O.prototype.toString = function() {
        return this.__toString("Seq {", "}");
    }, O.prototype.cacheResult = function() {
        return !this._cache && this.__iterateUncached && (this._cache = this.entrySeq().toArray(), 
        this.size = this._cache.length), this;
    }, O.prototype.__iterate = function(t, e) {
        return N(this, t, e, !0);
    }, O.prototype.__iterator = function(t, e) {
        return P(this, t, e, !0);
    }, t(x, O), x.prototype.toKeyedSeq = function() {
        return this;
    }, t(k, O), k.of = function() {
        return k(arguments);
    }, k.prototype.toIndexedSeq = function() {
        return this;
    }, k.prototype.toString = function() {
        return this.__toString("Seq [", "]");
    }, k.prototype.__iterate = function(t, e) {
        return N(this, t, e, !1);
    }, k.prototype.__iterator = function(t, e) {
        return P(this, t, e, !1);
    }, t(A, O), A.of = function() {
        return A(arguments);
    }, A.prototype.toSetSeq = function() {
        return this;
    }, O.isSeq = L, O.Keyed = x, O.Set = A, O.Indexed = k;
    var qr = "@@__IMMUTABLE_SEQ__@@";
    O.prototype[qr] = !0, t(j, k), j.prototype.get = function(t, e) {
        return this.has(t) ? this._array[l(this, t)] : e;
    }, j.prototype.__iterate = function(t, e) {
        for (var r = this._array, n = r.length - 1, i = 0; n >= i; i++) if (t(r[e ? n - i : i], i, this) === !1) return i + 1;
        return i;
    }, j.prototype.__iterator = function(t, e) {
        var r = this._array, n = r.length - 1, i = 0;
        return new S(function() {
            return i > n ? I() : z(t, i, r[e ? n - i++ : i++]);
        });
    }, t(R, x), R.prototype.get = function(t, e) {
        return void 0 === e || this.has(t) ? this._object[t] : e;
    }, R.prototype.has = function(t) {
        return this._object.hasOwnProperty(t);
    }, R.prototype.__iterate = function(t, e) {
        for (var r = this._object, n = this._keys, i = n.length - 1, o = 0; i >= o; o++) {
            var u = n[e ? i - o : o];
            if (t(r[u], u, this) === !1) return o + 1;
        }
        return o;
    }, R.prototype.__iterator = function(t, e) {
        var r = this._object, n = this._keys, i = n.length - 1, o = 0;
        return new S(function() {
            var u = n[e ? i - o : o];
            return o++ > i ? I() : z(t, u, r[u]);
        });
    }, R.prototype[cr] = !0, t(U, k), U.prototype.__iterateUncached = function(t, e) {
        if (e) return this.cacheResult().__iterate(t, e);
        var r = this._iterable, n = D(r), i = 0;
        if (q(n)) for (var o; !(o = n.next()).done && t(o.value, i++, this) !== !1; ) ;
        return i;
    }, U.prototype.__iteratorUncached = function(t, e) {
        if (e) return this.cacheResult().__iterator(t, e);
        var r = this._iterable, n = D(r);
        if (!q(n)) return new S(I);
        var i = 0;
        return new S(function() {
            var e = n.next();
            return e.done ? e : z(t, i++, e.value);
        });
    }, t(K, k), K.prototype.__iterateUncached = function(t, e) {
        if (e) return this.cacheResult().__iterate(t, e);
        for (var r = this._iterator, n = this._iteratorCache, i = 0; n.length > i; ) if (t(n[i], i++, this) === !1) return i;
        for (var o; !(o = r.next()).done; ) {
            var u = o.value;
            if (n[i] = u, t(u, i++, this) === !1) break;
        }
        return i;
    }, K.prototype.__iteratorUncached = function(t, e) {
        if (e) return this.cacheResult().__iterator(t, e);
        var r = this._iterator, n = this._iteratorCache, i = 0;
        return new S(function() {
            if (i >= n.length) {
                var e = r.next();
                if (e.done) return e;
                n[i] = e.value;
            }
            return z(t, i, n[i++]);
        });
    };
    var Dr;
    t(G, k), G.prototype.toString = function() {
        return 0 === this.size ? "Repeat []" : "Repeat [ " + this._value + " " + this.size + " times ]";
    }, G.prototype.get = function(t, e) {
        return this.has(t) ? this._value : e;
    }, G.prototype.includes = function(t) {
        return X(this._value, t);
    }, G.prototype.slice = function(t, e) {
        var r = this.size;
        return d(t, e, r) ? this : new G(this._value, g(e, r) - m(t, r));
    }, G.prototype.reverse = function() {
        return this;
    }, G.prototype.indexOf = function(t) {
        return X(this._value, t) ? 0 : -1;
    }, G.prototype.lastIndexOf = function(t) {
        return X(this._value, t) ? this.size : -1;
    }, G.prototype.__iterate = function(t, e) {
        for (var r = 0; this.size > r; r++) if (t(this._value, r, this) === !1) return r + 1;
        return r;
    }, G.prototype.__iterator = function(t, e) {
        var r = this, n = 0;
        return new S(function() {
            return r.size > n ? z(t, n++, r._value) : I();
        });
    }, G.prototype.equals = function(t) {
        return t instanceof G ? X(this._value, t._value) : F(t);
    };
    var Mr;
    t($, k), $.prototype.toString = function() {
        return 0 === this.size ? "Range []" : "Range [ " + this._start + "..." + this._end + (1 !== this._step ? " by " + this._step : "") + " ]";
    }, $.prototype.get = function(t, e) {
        return this.has(t) ? this._start + l(this, t) * this._step : e;
    }, $.prototype.includes = function(t) {
        var e = (t - this._start) / this._step;
        return e >= 0 && this.size > e && e === Math.floor(e);
    }, $.prototype.slice = function(t, e) {
        return d(t, e, this.size) ? this : (t = m(t, this.size), e = g(e, this.size), t >= e ? new $(0, 0) : new $(this.get(t, this._end), this.get(e, this._end), this._step));
    }, $.prototype.indexOf = function(t) {
        var e = t - this._start;
        if (e % this._step === 0) {
            var r = e / this._step;
            if (r >= 0 && this.size > r) return r;
        }
        return -1;
    }, $.prototype.lastIndexOf = function(t) {
        return this.indexOf(t);
    }, $.prototype.__iterate = function(t, e) {
        for (var r = this.size - 1, n = this._step, i = e ? this._start + r * n : this._start, o = 0; r >= o; o++) {
            if (t(i, o, this) === !1) return o + 1;
            i += e ? -n : n;
        }
        return o;
    }, $.prototype.__iterator = function(t, e) {
        var r = this.size - 1, n = this._step, i = e ? this._start + r * n : this._start, o = 0;
        return new S(function() {
            var u = i;
            return i += e ? -n : n, o > r ? I() : z(t, o++, u);
        });
    }, $.prototype.equals = function(t) {
        return t instanceof $ ? this._start === t._start && this._end === t._end && this._step === t._step : F(this, t);
    };
    var Er;
    t(tt, e), t(et, tt), t(rt, tt), t(nt, tt), tt.Keyed = et, tt.Indexed = rt, tt.Set = nt;
    var Or, xr = "function" == typeof Math.imul && -2 === Math.imul(4294967295, 2) ? Math.imul : function(t, e) {
        t = 0 | t, e = 0 | e;
        var r = 65535 & t, n = 65535 & e;
        return r * n + ((t >>> 16) * n + r * (e >>> 16) << 16 >>> 0) | 0;
    }, kr = Object.isExtensible, Ar = function() {
        try {
            return Object.defineProperty({}, "@", {}), !0;
        } catch (t) {
            return !1;
        }
    }(), jr = "function" == typeof WeakMap;
    jr && (Or = new WeakMap());
    var Rr = 0, Ur = "__immutablehash__";
    "function" == typeof Symbol && (Ur = Symbol(Ur));
    var Kr = 16, Lr = 255, Tr = 0, Br = {};
    t(ct, et), ct.of = function() {
        var t = sr.call(arguments, 0);
        return zt().withMutations(function(e) {
            for (var r = 0; t.length > r; r += 2) {
                if (r + 1 >= t.length) throw Error("Missing value for key: " + t[r]);
                e.set(t[r], t[r + 1]);
            }
        });
    }, ct.prototype.toString = function() {
        return this.__toString("Map {", "}");
    }, ct.prototype.get = function(t, e) {
        return this._root ? this._root.get(0, void 0, t, e) : e;
    }, ct.prototype.set = function(t, e) {
        return It(this, t, e);
    }, ct.prototype.setIn = function(t, e) {
        return this.updateIn(t, yr, function() {
            return e;
        });
    }, ct.prototype.remove = function(t) {
        return It(this, t, yr);
    }, ct.prototype.deleteIn = function(t) {
        return this.updateIn(t, function() {
            return yr;
        });
    }, ct.prototype.update = function(t, e, r) {
        return 1 === arguments.length ? t(this) : this.updateIn([ t ], e, r);
    }, ct.prototype.updateIn = function(t, e, r) {
        r || (r = e, e = void 0);
        var n = Rt(this, ke(t), e, r);
        return n === yr ? void 0 : n;
    }, ct.prototype.clear = function() {
        return 0 === this.size ? this : this.__ownerID ? (this.size = 0, this._root = null, 
        this.__hash = void 0, this.__altered = !0, this) : zt();
    }, ct.prototype.merge = function() {
        return xt(this, void 0, arguments);
    }, ct.prototype.mergeWith = function(t) {
        var e = sr.call(arguments, 1);
        return xt(this, t, e);
    }, ct.prototype.mergeIn = function(t) {
        var e = sr.call(arguments, 1);
        return this.updateIn(t, zt(), function(t) {
            return "function" == typeof t.merge ? t.merge.apply(t, e) : e[e.length - 1];
        });
    }, ct.prototype.mergeDeep = function() {
        return xt(this, kt, arguments);
    }, ct.prototype.mergeDeepWith = function(t) {
        var e = sr.call(arguments, 1);
        return xt(this, At(t), e);
    }, ct.prototype.mergeDeepIn = function(t) {
        var e = sr.call(arguments, 1);
        return this.updateIn(t, zt(), function(t) {
            return "function" == typeof t.mergeDeep ? t.mergeDeep.apply(t, e) : e[e.length - 1];
        });
    }, ct.prototype.sort = function(t) {
        return Zt(we(this, t));
    }, ct.prototype.sortBy = function(t, e) {
        return Zt(we(this, e, t));
    }, ct.prototype.withMutations = function(t) {
        var e = this.asMutable();
        return t(e), e.wasAltered() ? e.__ensureOwner(this.__ownerID) : this;
    }, ct.prototype.asMutable = function() {
        return this.__ownerID ? this : this.__ensureOwner(new _());
    }, ct.prototype.asImmutable = function() {
        return this.__ensureOwner();
    }, ct.prototype.wasAltered = function() {
        return this.__altered;
    }, ct.prototype.__iterator = function(t, e) {
        return new mt(this, t, e);
    }, ct.prototype.__iterate = function(t, e) {
        var r = this, n = 0;
        return this._root && this._root.iterate(function(e) {
            return n++, t(e[1], e[0], r);
        }, e), n;
    }, ct.prototype.__ensureOwner = function(t) {
        return t === this.__ownerID ? this : t ? St(this.size, this._root, t, this.__hash) : (this.__ownerID = t, 
        this.__altered = !1, this);
    }, ct.isMap = _t;
    var Wr = "@@__IMMUTABLE_MAP__@@", Cr = ct.prototype;
    Cr[Wr] = !0, Cr[_r] = Cr.remove, Cr.removeIn = Cr.deleteIn, pt.prototype.get = function(t, e, r, n) {
        for (var i = this.entries, o = 0, u = i.length; u > o; o++) if (X(r, i[o][0])) return i[o][1];
        return n;
    }, pt.prototype.update = function(t, e, r, n, i, o, u) {
        for (var s = i === yr, a = this.entries, h = 0, f = a.length; f > h && !X(n, a[h][0]); h++) ;
        var _ = f > h;
        if (_ ? a[h][1] === i : s) return this;
        if (c(u), (s || !_) && c(o), !s || 1 !== a.length) {
            if (!_ && !s && a.length >= Nr) return Mt(t, a, n, i);
            var v = t && t === this.ownerID, l = v ? a : p(a);
            return _ ? s ? h === f - 1 ? l.pop() : l[h] = l.pop() : l[h] = [ n, i ] : l.push([ n, i ]), 
            v ? (this.entries = l, this) : new pt(t, l);
        }
    }, vt.prototype.get = function(t, e, r, n) {
        void 0 === e && (e = ot(r));
        var i = 1 << ((0 === t ? e : e >>> t) & lr), o = this.bitmap;
        return 0 === (o & i) ? n : this.nodes[Ut(o & i - 1)].get(t + pr, e, r, n);
    }, vt.prototype.update = function(t, e, r, n, i, o, u) {
        void 0 === r && (r = ot(n));
        var s = (0 === e ? r : r >>> e) & lr, a = 1 << s, h = this.bitmap, f = 0 !== (h & a);
        if (!f && i === yr) return this;
        var c = Ut(h & a - 1), _ = this.nodes, p = f ? _[c] : void 0, v = bt(p, t, e + pr, r, n, i, o, u);
        if (v === p) return this;
        if (!f && v && _.length >= Pr) return Ot(t, _, h, s, v);
        if (f && !v && 2 === _.length && qt(_[1 ^ c])) return _[1 ^ c];
        if (f && v && 1 === _.length && qt(v)) return v;
        var l = t && t === this.ownerID, y = f ? v ? h : h ^ a : h | a, d = f ? v ? Kt(_, c, v, l) : Tt(_, c, l) : Lt(_, c, v, l);
        return l ? (this.bitmap = y, this.nodes = d, this) : new vt(t, y, d);
    }, lt.prototype.get = function(t, e, r, n) {
        void 0 === e && (e = ot(r));
        var i = (0 === t ? e : e >>> t) & lr, o = this.nodes[i];
        return o ? o.get(t + pr, e, r, n) : n;
    }, lt.prototype.update = function(t, e, r, n, i, o, u) {
        void 0 === r && (r = ot(n));
        var s = (0 === e ? r : r >>> e) & lr, a = i === yr, h = this.nodes, f = h[s];
        if (a && !f) return this;
        var c = bt(f, t, e + pr, r, n, i, o, u);
        if (c === f) return this;
        var _ = this.count;
        if (f) {
            if (!c && (_--, Hr > _)) return Et(t, h, _, s);
        } else _++;
        var p = t && t === this.ownerID, v = Kt(h, s, c, p);
        return p ? (this.count = _, this.nodes = v, this) : new lt(t, _, v);
    }, yt.prototype.get = function(t, e, r, n) {
        for (var i = this.entries, o = 0, u = i.length; u > o; o++) if (X(r, i[o][0])) return i[o][1];
        return n;
    }, yt.prototype.update = function(t, e, r, n, i, o, u) {
        void 0 === r && (r = ot(n));
        var s = i === yr;
        if (r !== this.keyHash) return s ? this : (c(u), c(o), Dt(this, t, e, r, [ n, i ]));
        for (var a = this.entries, h = 0, f = a.length; f > h && !X(n, a[h][0]); h++) ;
        var _ = f > h;
        if (_ ? a[h][1] === i : s) return this;
        if (c(u), (s || !_) && c(o), s && 2 === f) return new dt(t, this.keyHash, a[1 ^ h]);
        var v = t && t === this.ownerID, l = v ? a : p(a);
        return _ ? s ? h === f - 1 ? l.pop() : l[h] = l.pop() : l[h] = [ n, i ] : l.push([ n, i ]), 
        v ? (this.entries = l, this) : new yt(t, this.keyHash, l);
    }, dt.prototype.get = function(t, e, r, n) {
        return X(r, this.entry[0]) ? this.entry[1] : n;
    }, dt.prototype.update = function(t, e, r, n, i, o, u) {
        var s = i === yr, a = X(n, this.entry[0]);
        return (a ? i === this.entry[1] : s) ? this : (c(u), s ? void c(o) : a ? t && t === this.ownerID ? (this.entry[1] = i, 
        this) : new dt(t, this.keyHash, [ n, i ]) : (c(o), Dt(this, t, e, ot(n), [ n, i ])));
    }, pt.prototype.iterate = yt.prototype.iterate = function(t, e) {
        for (var r = this.entries, n = 0, i = r.length - 1; i >= n; n++) if (t(r[e ? i - n : n]) === !1) return !1;
    }, vt.prototype.iterate = lt.prototype.iterate = function(t, e) {
        for (var r = this.nodes, n = 0, i = r.length - 1; i >= n; n++) {
            var o = r[e ? i - n : n];
            if (o && o.iterate(t, e) === !1) return !1;
        }
    }, dt.prototype.iterate = function(t, e) {
        return t(this.entry);
    }, t(mt, S), mt.prototype.next = function() {
        for (var t = this._type, e = this._stack; e; ) {
            var r, n = e.node, i = e.index++;
            if (n.entry) {
                if (0 === i) return gt(t, n.entry);
            } else if (n.entries) {
                if (r = n.entries.length - 1, r >= i) return gt(t, n.entries[this._reverse ? r - i : i]);
            } else if (r = n.nodes.length - 1, r >= i) {
                var o = n.nodes[this._reverse ? r - i : i];
                if (o) {
                    if (o.entry) return gt(t, o.entry);
                    e = this._stack = wt(o, e);
                }
                continue;
            }
            e = this._stack = this._stack.__prev;
        }
        return I();
    };
    var Jr, Nr = vr / 4, Pr = vr / 2, Hr = vr / 4;
    t(Bt, rt), Bt.of = function() {
        return this(arguments);
    }, Bt.prototype.toString = function() {
        return this.__toString("List [", "]");
    }, Bt.prototype.get = function(t, e) {
        if (t = l(this, t), t >= 0 && this.size > t) {
            t += this._origin;
            var r = Qt(this, t);
            return r && r.array[t & lr];
        }
        return e;
    }, Bt.prototype.set = function(t, e) {
        return Ht(this, t, e);
    }, Bt.prototype.remove = function(t) {
        return this.has(t) ? 0 === t ? this.shift() : t === this.size - 1 ? this.pop() : this.splice(t, 1) : this;
    }, Bt.prototype.insert = function(t, e) {
        return this.splice(t, 0, e);
    }, Bt.prototype.clear = function() {
        return 0 === this.size ? this : this.__ownerID ? (this.size = this._origin = this._capacity = 0, 
        this._level = pr, this._root = this._tail = null, this.__hash = void 0, this.__altered = !0, 
        this) : Pt();
    }, Bt.prototype.push = function() {
        var t = arguments, e = this.size;
        return this.withMutations(function(r) {
            Xt(r, 0, e + t.length);
            for (var n = 0; t.length > n; n++) r.set(e + n, t[n]);
        });
    }, Bt.prototype.pop = function() {
        return Xt(this, 0, -1);
    }, Bt.prototype.unshift = function() {
        var t = arguments;
        return this.withMutations(function(e) {
            Xt(e, -t.length);
            for (var r = 0; t.length > r; r++) e.set(r, t[r]);
        });
    }, Bt.prototype.shift = function() {
        return Xt(this, 1);
    }, Bt.prototype.merge = function() {
        return Ft(this, void 0, arguments);
    }, Bt.prototype.mergeWith = function(t) {
        var e = sr.call(arguments, 1);
        return Ft(this, t, e);
    }, Bt.prototype.mergeDeep = function() {
        return Ft(this, kt, arguments);
    }, Bt.prototype.mergeDeepWith = function(t) {
        var e = sr.call(arguments, 1);
        return Ft(this, At(t), e);
    }, Bt.prototype.setSize = function(t) {
        return Xt(this, 0, t);
    }, Bt.prototype.slice = function(t, e) {
        var r = this.size;
        return d(t, e, r) ? this : Xt(this, m(t, r), g(e, r));
    }, Bt.prototype.__iterator = function(t, e) {
        var r = 0, n = Jt(this, e);
        return new S(function() {
            var e = n();
            return e === Xr ? I() : z(t, r++, e);
        });
    }, Bt.prototype.__iterate = function(t, e) {
        for (var r, n = 0, i = Jt(this, e); (r = i()) !== Xr && t(r, n++, this) !== !1; ) ;
        return n;
    }, Bt.prototype.__ensureOwner = function(t) {
        return t === this.__ownerID ? this : t ? Nt(this._origin, this._capacity, this._level, this._root, this._tail, t, this.__hash) : (this.__ownerID = t, 
        this);
    }, Bt.isList = Wt;
    var Vr = "@@__IMMUTABLE_LIST__@@", Yr = Bt.prototype;
    Yr[Vr] = !0, Yr[_r] = Yr.remove, Yr.setIn = Cr.setIn, Yr.deleteIn = Yr.removeIn = Cr.removeIn, 
    Yr.update = Cr.update, Yr.updateIn = Cr.updateIn, Yr.mergeIn = Cr.mergeIn, Yr.mergeDeepIn = Cr.mergeDeepIn, 
    Yr.withMutations = Cr.withMutations, Yr.asMutable = Cr.asMutable, Yr.asImmutable = Cr.asImmutable, 
    Yr.wasAltered = Cr.wasAltered, Ct.prototype.removeBefore = function(t, e, r) {
        if (r === e ? 1 << e : 0 === this.array.length) return this;
        var n = r >>> e & lr;
        if (n >= this.array.length) return new Ct([], t);
        var i, o = 0 === n;
        if (e > 0) {
            var u = this.array[n];
            if (i = u && u.removeBefore(t, e - pr, r), i === u && o) return this;
        }
        if (o && !i) return this;
        var s = Yt(this, t);
        if (!o) for (var a = 0; n > a; a++) s.array[a] = void 0;
        return i && (s.array[n] = i), s;
    }, Ct.prototype.removeAfter = function(t, e, r) {
        if (r === (e ? 1 << e : 0) || 0 === this.array.length) return this;
        var n = r - 1 >>> e & lr;
        if (n >= this.array.length) return this;
        var i;
        if (e > 0) {
            var o = this.array[n];
            if (i = o && o.removeAfter(t, e - pr, r), i === o && n === this.array.length - 1) return this;
        }
        var u = Yt(this, t);
        return u.array.splice(n + 1), i && (u.array[n] = i), u;
    };
    var Qr, Xr = {};
    t(Zt, ct), Zt.of = function() {
        return this(arguments);
    }, Zt.prototype.toString = function() {
        return this.__toString("OrderedMap {", "}");
    }, Zt.prototype.get = function(t, e) {
        var r = this._map.get(t);
        return void 0 !== r ? this._list.get(r)[1] : e;
    }, Zt.prototype.clear = function() {
        return 0 === this.size ? this : this.__ownerID ? (this.size = 0, this._map.clear(), 
        this._list.clear(), this) : ee();
    }, Zt.prototype.set = function(t, e) {
        return re(this, t, e);
    }, Zt.prototype.remove = function(t) {
        return re(this, t, yr);
    }, Zt.prototype.wasAltered = function() {
        return this._map.wasAltered() || this._list.wasAltered();
    }, Zt.prototype.__iterate = function(t, e) {
        var r = this;
        return this._list.__iterate(function(e) {
            return e && t(e[1], e[0], r);
        }, e);
    }, Zt.prototype.__iterator = function(t, e) {
        return this._list.fromEntrySeq().__iterator(t, e);
    }, Zt.prototype.__ensureOwner = function(t) {
        if (t === this.__ownerID) return this;
        var e = this._map.__ensureOwner(t), r = this._list.__ensureOwner(t);
        return t ? te(e, r, t, this.__hash) : (this.__ownerID = t, this._map = e, this._list = r, 
        this);
    }, Zt.isOrderedMap = $t, Zt.prototype[cr] = !0, Zt.prototype[_r] = Zt.prototype.remove;
    var Fr;
    t(ne, x), ne.prototype.get = function(t, e) {
        return this._iter.get(t, e);
    }, ne.prototype.has = function(t) {
        return this._iter.has(t);
    }, ne.prototype.valueSeq = function() {
        return this._iter.valueSeq();
    }, ne.prototype.reverse = function() {
        var t = this, e = he(this, !0);
        return this._useKeys || (e.valueSeq = function() {
            return t._iter.toSeq().reverse();
        }), e;
    }, ne.prototype.map = function(t, e) {
        var r = this, n = ae(this, t, e);
        return this._useKeys || (n.valueSeq = function() {
            return r._iter.toSeq().map(t, e);
        }), n;
    }, ne.prototype.__iterate = function(t, e) {
        var r, n = this;
        return this._iter.__iterate(this._useKeys ? function(e, r) {
            return t(e, r, n);
        } : (r = e ? De(this) : 0, function(i) {
            return t(i, e ? --r : r++, n);
        }), e);
    }, ne.prototype.__iterator = function(t, e) {
        if (this._useKeys) return this._iter.__iterator(t, e);
        var r = this._iter.__iterator(wr, e), n = e ? De(this) : 0;
        return new S(function() {
            var i = r.next();
            return i.done ? i : z(t, e ? --n : n++, i.value, i);
        });
    }, ne.prototype[cr] = !0, t(ie, k), ie.prototype.includes = function(t) {
        return this._iter.includes(t);
    }, ie.prototype.__iterate = function(t, e) {
        var r = this, n = 0;
        return this._iter.__iterate(function(e) {
            return t(e, n++, r);
        }, e);
    }, ie.prototype.__iterator = function(t, e) {
        var r = this._iter.__iterator(wr, e), n = 0;
        return new S(function() {
            var e = r.next();
            return e.done ? e : z(t, n++, e.value, e);
        });
    }, t(oe, A), oe.prototype.has = function(t) {
        return this._iter.includes(t);
    }, oe.prototype.__iterate = function(t, e) {
        var r = this;
        return this._iter.__iterate(function(e) {
            return t(e, e, r);
        }, e);
    }, oe.prototype.__iterator = function(t, e) {
        var r = this._iter.__iterator(wr, e);
        return new S(function() {
            var e = r.next();
            return e.done ? e : z(t, e.value, e.value, e);
        });
    }, t(ue, x), ue.prototype.entrySeq = function() {
        return this._iter.toSeq();
    }, ue.prototype.__iterate = function(t, e) {
        var r = this;
        return this._iter.__iterate(function(e) {
            if (e) {
                qe(e);
                var n = o(e);
                return t(n ? e.get(1) : e[1], n ? e.get(0) : e[0], r);
            }
        }, e);
    }, ue.prototype.__iterator = function(t, e) {
        var r = this._iter.__iterator(wr, e);
        return new S(function() {
            for (;;) {
                var e = r.next();
                if (e.done) return e;
                var n = e.value;
                if (n) {
                    qe(n);
                    var i = o(n);
                    return z(t, i ? n.get(0) : n[0], i ? n.get(1) : n[1], e);
                }
            }
        });
    }, ie.prototype.cacheResult = ne.prototype.cacheResult = oe.prototype.cacheResult = ue.prototype.cacheResult = Oe, 
    t(Ae, et), Ae.prototype.toString = function() {
        return this.__toString(Re(this) + " {", "}");
    }, Ae.prototype.has = function(t) {
        return this._defaultValues.hasOwnProperty(t);
    }, Ae.prototype.get = function(t, e) {
        if (!this.has(t)) return e;
        var r = this._defaultValues[t];
        return this._map ? this._map.get(t, r) : r;
    }, Ae.prototype.clear = function() {
        if (this.__ownerID) return this._map && this._map.clear(), this;
        var t = this.constructor;
        return t._empty || (t._empty = je(this, zt()));
    }, Ae.prototype.set = function(t, e) {
        if (!this.has(t)) throw Error('Cannot set unknown key "' + t + '" on ' + Re(this));
        if (this._map && !this._map.has(t)) {
            var r = this._defaultValues[t];
            if (e === r) return this;
        }
        var n = this._map && this._map.set(t, e);
        return this.__ownerID || n === this._map ? this : je(this, n);
    }, Ae.prototype.remove = function(t) {
        if (!this.has(t)) return this;
        var e = this._map && this._map.remove(t);
        return this.__ownerID || e === this._map ? this : je(this, e);
    }, Ae.prototype.wasAltered = function() {
        return this._map.wasAltered();
    }, Ae.prototype.__iterator = function(t, e) {
        var n = this;
        return r(this._defaultValues).map(function(t, e) {
            return n.get(e);
        }).__iterator(t, e);
    }, Ae.prototype.__iterate = function(t, e) {
        var n = this;
        return r(this._defaultValues).map(function(t, e) {
            return n.get(e);
        }).__iterate(t, e);
    }, Ae.prototype.__ensureOwner = function(t) {
        if (t === this.__ownerID) return this;
        var e = this._map && this._map.__ensureOwner(t);
        return t ? je(this, e, t) : (this.__ownerID = t, this._map = e, this);
    };
    var Gr = Ae.prototype;
    Gr[_r] = Gr.remove, Gr.deleteIn = Gr.removeIn = Cr.removeIn, Gr.merge = Cr.merge, 
    Gr.mergeWith = Cr.mergeWith, Gr.mergeIn = Cr.mergeIn, Gr.mergeDeep = Cr.mergeDeep, 
    Gr.mergeDeepWith = Cr.mergeDeepWith, Gr.mergeDeepIn = Cr.mergeDeepIn, Gr.setIn = Cr.setIn, 
    Gr.update = Cr.update, Gr.updateIn = Cr.updateIn, Gr.withMutations = Cr.withMutations, 
    Gr.asMutable = Cr.asMutable, Gr.asImmutable = Cr.asImmutable, t(Le, nt), Le.of = function() {
        return this(arguments);
    }, Le.fromKeys = function(t) {
        return this(r(t).keySeq());
    }, Le.prototype.toString = function() {
        return this.__toString("Set {", "}");
    }, Le.prototype.has = function(t) {
        return this._map.has(t);
    }, Le.prototype.add = function(t) {
        return Be(this, this._map.set(t, !0));
    }, Le.prototype.remove = function(t) {
        return Be(this, this._map.remove(t));
    }, Le.prototype.clear = function() {
        return Be(this, this._map.clear());
    }, Le.prototype.union = function() {
        var t = sr.call(arguments, 0);
        return t = t.filter(function(t) {
            return 0 !== t.size;
        }), 0 === t.length ? this : 0 !== this.size || this.__ownerID || 1 !== t.length ? this.withMutations(function(e) {
            for (var r = 0; t.length > r; r++) i(t[r]).forEach(function(t) {
                return e.add(t);
            });
        }) : this.constructor(t[0]);
    }, Le.prototype.intersect = function() {
        var t = sr.call(arguments, 0);
        if (0 === t.length) return this;
        t = t.map(function(t) {
            return i(t);
        });
        var e = this;
        return this.withMutations(function(r) {
            e.forEach(function(e) {
                t.every(function(t) {
                    return t.includes(e);
                }) || r.remove(e);
            });
        });
    }, Le.prototype.subtract = function() {
        var t = sr.call(arguments, 0);
        if (0 === t.length) return this;
        t = t.map(function(t) {
            return i(t);
        });
        var e = this;
        return this.withMutations(function(r) {
            e.forEach(function(e) {
                t.some(function(t) {
                    return t.includes(e);
                }) && r.remove(e);
            });
        });
    }, Le.prototype.merge = function() {
        return this.union.apply(this, arguments);
    }, Le.prototype.mergeWith = function(t) {
        var e = sr.call(arguments, 1);
        return this.union.apply(this, e);
    }, Le.prototype.sort = function(t) {
        return Je(we(this, t));
    }, Le.prototype.sortBy = function(t, e) {
        return Je(we(this, e, t));
    }, Le.prototype.wasAltered = function() {
        return this._map.wasAltered();
    }, Le.prototype.__iterate = function(t, e) {
        var r = this;
        return this._map.__iterate(function(e, n) {
            return t(n, n, r);
        }, e);
    }, Le.prototype.__iterator = function(t, e) {
        return this._map.map(function(t, e) {
            return e;
        }).__iterator(t, e);
    }, Le.prototype.__ensureOwner = function(t) {
        if (t === this.__ownerID) return this;
        var e = this._map.__ensureOwner(t);
        return t ? this.__make(e, t) : (this.__ownerID = t, this._map = e, this);
    }, Le.isSet = Te;
    var Zr = "@@__IMMUTABLE_SET__@@", $r = Le.prototype;
    $r[Zr] = !0, $r[_r] = $r.remove, $r.mergeDeep = $r.merge, $r.mergeDeepWith = $r.mergeWith, 
    $r.withMutations = Cr.withMutations, $r.asMutable = Cr.asMutable, $r.asImmutable = Cr.asImmutable, 
    $r.__empty = Ce, $r.__make = We;
    var tn;
    t(Je, Le), Je.of = function() {
        return this(arguments);
    }, Je.fromKeys = function(t) {
        return this(r(t).keySeq());
    }, Je.prototype.toString = function() {
        return this.__toString("OrderedSet {", "}");
    }, Je.isOrderedSet = Ne;
    var en = Je.prototype;
    en[cr] = !0, en.__empty = He, en.__make = Pe;
    var rn;
    t(Ve, rt), Ve.of = function() {
        return this(arguments);
    }, Ve.prototype.toString = function() {
        return this.__toString("Stack [", "]");
    }, Ve.prototype.get = function(t, e) {
        var r = this._head;
        for (t = l(this, t); r && t--; ) r = r.next;
        return r ? r.value : e;
    }, Ve.prototype.peek = function() {
        return this._head && this._head.value;
    }, Ve.prototype.push = function() {
        if (0 === arguments.length) return this;
        for (var t = this.size + arguments.length, e = this._head, r = arguments.length - 1; r >= 0; r--) e = {
            value: arguments[r],
            next: e
        };
        return this.__ownerID ? (this.size = t, this._head = e, this.__hash = void 0, this.__altered = !0, 
        this) : Qe(t, e);
    }, Ve.prototype.pushAll = function(t) {
        if (t = n(t), 0 === t.size) return this;
        ft(t.size);
        var e = this.size, r = this._head;
        return t.reverse().forEach(function(t) {
            e++, r = {
                value: t,
                next: r
            };
        }), this.__ownerID ? (this.size = e, this._head = r, this.__hash = void 0, this.__altered = !0, 
        this) : Qe(e, r);
    }, Ve.prototype.pop = function() {
        return this.slice(1);
    }, Ve.prototype.unshift = function() {
        return this.push.apply(this, arguments);
    }, Ve.prototype.unshiftAll = function(t) {
        return this.pushAll(t);
    }, Ve.prototype.shift = function() {
        return this.pop.apply(this, arguments);
    }, Ve.prototype.clear = function() {
        return 0 === this.size ? this : this.__ownerID ? (this.size = 0, this._head = void 0, 
        this.__hash = void 0, this.__altered = !0, this) : Xe();
    }, Ve.prototype.slice = function(t, e) {
        if (d(t, e, this.size)) return this;
        var r = m(t, this.size), n = g(e, this.size);
        if (n !== this.size) return rt.prototype.slice.call(this, t, e);
        for (var i = this.size - r, o = this._head; r--; ) o = o.next;
        return this.__ownerID ? (this.size = i, this._head = o, this.__hash = void 0, this.__altered = !0, 
        this) : Qe(i, o);
    }, Ve.prototype.__ensureOwner = function(t) {
        return t === this.__ownerID ? this : t ? Qe(this.size, this._head, t, this.__hash) : (this.__ownerID = t, 
        this.__altered = !1, this);
    }, Ve.prototype.__iterate = function(t, e) {
        if (e) return this.reverse().__iterate(t);
        for (var r = 0, n = this._head; n && t(n.value, r++, this) !== !1; ) n = n.next;
        return r;
    }, Ve.prototype.__iterator = function(t, e) {
        if (e) return this.reverse().__iterator(t);
        var r = 0, n = this._head;
        return new S(function() {
            if (n) {
                var e = n.value;
                return n = n.next, z(t, r++, e);
            }
            return I();
        });
    }, Ve.isStack = Ye;
    var nn = "@@__IMMUTABLE_STACK__@@", on = Ve.prototype;
    on[nn] = !0, on.withMutations = Cr.withMutations, on.asMutable = Cr.asMutable, on.asImmutable = Cr.asImmutable, 
    on.wasAltered = Cr.wasAltered;
    var un;
    e.Iterator = S, Fe(e, {
        toArray: function() {
            ft(this.size);
            var t = Array(this.size || 0);
            return this.valueSeq().__iterate(function(e, r) {
                t[r] = e;
            }), t;
        },
        toIndexedSeq: function() {
            return new ie(this);
        },
        toJS: function() {
            return this.toSeq().map(function(t) {
                return t && "function" == typeof t.toJS ? t.toJS() : t;
            }).__toJS();
        },
        toJSON: function() {
            return this.toSeq().map(function(t) {
                return t && "function" == typeof t.toJSON ? t.toJSON() : t;
            }).__toJS();
        },
        toKeyedSeq: function() {
            return new ne(this, !0);
        },
        toMap: function() {
            return ct(this.toKeyedSeq());
        },
        toObject: function() {
            ft(this.size);
            var t = {};
            return this.__iterate(function(e, r) {
                t[r] = e;
            }), t;
        },
        toOrderedMap: function() {
            return Zt(this.toKeyedSeq());
        },
        toOrderedSet: function() {
            return Je(u(this) ? this.valueSeq() : this);
        },
        toSet: function() {
            return Le(u(this) ? this.valueSeq() : this);
        },
        toSetSeq: function() {
            return new oe(this);
        },
        toSeq: function() {
            return s(this) ? this.toIndexedSeq() : u(this) ? this.toKeyedSeq() : this.toSetSeq();
        },
        toStack: function() {
            return Ve(u(this) ? this.valueSeq() : this);
        },
        toList: function() {
            return Bt(u(this) ? this.valueSeq() : this);
        },
        toString: function() {
            return "[Iterable]";
        },
        __toString: function(t, e) {
            return 0 === this.size ? t + e : t + " " + this.toSeq().map(this.__toStringMapper).join(", ") + " " + e;
        },
        concat: function() {
            var t = sr.call(arguments, 0);
            return be(this, ye(this, t));
        },
        includes: function(t) {
            return this.some(function(e) {
                return X(e, t);
            });
        },
        entries: function() {
            return this.__iterator(Sr);
        },
        every: function(t, e) {
            ft(this.size);
            var r = !0;
            return this.__iterate(function(n, i, o) {
                return t.call(e, n, i, o) ? void 0 : (r = !1, !1);
            }), r;
        },
        filter: function(t, e) {
            return be(this, fe(this, t, e, !0));
        },
        find: function(t, e, r) {
            var n = this.findEntry(t, e);
            return n ? n[1] : r;
        },
        forEach: function(t, e) {
            return ft(this.size), this.__iterate(e ? t.bind(e) : t);
        },
        join: function(t) {
            ft(this.size), t = void 0 !== t ? "" + t : ",";
            var e = "", r = !0;
            return this.__iterate(function(n) {
                r ? r = !1 : e += t, e += null !== n && void 0 !== n ? "" + n : "";
            }), e;
        },
        keys: function() {
            return this.__iterator(gr);
        },
        map: function(t, e) {
            return be(this, ae(this, t, e));
        },
        reduce: function(t, e, r) {
            ft(this.size);
            var n, i;
            return arguments.length < 2 ? i = !0 : n = e, this.__iterate(function(e, o, u) {
                i ? (i = !1, n = e) : n = t.call(r, n, e, o, u);
            }), n;
        },
        reduceRight: function(t, e, r) {
            var n = this.toKeyedSeq().reverse();
            return n.reduce.apply(n, arguments);
        },
        reverse: function() {
            return be(this, he(this, !0));
        },
        slice: function(t, e) {
            return be(this, pe(this, t, e, !0));
        },
        some: function(t, e) {
            return !this.every($e(t), e);
        },
        sort: function(t) {
            return be(this, we(this, t));
        },
        values: function() {
            return this.__iterator(wr);
        },
        butLast: function() {
            return this.slice(0, -1);
        },
        isEmpty: function() {
            return void 0 !== this.size ? 0 === this.size : !this.some(function() {
                return !0;
            });
        },
        count: function(t, e) {
            return v(t ? this.toSeq().filter(t, e) : this);
        },
        countBy: function(t, e) {
            return ce(this, t, e);
        },
        equals: function(t) {
            return F(this, t);
        },
        entrySeq: function() {
            var t = this;
            if (t._cache) return new j(t._cache);
            var e = t.toSeq().map(Ze).toIndexedSeq();
            return e.fromEntrySeq = function() {
                return t.toSeq();
            }, e;
        },
        filterNot: function(t, e) {
            return this.filter($e(t), e);
        },
        findEntry: function(t, e, r) {
            var n = r;
            return this.__iterate(function(r, i, o) {
                return t.call(e, r, i, o) ? (n = [ i, r ], !1) : void 0;
            }), n;
        },
        findKey: function(t, e) {
            var r = this.findEntry(t, e);
            return r && r[0];
        },
        findLast: function(t, e, r) {
            return this.toKeyedSeq().reverse().find(t, e, r);
        },
        findLastEntry: function(t, e, r) {
            return this.toKeyedSeq().reverse().findEntry(t, e, r);
        },
        findLastKey: function(t, e) {
            return this.toKeyedSeq().reverse().findKey(t, e);
        },
        first: function() {
            return this.find(y);
        },
        flatMap: function(t, e) {
            return be(this, me(this, t, e));
        },
        flatten: function(t) {
            return be(this, de(this, t, !0));
        },
        fromEntrySeq: function() {
            return new ue(this);
        },
        get: function(t, e) {
            return this.find(function(e, r) {
                return X(r, t);
            }, void 0, e);
        },
        getIn: function(t, e) {
            for (var r, n = this, i = ke(t); !(r = i.next()).done; ) {
                var o = r.value;
                if (n = n && n.get ? n.get(o, yr) : yr, n === yr) return e;
            }
            return n;
        },
        groupBy: function(t, e) {
            return _e(this, t, e);
        },
        has: function(t) {
            return this.get(t, yr) !== yr;
        },
        hasIn: function(t) {
            return this.getIn(t, yr) !== yr;
        },
        isSubset: function(t) {
            return t = "function" == typeof t.includes ? t : e(t), this.every(function(e) {
                return t.includes(e);
            });
        },
        isSuperset: function(t) {
            return t = "function" == typeof t.isSubset ? t : e(t), t.isSubset(this);
        },
        keyOf: function(t) {
            return this.findKey(function(e) {
                return X(e, t);
            });
        },
        keySeq: function() {
            return this.toSeq().map(Ge).toIndexedSeq();
        },
        last: function() {
            return this.toSeq().reverse().first();
        },
        lastKeyOf: function(t) {
            return this.toKeyedSeq().reverse().keyOf(t);
        },
        max: function(t) {
            return Se(this, t);
        },
        maxBy: function(t, e) {
            return Se(this, e, t);
        },
        min: function(t) {
            return Se(this, t ? tr(t) : nr);
        },
        minBy: function(t, e) {
            return Se(this, e ? tr(e) : nr, t);
        },
        rest: function() {
            return this.slice(1);
        },
        skip: function(t) {
            return this.slice(Math.max(0, t));
        },
        skipLast: function(t) {
            return be(this, this.toSeq().reverse().skip(t).reverse());
        },
        skipWhile: function(t, e) {
            return be(this, le(this, t, e, !0));
        },
        skipUntil: function(t, e) {
            return this.skipWhile($e(t), e);
        },
        sortBy: function(t, e) {
            return be(this, we(this, e, t));
        },
        take: function(t) {
            return this.slice(0, Math.max(0, t));
        },
        takeLast: function(t) {
            return be(this, this.toSeq().reverse().take(t).reverse());
        },
        takeWhile: function(t, e) {
            return be(this, ve(this, t, e));
        },
        takeUntil: function(t, e) {
            return this.takeWhile($e(t), e);
        },
        valueSeq: function() {
            return this.toIndexedSeq();
        },
        hashCode: function() {
            return this.__hash || (this.__hash = ir(this));
        }
    });
    var sn = e.prototype;
    sn[ar] = !0, sn[br] = sn.values, sn.__toJS = sn.toArray, sn.__toStringMapper = er, 
    sn.inspect = sn.toSource = function() {
        return "" + this;
    }, sn.chain = sn.flatMap, sn.contains = sn.includes, Fe(r, {
        flip: function() {
            return be(this, se(this));
        },
        mapEntries: function(t, e) {
            var r = this, n = 0;
            return be(this, this.toSeq().map(function(i, o) {
                return t.call(e, [ o, i ], n++, r);
            }).fromEntrySeq());
        },
        mapKeys: function(t, e) {
            var r = this;
            return be(this, this.toSeq().flip().map(function(n, i) {
                return t.call(e, n, i, r);
            }).flip());
        }
    });
    var an = r.prototype;
    an[hr] = !0, an[br] = sn.entries, an.__toJS = sn.toObject, an.__toStringMapper = function(t, e) {
        return JSON.stringify(e) + ": " + er(t);
    }, Fe(n, {
        toKeyedSeq: function() {
            return new ne(this, !1);
        },
        filter: function(t, e) {
            return be(this, fe(this, t, e, !1));
        },
        findIndex: function(t, e) {
            var r = this.findEntry(t, e);
            return r ? r[0] : -1;
        },
        indexOf: function(t) {
            var e = this.keyOf(t);
            return void 0 === e ? -1 : e;
        },
        lastIndexOf: function(t) {
            var e = this.lastKeyOf(t);
            return void 0 === e ? -1 : e;
        },
        reverse: function() {
            return be(this, he(this, !1));
        },
        slice: function(t, e) {
            return be(this, pe(this, t, e, !1));
        },
        splice: function(t, e) {
            var r = arguments.length;
            if (e = Math.max(0 | e, 0), 0 === r || 2 === r && !e) return this;
            t = m(t, 0 > t ? this.count() : this.size);
            var n = this.slice(0, t);
            return be(this, 1 === r ? n : n.concat(p(arguments, 2), this.slice(t + e)));
        },
        findLastIndex: function(t, e) {
            var r = this.findLastEntry(t, e);
            return r ? r[0] : -1;
        },
        first: function() {
            return this.get(0);
        },
        flatten: function(t) {
            return be(this, de(this, t, !1));
        },
        get: function(t, e) {
            return t = l(this, t), 0 > t || this.size === 1 / 0 || void 0 !== this.size && t > this.size ? e : this.find(function(e, r) {
                return r === t;
            }, void 0, e);
        },
        has: function(t) {
            return t = l(this, t), t >= 0 && (void 0 !== this.size ? this.size === 1 / 0 || this.size > t : -1 !== this.indexOf(t));
        },
        interpose: function(t) {
            return be(this, ge(this, t));
        },
        interleave: function() {
            var t = [ this ].concat(p(arguments)), e = Ie(this.toSeq(), k.of, t), r = e.flatten(!0);
            return e.size && (r.size = e.size * t.length), be(this, r);
        },
        keySeq: function() {
            return $(0, this.size);
        },
        last: function() {
            return this.get(-1);
        },
        skipWhile: function(t, e) {
            return be(this, le(this, t, e, !1));
        },
        zip: function() {
            var t = [ this ].concat(p(arguments));
            return be(this, Ie(this, rr, t));
        },
        zipWith: function(t) {
            var e = p(arguments);
            return e[0] = this, be(this, Ie(this, t, e));
        }
    }), n.prototype[fr] = !0, n.prototype[cr] = !0, Fe(i, {
        get: function(t, e) {
            return this.has(t) ? t : e;
        },
        includes: function(t) {
            return this.has(t);
        },
        keySeq: function() {
            return this.valueSeq();
        }
    }), i.prototype.has = sn.includes, i.prototype.contains = i.prototype.includes, 
    Fe(x, r.prototype), Fe(k, n.prototype), Fe(A, i.prototype), Fe(et, r.prototype), 
    Fe(rt, n.prototype), Fe(nt, i.prototype);
    var hn = {
        Iterable: e,
        Seq: O,
        Collection: tt,
        Map: ct,
        OrderedMap: Zt,
        List: Bt,
        Stack: Ve,
        Set: Le,
        OrderedSet: Je,
        Record: Ae,
        Range: $,
        Repeat: G,
        is: X,
        fromJS: H
    };
    return hn;
});

"use strict";

var addEvent = function(element, evt, fnc) {
    return element.addEventListener(evt, fnc, false);
};

var removeEvent = function(element, evt, fnc) {
    return element.removeEventListener(evt, fnc, false);
};

var swapClass = function(element, string, regex) {
    var className = element.className;
    if (string !== "") {
        if (regex.test(className)) {
            return false;
        }
        fastdom.mutate(function() {
            this.className += " " + string;
        }, element);
    } else {
        fastdom.mutate(function() {
            this.className = className.replace(regex, "");
        }, element);
    }
};

String.prototype.toTitle = function() {
    var regPreTitle = /(?:\W?)\w\S*/g;
    return this.replace(regPreTitle, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

String.prototype.toPubName = function() {
    var regQueryPubName = /\d* ?[-_a-z]+[\s\.\-]*[0-9]+(?:-|\.)[0-9]+(?:_?sup[a-z]*)?/gi;
    var regEOLDashCheck = /[\-\cI\v\0\f]$/m;
    var regSpace = /\s/g;
    var removed;
    var count = 0;
    var extraction = [];
    removed = this.replace(regQueryPubName, function(txt) {
        var text = txt.toUpperCase().replace(regSpace, "");
        if (extraction.length > 0 && regEOLDashCheck.test(extraction[count - 1])) {
            extraction[count - 1] += text;
        } else {
            extraction[extraction.length] = text;
        }
        count += 1;
        return "";
    });
    return {
        removed: removed,
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

var months = Object.defineProperties(Object.create(null), {
    "01": {
        value: "Jan"
    },
    "02": {
        value: "Feb"
    },
    "03": {
        value: "Mar"
    },
    "04": {
        value: "Apr"
    },
    "05": {
        value: "May"
    },
    "06": {
        value: "Jun"
    },
    "07": {
        value: "Jul"
    },
    "08": {
        value: "Aug"
    },
    "09": {
        value: "Sep"
    },
    "10": {
        value: "Oct"
    },
    "11": {
        value: "Nov"
    },
    "12": {
        value: "Dec"
    }
});

var querySetup = function(text) {
    if (!text) {
        return {
            term: "",
            pubName: "",
            noPubName: ""
        };
    }
    var name = text.toPubName();
    return {
        term: text,
        pubName: name.extract,
        noPubName: name.removed
    };
};

var upperOutlier = function(someArray) {
    var values = someArray.slice();
    var total = values.length;
    values.sort(function(a, b) {
        return a - b;
    });
    var q1 = values[Math.floor(total / 4)];
    var q3 = values[Math.ceil(total * 3 / 4)];
    var iqr = q3 - q1;
    return q3 + iqr * 3 / 2;
};

var connect = function(url, dataString, callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
            callback(request);
        }
    };
    request.open("POST", url, true);
    request.setRequestHeader("Content-type", "application/json");
    request.send(dataString);
};

"use strict";

var makeTemplates = function(template) {
    var relatedTemplateString = [ '<li class="result doc<%= gravitas %>" data-score="<%= score %>" id="<%= key %>">', "<%= key %>", "</li>" ];
    var resultTemplateString = [ '<div class="result<%= type %><%= gravitas %> clearfix" data-score="<%= score %>" data-pub="<%= fullPub %>">', '<% if ( type === " content" ) { %>', '<div class="text clearfix">', "<% if ( parts && concatText ) { %>", '<span class="combined"><%= concatText %><br/></span>', '<span class="parts"><%  var i = 0, count = parts.length;', "for (; i < count;,+i) {", "if ( count > 1 || concatText.length > parts[0].length ) { %>", "<q>...<%= parts[i] %>...</q>", "<% } else { %>", "<%= parts[0] %>", "<% } %>", "<% } %></span>", '<% if ( count > 1 || concatText.length > parts[0].length ) { %><a href="#" class="reveal-text clickable">expand</a><% } %>', "<% } else { %>", '<span class="combined"><%= rawText %></span>', '<span class="parts"></span>', '<a href="#" class="reveal-text clickable">expand</a>', "<% } %>", "</div>", '<div class="meta">', '<div class="details">', '<span class="number"><%= sub %></span><br/>', "<% if ( details && details.chapter && details.chapterTitle ) { %>", '<span class="chapter">Chapter <%= details.chapter %><br/><span class="title"><%= details.chapterTitle %></span></span><br/>', "<% } if ( details && details.section && details.sectionTitle ) { %>", '<span class="section">Section <%= details.section %><br/><span class="title"><%= details.sectionTitle %></span></span><br/>', "<% } %>", "</div>", '<a class="info clickable" href="<%= url %>" title="<%= date %>" download="<%= fullPub %>.pdf" target="_blank">', '<span class="pub"><%= fullPub %></span><br/>', '<span class="title"><%= title %></span>', "</a>", "</div>", "<% } else { %>", '<a class="info clickable" href="<%= url %>" title="<%= date %>" download="<%= fullPub %>.pdf" target="_blank">', '<span class="pub"><%= fullPub %></span><br/>', '<span class="title"><%= title %></span>', "</a>", "<% } %>", "</div>" ];
    return {
        results: template(resultTemplateString.join("")),
        related: template(relatedTemplateString.join(""))
    };
};

(function(window, document, template, forEach, undefined) {
    "use strict";
    var resetSearch = null;
    var maps = {
        colors: Immutable.Map(),
        layout: Immutable.Map(),
        results: Immutable.Map(),
        scores: Immutable.Map({
            content: [],
            related: []
        }),
        state: Immutable.Map({
            moreToLoad: false,
            isLoading: false,
            isDone: false,
            isSearchBoxOpen: false
        })
    };
    var setMap = function(type, key, data) {
        var _map = maps[type];
        var value = _map.get(key);
        if (data !== null) {
            if (typeof value === "undefined") {
                maps[type] = _map.set(key, data);
            } else {
                if (typeof data === "function") {
                    maps[type] = _map.update(key, data);
                } else {
                    maps[type] = _map.update(key, function(current) {
                        if (Array.isArray(current) && Array.isArray(data)) {
                            return current.concat(data);
                        }
                        if (typeof current !== "object") {
                            return data;
                        }
                        return Object.assign({}, current, data);
                    });
                }
            }
        } else {
            if (typeof value !== "undefined") {
                maps[type] = _map.delete(key);
            } else {
                maps[type] = Immutable.Map();
            }
        }
        return maps[type];
    };
    var resetMap = function(type, key, data) {
        var _map = maps[type];
        var value = _map.get(key);
        if (typeof value !== "undefined") {
            maps[type] = _map.set(key, null);
        }
        return setMap(type, key, data);
    };
    var showMessage = function(message) {
        fastdom.mutate(function() {
            this.innerHTML = message;
        }, document.getElementById("message"), message || "");
    };
    var showLoader = function() {
        var regLoad = / ?loading/g;
        swapClass(document.getElementById("loader"), "loading", regLoad);
    };
    var hideLoader = function() {
        var regLoad = / ?loading/g;
        swapClass(document.getElementById("loader"), "", regLoad);
    };
    var processRelated = function(related, template) {
        var b = 0;
        var count = related.length;
        var score = new Array(count);
        for (;b < count; ++b) {
            score[b] = related[b].score;
        }
        fastdom.mutate(function(relatedHTML) {
            this.innerHTML = relatedHTML;
        }, document.getElementById("related-list"), renderRelated(related, template));
    };
    var processContent = function(_hits, template) {
        var hits = _hits.hits;
        var count = hits.length;
        var scores = new Array(count);
        var b = 0;
        for (;b < count; ++b) {
            scores[b] = hits[b]._score;
        }
        resetMap("scores", "content", scores);
        fastdom.mutate(function(term) {
            this.innerHTML = term;
        }, document.getElementById("term"), maps.state.get("term"));
        fastdom.mutate(function(count) {
            this.innerHTML = count;
        }, document.getElementById("count"), hits.length);
        fastdom.mutate(function(total) {
            this.innerHTML = total;
        }, document.getElementById("total"), _hits.total);
        fastdom.mutate(function(resultsHTML) {
            forEach.call(this.querySelectorAll(".reveal-text"), function(el) {
                el.parentNode.removeChild(el);
                el = null;
            });
            this.innerHTML = resultsHTML;
        }, document.getElementById("results"), renderResults(hits, template));
    };
    var processMoreContent = function(hits, templates) {
        var count = hits.length;
        var scores = new Array(count);
        for (var b = 0; b < count; ++b) {
            scores[b] = hits[b]._score;
        }
        setMap("scores", "content", scores);
        fastdom.mutate(function(total) {
            this.innerHTML = total;
        }, document.getElementById("count"), count);
        fastdom.mutate(function(resultsHTML) {
            this.innerHTML += resultsHTML;
        }, document.getElementById("results"), renderResults(hits, templates.results));
    };
    var searchReset = function() {
        var regHidden = / ?hidden/g;
        swapClass(document.getElementById("more-content"), "hidden", regHidden);
        setMap("state", "moreToLoad", false);
    };
    var handleTimer = function() {
        if (resetSearch) {
            clearTimeout(resetSearch);
        }
        resetSearch = setTimeout(searchReset, 6e4);
    };
    var handleResponse = function(response, action) {
        var content = response[0] || null;
        var meta = response[1] || null;
        var regFail = / ?failed/g;
        var regHidden = / ?hidden/g;
        if (content && content.hits.total === 0 && (meta && meta.hits.total === 0)) {
            document.cookie = "placeContent=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            document.cookie = "placeMeta=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            setMap("state", "isFailure", true);
            setMap("state", "infiniScroll", false);
            showMessage("Your search returned no results.  Give 'er another go.");
            hideLoader();
            fastdom.mutate(function() {
                this.style.display = "none";
            }, document.getElementById("x"));
            swapClass(document.getElementById("search-wrap"), "failed", regFail);
            return false;
        }
        setMap("state", "isFailure", false);
        var expires = new Date(Date.now() + 6e4);
        expires = expires.toUTCString();
        handleTimer();
        if (content) {
            var templates = makeTemplates(template);
            var placeContent = content._scroll_id;
            setMap("state", "placeContent", placeContent);
            document.cookie = "placeContent=" + placeContent + "; expires=" + expires;
            if (action !== "more") {
                fastdom.mutate(function() {
                    this.scroll(0, 0);
                }, window);
                processContent(content, templates.results);
                processRelated(content.aggregations.related_doc.buckets, templates.related);
            } else {
                processMoreContent(content.hits.hits, templates.results);
            }
            fastdom.measure(function() {
                var rect = this.getBoundingClientRect();
                var bodyRect = document.body.getBoundingClientRect();
                setMap("layout", "relatedRect", rect);
                setMap("layout", "bodyRect", bodyRect);
                setMap("layout", "stickyBarPosition", Math.abs(rect.top) + Math.abs(bodyRect.top) + Math.abs(rect.height));
            }, document.getElementById("related-list"));
            var reveals = document.getElementById("results").querySelectorAll(".reveal-text");
            var total = reveals.length;
            var a = 0;
            for (;a < total; ++a) {
                addEvent(reveals[a], "click", revealText);
            }
            if (content.hits.hits.length < 20) {
                setMap("state", "moreToLoad", false);
                swapClass(document.getElementById("more-content"), "hidden", regHidden);
            } else {
                setMap("state", "moreToLoad", true);
                swapClass(document.getElementById("more-content"), "", regHidden);
            }
        }
        if (meta) {
            var placeMeta = meta._scroll_id;
            setMap("state", "placeMeta", placeMeta);
            document.cookie = "placeMeta=" + placeMeta + "; expires=" + expires;
        }
        fastdom.measure(function() {
            var rect = this.getBoundingClientRect();
            setMap("layout", "resultsRect", rect);
            setMap("layout", "currentHeight", Math.abs(rect.height));
            setMap("state", "isLoading", false);
        }, document.getElementById("results"));
        searchBoxToggle(false);
        hideLoader();
    };
    var submitQuery = function(type, action, contentPager, metaPager) {
        var query = maps.state.get("term");
        var url = document.location.protocol + "//that.pub/find/" + type + "/" + action;
        var dataString = JSON.stringify({
            term: querySetup(query),
            contentPage: contentPager,
            metaPage: metaPager
        });
        connect(url, dataString, function(request) {
            setMap("state", "isDone", true);
            handleResponse(JSON.parse(request.responseText), action);
        });
    };
    var getContent = function() {
        var state = maps.state;
        if (state.get("isLoading") !== true) {
            showLoader();
        }
        submitQuery("content", "more", document.cookie.placeContent || state.get("placeContent"), null);
    };
    var searchBoxToggle = function(open) {
        var state = maps.state;
        var regEmerge = / ?emerge/g;
        var regFail = / ?failed/g;
        var term = state.get("term");
        var query_ = document.getElementById("query");
        var searchWrap_ = document.getElementById("search-wrap");
        if (open) {
            fastdom.mutate(function(term) {
                this.value = term;
            }, query_, term);
            fastdom.mutate(function() {
                this.style.display = "none";
            }, document.getElementById("ico"));
            fastdom.mutate(function() {
                this.style.display = "";
            }, document.getElementById("x"));
            swapClass(searchWrap_, "emerge", regEmerge);
            if (state.get("isFailure") === true) {
                swapClass(searchWrap_, "failed", regFail);
            }
            setMap("state", "isSearchBoxOpen", true);
            setMap("state", "infiniScroll", false);
        } else if (state.get("isDone") === true) {
            swapClass(searchWrap_, "", regEmerge);
            swapClass(searchWrap_, "", regFail);
            var infiniState = state.get("infiniScroll") ? !!this.infiniScroll_.checked : true;
            setMap("state", "infiniScroll", infiniState);
            setMap("state", "term", query_.value.trim());
            fastdom.mutate(function() {
                this.style.display = "";
            }, document.getElementById("ico"));
            fastdom.mutate(function() {
                this.style.display = "none";
            }, document.getElementById("x"));
            showMessage();
            setMap("state", "isSearchBoxOpen", false);
        }
    };
    var searchStart = function(event) {
        var regValidate = / ?invalidated/g;
        var query_ = document.getElementById("query");
        var val = query_.value.trim();
        var state = maps.state;
        event.preventDefault();
        event.stopPropagation();
        setMap("state", "isFailure", false);
        setMap("state", "isDone", false);
        if (!val) {
            setMap("state", "queryInvalidated", true);
            swapClass(query_, "invalidated", regValidate);
            showMessage("You gotta type something first.");
            query_.focus();
        }
        setMap("state", "term", val);
        showLoader();
        submitQuery("content", "search", state.get("placeContent"), state.get("placeMeta"));
    };
    addEvent(document.getElementById("send"), "click", searchStart);
    var handleFocus = function() {
        if (maps.state.get("queryInvalidated") !== true) {
            return false;
        }
    };
    addEvent(document.getElementById("query"), "focus", handleFocus);
    var handleInput = function(event) {
        var regValidate = / ?invalidated/g;
        var state = maps.state;
        if (event.which === 13 && state.get("isSearchBoxOpen") === true) {
            searchStart(event);
        }
        if (state.get("queryInvalidated") === true && event.which !== 13) {
            setMap("state", "queryInvalidated", false);
            swapClass(event.currentTarget, "", regValidate);
            showMessage(null);
        }
        event.stopPropagation();
    };
    addEvent(document.getElementById("query"), "keypress", handleInput);
    var closeModal = function(event) {
        var state = maps.state;
        if (event.which === 27 && state.get("isSearchBoxOpen") === true && state.get("isFailure") === false) {
            event.preventDefault();
            searchBoxToggle(false);
        }
    };
    addEvent(document, "keyup", closeModal);
    var handleMoreContent = function(event) {
        event.preventDefault();
        event.stopPropagation();
        getContent(false);
    };
    addEvent(document.getElementById("more-content"), "click", handleMoreContent);
    var handleRestore = function(event) {
        event.preventDefault();
        event.stopPropagation();
        var state = maps.state;
        if (state.get("isSearchBoxOpen") === true && state.get("isLoading") !== true && state.get("isFailure") !== true) {
            searchBoxToggle(false);
        } else {
            var query_ = document.getElementById("query");
            searchBoxToggle(true);
            query_.value = state.get("term");
            query_.focus();
        }
    };
    addEvent(document.getElementById("search-restore"), "click", handleRestore);
    var infini = function() {
        var state = maps.state;
        var infiniScroll = !!this.checked;
        setMap("state", "infiniScroll", infiniScroll);
        var status = infiniScroll ? "enabled" : "disabled";
        var doThis = infiniScroll ? "Disable" : "Enable";
        var infiniLabel_ = document.getElementById("infini-label");
        fastdom.mutate(function(status) {
            this.className = status;
        }, infiniLabel_, status);
        infiniLabel_.setAttribute("title", doThis + " infinite scroll");
    };
    addEvent(document.getElementById("infini-scroll"), "change", infini);
    var scrollWheeler = function() {
        var state = maps.state;
        var layout = maps.layout;
        fastdom.measure(function() {
            var position = (rootElement && typeof rootElement.ScrollTop === "number" ? rootElement : document.body).ScrollTop || window.pageYOffset, delta = position - layout.get("position");
            if (delta > 0 && state.get("infiniScroll") === true && state.get("nowLoading") === false && state.get("moreToLoad") === true && position > layout.get("currentHeight") - 1200) {
                getContent(true);
            }
            setMap("layout", "position", position);
        });
    };
    addEvent(window, "scroll", scrollWheeler);
    var handleWindowLoad = function() {
        setMap("state", "isSearchBoxOpen", true);
        document.getElementById("query").focus();
    };
    addEvent(window, "load", handleWindowLoad);
    var handleDOMReady = function() {
        FastClick.attach(document.body);
    };
    addEvent(document, "DOMContentLoaded", handleDOMReady);
    var revealText = function(event) {
        var regOpened = / ?opened/g;
        var target = event.currentTarget;
        var open = target.getAttribute("data-opened");
        event.preventDefault();
        event.stopPropagation();
        if (open !== "true") {
            swapClass(target.parentNode, "opened", regOpened);
            fastdom.mutate(function() {
                this.innerHTML = "consolidate";
                this.setAttribute("data-opened", "true");
            }, target);
        } else {
            swapClass(target.parentNode, "", regOpened);
            fastdom.mutate(function() {
                this.innerHTML = "expand";
                this.setAttribute("data-opened", "false");
            }, target);
        }
    };
    var makeDetails = function(chapter, section, highlight) {
        return {
            chapter: chapter && chapter.number || null,
            chapterTitle: highlight["chapter.title"] || chapter && chapter.title || null,
            section: section && section.number || null,
            sectionTitle: highlight["section.title"] || section && section.title || null
        };
    };
    var makeScoreObj = function(score, key, allScores, upperMax) {
        var index = allScores.indexOf(score);
        var group = index > -1 ? " match-" + index : "";
        setMap("colors", key, index);
        return {
            key: key,
            url: document.location.protocol + "//that.pub/get/" + key.toLowerCase() + ".pdf",
            score: score,
            gravitas: upperMax < score || score >= 1 ? " pretty" + group : " boring" + group
        };
    };
    var organizeData = function(data, allScores, upperMax) {
        var regPubMatch = /productNo(?:\.exact|\.raw)?(?=\:|$)/;
        var regType = /chapter|section/;
        var source = data._source;
        var key = data.key;
        var score = data.score;
        var type = data._type;
        var _score = data._score;
        if (!source && key && score) {
            return makeScoreObj(score, key, allScores, upperMax);
        } else if (source.text) {
            var highlight = data.highlight;
            var number = source.number;
            var text = highlight["text.english2"];
            var rawText = source.text;
            var fullPub = source.productNo;
            var highlights = Object.keys(highlight);
            var fileFormat = type !== "form" ? ".pdf" : ".xfdl";
            if (regPubMatch.test(highlights.join(/:/))) {
                fullPub = highlight["productNo.exact"] || highlight["productNo.raw"] || highlight.productNo;
                fullPub = fullPub.shift();
            }
            var date = source.releaseDate ? source.releaseDate.substring(6, 8) + " " + months[source.releaseDate.substring(4, 6)] + " " + source.releaseDate.substring(0, 4) : source.publishedDate.substring(0, 2) + " " + months[source.publishedDate.substring(2, 4)] + " " + source.publishedDate.substring(4, 8);
            if (regType.test(type) && type.length == 7) {
                number = type.toTitle() + " " + data._source.number;
            }
            var index = maps.colors.get(data._source.productNo || data._source.pubName);
            var group = index && typeof index === "number" && (index > 0 || index < 5) ? " match-" + index : "";
            return {
                score: _score,
                gravitas: upperMax < data.score || data.score >= 1 ? " pretty" + group : " boring" + group,
                date: date,
                url: document.location.protocol + "//that.pub/get/" + data._source.productNo.toLowerCase() + fileFormat,
                fullPub: fullPub,
                title: highlight.title || data._source.title || null,
                rawTitle: source.title,
                sub: rawText ? number : "",
                details: makeDetails(source.chapter, source.section, highlight),
                rawText: rawText,
                concatText: Array.isArray(highlight.text) && highlight.text[0] || null,
                parts: Array.isArray(text) && text || null,
                fileFormat: fileFormat,
                type: rawText ? " content" : " doc"
            };
        }
        return null;
    };
    var makeRenderString = function(results, template, scores) {
        var upperMax = upperOutlier(scores);
        var count = results.length;
        var renderArr = new Array(count);
        var a = 0;
        var dataObj;
        for (;a < count; ++a) {
            dataObj = organizeData(results[a], scores, upperMax);
            renderArr[a] = template(dataObj);
        }
        return renderArr.join("");
    };
    var renderRelated = function(results, template) {
        var scores = maps.scores.get("related");
        return makeRenderString(results, template, scores);
    };
    var renderResults = function(results, template) {
        var scores = maps.scores.get("content");
        return makeRenderString(results, template, scores);
    };
})(this, this.document, _.template, Array.prototype.forEach);
//# sourceMappingURL=dist/js/script.js.map