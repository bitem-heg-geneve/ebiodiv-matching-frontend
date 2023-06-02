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
    user_query: {
        pre_q: '',
        q: '',
        basisOfRecord: null,
        limit: 20,
        page: 1,
        ranking: "-associatedOccurrences",
        occurrence_key: null,
        occurrences_keys: [],
        facets_selection: {
            'scientificName': [],
            'acceptedScientificName': [],
            'kingdom': [],
            'phylum': [],
            'class': [],
            'family': [],
            'genus': [],
            'specificEpithet': [],
            'infraspecificEpithet': [],
            'taxonRank': [],
            'country': [],
            'stateProvince': [],
            'typeStatus': [],
            'recordedBy': [],
            'institutionCode': [],
            'collectionCode': [],
            'title': [],
            'gbifDoi': [],
            'sourceDoi': [],
            'identifier': [],
            'creator': [],
            'citation': [],
            'author': [],
            'date': [],
            'year': [],
            'journal': [],
            'publisher': [],
            'volume': [],   
            'issue': [],
            'numero': [],
            'firstPage': [],
            'lastPage': [],
            'doi': [],
            'zooBankId': [],          
            'plaziUuid': [],
        },
        facets_visibility: {
            'scientificName': false,
            'acceptedScientificName': false,
            'kingdom': false,
            'phylum': false,
            'class': false,
            'family': false,
            'genus': false,
            'specificEpithet': false,
            'infraspecificEpithet': false,
            'taxonRank': false,
            'country': false,
            'stateProvince': false,
            'typeStatus': false,
            'recordedBy': false,
            'institutionCode': false,
            'collectionCode': false,
            'title': false,
            'gbifDoi': false,
            'sourceDoi': false,
            'identifier': false,
            'creator': false,
            'citation': false,
            'author': false,
            'date': false,
            'year': false,
            'journal': false,
            'publisher': false,
            'volume': false,   
            'issue': false,
            'numero': false,
            'firstPage': false,
            'lastPage': false,
            'doi': false,
            'zooBankId': false,          
            'plaziUuid': false,          
        }
    },
    institutions: {},
    fields: {
        MATERIAL_CITATION: {
            basisOfRecord_occurrence: {
                name: "Material citation",
            },
            basisOfRecord_curation: {
                name: "Specimen",
            }
        },
        PRESERVED_SPECIMEN: {
            basisOfRecord_occurrence: {
                name: "Specimen",

            },
            basisOfRecord_curation: {
                name: "Material citation",
            }
        }
    },
    filters: {
        ranking: [
            {title: 'ID', field:'gbifDoi'},
            {title: 'scientific name', field:'scientificName'},
            //{title: 'date', field:'-year'},
            {title: 'matching number', field:'-associatedOccurrences'}
        ],
        facets: [
            {title: 'Scientific name', field:'scientificName'},
            {title: 'Accepted scientific name', field:'acceptedScientificName'},
            {title: 'Kingdom', field:'kingdom'},
            {title: 'Phylum', field:'phylum'},
            {title: 'Class', field:'class'},
            {title: 'Family', field:'family'},
            {title: 'Genus', field:'genus'},
            {title: 'Specific epithet', field:'specificEpithet'},
            {title: 'Infraspecific epithet', field:'infraspecificEpithet'},
            {title: 'Taxon rank', field:'taxonRank'},
            {title: 'Country', field:'country'},
            {title: 'State province', field:'stateProvince'},
            {title: 'Type status', field:'typeStatus'},
            {title: 'Recorded by', field:'recordedBy'},
            {title: 'Institution code', field:'institutionCode'},
            {title: 'Collection code', field:'collectionCode'},
            {title: 'Title', field:'title'},
            {title: 'Gbif DOI', field:'gbifDoi'},
            {title: 'Source DOI', field:'sourceDoi'},
            {title: 'Identifier', field:'identifier'},
            {title: 'Creator', field:'creator'},
            {title: 'Citation', field:'citation'},
            {title: 'Author', field:'author'},
            //{title: 'Date', field:'date'},
            //{title: 'Year', field:'year'},
            {title: 'Journal', field:'journal'},
            {title: 'Publisher', field:'publisher'},
            //{title: 'Volume', field:'volume'},            
            //{title: 'Issue', field:'issue'},
            //{title: 'Numero', field:'numero'},
            //{title: 'First page', field:'firstPage'},
            //{title: 'Last page', field:'lastPage'},    	
            {title: 'DOI', field:'doi'},
            {title: 'Zoo BankId', field:'zooBankId'},             
            {title: 'Plazi Uuid', field:'plaziUuid'},
        ],
    },
    curation_characteristics: [
        {name: 'Family', score: 'family', value: ['family']},
        {name: 'Genus', score: 'genus', value: ['genus']},
        {name: 'Specific epithet', score: 'specificEpithet', value: ['specificEpithet']},
        {name: 'Coordinates', score: 'decimalLatitude', value: ['decimalLatitude', 'decimalLongitude']},
        {name: 'Elevation', score: 'elevation', value: ['elevation', 'depth']},
        {name: 'Locality', score: 'locality', value: ['locality']},
        {name: 'Country', score: 'country', value: ['country']},
        {name: 'Date', score: 'year', value: ['day', 'month', 'year']},
        {name: 'Institution code', score: 'institutionCode', value: ['institutionCode']},
        {name: 'Collection code', score: 'collectionCode', value: ['collectionCode']},
        {name: 'Catalog nb', score: 'catalogNumber', value: ['catalogNumber']},
        {name: 'Individual nb', score: 'individualCount',  value: ['individualCount']},
        {name: 'Collector (recorded by)', score: 'recordedBy', value: ['recordedBy']},
        {name: 'Type', score: 'typeStatus', value: ['typeStatus']},
        {name: 'Record', score: 'basisOfRecord', value: ['basisOfRecord']},
    ],
    user: {
        name: null,
        orcid: null,
        orcidToken: null,
    }

  },
  mutations: {
    UPDATE_STEP(state, step) {
        state.step = step
    },
    UPDATE_QUERY(state, query) {
        state.user_query.q = query
    },
    UPDATE_PRE_QUERY(state, query) {
        state.user_query.pre_q = query
    },
    UPDATE_BASISOFRECORD(state, basisOfRecord) {
        state.user_query.basisOfRecord = basisOfRecord
    },
    UPDATE_PAGE(state, page) {
        state.user_query.page = page
    },
    UPDATE_OCCURRENCE_KEY(state, occurrence_key) {
        state.user_query.occurrence_key = occurrence_key
    },
    UPDATE_OCCURRENCES_KEYS(state, occurrences_keys) {
        state.user_query.occurrences_keys = occurrences_keys
    },
    UPDATE_RANKING(state, value){
        state.user_query.ranking = value
    },
    UPDATE_FACET_SELECTION(state, value){
        state.user_query.facets_selection[value.facet] = value.list
    },
    RESET_FACETS(state){
        for (const key of Object.keys(state.user_query.facets_selection)) {
            state.user_query.facets_selection[key] = []
        }
    },
    UPDATE_FACET_VISIBILITY(state, value){
        state.user_query.facets_visibility[value.facet] = value.visibility
    },
    UPDATE_INSTITUTIONS(state, value){
        state.institutions = value
    },
    
    // UPDATE_OCCURRENCES_FILTER_DATE(state, value){
    //     state.filters.occurrences.date = value
    // },
    // UPDATE_INIT_MC_DATE_FILTER(state, dates) {
    //     state.filters.occurrences.date = dates
    //     state.user_selection.occurrences.facets.date = dates
    // },   
    UPDATE_USER(state, value) {
        state.user = value
        window.sessionStorage.setItem('user', JSON.stringify(value));
    },
    initialiseStore(state) {
        // this mutation is triggered once when the app starts.
        // see src/main.js
        const userSession = window.sessionStorage.getItem('user');
        if (userSession) {
            state.user = JSON.parse(userSession);
        }
    },
  },
  actions: {
    updateStep(context, value){
        context.commit('UPDATE_STEP', value)
    },
    updateQuery(context, value) {
        context.commit('UPDATE_QUERY', value)
    },
    updatePreQuery(context, value) {
        context.commit('UPDATE_PRE_QUERY', value)
    },
    updateBasisOfRecord(context, value) {
        context.commit('UPDATE_BASISOFRECORD', value)
    },
    updatePage(context, value){
        context.commit('UPDATE_PAGE', value)
    },
    updateOccurrenceKey(context, value) {
        context.commit('UPDATE_OCCURRENCE_KEY', value)
    },
    updateOccurrencesKeys(context, value) {
        context.commit('UPDATE_OCCURRENCES_KEYS', value)
    },
    updateRanking(context, value) {
        context.commit('UPDATE_RANKING', value)
    },
    updateFacetSelection(context, value) {
        context.commit('UPDATE_FACET_SELECTION', value)
    },
    updateFacetVisibility(context, value){
        context.commit('UPDATE_FACET_VISIBILITY', value)
    },
    resetFacets(context){
        context.commit('RESET_FACETS')
    },
    updateInstitutions(context, value){
        context.commit('UPDATE_INSTITUTIONS', value)
    },
    // updateInitMcDateFilter(context, value){
    //    context.commit('UPDATE_INIT_MC_DATE_FILTER', value)
    // },
    updateOrcidUser(context, user) {
        /* an example of user is {name: "John Doe", orcid: "", orcidToken: ""} */
        context.commit('UPDATE_USER', user)
    },
  },
  modules: {
  }
})
