<template>
  <div class="container-fluid">
    <BannerComponent title="eBioDiv" subtitle="Linking material citations to specimens" />

    <PulseLoader v-if="in_progress" :color="theme_color.main"/>
    <template v-else>
      <div v-if="occurrences_selection">
        <CurationList v-bind:show_back_button="false"/>
      </div>
      <div v-else class="alert alert-warning" role="alert">
        Occurrence {{ occurrenceKey }} not found
      </div>
    </template>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import BannerComponent from '@/components/BannerComponent.vue'
import CurationList from '@/components/CurationList.vue'

var PulseLoader = require('vue-spinner/src/PulseLoader.vue').default;

export default {
  name: 'OccurrencePage',
  components: {
    PulseLoader,
    BannerComponent,
    CurationList,
  },
  data() {
    return {
        in_progress: true,
        occurrenceKey: null,
    }
  },
  computed: {
    ...mapState(['occurrences_selection', 'theme_color']),
  },
  methods:{
    ...mapActions(['updateFormatSelection', 'updateOccurrencesSelection']),
  },
  async mounted() {
    const occurrenceKey = this.$route.params.occurrenceKey;
    this.occurrenceKey = occurrenceKey;
    this.updateFormatSelection("matcit_specimen");
    const response = await this.$backend.fetch_occurrence(occurrenceKey, true);
    const occurrenceWithRelation = this.$backend.processOccurrences(response.data, "specimen_matcit");
    if (occurrenceWithRelation.length != 0) {
      if (occurrenceWithRelation[0].key != occurrenceKey) {
        alert("Internal error");
        return;
      }
      this.updateOccurrencesSelection(occurrenceWithRelation[0]);
    }
    this.in_progress = false;
  },
}
</script>
