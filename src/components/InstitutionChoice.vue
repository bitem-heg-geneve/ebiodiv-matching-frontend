<template>

    <div class="component-container query-container">

        <h2>Institution</h2>

        <div class="details">

            <label>Select your institution: </label>
            <v-select class="select" :options="institutions.list" @input="clearMC()" v-model="institution_selection.name"></v-select>
            <br/><br/>

            <div v-if="institution_found">
                <p>
                    <label>Description: </label>{{ institution_description }}
                </p>
                <p>
                    <label>Homepage: </label><a :href="institution_homepage" target="_blank">{{ institution_homepage }}</a>
                </p>
                <p>
                    <label>Address: </label><br/><span v-html="institution_address"></span>
                </p>
            </div>

        </div>

        <ExecuteButton v-if="institution_selection.name" @click="displayOccurrences('matcit_specimen')" button_text="See material citations"/>
        <ExecuteButton v-if="institution_selection.name" @click="displayOccurrences('specimen_matcit')" button_text="See specimens"/>

    </div>

</template>


<script>
import axios from 'axios';
import ExecuteButton from '@/components/ExecuteButton.vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import { mapState, mapActions } from 'vuex'

    export default {
      name: 'InstitutionChoice',
      components: {
        ExecuteButton,
        vSelect
      },
      computed: {
        ...mapState(['urls', 'institutions', 'institution_selection', 'format_selection', 'urls_parameters']),
        institution_found(){
            if (this.institution_selection.name in this.institutions.info_dict){
                return true
            }
            else {
                return false
            }
        },
        institution_description() {
            if ('description' in this.institutions.info_dict[this.institution_selection.name]){
                return(this.institutions.info_dict[this.institution_selection.name].description)
            }
            else {
                return "no description available"
            }
        },
        institution_homepage() {
            if ('homepage' in this.institutions.info_dict[this.institution_selection.name]){
                return(this.institutions.info_dict[this.institution_selection.name].homepage)
            }
            else {
                return "no homepage available"
            }
        },
        institution_address() {
            if ('address' in this.institutions.info_dict[this.institution_selection.name]){
                var address =  ""
                if ('address' in this.institutions.info_dict[this.institution_selection.name].address){
                    address += this.institutions.info_dict[this.institution_selection.name].address.address+"<br/>";
                }
                if ('city' in this.institutions.info_dict[this.institution_selection.name].address){
                    address += this.institutions.info_dict[this.institution_selection.name].address.city+"<br/>";
                }
                if ('province' in this.institutions.info_dict[this.institution_selection.name].address){
                    address += this.institutions.info_dict[this.institution_selection.name].address.province+"<br/>";
                }
                if ('country' in this.institutions.info_dict[this.institution_selection.name].address){
                    address += this.institutions.info_dict[this.institution_selection.name].address.country+"<br/>";
                }
                return(address)
            }
            else {
                return "no address available"
            }
        }
      },
      methods:{
        ...mapActions(['updateInstitutions', 'updateInstitutionSelection', 'updateFormatSelection']),
        async queryInstitutionsAPI () {
            try {
                var institutions_list = []
                var institutions_info = {}
                var institutions_keys = {}
                const response = await axios.get(this.urls.institutions)
                for (var key in response.data){
                    var name = response.data[key].name
                    if ('additionalNames' in response.data[key]){
                         if (response.data[key]['additionalNames'].length > 0){
                            name += " ("+ response.data[key]['additionalNames'].join(', ')+")"
                        }
                    }
                    // If name is dupplicated
                    while (name in institutions_keys){
                        name += " 2"
                    }
                    institutions_list.push(name)
                    institutions_keys[name] = key
                    institutions_info[name] = response.data[key]
                }
                institutions_list = [...new Set(institutions_list)];
                institutions_list.sort();
                this.updateInstitutions({'list': institutions_list, 'keys': institutions_keys, 'info': institutions_info})
                if(this.urls_parameters.institution != null){
                    for (const [key, value] of Object.entries(this.institutions.keys_dict)){
                        if (value == this.urls_parameters.institution){
                            this.updateInstitutionSelection({'key': value, 'name': key})
                        }
                    }
                }

                if (this.format_selection != null && (this.institution_selection.name != null || this.institution_selection.name != "")){
                    this.displayOccurrences(this.format_selection)
                }

            } catch (e) {
                alert ("failed to load institutions")
            }
        },
        clearMC(){
            this.updateInstitutionSelection({'key': null, 'name': this.institution_selection.name})
        },
        displayOccurrences(format){
            this.updateFormatSelection(format)
            this.updateInstitutionSelection({'key': this.institutions.keys_dict[this.institution_selection.name], 'name': this.institution_selection.name})
            this.scrollToOccurrences(format);
        },
        scrollToOccurrences(format){
            this.$router.push({ name: 'HomePage', hash: '#occurrences', query: { institution: this.institution_selection.key, format: format }}).catch(()=>{});
        }
      },
      mounted(){
        this.queryInstitutionsAPI()
      }
    }

</script>


<style scoped lang="scss">

    .details {
        text-align: justify;
    }

    label {
        font-weight: bold;
        padding-right: 5px;
    }

    .select {
        background-color: #ffffff;
    }

</style>
