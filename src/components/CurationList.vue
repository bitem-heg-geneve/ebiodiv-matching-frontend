<template>

    <div class="component-container" :style="cssVars">

        <div class="separator">
            <h2><span>{{ get_curation_name }}s associated with the {{ get_occurrence_name.toLowerCase() }} {{ occurrences_selection.key }}</span></h2>
        </div>
        <p>{{ occurrences_selection.verbatimLabel }}</p>

            <table>

                <tr class="empty-line">
                    <td colspan="18"><br/><br/>{{ get_occurrence_name.toLowerCase() }} {{ occurrences_selection.key }}</td>
                </tr>
                <tr>
                    <th>Key</th>
                    <th></th>
                    <th v-for="char in curation_characteristics" :key="char.score+'sp-th'">{{ char.name }}</th>
                    <th colspan="3"></th>
                    <th></th>
                </tr>
                <tr class="reference-entity">
                    <td><a :href="'https://www.gbif.org/occurrence/'+occurrences_selection.key" target="_blank">{{ occurrences_selection.key}}</a></td>
                    <td></td>
                    <template v-for="char in curation_characteristics">
                        <td v-if="char.value" :key="char.score+'mc_td'">{{ display_content(occurrences_selection, char.value) }}</td>
                    </template>
                    <td colspan="3"></td>
                    <td>
                        <button @click="expanded = !expanded" class="button-table" v-if="occurrences_selection.verbatimLabel">
                            <img v-if="!expanded" src="../assets/images/icon_expand.png"  class="mini"/>
                            <img v-if="expanded" src="../assets/images/icon_reduce.png"  class="mini"/>
                        </button>
                    </td>
                </tr>
                <tr class="expanded" v-if="expanded">
                    <td colspan="18">
                        {{ occurrences_selection.verbatimLabel }}
                    </td>
                </tr>

                <tr class="empty-line">
                    <td colspan="18"><br/><br/>{{ processed_curation.length }} suggested {{ get_curation_name.toLowerCase() }}<span v-if="processed_curation.length > 1">s</span> to curate</td>
                </tr>

                <tr v-if="processed_curation.length > 0">
                    <th>Key</th>
                    <th @click="sortBy('$global')">Score</th>
                    <th v-for="char in curation_characteristics" :key="char.score+'sp-th'" class="clickable-th" @click="sortBy(char.score)">{{ char.name }}</th>
                    <th>Yes</th>
                    <th>No</th>
                    <th>Save</th>
                    <th></th>
                </tr>

                <CurationElement @removeOne=removeElement @addOne=addElement v-for="curation in processed_curation" :key="curation.object.key" :curation="curation" save="Save"/>

                <tr v-if="finished_curation.length > 0" class="empty-line">
                    <td colspan="18">
                        <br/><br/>
                        <img v-show="!show_edit" src="../assets/images/icon_plus.png" alt="[+]" @click="show_edit = !show_edit" class="mini"/>
                        <img v-show="show_edit" src="../assets/images/icon_minus.png" alt="[-]" @click="show_edit = !show_edit" class="mini"/>
                        {{ finished_curation.length }} {{ get_curation_name.toLowerCase() }}<span v-if="finished_curation.length > 1">s</span> already curated
                    </td>
                </tr>

                <tr v-if="show_edit && finished_curation.length > 0">
                    <th>Key</th>
                    <th>Score</th>
                    <th v-for="char in curation_characteristics" :key="char.score+'sp-th'" class="clickable-th">{{ char.name }}</th>
                    <th>Yes</th>
                    <th>No</th>
                    <th>Edit</th>
                    <th></th>
                </tr>

                <template v-if="show_edit && finished_curation.length > 0">
                    <CurationElement @removeOne=removeElement @addOne=addElement v-for="curation in finished_curation" :key="curation.object.key" :curation="curation" save="Edit"/>
                </template>
            </table>



        <div>





            <div class="button-container">
                <button class="secondary" @click="back()">Back to list</button>
                <button :disabled="to_disable" @click="save()">Save</button>
            </div>

            <div class="left-container">
                <h3>Color legend</h3>
                <table class="legend-table">
                    <tr><td><div class="color-box cell-color-1"></div></td><td>Matching score = 1</td></tr>
                    <tr><td><div class="color-box cell-color-2"></div></td><td>Matching score >= 0.9</td></tr>
                    <tr><td><div class="color-box cell-color-3"></div></td><td>Matching score >= 0.8</td></tr>
                    <tr><td><div class="color-box cell-color-4"></div></td><td>Matching score >= 0.7</td></tr>
                    <tr><td><div class="color-box cell-color-5"></div></td><td>Matching score >= 0.6</td></tr>
                    <tr><td><div class="color-box cell-color-6"></div></td><td>Matching score >= 0.5</td></tr>
                    <tr><td><div class="color-box cell-color-7"></div></td><td>Matching score >= 0.4</td></tr>
                    <tr><td><div class="color-box cell-color-8"></div></td><td>Matching score >= 0.3</td></tr>
                    <tr><td><div class="color-box cell-color-9"></div></td><td>Matching score >= 0.2</td></tr>
                    <tr><td><div class="color-box cell-color-10"></div></td><td>Matching score >= 0.1</td></tr>
                    <tr><td><div class="color-box cell-color-11"></div></td><td>Matching score >= 0.0</td></tr>
                </table>
            </div>

        </div>

    </div>

</template>


<script>
import { mapState, mapActions } from 'vuex'
import axios from 'axios';
import CurationElement from '@/components/CurationElement.vue'

    export default {
      name: 'CurationList',
      components: {
        CurationElement,
      },
      data() {
        return {
            empty_elements: [],
            change_list: [],
            change_dict: {},
            sort: {
                by: '$global',
                asc: false
            },
            show_edit: false,
            expanded: false
        };
      },
      computed: {
        ...mapState(['urls', 'theme_color', 'institution_selection', 'datasets_selection', 'occurrences_selection', 'matching', 'curation_characteristics', 'format_selection', 'fields']),
        cssVars () {
                return{
                    '--color': this.theme_color.main,
                    '--color-secondary': this.theme_color.secondary,
                }
        },
        get_occurrence_name(){
            return this.fields[this.format_selection].format_occurrence.name
        },
        get_curation_name(){
            return this.fields[this.format_selection].format_curation.name
        },
        processed_curation () {
            var filtered_curation = this.occurrences_selection.relations

            if (this.sort.asc){
                filtered_curation.sort((a, b) => ('scores' in a  && a.scores[this.sort.by] != null ? parseFloat(a.scores[this.sort.by]): -1) - ('scores' in b  && b.scores[this.sort.by] != null ? parseFloat(b.scores[this.sort.by]): -1));
            }
            else {
                filtered_curation.sort((a, b) => ('scores' in b  && b.scores[this.sort.by] != null ? parseFloat(b.scores[this.sort.by]): -1) - ('scores' in a && a.scores[this.sort.by] != null ? parseFloat(a.scores[this.sort.by]): -1));
            }

           filtered_curation = filtered_curation.filter(element => element.matching.match == null);
           return filtered_curation;
        },
        finished_curation () {
            var filtered_curation = this.occurrences_selection.relations

           filtered_curation = filtered_curation.filter(element => element.matching.match != null);
           return filtered_curation;
        },
        to_disable(){
            if (Object.keys(this.change_list).length > 0){
                return false
            }
            else{
                return true
            }
        },
      },
      methods:{
        ...mapActions(['updateOccurrencesSelection', 'updateMatching', 'updateStep']),
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
        removeElement(element){
            const index = this.change_list.indexOf(element.key);
            if (index > -1) {
                this.change_list.splice(index, 1);
            }
        },
        addElement(element){
            if (!this.change_list.includes(element.key)){
                this.change_list.push(element.key)
            }
            this.change_dict[element.key] = element.value
        },
        save(){
               var saved_data = []
               for (var i=0; i<this.change_list.length; i++){
                    var element = {
                      "occurrenceKey1": this.occurrences_selection.key,
                      "occurrenceKey2": this.change_list[i],
                      "match": this.change_dict[this.change_list[i]],
                      "comment": "testGUI-all"
                    }
                    saved_data.push(element)
               }
               axios.post(this.urls.matching, saved_data)
                    .then(response => {
                        if(response.status == 200){
                            for (var i=0; i<this.occurrences_selection.relations.length; i++){
                              if (this.change_list.includes(this.occurrences_selection.relations[i].object.key)){
                                this.occurrences_selection.relations[i].matching.match = this.change_dict[this.occurrences_selection.relations[i].object.key]
                              }
                            }
                            this.change_list = []
                            this.change_dict = {}
                        }
                    })
                    .catch(error => {
                        alert ("Failed to save"+error )
                    });
            },
            back(){
               if (this.change_list.length > 0){
                    if (confirm('Are you sure you want to leaving without saving?')) {
                        this.updateOccurrencesSelection(null)
                        this.$emit('clicked')
                    }
                }
                else {
                    this.updateOccurrencesSelection(null)
                    this.$emit('clicked')
             }
           },
           sortBy(name){
                if (name == this.sort.by){
                    this.sort.asc = !this.sort.asc
                }
                else {
                    this.sort.by = name
                    this.sort.asc = false
                }
           },
           addLine(){
                var object = {}
                object.object = {}
                object.object.key = ""

                this.empty_elements.push(object)
           }
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

    tr{
    overflow-y: auto;
    }

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

    .reference-entity th{
        background-color: #fff;
        color: #000;
    }


    .expanded {
        background-color: #eee;
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

    button:disabled,
    button[disabled]{
      background-color: #cccccc;
      color: #666666;
    }

    .mini {
        width: 15px;
        padding-bottom: 4px;
    }

    .empty-line td, .empty-line th {
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

    .legend-table{
        width: 200px;
    }

    .legend-table td {
        border: 0px solid #000;
        text-align: left;
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
