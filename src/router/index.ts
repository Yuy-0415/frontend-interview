import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  // GitHub Pages 不支持 history 模式，刷新会 404，用 hash 模式
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../pages/Home.vue'),
      meta: { title: '首页' }
    },
    {
      path: '/category/:id',
      name: 'CategoryList',
      component: () => import('../pages/CategoryList.vue'),
      meta: { title: '题目列表' }
    },
    {
      path: '/question/:categoryId/:questionId',
      name: 'QuestionDetail',
      component: () => import('../pages/QuestionDetail.vue'),
      meta: { title: '题目详情' }
    },
    {
      path: '/quiz',
      name: 'QuizMode',
      component: () => import('../pages/QuizMode.vue'),
      meta: { title: '刷题模式' }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../pages/Profile.vue'),
      meta: { title: '我的' }
    }
  ],
  // 路由切换时滚动到顶部
  scrollBehavior() {
    return { top: 0 }
  }
})

// 路由守卫：设置页面标题
router.beforeEach((to) => {
  document.title = `${to.meta.title || '首页'} - 前端面试题`
})

export default router

