import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    theme_color: {
        main: "#70AD47",
        secondary: "#008F00",
    },
    urls: {
        institutions: "https://candy.text-analytics.ch/ebiodiv/matching/api/v1/browse/institutions",
        occurrences: "https://candy.text-analytics.ch/ebiodiv/matching/api/v1/data/",
        material_citations_status: "https://candy.text-analytics.ch/ebiodiv/matching/api/v1/matching/materialcitation/",
        institution_status: "https://candy.text-analytics.ch/ebiodiv/matching/api/v1/matching/data/",
    },
    urls_parameters: {
        institution: null,
        format: null,
        occurrence: null
    },
    institutions: {
        list: [],
        keys_dict: {},
        info_dict: {}
    },
    institution_selection: {
        key: null,
        name: null,
    },
    occurrences: [],
    occurrences_selection: null,
    format_selection: "matcit_specimen",
    matching: null,
    fields: {
        matcit_specimen: {
            format_occurrence: {
                name: "Material citation",
                json: "materialCitationOccurrence",
            },
            format_curation: {
                name: "Specimen",
                json: "institutionOccurrences",
            }
        },
        specimen_matcit: {
            format_occurrence: {
                name: "Specimen",
                json: "institutionOccurrence",

            },
            format_curation: {
                name: "Material citation",
                json: "materialCitationOccurrences",
            }
        }
    },
    user_selection: {
        occurrences: {
             facets: {
                status: [],
                collectionCode: [],
                kingdom: [],
                phylum: [],
                class: [],
                order: [],
                family: [],
                genus: [],
                species: [],
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
                {title: 'Curation status', short: 'status', multi: true},
                {title: 'Collection code', short: 'collectionCode', multi: true},
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
        {name: 'Score', short: '$mean', value: false},
        {name: 'Family', short: 'family', value: true},
        {name: 'Genus', short: 'genus', value: true},
        {name: 'Specific epithet', short: 'specificEpithet', value: true},
        {name: 'Latitude', short: 'decimalLatitude', value: true},
        {name: 'Longitude', short: 'decimalLongitude', value: true},
        {name: 'Elevation', short: 'elevation', value: true},
        {name: 'Locality', short: 'locality', value: true},
        {name: 'Country', short: 'country', value: true},
        {name: 'Month', short: 'month', value: true},
        {name: 'Year', short: 'year', value: true},
        {name: 'Coll code', short: 'collectionCode', value: true},
        {name: 'Catalog nb', short: 'catalogNumber', value: true},
        {name: 'Individual nb', short: 'individualCount',  value: true},
        {name: 'Collector (recorded by)', short: 'recordedBy', value: true},
    ]
  },
  mutations: {
    UPDATE_INSTITUTIONS_LIST(state, institution_list) {
        state.institutions.list = institution_list
    },
    UPDATE_INSTITUTIONS_KEYS(state, institution_keys) {
        state.institutions.keys_dict = institution_keys
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
    UPDATE_OCCURRENCES(state, occurrences) {
        state.occurrences = occurrences
    },
    UPDATE_OCCURRENCES_SELECTION(state, occurrences_selection) {
        state.occurrences_selection = occurrences_selection
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
  },
  actions: {
    updateInstitutions(context, value) {
        context.commit('UPDATE_INSTITUTIONS_LIST', value.list)
        context.commit('UPDATE_INSTITUTIONS_KEYS', value.keys)
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
    updateOccurrences(context, value) {
        context.commit('UPDATE_OCCURRENCES', value)
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
    }
  },
  modules: {
  }
})
