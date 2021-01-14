import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from 'views/login/Login'
import Home from 'views/home/Home'

Vue.use(VueRouter)

const routes = [
  {path: '/', redirect: '/login'},
  {path: '/login', component: Login},
  {path: '/home', component: Home}
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由导航守卫
// router.beforeEach((to,from,next) => {
  // 如果是加载登录界面则立刻放行
  // if(to.path === '/login') return next()
  // 获取token
  // const tokenStr = window.sessionStorage.getItem('token')
  // if(!tokenStr) return next('/login')
  // next()
// })

export default router
