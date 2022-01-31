<template>

    <div class="component-container" :style="cssVars">

        <div v-if="institution_selection.key">

            <div class="separator">
              <h2><span>Material citations for {{ institution_selection.name }}</span></h2>
            </div>

            <PulseLoader v-if="in_progress" :color="theme_color.main"/>

            <div v-if="!in_progress">

                <p>
                    {{ processed_material_citations.length }} material citation<span v-if="processed_material_citations.length > 1">s</span> with your filters
                    (Total: {{ material_citations.length }} material citation<span v-if="material_citations.length > 1">s</span>)
                </p>

                <div class="content">

                    <Facets class="facets" collection_name="mc" :documents="material_citations" :filters="filters.material_citations" :user_selection="user_selection.material_citations" :updateFacet="updateMaterialCitationsFacet" :updateSort="updateMaterialCitationsSort"/>

                    <div class="full-container">

                        <div class="active-filters">
                            <span class="filter-name" v-for="filter in active_filters" :key="filter.name" >
                                <span class="filter-remove" @click="removeFilter(filter.type, filter.name)">x </span> {{ filter.name }}
                            </span>
                            <span class="filters-remove" v-if="active_filters.length > 1">
                                <span @click="removeAllFilters">Remove all filters</span>
                            </span>
                        </div>

                        <p v-if="processed_material_citations.length==0 && material_citations.length >0"><br/>No material citation retrieved with your filters. <a @click="removeAllFilters">Delete filters</a> to see all material citations.</p>

                        <div v-if="processed_material_citations.length > 0">

                            <table>

                                 <tr>
                                     <th style="width:5%">Material citation ID</th>
                                     <th style="width:20%">Scientific name</th>
                                     <th style="width:55%">Verbatim label</th>
                                     <th style="width:5%">Date</th>
                                     <th style="width:5%">Specimen nb</th>
                                     <th style="width:5%">Status</th>
                                     <th style="width:5%"></th>
                                </tr>

                                <tr v-for="material_citation in processed_material_citations.slice(item_min, item_max)" :key="material_citation.materialCitationOccurrence.gbifID">

                                        <td>{{ material_citation.materialCitationOccurrence.key }}</td>
                                        <td>{{ material_citation.materialCitationOccurrence.acceptedScientificName }}</td>
                                        <td>{{ material_citation.materialCitationOccurrence.verbatimLabel }}</td>
                                        <td>{{ material_citation.materialCitationOccurrence.year }}</td>
                                        <td>{{ material_citation.institutionOccurrences.length }}</td>
                                        <td v-if="material_citation.materialCitationOccurrence.status=='not-done'"><img src="../assets/images/icon_status_not-done.png" class="small"/></td>
                                        <td v-if="material_citation.materialCitationOccurrence.status=='partial'"><img src="../assets/images/icon_status_partial.png" class="small"/></td>
                                        <td v-if="material_citation.materialCitationOccurrence.status=='finished'"><img src="../assets/images/icon_status_finished.png" class="small"/></td>
                                        <td><button @click="displaySpecimen(material_citation)" class="button-table"><img src="../assets/images/icon_todo.png"  class="mini"/></button></td>
                                </tr>

                            </table>

                            <br/>

                            <div class="page-box">
                                <v-pagination v-model="current_page" :page-count="page_total" :classes="bootstrapPaginationClasses" :labels="paginationAnchorTexts"></v-pagination>
                            </div>

                            <p v-if="!show_size && processed_material_citations.length > per_page"><a @click="showAll()">Show all material citations</a></p>
                            <p v-if="show_size && processed_material_citations.length > 10"><a @click="showSome()">Show 10 material citations per page</a></p>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    </div>

</template>


<script>
import { mapState, mapActions } from 'vuex'
import axios from 'axios';
import vPagination from 'vue-plain-pagination'
import Facets from '@/components/Facets.vue'
var PulseLoader = require('vue-spinner/src/PulseLoader.vue').default;
import shared from '@/components/shared.js'

    export default {
      name: 'MaterialCitations',
      components: {
        vPagination,
        Facets,
        PulseLoader
      },
      data() {
        return {
            in_progress: false,
            current_page: 1,
            per_page: 30,
            show_size: false,
            bootstrapPaginationClasses: {
            ul: 'pagination',
            li: 'page-item',
            liActive: 'active',
            liDisable: 'disabled',
            button: 'page-link'
          },
          paginationAnchorTexts: {
            first: '<<',
            prev: '<',
            next: '>',
            last: '>>'
          }
        };
      },
      computed: {
        ...mapState(['urls', 'institution_selection', 'material_citations', 'user_selection', 'filters', 'theme_color']),
        cssVars () {
            return{
                '--color': this.theme_color.main,
            }
        },
        page_total(){
           return Math.ceil(this.processed_material_citations.length/this.per_page)
        },
        item_min(){
            return ((this.current_page-1)*this.per_page)
        },
        item_max(){
            return ((this.current_page*this.per_page))
        },
        processed_material_citations(){

            var filtered_mc = this.material_citations

           // Sort documents
            if (this.user_selection.material_citations.sort == "material citation ID"){
                filtered_mc.sort((a, b) => parseFloat(a.materialCitationOccurrence.key) - parseFloat(b.materialCitationOccurrence.key));
            }
            if (this.user_selection.material_citations.sort == "date"){
                filtered_mc.sort((a, b) => parseFloat(b.materialCitationOccurrence.year) - parseFloat(a.materialCitationOccurrence.year));
            }
            if (this.user_selection.material_citations.sort == "scientific name"){
                filtered_mc.sort((a, b) => a.materialCitationOccurrence.scientificName.localeCompare(b.materialCitationOccurrence.scientificName))
            }
            if (this.user_selection.material_citations.sort == "specimen number"){
                filtered_mc.sort((a, b) => parseFloat(b.institutionOccurrences.length) - parseFloat(a.institutionOccurrences.length));
            }

            // Filter facets
            var settings = {'user_selection': this.user_selection.material_citations.facets, 'filters': this.filters.material_citations.facets}
            filtered_mc = filtered_mc.filter(shared.filterThis.bind(this, settings))

            return filtered_mc;

        },
        active_filters(){
            var active_filters = []
            for (const key in this.user_selection.material_citations.facets) {
                var list = this.user_selection.material_citations.facets[key]
                if (key != "date"){
                    for (var i=0; i<list.length; i++){
                        var item = {}
                        item.name = list[i]
                        item.type = key
                        active_filters.push(item)
                    }
                }
                else {
                    if (this.filters.material_citations.date[0] != this.user_selection.material_citations.facets.date[0] || this.filters.material_citations.date[1] != this.user_selection.material_citations.facets.date[1]){
                        var item_date = {}
                        item_date.name = "date range"
                        item_date.type = key
                        active_filters.push(item_date)
                    }
                }
            }
            return active_filters;
        },
      },
      methods:{
        ...mapActions(['updateMaterialCitations', 'updateMaterialCitationsFacet', 'updateMaterialCitationsSort','updateMaterialCitationSelection']),
        async searchMcAPI () {
            var mc = []
            if (this.institution_selection.key){
                try {
                    const response = await axios.get(this.urls.material_citations+this.institution_selection.key)
                    for (var key in response.data.data){
                        mc.push(response.data.data[key])
                    }
                } catch (e) {
                    alert ("failed to load material citation for "+this.institution_selection.name)
                }
            }
            this.current_page = 1
            mc = this.getStatus(mc)
            mc = this.processFacets(mc)
            this.updateMaterialCitations(mc)
            this.in_progress = false
        },
        showAll(){
            this.per_page= this.processed_material_citations.length;
            this.current_page = 1
            this.show_size = true
        },
        showSome(){
            this.per_page= 10
            this.show_size = false
        },
        getStatus(mc){
            for (var v = 0; v < mc.length; v++ ) {
                mc[v].materialCitationOccurrence.status = "not-done"
            }
            return mc
        },
        processFacets(mc){
            for (var v = 0; v < mc.length; v++ ) {
                var document = mc[v].materialCitationOccurrence
                var processed_facets = {}
                for (var f=0; f<this.filters.material_citations.facets.length; f++){
                    var facet_name = this.filters.material_citations.facets[f].short
                    var entities = []
                    // For named entities
                    if (facet_name in document){
                        if (document[facet_name] != ""){
                            entities.push(document[facet_name])
                        }
                    }
                    // For dates
                    else if (facet_name == "date"){
                        if ("year" in document){
                            entities.push(document.year)
                        }
                    }
                    // Remove duplicates
                    var entities_unique = [...new Set(entities)];
                    processed_facets[facet_name] = entities_unique
                }
                mc[v].processed_facets = processed_facets
            }
            return mc
        },
        removeFilter(facet_name, value){
            var facet_name_low = facet_name.toLowerCase()
            if (facet_name_low != "date"){
                var filter_list = this.user_selection.material_citations.facets[facet_name_low]
                for (var i = 0; i < filter_list.length; i++ ) {
                   if (filter_list[i] == value) {
                     filter_list.splice(i, 1)
                   }
                }
                this.updateMaterialCitationsFacet({'facet': facet_name_low, 'list': filter_list })
            }
            else{
                this.updateMaterialCitationsFacet({'facet': 'date', 'list': this.filters.material_citations.date })
            }
        },
        removeAllFilters(){
            for (var key in this.user_selection.material_citations.facets){
                this.updateMaterialCitationsFacet({'facet': key, 'list': [] })
            }
            this.updateMaterialCitationsFacet({'facet': 'date', 'list': this.filters.material_citations.date })
        },
        displaySpecimen(selection){
            this.updateMaterialCitationSelection(selection)
            this.$router.push({ name: 'Home', hash: '#specimen', query: this.$route.query}).catch(()=>{});
        },
        goToTop(){
            this.$router.push({ name: 'Home', query: this.$route.query}).catch(()=>{});
            this.$router.push({ name: 'Home', hash: '#materialcitations', query: this.$route.query}).catch(()=>{});
        }
      },
       watch: {
            'institution_selection.key': function () {
                this.in_progress = true
                this.searchMcAPI()
            },
            processed_material_citations: function () {
                this.goToTop()
            },
            per_page: function () {
                this.goToTop()
            },
            current_page: function () {
                this.goToTop()
            },
        }

    }

</script>


<style scoped lang="scss">

    .content {
        display: flex;
    }

    .full-container {
        width: 100%;
        margin: 0 auto;
    }

    .facets {
        float: left;
        margin-right: 20px;
    }

    .button-table {
      display: inline-block;
      border-radius:5px;
      background-color: #AAA;
      border: none;
      color: #FFFFFF;
      text-align: center;
      padding: 5px 5px;
      cursor: pointer;
    }

    .button-table:hover {
      background-color: var(--color);
    }

    .page-box {
      display: flex;
      justify-content: center;
    }

    .active-filters{
      text-align: left;
      margin-bottom: 10px;
    }

    .filter-name {
      background-color: #f2f2f2;
      border-radius: 10px;
      padding: 2px 10px;
      margin-right: 5px;
      font-size: 0.8em;
    }

    .filter-remove {
      color: #AAAAAA;
      border-right: 1px solid #AAAAAA;
      margin-right: 5px;
    }

    .filter-remove:hover {
      cursor:pointer;
      color: var(--color);
    }

    .filters-remove {
      padding: 2px 10px;
      margin-right: 5px;
      font-size: 0.8em;
    }
    .filters-remove:hover {
      cursor:pointer;
      color: var(--color);
    }

    .small {
        width: 50px;
    }

    .mini {
        width: 15px;
    }

    table {
          margin-bottom: 20px;
          border-collapse: collapse;
          width: 100%;
          font-size: 0.8em;
          background-color: #eee
    }

    td, th {
      border-bottom: 1px solid #ddd;
      padding: 6px;
      text-align: center;
    }

    tr:nth-child(even){
      background-color: #fff;
    }

    tr:hover {
      background-color: #ddd;
    }

    th {
      padding-top: 6px;
      padding-bottom: 6px;
      background-color: var(--color);
      color: white;
    }

</style>
