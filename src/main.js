// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '@/assets/css/common.css'
import '@/util/rem'
import axios from 'axios'
import { Toast, Indicator  } from 'mint-ui'
// Vue.$toast = Vue.prototype.$toast = Toast
 Vue.prototype.$toast = Toast
 Vue.prototype.$indicator = Indicator

Vue.config.productionTip = false

// axios.defaults.baseURL="http://hx.digirogar.com"

Vue.prototype.$http= axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
