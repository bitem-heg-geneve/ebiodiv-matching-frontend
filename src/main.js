import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// plugins
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue);

// bootstrap
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// services
import Scoring from '@/services/scoring.js'
import Backend from '@/services/backend.js'


Vue.config.productionTip = false

// Add the singleton $scoring to all Vue components ( https://v2.vuejs.org/v2/cookbook/adding-instance-properties.html )
Vue.prototype.$scoring = Scoring;
Vue.prototype.$backend = Backend;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
