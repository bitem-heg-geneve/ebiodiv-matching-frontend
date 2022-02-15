<template>

    <div class="component-container" :style="cssVars">

        <div class="separator">
            <h2><span>Specimens for the material citation {{ material_citation_selection.materialCitationOccurrence.key }}</span></h2>
        </div>

        <div class="abstract-container">

            <PanelMoreLess :visible_length="1" :items_length="2" message_more="Show details" message_less="Hide details" >

                <template slot="default-list">
                    <p>{{ material_citation_selection.materialCitationOccurrence.verbatimLabel }}</p>
                </template>

                <template slot="extra-list">

                    <table>
                        <tr>
                            <template v-for="char in specimen_characteristics">
                                <th v-if="char.value" :key="char.short+'mc-th'">{{ char.name }}</th>
                            </template>
                        </tr>
                        <tr>
                            <template v-for="char in specimen_characteristics">
                                <td v-if="char.value" :key="char.short+'mc_td'">{{ material_citation_selection.materialCitationOccurrence[char.short] }}</td>
                            </template>
                        </tr>
                    </table>

                </template>

            </PanelMoreLess>

        </div>

        <div>

            <p>
                {{ processed_specimens.length }} specimen<span v-if="processed_specimens.length > 1">s</span>
            </p>

            <table>

                <tr>
                    <th>Key</th>
                    <th v-for="char in specimen_characteristics" :key="char.short+'sp-th'" class="clickable-th" @click="sortBy(char.short)">{{ char.name }}</th>
                    <th>Yes</th>
                    <th>No</th>
                    <th>Expand</th>
                </tr>

            <SpecimenElement @clicked="storeStatus" v-for="specimen in processed_specimens" :key="specimen.key" :specimen="specimen" :status="getStatus(specimen.key)"/>

            </table>

            <div class="button-container">
                <button class="secondary" @click="back()">Back to list</button>
                <button :disabled="to_disable" @click="save()">Save</button>
            </div>

        </div>

    </div>

</template>


<script>
import { mapState, mapActions } from 'vuex'
import axios from 'axios';
import PanelMoreLess from '@/components/PanelMoreLess.vue'
import SpecimenElement from '@/components/SpecimenElement.vue'

    export default {
      name: 'SpecimenList',
      components: {
        PanelMoreLess,
        SpecimenElement
      },
      data() {
        return {
            status_list_saved: null,
            status_list: null,
            saved: null,
            sort: {
                by: '$mean',
                asc: false
            },
            to_disable: true
        };
      },
      computed: {
        ...mapState(['urls', 'theme_color', 'material_citation_selection', 'matching', 'specimen_characteristics']),
        cssVars () {
                return{
                    '--color': this.theme_color.main,
                    '--color-secondary': this.theme_color.secondary,
                }
        },
        processed_specimens () {
            var filtered_specimen = Object.keys(this.material_citation_selection.institutionOccurrences).map(key => this.material_citation_selection.institutionOccurrences[key]);

            if (this.sort.asc){
                filtered_specimen.sort((a, b) => ('$score' in a ? parseFloat(a.$score[this.sort.by]): 0) - ('$score' in b ? parseFloat(b.$score[this.sort.by]): 0));
            }
            else {
                filtered_specimen.sort((a, b) => ('$score' in b ? parseFloat(b.$score[this.sort.by]): 0) - ('$score' in a ? parseFloat(a.$score[this.sort.by]): 0));
            }
            return filtered_specimen;
        },
        saved_string(){
            var specimens_saved = {}
            var done = true
            Object.entries(this.status_list).forEach(entry => {
                var [key, value] = entry;
                if (value != ""){
                    specimens_saved[key] = {"match": (value.toLowerCase() === 'true'),"comment": ""}
                }
                else {
                    done = false
                }
            });

            if(Object.entries(this.status_list).length != Object.entries(this.material_citation_selection.institutionOccurrences).length){
                done = false;
            }
            return {"done": done,"specimens": specimens_saved}
        },


      },
      methods:{
        ...mapActions(['updateMaterialCitationSelection', 'updateMatching']),
            loadStatus(){
                if (this.matching != null){
                     for (let i=0; i<this.matching.length; i++){
                        if (this.matching[i].key == this.material_citation_selection.materialCitationOccurrence.key){
                            this.status_list_saved = this.matching[i].specimens_status
                        }
                    }
                }
                this.status_list = JSON.parse(JSON.stringify(this.status_list_saved))
            },
            getStatus(key){
                if (this.status_list_saved == null){
                    this.loadStatus()
                }
                var status = "unknown"
                if (key in this.status_list_saved){
                    if (this.status_list_saved[key] == "true"){
                        return "yes"
                    }
                    else {
                        return "no"
                    }
                }
                return status;
            },
            save(){
               var saved_data = this.saved_string
               axios.post(this.urls.material_citations_status+this.material_citation_selection.materialCitationOccurrence.key, saved_data)
                    .then(response => {
                        if(response.data == null){
                            this.updateMatching(null)
                            this.status_list_saved = JSON.parse(JSON.stringify(this.status_list))
                            this.updateDisable()
                        }
                    });
            },
            back(){
               if (JSON.stringify(this.status_list_saved) != JSON.stringify(this.status_list)){
                    if (confirm('Are you sure you want to leaving without saving?')) {
                        this.updateMaterialCitationSelection(null)
                        this.$router.push({ name: 'HomePage', hash: '#materialcitations', query: this.$route.query}).catch(()=>{});
                    }
                }
                else {
                    this.updateMaterialCitationSelection(null)
                    this.$router.push({ name: 'HomePage', hash: '#materialcitations', query: this.$route.query}).catch(()=>{});

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
           storeStatus (value) {
            if (value.status != "unknown"){
               this.status_list[value.id] = value.status
            }
            else {
                delete this.status_list[value.id]
            }
            this.updateDisable()
            },
            updateDisable(){
                 if (JSON.stringify(this.status_list_saved) == JSON.stringify(this.status_list)){
                    this.to_disable = true;
                }
                else {
                    this.to_disable = false;
                }
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

    table {
          margin-bottom: 20px;
          border-collapse: collapse;
          width: 100%;
          font-size: 0.8em;
          background-color: #fff
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

    .cell-color-good {
        background-color: #D7F2D6;
    }
    .cell-color-medium {
        background-color: #FBECD7;
    }
    .cell-color-bad {
        background-color: #F0D3D4;
    }
    .cell-color-na {

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
    }

</style>
