<template>

    <tbody>

        <tr>
            <td><a :href="'https://www.gbif.org/occurrence/'+curation.object.key" target="_blank">{{ curation.object.key }}</a></td>
            <td :class="cellColor(scores.$global)">{{ scores.$global }}</td>
            <template>
                <td v-for="char in get_characteristics_curation" :key="char.score+'sp-td'"
                    :class="'cell_' + char.score + ' ' + cellColor(scores[char.score])">
                    {{ display_content(curation.object, char.value) }}
                </td>
            </template>
            <td>
                <input type="checkbox" :checked="is_yes_selected" @click="changeSelection($event, 'yes')" />
            </td>
            <td>
                <input type="checkbox" :checked="is_no_selected" @click="changeSelection($event, 'no')" />
            </td>
            <td>
                <button :disabled="to_disable" @click="saveSelection()">{{ save }}</button>
            </td>
            <td>
                <button @click="expanded = !expanded" class="button-table" v-if="curation.object.verbatimLabel">
                    <img v-if="!expanded" src="../assets/images/icon_expand.png" class="mini" />
                    <img v-if="expanded" src="../assets/images/icon_reduce.png" class="mini" />
                </button>
            </td>
        </tr>

        <tr class="expanded" v-if="expanded">
            <td></td>
            <td :colspan="curation_characteristics.length+1" class="cell-color-na">
                <div class="expanded-box" v-if="curation.object.verbatimLabel">
                    {{ curation.object.verbatimLabel }}
                </div>
                <div class="expanded-box">
                    <a :href="curation.object.references" target="_blank">Reference to TreatmentBank</a>
                </div>

            </td>
            <td colspan="4"></td>
        </tr>
    </tbody>

</template>


<script>
import { mapState, mapActions } from 'vuex'
import shared_fields from '@/components/shared_fields.js'

export default {
    name: 'CurationElement',
    mixins: [
        shared_fields.mixin_fields
    ],
    components: {
    },
    props: {
        curation: {
            type: Object,
            required: true
        },
        scores: {
            type: Object,
            required: true
        },
        save: {
            type: String,
            default: "Save"
        },
        status_save_all: {

        }
    },
    data() {
        return {
            status: null,
            saved_status: null,
            expanded: false,
            pendingSave: false,
        };
    },
    computed: {
        ...mapState(['theme_color', 'urls', 'curation_characteristics', 'fields', 'format_selection', 'occurrences_selection', 'user']),
        cssVars() {
            return {
                '--color': this.theme_color.main,
            }
        },
        get_occurrence_name() {
            return this.fields[this.format_selection].format_occurrence.name
        },
        get_curation_name() {
            return this.fields[this.format_selection].format_curation.name
        },
        get_characteristics_curation(){
            if (this.curation.object['basisOfRecord'] == "MATERIAL_CITATION"){
                return this.curation_characteristics.MATERIAL_CITATION;
            }
            return this.curation_characteristics.default;
        },
        is_yes_selected() {
            if (this.status == "yes") {
                return true
            }
            else {
                return false
            }
        },
        is_no_selected() {
            if (this.status == "no") {
                return true
            }
            else {
                return false
            }
        },
        to_disable() {
            if (this.curation.matching.match == true && this.is_yes_selected == true) {
                return true
            }
            if (this.curation.matching.match == false && this.is_no_selected == true) {
                return true
            }
            if (this.curation.matching.match == null && this.is_yes_selected == false && this.is_no_selected == false) {
                return true
            }
            return false

        }
    },
    methods: {
        ...mapActions(['updateUsername']),
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
            var match = null
            if (this.status == "yes") {
                match = true
            }
            if (this.status == "no") {
                match = false
            }
            if (this.status != this.saved_status) {
                this.$emit("addOne", { 'key': this.curation.object.key, 'value': match })
            }
            else {
                this.$emit("removeOne", { 'key': this.curation.object.key, 'value': match })
            }
        },
        saveSelection() {
            this.$parent.pendingSave = [ this.curation.object.key ];
            /*
                ensureLogin event is going to make sure:
                1/ the user is logged.
                2/ to emit the "logged" event even if the user is already logged.

                The CurationList element listens for the "logged" event:
                The listener saves the occurrence relations referenced by pendingSave.

                The CurationList element listens for the "loginAbort" event:
                The listener display a message if pendingSave is not empty,
                so the user aware that it works is not saved.
             */
            this.$emitter.emit('ensureLogin');
        },
        toggle() {
            this.expanded = !this.expanded
        },
    },
    beforeMount() {
        if (this.status == null) {
            if (this.curation.matching.match == null) {
                this.status = "unknown"
            }
            else if (this.curation.matching.match == true) {
                this.status = "yes"
            }
            else if (this.curation.matching.match == false) {
                this.status = "no"
            }
        }
        this.saved_status = this.status
    },
    watch: {
        status_save_all() {
            this.saved_status = this.status
        },
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
</style>
