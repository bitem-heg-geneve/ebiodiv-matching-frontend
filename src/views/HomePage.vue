<template>

  <div class="container-fluid">

    <BannerComponent title="eBioDiv Matching Service" subtitle="Linking material citations to specimens" />

    <div class="row" v-if="landing">
        <div class="info-container">
            <span class="close-button" @click="removeInfo()">x </span>
            <p>Are you new to the matching service? Then <a href="https://ebiodiv.org/help/" target="_blank">click here</a> !</p>
        </div>
    </div>

    <div class="row"  v-show="step == 2" ref="step2">
        <OccurrencesList ref="occurrencesList"/>
    </div>

    <div class="row"  v-show="step == 3">
        <CurationList ref="curationList" @back="reloadOccurrences"/>
    </div>

  </div>

</template>

<script>
// @ is an alias to /src
import BannerComponent from '@/components/BannerComponent.vue'
import OccurrencesList from '@/components/OccurrencesList.vue'
import CurationList from '@/components/CurationList.vue'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'HomePage',
  components: {
    BannerComponent,
    OccurrencesList,
    CurationList
  },
  computed: {
        ...mapState([
            'user_query', 
            'step',
            'landing'
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
            'updateInstitutions',
            'updateLanding'
        ]),
        runSearchFromURL(){
            if(this.user_query.occurrence_key == null){
                this.displayOccurrences(this.user_query.basisOfRecord, this.user_query.page)
            }
            else if (this.user_query.occurrence_key != null){
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
            this.updateStep(2)
            
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
            if (basisOfRecord != null){
                this.updateBasisOfRecord(basisOfRecord)
            }

            var page = 1
            if ('page' in this.$route.query && this.$route.query.page.length > 0){
                page = parseInt(this.$route.query.page)
            }
            this.updatePage(page)

            var ranking = 'scientificName'
            if ('ranking' in this.$route.query && this.$route.query.ranking.length > 0){
                ranking = this.$route.query.ranking
            }
            this.updateRanking(ranking)

            for (const name of Object.keys(this.user_query.facets_selection)) {
                if (name in this.$route.query && this.$route.query[name].length > 0){
                    var values = this.$route.query[name].split("|")
                    // TODO: year
                    if (name == "year"){
                        values = values.map(str => {
                            return parseInt(str, 10);
                        });
                        this.updateFacetSelection(Object.freeze({'facet': name, 'list': values }))
                    }
                    else {
                        this.updateFacetSelection(Object.freeze({'facet': name, 'list': values }))
                    }
                }
            }

            var occurrence_key = null
            if ('occurrenceKey' in this.$route.query && this.$route.query.occurrenceKey.length > 0){
                occurrence_key = this.$route.query.occurrenceKey
            }
            this.updateOccurrenceKey(occurrence_key)

            var occurrences_keys = []
            if ('occurrencesKeys' in this.$route.query && this.$route.query.occurrencesKeys.length > 0){
                occurrences_keys = this.$route.query.occurrencesKeys.split(",")
            }
            this.updateOccurrencesKeys(occurrences_keys)

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
        },
        removeInfo(){
            this.updateLanding(false)
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
            setTimeout(() => this.updateLanding(false), 600000)
        }
}
</script>

<style scoped lang="scss">

.info-container {
    position: relative
}

.container-fluid{
    padding-right: 0px;
    padding-left: 0px;
    margin-right: auto;
    margin-left: auto;
}

.row {
    padding: 20px;
    margin-left: 0;
    margin-right: 0;
}

.close-button {
    font-size: 20px;
    position: absolute;
    color: #fff;
    top: 5px;
    right: 5px;
}
.close-button:hover {
    cursor: pointer
}

</style>