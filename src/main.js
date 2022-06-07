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


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// Add the singleton $scoring to all Vue components ( https://v2.vuejs.org/v2/cookbook/adding-instance-properties.html )
import Scoring from '@/services/scoring.js'
Vue.prototype.$scoring = Scoring;
