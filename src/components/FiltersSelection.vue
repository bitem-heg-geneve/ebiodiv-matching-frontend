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

        <p v-if="processed_size==0 && total_size >0"><br/>No material citation retrieved with your filters. <a @click="removeAllFilters">Delete filters</a> to see all material citations.</p>

    </div>

</template>


<script>
import { mapState, mapActions } from 'vuex'

    export default {
      name: 'FiltersSelection',
      props: {
        processed_size: {
            type: Number,
            required: true
        },
        total_size: {
            type: Number,
            required: true
        },
      },
      computed: {
        ...mapState(['user_selection', 'filters', 'theme_color']),
        cssVars () {
            return{
                '--color': this.theme_color.main,
            }
        },
        active_filters(){
            var active_filters = []
            for (const key in this.user_selection.material_citations.facets) {
                var list = this.user_selection.material_citations.facets[key]
                if (key != "date"){
                    for (var i=0; i<list.length; i++){
                        var item = {}
                        item.name = list[i]
                        item.type = key
                        active_filters.push(item)
                    }
                }
                else {
                    if (this.filters.material_citations.date[0] != this.user_selection.material_citations.facets.date[0] || this.filters.material_citations.date[1] != this.user_selection.material_citations.facets.date[1]){
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
        ...mapActions(['updateMaterialCitationsFacet']),
        removeFilter(facet_name, value){
            if (facet_name != "date"){
                var filter_list = this.user_selection.material_citations.facets[facet_name]
                for (var i = 0; i < filter_list.length; i++ ) {
                   if (filter_list[i] == value) {
                     filter_list.splice(i, 1)
                   }
                }
                this.updateMaterialCitationsFacet({'facet': facet_name, 'list': filter_list })
            }
            else{
                this.updateMaterialCitationsFacet({'facet': 'date', 'list': this.filters.material_citations.date })
            }
        },
        removeAllFilters(){
            for (var key in this.user_selection.material_citations.facets){
                this.updateMaterialCitationsFacet({'facet': key, 'list': [] })
            }
            this.updateMaterialCitationsFacet({'facet': 'date', 'list': this.filters.material_citations.date })
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
