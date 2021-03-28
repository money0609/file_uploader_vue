// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueRouter from 'vue-router'
import vuetify from './plugins/vuetify'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'video.js/dist/video-js.css'
import './styles/main.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueRouter)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  vuetify,
  components: { App },
  template: '<App/>'
})
