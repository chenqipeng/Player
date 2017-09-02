// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import VueLocalStorage from 'vue-ls'
import Player from './Player'
import './filters'

Vue.use(VueResource)
Vue.use(VueLocalStorage)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<player/>',
  components: { Player }
})
