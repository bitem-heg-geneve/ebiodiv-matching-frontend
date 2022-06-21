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
                        <a v-if="datasets.length > 1" @click="selectAll()" class="btn btn-link btn-sm" href="#" role="button">Select all datasets</a>
                        <span v-if="datasets.length > 1 && datasets_selection.length > 1"> / </span>
                        <a v-if="datasets_selection.length > 1" @click="unselectAll()" class="btn btn-link btn-sm" href="#" role="button">Unselect all datasets</a>
                    </div>
                    <div class="col-6 text-end">
                        <a v-if="datasets.length > 1" @click="expandAll()" class="btn btn-link btn-sm" href="#" role="button">Expand all datasets</a>
                        <span v-if="datasets.length > 1"> / </span>
                        <a v-if="datasets.length > 1" @click="unexpandAll()" class="btn btn-link btn-sm" href="#" role="button">Unexpand all datasets</a>
                    </div>

                </div>


            </div>

        </div>

    </div>

</template>


<script>
import { mapState, mapActions } from 'vuex'
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
        ...mapState(['institution_selection', 'datasets', 'datasets_selection', 'urls_parameters', 'theme_color']),
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
                this.$backend
                      .fetch_datasets(this.institution_selection.key)
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
</style>
