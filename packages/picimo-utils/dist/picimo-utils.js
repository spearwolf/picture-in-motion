function findNextPowerOf2(t){for(var e=1;t>e;)e<<=1;return e}var _isObject=function(t){return"object"==typeof t?null!==t:"function"==typeof t},_anObject=function(t){if(!_isObject(t))throw TypeError(t+" is not an object!");return t},_fails=function(t){try{return!!t()}catch(t){return!0}},_descriptors=!_fails(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a});function createCommonjsModule(t,e){return t(e={exports:{}},e.exports),e.exports}var _global=createCommonjsModule(function(t){var e=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=e)}),document=_global.document,is=_isObject(document)&&_isObject(document.createElement),_domCreate=function(t){return is?document.createElement(t):{}},_ie8DomDefine=!_descriptors&&!_fails(function(){return 7!=Object.defineProperty(_domCreate("div"),"a",{get:function(){return 7}}).a}),_toPrimitive=function(t,e){if(!_isObject(t))return t;var r,n;if(e&&"function"==typeof(r=t.toString)&&!_isObject(n=r.call(t)))return n;if("function"==typeof(r=t.valueOf)&&!_isObject(n=r.call(t)))return n;if(!e&&"function"==typeof(r=t.toString)&&!_isObject(n=r.call(t)))return n;throw TypeError("Can't convert object to primitive value")},dP=Object.defineProperty,f=_descriptors?Object.defineProperty:function(t,e,r){if(_anObject(t),e=_toPrimitive(e,!0),_anObject(r),_ie8DomDefine)try{return dP(t,e,r)}catch(t){}if("get"in r||"set"in r)throw TypeError("Accessors not supported!");return"value"in r&&(t[e]=r.value),t},_objectDp={f:f},_propertyDesc=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}},_hide=_descriptors?function(t,e,r){return _objectDp.f(t,e,_propertyDesc(1,r))}:function(t,e,r){return t[e]=r,t},hasOwnProperty={}.hasOwnProperty,_has=function(t,e){return hasOwnProperty.call(t,e)},id=0,px=Math.random(),_uid=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++id+px).toString(36))},_core=createCommonjsModule(function(t){var e=t.exports={version:"2.5.7"};"number"==typeof __e&&(__e=e)}),_core_1=_core.version,_redefine=createCommonjsModule(function(t){var e=_uid("src"),r=Function.toString,n=(""+r).split("toString");_core.inspectSource=function(t){return r.call(t)},(t.exports=function(t,r,o,i){var c="function"==typeof o;c&&(_has(o,"name")||_hide(o,"name",r)),t[r]!==o&&(c&&(_has(o,e)||_hide(o,e,t[r]?""+t[r]:n.join(String(r)))),t===_global?t[r]=o:i?t[r]?t[r]=o:_hide(t,r,o):(delete t[r],_hide(t,r,o)))})(Function.prototype,"toString",function(){return"function"==typeof this&&this[e]||r.call(this)})}),_defined=function(t){if(null==t)throw TypeError("Can't call method on  "+t);return t},_library=!1,_shared=createCommonjsModule(function(t){var e=_global["__core-js_shared__"]||(_global["__core-js_shared__"]={});(t.exports=function(t,r){return e[t]||(e[t]=void 0!==r?r:{})})("versions",[]).push({version:_core.version,mode:_library?"pure":"global",copyright:"© 2018 Denis Pushkarev (zloirock.ru)"})}),_wks=createCommonjsModule(function(t){var e=_shared("wks"),r=_global.Symbol,n="function"==typeof r;(t.exports=function(t){return e[t]||(e[t]=n&&r[t]||(n?r:_uid)("Symbol."+t))}).store=e}),_fixReWks=function(t,e,r){var n=_wks(t),o=r(_defined,n,""[t]),i=o[0],c=o[1];_fails(function(){var e={};return e[n]=function(){return 7},7!=""[t](e)})&&(_redefine(String.prototype,t,i),_hide(RegExp.prototype,n,2==e?function(t,e){return c.call(t,this,e)}:function(t){return c.call(t,this)}))},toString={}.toString,_cof=function(t){return toString.call(t).slice(8,-1)},MATCH=_wks("match"),_isRegexp=function(t){var e;return _isObject(t)&&(void 0!==(e=t[MATCH])?!!e:"RegExp"==_cof(t))};_fixReWks("split",2,function(t,e,r){var n=_isRegexp,o=r,i=[].push;if("c"=="abbc".split(/(b)*/)[1]||4!="test".split(/(?:)/,-1).length||2!="ab".split(/(?:ab)*/).length||4!=".".split(/(.?)(.?)/).length||".".split(/()()/).length>1||"".split(/.?/).length){var c=void 0===/()??/.exec("")[1];r=function(t,e){var r=String(this);if(void 0===t&&0===e)return[];if(!n(t))return o.call(r,t,e);var s,a,u,_,l,f=[],p=(t.ignoreCase?"i":"")+(t.multiline?"m":"")+(t.unicode?"u":"")+(t.sticky?"y":""),h=0,d=void 0===e?4294967295:e>>>0,y=new RegExp(t.source,p+"g");for(c||(s=new RegExp("^"+y.source+"$(?!\\s)",p));(a=y.exec(r))&&!((u=a.index+a[0].length)>h&&(f.push(r.slice(h,a.index)),!c&&a.length>1&&a[0].replace(s,function(){for(l=1;l<arguments.length-2;l++)void 0===arguments[l]&&(a[l]=void 0)}),a.length>1&&a.index<r.length&&i.apply(f,a.slice(1)),_=a[0].length,h=u,f.length>=d));)y.lastIndex===a.index&&y.lastIndex++;return h===r.length?!_&&y.test("")||f.push(""):f.push(r.slice(h)),f.length>d?f.slice(0,d):f}}else"0".split(void 0,0).length&&(r=function(t,e){return void 0===t&&0===e?[]:o.call(this,t,e)});return[function(n,o){var i=t(this),c=null==n?void 0:n[e];return void 0!==c?c.call(n,i,o):r.call(String(i),n,o)},r]});var _aFunction=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t},_ctx=function(t,e,r){if(_aFunction(t),void 0===e)return t;switch(r){case 1:return function(r){return t.call(e,r)};case 2:return function(r,n){return t.call(e,r,n)};case 3:return function(r,n,o){return t.call(e,r,n,o)}}return function(){return t.apply(e,arguments)}},f$1={}.propertyIsEnumerable,_objectPie={f:f$1},_iobject=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==_cof(t)?t.split(""):Object(t)},_toIobject=function(t){return _iobject(_defined(t))},gOPD=Object.getOwnPropertyDescriptor,f$2=_descriptors?gOPD:function(t,e){if(t=_toIobject(t),e=_toPrimitive(e,!0),_ie8DomDefine)try{return gOPD(t,e)}catch(t){}if(_has(t,e))return _propertyDesc(!_objectPie.f.call(t,e),t[e])},_objectGopd={f:f$2},check=function(t,e){if(_anObject(t),!_isObject(e)&&null!==e)throw TypeError(e+": can't set as prototype!")},_setProto={set:Object.setPrototypeOf||("__proto__"in{}?function(t,e,r){try{(r=_ctx(Function.call,_objectGopd.f(Object.prototype,"__proto__").set,2))(t,[]),e=!(t instanceof Array)}catch(t){e=!0}return function(t,n){return check(t,n),e?t.__proto__=n:r(t,n),t}}({},!1):void 0),check:check},setPrototypeOf=_setProto.set,_inheritIfRequired=function(t,e,r){var n,o=e.constructor;return o!==r&&"function"==typeof o&&(n=o.prototype)!==r.prototype&&_isObject(n)&&setPrototypeOf&&setPrototypeOf(t,n),t},ceil=Math.ceil,floor=Math.floor,_toInteger=function(t){return isNaN(t=+t)?0:(t>0?floor:ceil)(t)},min=Math.min,_toLength=function(t){return t>0?min(_toInteger(t),9007199254740991):0},max=Math.max,min$1=Math.min,_toAbsoluteIndex=function(t,e){return(t=_toInteger(t))<0?max(t+e,0):min$1(t,e)},_arrayIncludes=function(t){return function(e,r,n){var o,i=_toIobject(e),c=_toLength(i.length),s=_toAbsoluteIndex(n,c);if(t&&r!=r){for(;c>s;)if((o=i[s++])!=o)return!0}else for(;c>s;s++)if((t||s in i)&&i[s]===r)return t||s||0;return!t&&-1}},shared=_shared("keys"),_sharedKey=function(t){return shared[t]||(shared[t]=_uid(t))},arrayIndexOf=_arrayIncludes(!1),IE_PROTO=_sharedKey("IE_PROTO"),_objectKeysInternal=function(t,e){var r,n=_toIobject(t),o=0,i=[];for(r in n)r!=IE_PROTO&&_has(n,r)&&i.push(r);for(;e.length>o;)_has(n,r=e[o++])&&(~arrayIndexOf(i,r)||i.push(r));return i},_enumBugKeys="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(","),hiddenKeys=_enumBugKeys.concat("length","prototype"),f$3=Object.getOwnPropertyNames||function(t){return _objectKeysInternal(t,hiddenKeys)},_objectGopn={f:f$3},_flags=function(){var t=_anObject(this),e="";return t.global&&(e+="g"),t.ignoreCase&&(e+="i"),t.multiline&&(e+="m"),t.unicode&&(e+="u"),t.sticky&&(e+="y"),e},SPECIES=_wks("species"),_setSpecies=function(t){var e=_global[t];_descriptors&&e&&!e[SPECIES]&&_objectDp.f(e,SPECIES,{configurable:!0,get:function(){return this}})},dP$1=_objectDp.f,gOPN=_objectGopn.f,$RegExp=_global.RegExp,Base=$RegExp,proto=$RegExp.prototype,re1=/a/g,re2=/a/g,CORRECT_NEW=new $RegExp(re1)!==re1;if(_descriptors&&(!CORRECT_NEW||_fails(function(){return re2[_wks("match")]=!1,$RegExp(re1)!=re1||$RegExp(re2)==re2||"/a/i"!=$RegExp(re1,"i")}))){$RegExp=function(t,e){var r=this instanceof $RegExp,n=_isRegexp(t),o=void 0===e;return!r&&n&&t.constructor===$RegExp&&o?t:_inheritIfRequired(CORRECT_NEW?new Base(n&&!o?t.source:t,e):Base((n=t instanceof $RegExp)?t.source:t,n&&o?_flags.call(t):e),r?this:proto,$RegExp)};for(var proxy=function(t){t in $RegExp||dP$1($RegExp,t,{configurable:!0,get:function(){return Base[t]},set:function(e){Base[t]=e}})},keys=gOPN(Base),i=0;keys.length>i;)proxy(keys[i++]);proto.constructor=$RegExp,$RegExp.prototype=proto,_redefine(_global,"RegExp",$RegExp)}_setSpecies("RegExp");var arrayAccessor=new RegExp(/(.+)\[(\d+)\]$/),getProp=function(t,e){var r=arrayAccessor.exec(e);if(r){var n=t[r[1]];return null!=n?n[parseInt(r[2],10)]:void 0}return t[e]},get=function t(e,r){if(null!=e){if(r in e)return e[r];var n=r.split(/[.]/),o=getProp(e,n.shift());return null!=o&&n.length?t(o,n.join(".")):o}},PROTOTYPE="prototype",$export=function(t,e,r){var n,o,i,c,s=t&$export.F,a=t&$export.G,u=t&$export.S,_=t&$export.P,l=t&$export.B,f=a?_global:u?_global[e]||(_global[e]={}):(_global[e]||{})[PROTOTYPE],p=a?_core:_core[e]||(_core[e]={}),h=p[PROTOTYPE]||(p[PROTOTYPE]={});for(n in a&&(r=e),r)i=((o=!s&&f&&void 0!==f[n])?f:r)[n],c=l&&o?_ctx(i,_global):_&&"function"==typeof i?_ctx(Function.call,i):i,f&&_redefine(f,n,i,t&$export.U),p[n]!=i&&_hide(p,n,c),_&&h[n]!=i&&(h[n]=i)};_global.core=_core,$export.F=1,$export.G=2,$export.S=4,$export.P=8,$export.B=16,$export.W=32,$export.U=64,$export.R=128;var _export=$export,_stringContext=function(t,e,r){if(_isRegexp(e))throw TypeError("String#"+r+" doesn't accept regex!");return String(_defined(t))},MATCH$1=_wks("match"),_failsIsRegexp=function(t){var e=/./;try{"/./"[t](e)}catch(r){try{return e[MATCH$1]=!1,!"/./"[t](e)}catch(t){}}return!0},STARTS_WITH="startsWith",$startsWith=""[STARTS_WITH];_export(_export.P+_export.F*_failsIsRegexp(STARTS_WITH),"String",{startsWith:function(t){var e=_stringContext(this,t,STARTS_WITH),r=_toLength(Math.min(arguments.length>1?arguments[1]:void 0,e.length)),n=String(t);return $startsWith?$startsWith.call(e,n,r):e.slice(r,r+n.length)===n}});var hexCol2rgb=function(t){var e=t.startsWith("#")?1:0;return[parseInt(t.substring(e,e+2),16),parseInt(t.substring(e+2,e+4),16),parseInt(t.substring(e+4,e+6),16)]},hexCol2rgba=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:255,r=t.startsWith("#")?1:0;return[parseInt(t.substring(r,r+2),16),parseInt(t.substring(r+2,r+4),16),parseInt(t.substring(r+4,r+6),16),e]},isPowerOf2=function(t){return 0!==t&&0==(t&t-1)},DEG2RAD=Math.PI/180,makeCircleCoords=function(t){for(var e=.5*(arguments.length>1&&void 0!==arguments[1]?arguments[1]:1),r=360/t,n=[],o=0,i=0;o<t;o++)n.push([e*Math.sin(i*DEG2RAD),e*Math.cos(i*DEG2RAD)]),i+=r;return n},maxOf=function(t,e){return t>e?t:e},UNSCOPABLES=_wks("unscopables"),ArrayProto=Array.prototype;null==ArrayProto[UNSCOPABLES]&&_hide(ArrayProto,UNSCOPABLES,{});var _addToUnscopables=function(t){ArrayProto[UNSCOPABLES][t]=!0},_iterStep=function(t,e){return{value:e,done:!!t}},_iterators={},_objectKeys=Object.keys||function(t){return _objectKeysInternal(t,_enumBugKeys)},_objectDps=_descriptors?Object.defineProperties:function(t,e){_anObject(t);for(var r,n=_objectKeys(e),o=n.length,i=0;o>i;)_objectDp.f(t,r=n[i++],e[r]);return t},document$1=_global.document,_html=document$1&&document$1.documentElement,IE_PROTO$1=_sharedKey("IE_PROTO"),Empty=function(){},PROTOTYPE$1="prototype",createDict=function(){var t,e=_domCreate("iframe"),r=_enumBugKeys.length;for(e.style.display="none",_html.appendChild(e),e.src="javascript:",(t=e.contentWindow.document).open(),t.write("<script>document.F=Object<\/script>"),t.close(),createDict=t.F;r--;)delete createDict[PROTOTYPE$1][_enumBugKeys[r]];return createDict()},_objectCreate=Object.create||function(t,e){var r;return null!==t?(Empty[PROTOTYPE$1]=_anObject(t),r=new Empty,Empty[PROTOTYPE$1]=null,r[IE_PROTO$1]=t):r=createDict(),void 0===e?r:_objectDps(r,e)},def=_objectDp.f,TAG=_wks("toStringTag"),_setToStringTag=function(t,e,r){t&&!_has(t=r?t:t.prototype,TAG)&&def(t,TAG,{configurable:!0,value:e})},IteratorPrototype={};_hide(IteratorPrototype,_wks("iterator"),function(){return this});var _iterCreate=function(t,e,r){t.prototype=_objectCreate(IteratorPrototype,{next:_propertyDesc(1,r)}),_setToStringTag(t,e+" Iterator")},_toObject=function(t){return Object(_defined(t))},IE_PROTO$2=_sharedKey("IE_PROTO"),ObjectProto=Object.prototype,_objectGpo=Object.getPrototypeOf||function(t){return t=_toObject(t),_has(t,IE_PROTO$2)?t[IE_PROTO$2]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?ObjectProto:null},ITERATOR=_wks("iterator"),BUGGY=!([].keys&&"next"in[].keys()),FF_ITERATOR="@@iterator",KEYS="keys",VALUES="values",returnThis=function(){return this},_iterDefine=function(t,e,r,n,o,i,c){_iterCreate(r,e,n);var s,a,u,_=function(t){if(!BUGGY&&t in h)return h[t];switch(t){case KEYS:case VALUES:return function(){return new r(this,t)}}return function(){return new r(this,t)}},l=e+" Iterator",f=o==VALUES,p=!1,h=t.prototype,d=h[ITERATOR]||h[FF_ITERATOR]||o&&h[o],y=d||_(o),g=o?f?_("entries"):y:void 0,b="Array"==e&&h.entries||d;if(b&&(u=_objectGpo(b.call(new t)))!==Object.prototype&&u.next&&(_setToStringTag(u,l,!0),"function"!=typeof u[ITERATOR]&&_hide(u,ITERATOR,returnThis)),f&&d&&d.name!==VALUES&&(p=!0,y=function(){return d.call(this)}),(BUGGY||p||!h[ITERATOR])&&_hide(h,ITERATOR,y),_iterators[e]=y,_iterators[l]=returnThis,o)if(s={values:f?y:_(VALUES),keys:i?y:_(KEYS),entries:g},c)for(a in s)a in h||_redefine(h,a,s[a]);else _export(_export.P+_export.F*(BUGGY||p),e,s);return s},es6_array_iterator=_iterDefine(Array,"Array",function(t,e){this._t=_toIobject(t),this._i=0,this._k=e},function(){var t=this._t,e=this._k,r=this._i++;return!t||r>=t.length?(this._t=void 0,_iterStep(1)):_iterStep(0,"keys"==e?r:"values"==e?t[r]:[r,t[r]])},"values");_iterators.Arguments=_iterators.Array,_addToUnscopables("keys"),_addToUnscopables("values"),_addToUnscopables("entries");for(var ITERATOR$1=_wks("iterator"),TO_STRING_TAG=_wks("toStringTag"),ArrayValues=_iterators.Array,DOMIterables={CSSRuleList:!0,CSSStyleDeclaration:!1,CSSValueList:!1,ClientRectList:!1,DOMRectList:!1,DOMStringList:!1,DOMTokenList:!0,DataTransferItemList:!1,FileList:!1,HTMLAllCollection:!1,HTMLCollection:!1,HTMLFormElement:!1,HTMLSelectElement:!1,MediaList:!0,MimeTypeArray:!1,NamedNodeMap:!1,NodeList:!0,PaintRequestList:!1,Plugin:!1,PluginArray:!1,SVGLengthList:!1,SVGNumberList:!1,SVGPathSegList:!1,SVGPointList:!1,SVGStringList:!1,SVGTransformList:!1,SourceBufferList:!1,StyleSheetList:!0,TextTrackCueList:!1,TextTrackList:!1,TouchList:!1},collections=_objectKeys(DOMIterables),i$1=0;i$1<collections.length;i$1++){var key,NAME=collections[i$1],explicit=DOMIterables[NAME],Collection=_global[NAME],proto$1=Collection&&Collection.prototype;if(proto$1&&(proto$1[ITERATOR$1]||_hide(proto$1,ITERATOR$1,ArrayValues),proto$1[TO_STRING_TAG]||_hide(proto$1,TO_STRING_TAG,NAME),_iterators[NAME]=ArrayValues,explicit))for(key in es6_array_iterator)proto$1[key]||_redefine(proto$1,key,es6_array_iterator[key],!0)}var _isArray=Array.isArray||function(t){return"Array"==_cof(t)},SPECIES$1=_wks("species"),_arraySpeciesConstructor=function(t){var e;return _isArray(t)&&("function"!=typeof(e=t.constructor)||e!==Array&&!_isArray(e.prototype)||(e=void 0),_isObject(e)&&null===(e=e[SPECIES$1])&&(e=void 0)),void 0===e?Array:e},_arraySpeciesCreate=function(t,e){return new(_arraySpeciesConstructor(t))(e)},_arrayMethods=function(t,e){var r=1==t,n=2==t,o=3==t,i=4==t,c=6==t,s=5==t||c,a=e||_arraySpeciesCreate;return function(e,u,_){for(var l,f,p=_toObject(e),h=_iobject(p),d=_ctx(u,_,3),y=_toLength(h.length),g=0,b=r?a(e,y):n?a(e,0):void 0;y>g;g++)if((s||g in h)&&(f=d(l=h[g],g,p),t))if(r)b[g]=f;else if(f)switch(t){case 3:return!0;case 5:return l;case 6:return g;case 2:b.push(l)}else if(i)return!1;return c?-1:o||i?i:b}},_strictMethod=function(t,e){return!!t&&_fails(function(){e?t.call(null,function(){},1):t.call(null)})},$forEach=_arrayMethods(0),STRICT=_strictMethod([].forEach,!0);_export(_export.P+_export.F*!STRICT,"Array",{forEach:function(t){return $forEach(this,t,arguments[1])}});var pick=function(t){return function(e){var r={};return e&&t.forEach(function(t){var n=e[t];void 0!==n&&(r[t]=n)}),r}},readOption=function(t,e,r,n){if(t){var o=t[e];if(void 0!==o)return o}return"function"==typeof r?r.call(null,n):r},sample=function(t){return t[Math.random()*t.length|0]},$map=_arrayMethods(1);_export(_export.P+_export.F*!_strictMethod([].map,!0),"Array",{map:function(t){return $map(this,t,arguments[1])}});var toFloatColors=function(t){return t.map(function(t){return t/255})};export{findNextPowerOf2,get,hexCol2rgb,hexCol2rgba,isPowerOf2,makeCircleCoords,maxOf,pick,readOption,sample,toFloatColors};
//# sourceMappingURL=picimo-utils.js.map
