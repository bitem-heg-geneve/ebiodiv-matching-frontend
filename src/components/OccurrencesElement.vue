<template>

    <tr :style="cssVars" :class="tr_even">
        <td class="space">
          <a :href="'https://www.gbif.org/occurrence/'+occurrence['key']" target="_blank">{{ occurrence.key }}</a>
        </td>
        <td v-for="field in fields_to_display" :key="field.title">{{ getValue(field.field) }}
          <img v-if="field.field=='comment_count' && comment_count" src="../assets/images/icon_comment.png"  class="mini"/>
        </td>   
        <td>
          <div class="progress-status">&nbsp;
            <div class="done-status" v-for="i in done_count" :key="'done_'+i"></div>
            <div class="udcb-status" v-for="i in udcb_count" :key="'udcb_'+i"></div>
            <div class="pending-status" v-for="i in pending_count" :key="'pndg_'+i"></div>
          </div>
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
        done_count(){
          if (this.occurrence.occurrenceRelationSummary.DONE){
            return [...Array(this.occurrence.occurrenceRelationSummary.DONE).keys()].slice(0,20)
          }
          else {
            return []
          }
        },
        udcb_count(){
          if (this.occurrence.occurrenceRelationSummary.UDCB){
            return [...Array(this.occurrence.occurrenceRelationSummary.UDCB).keys()].slice(0,20)
          }
          else {
            return []
          }
          
        },
        pending_count(){
          if (this.occurrence.occurrenceRelationSummary.PNDG){
            return [...Array(this.occurrence.occurrenceRelationSummary.PNDG).keys()].slice(0,20)
          }
          else {
            return []
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
            for (const [name, value] of Object.entries(this.occurrence.occurrenceRelationSummary)){
                if (name !="DONE_YES" && name != "DONE_NO"){
                  total += value
                }
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
        },
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
          else if (variable == "comment_count"){
            if (this.comment_count){
                return this.comment_count
            }
            else {
              return ""
            }
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

    .progress-status{
      width: 100px;
      display: flex;
      padding: 0px;
      height: 10px;
    }

    .done-status {
      background-color: var(--color);
      width: 100%;
    }
    .udcb-status {
      background-color: red;
      width: 100%;
    }
    .pending-status {
      background-color: #ccc;
      width: 100%;
    }

</style>
