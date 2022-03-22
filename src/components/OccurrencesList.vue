<template>

    <div class="component-container" :style="cssVars">

        <div v-if="institution_selection.key">

            <div class="separator">
              <h2><span>{{ get_occurrence_name }}s for {{ institution_selection.name }}</span></h2>
            </div>

            <PulseLoader v-if="in_progress" :color="theme_color.main"/>

            <div v-if="!in_progress">

                <p>
                    {{ processed_occurrences.length }} {{ get_occurrence_name.toLowerCase() }}<span v-if="processed_occurrences.length > 1">s</span> with your filters
                    (Total: {{ occurrences.length }} {{ get_occurrence_name.toLowerCase() }}<span v-if="occurrences.length > 1">s</span>)
                </p>

                <div class="content">

                    <FacetsComponent class="facets" collection_name="mc" :documents="occurrences" :filters="filters.occurrences" :user_selection="user_selection.occurrences" :updateFacet="updateOccurrencesFacet" :updateSort="updateOccurrencesSort"/>

                    <div class="full-container">

                        <FiltersSelection :processed_size="processed_occurrences.length" :total_size="occurrences.length" :entity_name="get_occurrence_name" :user_selection="this.user_selection.occurrences" :filters="this.filters.occurrences" :updateFacet="this.updateOccurrencesFacet"/>

                        <div v-if="processed_occurrences.length > 0">

                            <table>

                                 <tr>
                                     <th style="width:5%">{{ get_occurrence_name }} ID</th>
                                     <th style="width:20%">Scientific name</th>
                                     <th style="width:55%">Verbatim label</th>
                                     <th style="width:5%">Date</th>
                                     <th style="width:5%">{{ get_curation_name }} nb</th>
                                     <th style="width:5%">Status</th>
                                     <th style="width:5%"></th>
                                </tr>

                                <OccurrencesElement v-for="occurrence in processed_occurrences.slice(item_min, item_max)" :key="occurrence[get_occurrence_json].gbifID" :occurrence="occurrence" />

                            </table>

                            <br/>

                            <div class="page-box">
                                <v-pagination v-model="current_page" :page-count="page_total" :classes="bootstrapPaginationClasses" :labels="paginationAnchorTexts"></v-pagination>
                            </div>

                            <p v-if="!show_size && processed_occurrences.length > per_page"><a @click="showAll()">Show all {{ get_occurrence_name.toLowerCase() }}s</a></p>
                            <p v-if="show_size && processed_occurrences.length > per_page_init"><a @click="showSome()">Show {{ per_page_init }} {{ get_occurrence_name.toLowerCase() }}s per page</a></p>

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
import OccurrencesElement from '@/components/OccurrencesElement.vue'
var PulseLoader = require('vue-spinner/src/PulseLoader.vue').default;
import shared from '@/components/shared.js'

    export default {
      name: 'OccurrencesList',
      components: {
        vPagination,
        FacetsComponent,
        OccurrencesElement,
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
        ...mapState(['urls', 'institution_selection', 'occurrences', 'matching', 'user_selection', 'filters', 'fields', 'format_selection', 'urls_parameters', 'theme_color']),
        cssVars () {
            return{
                '--color': this.theme_color.main,
            }
        },
        get_occurrence_name(){
            return this.fields[this.format_selection].format_occurrence.name
        },
        get_occurrence_json(){
            return this.fields[this.format_selection].format_occurrence.json
        },
        get_curation_name(){
            return this.fields[this.format_selection].format_curation.name
        },
        get_curation_json(){
            return this.fields[this.format_selection].format_curation.json
        },
        page_total(){
           return Math.ceil(this.processed_occurrences.length/this.per_page)
        },
        item_min(){
            return ((this.current_page-1)*this.per_page)
        },
        item_max(){
            return ((this.current_page*this.per_page))
        },
        processed_occurrences(){

            var filtered_mc = this.occurrences

           // Sort documents
            if (this.user_selection.occurrences.sort == "ID"){
                filtered_mc.sort((a, b) => parseFloat(a[this.get_occurrence_json].key) - parseFloat(b[this.get_occurrence_json].key));
            }
            if (this.user_selection.occurrences.sort == "date"){
                filtered_mc.sort((a, b) => ('year' in b[this.get_occurrence_json] && b[this.get_occurrence_json].year != "" ? parseFloat(b[this.get_occurrence_json].year): 0) - ('year' in a[this.get_occurrence_json] && a[this.get_occurrence_json].year != "" ? parseFloat(a[this.get_occurrence_json].year): 0));
            }
            if (this.user_selection.occurrences.sort == "scientific name"){
                filtered_mc.sort((a, b) => a[this.get_occurrence_json].scientificName.localeCompare(b[this.get_occurrence_json].scientificName))
            }
            if (this.user_selection.occurrences.sort == "matching number"){
                filtered_mc.sort((a, b) => parseFloat(Object.keys(b[this.get_curation_json]).length) - parseFloat(Object.keys(a[this.get_curation_json]).length));
            }

            // Filter facets
            var settings = {'user_selection': this.user_selection.occurrences.facets, 'filters': this.filters.occurrences.facets}
            filtered_mc = filtered_mc.filter(shared.filterThis.bind(this, settings))

            return filtered_mc;

        },

      },
      methods:{
        ...mapActions(['updateOccurrences', 'updateMatching', 'updateOccurrencesFacet', 'updateOccurrencesSort','updateOccurrencesSelection', 'updateInitMcDateFilter']),
        searchOccurrencesAPI () {
            if (this.institution_selection.key){
                this.updateOccurrences([])
                var url = this.urls.occurrences+this.institution_selection.key+"?format="+this.format_selection
                axios
                      .get(url)
                      .then(response => {
                            var occ = []
                            for (var key in response.data.data){
                                occ.push(response.data.data[key])
                            }
                            this.current_page = 1
                            occ = this.processFacets(occ)
                            this.updateOccurrences(occ)
                            this.statusAPI()
                      })
                      .catch(error => {
                        alert ("failed to load "+this.get_occurrence_name+" for "+this.institution_selection.name+": "+error )
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
                            for (let v = 0; v < this.occurrences.length; v++ ) {
                                if (this.occurrences[v][this.get_occurrence_json].key == mc_key){
                                    this.occurrences[v].processed_facets["status"] = [status_string]
                                }
                            }
                            this.updateOccurrences(this.occurrences)

                            matching.push(matching_instance)

                        }
                        // Store matching
                        this.updateMatching(matching)
                      })
                      .catch(error => {
                        alert ("Failed to load status for "+this.institution_selection.name+": "+error )
                      })
                      .finally(() => {
                       this.in_progress = false
                       if (this.urls_parameters.occurrence != null){
                            for (var i=0; i<this.occurrences.length; i++){
                                if (this.occurrences[i][this.get_occurrence_json].key == this.urls_parameters.occurrence){
                                    this.updateOccurrencesSelection(this.occurrences[i])
                                    this.$router.push({ name: 'HomePage', query: { institution: this.institution_selection.key, format: this.format_selection, occurrence: this.occurrences[i][this.get_occurrence_json].key}}).catch(()=>{});
                                }
                            }
                        }
                      })

            }
        },
        showAll(){
            this.per_page= this.processed_occurrences.length;
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
                var document = mc[v][this.get_occurrence_json]
                var processed_facets = {}
                for (var f=0; f<this.filters.occurrences.facets.length; f++){
                    var facet_name = this.filters.occurrences.facets[f].short
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
            this.$router.push({ name: 'HomePage', hash: '#occurrences', query: this.$route.query}).catch(()=>{});
        }
      },
       watch: {
            'institution_selection.key': function () {
                this.in_progress = true
                this.searchOccurrencesAPI()
            },
            'format_selection': function () {
                this.in_progress = true
                this.searchOccurrencesAPI()
            },
            processed_occurrences: function () {
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
            if (this.occurrences.length > 0 && this.matching == null){
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
