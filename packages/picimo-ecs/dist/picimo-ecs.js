import{generateUuid}from"@picimo/core";import eventize from"@spearwolf/eventize";function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function _createClass(t,e,r){return e&&_defineProperties(t.prototype,e),r&&_defineProperties(t,r),t}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&_setPrototypeOf(t,e)}function _getPrototypeOf(t){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function _setPrototypeOf(t,e){return(_setPrototypeOf=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function _assertThisInitialized(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function _possibleConstructorReturn(t,e){return!e||"object"!=typeof e&&"function"!=typeof e?_assertThisInitialized(t):e}function _toConsumableArray(t){return _arrayWithoutHoles(t)||_iterableToArray(t)||_nonIterableSpread()}function _arrayWithoutHoles(t){if(Array.isArray(t)){for(var e=0,r=new Array(t.length);e<t.length;e++)r[e]=t[e];return r}}function _iterableToArray(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function createCommonjsModule(t,e){return t(e={exports:{}},e.exports),e.exports}var _global=createCommonjsModule(function(t){var e=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=e)}),_core=createCommonjsModule(function(t){var e=t.exports={version:"2.5.7"};"number"==typeof __e&&(__e=e)}),_core_1=_core.version,_isObject=function(t){return"object"==typeof t?null!==t:"function"==typeof t},_anObject=function(t){if(!_isObject(t))throw TypeError(t+" is not an object!");return t},_fails=function(t){try{return!!t()}catch(t){return!0}},_descriptors=!_fails(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a}),document=_global.document,is=_isObject(document)&&_isObject(document.createElement),_domCreate=function(t){return is?document.createElement(t):{}},_ie8DomDefine=!_descriptors&&!_fails(function(){return 7!=Object.defineProperty(_domCreate("div"),"a",{get:function(){return 7}}).a}),_toPrimitive=function(t,e){if(!_isObject(t))return t;var r,n;if(e&&"function"==typeof(r=t.toString)&&!_isObject(n=r.call(t)))return n;if("function"==typeof(r=t.valueOf)&&!_isObject(n=r.call(t)))return n;if(!e&&"function"==typeof(r=t.toString)&&!_isObject(n=r.call(t)))return n;throw TypeError("Can't convert object to primitive value")},dP=Object.defineProperty,f=_descriptors?Object.defineProperty:function(t,e,r){if(_anObject(t),e=_toPrimitive(e,!0),_anObject(r),_ie8DomDefine)try{return dP(t,e,r)}catch(t){}if("get"in r||"set"in r)throw TypeError("Accessors not supported!");return"value"in r&&(t[e]=r.value),t},_objectDp={f:f},_propertyDesc=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}},_hide=_descriptors?function(t,e,r){return _objectDp.f(t,e,_propertyDesc(1,r))}:function(t,e,r){return t[e]=r,t},hasOwnProperty={}.hasOwnProperty,_has=function(t,e){return hasOwnProperty.call(t,e)},id$1=0,px=Math.random(),_uid=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++id$1+px).toString(36))},_redefine=createCommonjsModule(function(t){var e=_uid("src"),r=Function.toString,n=(""+r).split("toString");_core.inspectSource=function(t){return r.call(t)},(t.exports=function(t,r,o,i){var c="function"==typeof o;c&&(_has(o,"name")||_hide(o,"name",r)),t[r]!==o&&(c&&(_has(o,e)||_hide(o,e,t[r]?""+t[r]:n.join(String(r)))),t===_global?t[r]=o:i?t[r]?t[r]=o:_hide(t,r,o):(delete t[r],_hide(t,r,o)))})(Function.prototype,"toString",function(){return"function"==typeof this&&this[e]||r.call(this)})}),_aFunction=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t},_ctx=function(t,e,r){if(_aFunction(t),void 0===e)return t;switch(r){case 1:return function(r){return t.call(e,r)};case 2:return function(r,n){return t.call(e,r,n)};case 3:return function(r,n,o){return t.call(e,r,n,o)}}return function(){return t.apply(e,arguments)}},PROTOTYPE="prototype",$export=function(t,e,r){var n,o,i,c,a=t&$export.F,s=t&$export.G,u=t&$export.S,f=t&$export.P,_=t&$export.B,l=s?_global:u?_global[e]||(_global[e]={}):(_global[e]||{})[PROTOTYPE],p=s?_core:_core[e]||(_core[e]={}),y=p[PROTOTYPE]||(p[PROTOTYPE]={});for(n in s&&(r=e),r)i=((o=!a&&l&&void 0!==l[n])?l:r)[n],c=_&&o?_ctx(i,_global):f&&"function"==typeof i?_ctx(Function.call,i):i,l&&_redefine(l,n,i,t&$export.U),p[n]!=i&&_hide(p,n,c),f&&y[n]!=i&&(y[n]=i)};_global.core=_core,$export.F=1,$export.G=2,$export.S=4,$export.P=8,$export.B=16,$export.W=32,$export.U=64,$export.R=128;var _export=$export,toString={}.toString,_cof=function(t){return toString.call(t).slice(8,-1)},_iobject=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==_cof(t)?t.split(""):Object(t)},_defined=function(t){if(null==t)throw TypeError("Can't call method on  "+t);return t},_toObject=function(t){return Object(_defined(t))},ceil=Math.ceil,floor=Math.floor,_toInteger=function(t){return isNaN(t=+t)?0:(t>0?floor:ceil)(t)},min=Math.min,_toLength=function(t){return t>0?min(_toInteger(t),9007199254740991):0},_isArray=Array.isArray||function(t){return"Array"==_cof(t)},_library=!1,_shared=createCommonjsModule(function(t){var e=_global["__core-js_shared__"]||(_global["__core-js_shared__"]={});(t.exports=function(t,r){return e[t]||(e[t]=void 0!==r?r:{})})("versions",[]).push({version:_core.version,mode:_library?"pure":"global",copyright:"© 2018 Denis Pushkarev (zloirock.ru)"})}),_wks=createCommonjsModule(function(t){var e=_shared("wks"),r=_global.Symbol,n="function"==typeof r;(t.exports=function(t){return e[t]||(e[t]=n&&r[t]||(n?r:_uid)("Symbol."+t))}).store=e}),SPECIES=_wks("species"),_arraySpeciesConstructor=function(t){var e;return _isArray(t)&&("function"!=typeof(e=t.constructor)||e!==Array&&!_isArray(e.prototype)||(e=void 0),_isObject(e)&&null===(e=e[SPECIES])&&(e=void 0)),void 0===e?Array:e},_arraySpeciesCreate=function(t,e){return new(_arraySpeciesConstructor(t))(e)},_arrayMethods=function(t,e){var r=1==t,n=2==t,o=3==t,i=4==t,c=6==t,a=5==t||c,s=e||_arraySpeciesCreate;return function(e,u,f){for(var _,l,p=_toObject(e),y=_iobject(p),h=_ctx(u,f,3),d=_toLength(y.length),m=0,v=r?s(e,d):n?s(e,0):void 0;d>m;m++)if((a||m in y)&&(l=h(_=y[m],m,p),t))if(r)v[m]=l;else if(l)switch(t){case 3:return!0;case 5:return _;case 6:return m;case 2:v.push(_)}else if(i)return!1;return c?-1:o||i?i:v}},_strictMethod=function(t,e){return!!t&&_fails(function(){e?t.call(null,function(){},1):t.call(null)})},$forEach=_arrayMethods(0),STRICT=_strictMethod([].forEach,!0);_export(_export.P+_export.F*!STRICT,"Array",{forEach:function(t){return $forEach(this,t,arguments[1])}}),_export(_export.S,"Array",{isArray:_isArray});var UNSCOPABLES=_wks("unscopables"),ArrayProto=Array.prototype;null==ArrayProto[UNSCOPABLES]&&_hide(ArrayProto,UNSCOPABLES,{});var _addToUnscopables=function(t){ArrayProto[UNSCOPABLES][t]=!0},_iterStep=function(t,e){return{value:e,done:!!t}},_iterators={},_toIobject=function(t){return _iobject(_defined(t))},max=Math.max,min$1=Math.min,_toAbsoluteIndex=function(t,e){return(t=_toInteger(t))<0?max(t+e,0):min$1(t,e)},_arrayIncludes=function(t){return function(e,r,n){var o,i=_toIobject(e),c=_toLength(i.length),a=_toAbsoluteIndex(n,c);if(t&&r!=r){for(;c>a;)if((o=i[a++])!=o)return!0}else for(;c>a;a++)if((t||a in i)&&i[a]===r)return t||a||0;return!t&&-1}},shared=_shared("keys"),_sharedKey=function(t){return shared[t]||(shared[t]=_uid(t))},arrayIndexOf=_arrayIncludes(!1),IE_PROTO=_sharedKey("IE_PROTO"),_objectKeysInternal=function(t,e){var r,n=_toIobject(t),o=0,i=[];for(r in n)r!=IE_PROTO&&_has(n,r)&&i.push(r);for(;e.length>o;)_has(n,r=e[o++])&&(~arrayIndexOf(i,r)||i.push(r));return i},_enumBugKeys="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(","),_objectKeys=Object.keys||function(t){return _objectKeysInternal(t,_enumBugKeys)},_objectDps=_descriptors?Object.defineProperties:function(t,e){_anObject(t);for(var r,n=_objectKeys(e),o=n.length,i=0;o>i;)_objectDp.f(t,r=n[i++],e[r]);return t},document$1=_global.document,_html=document$1&&document$1.documentElement,IE_PROTO$1=_sharedKey("IE_PROTO"),Empty=function(){},PROTOTYPE$1="prototype",createDict=function(){var t,e=_domCreate("iframe"),r=_enumBugKeys.length;for(e.style.display="none",_html.appendChild(e),e.src="javascript:",(t=e.contentWindow.document).open(),t.write("<script>document.F=Object<\/script>"),t.close(),createDict=t.F;r--;)delete createDict[PROTOTYPE$1][_enumBugKeys[r]];return createDict()},_objectCreate=Object.create||function(t,e){var r;return null!==t?(Empty[PROTOTYPE$1]=_anObject(t),r=new Empty,Empty[PROTOTYPE$1]=null,r[IE_PROTO$1]=t):r=createDict(),void 0===e?r:_objectDps(r,e)},def=_objectDp.f,TAG=_wks("toStringTag"),_setToStringTag=function(t,e,r){t&&!_has(t=r?t:t.prototype,TAG)&&def(t,TAG,{configurable:!0,value:e})},IteratorPrototype={};_hide(IteratorPrototype,_wks("iterator"),function(){return this});var _iterCreate=function(t,e,r){t.prototype=_objectCreate(IteratorPrototype,{next:_propertyDesc(1,r)}),_setToStringTag(t,e+" Iterator")},IE_PROTO$2=_sharedKey("IE_PROTO"),ObjectProto=Object.prototype,_objectGpo=Object.getPrototypeOf||function(t){return t=_toObject(t),_has(t,IE_PROTO$2)?t[IE_PROTO$2]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?ObjectProto:null},ITERATOR=_wks("iterator"),BUGGY=!([].keys&&"next"in[].keys()),FF_ITERATOR="@@iterator",KEYS="keys",VALUES="values",returnThis=function(){return this},_iterDefine=function(t,e,r,n,o,i,c){_iterCreate(r,e,n);var a,s,u,f=function(t){if(!BUGGY&&t in y)return y[t];switch(t){case KEYS:case VALUES:return function(){return new r(this,t)}}return function(){return new r(this,t)}},_=e+" Iterator",l=o==VALUES,p=!1,y=t.prototype,h=y[ITERATOR]||y[FF_ITERATOR]||o&&y[o],d=h||f(o),m=o?l?f("entries"):d:void 0,v="Array"==e&&y.entries||h;if(v&&(u=_objectGpo(v.call(new t)))!==Object.prototype&&u.next&&(_setToStringTag(u,_,!0),"function"!=typeof u[ITERATOR]&&_hide(u,ITERATOR,returnThis)),l&&h&&h.name!==VALUES&&(p=!0,d=function(){return h.call(this)}),(BUGGY||p||!y[ITERATOR])&&_hide(y,ITERATOR,d),_iterators[e]=d,_iterators[_]=returnThis,o)if(a={values:l?d:f(VALUES),keys:i?d:f(KEYS),entries:m},c)for(s in a)s in y||_redefine(y,s,a[s]);else _export(_export.P+_export.F*(BUGGY||p),e,a);return a},es6_array_iterator=_iterDefine(Array,"Array",function(t,e){this._t=_toIobject(t),this._i=0,this._k=e},function(){var t=this._t,e=this._k,r=this._i++;return!t||r>=t.length?(this._t=void 0,_iterStep(1)):_iterStep(0,"keys"==e?r:"values"==e?t[r]:[r,t[r]])},"values");_iterators.Arguments=_iterators.Array,_addToUnscopables("keys"),_addToUnscopables("values"),_addToUnscopables("entries");for(var ITERATOR$1=_wks("iterator"),TO_STRING_TAG=_wks("toStringTag"),ArrayValues=_iterators.Array,DOMIterables={CSSRuleList:!0,CSSStyleDeclaration:!1,CSSValueList:!1,ClientRectList:!1,DOMRectList:!1,DOMStringList:!1,DOMTokenList:!0,DataTransferItemList:!1,FileList:!1,HTMLAllCollection:!1,HTMLCollection:!1,HTMLFormElement:!1,HTMLSelectElement:!1,MediaList:!0,MimeTypeArray:!1,NamedNodeMap:!1,NodeList:!0,PaintRequestList:!1,Plugin:!1,PluginArray:!1,SVGLengthList:!1,SVGNumberList:!1,SVGPathSegList:!1,SVGPointList:!1,SVGStringList:!1,SVGTransformList:!1,SourceBufferList:!1,StyleSheetList:!0,TextTrackCueList:!1,TextTrackList:!1,TouchList:!1},collections=_objectKeys(DOMIterables),i=0;i<collections.length;i++){var key,NAME=collections[i],explicit=DOMIterables[NAME],Collection=_global[NAME],proto=Collection&&Collection.prototype;if(proto&&(proto[ITERATOR$1]||_hide(proto,ITERATOR$1,ArrayValues),proto[TO_STRING_TAG]||_hide(proto,TO_STRING_TAG,NAME),_iterators[NAME]=ArrayValues,explicit))for(key in es6_array_iterator)proto[key]||_redefine(proto,key,es6_array_iterator[key],!0)}var _stringAt=function(t){return function(e,r){var n,o,i=String(_defined(e)),c=_toInteger(r),a=i.length;return c<0||c>=a?t?"":void 0:(n=i.charCodeAt(c))<55296||n>56319||c+1===a||(o=i.charCodeAt(c+1))<56320||o>57343?t?i.charAt(c):n:t?i.slice(c,c+2):o-56320+(n-55296<<10)+65536}},$at=_stringAt(!0);_iterDefine(String,"String",function(t){this._t=String(t),this._i=0},function(){var t,e=this._t,r=this._i;return r>=e.length?{value:void 0,done:!0}:(t=$at(e,r),this._i+=t.length,{value:t,done:!1})});var _redefineAll=function(t,e,r){for(var n in e)_redefine(t,n,e[n],r);return t},_anInstance=function(t,e,r,n){if(!(t instanceof e)||void 0!==n&&n in t)throw TypeError(r+": incorrect invocation!");return t},_iterCall=function(t,e,r,n){try{return n?e(_anObject(r)[0],r[1]):e(r)}catch(e){var o=t.return;throw void 0!==o&&_anObject(o.call(t)),e}},ITERATOR$2=_wks("iterator"),ArrayProto$1=Array.prototype,_isArrayIter=function(t){return void 0!==t&&(_iterators.Array===t||ArrayProto$1[ITERATOR$2]===t)},TAG$1=_wks("toStringTag"),ARG="Arguments"==_cof(function(){return arguments}()),tryGet=function(t,e){try{return t[e]}catch(t){}},_classof=function(t){var e,r,n;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(r=tryGet(e=Object(t),TAG$1))?r:ARG?_cof(e):"Object"==(n=_cof(e))&&"function"==typeof e.callee?"Arguments":n},ITERATOR$3=_wks("iterator"),core_getIteratorMethod=_core.getIteratorMethod=function(t){if(null!=t)return t[ITERATOR$3]||t["@@iterator"]||_iterators[_classof(t)]},_forOf=createCommonjsModule(function(t){var e={},r={},n=t.exports=function(t,n,o,i,c){var a,s,u,f,_=c?function(){return t}:core_getIteratorMethod(t),l=_ctx(o,i,n?2:1),p=0;if("function"!=typeof _)throw TypeError(t+" is not iterable!");if(_isArrayIter(_)){for(a=_toLength(t.length);a>p;p++)if((f=n?l(_anObject(s=t[p])[0],s[1]):l(t[p]))===e||f===r)return f}else for(u=_.call(t);!(s=u.next()).done;)if((f=_iterCall(u,l,s.value,n))===e||f===r)return f};n.BREAK=e,n.RETURN=r}),SPECIES$1=_wks("species"),_setSpecies=function(t){var e=_global[t];_descriptors&&e&&!e[SPECIES$1]&&_objectDp.f(e,SPECIES$1,{configurable:!0,get:function(){return this}})},_meta=createCommonjsModule(function(t){var e=_uid("meta"),r=_objectDp.f,n=0,o=Object.isExtensible||function(){return!0},i=!_fails(function(){return o(Object.preventExtensions({}))}),c=function(t){r(t,e,{value:{i:"O"+ ++n,w:{}}})},a=t.exports={KEY:e,NEED:!1,fastKey:function(t,r){if(!_isObject(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!_has(t,e)){if(!o(t))return"F";if(!r)return"E";c(t)}return t[e].i},getWeak:function(t,r){if(!_has(t,e)){if(!o(t))return!0;if(!r)return!1;c(t)}return t[e].w},onFreeze:function(t){return i&&a.NEED&&o(t)&&!_has(t,e)&&c(t),t}}}),_meta_1=_meta.KEY,_meta_2=_meta.NEED,_meta_3=_meta.fastKey,_meta_4=_meta.getWeak,_meta_5=_meta.onFreeze,_validateCollection=function(t,e){if(!_isObject(t)||t._t!==e)throw TypeError("Incompatible receiver, "+e+" required!");return t},dP$1=_objectDp.f,fastKey=_meta.fastKey,SIZE=_descriptors?"_s":"size",getEntry=function(t,e){var r,n=fastKey(e);if("F"!==n)return t._i[n];for(r=t._f;r;r=r.n)if(r.k==e)return r},_collectionStrong={getConstructor:function(t,e,r,n){var o=t(function(t,i){_anInstance(t,o,e,"_i"),t._t=e,t._i=_objectCreate(null),t._f=void 0,t._l=void 0,t[SIZE]=0,null!=i&&_forOf(i,r,t[n],t)});return _redefineAll(o.prototype,{clear:function(){for(var t=_validateCollection(this,e),r=t._i,n=t._f;n;n=n.n)n.r=!0,n.p&&(n.p=n.p.n=void 0),delete r[n.i];t._f=t._l=void 0,t[SIZE]=0},delete:function(t){var r=_validateCollection(this,e),n=getEntry(r,t);if(n){var o=n.n,i=n.p;delete r._i[n.i],n.r=!0,i&&(i.n=o),o&&(o.p=i),r._f==n&&(r._f=o),r._l==n&&(r._l=i),r[SIZE]--}return!!n},forEach:function(t){_validateCollection(this,e);for(var r,n=_ctx(t,arguments.length>1?arguments[1]:void 0,3);r=r?r.n:this._f;)for(n(r.v,r.k,this);r&&r.r;)r=r.p},has:function(t){return!!getEntry(_validateCollection(this,e),t)}}),_descriptors&&dP$1(o.prototype,"size",{get:function(){return _validateCollection(this,e)[SIZE]}}),o},def:function(t,e,r){var n,o,i=getEntry(t,e);return i?i.v=r:(t._l=i={i:o=fastKey(e,!0),k:e,v:r,p:n=t._l,n:void 0,r:!1},t._f||(t._f=i),n&&(n.n=i),t[SIZE]++,"F"!==o&&(t._i[o]=i)),t},getEntry:getEntry,setStrong:function(t,e,r){_iterDefine(t,e,function(t,r){this._t=_validateCollection(t,e),this._k=r,this._l=void 0},function(){for(var t=this._k,e=this._l;e&&e.r;)e=e.p;return this._t&&(this._l=e=e?e.n:this._t._f)?_iterStep(0,"keys"==t?e.k:"values"==t?e.v:[e.k,e.v]):(this._t=void 0,_iterStep(1))},r?"entries":"values",!r,!0),_setSpecies(e)}},ITERATOR$4=_wks("iterator"),SAFE_CLOSING=!1;try{var riter=[7][ITERATOR$4]();riter.return=function(){SAFE_CLOSING=!0}}catch(t){}var _iterDetect=function(t,e){if(!e&&!SAFE_CLOSING)return!1;var r=!1;try{var n=[7],o=n[ITERATOR$4]();o.next=function(){return{done:r=!0}},n[ITERATOR$4]=function(){return o},t(n)}catch(t){}return r},f$1={}.propertyIsEnumerable,_objectPie={f:f$1},gOPD=Object.getOwnPropertyDescriptor,f$2=_descriptors?gOPD:function(t,e){if(t=_toIobject(t),e=_toPrimitive(e,!0),_ie8DomDefine)try{return gOPD(t,e)}catch(t){}if(_has(t,e))return _propertyDesc(!_objectPie.f.call(t,e),t[e])},_objectGopd={f:f$2},check=function(t,e){if(_anObject(t),!_isObject(e)&&null!==e)throw TypeError(e+": can't set as prototype!")},_setProto={set:Object.setPrototypeOf||("__proto__"in{}?function(t,e,r){try{(r=_ctx(Function.call,_objectGopd.f(Object.prototype,"__proto__").set,2))(t,[]),e=!(t instanceof Array)}catch(t){e=!0}return function(t,n){return check(t,n),e?t.__proto__=n:r(t,n),t}}({},!1):void 0),check:check},setPrototypeOf=_setProto.set,_inheritIfRequired=function(t,e,r){var n,o=e.constructor;return o!==r&&"function"==typeof o&&(n=o.prototype)!==r.prototype&&_isObject(n)&&setPrototypeOf&&setPrototypeOf(t,n),t},_collection=function(t,e,r,n,o,i){var c=_global[t],a=c,s=o?"set":"add",u=a&&a.prototype,f={},_=function(t){var e=u[t];_redefine(u,t,"delete"==t?function(t){return!(i&&!_isObject(t))&&e.call(this,0===t?0:t)}:"has"==t?function(t){return!(i&&!_isObject(t))&&e.call(this,0===t?0:t)}:"get"==t?function(t){return i&&!_isObject(t)?void 0:e.call(this,0===t?0:t)}:"add"==t?function(t){return e.call(this,0===t?0:t),this}:function(t,r){return e.call(this,0===t?0:t,r),this})};if("function"==typeof a&&(i||u.forEach&&!_fails(function(){(new a).entries().next()}))){var l=new a,p=l[s](i?{}:-0,1)!=l,y=_fails(function(){l.has(1)}),h=_iterDetect(function(t){new a(t)}),d=!i&&_fails(function(){for(var t=new a,e=5;e--;)t[s](e,e);return!t.has(-0)});h||((a=e(function(e,r){_anInstance(e,a,t);var n=_inheritIfRequired(new c,e,a);return null!=r&&_forOf(r,o,n[s],n),n})).prototype=u,u.constructor=a),(y||d)&&(_("delete"),_("has"),o&&_("get")),(d||p)&&_(s),i&&u.clear&&delete u.clear}else a=n.getConstructor(e,t,o,s),_redefineAll(a.prototype,r),_meta.NEED=!0;return _setToStringTag(a,t),f[t]=a,_export(_export.G+_export.W+_export.F*(a!=c),f),i||n.setStrong(a,t,o),a},MAP="Map",es6_map=_collection(MAP,function(t){return function(){return t(this,arguments.length>0?arguments[0]:void 0)}},{get:function(t){var e=_collectionStrong.getEntry(_validateCollection(this,MAP),t);return e&&e.v},set:function(t,e){return _collectionStrong.def(_validateCollection(this,MAP),0===t?0:t,e)}},_collectionStrong,!0),dP$2=_objectDp.f,FProto=Function.prototype,nameRE=/^\s*function ([^ (]*)/,NAME$1="name";NAME$1 in FProto||_descriptors&&dP$2(FProto,NAME$1,{configurable:!0,get:function(){try{return(""+this).match(nameRE)[1]}catch(t){return""}}});var _invoke=function(t,e,r){var n=void 0===r;switch(e.length){case 0:return n?t():t.call(r);case 1:return n?t(e[0]):t.call(r,e[0]);case 2:return n?t(e[0],e[1]):t.call(r,e[0],e[1]);case 3:return n?t(e[0],e[1],e[2]):t.call(r,e[0],e[1],e[2]);case 4:return n?t(e[0],e[1],e[2],e[3]):t.call(r,e[0],e[1],e[2],e[3])}return t.apply(r,e)},arraySlice=[].slice,factories={},construct=function(t,e,r){if(!(e in factories)){for(var n=[],o=0;o<e;o++)n[o]="a["+o+"]";factories[e]=Function("F,a","return new F("+n.join(",")+")")}return factories[e](t,r)},_bind=Function.bind||function(t){var e=_aFunction(this),r=arraySlice.call(arguments,1),n=function(){var o=r.concat(arraySlice.call(arguments));return this instanceof n?construct(e,o.length,o):_invoke(e,o,t)};return _isObject(e.prototype)&&(n.prototype=e.prototype),n};_export(_export.P,"Function",{bind:_bind});var SET="Set",es6_set=_collection(SET,function(t){return function(){return t(this,arguments.length>0?arguments[0]:void 0)}},{add:function(t){return _collectionStrong.def(_validateCollection(this,SET),t=0===t?0:t,t)}},_collectionStrong);_export(_export.S+_export.F*!_descriptors,"Object",{defineProperties:_objectDps});var getComponentName=function(t){switch(_typeof(t)){case"string":return t;case"function":switch(_typeof(t.componentName)){case"function":return t.componentName();case"string":return t.componentName;default:return}default:return}},_hasComponent=function(t){return function(e){return t.components.has(getComponentName(e))}},Entity=function(){function t(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:generateUuid();_classCallCheck(this,t),this.id=r,Object.defineProperties(this,{ecs:{value:e},components:{value:new Set}}),eventize(this)}return _createClass(t,[{key:"destroy",value:function(){this.destroyed||(this.destroyed=!0,this.components.forEach(this.deleteComponent.bind(this)),this.ecs.destroyEntity(this.id))}},{key:"setComponent",value:function(t,e){if(this.components.has(t)){if(this[t]!==e)throw new Error("Entity.setComponent(): component already exists; name='".concat(t,"'"))}else this.components.add(t),this[t]=e,e.connectedEntity&&e.connectedEntity(this),this.emit("componentConnected:".concat(t),e,this)}},{key:"hasComponent",value:function(t){return Array.isArray(t)?t.every(_hasComponent(this)):_hasComponent(this)(t)}},{key:"deleteComponent",value:function(t){if(this.components.has(t)){var e=this[t];this.ecs.destroyComponent(t,e),this.components.delete(t),this.emit("destroyComponent:".concat(t),e,this),e.disconnectedEntity&&e.disconnectedEntity(this),delete this[e]}}}]),t}(),ComponentRegistry=function(){function t(){_classCallCheck(this,t),this.factories=new Map}return _createClass(t,[{key:"registerComponent",value:function(t,e){this.factories.set(t,e)}},{key:"getComponentFactory",value:function(t){var e=getComponentName(t),r=this.factories.get(e);if(!r)throw new Error("ComponentRegistry: unknown factory '".concat(e,"'"));return r}},{key:"createComponent",value:function(t,e,r){var n=getComponentName(e),o=this.getComponentFactory(n).create(t,r);t.setComponent(n,o)}},{key:"updateComponent",value:function(t,e,r){var n=getComponentName(e),o=this.getComponentFactory(n),i=t[n];o.update(i,r)}},{key:"createOrUpdateComponent",value:function(t,e,r){var n=getComponentName(e);this[t.hasComponent(n)?"updateComponent":"createComponent"](t,n,r)}},{key:"destroyComponent",value:function(t,e){var r=this.factories.get(getComponentName(t));r&&r.destroy&&r.destroy(e)}}]),t}(),ECS=function(t){function e(){var t;return _classCallCheck(this,e),(t=_possibleConstructorReturn(this,_getPrototypeOf(e).call(this))).entities=new Map,t}return _inherits(e,ComponentRegistry),_createClass(e,[{key:"createEntity",value:function(t,e){var r=this,n=new Entity(this,e);if(this.entities.has(n.id))throw new Error("ECS: duplicate entity.id='".concat(n.id,"' are not allowed"));return this.entities.set(n.id,n),Array.isArray(t)&&t.forEach(function(t){Array.isArray(t)?r.createComponent.apply(r,[n].concat(_toConsumableArray(t))):r.createComponent(n,t)}),n}},{key:"getEntity",value:function(t){return this.entities.get(t)}},{key:"destroyEntity",value:function(t){var e=this.entities.get(t);e&&(this.entities.delete(t),e.destroyed||e.destroy())}},{key:"destroyAllEntities",value:function(){this.entities.forEach(function(t){return t.destroy()})}}]),e}(),ComponentFactory=function(){function t(e){_classCallCheck(this,t),this.componentClass=e}return _createClass(t,null,[{key:"registerComponent",value:function(e){for(var r=arguments.length,n=new Array(r>1?r-1:0),o=1;o<r;o++)n[o-1]=arguments[o];n.forEach(function(r){e.registerComponent(r.componentName(),new t(r))})}}]),_createClass(t,[{key:"create",value:function(t,e){return new this.componentClass(t,e)}},{key:"update",value:function(t,e){t.update&&t.update(e)}},{key:"destroy",value:function(t){t.destroy&&t.destroy()}}]),t}();export{ECS,ComponentFactory};
//# sourceMappingURL=picimo-ecs.js.map
