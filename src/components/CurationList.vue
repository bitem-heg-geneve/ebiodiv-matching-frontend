<template>

    <div class="component-container" :style="cssVars">

        <div class="separator">
            <h2><span>{{ get_curation_name }}s associated with the {{ get_occurrence_name.toLowerCase() }} {{
            occurrences_selection.key }}</span></h2>
        </div>
        <p>{{ occurrences_selection.verbatimLabel }}</p>

        <table>

            <tr class="empty-line">
                <td :colspan="curation_characteristics.length+4"><br /><br />{{ get_occurrence_name.toLowerCase() }} {{
                occurrences_selection.key }}</td>
            </tr>
            <tr>
                <th>Key</th>
                <th></th>
                <th v-for="char in curation_characteristics" :key="char.score+'sp-th'">{{ char.name }}</th>
                <th colspan="3"></th>
                <th></th>
            </tr>
            <tr class="reference-entity">
                <td><a :href="'https://www.gbif.org/occurrence/'+occurrences_selection.key" target="_blank">{{
                occurrences_selection.key}}</a></td>
                <td></td>
                <template v-for="char in curation_characteristics">
                    <td v-if="char.value" :key="char.score+'mc_td'">{{ display_content(occurrences_selection,
                    char.value) }}</td>
                </template>
                <td colspan="3"></td>
                <td>
                    <button @click="expanded = !expanded" class="button-table">
                        <img v-if="!expanded" src="../assets/images/icon_expand.png" class="mini" />
                        <img v-if="expanded" src="../assets/images/icon_reduce.png" class="mini" />
                    </button>
                </td>
            </tr>
            <tr class="expanded" v-if="expanded">
                <td></td>
                <td :colspan="curation_characteristics.length+1">
                    <div class="expanded-box" v-if="occurrences_selection.verbatimLabel">
                        {{ occurrences_selection.verbatimLabel }}
                    </div>
                    <div class="expanded-box">
                        <a :href="occurrences_selection.references" target="_blank">Reference to TreatmentBank</a>
                    </div>
                </td>
                <td colspan="4"></td>
            </tr>

            <tr class="empty-line">
                <td colspan="18"><br /><br />{{ processed_curation.length }} suggested {{
                get_curation_name.toLowerCase() }}<span v-if="processed_curation.length > 1">s</span> to curate</td>
            </tr>

            <tr v-if="processed_curation.length > 0">
                <th>Key</th>
                <th @click="sortBy('$global')">Score</th>
                <th v-for="char in curation_characteristics" :key="char.score+'sp-th'" class="clickable-th"
                    @click="sortBy(char.score)">{{ char.name }}</th>
                <th>Yes</th>
                <th>No</th>
                <th>Save</th>
                <th></th>
            </tr>

            <CurationElement @removeOne=removeElement @addOne=addElement v-for="curation in processed_curation"
                :key="curation.object.key" :curation="curation"
                :scores="get_scores(occurrences_selection, curation.object)" save="Save"
                :status_save_all="status_save_all" />
            <EmptyElement @removeOne=removeElement @addOne=addElement v-for="curation in processed_empty_elements"
                :key="curation.empty_key" :curation="curation" save="Save" :status_save_all="status_save_all" />
            <tr class="empty-line">
                <td :colspan="curation_characteristics.length+4">
                    <div class="left-container">
                        <a @click="addLine">+ Add another {{ get_curation_name.toLowerCase() }}</a>
                    </div>
                </td>
            </tr>

            <tr v-if="finished_curation.length > 0 || finished_empty_elements.length > 0" class="empty-line">
                <td :colspan="curation_characteristics.length+4">
                    <br /><br />
                    <img v-show="!show_edit" src="../assets/images/icon_plus.png" alt="[+]"
                        @click="show_edit = !show_edit" class="mini" />
                    <img v-show="show_edit" src="../assets/images/icon_minus.png" alt="[-]"
                        @click="show_edit = !show_edit" class="mini" />
                    {{ finished_curation.length+finished_empty_elements.length }} {{ get_curation_name.toLowerCase()
                    }}<span v-if="(finished_curation.length+finished_empty_elements.length) > 1">s</span> already
                    curated
                </td>
            </tr>

            <tr v-if="show_edit && (finished_curation.length > 0 || finished_empty_elements.length > 0)">
                <th>Key</th>
                <th>Score</th>
                <th v-for="char in curation_characteristics" :key="char.score+'sp-th'" class="clickable-th">{{ char.name
                }}</th>
                <th>Yes</th>
                <th>No</th>
                <th>Edit</th>
                <th></th>
            </tr>

            <template v-if="show_edit && finished_curation.length > 0">
                <CurationElement @removeOne=removeElement @addOne=addElement v-for="curation in finished_curation"
                    :key="curation.object.key" :curation="curation"
                    :scores="get_scores(occurrences_selection, curation.object)" save="Edit"
                    :status_save_all="status_save_all" />
            </template>
            <template v-if="show_edit && finished_empty_elements.length > 0">
                <EmptyElement @removeOne=removeElement @addOne=addElement v-for="curation in finished_empty_elements"
                    :key="curation.empty_key" :curation="curation" save="Edit" :status_save_all="status_save_all" />
            </template>

        </table>



        <div>

            <div class="button-container">
                <button v-if="show_back_button" class="secondary" @click="back()">Back to list</button>
                <button :disabled="to_disable" @click="save()">Save</button>
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
            </div>

        </div>

    </div>

</template>


<script>
import { mapState, mapActions } from 'vuex'
import CurationElement from '@/components/CurationElement.vue'
import EmptyElement from '@/components/EmptyElement.vue'

export default {
    name: 'CurationList',
    components: {
        CurationElement,
        EmptyElement,
    },
    props: {
        show_back_button: {
            type: Boolean,
            required: false,
            default: true,
        },
    },
    data() {
        return {
            empty_elements: [],
            change_list: [],
            change_dict: {},
            status_save_all: 0,
            sort: {
                by: '$global',
                asc: false
            },
            show_edit: false,
            expanded: false,
            pendingSave: [],
        };
    },
    computed: {
        ...mapState(['urls', 'theme_color', 'institution_selection', 'datasets_selection', 'occurrences_selection', 'matching', 'curation_characteristics', 'format_selection', 'fields', 'user']),
        cssVars() {
            return {
                '--color': this.theme_color.main,
                '--color-secondary': this.theme_color.secondary,
            }
        },
        get_occurrence_name() {
            return this.fields[this.format_selection].format_occurrence.name
        },
        get_curation_name() {
            return this.fields[this.format_selection].format_curation.name
        },
        processed_curation() {
            var filtered_curation = this.occurrences_selection.relations

            const get_relation_scores = (relation) => {
                const scores = this.$scoring.get_scores(this.occurrences_selection, relation.object);
                const score_value = scores[this.sort.by];
                return score_value != null ? parseFloat(score_value) : -1
            }

            if (this.sort.asc) {
                filtered_curation.sort((a, b) => get_relation_scores(a) - get_relation_scores(b));
            }
            else {
                filtered_curation.sort((a, b) => get_relation_scores(b) - get_relation_scores(a));
            }

            filtered_curation = filtered_curation.filter(element => element.matching.match == null);
            return filtered_curation;
        },
        finished_curation() {
            var filtered_curation = this.occurrences_selection.relations

            filtered_curation = filtered_curation.filter(element => element.matching.match != null);
            return filtered_curation;
        },
        processed_empty_elements() {
            var filtered_empty = this.empty_elements

            filtered_empty = filtered_empty.filter(element => element.matching.match == null);
            return filtered_empty;
        },
        finished_empty_elements() {
            var filtered_empty = this.empty_elements

            filtered_empty = filtered_empty.filter(element => element.matching.match != null);
            return filtered_empty;
        },
        to_disable() {
            if (Object.keys(this.change_list).length > 0) {
                return false
            }
            else {
                return true
            }
        },
    },
    methods: {
        ...mapActions(['updateOccurrencesSelection', 'updateMatching', 'updateStep', 'updateUsername']),
        get_scores(occurrence1, occurrence2) {
            if (occurrence1 == null || occurrence2 == null) {
                return {
                    '$global': null
                };
            }
            return this.$scoring.get_scores(occurrence1, occurrence2);
        },
        display_content(object, values) {
            var content = ""

            for (let i = 0; i < values.length; i++) {
                if (values[i] in object) {
                    if (content.length > 0) {
                        content += "/"
                    }
                    content += object[values[i]]
                }
            }
            return content
        },
        removeElement(element) {
            const index = this.change_list.indexOf(element.key);
            if (index > -1) {
                this.change_list.splice(index, 1);
            }
        },
        addElement(element) {
            if (!this.change_list.includes(element.key)) {
                this.change_list.push(element.key)
            }
            this.change_dict[element.key] = element.value
        },
        saveName() {
            var name = prompt("Please enter your name or ORCID", "");
            if (name == "") {
                this.saveName()
            }
            else {
                if (name == null) {
                    alert("Your work is not saved")
                }
                else {
                    this.updateUsername(name)
                }
            }
        },
        save() {
            const toSave = [];
            for (var i = 0; i < this.change_list.length; i++) {
                if (/^\d+$/.test(this.change_list[i])) {
                    toSave.push(this.change_list[i]);
                }
            }
            this.pendingSave = toSave;
            this.$emitter.emit('ensureLogin');
        },
        back() {
            let go_back = this.change_list.length == 0 || confirm('Are you sure you want to leaving without saving?')
            if (go_back) {
                this.updateOccurrencesSelection(null)
                this.$emit('clicked')
            }
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
        addLine() {
            var object = {}
            object.object = {}
            object.object.key = ""
            object.empty_key = "emptykey_" + this.empty_elements.length
            object.matching = {}
            object.matching.match = null
            this.empty_elements.push(object)
            this.addElement({ 'key': object.empty_key, 'value': true })
        }
    },
    mounted() {
        this.$emitter.on('logged', () => {
            if (this.pendingSave.length > 0) {
                const occurrenceIdToSave = this.pendingSave.slice();
                this.pendingSave = [];

                var saved_data = []
                for (var i = 0; i < occurrenceIdToSave.length; i++) {
                    var element = {
                        "occurrenceKey1": this.occurrences_selection.key,
                        "occurrenceKey2": occurrenceIdToSave[i],
                        "decision": this.change_dict[this.change_list[i]],
                        "userName": this.user.name,
                        "orcid": this.user.orcid,
                    }
                    saved_data.push(element)
                }

                var saved_json = { "occurrenceRelations": saved_data }
                this.$backend.post_matching(saved_json)
                    .then(() => {
                        for (let i = 0; i < this.occurrences_selection.relations.length; i++) {
                            if (this.change_list.includes(this.occurrences_selection.relations[i].object.key)) {
                                this.occurrences_selection.relations[i].matching.match = this.change_dict[this.occurrences_selection.relations[i].object.key]
                            }
                        }
                        for (let i = 0; i < this.empty_elements.length; i++) {
                            if (this.change_list.includes(this.empty_elements[i].empty_key)) {
                                this.empty_elements[i].matching.match = this.change_dict[this.empty_elements[i].empty_key]
                            }
                        }
                        this.change_list = []
                        this.change_dict = {}
                        this.status_save_all += 1

                    })
                    .catch(error => {
                        alert("Failed to save" + error)
                    });
            }
        });
        this.$emitter.on('loginAbort', () => {
            if (this.pendingSave) {
                this.pendingSave = [];
                alert('Your work is not saved');
            }
        });
    },
}

</script>


<style scoped lang="scss">
.full-container {
    width: 100%;
    margin: 0 auto;
}

.abstract-container {
    background-color: #eee;
    border-radius: 10px;
    padding: 10px;
    margin: 20px;
}

.button-container {
    text-align: right;
}

.left-container {
    text-align: left;
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

.secondary {
    background-color: #AAA;
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

button:disabled,
button[disabled] {
    background-color: #cccccc;
    color: #666666;
}

.mini {
    width: 15px;
    padding-bottom: 4px;
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
</style>
