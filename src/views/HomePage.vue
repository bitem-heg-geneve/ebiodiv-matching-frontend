<template>

  <div class="container-fluid">

    <BannerComponent title="eBioDiv" subtitle="Linking material citations to specimen" />

    <div class="row" id="institutions"  v-if="!material_citation_selection">
        <InstitutionChoice />
    </div>

    <div class="row" id="materialcitations"  v-if="!material_citation_selection">
        <MaterialCitationList/>
    </div>

    <div class="row" id="specimen"  v-if="material_citation_selection">
        <SpecimenList/>
    </div>

  </div>

</template>

<script>
// @ is an alias to /src
import BannerComponent from '@/components/BannerComponent.vue'
import InstitutionChoice from '@/components/InstitutionChoice.vue'
import MaterialCitationList from '@/components/MaterialCitationList.vue'
import SpecimenList from '@/components/SpecimenList.vue'
import { mapState } from 'vuex'

export default {
  name: 'HomePage',
  components: {
    BannerComponent,
    InstitutionChoice,
    MaterialCitationList,
    SpecimenList
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