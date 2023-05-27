<template>

  <div class="container-fluid">

    <BannerComponent title="eBioDiv Matching Service" subtitle="Linking material citations to specimens" />

    <div class="row" id="query" v-show="step != 3">
        <QueryChoice />
    </div>

    <div class="button-container" v-show="step != 3">
        <ExecuteButton @click="runSearchFromButton('PRESERVED_SPECIMEN', 1)" button_text="See specimens" :disabled="is_disabled"/>
        <ExecuteButton @click="runSearchFromButton('MATERIAL_CITATION', 1)" button_text="See material citations" :disabled="is_disabled" />
    </div>

    <div class="row"  v-show="step == 1 && user_query.basisOfRecord == null">
        <div class="info-container">
            <p>Are you new to the matching service? Then <a href="https://ebiodiv.org/help/" target="_blank">click here</a> !</p>
        </div>
    </div>

    <div class="row" id="occurrences"  v-show="step == 2">
        <OccurrencesList ref="occurrencesList"/>
    </div>

    <div class="row" id="specimen"  v-show="step == 3">
        <CurationList ref="curationList" @back="reloadOccurrences"/>
    </div>

  </div>

</template>

<script>
// @ is an alias to /src
import BannerComponent from '@/components/BannerComponent.vue'
import ExecuteButton from '@/components/ExecuteButton.vue'
import QueryChoice from '@/components/QueryChoice.vue'
import OccurrencesList from '@/components/OccurrencesList.vue'
import CurationList from '@/components/CurationList.vue'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'HomePage',
  components: {
    BannerComponent,
    ExecuteButton,
    QueryChoice,
    OccurrencesList,
    CurationList
  },
  computed: {
        ...mapState([
            'user_query', 
            'step'
        ]),
        is_disabled(){
            if (this.user_query.pre_q.length > 0){
                return false
            }
            return true
        }
  },
  methods:{
        ...mapActions([
            'updatePreQuery', 
            'updateQuery', 
            'updateBasisOfRecord', 
            'updatePage', 
            'updateRanking', 
            'updateFacetSelection', 
            'updateOccurrenceKey',  
            'updateOccurrencesKeys',  
            'updateStep', 
            'resetFacets',
            'updateInstitutions'
        ]),
        runSearchFromButton(basisOfRecord, page){
            this.resetFacets()
            this.displayOccurrences(basisOfRecord, page)
        },
        runSearchFromURL(){
            if(this.user_query.pre_q != ""  && this.user_query.basisOfRecord != null && this.user_query.occurrence_key == null){
                this.displayOccurrences(this.user_query.basisOfRecord, this.user_query.page)
            }
            else if (this.user_query.occurrences_keys.length > 0  && this.user_query.basisOfRecord != null && this.user_query.occurrence_key == null){
                this.displayOccurrences(this.user_query.basisOfRecord, this.user_query.page)
            }
            else if(this.user_query.occurrence_key != null){
                this.displayCuration()
            }
        },
        displayOccurrences(basisOfRecord, page){
            this.updateBasisOfRecord(basisOfRecord)
            this.updatePage(page)
            this.updateStep(2)
            this.updateQuery(this.user_query.pre_q)
            this.$refs.occurrencesList.searchOccurrencesAPI()
            this.$gtag.event('displayOccurrences_' + basisOfRecord, {
                q: this.user_query.q,
                page: this.user_query.page,
                occurrencesKeys: this.user_query.occurrences_keys
            });
        },
        reloadOccurrences(){
            var prev_occurrence = this.user_query.occurrence_key
            this.updateStep(2)
            this.updateOccurrenceKey(null)
            this.updateQuery(this.user_query.pre_q)
            this.$refs.occurrencesList.searchOccurrencesAPI(prev_occurrence)
        },
        displayCuration(){
            this.updateStep(3)
            this.$refs.curationList.searchCurationAPI()
            this.$gtag.event('displayOccurrence', {
                occurrence: this.user_query.occurrence_key
            });
        },
        
        loadParametersFromURL(){

            this.updateStep(1)

            var q = ''
            if ('q' in this.$route.query && this.$route.query.q.length > 0){
                q = this.$route.query.q
            }
            this.updatePreQuery(q)
            this.updateQuery(q)

            var basisOfRecord = null
            if ('basisOfRecord' in this.$route.query && this.$route.query.basisOfRecord.length > 0){
                basisOfRecord = this.$route.query.basisOfRecord
                if (basisOfRecord != "PRESERVED_SPECIMEN" && basisOfRecord != "MATERIAL_CITATION"){
                    basisOfRecord = null
                }
            }
            this.updateBasisOfRecord(basisOfRecord)

            var page = 1
            if ('page' in this.$route.query && this.$route.query.page.length > 0){
                page = parseInt(this.$route.query.page)
            }
            this.updatePage(page)

            var ranking = '-associatedOccurrences'
            if ('ranking' in this.$route.query && this.$route.query.ranking.length > 0){
                ranking = this.$route.query.ranking
            }
            this.updateRanking(ranking)

            this.resetFacets()
            for (const name of Object.keys(this.user_query.facets_selection)) {
                if (name in this.$route.query && this.$route.query[name].length > 0){
                    var values = this.$route.query[name].split("|")
                    this.updateFacetSelection(Object.freeze({'facet': name, 'list': values }))
                }
            }

            var occurrence_key = null
            if ('occurrenceKey' in this.$route.query && this.$route.query.occurrenceKey.length > 0){
                occurrence_key = this.$route.query.occurrenceKey
            }
            this.updateOccurrenceKey(occurrence_key)

            var occurrences_keys = []
            if ('occurrencesKeys' in this.$route.query && this.$route.query.occurrencesKeys.length > 0){
                occurrences_keys = this.$route.query.occurrencesKeys.split("|")
            }
            this.updateOccurrencesKeys(occurrences_keys)

        },
        handlePopstate() {
            this.loadParametersFromURL()
            this.runSearchFromURL()
        },
        loadInstitutions() {
            let response_promise = this.$backend.fetch_institutions()
            var institution_list = {}
            response_promise.then(response => {
                for (var i=0; i<response.data.length; i++){
                    var key = response.data[i].key
                    institution_list[key] = response.data[i].name
                }
                this.updateInstitutions(institution_list)
            })
            .catch(error => {
                console.log(error)
            })
        }
    },
    beforeMount() {
        this.loadParametersFromURL()
        this.loadInstitutions()
    },
    mounted(){
        this.runSearchFromURL()
    },
    created() {
        window.addEventListener('popstate', this.handlePopstate);
    },
    beforeDestroy() {
        window.removeEventListener('popstate', this.handlePopstate);
    },
}
</script>

<style scoped lang="scss">

    .container-fluid{
        padding-right: 0px;
        padding-left: 0px;
        margin-right: auto;
        margin-left: auto;
    }

    .row {
        padding: 50px;
        margin-left: 0;
        margin-right: 0;
    }

</style>