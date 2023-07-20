<template>

  <div :style="cssVars">

      <div class="active-filters">
          <span class="filter-name"  v-if="query_keyword != ''">
              <span class="filter-remove" @click="removeFilter('keyword', 'q')">x </span> {{ shortIt(query_keyword) }}
          </span>
          <span class="filter-name" v-for="filter in active_filters" :key="filter.name" >
              <span class="filter-remove" @click="removeFilter(filter.type, filter.name)">x </span> {{ shortIt(filter.name) }}
          </span>
          <span class="filters-remove" v-if="filters_count > 1">
              <span @click="removeAllFilters">Remove all filters</span>
          </span>
      </div>

  </div>

</template>


<script>
import { mapState } from 'vuex'

  export default {
    name: 'FiltersSelection',
    props: {
      query_keyword: {
          type: String,
          required: true
      },
      facets: {
          type: Object,
          required: true
      },
      updatePreQuery: {
        type: Function,
        required: true
      },
      updateQuery: {
        type: Function,
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
                      item.name = list[i]
                      item.type = key
                      active_filters.push(item)
                  }
              }
          }
          return active_filters;
      },
      filters_count () {
        var count = this.active_filters.length
        if (this.query_keyword.length > 0){
          count += 1
        }
        return count
      }
    },
    methods:{
      removeFilter(facet_name, value){
        if (facet_name != "keyword"){
          var filter_list = this.facets[facet_name];
          for (var i = 0; i < filter_list.length; i++) {
              if (filter_list[i] == value) {
                  filter_list.splice(i, 1)
              }
          }
          this.updateFacetSelection({'facet': facet_name, 'list': filter_list })
        }
        else {
          this.updatePreQuery("")
          this.updateQuery("")
        }
      },
      removeAllFilters(){
          this.resetFacets()
          this.updatePreQuery("")
          this.updateQuery("")
      },
      shortIt(term){
        if (term.length < 20){
          return term
        }
        else {
          return term.replace(/^([\s\S]{20}\S*)[\s\S]*/, "$1 [...]");
        }
      }
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
    font-size: 1em;
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
    font-size: 1em;
  }
  .filters-remove:hover {
    cursor:pointer;
    color: var(--color);
  }


</style>