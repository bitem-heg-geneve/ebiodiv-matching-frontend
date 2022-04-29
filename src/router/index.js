import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '../views/HomePage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/about',
    name: 'AboutPage',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutPage.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  hash: false,
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
      if (to.hash) {
        return { selector: to.hash, behavior: 'smooth', }
      }
      else if (savedPosition) {
        return savedPosition;
      }
      else {
        return { x: 0, y: 0 }
      }
  }
})

export default router
