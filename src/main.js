import Vue from 'vue'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import './styles/element-variables.scss'
import '@/styles/index.scss'

import App from './App'
import store from './store'
import router from './router'
import ElementUI from "element-ui";
import './permission'
import './utils/error-log'
Vue.use(ElementUI);

import * as filters from './filters'

// if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
// }
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
