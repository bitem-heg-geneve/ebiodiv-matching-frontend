<template>

    <PanelHideShow :expanded_init="visibility" size="small" @clicked="updateVisibility">

        <template v-slot:title>{{ facet.title }}</template>
        <template v-slot:content>

            <PulseLoader v-if="in_progress" :color="theme_color.main" />

            <div v-else>

                <input :ref="facet.field+'_input'" type="text" required v-model.trim="pre_value" placeholder="search" v-if="facet.field != 'year' && facet.field != 'hasRelationWithStatus'"/>

                <div v-if="values.length > 0">

                    <!-- TODO: year -->
                    <div v-if="facet.field == 'year'">
                        {{ user_query.facets_selection.year }}
                        <vue-slider v-model="selected_date" :data="values" :marks="defined_labels"
                                :tooltip="'always'"></vue-slider>
                    </div>

                    <div v-else>

                        <div class="inputGroup" v-for="item in values"
                            @click="changeFacet(facet.field, $event)" 
                            :key="facet.field+'_'+item.value">
                            <input :id="facet.field+'_'+item.value" :name="item.value" type="checkbox" v-bind:value="item.value" :checked="item.checked" />
                            <label :for="facet.field+'_'+item.value">
                                <span class="name">
                                    {{ getPrettyItemValue(item) }}
                                </span>
                                <span class="count">{{ item.count }}</span>
                            </label>
                        </div>

                    </div>

                </div>

                <p v-else>No value found</p>

            </div>

        </template>
       
    </PanelHideShow>

</template>

<script>

import { mapState, mapActions } from 'vuex'
import PanelHideShow from '@/components/PanelHideShow.vue'
import '../assets/css/ebiodiv.css'
import shared_fields from '@/components/shared_fields.js'
var PulseLoader = require('vue-spinner/src/PulseLoader.vue').default;
import VueSlider from 'vue-slider-component'

export default {
    name: 'FacetElement',
    mixins: [
        shared_fields.mixin_fields // add the display_value_typeStatus method
    ],
    components: {
        PanelHideShow,
        PulseLoader,
        VueSlider,
    },
    props: {
        item_size: {
            type: Number,
            default: 5
        },
        facet: {
            type: Object,
            required: true
        },
        user_query: {
            type: Object,
            required: true
        },
        updateFacetSelection: {
            type: Function,
            required: true
        },
    },
    data() {
        return {
            in_progress: true,
            values: [],
            pre_value: '',
            timer: null,
            selected_date: []
        };
    },
    computed: {
        ...mapState([
            'theme_color'
        ]),
        cssVars() {
            return {
                '--color': this.theme_color.main,
            }
        },
        visibility(){
            return this.user_query.facets_visibility[this.facet.field]
        },
        // TODO: year
        defined_labels: {
            get() {
                var list = this.values
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
        ...mapActions([
            'updateFacetVisibility', 
            'updatePage',
        ]),       
        loadFacet() {
            
            if (this.facet.field == "hasRelationWithStatus"){
                    this.in_progress = true
                    this.values = []
                    let response_promise = this.$backend.fetch_status_code()
                    response_promise.then(response => {
                        var values = []
                            for (var k=0; k < Object.keys(response.data).length; k++){
                                var key =Object.keys(response.data)[k]
                                values.push({ "value": key, "count": null, 'checked': false})
                            }
                            this.values = this.updateFacetValues(values)
                            this.in_progress = false
                    })
                    .catch(error => {
                        console.log(error)
                        this.in_progress = false
                    })
            }
            else {
                this.in_progress = true
                this.values = []
                if (this.user_query.basisOfRecord != null){
                    var size = this.item_size
                    // TODO: year
                    if(this.facet.field == "year"){
                        size = 10000
                    }
                    let response_promise = this.$backend.fetch_facet_values(this.facet.field, this.user_query, size, 0)
                    response_promise.then(response => {
                            var values = response.data.results;
                            this.values = this.updateFacetValues(values)
                            this.in_progress = false
                    })
                    .catch(error => {
                        console.log(error)
                        this.in_progress = false
                    })
                }
                else {
                    this.in_progress = false
                }
            }
        },
        loadFacetWithKeywords(text) {
            this.in_progress = true
            this.values = []
            let response_promise = this.$backend.fetch_facet_values_with_keywords(this.facet.field, "*"+text+"*", this.user_query, this.item_size, 0)
            response_promise.then(response => {
                    var values = response.data.results;
                    this.values = this.updateFacetValues(values)
                    this.in_progress = false
                    this.$nextTick(() => {
                        this.$refs[this.facet.field+"_input"].focus();
                    });
            })
            .catch(error => {
                console.log(error)
                this.in_progress = false
            })
        },
        updateFacetValues(values){

            // TODO: year
            if (this.facet.field == "year") {
                var min_value = 100000
                var max_value = 0
                for (let c=0; c < values.length; c++){
                    if (values[c].value > max_value){
                        max_value = values[c].value
                    }
                    else if (values[c].value < min_value){
                        min_value = values[c].value
                    }
                }
                var list = []
                for (var i = min_value; i <= max_value; i++) {
                    list.push(i);
                }
                if (this.user_query.facets_selection.year.length != 0){
                    this.selected_date = this.user_query.facets_selection.year
                } 
                else {
                    this.selected_date = [min_value, max_value]
                }
                return list 
            }

            else {
                var present_values = []
                var clean_values = []
                for (let c=0; c < values.length; c++){
                    if (clean_values.length < 5 && values[c].value != ""){
                        clean_values.push(values[c])
                    }
                }
                values = clean_values
                for (let i=0; i< values.length; i++){
                    present_values.push(values[i].value)
                    if (this.user_query.facets_selection[this.facet.field].includes(values[i].value)){
                        values[i]['checked'] = true 
                    }
                    else {
                        values[i]['checked'] = false
                    }
                }
                for (let j=0; j<this.user_query.facets_selection[this.facet.field].length; j++){
                    var term = this.user_query.facets_selection[this.facet.field][j]
                    if (!present_values.includes(term)){
                        values.push({'value': term, 'count': 0, 'checked': true})
                        this.getCount(term)
                    }
                }
                return values
            }
            
        },
        getCount(text) {
            let response_promise = this.$backend.fetch_facet_values_with_keywords(this.facet.field, text, this.user_query, this.item_size, 0)
            response_promise.then(response => {
                if (response.data.results.length > 0){
                    var value = response.data.results[0];
                    for (var i=0; i<this.values.length; i++){
                        if (this.values[i].value == text){
                            this.values[i].count = value.count
                        }
                    }
                }   
            })
            .catch(error => {
                console.log(error)
            })
        },
        changeFacet(field, event){
            // Add the facet to the list if checked
            if (event.target.checked != undefined){
                var filter_list = this.user_query.facets_selection[field]
                if (event.target.checked) {
                    if (field == "hasRelationWithStatus"){
                        filter_list = []
                    }
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
                this.updatePage(1)
                this.updateFacetSelection(Object.freeze({'facet': field, 'list': filter_list }))
                this.loadFacet()
            }
        },
        searchFacet(text){
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.loadFacetWithKeywords(text)
            }, 1000);
        },
        updateVisibility(val){
            this.updateFacetVisibility({'facet': this.facet.field, 'visibility': val})
        },
        getPrettyItemValue(item){
            var value = ""
            if (this.facet.field == "typeStatus"){
               value = this.display_value_typeStatus(item.value)
            }
            else if (this.facet.field == "hasRelationWithStatus"){
               value = this.display_value_statusCode(item.value)
            }
            else {
                value = item.value
            }
            return value
        }
    },
    mounted(){
        this.loadFacet()
    },
    watch: {
        "user_query.facets_selection": {
            handler(){
                this.loadFacet()
            },
            deep: true
        },
        "user_query.q": function (){
            this.loadFacet()
        },
        pre_value: function () {
            this.searchFacet(this.pre_value)
        }, 
    },

}

</script>

<style scoped lang="scss">

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

        .name {
            width: 80%;
            float: left;
        }
        .count {
            width: 20%;
            float: right;
            text-align: right;
            padding-right: 5px;
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


    input[type="text"] {
      width: 100%;
      border: 0px solid grey;
      border-radius: 5px;
      font-size: 1em;
      background-color: #f2f2f2
   }
   input[type="text"]:focus {
    outline: none;
   }

</style>


