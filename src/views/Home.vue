<template>

  <div class="container-fluid">

    <Banner title="eBioDiv" subtitle="Linking material citations to specimen" />

    <div class="row" id="institutions"  v-if="!material_citation_selection">
        <Institutions />
    </div>

    <div class="row" id="materialcitations"  v-if="!material_citation_selection">
        <MaterialCitations/>
    </div>

    <div class="row" id="specimen"  v-if="material_citation_selection">
        <Specimen/>
    </div>

  </div>

</template>

<script>
// @ is an alias to /src
import Banner from '@/components/Banner.vue'
import Institutions from '@/components/Institutions.vue'
import MaterialCitations from '@/components/MaterialCitations.vue'
import Specimen from '@/components/Specimen.vue'
import { mapState } from 'vuex'

export default {
  name: 'Home',
  components: {
    Banner,
    Institutions,
    MaterialCitations,
    Specimen
  },
  computed: {
        ...mapState(['material_citation_selection']),
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