(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["occurrence"],{cd97:function(e,t,r){"use strict";r.r(t);var n=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"container-fluid"},[r("BannerComponent",{attrs:{title:"eBioDiv",subtitle:"Linking material citations to specimens"}}),e.in_progress?r("PulseLoader",{attrs:{color:e.theme_color.main}}):[e.occurrences_selection?r("div",[r("CurationList",{attrs:{show_back_button:!1}})],1):r("div",{staticClass:"alert alert-warning",attrs:{role:"alert"}},[e._v(" Occurrence "+e._s(e.occurrenceKey)+" not found ")])]],2)},c=[],a=r("1da1"),o=r("5530"),s=(r("96cf"),r("2f62")),i=r("0303"),u=r("3f00"),l=r("8a5d").default,d={name:"OccurrencePage",components:{PulseLoader:l,BannerComponent:i["a"],CurationList:u["a"]},data:function(){return{in_progress:!0,occurrenceKey:null}},computed:Object(o["a"])({},Object(s["c"])(["occurrences_selection","theme_color"])),methods:Object(o["a"])({},Object(s["b"])(["updateFormatSelection","updateOccurrencesSelection"])),mounted:function(){var e=this;return Object(a["a"])(regeneratorRuntime.mark((function t(){var r,n,c;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return r=e.$route.params.occurrenceKey,e.occurrenceKey=r,e.updateFormatSelection("matcit_specimen"),t.next=5,e.$backend.fetch_occurrence(r,!0);case 5:if(n=t.sent,c=e.$backend.processOccurrences(n.data,"specimen_matcit"),0==c.length){t.next=12;break}if(c[0].key==r){t.next=11;break}return alert("Internal error"),t.abrupt("return");case 11:e.updateOccurrencesSelection(c[0]);case 12:e.in_progress=!1;case 13:case"end":return t.stop()}}),t)})))()}},p=d,m=r("2877"),b=Object(m["a"])(p,n,c,!1,null,null,null);t["default"]=b.exports}}]);
//# sourceMappingURL=occurrence.68d1ef39.js.map