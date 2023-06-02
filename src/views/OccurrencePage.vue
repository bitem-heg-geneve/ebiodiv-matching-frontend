<template>
  <div class="container-fluid">
    <BannerComponent title="eBioDiv" subtitle="Linking material citations to specimens" />
    <div v-if="user_query.occurrence_key">
      <CurationList ref="curation" v-bind:show_back_button="false"/>
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
    CurationList,
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapState(['user_query', 'theme_color']),
  },
  methods:{
    ...mapActions(['updateBasisOfRecord', 'updateOccurrenceKey', 'updateStep']),
  },
  async mounted() {
    const occurrenceKey = this.$route.params.occurrenceKey;
    this.updateBasisOfRecord("PRESERVED_SPECIMEN");
    this.updateOccurrenceKey(occurrenceKey);
    this.updateStep(3);
    this.curation.searchCurationAPI();
  },
}
</script>
