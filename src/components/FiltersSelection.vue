<template>

    <div :style="cssVars">

        <div class="active-filters">
            <span class="filter-name" v-for="filter in active_filters" :key="filter.name" >
                <span class="filter-remove" @click="removeFilter(filter.type, filter.name)">x </span> {{ filter.name }}
            </span>
            <span class="filters-remove" v-if="active_filters.length > 1">
                <span @click="removeAllFilters">Remove all filters</span>
            </span>
        </div>

        <p v-if="processed_size==0 && total_size >0"><br/>No {{ entity_name }} retrieved with your filters. <a @click="removeAllFilters">Delete filters</a> to see all results.</p>

    </div>

</template>


<script>
import { mapState } from 'vuex'

    export default {
      name: 'FiltersSelection',
      props: {
        entity_name: {
            type: String,
            required: true
        },
        processed_size: {
            type: Number,
            required: true
        },
        total_size: {
            type: Number,
            required: true
        },
        user_selection: {
            type: Object,
            required: true
        },
        filters: {
            type: Object,
            required: true
        },
        updateFacet: {
            type: Function,
            required: true
        },
      },
      computed: {
        ...mapState(['theme_color']),
        cssVars () {
            return{
                '--color': this.theme_color.main,
            }
        },
        active_filters(){
            var active_filters = []
            for (const key in this.user_selection.facets) {
                var list = this.user_selection.facets[key]
                if (key != "date"){
                    for (var i=0; i<list.length; i++){
                        var item = {}
                        item.name = list[i]
                        item.type = key
                        active_filters.push(item)
                    }
                }
                else {
                    if (this.filters.date[0] != this.user_selection.facets.date[0] || this.filters.date[1] != this.user_selection.facets.date[1]){
                        var item_date = {}
                        item_date.name = "date range"
                        item_date.type = key
                        active_filters.push(item_date)
                    }
                }
            }
            return active_filters;
        },
      },
      methods:{
        removeFilter(facet_name, value){
            if (facet_name != "date"){
                var filter_list = this.user_selection.facets[facet_name]
                for (var i = 0; i < filter_list.length; i++ ) {
                   if (filter_list[i] == value) {
                     filter_list.splice(i, 1)
                   }
                }
                this.updateFacet({'facet': facet_name, 'list': filter_list })
            }
            else{
                this.updateFacet({'facet': 'date', 'list': this.filters.date })
            }
        },
        removeAllFilters(){
            for (var key in this.user_selection.facets){
                this.updateFacet({'facet': key, 'list': [] })
            }
            this.updateFacet({'facet': 'date', 'list': this.filters.date })
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
