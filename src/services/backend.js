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
                .get('backend.json')
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
        var url = this.urls.occurrences + "?occurenceKey=" + occurenceKey
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

}