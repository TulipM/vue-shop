import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

import './plugins/element.js'

// 导入全局样式表
import 'assets/css/global.css'
// 导入图标字体
import 'assets/css/font-awesome-4.7.0/css/font-awesome.css'

Vue.config.productionTip = false

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/paivate/v1/'

Vue.prototype.$http = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
