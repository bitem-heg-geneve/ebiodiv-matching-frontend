<template>

    <tbody>

        <tr>
            <td v-if="pre_occurrence" class="key">
                <a :href="'https://www.gbif.org/occurrence/'+occurrence.key" target="_blank">{{ occurrence.key }}</a>
            </td>
            <td v-else>
                <input class="empty_key" v-model="occurrence_key" @blur="fetchOccurrence()"/>
                <a v-if="empty_link" :href="empty_link" target="_blank"> <img src="../assets/images/icon_link.png"  class="mini"/></a>
                <span class="warning" v-if="warning"><br/>{{ warning }}</span>
            </td>

            <template v-if="occurrence">
                <td :class="cellColor(scores.$global)">{{ scores.$global }}</td>
                <template>
                    <td v-for="char in curation_characteristics" :key="char.score+'sp-td'"
                        :class="'cell_' + char.score + ' ' + cellColor(scores[char.score])">
                        {{ display_content(occurrence, char.value) }}
                    </td>
                </template>
                <td class="decision">
                     <input type="checkbox" :checked="status=='yes'" @click="changeSelection($event, 'yes')" /> Yes <br/>
                     <input type="checkbox" :checked="status=='no'" @click="changeSelection($event, 'no')" /> No <br/>
                     <input type="checkbox" :checked="status=='undecidable'" @click="changeSelection($event, 'undecidable')" /> Undecidable
                 </td>
                <td class="comment">
                    <CommentElement :occurrence_key="matching.occurrenceKey1" :curation_key="matching.occurrenceKey2"/>
                </td>
                <td>
                    <button @click="expanded = !expanded" class="button-table" v-if="occurrence.verbatimLabel">
                        <img v-if="!expanded" src="../assets/images/icon_expand.png" class="mini" />
                        <img v-if="expanded" src="../assets/images/icon_reduce.png" class="mini" />
                    </button>
                </td>
            </template>
            <template v-else>
                <td></td>
                <template v-if="in_progress == false">
                    <td v-for="char in curation_characteristics" class="cell-color-na" :key="char.score+'sp-td-em'"></td>
                </template>
                <template v-else>
                    <td v-for="char in curation_characteristics" class="cell-color-na" :key="char.score+'sp-td-em'">
                        <PulseLoader  :color="theme_color.main" size="5px"/>
                    </td>
                </template>
                <td class="decision"></td>
                <td class="comment"></td>
                <td></td>
            </template>
        </tr>

        <tr class="expanded" v-if="expanded">
            
            <td  colspan="100">
                <div class="expanded-box" v-if="occurrence.verbatimLabel">
                    {{ occurrence.verbatimLabel }}
                </div>
                <div class="expanded-box" v-if="'references' in occurrence">
                    <label>Data source:</label>
                    <ul>
                        <li><a :href="occurrence.references" target="_blank">Treatment</a></li>
                        <li v-if="'identifier' in occurrence"><a :href="get_mc" target="_blank">Material citation</a></li>
                    </ul>                        
                </div>
                <div class="expanded-box" v-if="'references' in occurrence">
                    <a :href="get_report_link" target="_blank">Report an error on the content</a>                   
                </div>
            </td>
        </tr>
    </tbody>

</template>


<script>
import { mapState } from 'vuex'
import shared_fields from '@/components/shared_fields.js'
import CommentElement from '@/components/CommentElement.vue'
var PulseLoader = require('vue-spinner/src/PulseLoader.vue').default;

export default {
    name: 'CurationElement',
    mixins: [
        shared_fields.mixin_fields
    ],
    components: {
        CommentElement,
        PulseLoader
    },
    props: {
        pre_occurrence: {
            type: Object,
        },
        pre_matching: {
            type: Object,
        },
        pre_scores: {
            type: Object,
        },
        all_occurrences: {
            type: Object
        }
    },
    data() {
        return {
            status: null,
            expanded: false,
            occurrence_key: '',
            occurrence: null,
            matching: null,
            scores: null,
            warning: null,
            in_progress: false
        };
    },
    computed: {
        ...mapState(['theme_color', 'user_query', 'curation_characteristics', 'fields']),
        cssVars() {
            return {
                '--color': this.theme_color.main,
            }
        },
        get_mc() {
            return "https://treatment.plazi.org/id/"+this.occurrence.identifier.replace(".mc.", "#")
        },
        get_report_link(){
            return "https://github.com/plazi/community/issues/new?body=Please%20leave%20your%20comment%20here...%0A%0A**Context**%0A%5BGBIF%20occurrence%5D(https%3A%2F%2Fwww.gbif.org%2Foccurrence%2F"+this.occurrence.key+")%0A%5BPlazi%20reference%5D("+this.occurrence.references+")"
        },
        get_curation_name(){
            return this.fields[this.user_query.basisOfRecord].basisOfRecord_curation.name
        },
        empty_link(){
            if (/^http/.test(this.occurrence_key)){
                return this.occurrence_key
            }
            else if (/^\d+$/.test(this.occurrence_key)){
                return "https://www.gbif.org/occurrence/"+this.occurrence_key
            }
            return null
        },
    },
    methods: {
        normalizeValue(value) {
            if (value == null) {
                return "NA"
            }
            return value
        },
        cellColor(value) {
            var class_name = "cell-color-na"
            if (value == null) {
                class_name = "cell-color-na"
            }
            else if (value >= 1.0) {
                class_name = "cell-color-1"
            }
            else if (value >= 0.9) {
                class_name = "cell-color-2"
            }
            else if (value >= 0.8) {
                class_name = "cell-color-3"
            }
            else if (value >= 0.7) {
                class_name = "cell-color-4"
            }
            else if (value >= 0.6) {
                class_name = "cell-color-5"
            }
            else if (value >= 0.5) {
                class_name = "cell-color-6"
            }
            else if (value >= 0.4) {
                class_name = "cell-color-7"
            }
            else if (value >= 0.3) {
                class_name = "cell-color-8"
            }
            else if (value >= 0.2) {
                class_name = "cell-color-9"
            }
            else if (value >= 0.1) {
                class_name = "cell-color-10"
            }
            else if (value >= 0.0) {
                class_name = "cell-color-11"
            }
            return class_name
        },
        changeSelection(event, choice) {
            if (choice == "yes") {
                if (event.target.checked == true) {
                    this.status = "yes"
                }
                if (event.target.checked == false) {
                    this.status = "unknown"
                }
            }
            else if (choice == "no") {
                if (event.target.checked == true) {
                    this.status = "no"
                }
                if (event.target.checked == false) {
                    this.status = "unknown"
                }
            }
            else if (choice == "undecidable") {
                if (event.target.checked == true) {
                    this.status = "undecidable"
                }
                if (event.target.checked == false) {
                    this.status = "unknown"
                }
            }
            var matching = {}
            if (this.status == "yes") {
                matching = {'statusCode': "DONE", 'decision': true}
            }
            else if (this.status == "no") {
                matching = {'statusCode': "DONE", 'decision': false}
            }
            else if (this.status == "undecidable") {
                matching = {'statusCode': "UDCB", 'decision': null}
            }
            else {
                matching = {'statusCode': "PNDG", 'decision': null}
            }
            this.$emit("updateCuration", { 'key': this.occurrence.key, 'matching': matching })
        },
        toggle() {
            this.expanded = !this.expanded
        },
        fetchOccurrence(){
            if (this.occurrence){
                this.$emit("deleteCuration", { 'key': this.occurrence.key })
            }
            this.warning = null
            this.occurrence = null
            this.matching = null
            if (this.occurrence_key in this.all_occurrences){
                this.warning = "already in suggested "+this.get_curation_name.toLowerCase()+"s";
            }
            if (this.occurrence_key == this.user_query.occurrence_key){
                this.warning = "current curation object";
            }
            if (this.warning == null){
                if (this.occurrence_key != "" && /^\d+$/.test(this.occurrence_key)){
                    this.loadGBIF()
                }                
            }
        },
        loadGBIF(){
            this.in_progress = true
            this.$backend.fetch_occurrence(this.occurrence_key, true)
                .then(response => {
                    if ('occurrences' in response.data  && this.occurrence_key in response.data.occurrences){
                        this.occurrence = response.data.occurrences[this.occurrence_key]
                        this.occurrence['key'] = parseInt(this.occurrence_key)
                        this.status = "yes"
                        this.scores = {},                    
                        this.matching = {"occurrenceKey1": parseInt(this.user_query.occurrence_key), "occurrenceKey2": parseInt(this.occurrence_key), "statusCode": "DONE", "decision": true}
                        this.$emit("addCuration", { 'key': this.occurrence_key, 'matching': this.matching })
                    }
                    else {
                        this.warning = "unknown GBIF key"
                    }
                    this.in_progress = false
                })
        },
    },
    beforeMount() {
        if(this.pre_occurrence != null){
            this.occurrence = this.pre_occurrence
            this.scores = this.pre_scores
            this.matching = this.pre_matching
            if (this.matching.statusCode == "DONE") {
                if (this.matching.decision == true) {
                    this.status = "yes"
                }
                else if (this.matching.decision == false) {
                    this.status = "no"
                }
            }
            else if (this.matching.statusCode == "UDCB"){
                this.status = "undecidable"
            }
            else {
                this.status = "unknown"
            }
        }
    },
}

</script>


<style scoped lang="scss">

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

.decision {
    text-align: left;
    width: 120px;
}

.comment {
    width: 100px;
}

.expanded-box {
    margin: 5px 0px 0px 10px
}

.expanded tr {
    background-color: #fff;
}

.expanded td {
    padding: 20px;
    text-align: left;
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
}

.button-table:hover {
    background-color: var(--color);
}

.mini {
    width: 15px;
}

button {
    display: inline-block;
    border-radius: 10px;
    background-color: var(--color);
    border: none;
    color: #FFFFFF;
    text-align: center;
    padding: 5px 10px;
    cursor: pointer;
    margin: 0px 5px;
}

button:hover {
    background-color: var(--color-secondary);
}

button:disabled,
button[disabled] {
    background-color: #cccccc;
    color: #666666;
}

.warning {
    color: red;
}

.empty_key {
    margin: 0px;
    padding: 0px;
    width: 75%;
    margin-right: 5px;
}

.key {
    width: 120px;
}
    
</style>
