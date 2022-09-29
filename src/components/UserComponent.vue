<template>
    <div class="user-login">
        <template v-if="user.name">
            <div id="loginName"><b-icon icon="person-fill"></b-icon> {{ user.name }}</div>
            <b-popover target="loginName" triggers="hover" placement="bottomright" :delay="{'show': 50, 'hide': 400}">
                <b-container>
                    <b-row class="mb-2 mt-2">
                        <b-col v-if="user.orcid">ORCID <a :href="userOrcidUrl" target="_blank">{{ user.orcid }}</a></b-col>
                        <b-col v-else>Logged without ORCID</b-col>
                    </b-row>
                    <b-row class="mb-2 mt-2">
                        <b-col><b-button variant="outline-danger" size="sm" @click="logout">Log out</b-button></b-col>
                    </b-row>
                </b-container>
            </b-popover>
        </template>
        <template v-else>
            <b-button v-b-modal="'loginForm'" size="sm" id="loginName"><b-icon icon="person-fill"></b-icon> Login</b-button>
            <b-modal id="loginForm" title="Login" :hide-footer="true" @show="onLoginShow" @hide="onLoginHide" >
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-body">
                            <h5 class="modal-title">Login with your ORCID</h5>
                            <div><a @click="startOAuth" id="oauthLink" :href="authUrl" class="btn btn-outline-primary" role="button" target="_blank" rel="opener"><img src="orcid_24x24.webp" /> Connect your ORCID</a></div>
                            <hr />
                            <h5 class="modal-title">Login without ORCID</h5>
                            <p>If you want to contribute to ebiodiv.org without a ORCID, you can enter your name</p>
                            <b-input-group prepend="Name" class="mt-3">
                                <b-form-input name="userName" id="userName"></b-form-input>
                                    <b-input-group-append>
                                    <b-button @click="loginAsAnUnregisteredUser">Login</b-button>
                                </b-input-group-append>
                            </b-input-group>
                        </div>
                    </div>
                </div>
            </b-modal>
        </template>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
    name: 'UserComponent',
    data() {
        return {
            authUrl: null,
            pendingLogin: false,
        }
    },
    computed: {
        ...mapState(['user']),
        userOrcidUrl() {
            if (this.$orcid.config != null) {
                return this.$orcid.config.issuer + "/" + this.user.orcid;
            }
            // doesn't work with sandbox.orcid.org
            return 'https://orcid.org/' + this.user.orcid;
            
        }
    },
    methods: {
        ...mapActions(['updateUnregisteredUser', 'updateOrcidUser']),
        loginAsAnUnregisteredUser() {
            const name = document.getElementById('userName').value;
            this.updateUnregisteredUser(name);
            this.$emitter.emit('logged');
        },
        onLoginShow() {
            this.pendingLogin = true;
        },
        onLoginHide() {
            if (this.pendingLogin) {
                this.$emitter.emit('loginAbort');
            }
            this.pendingLogin = false;
        },
        async startOAuth() {
            // allow to update the VueX store from "window.setOrcidToken"
            // the function is available only the time of the login on ORCID
            window.setOrcidToken = (orcidToken) => {
                this.updateOrcidUser(orcidToken);
                window.setOrcidToken = null;
                this.$emitter.emit('logged');
            }
        },
        logout() {
            this.$emitter.emit('logout');
            this.updateOrcidUser({
                name: null,
                orcid: null,
                orcidToken: null,
            });
        }
    },
    async mounted() {
        this.authUrl = await this.$orcid.getAuthUrl();
        //
        this.$emitter.on('logged', () => {
            this.pendingLogin = false;
        })
        this.$emitter.on('ensureLogin', () => {
            /*
              ensureLogin makes sure:
              * to ask the user to login
              * to sends a "logged" event or the "loginAbort" event
             */
            if (this.user.name) {
                // the user is already logged: send the "logged" event now.
                this.$emitter.emit('logged');
                return;
            }
            // the user is not logged: show the login modal
            // the "logged" event will be sent later
            this.$bvModal.show("loginForm");
        });
    }
}
</script>

<style scoped lang="scss">
.connect_oircid {
    border: 1px solid gray;
    border-radius: 0.25rem;
    margin: 1rem auto;
    padding: 0.5rem;
    display: block;
    width: 14rem;

    img {
        margin: 0.25rem;
    }
}

#loginName {
    cursor: pointer;
    font-size: 1rem;
}
</style>