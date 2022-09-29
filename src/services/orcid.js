/*
   based on https://github.com/ORCID/orcid-auth-widget :
   * To login, UserComponent.vue displays a link to ORCID (the value OrcID.getAuthUrl() )
   * This link goes to orcid.org and ask the user for login & password.
   * Orcid creates a token and redirect the browser to LoginPage.vue with the token as a hash parameter.
     Example: http://localhost:8080/login#TheORCIDTokenValue
   * LoginPage.vue calls the function getTokenFromCurrentUrl() to parse the token and to checks its signature
   * LoginPage.vue updates the user in the VueX store (updateOrcidUser function)

   Not implemented:
   * the token is not regenerated when it expired 
 */
const rs = require('jsrsasign');
import axios from 'axios';


export default new class OrcID {

    constructor() {
        this.config = null;
    }

    fetch_config() {
        return new Promise((resolve, reject) => {
            if (this.config !== null) {
                resolve();
                return
            }
            axios
                .get(process.env.BASE_URL + 'orcid.json')
                .then((response) => {
                    this.config = response.data;
                    this.config.error = null;
                    resolve();
                })
                .catch(error => {
                    this.config = {
                        "client_id": null,
                        "issuer": null,
                        "authUrl": null,
                        "key": null,
                        "error": error,
                    };
                    console.log(error);
                    reject(error)
                })
        })
    }

    async getAuthUrl() {
        await this.fetch_config();
        const redirectUri = (new URL(process.env.BASE_URL + '/login', document.location)).href;
        let url = this.config.authUrl + "?response_type=token&redirect_uri=" + redirectUri + "&client_id=" + this.config.client_id + "&scope=openid";
        if (this.scopes) {
            url += "%20" + this.scopes;
        }
        if (this.nonce)
            url += "&nonce=" + this.nonce;
        if (this.state)
            url += "&state=" + this.state;
        return url;
    }

    async getTokenFromCurrentUrl() {
        let hashParams = new URLSearchParams(window.location.hash.substring(1));
        let id_token = hashParams.get("id_token");
        let error = hashParams.get("error");

        if (id_token !== null) {
            if (await this.#checkSig(id_token)) {
                const signedInIdToken = JSON.parse(rs.jws.JWS.parse(id_token).payloadPP);
                return {
                    'id_token': id_token,
                    'exp': signedInIdToken.exp,
                    'data': {
                        'orcid': signedInIdToken.sub,
                        'given_name': signedInIdToken.given_name,
                        'family_name': signedInIdToken.family_name,
                    },
                    'error': null,
                };
            }
            return {
                'id_token': id_token,
                'data': null,
                'error': 'Invalid signature',
            }
        }
        
        if (error !== null) {
            return {
                'id_token': id_token,
                'data': null,
                'error': error,  // 'access_denied'
            }
        }

        return null;
    }

    async #checkSig(id_token) {
        await this.fetch_config();
        const pubKey = rs.KEYUTIL.getKey(this.config.key);
        return rs.jws.JWS.verifyJWT(id_token, pubKey, {
            alg: ['RS256'], iss: [this.config.issuer], aud: process.env.VUP_APP_ORCID_CLIENTID, gracePeriod: 15 * 60 //15 mins skew allowed
        });
    }

}
