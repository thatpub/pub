"use strict";function addEvent(a,b,c){return a.addEventListener(b,c,!1)}function removeEvent(a,b,c){return a.removeEventListener(b,c,!1)}function swapClass(a,b,c){""!==b&&"string"==typeof b?a.className=c.test(a.className)?a.className.replace(c,"")+" "+b:a.className+" "+b:a.className=a.className.replace(c,"")}function txt(a){return a&&"string"==typeof a&&a.length>0?document.createTextNode(a):void 0}function querySetup(a){return function(b){return{term:a,pubName:b.extract,noPubName:b.remove}}(a.toPubName())}function revealText(a){var b=regOpened.test(this.parentNode.className);return this.innerHTML="",b?(swapClass(this.parentNode,"",regOpened),this.innerHTML="consolidate"):(swapClass(this.parentNode,"opened",regOpened),this.innerHTML="expand"),a.preventDefault(),!1}function modalClose(a){a.target===a.currentTarget&&app.searchBoxToggle("close")}function more(a){return a&&a.preventDefault&&a.preventDefault(),app.loading.now!==!0&&swapClass(app.loader_,"loading",regLoad),submitQuery(handleResponse,document.cookie.placeContent||app.placeContent?"":app.term,"content","more",document.cookie.placeContent||app.placeContent,null,endLoading),!1}function infini(a){var b,c;app.infiniScroll=this.checked||!!this.checked,b=app.infiniScroll?"enabled":"disabled",c=app.infiniScroll?"Disable":"Enable",app.infiniLabel_.className=b,app.infiniLabel_.setAttribute("title",c+" infinite scroll"),b||this.removeAttribute("checked")}function scrollWheeler(a){var b=document.documentElement||document.body.parentNode,c=(b&&"number"==typeof b.ScrollTop?b:document.body).ScrollTop||window.pageYOffset,d=c-app.pos;app.infiniScroll===!0&&app.loading.now===!1&&app.loading.stillMore===!0&&d>0&&c>app.loading.currentHeight-1200&&(app.loading.now=!0,more()),app.pos=c}function handleResponse(a,b,c){var d,e,f,g,h=JSON.parse(a.responseText),i=h[0]||null,j=h[1]||null;if(app.isDone=!0,i&&0===i.hits.total&&j&&0===j.hits.total)return app.isFailure=!0,app.infiniScroll=!1,document.cookie="placeContent=;expires=Thu, 01 Jan 1970 00:00:01 GMT;",document.cookie="placeMeta=;expires=Thu, 01 Jan 1970 00:00:01 GMT;",app.message_.innerHTML=null,app.message_.appendChild(txt("Your search returned no results.\nGive 'er another go.")),swapClass(app.searchWrap_,"failed",regFail),c();var k=new Date(Date.now()+36e5);if(k=k.toUTCString(),i){var l=i.hits.hits.length;if(app.term_.innerHTML=app.term,app.total_.innerHTML=i.hits.total,app.placeContent=i._scroll_id,document.cookie="placeContent="+app.placeContent+"; expires="+k,"more"!==b){var m=i.aggregations.related_doc.buckets.length;for(window.scroll(0,0),e=0;l>e;++e)app.scoresContent[e]=i.hits.hits[e]._score;for(e=0;m>e;++e)app.scoresContent[e]=i.aggregations.related_doc.buckets[e].score;app.related_.innerHTML=app.addItem(i.aggregations.related_doc.buckets,app.relatedTemplate.textContent||app.relatedTemplate.innerText,app.scoresRelatives),app.results_.innerHTML=app.addItem(i.hits.hits,app.resultTemplate.textContent||app.resultTemplate.innerText,app.scoresContent),app.count_.innerHTML=l,app.relatedRect=app.related_.getBoundingClientRect(),app.bodyRect=document.body.getBoundingClientRect(),app.stickyBarPosition=Math.abs(app.relatedRect.top)+Math.abs(app.bodyRect.top)+Math.abs(app.relatedRect.height)}else{var n=app.scoresContent.length;for(e=0;l>e;++e)app.scoresContent[e+n]=i.hits.hits[e]._score;app.results_.innerHTML+=app.addItem(i.hits.hits,app.resultTemplate.textContent||app.resultTemplate.innerText,app.scoresContent),app.count_.innerHTML=app.scoresContent.length}for(f=document.querySelectorAll(".reveal-text"),g=f.length,d=0;g>d;++d)addEvent(f[d],"click",revealText);i.hits.hits.length<20?(swapClass(app.moreContent_,"hidden",regHidden),app.loading.stillMore=!1):(swapClass(app.moreContent_,"",regHidden),app.loading.stillMore=!0)}j&&(app.placeMeta=j._scroll_id,document.cookie="placeMeta="+app.placeMeta+"; expires="+k),app.resultsRect=app.results_.getBoundingClientRect(),app.loading.currentHeight=Math.abs(app.resultsRect.height),c()}function submitQuery(a,b,c,d,e,f,g){var h=new XMLHttpRequest,i=("https:"===document.location.protocol?"https://that.pub/find/":"http://find.that.pub/")+c+"/"+d,j={t:querySetup(b),g:e,s:f},k=JSON.stringify(j);h.onreadystatechange=function(){4===h.readyState&&200===h.status&&a(h,d,g)},h.open("POST",i,!0),h.setRequestHeader("Content-type","application/json"),h.send(k)}function endLoading(){return swapClass(app.loader_,"",regLoad),app.loading.now=!1,app.loading.init=!1,app.isSearchBoxOpen===!0&&app.searchBoxToggle("close"),!1}(function(){function a(a,b,c){if(b!==b){a:{for(b=a.length,c=(c||0)-1;++c<b;){var d=a[c];if(d!==d){a=c;break a}}a=-1}return a}for(c=(c||0)-1,d=a.length;++c<d;)if(a[c]===b)return c;return-1}function b(a){return"string"==typeof a?a:null==a?"":a+""}function c(a,b){for(var c=-1,d=a.length;++c<d&&-1<b.indexOf(a.charAt(c)););return c}function d(a,b){for(var c=a.length;c--&&-1<b.indexOf(a.charAt(c)););return c}function e(a){return _[a]}function f(a){return"\\"+ba[a]}function g(a){return a&&"object"==typeof a||!1}function h(a){return 160>=a&&a>=9&&13>=a||32==a||160==a||5760==a||6158==a||a>=8192&&(8202>=a||8232==a||8233==a||8239==a||8287==a||12288==a||65279==a)}function i(){}function j(a,b,c,d){return void 0!==a&&la.call(d,c)?a:b}function k(a,b,c){var d=Ca(b);if(!c){d||(d=a,a={}),c=-1;for(var e=d.length;++c<e;){var f=d[c];a[f]=b[f]}return a}for(e=-1,f=d.length;++e<f;){var g=d[e],h=a[g],i=c(h,b[g],g,a,b);(i===i?i===h:h!==h)&&(void 0!==h||g in a)||(a[g]=i)}return a}function l(a){var b,c=1,d=-1,e=a.length,c=null==c?0:+c||0;for(0>c&&(c=-c>e?0:e+c),b=void 0===b||b>e?e:+b||0,0>b&&(b+=e),e=c>b?0:b-c>>>0,c>>>=0,b=Array(e);++d<e;)b[d]=a[d+c];return b}function m(a,b){for(var c=-1,d=b.length,e=Array(d);++c<d;)e[c]=a[b[c]];return e}function n(a,b){return a=+a,b=null==b?ya:b,a>-1&&0==a%1&&b>a}function o(a,b,c){if(!w(c))return!1;var d=typeof b;return"number"==d?(d=c.length,d=p(d)&&n(b,d)):d="string"==d&&b in c,d&&c[b]===a}function p(a){return"number"==typeof a&&a>-1&&0==a%1&&ya>=a}function q(a){for(var b=A(a),c=b.length,d=c&&a.length,e=i.support,e=d&&p(d)&&(Ba(a)||e.nonEnumStrings&&z(a)||e.nonEnumArgs&&t(a)),f=-1,g=[];++f<c;){var h=b[f];(e&&n(h,d)||la.call(a,h))&&g.push(h)}return g}function r(b,c,d){var e=b?b.length:0;if(!e)return-1;if("number"==typeof d)d=0>d?ua(e+d,0):d||0;else if(d){if(d=0,e=b?b.length:d,"number"==typeof c&&c===c&&xa>=e){for(;e>d;){var f=d+e>>>1;b[f]<c?d=f+1:e=f}d=e}else{e=E,d=e(c);for(var f=0,g=b?b.length:0,h=d!==d,i=void 0===d;g>f;){var j=oa((f+g)/2),k=e(b[j]),l=k===k;(h?l:i?l&&void 0!==k:d>k)?f=j+1:g=j}d=va(g,wa)}return b=b[d],(c===c?c===b:b!==b)?d:-1}return a(b,c,d)}function s(b,c,d){var e=b?b.length:0;return p(e)||(b=B(b),e=b.length),e?(d="number"==typeof d?0>d?ua(e+d,0):d||0:0,"string"==typeof b||!Ba(b)&&z(b)?b=e>d&&-1<b.indexOf(c,d):(e=i.indexOf||r,e=e===r?a:e,b=-1<(b?e(b,c,d):e)),b):!1}function t(a){return p(g(a)?a.length:F)&&ma.call(a)==G||!1}function u(a){return g(a)&&"string"==typeof a.message&&ma.call(a)==H||!1}function v(a){return"function"==typeof a||!1}function w(a){var b=typeof a;return"function"==b||a&&"object"==b||!1}function x(a){return null==a?!1:ma.call(a)==I?na.test(ka.call(a)):g(a)&&(fa(a)?na:U).test(a)||!1}function y(a){return w(a)&&ma.call(a)==K||!1}function z(a){return"string"==typeof a||g(a)&&ma.call(a)==L||!1}function A(a){if(null==a)return[];w(a)||(a=Object(a));for(var b=a.length,c=i.support,b=b&&p(b)&&(Ba(a)||c.nonEnumStrings&&z(a)||c.nonEnumArgs&&t(a))&&b||0,d=a.constructor,e=-1,d=v(d)&&d.prototype||ia,f=d===a,g=Array(b),h=b>0,j=c.enumErrorProps&&(a===ha||a instanceof Error),k=c.enumPrototypes&&v(a);++e<b;)g[e]=e+"";for(var l in a)k&&"prototype"==l||j&&("message"==l||"name"==l)||h&&n(l,b)||"constructor"==l&&(f||!la.call(a,l))||g.push(l);if(c.nonEnumShadows&&a!==ia)for(b=a===ja?L:a===ha?H:ma.call(a),c=za[b]||za[J],b==J&&(d=ia),b=$.length;b--;)l=$[b],e=c[l],f&&e||(e?!la.call(a,l):a[l]===d[l])||g.push(l);return g}function B(a){return m(a,Ca(a))}function C(a){return(a=b(a))&&X.test(a)?a.replace(W,"\\$&"):a}function D(a){try{return a.apply(F,l(arguments))}catch(b){return u(b)?b:Error(b)}}function E(a){return a}var F,G="[object Arguments]",H="[object Error]",I="[object Function]",J="[object Object]",K="[object RegExp]",L="[object String]",M=/\b__p\+='';/g,N=/\b(__p\+=)''\+/g,O=/(__e\(.*?\)|\b__t\))\+'';/g,P=/[&<>"'`]/g,Q=RegExp(P.source),R=/<%=([\s\S]+?)%>/g,S=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,T=/\w*$/,U=/^\[object .+?Constructor\]$/,V=/($^)/,W=/[.*+?^${}()|[\]\/\\]/g,X=RegExp(W.source),Y=/\bthis\b/,Z=/['\n\r\u2028\u2029\\]/g,$="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" "),_={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","`":"&#96;"},aa={function:!0,object:!0},ba={"\\":"\\","'":"'","\n":"n","\r":"r","\u2028":"u2028","\u2029":"u2029"},ca=aa[typeof window]&&window!==(this&&this.window)?window:this,da=aa[typeof exports]&&exports&&!exports.nodeType&&exports,aa=aa[typeof module]&&module&&!module.nodeType&&module,ea=da&&aa&&"object"==typeof global&&global;!ea||ea.global!==ea&&ea.window!==ea&&ea.self!==ea||(ca=ea);var ea=aa&&aa.exports===da&&da,fa=function(){try{Object({toString:0}+"")}catch(a){return function(){return!1}}return function(a){return"function"!=typeof a.toString&&"string"==typeof(a+"")}}(),ga=Array.prototype,ha=Error.prototype,ia=Object.prototype,ja=String.prototype,ka=Function.prototype.toString,la=ia.hasOwnProperty,ma=ia.toString,na=RegExp("^"+C(ma).replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),oa=Math.floor,pa=ia.propertyIsEnumerable,qa=ga.splice,ra=x(ra=ca.Uint8Array)&&ra,sa=x(sa=Array.isArray)&&sa,ta=x(ta=Object.keys)&&ta,ua=Math.max,va=Math.min,ga=Math.pow(2,32)-1,wa=ga-1,xa=ga>>>1,ya=Math.pow(2,53)-1,za={};za["[object Array]"]=za["[object Date]"]=za["[object Number]"]={constructor:!0,toLocaleString:!0,toString:!0,valueOf:!0},za["[object Boolean]"]=za[L]={constructor:!0,toString:!0,valueOf:!0},za[H]=za[I]=za[K]={constructor:!0,toString:!0},za[J]={constructor:!0},function(a,b){for(var c=-1,d=a.length;++c<d&&!1!==b(a[c],c,a););return a}($,function(a){for(var b in za)if(la.call(za,b)){var c=za[b];c[a]=la.call(c,a)}});var Aa=i.support={};!function(a){function b(){this.x=1}var c={0:1,length:1},d=[];b.prototype={valueOf:1,y:1};for(var e in new b)d.push(e);Aa.argsTag=ma.call(arguments)==G,Aa.enumErrorProps=pa.call(ha,"message")||pa.call(ha,"name"),Aa.enumPrototypes=pa.call(b,"prototype"),Aa.funcDecomp=!x(ca.WinRTError)&&Y.test(function(){return this}),Aa.funcNames="string"==typeof Function.name,Aa.nonEnumStrings=!pa.call("x",0),Aa.nonEnumShadows=!/valueOf/.test(d),Aa.spliceObjects=(qa.call(c,0,1),!c[0]),Aa.unindexedChars="xx"!="x"[0]+Object("x")[0];try{Aa.nonEnumArgs=!pa.call(arguments,1)}catch(f){Aa.nonEnumArgs=!0}}(0,0),i.templateSettings={escape:/<%-([\s\S]+?)%>/g,evaluate:/<%([\s\S]+?)%>/g,interpolate:R,variable:"",imports:{_:i}},Aa.argsTag||(t=function(a){return p(g(a)?a.length:F)&&la.call(a,"callee")&&!pa.call(a,"callee")||!1});var Ba=sa||function(a){return g(a)&&p(a.length)&&"[object Array]"==ma.call(a)||!1};(v(/x/)||ra&&!v(ra))&&(v=function(a){return ma.call(a)==I});var Ca=ta?function(a){if(a)var b=a.constructor,c=a.length;return"function"==typeof b&&b.prototype===a||("function"==typeof a?i.support.enumPrototypes:c&&p(c))?q(a):w(a)?ta(a):[]}:q;i.keys=Ca,i.keysIn=A,i.values=B,i.attempt=D,i.escape=function(a){return(a=b(a))&&Q.test(a)?a.replace(P,e):a},i.escapeRegExp=C,i.identity=E,i.includes=s,i.indexOf=r,i.isArguments=t,i.isArray=Ba,i.isError=u,i.isFunction=v,i.isNative=x,i.isNumber=function(a){return"number"==typeof a||g(a)&&"[object Number]"==ma.call(a)||!1},i.isObject=w,i.isRegExp=y,i.isString=z,i.template=function(a,c,d){var e=i.templateSettings;d&&o(a,c,d)&&(c=d=null),a=b(a),c=k(k({},d||c),e,j),d=k(k({},c.imports),e.imports,j);var g,h,l=Ca(d),n=m(d,l),p=0;d=c.interpolate||V;var q="__p+='",r="sourceURL"in c?"//# sourceURL="+c.sourceURL+"\n":"";if(a.replace(RegExp((c.escape||V).source+"|"+d.source+"|"+(d===R?S:V).source+"|"+(c.evaluate||V).source+"|$","g"),function(b,c,d,e,i,j){return d||(d=e),q+=a.slice(p,j).replace(Z,f),c&&(g=!0,q+="'+__e("+c+")+'"),i&&(h=!0,q+="';"+i+";\n__p+='"),d&&(q+="'+((__t=("+d+"))==null?'':__t)+'"),p=j+b.length,b}),q+="';",(c=c.variable)||(q="with(obj){"+q+"}"),q=(h?q.replace(M,""):q).replace(N,"$1").replace(O,"$1;"),q="function("+(c||"obj")+"){"+(c?"":"obj||(obj={});")+"var __t,__p=''"+(g?",__e=_.escape":"")+(h?",__j=Array.prototype.join;function print(){__p+=__j.call(arguments,'')}":";")+q+"return __p}",c=D(function(){return Function(l,r+"return "+q).apply(F,n)}),c.source=q,u(c))throw c;return c},i.trim=function(a,e,f){var g=a;if(a=b(a),!a)return a;if(f?o(g,e,f):null==e){for(e=a.length;e--&&h(a.charCodeAt(e)););for(f=-1,g=a.length;++f<g&&h(a.charCodeAt(f)););return a.slice(f,e+1)}return e+="",a.slice(c(a,e),d(a,e)+1)},i.trunc=function(a,c,d){d&&o(a,c,d)&&(c=null);var e=30;if(d="...",null!=c)if(w(c)){var f="separator"in c?c.separator:f,e="length"in c?+c.length||0:e;d="omission"in c?b(c.omission):d}else e=+c||0;if(a=b(a),e>=a.length)return a;if(e-=d.length,1>e)return d;if(c=a.slice(0,e),null==f)return c+d;if(y(f)){if(a.slice(e).search(f)){var g,h=a.slice(0,e);for(f.global||(f=RegExp(f.source,(T.exec(f)||"")+"g")),f.lastIndex=0;a=f.exec(h);)g=a.index;c=c.slice(0,null==g?e:g)}}else a.indexOf(f,e)!=e&&(f=c.lastIndexOf(f),f>-1&&(c=c.slice(0,f)));return c+d},i.contains=s,i.include=s,i.VERSION="3.2.0","function"==typeof define&&"object"==typeof define.amd&&define.amd?(ca._=i,define(function(){return i})):da&&aa?ea?(aa.exports=i)._=i:da._=i:ca._=i}).call(this);var regPubMatch=/productNo(?:\.exact|\.raw)?(?=\:|$)/,regCheckInput=/[A-Za-z0-9\s\-\_\.\,\&]/g,regFixInput=/[^A-Za-z0-9\s\-\_\.\,\&]/g,regEmerge=/ ?emerge/g,regHidden=/ ?hidden/g,regLoad=/ ?loading/g,regSelected=/ ?selected/g,regOpened=/ ?opened/g,regFail=/ ?failed/g,regValidate=/ ?invalidated/g;String.prototype.toTitle=function(){return this.replace(/(?:\W?)\w\S*/g,function(a){return a.charAt(0).toUpperCase()+a.substr(1).toLowerCase()})},String.prototype.toPubName=function(){var a,b=0,c=[],d=/(?:\b[\-_a-zA-Z]{1,3})?[ \t\-]*(?:(?:[\.\-]|[0-9]+)+)+(?:_?(?:sup|SUP)[A-Za-z]*)?/g,e=/[\-\cI\v\0\f]$/m;return a=this.replace(d,function(a){return c&&c.length>0&&e.test(c[b-1])?c[b-1]+=a.toUpperCase().replace(/\s/g,""):c.push(a.toUpperCase().replace(/\s/g,"")),b+=1,""}),{extract:c,remove:a}},CSSStyleSheet.prototype.addCSSRule=function(a,b,c){"insertRule"in this?this.insertRule(a+"{"+b+"}",c):"addRule"in this&&this.addRule(a,b,c)},window.downloader=function(a){var b=document.createElement("a"),c=a.href||a.getAttribute("href")||"";if(""===c)return!1;b.download=a.download||a.getAttribute("download"),b.href=c,b.target="_blank";try{b.click()}catch(e){try{window.open(c)}catch(ee){window.location.href=c}}return!1};var months={"01":"Jan","02":"Feb","03":"Mar","04":"Apr","05":"May","06":"Jun","07":"Jul","08":"Aug","09":"Sep",10:"Oct",11:"Nov",12:"Dec"},App=function(){function a(a){var b=a.concat();b.sort(function(a,b){return a-b});var c=b[Math.floor(b.length/4)],d=b[Math.ceil(.75*b.length)],e=d-c,f=d+1.5*e;return b.filter(function(a){return a>f})}var b,c,d,e,f,g=document.getElementById("wrap"),h=document.getElementById("search-wrap"),i=document.getElementById("search-restore"),j=i.getElementsByTagName("svg")[0],k=i.getElementsByTagName("svg")[1],l=document.getElementById("page"),m=document.getElementById("page-header"),n=document.getElementById("results"),o=document.getElementById("summary"),p=document.getElementById("count"),q=document.getElementById("term"),r=document.getElementById("total"),s=document.getElementById("message"),t=document.getElementById("query"),u=document.getElementById("send"),v=document.getElementById("more-content"),w=document.getElementById("related"),x=document.getElementById("infini-label"),y=document.getElementById("infini-scroll"),z=document.getElementById("loader"),A=document.cookie.placeContent||"",B=document.cookie.placeMeta||"";return{wrap_:g,searchWrap_:h,searchRestore_:i,searchIcon_:j,xIcon_:k,page_:l,pageHeader_:m,results_:n,summary_:o,count_:p,term_:q,total_:r,message_:s,query_:t,send_:u,moreContent_:v,related_:w,placeContent:A,placeMeta:B,infiniLabel_:x,infiniScroll_:y,loader_:z,infiniScroll:!0,loading:{now:!1,stillMore:!1,currentHeight:0},bodyRect:b,relatedRect:c,resultsRect:d,relatedOffsetTop:e,stickyBarPosition:f,traveling:!1,pos:0,term:"",scoresContent:[],scoresRelatives:[],selectedResults:[],selectedTotal:0,colors:{},isSearchBoxOpen:null,isFailure:null,isDone:!1,organizeData:function(b,c,d){var e,f,g,h,i,j,k,l,m,n={},o=/chapter|section/;return!b._source&&b.key&&b.score?(e=_.indexOf(c,b.score),f=e>-1?" match-"+e:"",app.colors[b.key]=e,n={url:("https:"==document.location.protocol?"https://that.pub/get/":"http://get.that.pub/")+b.key.toLowerCase()+".pdf",key:b.key,score:b.score,gravitas:_.contains(d,b.score)||b.score>=1?" pretty"+f:" boring"+f}):b._source.text&&(g=b._source.number,j=b.highlight["text.english2"],i=b._source.text,h=b._source.productNo,l=Object.keys(b.highlight),m="form"!==b._type?".pdf":".xfdl",regPubMatch.test(l.join(":"))&&(h=b.highlight["productNo.exact"]||b.highlight["productNo.raw"]||b.highlight.productNo,h=h.shift()),k=b._source.releaseDate?b._source.releaseDate.substring(6,8)+" "+months[b._source.releaseDate.substring(4,6)]+" "+b._source.releaseDate.substring(0,4):b._source.publishedDate.substring(0,2)+" "+months[b._source.publishedDate.substring(2,4)]+" "+b._source.publishedDate.substring(4,8),o.test(b._type)&&7==b._type.length&&(g=b._type.toTitle()+" "+b._source.number),e=app.colors[b._source.productNo||b._source.pubName],f=_.isNumber(e)&&(e>=0||5>e)?" match-"+e:"",n={score:b._score,gravitas:_.contains(a(c),b._score)||b._score>=1?" pretty"+f:" boring"+f,date:k,url:("https:"==document.location.protocol?"https://that.pub/get/":"http://get.that.pub/")+b._source.productNo.toLowerCase()+m,fullPub:h,title:b.highlight.title||b._source.title||null,rawTitle:b._source.title,sub:i?g:"",details:{chapter:b._source.chapter&&b._source.chapter.number||null,chapterTitle:b.highlight["chapter.title"]||b._source.chapter&&b._source.chapter.title||null,section:b._source.section&&b._source.section.number||null,sectionTitle:b.highlight["section.title"]||b._source.section&&b._source.section.title||null},rawText:i,concatText:b.highlight.text&&b.highlight.text[0]||null,parts:Array.isArray(j)?j:null,fileFormat:m,type:i?" content":" doc"}),n||null},addItem:function(b,c,d){for(var e="",f=b.length,g=0,h=a(d);f>g;++g)e+=_.template(c)(this.organizeData(b[g],d,h));return e},searchBoxToggle:function(a){"close"===a&&(this.loading.init===!0||this.isDone===!0&&this.isFailure!==!0)?(this.infiniScroll=this.infiniScroll_?this.infiniScroll_.checked||!!this.infiniScroll_.checked:!0,swapClass(this.searchWrap_,"",regEmerge),this.searchIcon_.style.display="",this.xIcon_.style.display="none",this.isSearchBoxOpen=!1,this.message_.innerHTML=null):(this.isDone===!0&&this.isFailure===!0&&(this.isFailure=!1,this.isDone=!1,swapClass(this.searchWrap_,"",regFail)),swapClass(this.searchWrap_,"emerge",regEmerge),this.searchIcon_.style.display="none",this.xIcon_.style.display="",this.isSearchBoxOpen=!0,this.infiniScroll=!1)}}},app=new App;app.resultTemplate=document.getElementById("result-template"),app.relatedTemplate=document.getElementById("related-template"),addEvent(app.send_,"click",function(a){a.preventDefault();var b=_.trim(app.query_.value);return b?(swapClass(app.loader_,"loading",regLoad),app.term=_.trim(app.query_.value),submitQuery(handleResponse,app.term,"content","search",app.placeContent,app.placeMeta,endLoading),!1):(app.queryInvalidated=!0,swapClass(app.query_,"invalidated",regValidate),app.message_.innerHTML=null,app.message_.appendChild(txt("You gotta type something first.")),app.query_.focus(),!1)}),addEvent(app.query_,"focus",function(){return app.queryInvalidated!==!0?!1:void 0}),addEvent(app.query_,"keydown",function(a){}),addEvent(app.query_,"keypress",function(a){return app.queryInvalidated===!0&&(app.queryInvalidated=!1,swapClass(app.query_,"",regValidate),app.message_.innerHTML=""),13===a.which?(app.send_.click(),!1):void 0}),addEvent(document,"keyup",function(a){27===a.which&&(a.preventDefault(),app.isSearchBoxOpen===!0&&app.isFailure!==!0&&app.searchBoxToggle("close"))}),addEvent(app.moreContent_,"click",more),addEvent(app.searchRestore_,"click",function(a){if(a.preventDefault(),app.isSearchBoxOpen===!0){if(app.isDone!==!0||app.isFailure===!0)return!1;app.searchBoxToggle("close")}else app.searchBoxToggle("open"),app.query_.value=app.term||"",app.query_.focus();return!1}),addEvent(app.infiniScroll_,"change",infini),addEvent(window,"scroll",scrollWheeler),addEvent(window,"load",function(){app.isSearchBoxOpen=!0,app.isDone=!1,app.query_.focus();var a=document.createElement("link");a.rel="stylesheet",a.href=document.location.protocol+"//fonts.googleapis.com/css?family=Lato:300,700,300italic:latin";var b=document.getElementsByTagName("head")[0];b.parentNode.insertBefore(a,b)});