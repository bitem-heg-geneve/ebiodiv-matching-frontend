<template>

    <div class="component-container" :style="cssVars">

        <div ref="table">

            <div class="content-container">

                <FacetsComponent v-if="this.user_query.occurrences_keys.length == 0" ref="facetsBox" class="facets-container" 
                    :filters="filters" 
                    :user_query="user_query" 
                    :updateRanking="updateRanking" 
                    :updateQuery="updateQuery"
                    :updateBasisOfRecord="updateBasisOfRecord"
                    :updateFacetSelection="updateFacetSelection"/>
                
                <div class="full-container">

                    <div class="centered-container" v-if="in_progress">
                        <PulseLoader :color="theme_color.main" />
                    </div>

                    <div v-else>

                        <p  v-if="!in_progress">
                            (Total: {{ total }} {{ get_occurrence_name.toLowerCase() }}<span v-if="total > 1">s</span>)
                        </p>

                        <FiltersSelection  v-if="this.user_query.occurrences_keys.length == 0" 
                                :facets="this.user_query.facets_selection"
                                :updateFacetSelection="this.updateFacetSelection" 
                                :resetFacets="this.resetFacets" />


                        <SortDropdown  :updateSort="this.updateRanking" :options="filters.ranking" :selected="user_query.ranking"/>

                        <div class="sub-container" v-if="occurrences.length > 0">

                            <div class="table-container">
                        
                                <table>
        
                                    <thead>
                                        <tr>
                                            <th>
                                                <button  class="button-th" @click="popupFields()">
                                                    <img :src="require('../assets/images/icon_more.png')" class="mini" />
                                                </button> 
                                                {{ get_occurrence_name }} ID</th>
                                            <th v-for="field in fields_to_display" :key="'display_'+field.field">
                                                <span v-if="field.title == 'nb'">{{ get_curation_name }}</span>
                                                {{ field.title }}
                                            </th>
                                            <th>Status</th>
                                            <th></th>
                                        </tr>
                                    </thead>

                                    <tbody v-for="(occurrence, index) in occurrences" :key="'occurrence_'+occurrence.key"   ref="table_row">
                                        <OccurrencesElement
                                            :occurrence="occurrence" 
                                            :index="index"
                                            />
                                    </tbody>

                                </table>

                            </div>

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
            <div :class="fields_popup">

                <div class="right-container">
                    <button type="button" class="button-close" @click="closeFields()">
                        <img src="../assets/images/icon_close.png"  class="mini"/>
                        Close
                    </button>
                </div>

                <div class="content-popup">

                    <h1>Fields</h1>

                    <p v-for="field in occurrence_characteristics" :key="'allfields_'+field.title">
                        <input type="checkbox" id="fields" name="fields" :checked="field.selection" @change="changeSelection($event, field.field)">
                        <span v-if="field.title == 'nb'">{{ get_curation_name }}</span>     
                        {{ field.title }}
                    </p>

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
import SortDropdown from '@/components/SortDropdown.vue'
var PulseLoader = require('vue-spinner/src/PulseLoader.vue').default;

export default {
    name: 'OccurrencesList',
    components: {
        vPagination,
        FacetsComponent,
        OccurrencesElement,
        FiltersSelection,
        PulseLoader,
        SortDropdown,
    },
    data() {
        return {
            occurrences: [],
            in_progress: false,
            total: 0,
            popup_visibility: false,
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
            'theme_color',
            'landing',
            'occurrence_characteristics'
        ]),
        cssVars() {
            return {
                '--color': this.theme_color.main,
            }
        },
        fields_to_display() {
          var fields = []
          for (var i=0; i<this.occurrence_characteristics.length; i++){
            if (this.occurrence_characteristics[i].selection){
              fields.push(this.occurrence_characteristics[i])
            }
          }
          return fields
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
        fields_popup(){
            return "fields-popup "+this.popup_visibility
        },
    },
    methods: {
        ...mapActions([
            'updateQuery',
            'updateFacetSelection', 
            'updateRanking', 
            'resetFacets',
            'updateOccurrencesKeys',
            'udpateLanding',
            'updateFieldsSelection',
            'updateBasisOfRecord'
        ]),
        searchOccurrencesAPI(prev_position=null) {
            this.in_progress = true
            this.occurrences = []
            let response_promise = null;
            if (this.user_query.occurrences_keys.length > 0) {
                response_promise = this.$backend.fetch_occurrences_from_occurrencekeys(this.user_query.occurrences_keys)
            } 
            else {
                response_promise = this.$backend.fetch_occurrences_from_q(this.user_query)
            }
            response_promise.then(response => {
                this.occurrences = response.data.results;
                if (this.user_query.occurrences_keys.length > 0) {
                    var new_list = []
                    for (var i=0; i<response.data.results.length; i++){
                        new_list.push(response.data.results[i].key)
                    }
                    this.updateOccurrencesKeys(new_list)
                }
                var parameters= {}
                if (this.user_query.q != ''){
                    parameters['q'] = this.user_query.q
                }
                if (this.user_query.basisOfRecord != "PRESERVED_SPECIMEN"){
                    parameters['basisOfRecord'] = this.user_query.basisOfRecord
                }    
                if (this.user_query.page != 1){
                    parameters['page'] = this.user_query.page
                }
                if (this.user_query.ranking != "scientificName"){
                    parameters['ranking'] = this.user_query.ranking
                }      
                if (this.user_query.occurrences_keys.length > 0){
                    parameters['occurrencesKeys'] = this.user_query.occurrences_keys.join(",")
                }  
                for (const [name, values] of Object.entries(this.user_query.facets_selection)) {
                    if(values.length > 0){
                        var val = []
                        for (var j=0; j<values.length; j++){
                            if ('label' in values[j]){
                                val.push(values[j].value+";;"+values[j].label)
                            }
                            else {
                                val.push(values[j].value)
                            }
                        }
                        parameters[name] = val.join("|");
                    }
                }
                this.$router.replace({ query: parameters }).catch(()=>{});
                this.total = response.data.count
                this.in_progress = false

                if (prev_position != null){
                    this.$nextTick(() => {
                        var position = 0
                        for (var i=0; i<this.occurrences.length; i++){
                            if (this.occurrences[i].key == prev_position){
                                position = i;
                                break;
                            }
                        }
                        const rowToScroll = this.$refs.table_row[position]; 
                        if (rowToScroll) {
                            rowToScroll.scrollIntoView({ behavior: "smooth" });
                        }
                    });
                }
            })
            .catch(error => {
                console.log(error)
                alert("failed to load occurrences : " + error)
            })
        },
        popupFields(){
            this.popup_visibility = true
        },
        closeFields(){
            this.popup_visibility = false
        },
        changeSelection(event, field) {
            var fields = this.occurrence_characteristics
            for (var i=0; i<this.occurrence_characteristics.length; i++){
                if (this.occurrence_characteristics[i].field == field){
                    this.occurrence_characteristics[i].selection = event.target.checked
                }
            }
            this.updateFieldsSelection(fields)
        }
    },
    watch: {
        "user_query.page": function () {
            this.$refs["table"].scrollIntoView({ behavior: "smooth" })
            this.closeFields()
            this.udpateLanding()
            this.searchOccurrencesAPI()
        },
        "user_query.ranking": function () {
            this.closeFields()
            this.udpateLanding()
            this.searchOccurrencesAPI()
        },
        "user_query.q": function () {
            this.closeFields()
            this.udpateLanding()
            this.searchOccurrencesAPI()
        },
        "user_query.basisOfRecord": function () {
            this.closeFields()
            this.udpateLanding()
            this.searchOccurrencesAPI()
        },
        "user_query.facets_selection": {
            handler(){
                this.closeFields()
                this.udpateLanding()
                this.searchOccurrencesAPI()
            },
            deep: true
        },
    },
}

</script>


<style scoped lang="scss">

.content-container {
    display: flex;
    width: 100%
}

.facets-container {
    flex: 0 0 300px;
    margin-right: 20px;
}

.full-container {
    flex-grow: 1;
    margin: 0 auto;
    overflow-x: auto;
}

.centered-container {
    text-align: center;
    width: 100%;
    padding-top: 50px;
}

.sub-container {
    margin: 0;
    padding: 0;
    width: 100%
}

.table-container {
    margin: 0;
    padding: 0;
    overflow-x: auto;
    flex-grow: 1;
}

.page-box {
    display: flex;
    justify-content: center;
}


table {
    margin-bottom: 20px;
    border-collapse: collapse;
    font-size: 0.8rem;
    background-color: #eee;
    width: 100%;

}

td:first-child, th:first-child {
  position:sticky;
  left:0;
  z-index:1;
}
td:last-child, th:last-child {
  position:sticky;
  right:0;
  z-index:1;
}

td,
th {
    padding: 6px;
    text-align: left;
    white-space: nowrap;
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

.mini {
    width: 13px;
    cursor: pointer;
}

.button-th {
    display: inline-block;
    border-radius:5px;
    background-color: var(--color);
    border: none;
    color: #FFFFFF;
    text-align: center;
    padding: 5px 5px;
    cursor: pointer;
}

.button-th:hover {
    background-color: #AAA;
}
.fields-popup.true {
  display: block;
}

.button-close{
    background: #fff;
    border: 0px
}

.button-close:hover{
    cursor: pointer;
    background-color:#f2f2f2
}

.right-container {
    text-align: right;
    width: 100%
}

.fields-popup {
    display: none;
    position: fixed;
    top: 48%;
    left: 490px;
    transform: translate(-50%, -50%);
    width: 300px;
    height: 400px;
    border: 3px solid #f1f1f1;
    z-index: 9;
    background-color: #fff;
    text-align: left;
    padding: 10px;
}

.content-popup {
    height: 350px;
    overflow: auto;
}
input[type='checkbox'] {
    margin-right: 10px;
}
</style>
