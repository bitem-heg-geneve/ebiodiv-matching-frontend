import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    theme_color: {
        main: "#70AD47",
        secondary: "#008F00",
    },
    landing: true,
    step: 2,
    user_query: {
        pre_q: '',
        q: '',
        basisOfRecord: "PRESERVED_SPECIMEN",
        limit: 20,
        page: 1,
        ranking: "scientificName",
        occurrence_key: null,
        occurrences_keys: [],
        facets_selection: {
            'eventYear': [],
            'year': [],
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
            'institutionName': [],
            'datasetTitle': [],
            'collectionCode': [],
            'title': [],
            'gbifDoi': [],
            'sourceDoi': [],
            'identifier': [],
            'creator': [],
            'citation': [],
            'author': [],
            'date': [],
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
            'hasRelationWithStatus': []
        },
        facets_visibility: {
            'eventYear': false,
            'year': false,
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
            'institutionName': false,
            'datasetTitle': false,
            'collectionCode': false,
            'title': false,
            'gbifDoi': false,
            'sourceDoi': false,
            'identifier': false,
            'creator': false,
            'citation': false,
            'author': false,
            'date': false,
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
            'hasRelationWithStatus': false,        
        }
    },
    comment: {
        selection: null,
        saved: null
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
        },
    },
    filters: {
        ranking: [
            {title: 'identifier', field:'gbifDoi'},
            {title: 'scientific name', field:'scientificName'},
            {title: 'matching number', field:'-associatedOccurrences'},
        ],
        facets: [
            {title: 'Status code', field:'hasRelationWithStatus'},
            {title: 'Collection date', field:'eventYear'},
            {title: 'Publication date', field:'year'},
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
            {title: 'Institution name', field:'institutionName'},
            {title: 'Dataset title', field:'datasetTitle'},
            {title: 'Collection code', field:'collectionCode'},
            {title: 'Title', field:'title'},
            {title: 'Gbif DOI', field:'gbifDoi'},
            {title: 'Source DOI', field:'sourceDoi'},
            {title: 'Identifier', field:'identifier'},
            {title: 'Creator', field:'creator'},
            {title: 'Citation', field:'citation'},
            {title: 'Author', field:'author'},
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
    occurrence_characteristics: [
        {title: 'Scientific name', field: 'occurrence.scientificName', selection: true, sortable: true},
        {title: 'Type', field: 'occurrence.typeStatus', selection: true, sortable: true},
        {title: 'Record', field: 'occurrence.basisOfRecord', selection: true, sortable: false},
        {title: 'Publication year', field: 'occurrence.year', selection: true, sortable: false},
        {title: 'Collection date', field: 'occurrence.eventDate', selection: true, sortable: true},
        {title: 'nb', field: 'relation_count', selection: true, sortable: false},
        {title: 'Verbatim label', field: 'occurrence.verbatimLabel', selection: false, sortable: false},
        {title: 'Kingdom', field: 'occurrence.kingdom', selection: false, sortable: true},
        {title: 'Phylum', field: 'occurrence.phylum', selection: false, sortable: true},
        {title: 'Order', field: 'occurrence.order', selection: false, sortable: true},
        {title: 'Family', field: 'occurrence.family', selection: false, sortable: true},
        {title: 'Genus', field: 'occurrence.genus', selection: false, sortable: true},
        {title: 'Species', field: 'occurrence.species', selection: false, sortable: false},
        {title: 'Specific epithet', field: 'occurrence.specificEpithet', selection: false, sortable: true},
        {title: 'Taxon rank', field: 'occurrence.taxonRank', selection: false, sortable: true},
        {title: 'Country', field: 'occurrence.country', selection: false, sortable: true},
        {title: 'Locality', field: 'occurrence.locality', selection: false, sortable: false},
        {title: 'Institution code', field: 'occurrence.institutionCode', selection: false, sortable: true},
        {title: 'Collection code', field: 'occurrence.collectionCode', selection: false, sortable: true},
        {title: 'Recorded by', field: 'occurrence.recordedBy', selection: false, sortable: true},
        {title: 'Undecidable', field: 'occurrence.occurrenceRelationSummary.UDCB', selection: false, sortable: false},
        {title: 'Pending', field: 'occurrence.occurrenceRelationSummary.PNDG', selection: false, sortable: false},
        {title: 'Done', field: 'occurrence.occurrenceRelationSummary.DONE', selection: false, sortable: false},
        {title: 'Done (YES)', field: 'occurrence.occurrenceRelationSummary.DONE_YES', selection: false, sortable: false},
        {title: 'Done (NO)', field: 'occurrence.occurrenceRelationSummary.DONE_NO', selection: false, sortable: false},
        {title: 'Comments', field: 'comment_count', selection: false, sortable: false},
    ],
    curation_characteristics: [
        {name: 'Family', score: 'family', value: ['family']},
        {name: 'Genus', score: 'genus', value: ['genus']},
        {name: 'Specific epithet', score: 'specificEpithet', value: ['specificEpithet']},
        {name: 'Infraspecific epithet', score: 'infraspecificEpithet', value: ['infraspecificEpithet']},
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
    UPDATE_LANDING(state) {
        state.landing = false
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
    UPDATE_COMMENT_SELECTION(state, value){
        state.comment.selection = value
    },
    UPDATE_COMMENT_SAVED(state, value){
        state.comment.saved = value
    },
    UPDATE_OCCURRENCE_CHARACTERISTICS(state, value){
        state.occurrence_characteristics = value
    },
    UPDATE_INSTITUTIONS(state, value){
        state.institutions = value
    },
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
    updateLanding(context){
        context.commit('UPDATE_LANDING')
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
    updateCommentSelection(context, value){
        context.commit('UPDATE_COMMENT_SELECTION', value)
    },
    updateCommentSaved(context, value){
        context.commit('UPDATE_COMMENT_SAVED', value)
    },
    updateOccurrenceCharacteristics(context, value){
        context.commit('UPDATE_OCCURRENCE_CHARACTERISTICS', value)
    },
    resetFacets(context){
        context.commit('RESET_FACETS')
    },
    updateInstitutions(context, value){
        context.commit('UPDATE_INSTITUTIONS', value)
    },
    updateOrcidUser(context, user) {
        /* an example of user is {name: "John Doe", orcid: "", orcidToken: ""} */
        context.commit('UPDATE_USER', user)
    },
  },
  modules: {
  }
})
