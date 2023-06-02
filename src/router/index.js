import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: () => import(/* webpackChunkName: "home" */ '../views/HomePage.vue')
  },
  {
    path: '/scoring',
    name: 'ScoringPage',
    component: () => import(/* webpackChunkName: "about" */ '../views/ScoringPage.vue')
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: () => import(/* webpackChunkName: "login" */ '../views/LoginPage.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  // hash: false,
  base: process.env.BASE_URL,
  routes,
})

export default router
