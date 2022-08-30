import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    theme_color: {
        main: "#70AD47",
        secondary: "#008F00",
    },
    step: 1,
    urls_parameters: {
        institution: null,
        format: null,
        occurrence: null,
        datasets: [],
    },
    institutions: {
        list: [],
        info_dict: {}
    },
    institution_selection: {
        key: null,
        name: null,
    },
    datasets: [],
    datasets_selection: [],
    occurrences_selection: null,
    occurrence_keys: null,
    format_selection: null,
    matching: null,
    fields: {
        matcit_specimen: {
            format_occurrence: {
                name: "Material citation",
            },
            format_curation: {
                name: "Specimen",
            }
        },
        specimen_matcit: {
            format_occurrence: {
                name: "Specimen",

            },
            format_curation: {
                name: "Material citation",
            }
        }
    },
    user_selection: {
        occurrences: {
             facets: {
                status: [],
                datasetName: [],
                country: [],
                collectionCode: [],
                recordedBy: [],
                kingdom: [],
                phylum: [],
                class: [],
                order: [],
                family: [],
                genus: [],
                species: [],
                typeStatus: [],
                date: [0, 2022],
            },
            sort: 'ID',
        },
        curation: {
             facets: {
            },
            sort: 'ID',
        }
    },
    filters: {
        occurrences: {
            sort: ['ID', 'scientific name', 'date', 'matching number'],
            facets: [
                {title: 'Date', short: 'date', multi: false},
                {title: 'Dataset', short: 'datasetName', multi: true},
                {title: 'Curation status', short: 'status', multi: true},
                {title: 'Country', short: 'country', multi: true},
                {title: 'Collection code', short: 'collectionCode', multi: true},
                {title: 'Collector', short: 'recordedBy', multi: true},
                {title: 'Type', short: 'typeStatus', multi: true},
                {title: 'Kingdom', short: 'kingdom', multi: true},
                {title: 'Phylum', short: 'phylum', multi: true},
                {title: 'Class', short: 'class', multi: true},
                {title: 'Order', short: 'order', multi: true},
                {title: 'Family', short: 'family', multi: true},
                {title: 'Genus', short: 'genus', multi: true},
                {title: 'Species', short: 'species', multi: true},
            ],
            date: [0, 2022]
        }
    },
    curation_characteristics: [
        {name: 'Family', score: 'family', value: ['family']},
        {name: 'Genus', score: 'genus', value: ['genus']},
        {name: 'Specific epithet', score: 'specificEpithet', value: ['specificEpithet']},
        {name: 'Latitude/Longitude', score: 'decimalLatitude', value: ['decimalLatitude', 'decimalLongitude']},
        {name: 'Elevation', score: 'elevation', value: ['elevation', 'depth']},
        {name: 'Locality', score: 'locality', value: ['locality']},
        {name: 'Country', score: 'country', value: ['country']},
        {name: 'Date', score: 'year', value: ['day', 'month', 'year']},
        {name: 'Coll code', score: 'collectionCode', value: ['collectionCode']},
        {name: 'Catalog nb', score: 'catalogNumber', value: ['catalogNumber']},
        {name: 'Individual nb', score: 'individualCount',  value: ['individualCount']},
        {name: 'Collector (recorded by)', score: 'recordedBy', value: ['recordedBy']},
        {name: 'Type', score: 'typeStatus', value: ['typeStatus']},
        {name: 'Record', score: 'basisOfRecord', value: ['basisOfRecord']},
    ]
  },
  mutations: {
    UPDATE_INSTITUTIONS_LIST(state, institution_list) {
        state.institutions.list = institution_list
    },
    UPDATE_INSTITUTIONS_INFO(state, institution_info) {
        state.institutions.info_dict = institution_info
    },
    UPDATE_INSTITUTION_SELECTION_KEY(state, institution_key) {
        state.institution_selection.key = institution_key
   },
    UPDATE_INSTITUTION_SELECTION_NAME(state, institution_name) {
        state.institution_selection.name = institution_name
    },
    UPDATE_FORMAT_SELECTION(state, modality) {
        state.format_selection = modality
    },
    UPDATE_DATASETS(state, datasets) {
        state.datasets = datasets
    },
    UPDATE_DATASETS_SELECTION(state, datasets_selection) {
        state.datasets_selection = datasets_selection
    },
    UPDATE_OCCURRENCES_SELECTION(state, occurrences_selection) {
        state.occurrences_selection = occurrences_selection
    },
    UPDATE_OCCURRENCES_KEYS(state, occurrence_keys) {
        state.occurrence_keys = occurrence_keys
    },
    UPDATE_OCCURRENCES_SORT(state, value){
        state.user_selection.occurrences.sort = value
    },
    UPDATE_OCCURRENCES_FACET(state, value){
        state.user_selection.occurrences.facets[value.facet] = value.list
    },
    UPDATE_OCCURRENCES_FILTER_DATE(state, value){
        state.filters.occurrences.date = value
    },
    UPDATE_MATCHING(state, matching) {
        state.matching = matching
    },
    UPDATE_INIT_MC_DATE_FILTER(state, dates) {
        state.filters.occurrences.date = dates
        state.user_selection.occurrences.facets.date = dates
    },
    UPDATE_URLS_PARAMETERS(state, params) {
        state.urls_parameters = params
    },
    UPDATE_STEP(state, value) {
        state.step = value
    },
  },
  actions: {
    updateInstitutions(context, value) {
        context.commit('UPDATE_INSTITUTIONS_LIST', value.list)
        context.commit('UPDATE_INSTITUTIONS_INFO', value.info)
    },
    updateInstitutionSelection(context, value) {
        context.commit('UPDATE_INSTITUTION_SELECTION_KEY', value.key)
        context.commit('UPDATE_INSTITUTION_SELECTION_NAME', value.name)
   },
    updateFormatSelection(context, value) {
        context.commit('UPDATE_FORMAT_SELECTION', value)
    },
    updateOccurrencesSelection(context, value) {
        context.commit('UPDATE_OCCURRENCES_SELECTION', value)
    },
    updateDatasetsSelection(context, value) {
        context.commit('UPDATE_DATASETS_SELECTION', value)
    },
    updateOccurrenceKeys(context, value) {
        context.commit('UPDATE_OCCURRENCES_KEYS', value)
    },
    updateDatasets(context, value) {
        context.commit('UPDATE_DATASETS', value)
    },
    updateOccurrencesSort(context, value) {
        context.commit('UPDATE_OCCURRENCES_SORT', value)
    },
    updateOccurrencesFacet(context, value) {
        context.commit('UPDATE_OCCURRENCES_FACET', value)
    },
    updateMatching(context, value) {
       context.commit('UPDATE_MATCHING', value)
    },
    updateInitMcDateFilter(context, value){
       context.commit('UPDATE_INIT_MC_DATE_FILTER', value)
    },
    updateUrlsParameters(context, value){
        context.commit('UPDATE_URLS_PARAMETERS', value)
    },
    updateStep(context, value){
        context.commit('UPDATE_STEP', value)
    },
  },
  modules: {
  }
})
