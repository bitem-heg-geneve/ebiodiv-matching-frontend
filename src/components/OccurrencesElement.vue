<template>

    <tr :style="cssVars" :class="tr_even">
        <td class="space">
          <a :href="'https://www.gbif.org/occurrence/'+occurrence['key']" target="_blank">{{ occurrence.key }}</a>
        </td>
        <td v-for="field in fields_to_display" :key="field.title">{{ getValue(field.field) }}</td>  
        <td v-if="comment_count">
          {{ comment_count }} <img src="../assets/images/icon_comment.png"  class="mini"/>
        </td>    
        <td v-else></td>  
        <td>
          <img v-if="status_name != 'unknown'" :src="require('../assets/images/icon_status_'+status_name+'.png')" class="small"/>
          <span v-else>unknown</span>
        </td>
        <td><button @click="displayOccurrence()" class="button-td"><img src="../assets/images/icon_todo.png"  class="mini"/></button></td>

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
          comment_count: null
        };
      },
      computed: {
        ...mapState([
          'user_query', 
          'theme_color',
          'occurrence_characteristics',
        ]),
        cssVars () {
            return{
                '--color': this.theme_color.main,
            }
        },
        fields_to_display() {
          var fields = []
          for (var i=0; i<this.occurrence_characteristics.length; i++){
            if (this.occurrence_characteristics[i].selection){
              fields.push(this.occurrence_characteristics[i])
            }
          }
          return fields
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
       getValue(variable){
          if (variable == "occurrence.typeStatus"){
            return (this.display_value_typeStatus(eval("this."+variable)))
          }
          else if (variable == "occurrence.basisOfRecord"){
            return (this.display_value_basisOfRecord(eval("this."+variable)))
          }
          else {
            return eval("this."+variable)
          }
        },
        loadCommentsCount(){
            let response_promise = this.$backend.fetch_comments(this.occurrence.key)
            response_promise.then(response => {
                    this.comment_count = response.data.count;
            })
            .catch(error => {
                console.log(error)
            })
        }
      },
      mounted() {
        this.loadCommentsCount()
    },
    }

</script>


<style scoped lang="scss">

    .button-td {
      display: inline-block;
      border-radius:5px;
      background-color: #AAA;
      border: none;
      color: #FFFFFF;
      text-align: center;
      padding: 5px 5px;
      cursor: pointer;
    }

    .button-td:hover {
      background-color: var(--color);
    }

    .small {
        width: 50px;
    }

    .mini {
        width: 15px;
    }
    .space {
      padding-left: 20px;
    }

    td {
      padding: 6px;
      text-align: left;
      white-space: nowrap;
    }

    td:first-child, th:first-child {
      position:sticky;
      left:0;
      z-index:1;
    }
    td:last-child, th:last-child {
      position:sticky;
      right:0;
      z-index:1;
    }

    .tr-odd:not(:hover) td:first-child, .tr-odd:not(:hover) td:last-child {
        background-color: #eee;
    }

    .tr-odd:hover td:first-child, .tr-odd:hover td:last-child {
        background-color: #ddd;
    }

    .tr-odd {
      background-color: #eee;
    }

    .tr-even {
      background-color: #fff;
    }

    .tr-even:not(:hover) td:first-child, .tr-even:not(:hover) td:last-child {
        background-color: #fff;
    }

    .tr-even:hover td:first-child, .tr-even:hover td:last-child {
        background-color: #ddd;
    }



</style>
