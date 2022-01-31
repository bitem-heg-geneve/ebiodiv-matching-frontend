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
        material_citations: "https://candy.text-analytics.ch/ebiodiv/matching/api/v1/data/",
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
    material_citations: [],
    material_citation_selection: null,
    user_selection: {
        material_citations: {
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
            sort: 'material citation ID',
        },
        specimens: {
             facets: {
            },
            sort: 'material citation ID',
        }
    },
    filters: {
        material_citations: {
            sort: ['material citation ID', 'scientific name', 'date', 'specimen number'],
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
    specimen_characteristics: [
        {name: 'Score', short: '$mean', value: false},
        {name: 'Family', short: 'family', value: true},
        {name: 'Genus', short: 'genus', value: true},
        {name: 'Specific epithet', short: 'specificEpithet', value: true},
        {name: 'Latitude', short: 'decimalLatitude', value: true},
        {name: 'Longitude', short: 'decimalLongitude', value: true},
        {name: 'Elevation', short: 'elevation', value: true},
        {name: 'Country', short: 'country', value: true},
        {name: 'Month', short: 'month', value: true},
        {name: 'Year', short: 'year', value: true},
        {name: 'Coll code', short: 'collectionCode', value: true},
        {name: 'Catalog nb', short: 'catalogNumber', value: true},
        {name: 'Individual nb', short: 'individualCount',  value: true},
        {name: 'Recorded by', short: 'recordedBy', value: true},
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
    UPDATE_MATERIAL_CITATIONS(state, material_citations) {
        state.material_citations = material_citations
    },
    UPDATE_MATERIAL_CITATION_SELECTION(state, material_citation_selection) {
        state.material_citation_selection = material_citation_selection
    },
    UPDATE_MATERIAL_CITATIONS_SORT(state, value){
        state.user_selection.material_citations.sort = value
    },
    UPDATE_MATERIAL_CITATIONS_FACET(state, value){
        state.user_selection.material_citations.facets[value.facet] = value.list
    },
    UPDATE_MATERIAL_CITATIONS_FILTER_DATE(state, value){
        state.filters.material_citations.date = value
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
    updateMaterialCitationSelection(context, value) {
        context.commit('UPDATE_MATERIAL_CITATION_SELECTION', value)
    },
    updateMaterialCitations(context, value) {
        context.commit('UPDATE_MATERIAL_CITATIONS', value)
    },
    updateMaterialCitationsSort(context, value) {
        context.commit('UPDATE_MATERIAL_CITATIONS_SORT', value)
    },
    updateMaterialCitationsFacet(context, value) {
        context.commit('UPDATE_MATERIAL_CITATIONS_FACET', value)
    },
  },
  modules: {
  }
})
