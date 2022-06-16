<template>
  <div class="container-fluid">
    <BannerComponent title="eBioDiv" subtitle="Linking material citations to specimens" />
    <div v-if="occurrences_selection">
      <CurationList />
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import BannerComponent from '@/components/BannerComponent.vue'
import CurationList from '@/components/CurationList.vue'

export default {
  name: 'OccurrencePage',
  components: {
    BannerComponent,
    CurationList
  },
  computed: {
    ...mapState(['occurrences_selection']),
  },
  methods:{
    ...mapActions(['updateFormatSelection', 'updateOccurrencesSelection']),
  },
  async mounted() {
    const occurrenceKey = this.$route.params.occurrenceKey;
    this.updateFormatSelection("matcit_specimen");
    const response = await this.$backend.fetch_occurrence(occurrenceKey, true);
    const occurrenceWithRelation = this.$backend.processOccurrences(response.data, "specimen_matcit");
    if (occurrenceWithRelation[0].key != occurrenceKey) {
      alert("Internal error")
      return;
    }
    this.updateOccurrencesSelection(occurrenceWithRelation[0]);
  },
}
</script>
