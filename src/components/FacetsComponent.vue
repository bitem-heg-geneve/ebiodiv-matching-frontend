<template>

    <div class="facets-container" :style="cssVars">

        <h2>Query</h2>

        <input type="text" required v-model.trim="user_query.pre_q"/>
        <button class="button" @click="search()">
            <img :src="require('../assets/images/icon_search.png')" class="mini" />
        </button>

        <div class="radiobutton-container">

            <input type="radio" id="basisOfRecord" name="basisOfRecord" value="PRESERVED_SPECIMEN" :checked="selectedBasis('PRESERVED_SPECIMEN')" @click="updateBasis($event)">
            <label for="basisOfRecord">Preserved specimen</label><br>

            <input type="radio" id="basisOfRecord" name="basisOfRecord" value="MATERIAL_CITATION" :checked="selectedBasis('MATERIAL_CITATION')" @click="updateBasis($event)">
            <label for="basisOfRecord">Material citation</label><br>

        </div>

        <SortDropdown  :updateSort="this.updateRanking" :options="filters.ranking" :selected="user_query.ranking"/>

        <h2>Filters</h2>

        <div v-for="facet in this.filters.facets" :key="facet.name">
            <FacetElement :facet="facet" :updateFacetSelection="updateFacetSelection" :user_query="user_query"/>
        </div>

    </div>

</template>

<script>

import { mapState } from 'vuex'
import FacetElement from '@/components/FacetElement.vue'
import '../assets/css/ebiodiv.css'
import SortDropdown from '@/components/SortDropdown.vue'

export default {
    name: 'FacetsComponent',
    components: {
        FacetElement,
        SortDropdown
    },
    props: {
        item_size: {
            type: Number,
            default: 5
        },
        filters: {
            type: Object,
            required: true
        },
        user_query: {
            type: Object,
            required: true
        },
        updateQuery: {
            type: Function,
            required: true
        },
        updateRanking: {
            type: Function,
            required: true
        },
        updateFacetSelection: {
            type: Function,
            required: true
        },
        updateBasisOfRecord: {
            type: Function,
            required: true
        }
    },
    computed: {
        ...mapState([
            'query', 
            'theme_color'
        ]),
        cssVars() {
            return {
                '--color': this.theme_color.main,
            }
        },
    },
    methods: {
        search(){
            this.updateQuery(this.user_query.pre_q)
        },
        selectedBasis(value){
            if (this.user_query.basisOfRecord == value){
                return true
            }
            else{
                return false
            }
        },
        updateBasis(event){
            this.updateBasisOfRecord(event.target.value)
        }
    }
}

</script>

<style scoped lang="scss">

.facets-container {
    background-color: #f2f2f2;
    text-align: left;
    padding: 0;
    margin: 0px;
    border-right: 1px solid #ddd;
    padding: 10px;
}

input[type='text']{
    width: 90%
}

.mini {
    width: 13px;
    cursor: pointer;
}

.button {
    display: inline-block;
    background-color: #AAA;
    border: none;
    color: #FFFFFF;
    text-align: center;
    padding: 3px 5px;
    cursor: pointer;
}

.button:hover {
    background-color: var(--color)
}

.radiobutton-container {
    margin: 20px 0 0 0;
}

input[type='radio']{
    margin-right: 10px;
    accent-color: #232323;
}

</style>


