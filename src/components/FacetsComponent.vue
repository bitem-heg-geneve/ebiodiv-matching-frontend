<template>

    <div class="facets-container" :style="cssVars">

        <div class="all-filters-container" v-if="visible_facets">

            <h2>Sort and highlight</h2>

            <div class="inputGroup" v-for="sort in filters.sort" @click="updateSort(sort)" :key="sort">
                <input type="radio" :id="sort" :name="sort_group_name" :value="sort" v-model="user_selection.sort" />
                <label :for="sort">By {{ sort }}</label>
            </div>

            <br />

            <h2>Filters</h2>

            <div v-for="facet in filters.facets" :key="facet.name">

                <PanelHideShow :expanded_init="true" size="small">

                    <template v-slot:title>{{ facet.title }}</template>
                    <template v-slot:content>

                        <PanelMoreLess v-if="facet.multi == true" :visible_length="item_size"
                            :items_length="facets_multi_with_status(facet).length" message_more="More"
                            message_less="Less">

                            <template slot="default-list">
                                <div class="inputGroup"
                                    v-for="item in facets_multi_with_status(facet).slice(0, item_size)"
                                    @click="changeFacet(facet, $event)" :key="item.name">
                                    <input :id="item.name" :name="item.name" type="checkbox" v-bind:value="item.name"
                                        :checked="item.checked" />
                                    <label :for="item.name">{{ item.label }} ({{ item.count }})</label>
                                </div>
                            </template>

                            <template slot="extra-list">
                                <div class="inputGroup"
                                    v-for="item in facets_multi_with_status(facet).slice(item_size, facets_multi_with_status(facet).length)"
                                    @click="changeFacet(facet, $event)" :key="item.name">
                                    <input :id="item.name" :name="item.name" type="checkbox" v-bind:value="item.name"
                                        :checked="item.checked" />
                                    <label :for="item.name">{{ item.label }} ({{ item.count }})</label>
                                </div>
                            </template>

                        </PanelMoreLess>

                        <PanelMoreLess v-if="facet.short != 'date' && facet.multi != true" :visible_length="item_size"
                            :items_length="facets_with_status(facet).length" message_more="More" message_less="Less">

                            <template slot="default-list">
                                <div class="inputGroup" v-for="item in facets_with_status(facet).slice(0, item_size)"
                                    @click="changeFacet(facet, $event)" :key="item.name">
                                    <input :id="item.name" :name="item.name" type="checkbox" v-bind:value="item.name"
                                        :checked="item.checked" />
                                    <label :for="item.name">{{ item.label }} ({{ item.count }})</label>
                                </div>
                            </template>

                            <template slot="extra-list">
                                <div class="inputGroup"
                                    v-for="item in facets_with_status(facet).slice(item_size, facets_with_status(facet).length)"
                                    @click="changeFacet(facet, $event)" :key="item.name">
                                    <input :id="item.name" :name="item.name" type="checkbox" v-bind:value="item.name"
                                        :checked="item.checked" />
                                    <label :for="item.name">{{ item.label }} ({{ item.count }})</label>
                                </div>
                            </template>

                        </PanelMoreLess>

                        <div v-if="facet.short == 'date'" class="slider">
                            <vue-slider v-model="user_selection.facets.date" :data="dates" :marks="defined_labels"
                                :tooltip="'always'"></vue-slider>
                        </div>

                    </template>

                </PanelHideShow>

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
import PanelHideShow from '@/components/PanelHideShow.vue'
import PanelMoreLess from '@/components/PanelMoreLess.vue'
import VueSlider from 'vue-slider-component'
import '../assets/css/ebiodiv.css'
import shared from '@/components/shared.js'
import shared_fields from '@/components/shared_fields.js'

export default {
    name: 'FacetsComponent',
    mixins: [
        shared_fields.mixin_fields // add the display_value_typeStatus method
    ],
    components: {
        PanelHideShow,
        PanelMoreLess,
        VueSlider,
    },
    props: {
        documents: {
            type: Array,
            required: true
        },
        collection_name: {
            type: String,
            required: true
        },
        filters: {
            type: Object,
            required: true
        },
        user_selection: {
            type: Object,
            required: true
        },
        item_size: {
            type: Number,
            default: 3
        },
        updateSort: {
            type: Function,
            required: true
        },
        updateFacet: {
            type: Function,
            required: true
        },
        clear: {
            type: Number
        }
    },
    data() {
        return {
            visible_facets: true,
            facets: {},
            cache_facets_multi_with_status: {},
            cache_facets_with_status: {},
        };
    },
    computed: {
        ...mapState(['query', 'theme_color']),
        cssVars() {
            return {
                '--color': this.theme_color.main,
            }
        },
        sort_group_name() {
            return (this.collection_name + "_sort-group")
        },
        facets_multi_with_status() {
            return (facet_element) => {
                const facet_name = facet_element.short
                if (this.cache_facets_multi_with_status[facet_name] != null) {
                    return this.cache_facets_multi_with_status[facet_name];
                }

                // Get filtered documents list (but not for the selected facet)
                var selection = {}
                for (const key in this.user_selection.facets) {
                    if (key != facet_name) {
                        selection[key] = this.user_selection.facets[key]
                    }
                }
                var settings = { 'user_selection': selection, 'filters': this.filters.facets }
                const filtered_docs = this.documents.filter(shared.filterThis.bind(this, settings))
                // Get all facets for the filtered documents set
                var value_list = []
                for (const doc of filtered_docs) {
                    for (const value of doc.processed_facets[facet_name]) {
                        value_list.push(value);
                    }
                }
                // labelMethod
                const labelMethod = this[facet_element.labelMethod]

                // Create the facet lists based on the facets of the set + what is selected
                var results = this.createFacetList(value_list, this.user_selection.facets[facet_name], labelMethod)
                this.cache_facets_multi_with_status[facet_name] = Object.freeze(results);
                return results
            }
        },
        facets_with_status() {
            return (facet_element) => {
                var facet_name = facet_element.short
                if (this.cache_facets_with_status[facet_name] != null) {
                    return this.cache_facets_with_status[facet_name];
                }

                // Get filtered documents list
                var settings = { 'user_selection': this.user_selection.facets, 'filters': this.filters.facets }
                const filtered_docs = this.documents.filter(shared.filterThis.bind(this, settings))
                // Get all facets for the filtered documents set
                var value_list = []
                for (const doc of filtered_docs) {
                    for (const value of doc.processed_facets[facet_name]) {
                        value_list.push(value);
                    }
                }
                // labelMethod
                const labelMethod = this[facet_element.labelMethod]

                // Create the facet lists based on the facets of the set + what is selected
                var results = this.createFacetList(value_list, this.user_selection.facets[facet_name], labelMethod)
                this.cache_facets_with_status[facet_name] = results;
                return results
            }
        },
        dates() {
            var list = [];
            for (var d = this.filters.date[0]; d <= this.filters.date[1]; d++) {
                list.push(d);
            }
            return list
        },
        defined_labels: {
            get() {
                var list = this.dates
                var minDate = Math.min.apply(Math, list)
                var maxDate = Math.max.apply(Math, list)
                var marks = [minDate, maxDate]
                return marks
            },
            set(value) {
                this.value = value
            }
        },
    },
    methods: {
        createFacetList(value_list, checkedNames, labelMethod) {
            if (labelMethod == null) {
                labelMethod = value => value
            }
            const allItems = {}
            const checkedNamesSet = new Set(checkedNames)
            // Retrieve all facets
            for (const value of value_list) {
                allItems[value] = {
                    name: value,
                    label: labelMethod(value),
                    checked: checkedNamesSet.has(value),
                    count: 1 + ((value in allItems) ? allItems[value].count : 0)
                }
            }
            // Sort facets by number
            const items = Object.values(allItems);
            items.sort((first, second) => second.count - first.count);
            return items
        },
        changeFacet(facet_element, event) {
            var facet_name = facet_element.short
            var filter_list = this.user_selection.facets[facet_name]
            // Add the facet to the list if checked
            if (event.target.checked) {
                filter_list.push(event.target.value)
            }
            // Remove the facet from the list if unchecked
            else {
                for (var i = 0; i < filter_list.length; i++) {
                    if (filter_list[i] == event.target.value) {
                        filter_list.splice(i, 1)
                    }
                }
            }
            this.cache_facets_with_status = {}
            this.cache_facets_multi_with_status = {}
            this.updateFacet(Object.freeze({'facet': facet_name, 'list': filter_list }))
        },
        clearCache(){
            this.cache_facets_with_status = {}
            this.cache_facets_multi_with_status = {}            
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
    font-size: 0.85em;
    border-right: 1px solid #ddd;
    display: flex;
}

.all-filters-container {
    float: left;
    padding: 10px;
    width: 200px;
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


