import Vue from 'vue'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import './styles/element-variables.scss'
import '@/styles/index.scss'

import App from './App'
import router from './router'
import ElementUI from "element-ui";
Vue.use(ElementUI);


// if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
// }

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
