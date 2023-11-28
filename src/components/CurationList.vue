<template>

    <div class="component-container" :style="cssVars">

        <div class="centered-container" v-if="in_progress">
            <PulseLoader :color="theme_color.main" />
        </div>

        <div v-if="warning" class="alert alert-warning">
            Occurrence {{ user_query.occurrence_key }} not found
        </div>

        <div class="table-container">
        <table v-if="!in_progress && !warning">

            <tr class="empty-line">
                <td colspan=100>
                    <div class="separator">
                        <h2><span>{{ get_occurrence_name }} {{ user_query.occurrence_key }} {{ get_description }}</span></h2>
                    </div>
                </td>
            </tr>

            <tr>
                <th>Key</th>
                <th></th>
                <th v-for="characteristic in curation_characteristics" :key="characteristic.score+'main-th'">{{ characteristic.name }}</th>
                <th colspan="2"></th>
                <th></th>
            </tr>

            <tr class="reference-entity">
                <td><a :href="'https://www.gbif.org/occurrence/'+user_query.occurrence_key" target="_blank">{{
                user_query.occurrence_key}}</a></td>
                <td></td>
                <template v-for="characteristic in curation_characteristics">
                    <td v-if="characteristic.value" :key="characteristic.score+'main-td'" :class="'cell_' + characteristic.score">{{ display_content(get_occurrence, characteristic.value) }}</td>
                </template>
                <td colspan="2"></td>
                <td>
                    <button v-if="user_query.basisOfRecord=='MATERIAL_CITATION'" @click="expanded = !expanded" class="button-table">
                        <img v-if="!expanded" src="../assets/images/icon_expand.png" class="mini" />
                        <img v-if="expanded" src="../assets/images/icon_reduce.png" class="mini" />
                    </button>
                </td>
            </tr>  

            <tr class="expanded" v-if="expanded">
                <td colspan=100>
                    <div class="expanded-box" v-if="get_occurrence.verbatimLabel">
                        {{ get_occurrence.verbatimLabel }}
                    </div>
                    <div class="expanded-box" v-if="'references' in get_occurrence">
                        <label>Data source:</label>
                        <ul>
                            <li><a :href="get_occurrence.references" target="_blank">Treatment</a></li>
                            <li v-if="'identifier' in get_occurrence"><a :href="get_mc" target="_blank">Material citation</a></li>
                        </ul>                        
                    </div>
                    <div class="expanded-box" v-if="'references' in get_occurrence">
                        <label>Additional links:</label>
                        <ul>
                            <li><a :href="get_gbif_dataset" target="_blank">GBIF dataset {{ get_occurrence.datasetKey }}</a></li>
                            <li><a :href="get_biotxplorer" target="_blank">Biotic interactions browser</a></li>
                            <li><a :href="get_sibils" target="_blank">SIBiLS</a></li>
                        </ul>                        
                    </div>
                    <div class="expanded-box" v-if="'references' in get_occurrence">
                        <a :href="get_report_link" target="_blank">Report an error     on the content</a>                   
                    </div>
                </td>
            </tr>

            <tr class="empty-line">
                <td colspan=100>
                    <br /><br />
                    <div class="separator">
                        <h2><span>{{ get_curation_name }}s associated with the {{ get_occurrence_name.toLowerCase() }} {{ user_query.occurrence_key }}</span></h2>
                    </div>
                    <p>
                        {{ to_process_curation.length }} suggested 
                        {{ get_curation_name.toLowerCase() }}{{ to_process_curation.length > 1?'s':'' }}
                        to curate
                    </p>
                    <p class="notice">Please indicate for each suggested {{ get_curation_name.toLowerCase() }} whether it matches the {{ get_occurrence_name.toLowerCase() }} or not (Yes / No).</p>
                </td>
            </tr>

           
            <tr v-if="to_process_curation.length > 0">
                <th>Key</th>
                <th @click="sortBy('$global')">Score</th>
                <th v-for="char in curation_characteristics" :key="char.score+'sp-th'" class="clickable-th"
                    @click="sortBy(char.score)">{{ char.name }}</th>
                <th>Decision</th>
                <th>Comment</th>
                <th></th>
            </tr>


            <CurationElement v-show="in_current_page(index)" v-for="(to_process_key, index) in to_process_curation"
                @updateCuration=updateCuration 
                :key="to_process_key.occurrenceKey2" 
                :pre_occurrence="occurrences[to_process_key.occurrenceKey2]" 
                :pre_matching="to_process_key"
                :pre_scores="get_scores(occurrences[user_query.occurrence_key], occurrences[to_process_key.occurrenceKey2])" 
                />
            
            <tr class="empty-line centered-empty" v-if="page_total > 1">
                <td colspan=100>
                    <div class="page-box">
                        <v-pagination v-model="current_page" :page-count="page_total"
                            :classes="bootstrapPaginationClasses" :labels="paginationAnchorTexts">
                        </v-pagination>
                    </div>
                </td>
            </tr>

            <CurationElement v-for="empty_element in empty_elements"
                @updateCuration=updateCuration 
                @addCuration=addCuration
                @deleteCuration=deleteCuration
                :key="empty_element" 
                :all_occurrences="occurrences"
                />

            <tr class="empty-line">
                <td colspan=100>
                    <div class="left-container">
                        <br/>
                        <button class="green-button" @click="addLine()">
                            <img src="../assets/images/icon_add.png" class="small" />
                            Add another {{ get_curation_name.toLowerCase() }}
                        </button>
                    </div>
                </td>
            </tr>

           <tr v-if="finished_curation.length > 0" class="empty-line">
                <td colspan=100>
                    <br/><br />
                    <img v-show="!show_edit" src="../assets/images/icon_plus.png" alt="[+]"
                        @click="show_edit = !show_edit" class="mini" />
                    <img v-show="show_edit" src="../assets/images/icon_minus.png" alt="[-]"
                        @click="show_edit = !show_edit" class="mini" />
                    {{ finished_curation.length }} {{ get_curation_name.toLowerCase()
                    }}<span v-if="finished_curation.length > 1">s</span> already
                    curated
                </td>
            </tr>

            <tr v-if="show_edit && finished_curation.length > 0">
                <th>Key</th>
                <th>Score</th>
                <th v-for="char in curation_characteristics" :key="char.score+'sp-th'" class="clickable-th">{{ char.name
                }}</th>
                <th>Decision</th>
                <th>Comment</th>
                <th></th>
            </tr>

            <template v-if="show_edit && finished_curation.length > 0">

                <CurationElement v-for="finished_key in finished_curation"
                    @updateCuration=updateCuration 
                    :key="finished_key.occurrenceKey2" 
                    :pre_occurrence="occurrences[finished_key.occurrenceKey2]" 
                    :pre_matching="finished_key"
                    :pre_scores="get_scores(occurrences[user_query.occurrence_key], occurrences[finished_key.occurrenceKey2])" />

            </template>    

        </table>
        </div>

        <div v-if="!in_progress">

            <div class="button-container">
                <button v-show="changes == 0" class="grey-button" @click="nosaveBack()">
                    <img src="../assets/images/icon_back.png" class="small" />
                    Go back to list
                </button>
                <button v-show="changes == 0" class="grey-button" @click="nosaveNext()" >
                    <img src="../assets/images/icon_next.png" class="small" />
                    Continue to the next {{ get_occurrence_name.toLowerCase() }}
                </button>
                <button v-show="changes > 0" class="red-button" @click="nosaveBack()">
                    <img src="../assets/images/icon_resetback.png" class="small" />
                    Reset change(s) and go back to list
                </button>
                <button v-show="changes > 0" class="red-button" @click="nosaveNext()">
                    <img src="../assets/images/icon_resetnext.png" class="small" />
                    Reset change(s) and continue to the next {{ get_occurrence_name.toLowerCase() }}
                </button>
                <br/><br/>
                <button v-show="changes > 0" class="green-button"  @click="saveBack()">
                    <img src="../assets/images/icon_saveback.png" class="small" />
                   Save and go back to list
                </button>
                <button v-show="changes > 0" class="green-button" @click="saveNext()">
                    <img src="../assets/images/icon_savenext.png" class="small" />
                    Save and continue to the next {{ get_occurrence_name.toLowerCase() }}
                </button>
            </div>

            <div class="left-container">
                <h3>Color legend for the matching score</h3>
                <table class="legend-table">
                    <tr>
                        <td>
                            <div class="color-box cell-color-1"></div>
                        </td>
                        <td>
                            <div class="color-box cell-color-2"></div>
                        </td>
                        <td>
                            <div class="color-box cell-color-3"></div>
                        </td>
                        <td>
                            <div class="color-box cell-color-4"></div>
                        </td>
                        <td>
                            <div class="color-box cell-color-5"></div>
                        </td>
                        <td>
                            <div class="color-box cell-color-6"></div>
                        </td>
                        <td>
                            <div class="color-box cell-color-7"></div>
                        </td>
                        <td>
                            <div class="color-box cell-color-8"></div>
                        </td>
                        <td>
                            <div class="color-box cell-color-9"></div>
                        </td>
                        <td>
                            <div class="color-box cell-color-10"></div>
                        </td>
                        <td>
                            <div class="color-box cell-color-11"></div>
                        </td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>0.9</td>
                        <td>0.8</td>
                        <td>0.7</td>
                        <td>0.6</td>
                        <td>0.5</td>
                        <td>0.4</td>
                        <td>0.3</td>
                        <td>0.2</td>
                        <td>0.1</td>
                        <td>0.0</td>
                    </tr>
                </table>
                <a href="/scoring" target="_blank">Scoring algorithm</a>
            </div>

        </div>

        <CommentDraggable/>

    </div>

</template>


<script>
import { mapState, mapActions } from 'vuex'
import CurationElement from '@/components/CurationElement.vue'
import CommentDraggable from '@/components/CommentDraggable.vue'
import shared_fields from '@/components/shared_fields.js'
var PulseLoader = require('vue-spinner/src/PulseLoader.vue').default;
import vPagination from 'vue-plain-pagination'

export default {
    name: 'CurationList',
    mixins: [
        shared_fields.mixin_fields // add the display_content method
    ],
    components: {
        CurationElement,
        PulseLoader,
        vPagination,
        CommentDraggable
    },
    data() {
        return {
            in_progress: true,
            warning: false,
            occurrences: {},
            relations: [],
            empty_relations: [],
            empty_elements: [],
            change_list: {},
            changes: 0,
            sort: {
                by: '$global',
                asc: false
            },
            show_edit: false,
            expanded: false,
            pendingSave: [],
            action: null,
            current_page: 1,
            per_page: 10,
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
            'theme_color', 
            'curation_characteristics', 
            'user_query', 
            'fields', 
            'user', 
            'step', 
            'institutions',
            'comment'
        ]),
        cssVars() {
            return {
                '--color': this.theme_color.main,
                '--color-secondary': this.theme_color.secondary,
            }
        },
        get_occurrence(){
            return this.occurrences[this.user_query.occurrence_key]
        },
        get_occurrence_name() {
            const zz = this.fields[this.user_query.basisOfRecord].basisOfRecord_occurrence.name;
            return zz.charAt(0).toUpperCase() + zz.slice(1).toLowerCase();
        },
        get_curation_name() {
            return this.fields[this.user_query.basisOfRecord].basisOfRecord_curation.name
        },
        get_description() {
            if (this.user_query.occurrence_key in this.occurrences &&  'institutionKey' in this.occurrences[this.user_query.occurrence_key]){
                return "from " + this.institutions[this.occurrences[this.user_query.occurrence_key].institutionKey]
            }
           return ''
        },
        get_mc() {
            return this.get_occurrence.references+this.get_occurrence.identifier.replace(".mc.", "#")
        },
        get_plazi_treatment_id() {
            const refid = this.get_occurrence.references.split("/");
            return refid[refid.length - 1];
        },
        get_sibils() {
            return "https://sibils.text-analytics.ch/search/collections/plazi/" + this.get_plazi_treatment_id;
        },
        get_biotxplorer() {
            return "https://denver.text-analytics.ch/BiotXplorer/collections/plazi/" + this.get_plazi_treatment_id;
        },
        get_gbif_dataset() {
            return "https://www.gbif.org/dataset/" + this.get_occurrence.datasetKey;
        },
        to_process_curation() {
            return this.filterListToDo(this.relations, "PNDG")
        },
        finished_curation() {
            return this.filterListDone(this.relations, "PNDG")
        },
        to_process_empty() {
            var filtered_empty = this.empty_elements
            filtered_empty = filtered_empty.filter(element => element.matching.match == null);
            return filtered_empty
        },
        page_total() {
            return Math.ceil(this.to_process_curation.length / this.per_page)
        },
        item_min(){
            return ((this.current_page-1)*this.per_page)
        },
        item_max(){
            return ((this.current_page*this.per_page))
        },
        
        get_report_link(){
            return "https://github.com/plazi/community/issues/new?body=Please%20leave%20your%20comment%20here...%0A%0A**Context**%0A%5BGBIF%20occurrence%5D(https%3A%2F%2Fwww.gbif.org%2Foccurrence%2F"+this.get_occurrence.key+")%0A%5BPlazi%20reference%5D("+this.get_occurrence.references+")"
        },
    },
    methods: {
        ...mapActions([
            'updateOccurrenceKey', 
            'updateUsername'
        ]),
        openDialog() {
      this.isDialogVisible = true;
    },
    closeDialog() {
      this.isDialogVisible = false;
    },
        searchCurationAPI(){
            var query = {
                ...this.$router.currentRoute.query,
                occurrenceKey: this.user_query.occurrence_key
            }
            if (Object.entries(query).toString() !== Object.entries(this.$router.currentRoute.query).toString()){
                this.$router.replace({
                    name: this.$router.currentRoute.name,
                    query
                })
            }
            this.changes = 0
            this.change_list = {}
            this.warning = false
            this.in_progress = true
            let response_promise = null;
            response_promise = this.$backend.fetch_occurrence(this.user_query.occurrence_key)
            response_promise.then(response => {
                if ('occurrences' in response.data){
                    this.relations = response.data.occurrenceRelations;
                    this.occurrences = response.data.occurrences
                    for (const [key, value] of Object.entries(this.occurrences)){
                        value['key'] = key
                        this.occurrences[key] = value
                    }
                }
                else {
                    this.warning = true
                }
                this.in_progress = false
            })
            .catch(error => {
                console.log(error)
                alert("failed to load relations: " + error)
            })
        },
        searchNextCurationAPI(saved_json){
            let response_promise = null;
            response_promise = this.$backend.fetch_next_occurrence_from_q(this.user_query, this.user_query.occurrence_key)
            response_promise.then(response => {
                this.updateOccurrenceKey(response.data.subjectOccurrenceKeys[0])
                if (saved_json != null){
                    this.saveJson(saved_json)
                }
            })
            .catch(error => {
                alert("There are no more occurrence to process.")
                this.in_progress = false
                this.nosaveBack()
                console.log(error)
            })
        },
        searchNextByList(){
            var prev_key = this.user_query.occurrence_key
            for (var i=0; i<this.user_query.occurrences_keys.length; i++){
                if (prev_key == this.user_query.occurrences_keys[i]){
                    if (i<this.user_query.occurrences_keys.length-1){
                        this.updateOccurrenceKey(this.user_query.occurrences_keys[i+1])
                    }
                    else{
                        alert("There are no more occurrence to process.")
                        this.in_progress = false
                        this.nosaveBack()
                    }
                }
            }
        },
        filterListToDo(filtered_curation, condition) {

            const get_relation_scores = (relation) => {
                const scores = this.$scoring.get_scores(this.occurrences[this.user_query.occurrence_key], this.occurrences[relation.occurrenceKey2]);
                const score_value = scores[this.sort.by];
                return score_value != null ? parseFloat(score_value) : -1
            }
            if (this.sort.asc) {
                filtered_curation.sort((a, b) => get_relation_scores(a) - get_relation_scores(b));
            }
            else {
                filtered_curation.sort((a, b) => get_relation_scores(b) - get_relation_scores(a));
            }

            filtered_curation = filtered_curation.filter(element => element.statusCode == condition);

            return filtered_curation;
        },
        filterListDone(filtered_curation, condition) {
            return filtered_curation = filtered_curation.filter(element => element.statusCode != condition);
        },
        get_scores(occurrence1, occurrence2) {
            if (occurrence1 == null || occurrence2 == null) {
                return {
                    '$global': null
                };
            }
            return this.$scoring.get_scores(occurrence1, occurrence2);
        },
        updateCuration(element){
            var all_relations = this.relations.concat(this.empty_relations);
            for (var i=0; i<all_relations.length; i++){
                if(all_relations[i].occurrenceKey2 == element.key){
                    if(all_relations[i].statusCode == element.matching.statusCode && all_relations[i].decision == element.matching.decision ){
                        if (element.key in this.change_list){
                             delete this.change_list[element.key]
                        }
                    }
                    else {
                        this.change_list[element.key] = element
                    }
                }
            }
            this.changes = Object.keys(this.change_list).length
        },
        addCuration(element){
            this.change_list[element.key] = element
            this.changes = Object.keys(this.change_list).length
            this.empty_relations.push(element.matching)
        },
        deleteCuration(element){
            delete this.change_list[element.key]
            this.changes = Object.keys(this.change_list).length
            for (var i=0; i<this.empty_relations.length; i++){
                if (element.key == this.empty_relations[i].occurrenceKey2){
                    this.empty_relations.splice(i, 1)
                    break;
                }
            }
        },
        nosaveBack() {
            let go_back = Object.keys(this.change_list).length == 0 || confirm('Are you sure you want to leaving without saving?')
            if (go_back) {
                this.in_progress = true
                this.empty_elements = []
                this.current_page = 1
                this.$emit('back')
                this.$gtag.event('back');
            }
        },
        nosaveNext(saved_data){
            var go_next = false
            if (saved_data == null){
                go_next = Object.keys(this.change_list).length == 0 || confirm('Are you sure you want to continue without saving?')
            }
            if (go_next || saved_data != null) {
                this.in_progress = true
                this.empty_elements = []
                this.current_page = 1
                if (this.user_query.occurrences_keys.length == 0){
                    this.searchNextCurationAPI(saved_data)
                }
                else {
                    this.searchNextByList()
                }
            }
        },
        saveBack() {
            this.action = "back"
            this.save()
        },
        saveNext() {
            this.action = "next"
            this.save()
        },
        saveStop() {
            this.action = "stop"
            this.save()
        },
        save() {
            this.pendingSave = Object.keys(this.change_list);
            this.$emitter.emit('ensureLogin');
        },
        sortBy(name) {
            if (name == this.sort.by) {
                this.sort.asc = !this.sort.asc
            }
            else {
                this.sort.by = name
                this.sort.asc = false
            }
        },
        in_current_page(index){
            if (index >= this.item_min && index < this.item_max){
                return true
            }
            else {
                return false
            }
        },
        addLine() {
            this.empty_elements.push("emptykey_" + this.empty_elements.length)
        },
        // TO CHECK
        saveToSibBackend(occurrenceIdToSave) {
            const occurrenceRelations = {};            
            // create occurrenceRelations using the existing decisions and occurrences
            for (const relation of this.relations) { // UPDATE: this.relations
                occurrenceRelations[relation.occurrenceKey2] = {
                    occurrence: { ... this.occurrences[relation.occurrenceKey2] },  // make a copy of the occurrence so we delete "relations"
                    statusCode: relation.statusCode, // UPDATE: matching.decision / matching.statusCode
                    decision: relation.decision, // UPDATE: matching.decision / matching.statusCode
                    is_new_decision: false
                }
            }
            // update occurrenceRelations with the new user decisions
            for (var i = 0; i < occurrenceIdToSave.length; i++) {
                occurrenceRelations[occurrenceIdToSave[i]].statusCode = this.change_list[occurrenceIdToSave[i]].matching.statusCode,
                occurrenceRelations[occurrenceIdToSave[i]].decision = this.change_list[occurrenceIdToSave[i]].matching.decision,
                occurrenceRelations[occurrenceIdToSave[i]].is_new_decision = true; // UPDATE: matching.decision / matching.statusCode
            }
            // create data (to send to the SIB backend)
            const data = {
                user: {
                    name: this.user.name,
                    orcid: this.user.orcid,
                },
                refOccurrence: { ...this.occurrences[this.user_query.occurrence_key] },  // make a copy of the occurrence so we delete "relations"
                relations: Object.values(occurrenceRelations),
            };
            // FIXME : temporary workaround
            data.datasetKey = data.refOccurrence.datasetKey
            data.institutionKey = data.refOccurrence.institutionKey
            // end temporary workaround
            this.$backend.post_sib_matching(data)
                .then(() => {})
                .catch(() => {})
        },
        saveToPlaziBackend(occurrenceIdToSave) {
            var saved_data = []
            for (var i = 0; i < occurrenceIdToSave.length; i++) {
                var element = {
                    "occurrenceKey1": this.user_query.occurrence_key,
                    "occurrenceKey2": occurrenceIdToSave[i],
                    "decision": this.change_list[occurrenceIdToSave[i]].matching.decision,
                    "statusCode": this.change_list[occurrenceIdToSave[i]].matching.statusCode,
                    "userName": this.user.name,
                    "orcid": this.user.orcid,
                }
                saved_data.push(element)
            }
            var saved_json = { "occurrenceRelations": saved_data }
            if (this.action == "next"){
                this.nosaveNext(saved_json)
            }
            else {
                this.saveJson(saved_json)
            }
        },
        saveJson(saved_json){
            this.$backend.post_matching(saved_json)
                .then(() => {
                    this.change_list = {}
                    if (this.action == "back"){
                        this.nosaveBack()
                    }
                    else if (this.action == "stop"){
                        this.searchCurationAPI()
                    }
                })
                .catch(error => {
                    alert("Failed to save" + error)
                });
        }
    },
    mounted() {
        this.$emitter.on('logged', () => {
            if (this.pendingSave.length > 0) {
                // logged event and this.pendingSave is not empty
                // ==> there are some now occurrence relations to save
                const occurrenceIdToSave = this.pendingSave.slice();
                this.pendingSave = [];

                // save to the SIB backend
                this.saveToSibBackend(occurrenceIdToSave);

                // save on the Plazi backend
                this.saveToPlaziBackend(occurrenceIdToSave);

                //
                this.$gtag.event('save');
            }
        });
        this.$emitter.on('loginAbort', () => {
            if (this.pendingSave.length > 0) {
                // logingAbort event and this.pendingSave is not empty
                // ==> the user clicked on "Save" or "Edit" but cancel the logged in procedure
                this.pendingSave = [];
                alert('Your work is not saved');
            }
        });
    },
    watch: {
        "user_query.occurrence_key": function () {
            if (this.user_query.occurrence_key != null && this.user_query.occurrence_key != "" && this.step=="3"){
                this.searchCurationAPI()
            }
        },
    }
}

</script>

<style>
/* referenced by CurationElement too */
.cell_decimalLatitude,
.cell_elevation {
    white-space: nowrap;
}
</style>

<style scoped lang="scss">

.button-container {
    text-align: right;
}

.left-container {
    text-align: left;
}

.notice {
    font-size: 1em;
    font-style: italic;
}

table {
    margin-bottom: 20px;
    border-collapse: collapse;
    width: 100%;
    font-size: 1em;
    background-color: #fff;
}

tr {
    overflow-y: auto;
}

td,
th {
    border: 1px solid #ddd;
    padding: 6px;
    text-align: center;
}

th {
    padding-top: 6px;
    padding-bottom: 6px;
    background-color: #AAA;
    color: white;
}

.clickable-th:hover {
    cursor: pointer;
    background-color: var(--color);
}

.reference-entity th {
    background-color: #fff;
    color: #000;
}


.expanded {
    background-color: #eee;
}

.expanded-box {
    margin: 5px 0px 0px 10px
}

.expanded table {
    width: 70%;
    margin: 20px auto;
    font-size: 1em;
}

button {
    display: inline-block;
    border-radius: 5px;
    border: none;
    color: #FFFFFF;
    text-align: left;
    padding: 5px 10px;
    cursor: pointer;
    margin: 0px 5px;
    width: 420px;
    height: 40px;
}

.button-table {
    display: inline-block;
    border-radius: 5px;
    background-color: #AAA;
    border: none;
    color: #FFFFFF;
    text-align: center;
    padding: 5px 5px;
    cursor: pointer;
    width: 25px;

}

.button-table:hover {
    background-color: var(--color);
}

button:disabled,
button[disabled] {
    background-color: #cccccc;
    color: #666666;
}

.grey-button {
    background-color: #bbb
}

.grey-button:hover {
    background-color: #aaa
}

.red-button {
    background-color: #f15c5c
}

.red-button:hover {
    background-color: #d62121
}

.green-button {
    background-color: var(--color)
}

.green-button:hover {
    background-color: var(--color-secondary)
}


.mini {
    width: 15px;
    padding-bottom: 4px;
}

.small {
    height: 30px;
    padding-right: 10px;
}

.empty-line td,
.empty-line th {
    border: 0px solid #ddd;
}

.cell-color-1 {
    background-color: #7ABC8190;
    color: #000;
}

.cell-color-2 {
    background-color: #91C58390;
    color: #000;
}

.cell-color-3 {
    background-color: #ABCF8790;
    color: #000;
}

.cell-color-4 {
    background-color: #C5D88A90;
    color: #000;
}

.cell-color-5 {
    background-color: #E0E28E80;
    color: #000;
}

.cell-color-6 {
    background-color: #FBEB9280;
    color: #000;
}

.cell-color-7 {
    background-color: #F6D48B80;
    color: #000;
}

.cell-color-8 {
    background-color: #F2BB8480;
    color: #000;
}

.cell-color-9 {
    background-color: #EDA27C80;
    color: #000;
}

.cell-color-10 {
    background-color: #EA897680;
    color: #000;
}

.cell-color-11 {
    background-color: #E6726F80;
    color: #000;
}

.cell-color-na {
    background-color: #eee;
    color: #000;
}

.color-box {
    width: 15px;
    height: 15px;
}

.legend-table {
    width: 200px;
}

.legend-table td {
    border: 0px solid #000;
    text-align: center;
    padding: 0 0.75rem;
}

.expanded {
    background-color: #fff;
}

.expanded tr {
    background-color: #fff;
}

.expanded td {
    padding: 20px;
    text-align: left;
}

.page-box {
    display: flex;
    justify-content: center;
}

.table-container {
    margin: 0;
    padding: 1px;
    overflow-x: auto;
    flex-grow: 1;
}

</style>
