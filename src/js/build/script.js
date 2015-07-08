"use strict";function addEvent(a,b,c){return a.addEventListener(b,c,!1)}function removeEvent(a,b,c){return a.removeEventListener(b,c,!1)}function swapClass(a,b,c){""!==b&&"string"==typeof b?fastdom.write(function(){var d=a.className;return c.test(d)?!1:void(a.className+=" "+b)}):fastdom.write(function(){a.className=a.className.replace(c,"")})}function txt(a){return a&&"string"==typeof a&&a.length>0?document.createTextNode(a):void 0}function querySetup(a){return a?function(b){return{term:a,pubName:b.extract,noPubName:b.remove}}(a.toPubName()):{term:"",pubName:"",noPubName:""}}function filterOutliers(a){var b=a.concat();b.sort(function(a,b){return a-b});var c=b[Math.floor(b.length/4)],d=b[Math.ceil(.75*b.length)],e=d-c,f=d+1.5*e;return b.filter(function(a){return a>f})}function upperOutlier(a){var b=a.concat();b.sort(function(a,b){return a-b});var c=b[Math.floor(b.length/4)],d=b[Math.ceil(.75*b.length)],e=d-c,f=d+1.5*e;return f}function revealText(a){var b,c=this;return a.preventDefault(),b=c.getAttribute("data-opened"),"true"!==b?fastdom.write(function(){swapClass(c.parentNode,"opened",regOpened),c.innerHTML="consolidate",c.setAttribute("data-opened","true")}):fastdom.write(function(){swapClass(c.parentNode,"",regOpened),c.innerHTML="expand",c.setAttribute("data-opened","false")}),!1}function endLoading(){return app.loading.now=!1,app.loading.init=!1,swapClass(app.loader_,"",regLoad),app.isFailure!==!0&&app.searchBoxToggle("close"),!1}function modalClose(a){a.target===a.currentTarget&&app.searchBoxToggle("close")}function more(a){return a&&a.preventDefault&&a.preventDefault(),app.loading.now!==!0&&swapClass(app.loader_,"loading",regLoad),submitQuery("content","more",document.cookie.placeContent||app.placeContent,null),!1}function infini(){var a,b;app.infiniScroll=this.checked||!!this.checked,a=app.infiniScroll?"enabled":"disabled",b=app.infiniScroll?"Disable":"Enable",app.infiniLabel_.className=a,app.infiniLabel_.setAttribute("title",b+" infinite scroll"),a||this.removeAttribute("checked")}function scrollWheeler(){fastdom.read(function(){var a=(rootElement&&"number"==typeof rootElement.ScrollTop?rootElement:document.body).ScrollTop||window.pageYOffset,b=a-app.pos;app.infiniScroll===!0&&app.loading.now===!1&&app.loading.stillMore===!0&&b>0&&a>app.loading.currentHeight-1200&&(app.loading.now=!0,more()),app.pos=a})}function searchStart(a){a&&a.preventDefault&&a.preventDefault();var b=_.trim(app.query_.value);return app.isFailure=!1,app.isDone=!1,b?(app.term=b,swapClass(app.loader_,"loading",regLoad),submitQuery("content","search",app.placeContent,app.placeMeta),!1):(app.queryInvalidated=!0,swapClass(app.query_,"invalidated",regValidate),fastdom.write(function(){app.message_.innerHTML="You gotta type something first.",app.query_.focus()}),!1)}function handleResponse(a,b){var c,d,e,f=JSON.parse(a.responseText),g=f[0]||null,h=f[1]||null,i=0,j=0;if(app.isDone=!0,g&&0===g.hits.total&&h&&0===h.hits.total)return app.isFailure=!0,app.infiniScroll=!1,document.cookie="placeContent=;expires=Thu, 01 Jan 1970 00:00:01 GMT;",document.cookie="placeMeta=;expires=Thu, 01 Jan 1970 00:00:01 GMT;",fastdom.write(function(){app.message_.innerHTML="Your search returned no results.  Give 'er another go."}),swapClass(app.loader_,"",regLoad),swapClass(app.searchWrap_,"failed",regFail),!1;if(c=new Date(Date.now()+6e4),c=c.toUTCString(),fastdom.defer(function(){app.resetSearch&&clearTimeout(app.resetSearch),app.resetSearch=setTimeout(function(){swapClass(app.moreContent_,"hidden",regHidden),app.loading.stillMore=!1},6e4)}),g){var k=g.hits.hits.length;if(app.placeContent=g._scroll_id,document.cookie="placeContent="+app.placeContent+"; expires="+c,"more"!==b){var l=g.aggregations.related_doc.buckets.length;for(window.scroll(0,0),j=0;k>j;++j)app.scoresContent[j]=g.hits.hits[j]._score;for(j=0;l>j;++j)app.scoresRelatives[j]=g.aggregations.related_doc.buckets[j].score;fastdom.write(function(){app.term_.innerHTML=app.term,app.count_.innerHTML=g.hits.hits.length,app.total_.innerHTML=g.hits.total,app.related_.innerHTML=app.renderResults("relatives",g.aggregations.related_doc.buckets),app.results_.innerHTML=app.renderResults("results",g.hits.hits)})}else{for(j=0;k>j;++j)app.scoresContent.push(g.hits.hits[j]._score);fastdom.write(function(){app.count_.innerHTML=app.scoresContent.length,app.results_.innerHTML+=app.renderResults("results",g.hits.hits)})}fastdom.defer(function(){app.relatedRect=app.related_.getBoundingClientRect(),app.bodyRect=document.body.getBoundingClientRect(),app.stickyBarPosition=Math.abs(app.relatedRect.top)+Math.abs(app.bodyRect.top)+Math.abs(app.relatedRect.height)}),fastdom.defer(function(){for(d=document.querySelectorAll(".reveal-text"),e=d.length,i=0;e>i;++i)addEvent(d[i],"click",revealText)}),g.hits.hits.length<20?(app.loading.stillMore=!1,swapClass(app.moreContent_,"hidden",regHidden)):(app.loading.stillMore=!0,swapClass(app.moreContent_,"",regHidden))}h&&(app.placeMeta=h._scroll_id,document.cookie="placeMeta="+app.placeMeta+"; expires="+c),fastdom.defer(function(){app.resultsRect=app.results_.getBoundingClientRect(),app.loading.currentHeight=Math.abs(app.resultsRect.height),app.loading.now=!1}),app.searchBoxToggle("close"),swapClass(app.loader_,"",regLoad)}function submitQuery(a,b,c,d){var e=new XMLHttpRequest,f=app.term,g=document.location.protocol+"//that.pub/find/"+a+"/"+b,h={t:querySetup(f),g:c,s:d},i=JSON.stringify(h);e.onreadystatechange=function(){4===e.readyState&&200===e.status&&handleResponse(e,b)},e.open("POST",g,!0),e.setRequestHeader("Content-type","application/json"),e.send(i)}(function(){function a(a,b,c){if(b!==b){a:{for(b=a.length,c=(c||0)-1;++c<b;){var d=a[c];if(d!==d){a=c;break a}}a=-1}return a}for(c=(c||0)-1,d=a.length;++c<d;)if(a[c]===b)return c;return-1}function b(a){return"string"==typeof a?a:null==a?"":a+""}function c(a,b){for(var c=-1,d=a.length;++c<d&&-1<b.indexOf(a.charAt(c)););return c}function d(a,b){for(var c=a.length;c--&&-1<b.indexOf(a.charAt(c)););return c}function e(a){return _[a]}function f(a){return"\\"+ba[a]}function g(a){return a&&"object"==typeof a||!1}function h(a){return 160>=a&&a>=9&&13>=a||32==a||160==a||5760==a||6158==a||a>=8192&&(8202>=a||8232==a||8233==a||8239==a||8287==a||12288==a||65279==a)}function i(){}function j(a,b,c,d){return void 0!==a&&la.call(d,c)?a:b}function k(a,b,c){var d=Ca(b);if(!c){d||(d=a,a={}),c=-1;for(var e=d.length;++c<e;){var f=d[c];a[f]=b[f]}return a}for(e=-1,f=d.length;++e<f;){var g=d[e],h=a[g],i=c(h,b[g],g,a,b);(i===i?i===h:h!==h)&&(void 0!==h||g in a)||(a[g]=i)}return a}function l(a){var b,c=1,d=-1,e=a.length,c=null==c?0:+c||0;for(0>c&&(c=-c>e?0:e+c),b=void 0===b||b>e?e:+b||0,0>b&&(b+=e),e=c>b?0:b-c>>>0,c>>>=0,b=Array(e);++d<e;)b[d]=a[d+c];return b}function m(a,b){for(var c=-1,d=b.length,e=Array(d);++c<d;)e[c]=a[b[c]];return e}function n(a,b){return a=+a,b=null==b?ya:b,a>-1&&0==a%1&&b>a}function o(a,b,c){if(!w(c))return!1;var d=typeof b;return"number"==d?(d=c.length,d=p(d)&&n(b,d)):d="string"==d&&b in c,d&&c[b]===a}function p(a){return"number"==typeof a&&a>-1&&0==a%1&&ya>=a}function q(a){for(var b=A(a),c=b.length,d=c&&a.length,e=i.support,e=d&&p(d)&&(Ba(a)||e.nonEnumStrings&&z(a)||e.nonEnumArgs&&t(a)),f=-1,g=[];++f<c;){var h=b[f];(e&&n(h,d)||la.call(a,h))&&g.push(h)}return g}function r(b,c,d){var e=b?b.length:0;if(!e)return-1;if("number"==typeof d)d=0>d?ua(e+d,0):d||0;else if(d){if(d=0,e=b?b.length:d,"number"==typeof c&&c===c&&xa>=e){for(;e>d;){var f=d+e>>>1;b[f]<c?d=f+1:e=f}d=e}else{e=E,d=e(c);for(var f=0,g=b?b.length:0,h=d!==d,i=void 0===d;g>f;){var j=oa((f+g)/2),k=e(b[j]),l=k===k;(h?l:i?l&&void 0!==k:d>k)?f=j+1:g=j}d=va(g,wa)}return b=b[d],(c===c?c===b:b!==b)?d:-1}return a(b,c,d)}function s(b,c,d){var e=b?b.length:0;return p(e)||(b=B(b),e=b.length),e?(d="number"==typeof d?0>d?ua(e+d,0):d||0:0,"string"==typeof b||!Ba(b)&&z(b)?b=e>d&&-1<b.indexOf(c,d):(e=i.indexOf||r,e=e===r?a:e,b=-1<(b?e(b,c,d):e)),b):!1}function t(a){return p(g(a)?a.length:F)&&ma.call(a)==G||!1}function u(a){return g(a)&&"string"==typeof a.message&&ma.call(a)==H||!1}function v(a){return"function"==typeof a||!1}function w(a){var b=typeof a;return"function"==b||a&&"object"==b||!1}function x(a){return null==a?!1:ma.call(a)==I?na.test(ka.call(a)):g(a)&&(fa(a)?na:U).test(a)||!1}function y(a){return w(a)&&ma.call(a)==K||!1}function z(a){return"string"==typeof a||g(a)&&ma.call(a)==L||!1}function A(a){if(null==a)return[];w(a)||(a=Object(a));for(var b=a.length,c=i.support,b=b&&p(b)&&(Ba(a)||c.nonEnumStrings&&z(a)||c.nonEnumArgs&&t(a))&&b||0,d=a.constructor,e=-1,d=v(d)&&d.prototype||ia,f=d===a,g=Array(b),h=b>0,j=c.enumErrorProps&&(a===ha||a instanceof Error),k=c.enumPrototypes&&v(a);++e<b;)g[e]=e+"";for(var l in a)k&&"prototype"==l||j&&("message"==l||"name"==l)||h&&n(l,b)||"constructor"==l&&(f||!la.call(a,l))||g.push(l);if(c.nonEnumShadows&&a!==ia)for(b=a===ja?L:a===ha?H:ma.call(a),c=za[b]||za[J],b==J&&(d=ia),b=$.length;b--;)l=$[b],e=c[l],f&&e||(e?!la.call(a,l):a[l]===d[l])||g.push(l);return g}function B(a){return m(a,Ca(a))}function C(a){return(a=b(a))&&X.test(a)?a.replace(W,"\\$&"):a}function D(a){try{return a.apply(F,l(arguments))}catch(b){return u(b)?b:Error(b)}}function E(a){return a}var F,G="[object Arguments]",H="[object Error]",I="[object Function]",J="[object Object]",K="[object RegExp]",L="[object String]",M=/\b__p\+='';/g,N=/\b(__p\+=)''\+/g,O=/(__e\(.*?\)|\b__t\))\+'';/g,P=/[&<>"'`]/g,Q=RegExp(P.source),R=/<%=([\s\S]+?)%>/g,S=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,T=/\w*$/,U=/^\[object .+?Constructor\]$/,V=/($^)/,W=/[.*+?^${}()|[\]\/\\]/g,X=RegExp(W.source),Y=/\bthis\b/,Z=/['\n\r\u2028\u2029\\]/g,$="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" "),_={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","`":"&#96;"},aa={function:!0,object:!0},ba={"\\":"\\","'":"'","\n":"n","\r":"r","\u2028":"u2028","\u2029":"u2029"},ca=aa[typeof window]&&window!==(this&&this.window)?window:this,da=aa[typeof exports]&&exports&&!exports.nodeType&&exports,aa=aa[typeof module]&&module&&!module.nodeType&&module,ea=da&&aa&&"object"==typeof global&&global;!ea||ea.global!==ea&&ea.window!==ea&&ea.self!==ea||(ca=ea);var ea=aa&&aa.exports===da&&da,fa=function(){try{Object({toString:0}+"")}catch(a){return function(){return!1}}return function(a){return"function"!=typeof a.toString&&"string"==typeof(a+"")}}(),ga=Array.prototype,ha=Error.prototype,ia=Object.prototype,ja=String.prototype,ka=Function.prototype.toString,la=ia.hasOwnProperty,ma=ia.toString,na=RegExp("^"+C(ma).replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),oa=Math.floor,pa=ia.propertyIsEnumerable,qa=ga.splice,ra=x(ra=ca.Uint8Array)&&ra,sa=x(sa=Array.isArray)&&sa,ta=x(ta=Object.keys)&&ta,ua=Math.max,va=Math.min,ga=Math.pow(2,32)-1,wa=ga-1,xa=ga>>>1,ya=Math.pow(2,53)-1,za={};za["[object Array]"]=za["[object Date]"]=za["[object Number]"]={constructor:!0,toLocaleString:!0,toString:!0,valueOf:!0},za["[object Boolean]"]=za[L]={constructor:!0,toString:!0,valueOf:!0},za[H]=za[I]=za[K]={constructor:!0,toString:!0},za[J]={constructor:!0},function(a,b){for(var c=-1,d=a.length;++c<d&&!1!==b(a[c],c,a););return a}($,function(a){for(var b in za)if(la.call(za,b)){var c=za[b];c[a]=la.call(c,a)}});var Aa=i.support={};!function(){function a(){this.x=1}var b={0:1,length:1},c=[];a.prototype={valueOf:1,y:1};for(var d in new a)c.push(d);Aa.argsTag=ma.call(arguments)==G,Aa.enumErrorProps=pa.call(ha,"message")||pa.call(ha,"name"),Aa.enumPrototypes=pa.call(a,"prototype"),Aa.funcDecomp=!x(ca.WinRTError)&&Y.test(function(){return this}),Aa.funcNames="string"==typeof Function.name,Aa.nonEnumStrings=!pa.call("x",0),Aa.nonEnumShadows=!/valueOf/.test(c),Aa.spliceObjects=(qa.call(b,0,1),!b[0]),Aa.unindexedChars="xx"!="x"[0]+Object("x")[0];try{Aa.nonEnumArgs=!pa.call(arguments,1)}catch(f){Aa.nonEnumArgs=!0}}(0,0),i.templateSettings={escape:/<%-([\s\S]+?)%>/g,evaluate:/<%([\s\S]+?)%>/g,interpolate:R,variable:"",imports:{_:i}},Aa.argsTag||(t=function(a){return p(g(a)?a.length:F)&&la.call(a,"callee")&&!pa.call(a,"callee")||!1});var Ba=sa||function(a){return g(a)&&p(a.length)&&"[object Array]"==ma.call(a)||!1};(v(/x/)||ra&&!v(ra))&&(v=function(a){return ma.call(a)==I});var Ca=ta?function(a){if(a)var b=a.constructor,c=a.length;return"function"==typeof b&&b.prototype===a||("function"==typeof a?i.support.enumPrototypes:c&&p(c))?q(a):w(a)?ta(a):[]}:q;i.keys=Ca,i.keysIn=A,i.values=B,i.attempt=D,i.escape=function(a){return(a=b(a))&&Q.test(a)?a.replace(P,e):a},i.escapeRegExp=C,i.identity=E,i.includes=s,i.indexOf=r,i.isArguments=t,i.isArray=Ba,i.isError=u,i.isFunction=v,i.isNative=x,i.isNumber=function(a){return"number"==typeof a||g(a)&&"[object Number]"==ma.call(a)||!1},i.isObject=w,i.isRegExp=y,i.isString=z,i.template=function(a,c,d){var e=i.templateSettings;d&&o(a,c,d)&&(c=d=null),a=b(a),c=k(k({},d||c),e,j),d=k(k({},c.imports),e.imports,j);var g,h,l=Ca(d),n=m(d,l),p=0;d=c.interpolate||V;var q="__p+='",r="sourceURL"in c?"//# sourceURL="+c.sourceURL+"\n":"";if(a.replace(RegExp((c.escape||V).source+"|"+d.source+"|"+(d===R?S:V).source+"|"+(c.evaluate||V).source+"|$","g"),function(b,c,d,e,i,j){return d||(d=e),q+=a.slice(p,j).replace(Z,f),c&&(g=!0,q+="'+__e("+c+")+'"),i&&(h=!0,q+="';"+i+";\n__p+='"),d&&(q+="'+((__t=("+d+"))==null?'':__t)+'"),p=j+b.length,b}),q+="';",(c=c.variable)||(q="with(obj){"+q+"}"),q=(h?q.replace(M,""):q).replace(N,"$1").replace(O,"$1;"),q="function("+(c||"obj")+"){"+(c?"":"obj||(obj={});")+"var __t,__p=''"+(g?",__e=_.escape":"")+(h?",__j=Array.prototype.join;function print(){__p+=__j.call(arguments,'')}":";")+q+"return __p}",c=D(function(){return Function(l,r+"return "+q).apply(F,n)}),c.source=q,u(c))throw c;return c},i.trim=function(a,e,f){var g=a;if(a=b(a),!a)return a;if(f?o(g,e,f):null==e){for(e=a.length;e--&&h(a.charCodeAt(e)););for(f=-1,g=a.length;++f<g&&h(a.charCodeAt(f)););return a.slice(f,e+1)}return e+="",a.slice(c(a,e),d(a,e)+1)},i.trunc=function(a,c,d){d&&o(a,c,d)&&(c=null);var e=30;if(d="...",null!=c)if(w(c)){var f="separator"in c?c.separator:f,e="length"in c?+c.length||0:e;d="omission"in c?b(c.omission):d}else e=+c||0;if(a=b(a),e>=a.length)return a;if(e-=d.length,1>e)return d;if(c=a.slice(0,e),null==f)return c+d;if(y(f)){if(a.slice(e).search(f)){var g,h=a.slice(0,e);for(f.global||(f=RegExp(f.source,(T.exec(f)||"")+"g")),f.lastIndex=0;a=f.exec(h);)g=a.index;c=c.slice(0,null==g?e:g)}}else a.indexOf(f,e)!=e&&(f=c.lastIndexOf(f),f>-1&&(c=c.slice(0,f)));return c+d},i.contains=s,i.include=s,i.VERSION="3.2.0","function"==typeof define&&"object"==typeof define.amd&&define.amd?(ca._=i,define(function(){return i})):da&&aa?ea?(aa.exports=i)._=i:da._=i:ca._=i}).call(this),function(a){function b(){this.frames=[],this.lastId=0,this.raf=c,this.batch={hash:{},read:[],write:[],mode:null}}var c=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.msRequestAnimationFrame||function(a){return window.setTimeout(a,1e3/60)};b.prototype.read=function(a,b){var c=this.add("read",a,b),d=c.id;this.batch.read.push(c.id);var e="reading"===this.batch.mode||this.batch.scheduled;return e?d:(this.scheduleBatch(),d)},b.prototype.write=function(a,b){var c=this.add("write",a,b),d=this.batch.mode,e=c.id;this.batch.write.push(c.id);var f="writing"===d||"reading"===d||this.batch.scheduled;return f?e:(this.scheduleBatch(),e)},b.prototype.defer=function(a,b,c){"function"==typeof a&&(c=b,b=a,a=1);var d=this,e=a-1;return this.schedule(e,function(){d.run({fn:b,ctx:c})})},b.prototype.clear=function(a){if("function"==typeof a)return this.clearFrame(a);a=+a;var b=this.batch.hash[a];if(b){var c=this.batch[b.type],d=c.indexOf(a);delete this.batch.hash[a],~d&&c.splice(d,1)}},b.prototype.clearFrame=function(a){var b=this.frames.indexOf(a);~b&&this.frames.splice(b,1)},b.prototype.scheduleBatch=function(){var a=this;this.schedule(0,function(){a.batch.scheduled=!1,a.runBatch()}),this.batch.scheduled=!0},b.prototype.uniqueId=function(){return++this.lastId},b.prototype.flush=function(a){for(var b;b=a.shift();)this.run(this.batch.hash[b])},b.prototype.runBatch=function(){try{this.batch.mode="reading",this.flush(this.batch.read),this.batch.mode="writing",this.flush(this.batch.write),this.batch.mode=null}catch(e){throw this.runBatch(),e}},b.prototype.add=function(a,b,c){var d=this.uniqueId();return this.batch.hash[d]={id:d,fn:b,ctx:c,type:a}},b.prototype.run=function(a){var b=a.ctx||this,c=a.fn;if(delete this.batch.hash[a.id],!this.onError)return c.call(b);try{c.call(b)}catch(e){this.onError(e)}},b.prototype.loop=function(){var a=this,b=this.raf;this.looping||(b(function c(){var d=a.frames.shift();a.frames.length?b(c):a.looping=!1,d&&d()}),this.looping=!0)},b.prototype.schedule=function(a,b){return this.frames[a]?this.schedule(a+1,b):(this.loop(),this.frames[a]=b)},a=a||new b,"undefined"!=typeof module&&module.exports?module.exports=a:"function"==typeof define&&define.amd?define(function(){return a}):window.fastdom=a}(window.fastdom);var regPubMatch=/productNo(?:\.exact|\.raw)?(?=\:|$)/,regCheckInput=/[A-Za-z0-9\s\-\_\.\,\&]/g,regFixInput=/[^A-Za-z0-9\s\-\_\.\,\&]/g,regEmerge=/ ?emerge/g,regHidden=/ ?hidden/g,regLoad=/ ?loading/g,regSelected=/ ?selected/g,regOpened=/ ?opened/g,regFail=/ ?failed/g,regValidate=/ ?invalidated/g,regQueryPubName=/(?:\b[\-_a-zA-Z]{1,3})?[ \t\-]*(?:(?:[\.\-]|[0-9]+)+)+(?:_?(?:sup|SUP)[A-Za-z]*)?/g,regEOLDashCheck=/[\-\cI\v\0\f]$/m,regPreTitle=/(?:\W?)\w\S*/g;String.prototype.toTitle=function(){return this.replace(regPreTitle,function(a){return a.charAt(0).toUpperCase()+a.substr(1).toLowerCase()})},String.prototype.toPubName=function(){var a,b=0,c=[];return a=this.replace(regQueryPubName,function(a){return c&&c.length>0&&regEOLDashCheck.test(c[b-1])?c[b-1]+=a.toUpperCase().replace(/\s/g,""):c.push(a.toUpperCase().replace(/\s/g,"")),b+=1,""}),{remove:a,extract:c}},CSSStyleSheet.prototype.addCSSRule=function(a,b,c){"insertRule"in this?this.insertRule(a+"{"+b+"}",c):"addRule"in this&&this.addRule(a,b,c)},window.downloader=function(a){var b=document.createElement("a"),c=a.href||a.getAttribute("href")||"";if(""===c)return!1;b.download=a.download||a.getAttribute("download"),b.href=c,b.target="_blank";try{b.click()}catch(e){try{window.open(c)}catch(ee){window.location.href=c}}return!1};var months={"01":"Jan","02":"Feb","03":"Mar","04":"Apr","05":"May","06":"Jun","07":"Jul","08":"Aug","09":"Sep",10:"Oct",11:"Nov",12:"Dec"},app=function(a,b,c){var d,e,f,g,h,i=b.getElementById("wrap"),j=b.getElementById("search-wrap"),k=b.getElementById("search-restore"),l=k.getElementsByTagName("svg")[0],m=k.getElementsByTagName("svg")[1],n=b.getElementById("page"),o=b.getElementById("page-header"),p=b.getElementById("related"),q=b.getElementById("results"),r=b.getElementById("count"),s=b.getElementById("term"),t=b.getElementById("total"),u=b.getElementById("message"),v=b.getElementById("query"),w=b.getElementById("send"),x=b.getElementById("more-content"),y=b.getElementById("infini-label"),z=b.getElementById("infini-scroll"),A=b.getElementById("loader"),B=b.getElementById("result-template"),C=b.getElementById("related-template"),D=b.cookie.placeContent||"",E=b.cookie.placeMeta||"";return{wrap_:i,searchWrap_:j,searchRestore_:k,searchIcon_:l,xIcon_:m,page_:n,pageHeader_:o,related_:p,results_:q,count_:r,term_:s,total_:t,message_:u,query_:v,send_:w,moreContent_:x,placeContent:D,placeMeta:E,infiniLabel_:y,infiniScroll_:z,loader_:A,resultTemplate:c.template(B.textContent||B.innerText),relatedTemplate:c.template(C.textContent||C.innerText),infiniScroll:!0,loading:{now:!1,stillMore:!1,currentHeight:0},bodyRect:d,relatedRect:e,resultsRect:f,relatedOffsetTop:g,stickyBarPosition:h,traveling:!1,pos:0,term:"",scoresContent:[],scoresRelatives:[],selectedResults:[],selectedTotal:0,colors:{},isSearchBoxOpen:null,isFailure:null,isDone:!1,organizeData:function(a,c,d){var e,f,g,h,i,j,k,l,m,n={},o=/chapter|section/;return!a._source&&a.key&&a.score?(e=c.indexOf(a.score),f=e>-1?" match-"+e:"",app.colors[a.key]=e,n={key:a.key,url:b.location.protocol+"//get.that.pub/"+a.key.toLowerCase()+".pdf",score:a.score,gravitas:d<a.score||a.score>=1?" pretty"+f:" boring"+f}):a._source.text&&(g=a._source.number,j=a.highlight["text.english2"],i=a._source.text,h=a._source.productNo,l=Object.keys(a.highlight),m="form"!==a._type?".pdf":".xfdl",regPubMatch.test(l.join(":"))&&(h=a.highlight["productNo.exact"]||a.highlight["productNo.raw"]||a.highlight.productNo,h=h.shift()),k=a._source.releaseDate?a._source.releaseDate.substring(6,8)+" "+months[a._source.releaseDate.substring(4,6)]+" "+a._source.releaseDate.substring(0,4):a._source.publishedDate.substring(0,2)+" "+months[a._source.publishedDate.substring(2,4)]+" "+a._source.publishedDate.substring(4,8),o.test(a._type)&&7==a._type.length&&(g=a._type.toTitle()+" "+a._source.number),e=app.colors[a._source.productNo||a._source.pubName],f=e&&"number"==typeof e&&(e>=0||5>e)?" match-"+e:"",n={score:a._score,gravitas:d<a.score||a.score>=1?" pretty"+f:" boring"+f,date:k,url:b.location.protocol+"//get.that.pub/"+a._source.productNo.toLowerCase()+m,fullPub:h,title:a.highlight.title||a._source.title||null,rawTitle:a._source.title,sub:i?g:"",details:{chapter:a._source.chapter&&a._source.chapter.number||null,chapterTitle:a.highlight["chapter.title"]||a._source.chapter&&a._source.chapter.title||null,section:a._source.section&&a._source.section.number||null,sectionTitle:a.highlight["section.title"]||a._source.section&&a._source.section.title||null},rawText:i,concatText:a.highlight.text&&a.highlight.text[0]||null,parts:Array.isArray(j)?j:null,fileFormat:m,type:i?" content":" doc"}),n||null},renderResults:function(a,b){var c,d,e,f="",g={},h=b.length,i=0;for("results"===a?(d=this.resultTemplate,e=this.scoresContent,c=upperOutlier(e)):(d=this.relatedTemplate,e=this.scoresRelatives,c=upperOutlier(e));h>i;++i)g=this.organizeData(b[i],e,c),f+=d(g);return f},searchBoxToggle:function(a){var b=this;"close"===a?(this.infiniScroll=this.infiniScroll_?this.infiniScroll_.checked||!!this.infiniScroll_.checked:!0,this.term=c.trim(this.query_.value),swapClass(this.searchWrap_,"",regEmerge),swapClass(this.searchWrap_,"",regFail),fastdom.write(function(){b.searchIcon_.style.display="",b.xIcon_.style.display="none",b.message_.innerHTML=""}),this.isSearchBoxOpen=!1):"open"===a&&(fastdom.write(function(){b.query_.value=b.term,b.searchIcon_.style.display="none",b.xIcon_.style.display=""}),swapClass(this.searchWrap_,"emerge",regEmerge),this.isFailure===!0&&(this.isFailure=!1,swapClass(this.searchWrap_,"failed",regFail)),this.isSearchBoxOpen=!0,this.infiniScroll=!1)}}}(this,this.document,_);!function(a,b,c,d,e){addEvent(d.send_,"click",searchStart),addEvent(d.query_,"focus",function(){return d.queryInvalidated!==!0?!1:e}),addEvent(d.query_,"keypress",function(a){return d.queryInvalidated===!0&&(d.queryInvalidated=!1,swapClass(d.query_,"",regValidate),d.message_.innerHTML=""),13===a.which?(searchStart(a),!1):e}),addEvent(b,"keyup",function(a){27===a.which&&(a.preventDefault(),d.isSearchBoxOpen===!0&&d.isFailure!==!0&&d.searchBoxToggle("close"))}),addEvent(d.moreContent_,"click",more),addEvent(d.searchRestore_,"click",function(a){if(a.preventDefault(),d.isSearchBoxOpen===!0){if(d.isDone!==!0||d.isFailure===!0)return!1;d.searchBoxToggle("close")}else d.searchBoxToggle("open"),d.query_.value=d.term,d.query_.focus();return!1}),addEvent(d.infiniScroll_,"change",infini),addEvent(a,"scroll",scrollWheeler),addEvent(a,"load",function(){d.isSearchBoxOpen=!0,d.isDone=!1,d.query_.focus()})}(this,this.document,_,app);