import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import  'element-ui/lib/theme-chalk/index.css'
// import './plugins/element.js'
import ElementUI from 'element-ui' // 全局导入 elementUI
import './plugins/treeTable.js' // 导入树形插件
import 'assets/css/global.css'  // 导入全局样式表
import 'assets/css/font-awesome-4.7.0/css/font-awesome.css' // 导入图标字体

Vue.config.productionTip = false

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/paivate/v1/'
// axios请求拦截
axios.interceptors.request.use(config => {
  // 为请求头对象添加"token"验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.prototype.$http = axios

Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
