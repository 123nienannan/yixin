import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/index/Index'

Vue.use(Router)

export default new Router({
  mode:"history",
  base:"yixin",
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'Index',
      component: Index
    }
  ]
})
