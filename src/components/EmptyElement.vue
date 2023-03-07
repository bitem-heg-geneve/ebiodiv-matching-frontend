<template>

    <tbody>

        <tr >
            <td>
                <div v-if="save=='Save'">
                    <input  v-model="curation.object.key" @blur="loadKey()"/>
                    <a v-if="empty_link" :href="empty_link" target="_blank"> <img src="../assets/images/icon_link.png"  class="mini"/></a>
                </div>
                <span v-if="save!='Save'">
                    <a v-if="empty_link" :href="empty_link" target="_blank">{{ curation.object.key }}</a>
                    <span v-else>{{ curation.object.key }}</span>
                </span>
                <span class="warning" v-if="warning"><br/>{{ warning }}</span>
            </td>
            <td  class="cell-color-na">manual</td>
            <template v-if="in_progress == false">
                <td v-for="char in get_characteristics_curation" class="cell-color-na" :key="char.score+'sp-td-em'">
                    {{ display_content(curation.object, char.value) }}
                </td>
            </template>
            <template v-else>
                <td v-for="char in get_characteristics_curation" class="cell-color-na" :key="char.score+'sp-td-em'">
                    <PulseLoader  :color="theme_color.main" size="5px"/>
                </td>
            </template>
            <td class="decision">
                <input type="checkbox" :checked="is_yes_selected" @click="changeSelection($event, 'yes')" /> Yes <br/>
                <input type="checkbox" :checked="is_no_selected" @click="changeSelection($event, 'no')" /> No <br/>
                <input type="checkbox" :checked="is_undecided_selected" @click="changeSelection($event, 'undecided')" /> Undecided
            </td>
            <td>
                <button v-if="show_button" :disabled="to_disable" @click="saveSelection()">{{ save }}</button>
            </td>
            <td>
                <button @click="expanded = !expanded" class="button-table" v-if="curation.object.verbatimLabel">
                    <img v-if="!expanded" src="../assets/images/icon_expand.png"  class="mini"/>
                    <img v-if="expanded" src="../assets/images/icon_reduce.png"  class="mini"/>
                </button>
            </td>
        </tr>

        <tr class="expanded" v-if="expanded">
            <td></td>
            <td :colspan="get_curation_characteristics.length+1" class="cell-color-na">
                {{ curation.object.verbatimLabel }}
            </td>
             <td colspan="4"></td>
        </tr>

    </tbody>

</template>


<script>
import { mapState, mapActions } from 'vuex'
var PulseLoader = require('vue-spinner/src/PulseLoader.vue').default;
import shared_fields from '@/components/shared_fields.js'

    export default {
      name: 'CurationElement',
      mixins: [
        shared_fields.mixin_fields
    ],
      components: {
              PulseLoader
      },
      props: {
        curation: {
            type: Object,
            required: true
        },
        save: {
            type: String,
            default: "Save"
        }
      },
      data() {
        return {
            warning: null,
            key: "",
            status: null,
            saved_status: null,
            expanded: false,
            in_progress: false,
            pendingSave: false,
        };
      },
      computed: {
        ...mapState(['theme_color', 'urls', 'curation_characteristics', 'fields', 'format_selection', 'occurrences_selection', 'user']),
        cssVars () {
            return{
                '--color': this.theme_color.main,
            }
        },
        get_characteristics_curation(){
            if (this.curation.object && this.curation.object['basisOfRecord'] == "MATERIAL_CITATION"){
                return this.curation_characteristics.MATERIAL_CITATION;
            }
            return this.curation_characteristics.default;
        },
        get_occurrence_name(){
            return this.fields[this.format_selection].format_occurrence.name
        },
        get_curation_name(){
            return this.fields[this.format_selection].format_curation.name
        },
        is_yes_selected(){
            if (this.status == "yes"){
                return true
            }
            else {
                return false
            }
        },
        is_no_selected(){
            if (this.status == "no"){
                return true
            }
            else {
                return false
            }
        },
        is_undecided_selected(){
            if (this.status == "undecided"){
                return true
            }
            else {
                return false
            }
        },
        show_button(){

            if (this.warning == null && this.curation.object.key != ""){
                return true
            }
            return false

        },
        empty_link(){
            if (/^http/.test(this.curation.object.key)){
                return this.curation.object.key
            }
            else if (/^\d+$/.test(this.curation.object.key)){
                return "https://www.gbif.org/occurrence/"+this.curation.object.key
            }
            return null
        },
        to_disable(){
            if (this.curation.matching.match == true && this.is_yes_selected == true) {
                return true
            }
            if (this.curation.matching.match == false && this.is_no_selected == true) {
                return true
            }
            if ((this.curation.matching.match == null && this.curation.matching.statusCode == "UDCB") && this.is_undecided_selected == true) {
                return true
            }
            if ((this.curation.matching.match == null && this.curation.matching.statusCode == "PNDG") && this.is_yes_selected == false && this.is_no_selected == false && this.is_undecided_selected == false) {
                return true
            }
            return false
        }
      },
      methods:{
        ...mapActions(['updateUsername']),
        normalizeValue(value){
                if (value == null){
                    return "NA"
                }
                return value
           },
        display_content (object, values){
            var content = ""
            for (let i=0; i<values.length; i++){
                if (values[i] in object){
                    if (content.length > 0){
                        content += "/"
                    }
                    content += object[values[i]]
                }
            }

            return content
        },
        changeSelection(event, choice){
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
            else if (choice == "undecided") {
                if (event.target.checked == true) {
                    this.status = "undecided"
                }
                if (event.target.checked == false) {
                    this.status = "unknown"
                }
            }
            var match = null
            if (this.status != null) {
                match = this.status
            }
            if (this.status != this.saved_status) {
                this.$emit("addOne", { 'key': this.curation.object.key, 'value': match })
            }
            else {
                this.$emit("removeOne", { 'key': this.curation.object.key, 'value': match })
            }
        },
        saveSelection(){
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
        loadKey(){
            this.warning = null
            for (var i=0; i<this.occurrences_selection.relations.length; i++){
                if (this.curation.object.key == this.occurrences_selection.relations[i].object.key){
                    this.warning = "already in suggested "+this.get_curation_name.toLowerCase()+"s";
                    break;
                }
            }
            if (this.curation.object.key != "" && /^\d+$/.test(this.curation.object.key)){
               this.loadGBIF()
            }
            else {
                this.curation.object = {'key': this.curation.object.key}
            }
            this.status = "yes"
        },
        loadGBIF(){
            this.in_progress = true
            this.$backend.fetch_occurrence(this.curation.object.key, true)
                .then(response => {
                    if ('occurrences' in response.data  && this.curation.object.key in response.data.occurrences){
                        var key = this.curation.object.key
                        this.curation.object = response.data.occurrences[this.curation.object.key]
                        this.curation.object['key'] = key
                    }
                    else {
                        this.curation.object = {'key': this.curation.object.key}
                    }
                    this.in_progress = false
                })
                .catch(error => {
                    this.curation.object = {'key': this.curation.object.key, 'error': error}
                    this.warning = "unknown GBIF key"
                });
        }
      },
      beforeMount(){
        if (this.status == null){
            if (this.curation.matching.match == null) {
                if (this.curation.matching.statusCode == "PNDG"){
                    this.status = "unknown"
                }
                else {
                    this.status = "undecided"
                }
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
    }

</script>


<style scoped lang="scss">

    td, th {
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
    button[disabled]{
      background-color: #cccccc;
      color: #666666;
    }

    .warning {
        color: red;
    }


    .cell-color-na {
        background-color: #eee;
        color: #000;
    }

    .decision {
        text-align: left;
        width: 100px;
    }
</style>
