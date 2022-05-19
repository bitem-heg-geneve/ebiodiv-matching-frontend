<template>

    <div class="component-container" :style="cssVars">
        <div>

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

                        <FiltersSelection :processed_size="processed_occurrences.length" :total_size="occurrences.length" entity_name="occurrence" :user_selection="this.user_selection.occurrences" :filters="this.filters.occurrences" :updateFacet="this.updateOccurrencesFacet"/>

                        <div v-if="processed_occurrences.length > 0">

                            <table>

                                 <tr>
                                     <th style="width:5%">{{ get_occurrence_name }} ID</th>
                                     <th style="width:20%">Scientific name</th>
                                     <th v-if="get_occurrence_name=='Material citation'" style="width:45%">Verbatim label</th>
                                     <th style="width:5%">Type</th>
                                     <th style="width:5%">Record</th>
                                     <th style="width:5%">Date</th>
                                     <th style="width:5%">{{ get_curation_name }} nb</th>
                                     <th style="width:5%">Status</th>
                                     <th style="width:5%"></th>
                                </tr>

                                <OccurrencesElement v-for="occurrence in processed_occurrences.slice(item_min, item_max)" :key="occurrence.gbifID" :occurrence="occurrence" />

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
        ...mapState(['urls', 'institution_selection', 'datasets_selection', 'format_selection', 'occurrences', 'matching', 'user_selection', 'filters', 'fields', 'format_selection', 'urls_parameters', 'step', 'theme_color']),
        cssVars () {
            return{
                '--color': this.theme_color.main,
            }
        },
        get_occurrence_name(){
            if (this.format_selection){
                return this.fields[this.format_selection].format_occurrence.name
            }
            return ""
        },
        get_curation_name(){
             if (this.format_selection){
               return this.fields[this.format_selection].format_curation.name
            }
            return ""
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
                filtered_mc.sort((a, b) => parseFloat(a.key) - parseFloat(b.key));
            }
            if (this.user_selection.occurrences.sort == "date"){
                filtered_mc.sort((a, b) => ('year' in b && b.year != "" ? parseFloat(b.year): 0) - ('year' in a && a.year != "" ? parseFloat(a.year): 0));
            }
            if (this.user_selection.occurrences.sort == "scientific name"){
                filtered_mc.sort((a, b) => a.scientificName.localeCompare(b.scientificName))
            }
            if (this.user_selection.occurrences.sort == "matching number"){
                filtered_mc.sort((a, b) => parseFloat(Object.keys(b.relations).length) - parseFloat(Object.keys(a.relations).length));
            }

            // Filter facets
            var settings = {'user_selection': this.user_selection.occurrences.facets, 'filters': this.filters.occurrences.facets}
            filtered_mc = filtered_mc.filter(shared.filterThis.bind(this, settings))

            return filtered_mc;

        },
        query_update(){
            return this.institution_selection.key+";"+this.datasets_selection.join("+")+this.format_selection
        }
      },
      methods:{
        ...mapActions(['updateOccurrences', 'updateMatching', 'updateOccurrencesFacet', 'updateOccurrencesSort','updateOccurrencesSelection', 'updateInitMcDateFilter', 'updateStep']),
        searchOccurrencesAPI (reload) {
            if (this.institution_selection.key){
              this.in_progress = true
              this.updateOccurrences([])
                var url = this.urls.occurrences+"?scores=true&institutionKey="+this.institution_selection.key+"&datasetKey="+this.datasets_selection.join("+")
                axios
                      .get(url)
                      .then(response => {
                            var occ = []
                            var keys = []
                            if (this.format_selection == "specimen_matcit"){
                                for (let index in response.data.subjectOccurrenceKeys){
                                    let key = response.data.subjectOccurrenceKeys[index]
                                    let object = response.data.occurrences[key]
                                    object['key'] = key
                                    object = this.processRelations(object, response.data)
                                    occ.push(object)
                                    keys.push(key)
                                }
                            }
                            else {
                               var specimens = {}
                               for (let index in response.data.subjectOccurrenceKeys){
                                    let key = response.data.subjectOccurrenceKeys[index]
                                    specimens[key] = ""
                               }
                               for (let key in response.data.occurrences){
                                    if (!(key in specimens)) {
                                        let object = response.data.occurrences[key]
                                        object['key'] = key
                                        object = this.processRelations(object, response.data)
                                        occ.push(object)
                                        keys.push(key)
                                    }
                                }
                            }
                            this.current_page = 1
                            occ = this.processFacets(occ)
                            this.updateOccurrences(occ)
                            this.in_progress = false
                            this.goToTop()
                            if(!reload && this.urls_parameters.occurrence != null){
                                for (let index in occ){
                                    if(occ[index].key == this.urls_parameters.occurrence){
                                        this.updateOccurrencesSelection(occ[index])
                                        this.updateStep(3)
                                        this.$router.push({ name: 'HomePage', query: { institutionKey: this.institution_selection.key, datasetKeys: this.datasets_selection.join(','), format: this.format_selection, occurrenceKey: this.urls_parameters.occurrence}}).catch(()=>{});
                                    }
                                }
                            }
                      })
                      .catch(error => {
                        alert ("failed to load occurrences for "+this.institution_selection.name+": "+error )
                      })

            }
        },
        processRelations(object, json){
            var key = object['key']
            var relations = []
            var not_done = []
            var done = []
            for (let index in json.occurrenceRelations){
                var relation = json.occurrenceRelations[index]
                let relatedKey = null
                if (relation.occurrenceKey1 == key){
                    relatedKey = relation.occurrenceKey2
                }
                if (relation.occurrenceKey2 == key){
                    relatedKey = relation.occurrenceKey1
                }
                if (relatedKey != null){
                    let relatedObject = {}
                    // temp decision reload
                    var matching = {}
                    matching['match'] = relation.decision
                    relatedObject['matching'] = matching
                    relatedObject['scores'] = relation.scores
                    relatedObject['object'] = json.occurrences[relatedKey]
                    relatedObject['object']['key'] = relatedKey
                    if (relatedObject['matching'].match !=  null){
                        done.push(relatedKey)
                    }
                    else {
                        not_done.push(relatedKey)
                    }
                    relations.push(relatedObject)
                }
            }
            object['relations'] = relations
            if (not_done.length == relations.length){
                object['status'] = "not-done"
            }
            else if (done.length == relations.length){
                object['status'] = "finished"
            }
            else {
                object['status'] = "partial"
            }
            return object
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
        processFacets(occ){
            var min_date = 2022
            var max_date = 0
            for (var v = 0; v < occ.length; v++ ) {
                var document = occ[v]
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
                occ[v].processed_facets = processed_facets
            }
            this.updateInitMcDateFilter([min_date, max_date])
            return occ
        },
        goToTop(){
            this.$router.push({ name: 'HomePage', query: this.$route.query}).catch(()=>{});
            this.$router.push({ name: 'HomePage', hash: '#occurrences', query: this.$route.query}).catch(()=>{});
        }
      },
       watch: {
            processed_occurrences: function () {
                //this.goToTop()
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
