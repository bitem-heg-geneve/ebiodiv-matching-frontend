<template>

    <tr :style="cssVars" :class="tr_even">
        <td><a :href="'https://www.gbif.org/occurrence/'+occurrence['key']" target="_blank">{{ occurrence.key }}</a></td>
        <td>{{ occurrence.scientificName }}</td>
        <td v-if="user_query.basisOfRecord=='MATERIAL_CITATION'">{{ occurrence.verbatimLabel }}</td>
        <td>{{ this.display_value_typeStatus(occurrence.typeStatus) }}</td>
        <td>{{ this.display_value_basisOfRecord(occurrence.basisOfRecord) }}</td>
        <td>{{ occurrence.year }}</td>
        <td>{{ relation_count }}</td>
        <td>
          <img v-if="status_name != 'unknown'" :src="require('../assets/images/icon_status_'+status_name+'.png')" class="small"/>
          <span v-else>unknown</span>
        </td>
        <td><button @click="displayOccurrence()" class="button-table"><img src="../assets/images/icon_todo.png"  class="mini"/></button></td>

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
        index: {
          type: Number,
          required: true
        }
      },
      data() {
        return {
        };
      },
      computed: {
        ...mapState([
          'user_query', 
          'theme_color'
        ]),
        cssVars () {
            return{
                '--color': this.theme_color.main,
            }
        },
        tr_even (){
          if (this.index % 2 == 0){
            return "tr-even"
          }
          return "tr-odd"
        },
        relation_count(){
          var total = 0
          if('occurrenceRelationSummary' in this.occurrence){
            for (const value of Object.values(this.occurrence.occurrenceRelationSummary)){
                total += value
            }
          }
          else {
            return "unknown"
          }
          return total
        },
        status_name(){
          if('occurrenceRelationSummary' in this.occurrence){
            if (this.occurrence.occurrenceRelationSummary.PNDG == this.relation_count){
              return "not-done"
            }
            if (this.occurrence.occurrenceRelationSummary.PNDG < this.relation_count){
              return "partial"
            }
            return "finished"
          }
          return "unknown"
        }
      },
      methods:{
        ...mapActions([
          'updateOccurrenceKey', 
          'updateStep', 
        ]),
        displayOccurrence(){
          this.updateStep(3)
          this.updateOccurrenceKey(this.occurrence.key)
          this.$gtag.event('displayOccurrence');
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

    .tr-even {
    background-color: #fff;
}


</style>
