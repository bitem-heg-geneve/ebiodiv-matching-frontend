import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// bootstrap-vue
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

// bootstrap
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap-vue/dist/bootstrap-vue-icons.min.css'

// services
import Scoring from '@/services/scoring.js'
import Backend from '@/services/backend.js'
import Orcid from '@/services/orcid.js'
import mitt from 'mitt'

Vue.config.productionTip = false

// Add the singleton $scoring to all Vue components ( https://v2.vuejs.org/v2/cookbook/adding-instance-properties.html )
Vue.prototype.$scoring = Scoring;
Vue.prototype.$backend = Backend;
Vue.prototype.$orcid = Orcid;
Vue.prototype.$emitter = mitt();

// vue-gtag
import VueMatomo from 'vue-matomo';

if (process.env.VUE_APP_MATOMO_HOST !== "") {
  Vue.use(VueMatomo, {
    // Configure your matomo server and site by providing
    host: process.env.VUE_APP_MATOMO_HOST,
    siteId: process.env.VUE_APP_MATOMO_SITE_ID,

    // Enables automatically registering pageviews on the router
    router: router,

    // Enables link tracking on regular links. Note that this won't
    // work for routing links (ie. internal Vue router links)
    // Default: true
    enableLinkTracking: true,

    // Require consent before sending tracking information to matomo
    // Default: false
    requireConsent: true,

    // Whether to track the initial page view
    // Default: true
    trackInitialView: true,

    // Run Matomo without cookies
    // Default: false
    disableCookies: false,

    // Require consent before creating matomo session cookie
    // Default: false
    requireCookieConsent: true,

    // Whether or not to log debug information
    // Default: false
    debug: false,

    // UserID passed to Matomo (see https://developer.matomo.org/guides/tracking-javascript-guide#user-id)
    // Default: undefined
    userId: process.env.VUE_APP_MATOMO_USER_ID,

    // Share the tracking cookie across subdomains (see https://developer.matomo.org/guides/tracking-javascript-guide#measuring-domains-andor-sub-domains)
    // Default: undefined, example '*.example.com'
    cookieDomain: '*.ebiodiv.org',

    // Tell Matomo the website domain so that clicks on these domains are not tracked as 'Outlinks'
    // Default: undefined, example: '*.example.com'
    domains: '*.ebiodiv.org',

    // Set this to include crossorigin attribute on the matomo script import
    // Default: undefined, possible values : 'anonymous', 'use-credentials'
    crossOrigin: undefined,
  });
}

// Vue
new Vue({
  router,
  store,
  render: h => h(App),
	beforeCreate() {
		this.$store.commit('initialiseStore');
	},
}).$mount('#app')
