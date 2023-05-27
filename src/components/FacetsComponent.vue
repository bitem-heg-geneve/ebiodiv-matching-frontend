<template>

    <div class="facets-container" :style="cssVars">

        <div class="all-filters-container" v-if="visible_facets">

            <h2>Sort</h2>

            <div class="inputGroup" v-for="ranking in filters.ranking" @click="updateRanking(ranking.field)" :key="ranking.title">
                <input type="radio" :id="ranking.title" name="ranking" :value="ranking.field" v-model="user_query.ranking" />
                <label :for="ranking">By {{ ranking.title }}</label>
            </div>

            <br/>

            <h2>Filters</h2>

            <div v-for="facet in sorted_facets" :key="facet.name">
                <FacetElement :facet="facet" :updateFacetSelection="updateFacetSelection" :user_query="user_query"/>
            </div>

        </div>

        <div class="expand-container" @click="visible_facets = !visible_facets">
            <img src="../assets/images/icon_show_more.png" alt="+" v-show="!visible_facets" />
            <img src="../assets/images/icon_show_more.png" alt="+" v-show="!visible_facets" />
            <img src="../assets/images/icon_show_more.png" alt="+" v-show="!visible_facets" />
            <img src="../assets/images/icon_show_less.png" alt="-" v-show="visible_facets" />
            <img src="../assets/images/icon_show_less.png" alt="-" v-show="visible_facets" />
            <img src="../assets/images/icon_show_less.png" alt="-" v-show="visible_facets" />
        </div>

    </div>

</template>

<script>

import { mapState } from 'vuex'
import FacetElement from '@/components/FacetElement.vue'
import '../assets/css/ebiodiv.css'

export default {
    name: 'FacetsComponent',
    components: {
        FacetElement,
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
        updateRanking: {
            type: Function,
            required: true
        },
        updateFacetSelection: {
            type: Function,
            required: true
        },
    },
    data() {
        return {
            visible_facets: true,
        };
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
        sorted_facets(){
            var facets_array = this.filters.facets
            facets_array = facets_array.sort((a, b) => a.title.localeCompare(b.title))
            return facets_array
        }
    },
}

</script>

<style scoped lang="scss">

.facets-container {
    background-color: #f2f2f2;
    text-align: left;
    padding: 0;
    margin: 0px;
    border-right: 1px solid #ddd;
    display: flex;
}

.all-filters-container {
    float: left;
    padding: 10px;
    width: 300px;
}

.expand-container {
    float: right;
    background-color: #aaa;
    width: 10px;
    padding: 10px 1px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.expand-container:hover {
    background-color: var(--color);
}

.expand-container img {
    width: 8px;
}

.inputGroup {
    background-color: #fff;
    display: block;
    margin: 10px 0;
    position: relative;
    border-radius: 10px;

    label {
        padding: 5px 25px 5px 10px;
        width: 100%;
        display: block;
        text-align: left;
        font-size: 0.8em;
        color: #3C454C;
        cursor: pointer;
        position: relative;
        z-index: 2;
        transition: color 200ms ease-in;
        overflow: hidden;
        border-radius: 10px;

        &:before {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            content: '';
            background-color: var(--color);
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale3d(1, 1, 1);
            transition: all 300ms cubic-bezier(0.4, 0.0, 0.2, 1);
            opacity: 0;
            z-index: -1;
        }

        &:after {
            width: 15px;
            height: 15px;
            content: '';
            border: 2px solid #D1D7DC;
            background-color: #fff;
            border-radius: 50%;
            z-index: 2;
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            transition: all 200ms ease-in;
        }

    }

    input:checked~label {
        color: #fff;

        &:before {
            transform: translate(-50%, -50%) scale3d(56, 56, 1);
            opacity: 1;
        }

        &:after {
            background-color: #CCCCCC;
            border-color: #CCCCCC;
        }

    }

    input {
        width: 15px;
        height: 15px;
        order: 1;
        z-index: 2;
        position: absolute;
        right: 30px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        visibility: hidden;
    }
}

.slider {
    margin: 30px 10px;
}

</style>


