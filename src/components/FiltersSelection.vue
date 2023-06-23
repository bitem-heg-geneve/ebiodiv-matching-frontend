<template>

    <div :style="cssVars">

        <div class="active-filters">
            <span class="filter-name" v-for="filter in active_filters" :key="filter.name" >
                <span class="filter-remove" @click="removeFilter(filter.type, filter.name)">x </span> {{ filter.name }}
            </span>
            <span class="filters-remove" v-if="active_filters.length > 1">
                <span @click="resetFacets">Remove all filters</span>
            </span>
        </div>

    </div>

</template>


<script>
import { mapState } from 'vuex'

    export default {
      name: 'FiltersSelection',
      props: {
        facets: {
            type: Object,
            required: true
        },
        updateFacetSelection: {
            type: Function,
            required: true
        },
        resetFacets: {
            type: Function,
            required: true
        },
      },
      computed: {
        ...mapState([
          'theme_color'
        ]),
        cssVars () {
            return{
                '--color': this.theme_color.main,
            }
        },
        active_filters(){
            var active_filters = []
            for (const [key, list] of Object.entries(this.facets)) {
                // TODO: year
                if (key == "year"){
                  // TO DO: check for year filter
                }
                else {
                    for (var i=0; i<list.length; i++){
                        var item = {}
                        if ('label' in list[i]){
                          item.name = list[i].label
                        }
                        else {
                          item.name = list[i].value
                        }
                        item.type = key
                        active_filters.push(item)
                    }
                }
            }
            return active_filters;
        },
      },
      methods:{
        removeFilter(facet_name, value){
            var filter_list = this.facets[facet_name];
            for (var i = 0; i < filter_list.length; i++) {
                if ('label' in filter_list[i]){
                  if (filter_list[i].label == value) {
                      filter_list.splice(i, 1)
                  }
                }
                else {
                  if (filter_list[i].value == value) {
                      filter_list.splice(i, 1)
                  }
                }
            }
            this.updateFacetSelection({'facet': facet_name, 'list': filter_list })
        },
      },
    }

</script>


<style scoped lang="scss">

    .active-filters{
      text-align: left;
      margin-bottom: 10px;
    }

    .filter-name {
      background-color: #f2f2f2;
      border-radius: 10px;
      padding: 2px 10px;
      margin-right: 5px;
      font-size: 0.8em;
    }

    .filter-remove {
      color: #AAAAAA;
      border-right: 1px solid #AAAAAA;
      margin-right: 5px;
    }

    .filter-remove:hover {
      cursor:pointer;
      color: var(--color);
    }

    .filters-remove {
      padding: 2px 10px;
      margin-right: 5px;
      font-size: 0.8em;
    }
    .filters-remove:hover {
      cursor:pointer;
      color: var(--color);
    }

</style>
