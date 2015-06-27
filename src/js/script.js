(function() {
  var undefined;
  var VERSION = "3.2.0";
  var DEFAULT_TRUNC_LENGTH = 30, DEFAULT_TRUNC_OMISSION = "...";
  var argsTag = "[object Arguments]", arrayTag = "[object Array]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", numberTag = "[object Number]", objectTag = "[object Object]", regexpTag = "[object RegExp]", stringTag = "[object String]";
  var reEmptyStringLeading = /\b__p \+= '';/g, reEmptyStringMiddle = /\b(__p \+=) '' \+/g, reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
  var reUnescapedHtml = /[&<>"'`]/g, reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
  var reEscape = /<%-([\s\S]+?)%>/g, reEvaluate = /<%([\s\S]+?)%>/g, reInterpolate = /<%=([\s\S]+?)%>/g;
  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
  var reFlags = /\w*$/;
  var reHostCtor = /^\[object .+?Constructor\]$/;
  var reNoMatch = /($^)/;
  var reRegExpChars = /[.*+?^${}()|[\]\/\\]/g, reHasRegExpChars = RegExp(reRegExpChars.source);
  var reThis = /\bthis\b/;
  var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
  var shadowProps = [ "constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf" ];
  var templateCounter = -1;
  var htmlEscapes = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "`": "&#96;"
  };
  var objectTypes = {
    "function": true,
    object: true
  };
  var stringEscapes = {
    "\\": "\\",
    "'": "'",
    "\n": "n",
    "\r": "r",
    "\u2028": "u2028",
    "\u2029": "u2029"
  };
  var root = objectTypes[typeof window] && window !== (this && this.window) ? window : this;
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;
  var freeGlobal = freeExports && freeModule && typeof global == "object" && global;
  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal)) {
    root = freeGlobal;
  }
  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;
  function baseIndexOf(array, value, fromIndex) {
    if (value !== value) {
      return indexOfNaN(array, fromIndex);
    }
    var index = (fromIndex || 0) - 1, length = array.length;
    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }
  function baseToString(value) {
    if (typeof value == "string") {
      return value;
    }
    return value == null ? "" : value + "";
  }
  function charsLeftIndex(string, chars) {
    var index = -1, length = string.length;
    while (++index < length && chars.indexOf(string.charAt(index)) > -1) {}
    return index;
  }
  function charsRightIndex(string, chars) {
    var index = string.length;
    while (index-- && chars.indexOf(string.charAt(index)) > -1) {}
    return index;
  }
  function escapeHtmlChar(chr) {
    return htmlEscapes[chr];
  }
  function escapeStringChar(chr) {
    return "\\" + stringEscapes[chr];
  }
  function indexOfNaN(array, fromIndex, fromRight) {
    var length = array.length, index = fromRight ? fromIndex || length : (fromIndex || 0) - 1;
    while (fromRight ? index-- : ++index < length) {
      var other = array[index];
      if (other !== other) {
        return index;
      }
    }
    return -1;
  }
  var isHostObject = function() {
    try {
      Object({
        toString: 0
      } + "");
    } catch (e) {
      return function() {
        return false;
      };
    }
    return function(value) {
      return typeof value.toString != "function" && typeof (value + "") == "string";
    };
  }();
  function isObjectLike(value) {
    return value && typeof value == "object" || false;
  }
  function isSpace(charCode) {
    return charCode <= 160 && (charCode >= 9 && charCode <= 13) || charCode == 32 || charCode == 160 || charCode == 5760 || charCode == 6158 || charCode >= 8192 && (charCode <= 8202 || charCode == 8232 || charCode == 8233 || charCode == 8239 || charCode == 8287 || charCode == 12288 || charCode == 65279);
  }
  function trimmedLeftIndex(string) {
    var index = -1, length = string.length;
    while (++index < length && isSpace(string.charCodeAt(index))) {}
    return index;
  }
  function trimmedRightIndex(string) {
    var index = string.length;
    while (index-- && isSpace(string.charCodeAt(index))) {}
    return index;
  }
  var arrayProto = Array.prototype, errorProto = Error.prototype, objectProto = Object.prototype, stringProto = String.prototype;
  var fnToString = Function.prototype.toString;
  var hasOwnProperty = objectProto.hasOwnProperty;
  var objToString = objectProto.toString;
  var reNative = RegExp("^" + escapeRegExp(objToString).replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
  var floor = Math.floor, propertyIsEnumerable = objectProto.propertyIsEnumerable, splice = arrayProto.splice, Uint8Array = isNative(Uint8Array = root.Uint8Array) && Uint8Array;
  var nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray, nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys, nativeMax = Math.max, nativeMin = Math.min;
  var MAX_ARRAY_LENGTH = Math.pow(2, 32) - 1, MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1, HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;
  var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;
  var nonEnumProps = {};
  nonEnumProps[arrayTag] = nonEnumProps[dateTag] = nonEnumProps[numberTag] = {
    constructor: true,
    toLocaleString: true,
    toString: true,
    valueOf: true
  };
  nonEnumProps[boolTag] = nonEnumProps[stringTag] = {
    constructor: true,
    toString: true,
    valueOf: true
  };
  nonEnumProps[errorTag] = nonEnumProps[funcTag] = nonEnumProps[regexpTag] = {
    constructor: true,
    toString: true
  };
  nonEnumProps[objectTag] = {
    constructor: true
  };
  arrayEach(shadowProps, function(key) {
    for (var tag in nonEnumProps) {
      if (hasOwnProperty.call(nonEnumProps, tag)) {
        var props = nonEnumProps[tag];
        props[key] = hasOwnProperty.call(props, key);
      }
    }
  });
  function lodash() {}
  var support = lodash.support = {};
  (function(x) {
    var Ctor = function() {
      this.x = 1;
    }, object = {
      "0": 1,
      length: 1
    }, props = [];
    Ctor.prototype = {
      valueOf: 1,
      y: 1
    };
    for (var key in new Ctor()) {
      props.push(key);
    }
    support.argsTag = objToString.call(arguments) == argsTag;
    support.enumErrorProps = propertyIsEnumerable.call(errorProto, "message") || propertyIsEnumerable.call(errorProto, "name");
    support.enumPrototypes = propertyIsEnumerable.call(Ctor, "prototype");
    support.funcDecomp = !isNative(root.WinRTError) && reThis.test(function() {
      return this;
    });
    support.funcNames = typeof Function.name == "string";
    support.nonEnumStrings = !propertyIsEnumerable.call("x", 0);
    support.nonEnumShadows = !/valueOf/.test(props);
    support.spliceObjects = (splice.call(object, 0, 1), !object[0]);
    support.unindexedChars = "x"[0] + Object("x")[0] != "xx";
    try {
      support.nonEnumArgs = !propertyIsEnumerable.call(arguments, 1);
    } catch (e) {
      support.nonEnumArgs = true;
    }
  })(0, 0);
  lodash.templateSettings = {
    escape: reEscape,
    evaluate: reEvaluate,
    interpolate: reInterpolate,
    variable: "",
    imports: {
      _: lodash
    }
  };
  function arrayEach(array, iteratee) {
    var index = -1, length = array.length;
    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }
  function assignOwnDefaults(objectValue, sourceValue, key, object) {
    return typeof objectValue == "undefined" || !hasOwnProperty.call(object, key) ? sourceValue : objectValue;
  }
  function baseAssign(object, source, customizer) {
    var props = keys(source);
    if (!customizer) {
      return baseCopy(source, object, props);
    }
    var index = -1, length = props.length;
    while (++index < length) {
      var key = props[index], value = object[key], result = customizer(value, source[key], key, object, source);
      if ((result === result ? result !== value : value === value) || typeof value == "undefined" && !(key in object)) {
        object[key] = result;
      }
    }
    return object;
  }
  function baseCopy(source, object, props) {
    if (!props) {
      props = object;
      object = {};
    }
    var index = -1, length = props.length;
    while (++index < length) {
      var key = props[index];
      object[key] = source[key];
    }
    return object;
  }
  function baseSlice(array, start, end) {
    var index = -1, length = array.length;
    start = start == null ? 0 : +start || 0;
    if (start < 0) {
      start = -start > length ? 0 : length + start;
    }
    end = typeof end == "undefined" || end > length ? length : +end || 0;
    if (end < 0) {
      end += length;
    }
    length = start > end ? 0 : end - start >>> 0;
    start >>>= 0;
    var result = Array(length);
    while (++index < length) {
      result[index] = array[index + start];
    }
    return result;
  }
  function baseValues(object, props) {
    var index = -1, length = props.length, result = Array(length);
    while (++index < length) {
      result[index] = object[props[index]];
    }
    return result;
  }
  function binaryIndex(array, value, retHighest) {
    var low = 0, high = array ? array.length : low;
    if (typeof value == "number" && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
      while (low < high) {
        var mid = low + high >>> 1, computed = array[mid];
        if (retHighest ? computed <= value : computed < value) {
          low = mid + 1;
        } else {
          high = mid;
        }
      }
      return high;
    }
    return binaryIndexBy(array, value, identity, retHighest);
  }
  function binaryIndexBy(array, value, iteratee, retHighest) {
    value = iteratee(value);
    var low = 0, high = array ? array.length : 0, valIsNaN = value !== value, valIsUndef = typeof value == "undefined";
    while (low < high) {
      var mid = floor((low + high) / 2), computed = iteratee(array[mid]), isReflexive = computed === computed;
      if (valIsNaN) {
        var setLow = isReflexive || retHighest;
      } else if (valIsUndef) {
        setLow = isReflexive && (retHighest || typeof computed != "undefined");
      } else {
        setLow = retHighest ? computed <= value : computed < value;
      }
      if (setLow) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    return nativeMin(high, MAX_ARRAY_INDEX);
  }
  function getIndexOf(collection, target, fromIndex) {
    var result = lodash.indexOf || indexOf;
    result = result === indexOf ? baseIndexOf : result;
    return collection ? result(collection, target, fromIndex) : result;
  }
  function isIndex(value, length) {
    value = +value;
    length = length == null ? MAX_SAFE_INTEGER : length;
    return value > -1 && value % 1 == 0 && value < length;
  }
  function isIterateeCall(value, index, object) {
    if (!isObject(object)) {
      return false;
    }
    var type = typeof index;
    if (type == "number") {
      var length = object.length, prereq = isLength(length) && isIndex(index, length);
    } else {
      prereq = type == "string" && index in object;
    }
    return prereq && object[index] === value;
  }
  function isLength(value) {
    return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }
  function shimKeys(object) {
    var props = keysIn(object), propsLength = props.length, length = propsLength && object.length, support = lodash.support;
    var allowIndexes = length && isLength(length) && (isArray(object) || support.nonEnumStrings && isString(object) || support.nonEnumArgs && isArguments(object));
    var index = -1, result = [];
    while (++index < propsLength) {
      var key = props[index];
      if (allowIndexes && isIndex(key, length) || hasOwnProperty.call(object, key)) {
        result.push(key);
      }
    }
    return result;
  }
  function indexOf(array, value, fromIndex) {
    var length = array ? array.length : 0;
    if (!length) {
      return -1;
    }
    if (typeof fromIndex == "number") {
      fromIndex = fromIndex < 0 ? nativeMax(length + fromIndex, 0) : fromIndex || 0;
    } else if (fromIndex) {
      var index = binaryIndex(array, value), other = array[index];
      return (value === value ? value === other : other !== other) ? index : -1;
    }
    return baseIndexOf(array, value, fromIndex);
  }
  function includes(collection, target, fromIndex) {
    var length = collection ? collection.length : 0;
    if (!isLength(length)) {
      collection = values(collection);
      length = collection.length;
    }
    if (!length) {
      return false;
    }
    if (typeof fromIndex == "number") {
      fromIndex = fromIndex < 0 ? nativeMax(length + fromIndex, 0) : fromIndex || 0;
    } else {
      fromIndex = 0;
    }
    return typeof collection == "string" || !isArray(collection) && isString(collection) ? fromIndex < length && collection.indexOf(target, fromIndex) > -1 : getIndexOf(collection, target, fromIndex) > -1;
  }
  function isArguments(value) {
    var length = isObjectLike(value) ? value.length : undefined;
    return isLength(length) && objToString.call(value) == argsTag || false;
  }
  if (!support.argsTag) {
    isArguments = function(value) {
      var length = isObjectLike(value) ? value.length : undefined;
      return isLength(length) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee") || false;
    };
  }
  var isArray = nativeIsArray || function(value) {
    return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag || false;
  };
  function isError(value) {
    return isObjectLike(value) && typeof value.message == "string" && objToString.call(value) == errorTag || false;
  }
  function isFunction(value) {
    return typeof value == "function" || false;
  }
  if (isFunction(/x/) || Uint8Array && !isFunction(Uint8Array)) {
    isFunction = function(value) {
      return objToString.call(value) == funcTag;
    };
  }
  function isObject(value) {
    var type = typeof value;
    return type == "function" || value && type == "object" || false;
  }
  function isNative(value) {
    if (value == null) {
      return false;
    }
    if (objToString.call(value) == funcTag) {
      return reNative.test(fnToString.call(value));
    }
    return isObjectLike(value) && (isHostObject(value) ? reNative : reHostCtor).test(value) || false;
  }
  function isNumber(value) {
    return typeof value == "number" || isObjectLike(value) && objToString.call(value) == numberTag || false;
  }
  function isRegExp(value) {
    return isObject(value) && objToString.call(value) == regexpTag || false;
  }
  function isString(value) {
    return typeof value == "string" || isObjectLike(value) && objToString.call(value) == stringTag || false;
  }
  var keys = !nativeKeys ? shimKeys : function(object) {
    if (object) {
      var Ctor = object.constructor, length = object.length;
    }
    if (typeof Ctor == "function" && Ctor.prototype === object || (typeof object == "function" ? lodash.support.enumPrototypes : length && isLength(length))) {
      return shimKeys(object);
    }
    return isObject(object) ? nativeKeys(object) : [];
  };
  function keysIn(object) {
    if (object == null) {
      return [];
    }
    if (!isObject(object)) {
      object = Object(object);
    }
    var length = object.length, support = lodash.support;
    length = length && isLength(length) && (isArray(object) || support.nonEnumStrings && isString(object) || support.nonEnumArgs && isArguments(object)) && length || 0;
    var Ctor = object.constructor, index = -1, proto = isFunction(Ctor) && Ctor.prototype || objectProto, isProto = proto === object, result = Array(length), skipIndexes = length > 0, skipErrorProps = support.enumErrorProps && (object === errorProto || object instanceof Error), skipProto = support.enumPrototypes && isFunction(object);
    while (++index < length) {
      result[index] = index + "";
    }
    for (var key in object) {
      if (!(skipProto && key == "prototype") && !(skipErrorProps && (key == "message" || key == "name")) && !(skipIndexes && isIndex(key, length)) && !(key == "constructor" && (isProto || !hasOwnProperty.call(object, key)))) {
        result.push(key);
      }
    }
    if (support.nonEnumShadows && object !== objectProto) {
      var tag = object === stringProto ? stringTag : object === errorProto ? errorTag : objToString.call(object), nonEnums = nonEnumProps[tag] || nonEnumProps[objectTag];
      if (tag == objectTag) {
        proto = objectProto;
      }
      length = shadowProps.length;
      while (length--) {
        key = shadowProps[length];
        var nonEnum = nonEnums[key];
        if (!(isProto && nonEnum) && (nonEnum ? hasOwnProperty.call(object, key) : object[key] !== proto[key])) {
          result.push(key);
        }
      }
    }
    return result;
  }
  function values(object) {
    return baseValues(object, keys(object));
  }
  function escape(string) {
    string = baseToString(string);
    return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string;
  }
  function escapeRegExp(string) {
    string = baseToString(string);
    return string && reHasRegExpChars.test(string) ? string.replace(reRegExpChars, "\\$&") : string;
  }
  function template(string, options, otherOptions) {
    var settings = lodash.templateSettings;
    if (otherOptions && isIterateeCall(string, options, otherOptions)) {
      options = otherOptions = null;
    }
    string = baseToString(string);
    options = baseAssign(baseAssign({}, otherOptions || options), settings, assignOwnDefaults);
    var imports = baseAssign(baseAssign({}, options.imports), settings.imports, assignOwnDefaults), importsKeys = keys(imports), importsValues = baseValues(imports, importsKeys);
    var isEscaping, isEvaluating, index = 0, interpolate = options.interpolate || reNoMatch, source = "__p += '";
    var reDelimiters = RegExp((options.escape || reNoMatch).source + "|" + interpolate.source + "|" + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + "|" + (options.evaluate || reNoMatch).source + "|$", "g");
    var sourceURL = "//# sourceURL=" + ("sourceURL" in options ? options.sourceURL : "lodash.templateSources[" + ++templateCounter + "]") + "\n";
    string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
      interpolateValue || (interpolateValue = esTemplateValue);
      source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);
      if (escapeValue) {
        isEscaping = true;
        source += "' +\n__e(" + escapeValue + ") +\n'";
      }
      if (evaluateValue) {
        isEvaluating = true;
        source += "';\n" + evaluateValue + ";\n__p += '";
      }
      if (interpolateValue) {
        source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";
    var variable = options.variable;
    if (!variable) {
      source = "with (obj) {\n" + source + "\n}\n";
    }
    source = (isEvaluating ? source.replace(reEmptyStringLeading, "") : source).replace(reEmptyStringMiddle, "$1").replace(reEmptyStringTrailing, "$1;");
    source = "function(" + (variable || "obj") + ") {\n" + (variable ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (isEscaping ? ", __e = _.escape" : "") + (isEvaluating ? ", __j = Array.prototype.join;\n" + "function print() { __p += __j.call(arguments, '') }\n" : ";\n") + source + "return __p\n}";
    var result = attempt(function() {
      return Function(importsKeys, sourceURL + "return " + source).apply(undefined, importsValues);
    });
    result.source = source;
    if (isError(result)) {
      throw result;
    }
    return result;
  }
  function trim(string, chars, guard) {
    var value = string;
    string = baseToString(string);
    if (!string) {
      return string;
    }
    if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
      return string.slice(trimmedLeftIndex(string), trimmedRightIndex(string) + 1);
    }
    chars = chars + "";
    return string.slice(charsLeftIndex(string, chars), charsRightIndex(string, chars) + 1);
  }
  function trunc(string, options, guard) {
    if (guard && isIterateeCall(string, options, guard)) {
      options = null;
    }
    var length = DEFAULT_TRUNC_LENGTH, omission = DEFAULT_TRUNC_OMISSION;
    if (options != null) {
      if (isObject(options)) {
        var separator = "separator" in options ? options.separator : separator;
        length = "length" in options ? +options.length || 0 : length;
        omission = "omission" in options ? baseToString(options.omission) : omission;
      } else {
        length = +options || 0;
      }
    }
    string = baseToString(string);
    if (length >= string.length) {
      return string;
    }
    var end = length - omission.length;
    if (end < 1) {
      return omission;
    }
    var result = string.slice(0, end);
    if (separator == null) {
      return result + omission;
    }
    if (isRegExp(separator)) {
      if (string.slice(end).search(separator)) {
        var match, newEnd, substring = string.slice(0, end);
        if (!separator.global) {
          separator = RegExp(separator.source, (reFlags.exec(separator) || "") + "g");
        }
        separator.lastIndex = 0;
        while (match = separator.exec(substring)) {
          newEnd = match.index;
        }
        result = result.slice(0, newEnd == null ? end : newEnd);
      }
    } else if (string.indexOf(separator, end) != end) {
      var index = result.lastIndexOf(separator);
      if (index > -1) {
        result = result.slice(0, index);
      }
    }
    return result + omission;
  }
  function attempt(func) {
    try {
      return func.apply(undefined, baseSlice(arguments, 1));
    } catch (e) {
      return isError(e) ? e : new Error(e);
    }
  }
  function identity(value) {
    return value;
  }
  lodash.keys = keys;
  lodash.keysIn = keysIn;
  lodash.values = values;
  lodash.attempt = attempt;
  lodash.escape = escape;
  lodash.escapeRegExp = escapeRegExp;
  lodash.identity = identity;
  lodash.includes = includes;
  lodash.indexOf = indexOf;
  lodash.isArguments = isArguments;
  lodash.isArray = isArray;
  lodash.isError = isError;
  lodash.isFunction = isFunction;
  lodash.isNative = isNative;
  lodash.isNumber = isNumber;
  lodash.isObject = isObject;
  lodash.isRegExp = isRegExp;
  lodash.isString = isString;
  lodash.template = template;
  lodash.trim = trim;
  lodash.trunc = trunc;
  lodash.contains = includes;
  lodash.include = includes;
  lodash.VERSION = VERSION;
  if (typeof define == "function" && typeof define.amd == "object" && define.amd) {
    root._ = lodash;
    define(function() {
      return lodash;
    });
  } else if (freeExports && freeModule) {
    if (moduleExports) {
      (freeModule.exports = lodash)._ = lodash;
    } else {
      freeExports._ = lodash;
    }
  } else {
    root._ = lodash;
  }
}).call(this);

(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof exports === "object") {
    var randomColor = factory();
    if (typeof module === "object" && module && module.exports) {
      exports = module.exports = randomColor;
    }
    exports.randomColor = randomColor;
  } else {
    root.randomColor = factory();
  }
})(this, function() {
  var colorDictionary = {};
  loadColorBounds();
  var randomColor = function(options) {
    options = options || {};
    var H, S, B;
    if (options.count != null) {
      var totalColors = options.count, colors = [];
      options.count = null;
      while (totalColors > colors.length) {
        colors.push(randomColor(options));
      }
      options.count = totalColors;
      return colors;
    }
    H = pickHue(options);
    S = pickSaturation(H, options);
    B = pickBrightness(H, S, options);
    return setFormat([ H, S, B ], options);
  };
  function pickHue(options) {
    var hueRange = getHueRange(options.hue), hue = randomWithin(hueRange);
    if (hue < 0) {
      hue = 360 + hue;
    }
    return hue;
  }
  function pickSaturation(hue, options) {
    if (options.luminosity === "random") {
      return randomWithin([ 0, 100 ]);
    }
    if (options.hue === "monochrome") {
      return 0;
    }
    var saturationRange = getSaturationRange(hue);
    var sMin = saturationRange[0], sMax = saturationRange[1];
    switch (options.luminosity) {
     case "bright":
      sMin = 55;
      break;

     case "dark":
      sMin = sMax - 10;
      break;

     case "light":
      sMax = 55;
      break;
    }
    return randomWithin([ sMin, sMax ]);
  }
  function pickBrightness(H, S, options) {
    var brightness, bMin = getMinimumBrightness(H, S), bMax = 100;
    switch (options.luminosity) {
     case "dark":
      bMax = bMin + 20;
      break;

     case "light":
      bMin = (bMax + bMin) / 2;
      break;

     case "random":
      bMin = 0;
      bMax = 100;
      break;
    }
    return randomWithin([ bMin, bMax ]);
  }
  function setFormat(hsv, options) {
    switch (options.format) {
     case "hsvArray":
      return hsv;

     case "hslArray":
      return HSVtoHSL(hsv);

     case "hsl":
      var hsl = HSVtoHSL(hsv);
      return "hsl(" + hsl[0] + ", " + hsl[1] + "%, " + hsl[2] + "%)";

     case "rgbArray":
      return HSVtoRGB(hsv);

     case "rgb":
      var rgb = HSVtoRGB(hsv);
      return "rgb(" + rgb.join(", ") + ")";

     default:
      return HSVtoHex(hsv);
    }
  }
  function getMinimumBrightness(H, S) {
    var lowerBounds = getColorInfo(H).lowerBounds;
    for (var i = 0; i < lowerBounds.length - 1; i++) {
      var s1 = lowerBounds[i][0], v1 = lowerBounds[i][1];
      var s2 = lowerBounds[i + 1][0], v2 = lowerBounds[i + 1][1];
      if (S >= s1 && S <= s2) {
        var m = (v2 - v1) / (s2 - s1), b = v1 - m * s1;
        return m * S + b;
      }
    }
    return 0;
  }
  function getHueRange(colorInput) {
    if (typeof parseInt(colorInput) === "number") {
      var number = parseInt(colorInput);
      if (number < 360 && number > 0) {
        return [ number, number ];
      }
    }
    if (typeof colorInput === "string") {
      if (colorDictionary[colorInput]) {
        var color = colorDictionary[colorInput];
        if (color.hueRange) {
          return color.hueRange;
        }
      }
    }
    return [ 0, 360 ];
  }
  function getSaturationRange(hue) {
    return getColorInfo(hue).saturationRange;
  }
  function getColorInfo(hue) {
    if (hue >= 334 && hue <= 360) {
      hue -= 360;
    }
    for (var colorName in colorDictionary) {
      var color = colorDictionary[colorName];
      if (color.hueRange && hue >= color.hueRange[0] && hue <= color.hueRange[1]) {
        return colorDictionary[colorName];
      }
    }
    return "Color not found";
  }
  function randomWithin(range) {
    return Math.floor(range[0] + Math.random() * (range[1] + 1 - range[0]));
  }
  function HSVtoHex(hsv) {
    var rgb = HSVtoRGB(hsv);
    function componentToHex(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }
    var hex = "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
    return hex;
  }
  function defineColor(name, hueRange, lowerBounds) {
    var sMin = lowerBounds[0][0], sMax = lowerBounds[lowerBounds.length - 1][0], bMin = lowerBounds[lowerBounds.length - 1][1], bMax = lowerBounds[0][1];
    colorDictionary[name] = {
      hueRange: hueRange,
      lowerBounds: lowerBounds,
      saturationRange: [ sMin, sMax ],
      brightnessRange: [ bMin, bMax ]
    };
  }
  function loadColorBounds() {
    defineColor("monochrome", null, [ [ 0, 0 ], [ 100, 0 ] ]);
    defineColor("red", [ -26, 18 ], [ [ 20, 100 ], [ 30, 92 ], [ 40, 89 ], [ 50, 85 ], [ 60, 78 ], [ 70, 70 ], [ 80, 60 ], [ 90, 55 ], [ 100, 50 ] ]);
    defineColor("orange", [ 19, 46 ], [ [ 20, 100 ], [ 30, 93 ], [ 40, 88 ], [ 50, 86 ], [ 60, 85 ], [ 70, 70 ], [ 100, 70 ] ]);
    defineColor("yellow", [ 47, 62 ], [ [ 25, 100 ], [ 40, 94 ], [ 50, 89 ], [ 60, 86 ], [ 70, 84 ], [ 80, 82 ], [ 90, 80 ], [ 100, 75 ] ]);
    defineColor("green", [ 63, 178 ], [ [ 30, 100 ], [ 40, 90 ], [ 50, 85 ], [ 60, 81 ], [ 70, 74 ], [ 80, 64 ], [ 90, 50 ], [ 100, 40 ] ]);
    defineColor("blue", [ 179, 257 ], [ [ 20, 100 ], [ 30, 86 ], [ 40, 80 ], [ 50, 74 ], [ 60, 60 ], [ 70, 52 ], [ 80, 44 ], [ 90, 39 ], [ 100, 35 ] ]);
    defineColor("purple", [ 258, 282 ], [ [ 20, 100 ], [ 30, 87 ], [ 40, 79 ], [ 50, 70 ], [ 60, 65 ], [ 70, 59 ], [ 80, 52 ], [ 90, 45 ], [ 100, 42 ] ]);
    defineColor("pink", [ 283, 334 ], [ [ 20, 100 ], [ 30, 90 ], [ 40, 86 ], [ 60, 84 ], [ 80, 80 ], [ 90, 75 ], [ 100, 73 ] ]);
  }
  function HSVtoRGB(hsv) {
    var h = hsv[0];
    if (h === 0) {
      h = 1;
    }
    if (h === 360) {
      h = 359;
    }
    h = h / 360;
    var s = hsv[1] / 100, v = hsv[2] / 100;
    var h_i = Math.floor(h * 6), f = h * 6 - h_i, p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s), r = 256, g = 256, b = 256;
    switch (h_i) {
     case 0:
      r = v, g = t, b = p;
      break;

     case 1:
      r = q, g = v, b = p;
      break;

     case 2:
      r = p, g = v, b = t;
      break;

     case 3:
      r = p, g = q, b = v;
      break;

     case 4:
      r = t, g = p, b = v;
      break;

     case 5:
      r = v, g = p, b = q;
      break;
    }
    var result = [ Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255) ];
    return result;
  }
  function HSVtoHSL(hsv) {
    var h = hsv[0], s = hsv[1] / 100, v = hsv[2] / 100, k = (2 - s) * v;
    return [ h, Math.round(s * v / (k < 1 ? k : 2 - k) * 1e4) / 100, k / 2 * 100 ];
  }
  return randomColor;
});

"use strict";

var regPubMatch = /productNo(?:\.exact|\.raw)?(?=\:|$)/, regEmerge = / ?emerge/g, regHidden = / ?hidden/g, regLoad = / ?loading/g, regSelected = / ?selected/g, regFiltered = / ?filtered/g, regOpened = / ?opened/g, regDone = / ?done|$/gm, regFail = / ?failed/g;

function addEvent(element, evt, fnc) {
  return element.addEventListener ? element.addEventListener(evt, fnc, false) : element.attachEvent("on" + evt, fnc);
}

function swapClass(element, string, regex) {
  if (string !== "") {
    element.className = regex.test(element.className) ? element.className.replace(regex, "") + " " + string : element.className + " " + string;
  } else {
    element.className = element.className.replace(regex, "");
  }
}

function removeEvent(element, evt, fnc) {
  return element.removeEventListener ? element.removeEventListener(evt, fnc, false) : element.detachEvent("on" + evt, fnc);
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

"use strict";

var App = function() {
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
  }, wrap_ = document.getElementById("wrap"), searchWrap_ = document.getElementById("search-wrap"), searchRestore_ = document.getElementById("search-restore"), page_ = document.getElementById("page"), results_ = document.getElementById("results"), summary_ = document.getElementById("summary"), count_ = document.getElementById("count"), term_ = document.getElementById("term"), total_ = document.getElementById("total"), query_ = document.getElementById("query"), send_ = document.getElementById("send"), moreMeta_ = document.getElementById("more-meta"), moreContent_ = document.getElementById("more-content"), related_ = document.getElementById("related"), infiniLabel_ = document.getElementById("infini-label"), infiniScroll_ = document.getElementById("infini-scroll"), infiniStatus_ = document.getElementById("infini-status"), loader_ = document.getElementById("loader"), placeContent = document.cookie.placeContent || "", placeMeta = document.cookie.placeMeta || "", bodyRect, relatedRect, resultsRect, relatedOffsetTop, stickyBarPosition;
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
    results_: results_,
    summary_: summary_,
    count_: count_,
    term_: term_,
    total_: total_,
    query_: query_,
    send_: send_,
    moreMeta_: moreMeta_,
    moreContent_: moreContent_,
    related_: related_,
    placeContent: placeContent,
    placeMeta: placeMeta,
    infiniLabel_: infiniLabel_,
    infiniScroll_: infiniScroll_,
    infiniStatus_: infiniStatus_,
    loader_: loader_,
    infiniScroll: true,
    done: false,
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
    searchToggle: function(visibility) {
      var screenHeight = window.innerHeight;
      if (visibility === "hidden") {
        snabbt(this.searchWrap_, {
          position: [ 0, -screenHeight, 0 ],
          easing: "easeOut",
          duration: 150
        });
        snabbt(this.wrap_, {
          opacity: 1,
          fromOpacity: .5,
          easing: "easeOut",
          delay: 150
        });
        swapClass(document.body, "", regEmerge);
        removeEvent(this.searchWrap_, "click", modalClose);
        this.infiniScroll = this.infiniScroll_ ? this.infiniScroll_.checked || !!this.infiniScroll_.checked : true;
      } else if (visibility === "visible") {
        snabbt(this.wrap_, {
          opacity: .5,
          fromOpacity: 1,
          easing: "easeOut"
        });
        snabbt(this.searchWrap_, {
          position: [ 0, 0, 0 ],
          easing: "easeOut",
          duration: 150
        });
        swapClass(document.body, "emerge", regEmerge);
        addEvent(this.searchWrap_, "click", modalClose);
        this.infiniScroll = false;
      }
    },
    isDone: function(done) {
      var answer;
      if (typeof done === "undefined") {
        answer = this.done;
      } else if (done === true) {
        swapClass(document.body, "done", regDone);
        this.done = done;
        answer = done;
      } else if (done === false) {
        swapClass(document.body, "failed", regFail);
        this.done = done;
        answer = done;
      }
      return answer;
    }
  };
};

"use strict";

var app = new App();

app.resultTemplate = document.getElementById("result-template");

app.relatedTemplate = document.getElementById("related-template");

function revealText(event) {
  var open = regOpened.test(this.parentNode.className);
  this.innerHTML = "";
  if (!open) {
    swapClass(this.parentNode, "opened", regOpened);
    this.appendChild(document.createTextNode("consolidate results"));
  } else {
    this.parentNode.className = this.parentNode.className.replace(regOpened, "");
    this.appendChild(document.createTextNode("expand to full paragraph"));
  }
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
  return false;
}

function dataResponse(httpRequest, action) {
  var response = JSON.parse(httpRequest.responseText);
  var content = response[0] || null;
  var meta = response[1] || null;
  var expires = new Date(Date.now() + 36e5);
  var a = 0, b = 0, reveals, rl;
  if (content && content.hits.total === 0 && meta && meta.hits.total === 0) {
    return app.isDone(false);
  }
  app.isDone(true);
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
        app.scoresContent[b] = content.hits.hits[b]["_score"];
      }
      for (b = 0; b < currentRelatives; ++b) {
        app.scoresContent[b] = content.aggregations.related_doc.buckets[b]["score"];
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
        app.scoresContent[b + contentGathered] = content.hits.hits[b]["_score"];
      }
      app.results_.innerHTML += app.addItem(content.hits.hits, app.resultTemplate.textContent || app.resultTemplate.innerText, app.scoresContent);
      app.count_.innerHTML = app.scoresContent.length;
    }
    reveals = document.querySelectorAll(".text > .reveal");
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
}

function sendData(responder, query, type, action, spot, dot, clbk) {
  var httpRequest = new XMLHttpRequest();
  var url = ("https:" == document.location.protocol ? "https://that.pub/find/" : "http://find.that.pub/") + type + "/" + action;
  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        responder(httpRequest, action);
        clbk(action === "more" ? null : "");
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
  event.preventDefault();
  swapClass(app.loader_, "loading", regLoad);
  sendData(dataResponse, document.cookie.placeContent || app.placeContent ? "" : app.term, "content", "more", document.cookie.placeContent || app.placeContent, null, endLoading);
  return false;
}

function modalClose(event) {
  if (event.target === event.currentTarget) {
    app.searchToggle("hidden");
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
  var status;
  app.infiniScroll = this.checked || !!this.checked;
  status = app.infiniScroll ? "enabled" : "disabled";
  app.infiniLabel_.className = status;
  app.infiniLabel_.setAttribute("title", "Infinite scroll " + status);
  if (!status) {
    this.removeAttribute("checked");
  }
}

function endLoading(el) {
  el = el === null ? app.moreContent_ : el === "" ? app.send_ : null;
  swapClass(app.loader_, "", regLoad);
  app.loading.now = false;
  if (el == app.send_) {
    app.searchToggle("hidden");
  }
}

"use strict";

addEvent(app.send_, "click", function(event) {
  if (event && event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
  if (!_.trim(app.query_.value)) {
    app.query_.focus();
    snabbt(app.query_, "attention", {
      rotation: [ 0, 0, Math.PI / 2 ],
      springConstant: 1.9,
      springDeacceleration: .9
    });
    return false;
  }
  swapClass(app.loader_, "loading", regLoad);
  app.term = _.trim(app.query_.value);
  sendData(dataResponse, app.term, "content", "search", app.placeContent, app.placeMeta, endLoading);
  return false;
});

addEvent(app.query_, "focus", function() {
  return false;
});

addEvent(app.query_, "keypress", function(event) {
  if (event.which === 13) {
    app.send_.click();
    return false;
  }
});

addEvent(document, "keyup", function(event) {
  if (event.which === 27) {
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
    if (regEmerge.test(document.body.className)) {
      app.searchToggle("hidden");
    } else {}
  }
});

addEvent(app.moreContent_, "click", more);

addEvent(app.moreMeta_, "click", function(event) {
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
  swapClass(app.loader_, "loading", regLoad);
  sendData(dataResponse, document.cookie.placeMeta || app.placeMeta ? "" : app.term, "meta", "more", null, document.cookie.placeMeta || app.placeMeta, endLoading);
  return false;
});

addEvent(app.searchRestore_, "click", function(event) {
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
  if (regEmerge.test(document.body.className)) {
    app.searchToggle("hidden");
  } else {
    app.searchToggle("visible");
    app.query_.value = app.term || "";
    app.query_.focus();
  }
  return false;
});

addEvent(app.infiniScroll_, "change", infini);

addEvent(window, "scroll", scrollWheeler);

addEvent(window, "load", function() {
  app.query_.focus();
  if (window.location.search !== "") {
    app.query_.value = decodeURIComponent(window.location.search.slice(3).replace(/\+(?!\%20)/g, "%20"));
    app.term = _.trim(app.query_.value);
    app.send_.click();
  }
  var l = document.createElement("link");
  l.rel = "stylesheet";
  l.href = "//fonts.googleapis.com/css?family=Droid+Serif:400,700|Ubuntu:300,400,700";
  var h = document.getElementsByTagName("head")[0];
  h.parentNode.insertBefore(l, h);
});