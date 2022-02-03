<template>

    <tr :style="cssVars">

        <td>{{ material_citation.materialCitationOccurrence.key }}</td>
        <td>{{ material_citation.materialCitationOccurrence.acceptedScientificName }}</td>
        <td>{{ material_citation.materialCitationOccurrence.verbatimLabel }}</td>
        <td>{{ material_citation.materialCitationOccurrence.year }}</td>
        <td>{{ Object.entries(material_citation.institutionOccurrences).length }}</td>
        <td v-if="status_info != null"><img :src="require('../assets/images/icon_status_'+status_info+'.png')" class="small"/></td>
        <td v-else><PulseLoader size="5px"/></td>
        <td><button @click="displaySpecimen(material_citation)" class="button-table"><img src="../assets/images/icon_todo.png"  class="mini"/></button></td>

    </tr>

</template>


<script>
import { mapState, mapActions } from 'vuex'
var PulseLoader = require('vue-spinner/src/PulseLoader.vue').default;

    export default {
      name: 'MaterialCitation',
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
        ...mapState(['urls', 'material_citations', 'matching', 'user_selection', 'filters', 'theme_color']),
        cssVars () {
            return{
                '--color': this.theme_color.main,
            }
        },
        status_info(){
            if (this.matching != null){
                for (let i=0; i<this.matching.length; i++) {
                    if (this.matching[i].key == this.material_citation.materialCitationOccurrence.key){
                        return this.matching[i].material_citation_status
                    }
                }
            }
            return null
        }
      },
      methods:{
        ...mapActions(['updateMaterialCitations', 'updateMaterialCitationSelection']),
        displaySpecimen(selection){
            this.updateMaterialCitationSelection(selection)
            this.$router.push({ name: 'Home', hash: '#specimen', query: this.$route.query}).catch(()=>{});
        },
      },
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
