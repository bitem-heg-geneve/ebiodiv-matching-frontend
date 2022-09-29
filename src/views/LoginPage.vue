<template>
  <div class="container-fluid">
    <b-alert show variant="danger" v-if="error">{{ error }}</b-alert>
    <b-alert show variant="primary" v-else>You can close the window</b-alert>
  </div>
</template>

<script>
    /*
       This component is the return page after OAuth2 from ORCID.
       see getTokenFromCurrentUrl in service/orcid.js 
     */
import { mapState, mapActions } from 'vuex'

export default {
    name: 'LoginPage',
    data() {
        return {
            error: null,
        }
    },
    computed: {
        ...mapState(['user']),
    },
    methods: {
        ...mapActions(['updateUnregisteredUser', 'updateOrcidUser'])
    },
    async mounted () {
        this.token = await this.$orcid.getTokenFromCurrentUrl();

        if (this.token.error) {
            this.error = this.token.error;
            // do no close the window
            return
        }

        // name = family_name + " " + given_name
        // but deal with the fact that values can be null 
        const name = []
        if (this.token.data.given_name != null) {
            name.push(this.token.data.given_name);
        }
        if (this.token.data.family_name != null) {
            name.push(this.token.data.family_name);
        }
        if (name.length == 0) {
            // should not happen: OrcID account without family name and given name
            // just in case: we display the orcid 
            name.push(this.token.data.orcid)
        }

        // send the token to the caller
        window.opener.setOrcidToken({
            'name': name.join(" "),
            'orcid': this.token.data.orcid,
            'orcidToken': this.token.id_token,
            'orcidTopenExp': this.token.exp,
        });

        // close this window
        window.close();
    }
}
</script>
