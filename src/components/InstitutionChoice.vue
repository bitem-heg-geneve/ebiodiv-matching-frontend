<template>

    <div class="component-container query-container">

        <h2>Institution</h2>

        <div class="details">

            <label>Select your institution: </label>
            <v-select class="select" :options="institutions.list" @input="storeInstitution()" v-model="institution_selection.name"></v-select>
            <br/><br/>

            <div >
                <DatasetsList @searchOccurrences="searchOccurrences" v-if="institution_found"/>
            </div>

        </div>

    </div>

</template>


<script>
import axios from 'axios';
import DatasetsList from '@/components/DatasetsList.vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import { mapState, mapActions } from 'vuex'

    export default {
      name: 'InstitutionChoice',
      components: {
        DatasetsList,
        vSelect
      },
      computed: {
        ...mapState(['urls', 'institutions', 'institution_selection', 'urls_parameters', 'format_selection']),
        institution_found(){
            if (this.institution_selection.name in this.institutions.info_dict){
                return true
            }
            else {
                return false
            }
        },
      },
      methods:{
        ...mapActions(['updateInstitutions', 'updateInstitutionSelection', 'updateDatasetsSelection', 'updateStep']),
        async queryInstitutionsAPI () {
            try {
                var institutions_list = []
                var institutions_info = {}
                const response = await axios.get(this.urls.institutions)
                for (var key in response.data){
                    var name = response.data[key].name
                    institutions_list.push(name)
                    institutions_info[name] = response.data[key]
                }
                institutions_list = [...new Set(institutions_list)];
                institutions_list.sort();
                this.updateInstitutions({'list': institutions_list, 'info': institutions_info})
                if(this.urls_parameters.institution != null){
                    for (const [name, info] of Object.entries(this.institutions.info_dict)){
                        if (info['key'] == this.urls_parameters.institution){
                            this.institution_selection.name = name
                            this.storeInstitution()
                            break;
                        }
                    }
                }
            } catch (e) {
                alert ("failed to load institutions")
            }
        },
        storeInstitution(){
           //this.updateDatasetsSelection([])
           this.updateStep(1)
           if(this.institution_selection.name in this.institutions.info_dict){
                this.updateInstitutionSelection({'key': this.institutions.info_dict[this.institution_selection.name]['key'], 'name': this.institution_selection.name})
            }
            else {
                this.updateInstitutionSelection({'key': null, 'name': null})
            }
        },
        searchOccurrences(format){
            this.$emit('searchOccurrences', format, false)
        }
      },
      mounted(){
        this.queryInstitutionsAPI()
      }
    }

</script>


<style scoped lang="scss">

    .button-container {
        margin-top: 20px;
    }

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
