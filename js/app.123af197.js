(function(e){function t(t){for(var r,c,a=t[0],u=t[1],s=t[2],l=0,h=[];l<a.length;l++)c=a[l],Object.prototype.hasOwnProperty.call(i,c)&&i[c]&&h.push(i[c][0]),i[c]=0;for(r in u)Object.prototype.hasOwnProperty.call(u,r)&&(e[r]=u[r]);f&&f(t);while(h.length)h.shift()();return o.push.apply(o,s||[]),n()}function n(){for(var e,t=0;t<o.length;t++){for(var n=o[t],r=!0,c=1;c<n.length;c++){var a=n[c];0!==i[a]&&(r=!1)}r&&(o.splice(t--,1),e=u(u.s=n[0]))}return e}var r={},c={app:0},i={app:0},o=[];function a(e){return u.p+"js/"+({about:"about","home~occurrence~occurrenceList":"home~occurrence~occurrenceList","home~occurrenceList":"home~occurrenceList",home:"home",occurrenceList:"occurrenceList",occurrence:"occurrence",login:"login"}[e]||e)+"."+{about:"ee2fe4c2","home~occurrence~occurrenceList":"3b0df77b","home~occurrenceList":"6a8ea6f2",home:"1634b655",occurrenceList:"053c3f79",occurrence:"c9cd0e71",login:"6a46b56a"}[e]+".js"}function u(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,u),n.l=!0,n.exports}u.e=function(e){var t=[],n={"home~occurrence~occurrenceList":1,"home~occurrenceList":1,home:1,occurrenceList:1};c[e]?t.push(c[e]):0!==c[e]&&n[e]&&t.push(c[e]=new Promise((function(t,n){for(var r="css/"+({about:"about","home~occurrence~occurrenceList":"home~occurrence~occurrenceList","home~occurrenceList":"home~occurrenceList",home:"home",occurrenceList:"occurrenceList",occurrence:"occurrence",login:"login"}[e]||e)+"."+{about:"31d6cfe0","home~occurrence~occurrenceList":"27401a5f","home~occurrenceList":"56a8edf3",home:"2d7010a2",occurrenceList:"f6c36501",occurrence:"31d6cfe0",login:"31d6cfe0"}[e]+".css",i=u.p+r,o=document.getElementsByTagName("link"),a=0;a<o.length;a++){var s=o[a],l=s.getAttribute("data-href")||s.getAttribute("href");if("stylesheet"===s.rel&&(l===r||l===i))return t()}var h=document.getElementsByTagName("style");for(a=0;a<h.length;a++){s=h[a],l=s.getAttribute("data-href");if(l===r||l===i)return t()}var f=document.createElement("link");f.rel="stylesheet",f.type="text/css",f.onload=t,f.onerror=function(t){var r=t&&t.target&&t.target.src||i,o=new Error("Loading CSS chunk "+e+" failed.\n("+r+")");o.code="CSS_CHUNK_LOAD_FAILED",o.request=r,delete c[e],f.parentNode.removeChild(f),n(o)},f.href=i;var m=document.getElementsByTagName("head")[0];m.appendChild(f)})).then((function(){c[e]=0})));var r=i[e];if(0!==r)if(r)t.push(r[2]);else{var o=new Promise((function(t,n){r=i[e]=[t,n]}));t.push(r[2]=o);var s,l=document.createElement("script");l.charset="utf-8",l.timeout=120,u.nc&&l.setAttribute("nonce",u.nc),l.src=a(e);var h=new Error;s=function(t){l.onerror=l.onload=null,clearTimeout(f);var n=i[e];if(0!==n){if(n){var r=t&&("load"===t.type?"missing":t.type),c=t&&t.target&&t.target.src;h.message="Loading chunk "+e+" failed.\n("+r+": "+c+")",h.name="ChunkLoadError",h.type=r,h.request=c,n[1](h)}i[e]=void 0}};var f=setTimeout((function(){s({type:"timeout",target:l})}),12e4);l.onerror=l.onload=s,document.head.appendChild(l)}return Promise.all(t)},u.m=e,u.c=r,u.d=function(e,t,n){u.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},u.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},u.t=function(e,t){if(1&t&&(e=u(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(u.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)u.d(n,r,function(t){return e[t]}.bind(null,r));return n},u.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return u.d(t,"a",t),t},u.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},u.p="",u.oe=function(e){throw console.error(e),e};var s=window["webpackJsonp"]=window["webpackJsonp"]||[],l=s.push.bind(s);s.push=t,s=s.slice();for(var h=0;h<s.length;h++)t(s[h]);var f=l;o.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},1425:function(e,t){e.exports="data:image/png;base64,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"},2732:function(e,t,n){e.exports=n.p+"img/logo_tb.3c273abb.png"},"28f4":function(e,t,n){e.exports=n.p+"img/logo_bicikl.a6e1b996.png"},4620:function(e,t,n){e.exports=n.p+"img/logo_hesso.c44ee5c6.jpg"},"4f8e":function(e,t){e.exports="data:image/png;base64,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"},"56d7":function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var r=n("2b0e"),c=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"d-flex flex-column min-vh-100",style:e.cssVars,attrs:{id:"app"}},[n("router-view"),e._m(0)],1)},i=[function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"logo row mt-auto"},[r("div",{staticClass:"col-1"},[r("a",{attrs:{href:"https://ebiodiv.org/"}},[r("img",{attrs:{src:n("c464")}})])]),r("div",{staticClass:"col-1"},[r("a",{attrs:{href:"https://www.gbif.org/"}},[r("img",{attrs:{src:n("4f8e")}})])]),r("div",{staticClass:"col-1"},[r("a",{attrs:{href:"https://plazi.org/"}},[r("img",{attrs:{src:n("cfed")}})])]),r("div",{staticClass:"col-1"},[r("a",{attrs:{href:"https://plazi.org/treatmentbank/"}},[r("img",{attrs:{src:n("2732")}})])]),r("div",{staticClass:"col-1"},[r("a",{attrs:{href:"https://bicikl-project.eu/"}},[r("img",{attrs:{src:n("28f4")}})])]),r("div",{staticClass:"col-1"},[r("a",{attrs:{href:"https://www.unibe.ch/"}},[r("img",{attrs:{src:n("7c97")}})])]),r("div",{staticClass:"col-1"},[r("a",{attrs:{href:"https://www.nmbe.ch/"}},[r("img",{attrs:{src:n("963e")}})])]),r("div",{staticClass:"col-1"},[r("a",{attrs:{href:"https://www.swissuniversities.ch/"}},[r("img",{attrs:{src:n("1425")}})])]),r("div",{staticClass:"col-1"},[r("a",{attrs:{href:"https://www.sib.swiss/"}},[r("img",{attrs:{src:n("6e12")}})])]),r("div",{staticClass:"col-1"},[r("a",{attrs:{href:"https://www.hesge.ch/heg/"}},[r("img",{attrs:{src:n("5a85")}})])]),r("div",{staticClass:"col-1"},[r("a",{attrs:{href:"https://www.hes-so.ch/"}},[r("img",{attrs:{src:n("4620")}})])]),r("div",{staticClass:"col-1"},[r("a",{attrs:{href:"https://candy.hesge.ch/SIBiLS/"}},[r("img",{attrs:{src:n("ff1c")}})])])])}],o=n("5530"),a=n("2f62"),u={computed:Object(o["a"])(Object(o["a"])({},Object(a["c"])(["theme_color"])),{},{cssVars:function(){return{"--color-main":this.theme_color.main}}})},s=u,l=(n("5c0b"),n("2877")),h=Object(l["a"])(s,c,i,!1,null,null,null),f=h.exports,m=(n("d3b7"),n("3ca3"),n("ddb0"),n("8c4f"));r["default"].use(m["a"]);var p=[{path:"/",name:"HomePage",component:function(){return Promise.all([n.e("home~occurrence~occurrenceList"),n.e("home~occurrenceList"),n.e("home")]).then(n.bind(null,"f4a9"))}},{path:"/occurrence/:occurrenceKey",name:"OccurrencePage",component:function(){return Promise.all([n.e("home~occurrence~occurrenceList"),n.e("occurrence")]).then(n.bind(null,"cd97"))}},{path:"/occurrences",name:"OccurrenceListPage",component:function(){return Promise.all([n.e("home~occurrence~occurrenceList"),n.e("home~occurrenceList"),n.e("occurrenceList")]).then(n.bind(null,"697a"))}},{path:"/about",name:"AboutPage",component:function(){return n.e("about").then(n.bind(null,"0bd2"))}},{path:"/login",name:"LoginPage",component:function(){return n.e("login").then(n.bind(null,"48ca"))}}],d=new m["a"]({mode:"history",base:"",routes:p,scrollBehavior:function(e,t,n){return e.hash?{selector:e.hash,behavior:"smooth"}:n||{x:0,y:0}}}),g=d;n("b0c0"),n("4e82"),n("e9c4");r["default"].use(a["a"]);var v,b,y,E=new a["a"].Store({state:{theme_color:{main:"#70AD47",secondary:"#008F00"},step:1,urls_parameters:{institution:null,format:null,occurrence:null,datasets:[]},institutions:{list:[],info_dict:{}},institution_selection:{key:null,name:null},datasets:[],datasets_selection:[],occurrences_selection:null,occurrence_keys:null,format_selection:null,matching:null,fields:{matcit_specimen:{format_occurrence:{name:"Material citation"},format_curation:{name:"Specimen"}},specimen_matcit:{format_occurrence:{name:"Specimen"},format_curation:{name:"Material citation"}}},user_selection:{occurrences:{facets:{status:[],datasetName:[],country:[],collectionCode:[],recordedBy:[],kingdom:[],phylum:[],class:[],order:[],family:[],genus:[],species:[],typeStatus:[],date:[0,2022]},sort:"ID"},curation:{facets:{},sort:"ID"}},filters:{occurrences:{sort:["ID","scientific name","date","matching number"],facets:[{title:"Date",short:"date",multi:!1},{title:"Dataset",short:"datasetName",multi:!0},{title:"Curation status",short:"status",multi:!0},{title:"Country",short:"country",multi:!0},{title:"Collection code",short:"collectionCode",multi:!0},{title:"Collector",short:"recordedBy",multi:!0},{title:"Type",short:"typeStatus",multi:!0,labelMethod:"display_value_typeStatus"},{title:"Kingdom",short:"kingdom",multi:!0},{title:"Phylum",short:"phylum",multi:!0},{title:"Class",short:"class",multi:!0},{title:"Order",short:"order",multi:!0},{title:"Family",short:"family",multi:!0},{title:"Genus",short:"genus",multi:!0},{title:"Species",short:"species",multi:!0}],date:[0,2022]}},curation_characteristics:[{name:"Family",score:"family",value:["family"]},{name:"Genus",score:"genus",value:["genus"]},{name:"Specific epithet",score:"specificEpithet",value:["specificEpithet"]},{name:"Coordinates",score:"decimalLatitude",value:["decimalLatitude","decimalLongitude"]},{name:"Elevation",score:"elevation",value:["elevation","depth"]},{name:"Locality",score:"locality",value:["locality"]},{name:"Country",score:"country",value:["country"]},{name:"Date",score:"year",value:["day","month","year"]},{name:"Coll code",score:"collectionCode",value:["collectionCode"]},{name:"Catalog nb",score:"catalogNumber",value:["catalogNumber"]},{name:"Individual nb",score:"individualCount",value:["individualCount"]},{name:"Collector (recorded by)",score:"recordedBy",value:["recordedBy"]},{name:"Type",score:"typeStatus",value:["typeStatus"]},{name:"Record",score:"basisOfRecord",value:["basisOfRecord"]}],user:{name:null,orcid:null,orcidToken:null}},mutations:{UPDATE_INSTITUTIONS_LIST:function(e,t){e.institutions.list=t},UPDATE_INSTITUTIONS_INFO:function(e,t){e.institutions.info_dict=t},UPDATE_INSTITUTION_SELECTION_KEY:function(e,t){e.institution_selection.key=t},UPDATE_INSTITUTION_SELECTION_NAME:function(e,t){e.institution_selection.name=t},UPDATE_FORMAT_SELECTION:function(e,t){e.format_selection=t},UPDATE_DATASETS:function(e,t){e.datasets=t},UPDATE_DATASETS_SELECTION:function(e,t){e.datasets_selection=t},UPDATE_OCCURRENCES_SELECTION:function(e,t){e.occurrences_selection=t},UPDATE_OCCURRENCES_KEYS:function(e,t){e.occurrence_keys=t},UPDATE_OCCURRENCES_SORT:function(e,t){e.user_selection.occurrences.sort=t},UPDATE_OCCURRENCES_FACET:function(e,t){e.user_selection.occurrences.facets[t.facet]=t.list},UPDATE_OCCURRENCES_FILTER_DATE:function(e,t){e.filters.occurrences.date=t},UPDATE_MATCHING:function(e,t){e.matching=t},UPDATE_INIT_MC_DATE_FILTER:function(e,t){e.filters.occurrences.date=t,e.user_selection.occurrences.facets.date=t},UPDATE_URLS_PARAMETERS:function(e,t){e.urls_parameters=t},UPDATE_STEP:function(e,t){e.step=t},UPDATE_USER:function(e,t){e.user=t,window.sessionStorage.setItem("user",JSON.stringify(t))},initialiseStore:function(e){var t=window.sessionStorage.getItem("user");t&&(e.user=JSON.parse(t))}},actions:{updateInstitutions:function(e,t){e.commit("UPDATE_INSTITUTIONS_LIST",t.list),e.commit("UPDATE_INSTITUTIONS_INFO",t.info)},updateInstitutionSelection:function(e,t){e.commit("UPDATE_INSTITUTION_SELECTION_KEY",t.key),e.commit("UPDATE_INSTITUTION_SELECTION_NAME",t.name)},updateFormatSelection:function(e,t){e.commit("UPDATE_FORMAT_SELECTION",t)},updateOccurrencesSelection:function(e,t){e.commit("UPDATE_OCCURRENCES_SELECTION",t)},updateDatasetsSelection:function(e,t){e.commit("UPDATE_DATASETS_SELECTION",t)},updateOccurrenceKeys:function(e,t){e.commit("UPDATE_OCCURRENCES_KEYS",t)},updateDatasets:function(e,t){e.commit("UPDATE_DATASETS",t)},updateOccurrencesSort:function(e,t){e.commit("UPDATE_OCCURRENCES_SORT",t)},updateOccurrencesFacet:function(e,t){e.commit("UPDATE_OCCURRENCES_FACET",t)},updateMatching:function(e,t){e.commit("UPDATE_MATCHING",t)},updateInitMcDateFilter:function(e,t){e.commit("UPDATE_INIT_MC_DATE_FILTER",t)},updateUrlsParameters:function(e,t){e.commit("UPDATE_URLS_PARAMETERS",t)},updateStep:function(e,t){e.commit("UPDATE_STEP",t)},updateOrcidUser:function(e,t){e.commit("UPDATE_USER",t)}},modules:{}}),A=n("5f5b"),S=n("b1e0"),w=(n("f9e3"),n("2dd8"),n("5df9"),n("b85c")),O=n("4143"),T=n("ade3"),C=n("b40d"),_=n("34d8"),I=n("2909"),U=n("262e"),k=n("2caf"),R=n("d4ec"),x=n("bee2"),N=n("3835"),L=(n("4d63"),n("c607"),n("ac1f"),n("2c3e"),n("25f0"),n("498a"),n("5319"),n("00b4"),n("a9e3"),n("d81d"),n("c740"),n("1fe2"),n("793f")),P=new RegExp("[^A-Z0-9]+","i");function j(e){return JSON.parse(JSON.stringify(e))}function M(e){return null==e?"":e.trim()}function D(e){var t;e=M(e).toUpperCase();do{t=e,e=e.replace(P,"")}while(e!=t);return e}function F(e){return null==e?null:e.trim()}function W(e){return/^[-+]?(\d+|Infinity)$/.test(e)?Number(e):null}function V(e,t,n){return e=null!=e?Number(e):null,t=null!==e&&null!=t?Number(t):null,n=null!==e&&null!==t&&null!=n?Number(n):null,[e,t,n]}function Z(e,t){return null==e&&null==t?[null,null]:(e=Number(e),t=Number(t),0==e&&0==t||360==e&&360==t?[null,null]:[e,t])}function J(e){return e?e.map((function(e){return e.value})):[]}function Q(e,t){return e&&t?1-(new L["JaroWinkler"]).distance(e,t):null}function B(e,t){return Q(e,t)}function X(e,t){return e&&t?t.toUpperCase()==e.toUpperCase()?1:0:null}function Y(e,t){return e&&t?(e=e.toUpperCase(),t=t.toUpperCase(),e===t?1:-1!==e.indexOf(t)||-1!==t.indexOf(e)?.8:0):null}function q(e,t){if(!e||!t)return null;var n=Math.abs(e,t);return 1-Math.abs(t-e)/n}function K(e,t){if(!e||!t)return null;var n=Math.abs(e-t);return(6-Math.min(6,Math.log(n+1)))/6}function H(e,t){return-1!==e.findIndex((function(e){return-1!==t.indexOf(e)}))?1:0}function z(e){if(!e.year)return null;var t=new Date(e.year,e.month||6,e.day||15).getTime();return t/864e5}function G(e,t){var n=z(e),r=z(t);return n&&r?Math.exp(-Math.abs(n-r)/10):null}function $(e,t){var n=[e.decimalLatitude,e.decimalLongitude],r=n[0],c=n[1],i=[t.decimalLatitude,t.decimalLongitude],o=i[0],a=i[1];if(null==r||null==c||null==o||null==a)return null;try{var u=[c,r,a,o].map((function(e){return e*(Math.PI/180)})),s=Object(N["a"])(u,4);c=s[0],r=s[1],a=s[2],o=s[3];var l=o-r,h=a-c,f=Math.pow(Math.sin(l/2),2)+Math.cos(r)*Math.cos(o)*Math.pow(Math.sin(h/2),2),m=Math.asin(Math.sqrt(f));return Math.exp(-100*m)}catch(p){return null}}var ee=function(){function e(t,n,r,c){Object(R["a"])(this,e),this.field_name=t,this.weight=n,this.normalize_function=r,this.get_score_function=c}return Object(x["a"])(e,[{key:"normalize",value:function(e){return e[this.field_name]=this.normalize_function(e[this.field_name]),e}},{key:"get_score",value:function(e,t){return this.get_score_function(e[this.field_name],t[this.field_name])}},{key:"key",get:function(){return this.field_name}}]),e}(),te=function(e){Object(U["a"])(n,e);var t=Object(k["a"])(n);function n(){return Object(R["a"])(this,n),t.apply(this,arguments)}return Object(x["a"])(n,[{key:"normalize",value:function(e){var t=this.field_name.map((function(t){return e[t]})),n=this.normalize_function.apply(this,Object(I["a"])(t));for(var r in this.field_name)e[this.field_name[r]]=n[r];return e}},{key:"get_score",value:function(e,t){return this.get_score_function(e,t)}},{key:"key",get:function(){return this.field_name[0]}}]),n}(ee),ne=new(b=new WeakSet,y=v=function(){function e(){Object(R["a"])(this,e),Object(O["a"])(this,b),this.occurrence_cache={},this.score_cache={}}return Object(x["a"])(e,[{key:"get_scores",value:function(t,n){var r=t.key>n.key?t.key+"_"+n.key:n.key+"_"+t.key;if(null!=this.score_cache[r])return this.score_cache[r];this.score_cache.length>2e4&&(this.score_cache={});var c=Object(_["a"])(this,b,re).call(this,t),i=Object(_["a"])(this,b,re).call(this,n),o=Object(C["a"])(e,v,ce).call(e,c,i);return this.score_cache[r]=o,o}}]),e}(),Object(T["a"])(v,"FIELDS",[new ee("typeStatus",2,M,X),new ee("basisOfRecord",2,M,X),new ee("basisOfRecord",2,M,X),new ee("recordedBy",2,M,Q),new ee("recordNumber",2,M,X),new ee("recordedByIDs",2,J,H),new ee("collectionCode",2,D,Y),new ee("catalogNumber",2,D,Y),new ee("individualCount",1,W,q),new ee("family",1,M,Q),new ee("genus",1,M,Q),new ee("specificEpithet",1,M,Q),new ee("country",1,M,X),new ee("city",1,F,Q),new ee("locality",.5,F,B),new ee("elevation",.5,W,K),new te(["year","month","day"],1,V,G),new te(["decimalLatitude","decimalLongitude"],2,Z,$)]),y);function re(e){if(null!=this.occurrence_cache[e.key])return this.occurrence_cache[e.key];this.occurrence_cache.length>2e4&&(this.occurrence_cache={}),e=j(e);var t,n=Object(w["a"])(v.FIELDS);try{for(n.s();!(t=n.n()).done;){var r=t.value;e=r.normalize(e)}}catch(c){n.e(c)}finally{n.f()}return this.occurrence_cache[e.key]=e,e}function ce(e,t){var n,r={},c=0,i=0,o=Object(w["a"])(v.FIELDS);try{for(o.s();!(n=o.n()).done;){var a=n.value,u=a.get_score(e,t);r[a.key]=u,null!==u&&(c+=a.weight*u,i+=a.weight)}}catch(s){o.e(s)}finally{o.f()}return r["$global"]=(c/i).toPrecision(2),r}var ie,oe=n("1da1"),ae=(n("96cf"),n("a15b"),n("6062"),n("4fad"),n("07ac"),n("466d"),n("bc3a")),ue=n.n(ae),se=new(function(){function e(){Object(R["a"])(this,e),this.urls=null}return Object(x["a"])(e,[{key:"fetch_urls",value:function(){var e=this;return new Promise((function(t,n){null===e.urls?ue.a.get("backend.json").then((function(n){e.urls=n.data,t()})).catch((function(e){n(e)})):t()}))}},{key:"axios_get",value:function(){var e=Object(oe["a"])(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,ue.a.get(t,{validateStatus:function(e){return 200==e}});case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})));function t(t){return e.apply(this,arguments)}return t}()},{key:"fetch_institutions",value:function(){var e=Object(oe["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.fetch_urls();case 2:return e.next=4,this.axios_get(this.urls.institutions);case 4:return e.abrupt("return",e.sent);case 5:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}()},{key:"fetch_datasets",value:function(){var e=Object(oe["a"])(regeneratorRuntime.mark((function e(t){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.fetch_urls();case 2:return n=this.urls.datasets+"?institutionKey="+t,e.next=5,this.axios_get(n);case 5:return e.abrupt("return",e.sent);case 6:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}()},{key:"fetch_occurrence",value:function(){var e=Object(oe["a"])(regeneratorRuntime.mark((function e(t,n){var r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.fetch_urls();case 2:return r=this.urls.occurrences+"?occurrenceKeys="+t,n&&(r+="&fetchMissing=true"),e.next=6,this.axios_get(r);case 6:return e.abrupt("return",e.sent);case 7:case"end":return e.stop()}}),e,this)})));function t(t,n){return e.apply(this,arguments)}return t}()},{key:"fetch_occurrences_from_datasets",value:function(){var e=Object(oe["a"])(regeneratorRuntime.mark((function e(t,n){var r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.fetch_urls();case 2:return r=this.urls.occurrences+"?institutionKey="+t+"&datasetKey="+n.join("+"),e.next=5,this.axios_get(r);case 5:return e.abrupt("return",e.sent);case 6:case"end":return e.stop()}}),e,this)})));function t(t,n){return e.apply(this,arguments)}return t}()},{key:"fetch_occurrences_from_occurrencekeys",value:function(){var e=Object(oe["a"])(regeneratorRuntime.mark((function e(t){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.fetch_urls();case 2:return n=this.urls.occurrences+"?occurrenceKeys="+t.join("+"),e.next=5,this.axios_get(n);case 5:return e.abrupt("return",e.sent);case 6:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}()},{key:"post_matching",value:function(){var e=Object(oe["a"])(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.fetch_urls();case 2:return e.next=4,ue.a.post(this.urls.matching,t);case 4:return e.abrupt("return",e.sent);case 5:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}()},{key:"post_sib_matching",value:function(){var e=Object(oe["a"])(regeneratorRuntime.mark((function e(t){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(n=Object({NODE_ENV:"production",VUE_APP_BACKEND_JSON:"backend-production.json",VUE_APP_BASE_URL:"/",VUE_APP_ORCID_JSON:"orcid-production.json",BASE_URL:""}).VUE_APP_SIB_BACKEND_URL,null!=n&&""!=n){e.next=5;break}return e.next=4,this.fetch_urls();case 4:n=this.urls.sib_backend_url;case 5:if(null==n){e.next=9;break}return e.next=8,ue.a.post(n+"newOcurrenceRelations",t);case 8:return e.abrupt("return",e.sent);case 9:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}()},{key:"processOccurrences",value:function(e,t){var n,r={},c={},i=new Set(e.subjectOccurrenceKeys),o=Object(w["a"])(e.occurrenceRelations);try{for(o.s();!(n=o.n()).done;){var a=n.value,u=a.occurrenceKey1,s=a.occurrenceKey2;if("specimen_matcit"===t&&!i.has(u)||"matcit_specimen"===t&&i.has(u)){var l=[s,u];u=l[0],s=l[1]}null==r[u]&&(r[u]=e.occurrences[u],r[u].key=u,r[u].relations=[],c[u]={done:[],not_done:[]});var h={object:e.occurrences[s],matching:{match:a.decision}};h.object.key=s,r[u].relations.push(h),null!=h.matching.match?c[u].done.push(s):c[u].not_done.push(s)}}catch(b){o.e(b)}finally{o.f()}for(var f=0,m=Object.entries(c);f<m.length;f++){var p=Object(N["a"])(m[f],2),d=p[0],g=p[1],v=r[d].relations.length;g.not_done.length==v?r[d].status="not-done":g.done.length==v?r[d].status="finished":r[d].status="partial"}return Object.values(r)}}]),e}()),le=(n("2b3d"),n("9861"),n("4c53"),n("81fa")),he=new(ie=new WeakSet,function(){function e(){Object(R["a"])(this,e),Object(O["a"])(this,ie),this.config=null}return Object(x["a"])(e,[{key:"fetch_config",value:function(){var e=this;return new Promise((function(t,n){null===e.config?ue.a.get("orcid.json").then((function(n){e.config=n.data,e.config.error=null,t()})).catch((function(t){e.config={client_id:null,issuer:null,authUrl:null,key:null,error:t},console.log(t),n(t)})):t()}))}},{key:"getAuthUrl",value:function(){var e=Object(oe["a"])(regeneratorRuntime.mark((function e(){var t,n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.fetch_config();case 2:return t=new URL("/login",document.location).href,n=this.config.authUrl+"?response_type=token&redirect_uri="+t+"&client_id="+this.config.client_id+"&scope=openid",this.scopes&&(n+="%20"+this.scopes),this.nonce&&(n+="&nonce="+this.nonce),this.state&&(n+="&state="+this.state),e.abrupt("return",n);case 8:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}()},{key:"getTokenFromCurrentUrl",value:function(){var e=Object(oe["a"])(regeneratorRuntime.mark((function e(){var t,n,r,c;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(t=new URLSearchParams(window.location.hash.substring(1)),n=t.get("id_token"),r=t.get("error"),null===n){e.next=10;break}return e.next=6,Object(_["a"])(this,ie,fe).call(this,n);case 6:if(!e.sent){e.next=9;break}return c=JSON.parse(le.jws.JWS.parse(n).payloadPP),e.abrupt("return",{id_token:n,exp:c.exp,data:{orcid:c.sub,given_name:c.given_name,family_name:c.family_name},error:null});case 9:return e.abrupt("return",{id_token:n,data:null,error:"Invalid signature"});case 10:if(null===r){e.next=12;break}return e.abrupt("return",{id_token:n,data:null,error:r});case 12:return e.abrupt("return",null);case 13:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}()}]),e}());function fe(e){return me.apply(this,arguments)}function me(){return me=Object(oe["a"])(regeneratorRuntime.mark((function e(t){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.fetch_config();case 2:return n=le.KEYUTIL.getKey(this.config.key),e.abrupt("return",le.jws.JWS.verifyJWT(t,n,{alg:["RS256"],iss:[this.config.issuer],aud:Object({NODE_ENV:"production",VUE_APP_BACKEND_JSON:"backend-production.json",VUE_APP_BASE_URL:"/",VUE_APP_ORCID_JSON:"orcid-production.json",BASE_URL:""}).VUP_APP_ORCID_CLIENTID,gracePeriod:900}));case 4:case"end":return e.stop()}}),e,this)}))),me.apply(this,arguments)}var pe=n("1344");r["default"].use(A["a"]),r["default"].use(S["a"]),r["default"].config.productionTip=!1,r["default"].prototype.$scoring=ne,r["default"].prototype.$backend=se,r["default"].prototype.$orcid=he,r["default"].prototype.$emitter=Object(pe["a"])(),new r["default"]({router:g,store:E,render:function(e){return e(f)},beforeCreate:function(){this.$store.commit("initialiseStore")}}).$mount("#app")},"5a85":function(e,t,n){e.exports=n.p+"img/logo_heg.df751e04.png"},"5c0b":function(e,t,n){"use strict";n("9c0c")},"6e12":function(e,t,n){e.exports=n.p+"img/logo_sib.dd15d10f.png"},"7c97":function(e,t,n){e.exports=n.p+"img/logo_unibern.8e3145f7.png"},"963e":function(e,t,n){e.exports=n.p+"img/logo_nmbe.be647f01.png"},"9c0c":function(e,t,n){},c464:function(e,t,n){e.exports=n.p+"img/logo_ebiodiv.c4e03b00.png"},cfed:function(e,t,n){e.exports=n.p+"img/logo_plazi.117b2567.png"},ff1c:function(e,t,n){e.exports=n.p+"img/logo_sibils.f90237e6.png"}});
//# sourceMappingURL=app.123af197.js.map