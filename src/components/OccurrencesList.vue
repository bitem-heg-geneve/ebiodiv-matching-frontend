<template>

    <div class="component-container" :style="cssVars">

        <div class="separator">
            <h2><span>{{ get_occurrence_name }}s for {{ user_query.q }}</span></h2>
        </div>

        <div>

            <p  v-if="!in_progress">
                (Total: {{ total }} {{ get_occurrence_name.toLowerCase() }}<span v-if="total > 1">s</span>)
            </p>

            <div class="content-container">

                <FacetsComponent ref="facetsBox" class="facets-container" :filters="filters" :user_query="user_query" :updateRanking="updateRanking" :updateFacetSelection="updateFacetSelection"/>
                
                <div class="centered-container" v-if="in_progress">
                    <PulseLoader :color="theme_color.main" />
                </div>

                <div class="full-container"  v-if="!in_progress">
                    
                    
                    <FiltersSelection :facets="this.user_query.facets_selection"
                        :updateFacetSelection="this.updateFacetSelection" :resetFacets="this.resetFacets" />
                        
                    <div v-if="occurrences.length > 0">

                        <table>

                            <tr>
                                <th style="width:5%">{{ get_occurrence_name }} ID</th>
                                <th style="width:20%">Scientific name</th>
                                <th v-if="user_query.basisOfRecord=='MATERIAL_CITATION'" style="width:45%">Verbatim label</th>
                                <th style="width:5%">Type</th>
                                <th style="width:5%">Record</th>
                                <th style="width:5%">Year</th>
                                <th style="width:5%">{{ get_curation_name }} nb</th>
                                <th style="width:5%">Status</th>
                                <th style="width:5%"></th>
                            </tr>

                            <OccurrencesElement v-for="occurrence in occurrences"
                                :id="occurrence.key"
                                :key="'occurrence_'+occurrence.key" 
                                :occurrence="occurrence" />
                            
                        </table>

                        <br />

                        <div class="page-box">
                            <v-pagination v-model="user_query.page" :page-count="page_total"
                                :classes="bootstrapPaginationClasses" :labels="paginationAnchorTexts">
                            </v-pagination>
                        </div>

                    </div>

                </div>

            </div>

        </div>

    </div>

</template>


<script>
import { mapState, mapActions } from 'vuex'
import vPagination from 'vue-plain-pagination'
import FacetsComponent from '@/components/FacetsComponent.vue'
import FiltersSelection from '@/components/FiltersSelection.vue'
import OccurrencesElement from '@/components/OccurrencesElement.vue'
var PulseLoader = require('vue-spinner/src/PulseLoader.vue').default;

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
            occurrences: [],
            in_progress: false,
            total: 0,
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
            },
        };
    },
    computed: {
        ...mapState([
            'user_query', 
            'filters', 
            'fields', 
            'theme_color'
        ]),
        cssVars() {
            return {
                '--color': this.theme_color.main,
            }
        },
        get_occurrence_name() {
            if (this.user_query.basisOfRecord) {
                return this.fields[this.user_query.basisOfRecord].basisOfRecord_occurrence.name
            }
            return ""
        },
        get_curation_name() {
            if (this.user_query.basisOfRecord) {
                return this.fields[this.user_query.basisOfRecord].basisOfRecord_curation.name
            }
            return ""
        },
        page_total() {
            return Math.ceil(this.total / this.user_query.limit)
        },
    },
    methods: {
        ...mapActions([
            'updateFacetSelection', 
            'updateRanking', 
            'resetFacets'
        ]),
        searchOccurrencesAPI(prev_position=null) {
            if (this.user_query.q != '' || this.user_query.occurrences_keys.length > 0) {
                this.in_progress = true
                this.occurrences = []
                let response_promise = null;
                if (this.user_query.occurrences_keys.length > 0) {
                    response_promise = this.$backend.fetch_occurrences_from_occurrencekeys(this.user_query.occurrences_keys)
                } else {
                    response_promise = this.$backend.fetch_occurrences_from_q(this.user_query)
                }
                response_promise.then(response => {
                        this.occurrences = response.data.results;
                        this.total = response.data.count
                        this.in_progress = false
                        var parameters= {}
                        if (this.user_query.q != ''){
                            parameters['q'] = this.user_query.q
                        }
                        parameters['basisOfRecord'] = this.user_query.basisOfRecord
                        if (this.user_query.page != 1){
                            parameters['page'] = this.user_query.page
                        }
                        if (this.user_query.ranking != "-associatedOccurrences"){
                            parameters['ranking'] = this.user_query.ranking
                        }      
                        if (this.user_query.occurrences_keys.length > 0){
                            parameters['occurrencesKeys'] = this.user_query.occurrences_keys.join("|")
                        }  
                        for (const [name, values] of Object.entries(this.user_query.facets_selection)) {
                            if(values.length > 0){
                                parameters[name] = values.join("|");
                            }
                        }
                        if(prev_position == null){
                            this.$router.push({ query: parameters }).catch(()=>{});
                        } 
                        else {
                            
                            this.$router.push({ hash: '#'+prev_position, query: parameters }).catch(()=>{});

                        }  
                })
                .catch(error => {
                    console.log(error)
                    alert("failed to load occurrences : " + error)
                })
            }
        },
        clearCache(){
            this.$refs['facetsBox'].clearCache()
        },
    },
    watch: {
        "user_query.page": function () {
            this.searchOccurrencesAPI()
        },
        "user_query.ranking": function () {
            this.searchOccurrencesAPI()
        },
        "user_query.facets_selection": {
            handler(){
                this.searchOccurrencesAPI()
            },
            deep: true
        }
    },
}

</script>


<style scoped lang="scss">

.content-container {
    display: flex;
}

.full-container {
    width: 100%;
    margin: 0 auto;
}

.centered-container {
    text-align: center;
    width: 100%;
    padding-top: 50px;
}

.facets-container {
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
    font-size: 0.8rem;
    background-color: #eee
}

td,
th {
    border-bottom: 1px solid #ddd;
    padding: 6px;
    text-align: center;
}

tr:nth-child(even) {
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
