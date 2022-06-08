<template>

    <div class="component-container" :style="cssVars">

        <div>

            <div class="separator">
              <h2><span>Datasets</span></h2>
            </div>

            <PulseLoader v-if="in_progress" :color="theme_color.main"/>

            <div v-if="!in_progress">

                <div v-if="datasets.length > 0">

                    <DatasetElement v-for="dataset in datasets" :key="dataset.key" :dataset="dataset" :checked="is_checked(dataset.key)" :expanded="is_expanded(dataset.key)" @add="addExpanded" @remove="removeExpanded"/>

                </div>

                <div class="row">

                    <div class="col-6">
                        <a v-if="datasets.length > 1" @click="selectAll()">Select all datasets</a>
                        <span v-if="datasets.length > 1 && datasets_selection.length > 1"> / </span>
                        <a v-if="datasets_selection.length > 1" @click="unselectAll()">Unselect all datasets</a>
                    </div>
                    <div class="col-6" style="text-align: right">
                        <a v-if="datasets.length > 1" @click="expandAll()">Expand all datasets</a>
                        <span v-if="datasets.length > 1"> / </span>
                        <a v-if="datasets.length > 1" @click="unexpandAll()">Unexpand all datasets</a>
                    </div>

                </div>


            </div>

        </div>

    </div>

</template>


<script>
import { mapState, mapActions } from 'vuex'
import axios from 'axios';
import DatasetElement from '@/components/DatasetElement.vue'
var PulseLoader = require('vue-spinner/src/PulseLoader.vue').default;

    export default {
      name: 'DatasetsList',
      components: {
        DatasetElement,
        PulseLoader
      },
      data() {
        return {
            status: [],
            in_progress: false,
            expanded: []
        };
      },
      computed: {
        ...mapState(['urls', 'institution_selection', 'datasets', 'datasets_selection', 'urls_parameters', 'theme_color']),
        cssVars () {
            return{
                '--color': this.theme_color.main,
            }
        },
      },
      methods:{
        ...mapActions(['updateDatasets', 'updateDatasetsSelection', 'updateFormatSelection', 'updateStep']),
        searchDatasetsAPI () {
            this.in_progress = true
            if (this.institution_selection.name){
                this.updateDatasets([])
                this.updateDatasetsSelection([])
                var url = this.urls.datasets+"?institutionKey="+this.institution_selection.key
                axios
                      .get(url)
                      .then(response => {
                            this.updateDatasets(Object.freeze(response.data))
                            for(var index in response.data){
                                if(this.urls_parameters.datasets.includes(response.data[index].key)){
                                    this.datasets_selection.push(response.data[index].key)
                                }
                            }
                            this.in_progress = false
                            if(this.datasets_selection.length > 0 && this.urls_parameters.format != null){
                                this.$emit('searchOccurrences', this.urls_parameters.format)
                            }
                      })
                      .catch(error => {
                        alert ("failed to load datasets for "+this.institution_selection.name+": "+error )
                      })
            }
        },
        is_checked(key){
            if(this.datasets_selection.includes(key)){
                return true
            }
            else {
                return false
            }
        },
         is_expanded(key){
            if(this.expanded.includes(key)){
                return true
            }
            else {
                return false
            }
        },
        addExpanded(key){
            if (!this.expanded.includes(key)){
                this.expanded.push(key)
            }
        },
        removeExpanded(key){
            const index = this.expanded.indexOf(key);
            if (index > -1) {
                this.expanded.splice(index, 1);
            }
        },
        selectAll(){
            this.updateStep(1)
            for(var index in this.datasets){
                var dataset = this.datasets[index]
                if(!this.datasets_selection.includes(dataset.key)){
                    this.datasets_selection.push(dataset.key)
               }
            }
        },
        unselectAll(){
            this.updateStep(1)
            this.updateDatasetsSelection([])
        },
        expandAll(){
            for(var index in this.datasets){
                var dataset = this.datasets[index]
                if(!this.expanded.includes(dataset.key)){
                    this.expanded.push(dataset.key)
               }
            }
            this.$router.push({ name: 'HomePage', hash: '#institutions', query: this.$route.query}).catch(()=>{});
       },
        unexpandAll(){
            this.expanded = []
            this.$router.push({ name: 'HomePage', hash: '#institutions', query: this.$route.query}).catch(()=>{});
        }
      },
       watch: {
            'institution_selection.name': function () {
                this.searchDatasetsAPI()
            },
        },
        mounted(){
            this.searchDatasetsAPI()
        }

    }

</script>


<style scoped lang="scss">

    .content {
        display: flex;
    }

    .full-container {
        width: 100%;
        margin: 0 auto;
    }

    .facets {
        float: left;
        margin-right: 20px;
    }

    .page-box {
      display: flex;
      justify-content: center;
    }

    table {
          margin-bottom: 20px;
          border-collapse: collapse;
          width: 100%;
          font-size: 0.8em;
          background-color: #eee
    }

    td, th {
      border-bottom: 1px solid #ddd;
      padding: 6px;
      text-align: center;
    }

    tr:nth-child(even){
      background-color: #fff;
    }

    tr:hover {
      background-color: #ddd;
    }

    th {
      padding-top: 6px;
      padding-bottom: 6px;
      background-color: var(--color);
      color: white;
    }

</style>
