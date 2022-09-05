<template>

    <div class="container-fluid">

        <BannerComponent title="eBioDiv" subtitle="Linking material citations to specimens" />

        <div class="button-container" v-if="step < 3">
            <ExecuteButton @click="displayOccurrences('specimen_matcit')" button_text="See specimens" :disabled="false" />
            <ExecuteButton @click="displayOccurrences('matcit_specimen')" button_text="See material citations" :disabled="false" />
        </div>

        <div class="row" id="occurrences" v-if="step == 2">
            <OccurrencesList ref="occList" />
        </div>

        <div class="row" id="specimen" v-if="step == 3">
            <CurationList @clicked="reloadOccurrences" />
        </div>

    </div>

</template>

<script>
// @ is an alias to /src
import BannerComponent from '@/components/BannerComponent.vue'
import ExecuteButton from '@/components/ExecuteButton.vue'
import OccurrencesList from '@/components/OccurrencesList.vue'
import CurationList from '@/components/CurationList.vue'
import { mapState, mapActions } from 'vuex'

export default {
    name: 'OccurrenceListPage',
    components: {
        BannerComponent,
        ExecuteButton,
        OccurrencesList,
        CurationList
    },
    computed: {
        ...mapState(['occurrences_selection', 'format_selection', 'step', 'occurrence_keys']),
    },
    methods: {
        ...mapActions(['updateFormatSelection', 'updateStep', 'updateOccurrenceKeys']),
        setStep2() {
            this.updateStep(2)
            /*
              delay call to searchOccurrencesAPI
              because OccurrencesList component is not in the DOM tree after this.updateStep(2)
              because of v-if="step == 2"
            */
            setTimeout(function () {
                this.$refs.occList.searchOccurrencesAPI(true)
            }.bind(this), 0)
        },
        displayOccurrences(format) {
            this.updateFormatSelection(format)
            this.setStep2()
            this.$router.push({ name: 'OccurrenceListPage', query: { occurrenceKeys: this.occurrence_keys, format: format } }).catch(() => { });
        },
        reloadOccurrences() {
            this.displayOccurrences(this.format_selection, true)
        },
    },
    mounted() {
        if (!('occurrenceKeys' in this.$route.query) || this.$route.query.occurrenceKeys.length == 0) {
            this.updateStep(1);
            return;
        }
        const occKeyList = this.$route.query.occurrenceKeys.split(/(\s+)/)
        let format = 'specimen_matcit'
        if ('format' in this.$route.query) {
            format = this.$route.query.format
        }
        this.updateOccurrenceKeys(occKeyList)
        this.updateFormatSelection(format)
        this.setStep2()
    }
}
</script>

<style scoped lang="scss">
.container-fluid {
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