<template>

  <div class="container-fluid">

    <BannerComponent title="eBioDiv" subtitle="Linking material citations to specimens" />

    <div class="row" id="institutions"  v-if="!occurrences_selection">
        <InstitutionChoice />
    </div>

    <div class="row" id="occurrences"  v-if="!occurrences_selection">
        <OccurrencesList/>
    </div>

    <div class="row" id="specimen"  v-if="occurrences_selection">
        <CurationList/>
    </div>

  </div>

</template>

<script>
// @ is an alias to /src
import BannerComponent from '@/components/BannerComponent.vue'
import InstitutionChoice from '@/components/InstitutionChoice.vue'
import OccurrencesList from '@/components/OccurrencesList.vue'
import CurationList from '@/components/CurationList.vue'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'HomePage',
  components: {
    BannerComponent,
    InstitutionChoice,
    OccurrencesList,
    CurationList
  },
  computed: {
        ...mapState(['occurrences_selection', 'institution_selection', 'urls_parameters']),
  },
  methods:{
        ...mapActions(['updateFormatSelection', 'updateOccurrencesSelection', 'updateUrlsParameters']),
  },
  mounted() {
        var institution = null
        if ('institution' in this.$route.query && this.$route.query.institution.length > 0){
            institution = this.$route.query.institution
        }

        if ('format' in this.$route.query && this.$route.query.format.length > 0){
            this.updateFormatSelection(this.$route.query.format)
        }

        var occurrence
        if ('occurrence' in this.$route.query && this.$route.query.occurrence.length > 0){
            occurrence = this.$route.query.occurrence
        }
        this.updateUrlsParameters({'institution': institution, 'occurrence': occurrence})
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