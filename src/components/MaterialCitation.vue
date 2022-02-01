<template>

    <tr :style="cssVars">

        <td>{{ material_citation.materialCitationOccurrence.key }}</td>
        <td>{{ material_citation.materialCitationOccurrence.acceptedScientificName }}</td>
        <td>{{ material_citation.materialCitationOccurrence.verbatimLabel }}</td>
        <td>{{ material_citation.materialCitationOccurrence.year }}</td>
        <td>{{ material_citation.institutionOccurrences.length }}</td>
        <td v-if="status != null"><img :src="require('../assets/images/icon_status_'+status+'.png')" class="small"/></td>
        <td v-else><PulseLoader size="5px"/></td>
        <td><button @click="displaySpecimen(material_citation)" class="button-table"><img src="../assets/images/icon_todo.png"  class="mini"/></button></td>

    </tr>

</template>


<script>
import { mapState, mapActions } from 'vuex'
import axios from 'axios';
var PulseLoader = require('vue-spinner/src/PulseLoader.vue').default;

    export default {
      name: 'MaterialCitations',
      components: {
        PulseLoader
      },
      props: {
        material_citation: {
            type: Object,
            required: true
        },
      },
      data() {
        return {
            status: null,
        };
      },
      computed: {
        ...mapState(['urls', 'material_citations', 'user_selection', 'filters', 'theme_color']),
        cssVars () {
            return{
                '--color': this.theme_color.main,
            }
        },

        get_status(){
            return this.status["3042107311"]
        },

      },
      methods:{
        ...mapActions(['updateMaterialCitations', 'updateMaterialCitationSelection']),
        queryStatus () {
            var key = this.material_citation.materialCitationOccurrence.key
             axios
                      .get(this.urls.material_citations_status+key)
                      .then(response => {
                            // Load material citation status
                            if (response.data.done == false){
                                this.status = "not-done"
                            }
                            else if (response.data.done == true){
                                this.status = "finished"
                            }
                            // Load specimen status
                            const specimens_status = {}
                             Object.entries(response.data.specimens).forEach(entry => {
                                const [key, value] = entry;
                                specimens_status[key] = value.match.toString()
                            });
                            for (var v = 0; v < this.material_citations.length; v++ ) {
                                if (this.material_citations[v].materialCitationOccurrence.key == this.material_citation.materialCitationOccurrence.key){
                                    this.material_citations[v].processed_facets["status"] = [this.status]
                                    this.material_citations[v].specimen_status = specimens_status
                                }
                            }
                            this.updateMaterialCitations(this.material_citations)
                      })
                      .catch(error => {
                        alert ("failed to load status for "+key+": "+error )
                      })
                      .finally(() => this.in_progress = false)
        },
        displaySpecimen(selection){
            this.updateMaterialCitationSelection(selection)
            this.$router.push({ name: 'Home', hash: '#specimen', query: this.$route.query}).catch(()=>{});
        },
      },
        mounted: function () {
            this.queryStatus()
        }
    }

</script>


<style scoped lang="scss">


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

    .small {
        width: 50px;
    }

    .mini {
        width: 15px;
    }

    td {
      border-bottom: 1px solid #ddd;
      padding: 6px;
      text-align: center;
    }


</style>
