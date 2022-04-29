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
            <td  class="cell-color-na"></td>
            <template>
                <td v-for="char in curation_characteristics" class="cell-color-na" :key="char.score+'sp-td-em'">
                    {{ display_content(curation.object, char.value) }}
                </td>
            </template>
            <td>
                <input v-if="show_button" type="checkbox" :checked="is_yes_selected" @click="changeSelection($event, 'yes')"/>
            </td>
            <td>
                <input v-if="show_button" type="checkbox" :checked="is_no_selected" @click="changeSelection($event, 'no')"/>
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
            <td colspan="14" class="cell-color-na">
                {{ curation.object.verbatimLabel }}
            </td>
             <td colspan="4"></td>
        </tr>

    </tbody>

</template>


<script>
import { mapState } from 'vuex'
import axios from 'axios';

    export default {
      name: 'CurationElement',
      components: {
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
        };
      },
      computed: {
        ...mapState(['theme_color', 'urls', 'curation_characteristics', 'fields', 'format_selection', 'occurrences_selection']),
        cssVars () {
            return{
                '--color': this.theme_color.main,
            }
        },
        get_occurrence_name(){
            return this.fields[this.format_selection].format_occurrence.name
        },
        get_curation_name(){
            return this.fields[this.format_selection].format_curation.name
        },
        selected_value(){
            if (this.curation.matching.match == null){
                return false
            }
            return true
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
            if (this.saved_status == this.status){
                return true;
            }
            return false
        }
      },
      methods:{
        normalizeValue(value){
                if (value == null){
                    return "NA"
                }
                return value
           },
        is_selected(value){
            if (this.status == null){
                if (this.curation.matching.match == null){
                    this.status = "unknown"
                }
                else if (this.curation.matching.match == true){
                    this.status = "yes"
                }
                else if (this.curation.matching.match == false){
                    this.status = "no"
                }
            }
            if (this.status == value){
                return true
            }
            else {
                return false
            }
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
          if (choice == "yes"){
            if (event.target.checked == true){
                this.status = "yes"
            }
            if (event.target.checked == false){
                this.status = "unknown"
            }
          }
          else if (choice == "no"){
             if (event.target.checked == true){
                this.status = "no"
             }
             if (event.target.checked == false){
                this.status = "unknown"
             }
          }
          var match = null
            if (this.status == "yes"){
                match = true
            }
            if (this.status == "no"){
                match = false
            }
          if (this.status != this.saved_status){
            this.$emit("addOne", {'key': this.curation.empty_key, 'value': match})
          }
          else{
             this.$emit("removeOne", {'key': this.curation.empty_key, 'value': match})
          }
        },
        saveSelection(){
            alert("Manual entry is a beta version: your data will not be saved permanently")
            var match = null
            if (this.status == "yes"){
                match = true
            }
            if (this.status == "no"){
                match = false
            }
            if (/^\d+$/.test(this.curation.object.key)){
                var data_to_save = {
                      "occurrenceKey1": this.occurrences_selection.key,
                      "occurrenceKey2": this.curation.object.key,
                      "match": match,
                      "comment": "testempty"
                    }
                   axios.post(this.urls.matching, data_to_save)
                        .then(response => {
                            if(response.status == 200){
                                this.curation.matching.match = match
                                this.saved_status = this.status
                                this.$emit("removeOne", {'key': this.curation.empty_key, 'value': match})
                            }
                        })
                        .catch(error => {
                            alert ("Failed to save"+error )
                        });
             }
             else{
                    this.curation.matching.match = match
                    this.saved_status = this.status
                    this.$emit("removeOne", {'key': this.curation.empty_key, 'value': match})
             }
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
           var url = this.urls.gbif+this.curation.object.key
                axios
                      .get(url)
                      .then(response => {
                        if (response.status == 200){
                            if ('key' in response.data){
                                this.curation.object = response.data
                            }
                        }
                        else  {
                            this.curation.object = {'key': this.curation.object.key}
                        }
                      })
                      .catch(error => {
                        this.curation.object = {'key': this.curation.object.key, 'error': error}
                        this.warning = "unknown GBIF key"
                    });
        }
      },
      beforeMount(){
        if (this.status == null){
                if (this.curation.matching.match == null){
                    this.status = "unknown"
                }
                else if (this.curation.matching.match == true){
                    this.status = "yes"
                }
                else if (this.curation.matching.match == false){
                    this.status = "no"
                }
            }
            this.saved_status = this.status
        }
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

    input{
        text-align: center;
        width: 80%;
        margin: 0px 5px 0px 0px;
    }
    .cell-color-na {
        background-color: #eee;
        color: #000;
    }

</style>
