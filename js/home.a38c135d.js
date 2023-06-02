(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["home"],{7583:function(e,t,r){"use strict";r("dafe")},c25a:function(e,t,r){"use strict";r("eb5e")},dafe:function(e,t,r){},eb5e:function(e,t,r){},f4a9:function(e,t,r){"use strict";r.r(t);var s=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"container-fluid"},[r("BannerComponent",{attrs:{title:"eBioDiv Matching Service",subtitle:"Linking material citations to specimens"}}),r("div",{directives:[{name:"show",rawName:"v-show",value:3!=e.step,expression:"step != 3"}],staticClass:"row",attrs:{id:"query"}},[r("QueryChoice")],1),r("div",{directives:[{name:"show",rawName:"v-show",value:3!=e.step,expression:"step != 3"}],staticClass:"button-container"},[r("ExecuteButton",{attrs:{button_text:"See specimens",disabled:e.is_disabled},on:{click:function(t){return e.runSearchFromButton("PRESERVED_SPECIMEN",1)}}}),r("ExecuteButton",{attrs:{button_text:"See material citations",disabled:e.is_disabled},on:{click:function(t){return e.runSearchFromButton("MATERIAL_CITATION",1)}}})],1),r("div",{directives:[{name:"show",rawName:"v-show",value:1==e.step&&null==e.user_query.basisOfRecord,expression:"step == 1 && user_query.basisOfRecord == null"}],staticClass:"row"},[e._m(0)]),r("div",{directives:[{name:"show",rawName:"v-show",value:2==e.step,expression:"step == 2"}],ref:"step2",staticClass:"row",attrs:{id:"occurrences"}},[r("OccurrencesList",{ref:"occurrencesList"})],1),r("div",{directives:[{name:"show",rawName:"v-show",value:3==e.step,expression:"step == 3"}],staticClass:"row",attrs:{id:"specimen"}},[r("CurationList",{ref:"curationList",on:{back:e.reloadOccurrences}})],1)],1)},i=[function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"info-container"},[r("p",[e._v("Are you new to the matching service? Then "),r("a",{attrs:{href:"https://ebiodiv.org/help/",target:"_blank"}},[e._v("click here")]),e._v(" !")])])}],u=r("5530"),n=(r("b64b"),r("ac1f"),r("1276"),r("dca8"),r("d81d"),r("b0c0"),r("0303")),c=r("3cc8"),a=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"component-container query-container"},[r("h2",[e._v("Search")]),r("div",{staticClass:"details"},[r("label",[e._v("Enter a search term (e.g. an institution, a country, a taxon, etc.): ")]),r("br"),r("input",{directives:[{name:"model",rawName:"v-model.trim",value:e.user_query.pre_q,expression:"user_query.pre_q",modifiers:{trim:!0}}],attrs:{type:"text",required:""},domProps:{value:e.user_query.pre_q},on:{input:function(t){t.target.composing||e.$set(e.user_query,"pre_q",t.target.value.trim())},blur:function(t){return e.$forceUpdate()}}}),r("br"),r("br")])])},o=[],h=r("2f62"),d={name:"QueryChoice",components:{},computed:Object(u["a"])({},Object(h["c"])(["user_query"]))},l=d,p=(r("c25a"),r("2877")),y=Object(p["a"])(l,a,o,!1,null,"8793e17e",null),f=y.exports,_=r("6fc9"),q=r("3f00"),v={name:"HomePage",components:{BannerComponent:n["a"],ExecuteButton:c["a"],QueryChoice:f,OccurrencesList:_["a"],CurationList:q["a"]},computed:Object(u["a"])(Object(u["a"])({},Object(h["c"])(["user_query","step"])),{},{is_disabled:function(){return!(this.user_query.pre_q.length>0)}}),methods:Object(u["a"])(Object(u["a"])({},Object(h["b"])(["updatePreQuery","updateQuery","updateBasisOfRecord","updatePage","updateRanking","updateFacetSelection","updateOccurrenceKey","updateOccurrencesKeys","updateStep","resetFacets","updateInstitutions"])),{},{runSearchFromButton:function(e,t){this.resetFacets(),this.$refs["step2"].scrollIntoView({behavior:"smooth"}),this.displayOccurrences(e,t)},runSearchFromURL:function(){""!=this.user_query.pre_q&&null!=this.user_query.basisOfRecord&&null==this.user_query.occurrence_key||this.user_query.occurrences_keys.length>0&&null!=this.user_query.basisOfRecord&&null==this.user_query.occurrence_key?this.displayOccurrences(this.user_query.basisOfRecord,this.user_query.page):null!=this.user_query.occurrence_key&&this.displayCuration()},displayOccurrences:function(e,t){this.updateBasisOfRecord(e),this.updatePage(t),this.updateStep(2),this.updateQuery(this.user_query.pre_q),this.$refs.occurrencesList.searchOccurrencesAPI(),this.$gtag.event("displayOccurrences_"+e,{q:this.user_query.q,page:this.user_query.page,occurrencesKeys:this.user_query.occurrences_keys})},reloadOccurrences:function(){var e=this.user_query.occurrence_key;this.updateStep(2),this.updateOccurrenceKey(null),this.updateQuery(this.user_query.pre_q),this.$refs.occurrencesList.searchOccurrencesAPI(e)},displayCuration:function(){this.updateStep(3),this.$refs.curationList.searchCurationAPI(),this.$gtag.event("displayOccurrence",{occurrence:this.user_query.occurrence_key})},loadParametersFromURL:function(){this.updateStep(1);var e="";"q"in this.$route.query&&this.$route.query.q.length>0&&(e=this.$route.query.q),this.updatePreQuery(e),this.updateQuery(e);var t=null;"basisOfRecord"in this.$route.query&&this.$route.query.basisOfRecord.length>0&&(t=this.$route.query.basisOfRecord,"PRESERVED_SPECIMEN"!=t&&"MATERIAL_CITATION"!=t&&(t=null)),this.updateBasisOfRecord(t);var r=1;"page"in this.$route.query&&this.$route.query.page.length>0&&(r=parseInt(this.$route.query.page)),this.updatePage(r);var s="-associatedOccurrences";"ranking"in this.$route.query&&this.$route.query.ranking.length>0&&(s=this.$route.query.ranking),this.updateRanking(s),this.resetFacets();for(var i=0,u=Object.keys(this.user_query.facets_selection);i<u.length;i++){var n=u[i];if(n in this.$route.query&&this.$route.query[n].length>0){var c=this.$route.query[n].split("|");"year"!=n||(c=c.map((function(e){return parseInt(e,10)}))),this.updateFacetSelection(Object.freeze({facet:n,list:c}))}}var a=null;"occurrenceKey"in this.$route.query&&this.$route.query.occurrenceKey.length>0&&(a=this.$route.query.occurrenceKey),this.updateOccurrenceKey(a);var o=[];"occurrencesKeys"in this.$route.query&&this.$route.query.occurrencesKeys.length>0&&(o=this.$route.query.occurrencesKeys.split("|")),this.updateOccurrencesKeys(o)},handlePopstate:function(){this.loadParametersFromURL(),this.runSearchFromURL()},loadInstitutions:function(){var e=this,t=this.$backend.fetch_institutions(),r={};t.then((function(t){for(var s=0;s<t.data.length;s++){var i=t.data[s].key;r[i]=t.data[s].name}e.updateInstitutions(r)})).catch((function(e){console.log(e)}))}}),beforeMount:function(){this.loadParametersFromURL(),this.loadInstitutions()},mounted:function(){this.runSearchFromURL()},created:function(){window.addEventListener("popstate",this.handlePopstate)},beforeDestroy:function(){window.removeEventListener("popstate",this.handlePopstate)}},m=v,b=(r("7583"),Object(p["a"])(m,s,i,!1,null,"4a0876d7",null));t["default"]=b.exports}}]);
//# sourceMappingURL=home.a38c135d.js.map