import axios from 'axios';

export default new class Backend {

    constructor() {
        this.urls = null;
    }

    fetch_urls() {
        return new Promise((resolve, reject) => {
            if (this.urls !== null) {
                resolve();
                return
            }
            axios
                .get('/backend.json')
                .then((response) => {
                    this.urls = response.data;
                    resolve();
                })
                .catch(error => {
                    reject(error)
                })
        })
    }

    async axios_get(url) {
        return await axios.get(url, { validateStatus: (status) => { return status == 200 } })
    }

    async fetch_institutions() {
        await this.fetch_urls()
        return await this.axios_get(this.urls.institutions)
    }

    async fetch_datasets(institution_key) {
        await this.fetch_urls()
        var url = this.urls.datasets + "?institutionKey=" + institution_key
        return await this.axios_get(url)
    }

    async fetch_occurrence(occurenceKey, fetch_missing) {
        // return one GBIF occurrence
        await this.fetch_urls()
        var url = this.urls.occurrences + "?occurrenceKeys=" + occurenceKey
        if (fetch_missing) {
            url = url + "&fetchMissing=true"
        }
        return await this.axios_get(url)
    }

    async fetch_occurrences_from_datasets(institution_key, datasets_selection) {
        await this.fetch_urls()
        var url = this.urls.occurrences + "?institutionKey=" + institution_key + "&datasetKey=" + datasets_selection.join("+")
        return await this.axios_get(url)
    }

    async post_matching(data) {
        await this.fetch_urls()
        return await axios.post(this.urls.matching, data)
    }

    processOccurrences(json, format_selection) {
        const subjectOccs = {}
        const subjectStatus = {}
        const subjectOccurrenceKeysSet = new Set(json.subjectOccurrenceKeys)
        for (const relation of json.occurrenceRelations){
            // guess occurrenceKey1 is the subjectKey
            let subjectKey = relation.occurrenceKey1;
            let relatedKey = relation.occurrenceKey2;
            // swap subjectKey and relatedKey if the guess is wrong
            if (
                   ((format_selection === "specimen_matcit") && (!subjectOccurrenceKeysSet.has(subjectKey)))
                || ((format_selection === "matcit_specimen") && (subjectOccurrenceKeysSet.has(subjectKey)))
            ) {
                [subjectKey, relatedKey] = [relatedKey, subjectKey];
            }
            // now subjectKey and relatedKey are set:
            // * subjectKey is a material citation if format_selection === "matcit_specimen"
            // * subjectKey is a specimen if format_selection === "specimen_matcit"

            // add the subject occurrence if not already the case
            if (subjectOccs[subjectKey] == null) {
                subjectOccs[subjectKey] = json.occurrences[subjectKey];
                subjectOccs[subjectKey].key = subjectKey;
                subjectOccs[subjectKey].relations = []
                subjectStatus[subjectKey] = {
                    done: [],
                    not_done: [],
                }
            }

            // add the related occurrence
            const new_relation = {
                object: json.occurrences[relatedKey],
                matching: {
                    match: relation.decision,
                }
            };
            new_relation.object.key = relatedKey;
            subjectOccs[subjectKey].relations.push(new_relation);

            // update subjectStatus: add the related occurrence either to done or not_done 
            if (new_relation.matching.match != null){
                subjectStatus[subjectKey].done.push(relatedKey)
            }
            else {
                subjectStatus[subjectKey].not_done.push(relatedKey)
            }
        }
        /* update status for the subject occurrences */
        for(const [occKey, occStatus] of Object.entries(subjectStatus)) {
            const relationsLength = subjectOccs[occKey].relations.length;
            if (occStatus.not_done.length == relationsLength){
                subjectOccs[occKey].status = "not-done"
            }
            else if (occStatus.done.length == relationsLength){
                subjectOccs[occKey].status = "finished"
            }
            else {
                subjectOccs[occKey].status = "partial"
            }
        }
        /* */
        return Object.values(subjectOccs);
    }

}