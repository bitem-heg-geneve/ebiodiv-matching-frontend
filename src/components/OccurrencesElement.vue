<template>

    <tr :style="cssVars">

        <td><a :href="'https://www.gbif.org/occurrence/'+occurrence[get_occurrence_json]['key']" target="_blank">{{ occurrence[get_occurrence_json].key }}</a></td>
        <td>{{ occurrence[get_occurrence_json].scientificName }}</td>
        <td>{{ occurrence[get_occurrence_json].verbatimLabel }}</td>
        <td>{{ occurrence[get_occurrence_json].year }}</td>
        <td>{{ Object.entries(occurrence[get_curation_json]).length }}</td>
        <td v-if="status_info != null"><img :src="require('../assets/images/icon_status_'+status_info+'.png')" class="small"/></td>
        <td v-else><PulseLoader size="5px"/></td>
        <td><button @click="displaySpecimen()" class="button-table"><img src="../assets/images/icon_todo.png"  class="mini"/></button></td>

    </tr>

</template>


<script>
import { mapState, mapActions } from 'vuex'
var PulseLoader = require('vue-spinner/src/PulseLoader.vue').default;

    export default {
      name: 'OccurrencesElement',
      components: {
        PulseLoader
      },
      props: {
        occurrence: {
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
        ...mapState(['urls', 'occurrences', 'matching', 'user_selection', 'filters', 'fields', 'institution_selection', 'format_selection', 'theme_color']),
        cssVars () {
            return{
                '--color': this.theme_color.main,
            }
        },
        get_occurrence_name(){
            return this.fields[this.format_selection].format_occurrence.name
        },
        get_occurrence_json(){
            return this.fields[this.format_selection].format_occurrence.json
        },
        get_curation_name(){
            return this.fields[this.format_selection].format_curation.name
        },
        get_curation_json(){
            return this.fields[this.format_selection].format_curation.json
        },
        status_info(){
            if (this.matching != null){
                for (let i=0; i<this.matching.length; i++) {
                    if (this.matching[i].key == this.occurrence[this.get_occurrence_json].key){
                        return this.matching[i].material_citation_status
                    }
                }
            }
            return null
        }
      },
      methods:{
        ...mapActions(['updateOccurrences', 'updateOccurrencesSelection']),
        displaySpecimen(){
            this.updateOccurrencesSelection(this.occurrence)
            this.$router.push({ name: 'HomePage', query: { institution: this.institution_selection.key, format: this.format_selection, occurrence: this.occurrence[this.get_occurrence_json].key}}).catch(()=>{});
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
