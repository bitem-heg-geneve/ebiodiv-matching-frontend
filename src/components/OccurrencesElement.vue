<template>

    <tr :style="cssVars">

        <td><a :href="'https://www.gbif.org/occurrence/'+occurrence['key']" target="_blank">{{ occurrence.key }}</a></td>
        <td>{{ occurrence.scientificName }}</td>
        <td v-if="get_occurrence_name=='Material citation'">{{ occurrence.verbatimLabel }}</td>
        <td>{{ this.display_value_typeStatus(occurrence.typeStatus) }}</td>
        <td>{{ this.display_value_basisOfRecord(occurrence.basisOfRecord) }}</td>
        <td>{{ occurrence.year }}</td>
        <td>{{ Object.entries(occurrence.relations).length }}</td>
        <td><img :src="require('../assets/images/icon_status_'+occurrence.status+'.png')" class="small"/></td>
        <td><button @click="displaySpecimen()" class="button-table"><img src="../assets/images/icon_todo.png"  class="mini"/></button></td>

    </tr>

</template>


<script>
import { mapState, mapActions } from 'vuex'
import shared_fields from '@/components/shared_fields.js'


    export default {
      name: 'OccurrencesElement',
      mixins: [
        shared_fields.mixin_fields // add the display_content method
      ],
      components: {
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
        ...mapState(['fields', 'format_selection', 'institution_selection', 'datasets_selection', 'theme_color']),
        cssVars () {
            return{
                '--color': this.theme_color.main,
            }
        },
        get_occurrence_name(){
            if (this.format_selection){
                return this.fields[this.format_selection].format_occurrence.name
            }
            return ""
        },
        get_curation_name(){
             if (this.format_selection){
               return this.fields[this.format_selection].format_curation.name
            }
            return ""
        },
      },
      methods:{
        ...mapActions(['updateOccurrences', 'updateOccurrencesSelection', 'updateStep']),
        displaySpecimen(){
            this.updateOccurrencesSelection(this.occurrence)
            this.updateStep(3)
            this.$router.push({
              name: this.$router.currentRoute.name,
              query: {
                ...this.$router.currentRoute.query,
                occurrenceKey: this.occurrence.key
              }
            })
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
