<template>

    <div class="dataset-container row" :style="cssVars">

        <div class="col-1 left-column">
            <input type="checkbox" :checked="checked" @click="storeSelection($event)"/>
        </div>

        <div class="col-10 middle-column">
            <h2>{{ dataset.title }}</h2>
            <div v-if="expanded">
                <p v-html="dataset.description"></p>
                <p><i>{{ dataset.citation.text }}</i></p>
                <p><a :href="dataset.homepage" target="_blank">{{ dataset.homepage }}</a></p>
            </div>
        </div>

        <div class="col-1 right-column">
                <button @click="toggle()" class="button-table">
                    <img v-if="!expanded" src="../assets/images/icon_expand.png"  class="mini"/>
                    <img v-if="expanded" src="../assets/images/icon_reduce.png"  class="mini"/>
               </button>
        </div>

    </div>

</template>


<script>
import { mapState, mapActions } from 'vuex'

    export default {
      name: 'OccurrencesElement',
      components: {
      },
      props: {
        dataset: {
            type: Object,
            required: true
        },
        checked: {
            type: Boolean,
            default: false
        },
        expanded: {
            type: Boolean,
            default: false
        }
      },
      data() {
        return {
            status: null,
        };
      },
      computed: {
        ...mapState(['datasets_selection', 'theme_color']),
        cssVars () {
            return{
                '--color': this.theme_color.main,
            }
        },

      },
      methods:{
      ...mapActions(['updateStep']),
        storeSelection(e){
        if (e.target.checked == true) {
            if (!this.datasets_selection.includes(this.dataset.key)){
                this.datasets_selection.push(this.dataset.key)
                this.updateStep(1)
            }
         }
         if (e.target.checked == false) {
            if (this.datasets_selection.includes(this.dataset.key)){
                const index = this.datasets_selection.indexOf(this.dataset.key);
                if (index > -1) {
                  this.datasets_selection.splice(index, 1); // 2nd parameter means remove one item only
                  this.updateStep(1)
                }
            }
         }
        },
        toggle (){
            if(this.expanded){
                this.$emit('remove', this.dataset.key)
            }
            else {
                this.$emit('add', this.dataset.key)
            }
        },
      },
    }

</script>


<style scoped lang="scss">

    .dataset-container{
      background-color: #fff;
      margin: 10px 0px;
    }

    .left-column {
      padding: 15px;
      background-color: #ddd;
      text-align: center;
    }

    .middle-column {
      text-align: justify;
      padding: 0px 20px;
      background-color: #fff;
    }

    .right-column {
        padding: 10px;
        background-color: #ddd;
        text-align: center;
    }

    .button-table {
      display: inline-block;
      border-radius:5px;
      background-color: #ddd;
      border: none;
      color: #FFFFFF;
      text-align: center;
      padding: 5px 5px;
      cursor: pointer;
    }

    .button-table:hover {
      background-color: var(--color);
    }

    .mini {
        width: 15px;
    }


</style>
