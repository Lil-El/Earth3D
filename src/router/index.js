import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import earthRouter from './modules/earth'

export const constantRoutes = [
  ...earthRouter,
]


const createRouter = () =>
  new Router({
    mode: 'history',
    scrollBehavior: (to, from, savedPosition) => {
      return { y: 0 }
    },
    routes: constantRoutes
  })

const router = createRouter()

// 清空路由
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
