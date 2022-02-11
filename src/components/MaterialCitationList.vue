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

                    <FacetsComponent class="facets" collection_name="mc" :documents="material_citations" :filters="filters.material_citations" :user_selection="user_selection.material_citations" :updateFacet="updateMaterialCitationsFacet" :updateSort="updateMaterialCitationsSort"/>

                    <div class="full-container">

                        <FiltersSelection :processed_size="processed_material_citations.length" :total_size="material_citations.length" entity_name="material citation" :user_selection="this.user_selection.material_citations" :filters="this.filters.material_citations" :updateFacet="this.updateMaterialCitationsFacet"/>

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

                                <MaterialCitation v-for="material_citation in processed_material_citations.slice(item_min, item_max)" :key="material_citation.materialCitationOccurrence.gbifID" :material_citation="material_citation" />

                            </table>

                            <br/>

                            <div class="page-box">
                                <v-pagination v-model="current_page" :page-count="page_total" :classes="bootstrapPaginationClasses" :labels="paginationAnchorTexts"></v-pagination>
                            </div>

                            <p v-if="!show_size && processed_material_citations.length > per_page"><a @click="showAll()">Show all material citations</a></p>
                            <p v-if="show_size && processed_material_citations.length > per_page_init"><a @click="showSome()">Show {{ per_page_init }} material citations per page</a></p>

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
import FacetsComponent from '@/components/FacetsComponent.vue'
import FiltersSelection from '@/components/FiltersSelection.vue'
import MaterialCitation from '@/components/MaterialCitation.vue'
var PulseLoader = require('vue-spinner/src/PulseLoader.vue').default;
import shared from '@/components/shared.js'

    export default {
      name: 'MaterialCitationList',
      components: {
        vPagination,
        FacetsComponent,
        MaterialCitation,
        FiltersSelection,
        PulseLoader
      },
      data() {
        return {
            status: [],
            in_progress: false,
            current_page: 1,
            per_page_init: 30,
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
        ...mapState(['urls', 'institution_selection', 'material_citations', 'matching', 'user_selection', 'filters', 'theme_color']),
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
                filtered_mc.sort((a, b) => ('year' in b.materialCitationOccurrence && b.materialCitationOccurrence.year != "" ? parseFloat(b.materialCitationOccurrence.year): 0) - ('year' in a.materialCitationOccurrence && a.materialCitationOccurrence.year != "" ? parseFloat(a.materialCitationOccurrence.year): 0));
            }
            if (this.user_selection.material_citations.sort == "scientific name"){
                filtered_mc.sort((a, b) => a.materialCitationOccurrence.scientificName.localeCompare(b.materialCitationOccurrence.scientificName))
            }
            if (this.user_selection.material_citations.sort == "specimens number"){
                filtered_mc.sort((a, b) => parseFloat(Object.keys(b.institutionOccurrences).length) - parseFloat(Object.keys(a.institutionOccurrences).length));
            }

            // Filter facets
            var settings = {'user_selection': this.user_selection.material_citations.facets, 'filters': this.filters.material_citations.facets}
            filtered_mc = filtered_mc.filter(shared.filterThis.bind(this, settings))

            return filtered_mc;

        },

      },
      methods:{
        ...mapActions(['updateMaterialCitations', 'updateMatching', 'updateMaterialCitationsFacet', 'updateMaterialCitationsSort','updateMaterialCitationSelection', 'updateInitMcDateFilter']),
        searchMcAPI () {
            if (this.institution_selection.key){
                axios
                      .get(this.urls.material_citations+this.institution_selection.key)
                      .then(response => {
                            var mc = []
                            for (var key in response.data.data){
                                mc.push(response.data.data[key])
                            }
                            this.current_page = 1
                            mc = this.processFacets(mc)
                            this.updateMaterialCitations(mc)
                            this.statusAPI()
                      })
                      .catch(error => {
                        alert ("failed to load material citation for "+this.institution_selection.name+": "+error )
                      })

            }

        },
        statusAPI () {
            if (this.institution_selection.key){
                axios
                      .get(this.urls.institution_status+this.institution_selection.key)
                      .then(response => {
                        var matching = []
                        if (response.message == "Internal Server Error"){
                            alert ("Failed to load status for "+this.institution_selection.name )
                        }
                        for (var mc_key in response.data){
                            var mc_matching = response.data[mc_key]

                            var matching_instance = {}
                            matching_instance['key'] = mc_key

                             // Load specimen status
                            var specimens_status = {}
                            if ('institutionOccurrences' in mc_matching){
                                 Object.entries(mc_matching.institutionOccurrences).forEach(entry => {
                                    var [specimen_key, specimen_value] = entry;
                                    if (specimen_value.match != null){
                                        specimens_status[specimen_key] = specimen_value.match.toString()
                                    }
                                });
                            }
                            matching_instance['specimens_status'] = specimens_status

                            // Load material citation status
                            var status_string = ""
                            if (mc_matching.done == false){
                                status_string = "not-done"
                                if (Object.keys(specimens_status).length > 0){
                                    status_string = "partial"
                                }
                            }
                            else if (mc_matching.done == true){
                                status_string = "finished"
                            }
                            matching_instance['material_citation_status'] = status_string

                            // Store facets
                            for (let v = 0; v < this.material_citations.length; v++ ) {
                                if (this.material_citations[v].materialCitationOccurrence.key == mc_key){
                                    this.material_citations[v].processed_facets["status"] = [status_string]
                                }
                            }
                            this.updateMaterialCitations(this.material_citations)

                            matching.push(matching_instance)

                        }
                        // Store matching
                        this.updateMatching(matching)
                      })
                      .catch(error => {
                        alert ("Failed to load status for "+this.institution_selection.name+": "+error )
                      })
                      .finally(() => this.in_progress = false)

            }
        },
        showAll(){
            this.per_page= this.processed_material_citations.length;
            this.current_page = 1
            this.show_size = true
        },
        showSome(){
            this.per_page= this.per_page_init
            this.show_size = false
        },
        processFacets(mc){
            var min_date = 2022
            var max_date = 0
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
                            var year = parseInt(document.year)
                            if (year < min_date){
                                min_date = year
                            }
                            if (year > max_date){
                                max_date = year
                            }
                            entities.push(year)
                        }
                        else {
                            min_date = 0
                        }
                    }
                    // Remove duplicates
                    var entities_unique = [...new Set(entities)];
                    processed_facets[facet_name] = entities_unique
                }
                mc[v].processed_facets = processed_facets
            }
            this.updateInitMcDateFilter([min_date, max_date])
            return mc
        },
        goToTop(){
            this.$router.push({ name: 'HomePage', query: this.$route.query}).catch(()=>{});
            this.$router.push({ name: 'HomePage', hash: '#materialcitations', query: this.$route.query}).catch(()=>{});
        }
      },
       watch: {
            'institution_selection.key': function () {
                this.in_progress = true
                this.searchMcAPI()
            },
            processed_material_citations: function () {
            //    this.goToTop()
                if (this.current_page > this.page_total){
                    this.current_page = 1;
                }
            },
            per_page: function () {
                this.goToTop()
            },
            current_page: function () {
                this.goToTop()
            },
        },
        created: function () {
            if (this.material_citations.length > 0 && this.matching == null){
                this.in_progress = true
                this.statusAPI()
            }
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

    .page-box {
      display: flex;
      justify-content: center;
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
