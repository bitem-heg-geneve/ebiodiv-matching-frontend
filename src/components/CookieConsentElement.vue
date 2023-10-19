<template>
    <div>
        <vue-cookie-accept-decline
            :debug="false"
            :disableDecline="false"
            :showPostponeButton="false"
            @clicked-accept="cookieClickedAccept"
            @clicked-decline="cookieClickedDecline"
            @removed-cookie="cookieRemovedCookie"
            @status="cookieStatus"
            elementId="tracking_consent"
            position="bottom"
            ref="tracking_consent"
            transitionName="slideFromBottom"
            type="bar">
            <template #message>
                <p><b>Do you accept cookies that measure website use ?</b></p>
                <p>
                    We use <a href="https://matomo.org/" target="_blank">Matomo</a> to
                    measure how you use the website so we can improve it based on user needs. Google
                    Analytics sets cookies that store anonymised information about how you got to the site, the pages you visit,
                    how long you spend on each page and what you click on while you're visiting the site.
                </p>
            </template>
            <template #declineContent>Reject</template>
            <template #acceptContent>Accept</template>
        </vue-cookie-accept-decline>
        <div id="cookie_management">
            <!-- License: CC0 License , https://www.svgrepo.com/svg/30963/cookie -->
            <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 417 417" v-b-modal="this.user_tracking_consent === 'accept' ? 'cookieDecline' : 'cookieAccept'">
                <path fill="#d4b783" d="M345 204a59 59 0 0 1-85-48 60 60 0 0 1-48-85c-13-8-21-21-24-36-42 2-80 17-111 41a42 42 0 0 1-29 72c-6 0-12-1-17-3a187 187 0 0 0-11 63 189 189 0 0 0 333 122 42 42 0 0 1-10-59 42 42 0 0 1 34-17h1c2-9 3-17 3-26-15-3-28-11-36-24zM132 335c-13 0-24-6-32-16a42 42 0 1 1 65-54c6 8 9 18 9 28 0 23-18 42-42 42zm28-151c-13 0-25-6-32-16-7-7-10-17-10-27a42 42 0 0 1 74-26 42 42 0 0 1-32 69zm87 131c-17 0-32-8-42-20a54 54 0 1 1 83-69 54 54 0 0 1-41 89z"/>
                <path fill="#89634a" d="M160 163a22 22 0 1 0 0-44 22 22 0 0 0 0 44zm-28 151a22 22 0 1 0 0-44 22 22 0 0 0 0 44zM70 106c0-6-3-12-8-16-9 11-17 23-23 36a22 22 0 0 0 31-20zm285 190c0 7 4 14 10 18 8-12 15-25 20-39l-8-1c-12 0-22 9-22 22zm-109-2a34 34 0 1 0 0-68 34 34 0 0 0 0 68z"/>
                <path fill="#89634a" d="M192 115c6 7 10 16 10 26a42 42 0 0 1-74 27 42 42 0 1 0 64-53zm-18 177a42 42 0 0 1-74 27 42 42 0 1 0 64-53c6 7 10 16 10 26zm126-32a54 54 0 0 1-95 35 54 54 0 1 0 83-69c8 9 12 21 12 34z"/>
                <path d="M160 183a42 42 0 1 0 0-84 42 42 0 0 0 0 84zm0-64a22 22 0 1 1 0 44 22 22 0 0 1 0-44zm-28 215a42 42 0 1 0 0-84 42 42 0 0 0 0 84zm0-64a22 22 0 1 1 0 44 22 22 0 0 1 0-44z"/>
                <path d="M417 207v-1c0-6-4-10-10-10-14-1-28-10-34-23a10 10 0 0 0-15-4 41 41 0 0 1-43 2c-13-8-21-23-20-39a10 10 0 0 0-10-10 40 40 0 0 1-37-63 10 10 0 0 0-4-15c-13-6-22-20-23-34 0-6-4-10-10-10h-3a209 209 0 1 0 209 207zM62 90a22 22 0 0 1-23 36c6-13 14-25 23-36zm303 224c-6-4-10-11-10-18a22 22 0 0 1 30-21c-5 14-12 27-20 39zm26-58c-4-2-8-2-13-2h-3a42 42 0 0 0-22 76c-10 11-20 21-32 29l-2 2A189 189 0 0 1 31 144v1a42 42 0 0 0 45-70c33-33 77-53 126-55 4 15 12 28 24 37a60 60 0 0 0 50 84 60 60 0 0 0 84 50c9 12 22 20 37 24-1 14-3 28-6 41z"/>
                <path d="M246 314a54 54 0 1 0 0-108 54 54 0 0 0 0 108zm0-88a34 34 0 1 1 0 68 34 34 0 0 1 0-68z"/>
            </svg>
            <b-modal id="cookieDecline" title="Decline Matomo cookies ?" @ok="cookieDecline" ok-title="Reject" ok-only ok-variant="danger">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-body mx-auto">
                            <div>
                                <p>Currently, Matomo measures this website's use. You can opt-out to this optional feature by clicking the "Reject" button below.</p>
                                <b-alert show variant="warning">This action reloads the window</b-alert>
                            </div>
                        </div>
                    </div>
                </div>
            </b-modal>
            <b-modal id="cookieAccept" title="Accept Matomo cookies ?" @ok="cookieAccept" ok-title="Accept" ok-only ok-variant="success">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-body mx-auto">
                            <div>
                                <p>Currently, Matomo does not measure this website's use. You can opt-in to this optional feature by clicking the "Accept" button below.</p>
                                <b-alert show variant="warning">This action reloads the window</b-alert>
                            </div>
                        </div>
                    </div>
                </div>
            </b-modal>
        </div>
    </div>
</template>
<script>
import 'vue-cookie-accept-decline/dist/vue-cookie-accept-decline.css';
import VueCookieAcceptDecline from 'vue-cookie-accept-decline';
import { mapState } from 'vuex'

export default {
    name: 'CookieConsentElement',
    components: {
        VueCookieAcceptDecline,
    },
    data() {
        return {
            user_tracking_consent: null,
        };
    },
    computed: {
        ...mapState(['theme_color']),
        cssVars() {
            return {
                '--color-main': this.theme_color.main,
            }
        }
    },
    watch: {
        user_tracking_consent: function (val) {
            if (val == 'accept') {
                // the user has accept Matomo tracking
                // --> load GA
                // see https://matteo-gabriele.gitbook.io/vue-gtag/v/master/custom-installation#bootstrap-later
                this.$matomo.rememberConsentGiven();
            }
        }
    },
    methods: {
        cookieStatus(status) {
            this.user_tracking_consent = status;
        },
        cookieClickedAccept() {
            this.user_tracking_consent = 'accept';
        },
        cookieClickedDecline() {
            this.user_tracking_consent = 'decline';
        },
        cookieRemovedCookie() {
            this.user_tracking_consent = null;
        },
        cookieDecline() {
            this.user_tracking_consent = null;
            this.$refs.tracking_consent.decline();
            window.location.reload();
        },
        cookieAccept() {
            this.$refs.tracking_consent.accept();
            window.location.reload();
        },
    }
}
</script>
<style lang="scss">
#cookie_management {
    position: relative;

    svg {
        width: 1rem;
        position: absolute;
        right: 1rem;
        bottom: 1rem;
        transition: width 100ms;
    }

    svg:hover{
        width: 2rem;
    }
}
</style>
