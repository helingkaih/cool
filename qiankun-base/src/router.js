import Vue from 'vue'
import VueRouter from 'vue-router'
import home from './pages/home.vue'

Vue.use(VueRouter)
 
const routes = [
    {
        path: '/',
        name: 'home',
        component: home
      }
]
 
const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes
})
export default router
