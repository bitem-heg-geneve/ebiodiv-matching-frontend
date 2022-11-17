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
import VueGtag from "vue-gtag";
Vue.use(VueGtag, {
  config: { id: process.env.VUE_APP_GA_ID },
  bootstrap: false,
}, router);

new Vue({
  router,
  store,
  render: h => h(App),
	beforeCreate() {
		this.$store.commit('initialiseStore');
	},
}).$mount('#app')
