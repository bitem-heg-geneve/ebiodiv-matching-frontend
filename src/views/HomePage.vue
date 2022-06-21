<template>

  <div class="container-fluid">

    <BannerComponent title="eBioDiv" subtitle="Linking material citations to specimens" />

    <div class="row" id="institutions" v-show="step != 3">
        <InstitutionChoice @searchOccurrences=displayOccurrences />
    </div>

    <div class="button-container" v-show="step != 3">
        <ExecuteButton @click="displayOccurrences('specimen_matcit', true)" button_text="See specimens" :disabled="is_disabled"/>
        <ExecuteButton @click="displayOccurrences('matcit_specimen', true)" button_text="See material citations" :disabled="is_disabled" />
    </div>

    <div class="row" id="occurrences"  v-show="step == 2">
        <OccurrencesList ref="occList"/>
    </div>

    <div class="row" id="specimen"  v-if="step == 3">
        <CurationList @clicked="reloadOccurrences"/>
    </div>

  </div>

</template>

<script>
// @ is an alias to /src
import BannerComponent from '@/components/BannerComponent.vue'
import ExecuteButton from '@/components/ExecuteButton.vue'
import InstitutionChoice from '@/components/InstitutionChoice.vue'
import OccurrencesList from '@/components/OccurrencesList.vue'
import CurationList from '@/components/CurationList.vue'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'HomePage',
  components: {
    BannerComponent,
    ExecuteButton,
    InstitutionChoice,
    OccurrencesList,
    CurationList
  },
  computed: {
        ...mapState(['occurrences_selection', 'institution_selection', 'datasets_selection', 'format_selection', 'urls_parameters', 'step']),
        is_disabled(){
            if (this.datasets_selection.length > 0){
                return false
            }
            return true
        }
  },
  methods:{
        ...mapActions(['updateFormatSelection', 'updateOccurrencesSelection', 'updateUrlsParameters', 'updateStep']),
        displayOccurrences(format, reload){
            this.updateFormatSelection(format)
            this.updateStep(2)
            this.$refs.occList.searchOccurrencesAPI(reload)
            this.$router.push({ name: 'HomePage', hash: '#occurrences', query: { institutionKey: this.institution_selection.key, datasetKeys: this.datasets_selection.join(','), format: format }}).catch(()=>{});
        },
        reloadOccurrences(){
            this.displayOccurrences(this.format_selection, true)
        },
        goBack(){
            this.updateStep(1)
        }
  },
  watch: {
            format_selection: function () {
                if (this.format_selection != null){
                    //this.displayOccurrences(this.format_selection)
                }
            },
  },
  mounted() {
        var institution = null
        if ('institutionKey' in this.$route.query && this.$route.query.institutionKey.length > 0){
            institution = this.$route.query.institutionKey
        }

        var datasets = []
        if ('datasetKeys' in this.$route.query && this.$route.query.datasetKeys.length > 0){
            datasets = this.$route.query.datasetKeys
        }

        var format = null
        if ('format' in this.$route.query && this.$route.query.format.length > 0){
            format = this.$route.query.format
        }

        var occurrence = null
        if ('occurrenceKey' in this.$route.query && this.$route.query.occurrenceKey.length > 0){
            occurrence = this.$route.query.occurrenceKey
        }
        this.updateUrlsParameters({'institution': institution, 'occurrence': occurrence, 'datasets': datasets, 'format': format})
      }
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