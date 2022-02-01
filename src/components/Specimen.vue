<template>

    <div class="component-container" :style="cssVars">

        <div class="separator">
            <h2><span>Specimen for the material citation {{ material_citation_selection.materialCitationOccurrence.key }}</span></h2>
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
                    <th>Choice</th>
                    <th>Expand</th>
                </tr>

                <template v-for="specimen in material_citation_selection.institutionOccurrences">

                    <tr :key="specimen.key">
                        <td>{{ specimen.key }}</td>
                        <template v-if="hasScore(specimen)">
                             <td v-for="char in specimen_characteristics" :key="char.short+'sp-td'" :class="cellColor(specimen.$score[char.short])" :title="specimen[char.short]+'\n'+material_citation_selection.materialCitationOccurrence[char.short]">
                                {{ normalizeValue(specimen.$score[char.short]) }}
                            </td>
                        </template>
                        <template v-else>
                            <td v-for="char in specimen_characteristics" :key="char.short+'sp-td'" :title="specimen[char.short]+'\n'+material_citation_selection.materialCitationOccurrence[char.short]">
                                unknown
                            </td>
                        </template>
                        <td>
                            <select name="choice" :id="specimen.key+'_choice'" v-model="status_list[specimen.key]">
                                  <option value=""></option>
                                  <option value="true">Yes</option>
                                  <option value="false">No</option>
                            </select>
                        </td>
                        <td>
                            <button @click="toggle(specimen.key)" class="button-table">
                                <img v-if="!expanded.includes(specimen.key)" src="../assets/images/icon_expand.png"  class="mini"/>
                                <img v-if="expanded.includes(specimen.key)" src="../assets/images/icon_reduce.png"  class="mini"/>
                            </button>
                        </td>
                    </tr>

                    <tr class="expanded" v-if="expanded.includes(specimen.key)" :key="specimen.key+'_expanded'">
                        <td colspan="19">
                            <table>

                                <tr>
                                    <th></th>
                                    <th>Material citation</th>
                                    <th>Specimen</th>
                                </tr>

                                <template v-for="char in specimen_characteristics">
                                    <tr v-if="char.value" :key="char.short+'sp-td-exp'">
                                        <td>{{ char.name }}</td>
                                         <template v-if="hasScore(specimen)">
                                            <td :class="cellColor(specimen.$score[char.short])">{{ specimen[char.short] }}</td>
                                            <td :class="cellColor(specimen.$score[char.short])">{{ material_citation_selection.materialCitationOccurrence[char.short] }}</td>
                                         </template>
                                         <template v-else>
                                            <td>{{ specimen[char.short] }}</td>
                                            <td>{{ material_citation_selection.materialCitationOccurrence[char.short] }}</td>
                                         </template>
                                    </tr>
                                </template>

                            </table>
                        </td>
                    </tr>

                </template>

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

    export default {
      name: 'Specimen',
      components: {
        PanelMoreLess
      },
      data() {
        return {
            status_list_init: {},
            saved: null,
            expanded: [],
            sort: {
                by: '$mean',
                asc: false
            }
        };
      },
      computed: {
        ...mapState(['urls', 'theme_color', 'material_citation_selection', 'specimen_characteristics']),
        cssVars () {
                return{
                    '--color': this.theme_color.main,
                    '--color-secondary': this.theme_color.secondary,
                }
        },
        processed_specimens () {
            var filtered_specimen = this.material_citation_selection.institutionOccurrences
            if (this.sort.asc){
                filtered_specimen.sort((a, b) => ('$score' in a ? parseFloat(a.$score[this.sort.by]): 0) - ('$score' in b ? parseFloat(b.$score[this.sort.by]): 0));
            }
            else {
                filtered_specimen.sort((a, b) => ('$score' in b ? parseFloat(b.$score[this.sort.by]): 0) - ('$score' in a ? parseFloat(a.$score[this.sort.by]): 0));
            }
            return filtered_specimen;
        },
        status_list(){
            if (Object.keys(this.status_list_init).length == 0){
                this.loadStatus();
            }
            return (this.status_list_init)
        },
        saved_string(){
            var specimens_saved = {}
            var done = true
            Object.entries(this.status_list).forEach(entry => {
                const [key, value] = entry;
                if (value != ""){
                    specimens_saved[key] = {"match": (value.toLowerCase() === 'true'),"comment": ""}
                }
                else {
                    done = false
                }
            });

            if(Object.entries(this.status_list).length != this.material_citation_selection.institutionOccurrences.length){
                done = false;
            }
            return {"done": done,"specimens": specimens_saved}
        },
        to_disable(){
            if (JSON.stringify(this.saved) == JSON.stringify(this.saved_string)){
                return true;
            }
            else {
                return false;
            }
        }

      },
      methods:{
        ...mapActions(['updateMaterialCitationSelection']),
            loadStatus(){
                this.status_list_init = this.material_citation_selection.specimen_status
            },
            save(){
               const saved_data = this.saved_string
               axios.post(this.urls.material_citations_status+this.material_citation_selection.materialCitationOccurrence.key, saved_data)
                    .then(response => {
                        if(response.data == null){
                            this.saved = saved_data
                        }
                    });
            },
            back(){
               if (JSON.stringify(this.saved) != JSON.stringify(this.saved_string)){
                    if (confirm('Are you sure you want to leaving without saving?')) {
                        this.updateMaterialCitationSelection(null)
                        this.$router.push({ name: 'Home', hash: '#materialcitations', query: this.$route.query}).catch(()=>{});
                    }
                }
                else {
                    this.updateMaterialCitationSelection(null)
                    this.$router.push({ name: 'Home', hash: '#materialcitations', query: this.$route.query}).catch(()=>{});

                }
           },
           toggle(id) {
              const index = this.expanded.indexOf(id);
              if (index > -1) {
                this.expanded.splice(index, 1)
              } else {
                this.expanded.push(id)
              }
           },
           cellColor(value){
                var class_name = "cell-color-na"
                if (value >= 0.8){
                    class_name = "cell-color-good"
                }
                else if (value >= 0.4){
                    class_name = "cell-color-medium"
                }
                else if (value >= 0.0){
                    class_name = "cell-color-bad"
                }
                return class_name
           },
           normalizeValue(value){
                if (value == null){
                    return "NA"
                }
                return value
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
           hasScore(specimen){
                if ("$score" in specimen){
                    return true;
                }
                else {
                    return false;
                }
           },
      },
      mounted: function () {
            this.saved = this.saved_string
      }
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
