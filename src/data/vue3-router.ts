import type { Category } from '../types'

const vue3Router: Category = {
  id: 'vue3-router',
  name: 'Vue Router',
  icon: '🧭',
  description: '路由模式、路由守卫、动态路由、权限控制、懒加载',
  questions: [
    {
      id: 'vr001',
      title: 'Vue Router 有哪几种路由模式？区别是什么？',
      difficulty: 1,
      tags: ['路由模式', 'hash', 'history', '高频'],
      answer: `## 两种路由模式

### 1. Hash 模式（createWebHashHistory）
- URL 带 \`#\`，如 \`http://example.com/#/home\`
- 基于 \`window.onhashchange\` 事件
- 不需要服务器配置，兼容性好
- SEO 不友好

### 2. History 模式（createWebHistory）
- URL 干净，如 \`http://example.com/home\`
- 基于 HTML5 History API（pushState / replaceState）
- 需要服务器配置 fallback（否则刷新 404）
- SEO 友好

### 选择建议
- 后台管理系统 → Hash 模式（简单省事）
- 面向用户的网站 → History 模式（URL 美观、SEO 友好）`,
      code: `import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

// History 模式
const router = createRouter({
  history: createWebHistory(),
  routes: [...]
})

// Hash 模式
const router = createRouter({
  history: createWebHashHistory(),
  routes: [...]
})`
    },
    {
      id: 'vr002',
      title: '路由守卫有哪些？执行顺序是什么？',
      difficulty: 2,
      tags: ['路由守卫', '导航守卫', '高频'],
      answer: `## 三类路由守卫

### 1. 全局守卫
- \`beforeEach\`：全局前置守卫（鉴权、登录检查）
- \`afterEach\`：全局后置守卫（页面标题、埋点）
- \`beforeResolve\`：全局解析守卫

### 2. 路由独享守卫
- \`beforeEnter\`：写在路由配置中

### 3. 组件内守卫
- \`onBeforeRouteUpdate\`：路由参数变化时
- \`onBeforeRouteLeave\`：离开当前路由时

### 完整执行顺序
1. 触发导航
2. 失活组件的 \`onBeforeRouteLeave\`
3. 全局 \`beforeEach\`
4. 重用组件的 \`onBeforeRouteUpdate\`
5. 路由配置的 \`beforeEnter\`
6. 解析异步路由组件
7. 全局 \`beforeResolve\`
8. 导航确认
9. 全局 \`afterEach\`
10. DOM 更新`,
      code: `// 全局前置守卫（登录鉴权）
router.beforeEach((to, from) => {
  const isLogin = !!localStorage.getItem('token')
  if (to.meta.requiresAuth && !isLogin) {
    return { name: 'Login' }
  }
})

// 组件内守卫
import { onBeforeRouteLeave } from 'vue-router'
onBeforeRouteLeave((to, from) => {
  const answer = window.confirm('确定要离开吗？未保存的数据将丢失')
  if (!answer) return false
})`
    },
    {
      id: 'vr003',
      title: '如何实现路由懒加载？原理是什么？',
      difficulty: 2,
      tags: ['懒加载', '性能优化'],
      answer: `## 路由懒加载

### 实现方式
使用动态 \`import()\` 语法，Vite/Webpack 会自动进行代码分割，将每个路由组件打包成独立的 chunk 文件。

### 原理
- 构建时：将路由组件拆分为独立的 JS 文件
- 运行时：首次访问该路由时才加载对应的 JS 文件
- 减少首屏加载体积，提升首屏速度

### 进阶：路由分组
使用 Vite 的魔法注释将多个路由打包到同一个 chunk`,
      code: `const routes = [
  {
    path: '/home',
    // 懒加载：访问时才加载
    component: () => import('../pages/Home.vue')
  },
  {
    path: '/about',
    // 带 chunk 命名
    component: () => import(/* webpackChunkName: "about" */ '../pages/About.vue')
  }
]`
    },
    {
      id: 'vr004',
      title: '如何实现动态路由和权限控制？',
      difficulty: 3,
      tags: ['动态路由', '权限控制', '高频'],
      answer: `## 动态路由权限控制

### 实现思路
1. 用户登录后，后端返回该用户的权限路由表
2. 前端通过 \`router.addRoute()\` 动态添加路由
3. 配合路由守卫做鉴权拦截

### 核心步骤
1. 定义**静态路由**（登录页、404等所有人可访问）
2. 定义**动态路由**（根据角色/权限过滤）
3. 登录成功后调用 \`addRoute\` 注册权限路由
4. 全局守卫中判断是否已加载动态路由

### 注意事项
- 刷新页面后动态路由会丢失，需要在守卫中重新加载
- 404 路由要最后添加（通配符路由）
- 退出登录时需要重置路由`,
      code: `// 静态路由
const staticRoutes = [
  { path: '/login', component: Login },
  { path: '/', component: Layout }
]

// 动态路由（根据权限过滤）
const dynamicRoutes = [
  { path: '/admin', component: Admin, meta: { roles: ['admin'] } },
  { path: '/editor', component: Editor, meta: { roles: ['admin', 'editor'] } }
]

// 登录后动态添加路由
function addDynamicRoutes(userRoles: string[]) {
  const allowedRoutes = dynamicRoutes.filter(route =>
    route.meta.roles.some(role => userRoles.includes(role))
  )
  allowedRoutes.forEach(route => router.addRoute('Layout', route))
  // 最后添加 404
  router.addRoute({ path: '/:pathMatch(.*)*', component: NotFound })
}

// 全局守卫
router.beforeEach(async (to) => {
  const token = localStorage.getItem('token')
  if (!token && to.path !== '/login') return '/login'
  if (token && !store.routesLoaded) {
    const roles = await fetchUserRoles()
    addDynamicRoutes(roles)
    return to.fullPath // 重新导航
  }
})`
    },
    {
      id: 'vr005',
      title: 'Vue Router 中 route 和 router 有什么区别？',
      difficulty: 1,
      tags: ['route', 'router', '基础'],
      answer: `## route vs router

### router（路由器实例）
- 全局路由管理器，整个应用只有一个
- 用于**编程式导航**：\`router.push()\`、\`router.replace()\`、\`router.go()\`
- 用于**动态路由操作**：\`router.addRoute()\`、\`router.removeRoute()\`
- 通过 \`useRouter()\` 获取

### route（当前路由信息）
- 当前激活的路由状态对象，是**响应式**的
- 包含：\`path\`、\`params\`、\`query\`、\`hash\`、\`meta\`、\`name\` 等
- 通过 \`useRoute()\` 获取

### 类比
- router 像**导航仪**（控制去哪里）
- route 像**仪表盘**（显示当前在哪里）`,
      code: `<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()   // 当前路由信息
const router = useRouter() // 路由器实例

// 读取当前路由信息
console.log(route.path)       // '/user/123'
console.log(route.params.id)  // '123'
console.log(route.query.tab)  // 'profile'
console.log(route.meta.title) // '用户详情'

// 编程式导航
router.push('/home')
router.push({ name: 'User', params: { id: '456' } })
router.replace('/login')
router.go(-1) // 后退一步
</script>`
    },
    {
      id: 'vr006',
      title: '路由传参有哪几种方式？各有什么特点？',
      difficulty: 1,
      tags: ['路由传参', 'params', 'query', '基础'],
      answer: `## 路由传参方式

### 1. params 参数（路径参数）
- URL 中体现：\`/user/123\`
- 需要在路由配置中定义占位符：\`path: '/user/:id'\`
- 刷新不丢失（因为是 URL 的一部分）

### 2. query 参数（查询参数）
- URL 中体现：\`/user?id=123&name=张三\`
- 不需要路由配置，任意传递
- 刷新不丢失
- 适合可选参数、筛选条件

### 3. state 参数（隐式传参）
- URL 中不体现
- 通过 \`router.push({ path: '/user', state: { data } })\` 传递
- 刷新可能丢失
- 适合临时传递大量数据

### 对比

| 方式 | URL可见 | 刷新保留 | 配置要求 |
|------|---------|---------|---------|
| params | ✅ | ✅ | 需要定义 :id |
| query | ✅ | ✅ | 无需配置 |
| state | ❌ | ❌ | 无需配置 |`,
      code: `// params 传参
router.push({ name: 'User', params: { id: '123' } })
// URL: /user/123
// 接收: route.params.id

// query 传参
router.push({ path: '/search', query: { keyword: 'vue', page: 1 } })
// URL: /search?keyword=vue&page=1
// 接收: route.query.keyword

// state 传参（HTML5 History API）
router.push({ path: '/detail', state: { item: { id: 1, name: '商品' } } })
// URL: /detail（不显示参数）
// 接收: history.state.item`
    },
    {
      id: 'vr007',
      title: '如何实现路由切换时的页面过渡动画？',
      difficulty: 2,
      tags: ['过渡动画', 'transition', '实战'],
      answer: `## 路由过渡动画

### 基本实现
使用 Vue 的 \`<Transition>\` 组件包裹 \`<RouterView>\`

### 不同路由不同动画
通过路由 meta 字段指定动画名称，或根据路由深度判断前进/后退

### 注意事项
- 组件必须有单个根元素
- 使用 \`appear\` 属性可以在首次渲染时也有动画
- 性能敏感场景用 CSS 动画而非 JS 动画`,
      code: `<template>
  <RouterView v-slot="{ Component, route }">
    <Transition :name="route.meta.transition || 'fade'" mode="out-in">
      <component :is="Component" :key="route.path" />
    </Transition>
  </RouterView>
</template>

<style>
/* 淡入淡出 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* 滑动效果 */
.slide-left-enter-active, .slide-left-leave-active {
  transition: transform 0.3s ease;
}
.slide-left-enter-from {
  transform: translateX(100%);
}
.slide-left-leave-to {
  transform: translateX(-100%);
}
</style>`
    },
    {
      id: 'vr008',
      title: '什么是路由元信息（meta）？有哪些常见用途？',
      difficulty: 1,
      tags: ['meta', '路由配置', '实战'],
      answer: `## 路由元信息 meta

### 定义
路由配置中的 \`meta\` 字段，用于存储自定义数据，可在路由守卫和组件中访问。

### 常见用途
1. **登录鉴权**：\`meta: { requiresAuth: true }\`
2. **页面标题**：\`meta: { title: '用户管理' }\`
3. **角色权限**：\`meta: { roles: ['admin'] }\`
4. **缓存控制**：\`meta: { keepAlive: true }\`
5. **面包屑**：\`meta: { breadcrumb: '用户列表' }\`
6. **过渡动画**：\`meta: { transition: 'slide' }\`

### 特性
- 子路由会继承父路由的 meta（通过 \`route.matched\` 访问）
- 完全自定义，没有固定格式`,
      code: `const routes = [
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, roles: ['admin'] },
    children: [
      {
        path: 'users',
        component: UserList,
        meta: { title: '用户管理', keepAlive: true }
      }
    ]
  }
]

// 在守卫中使用 meta
router.beforeEach((to) => {
  // 设置页面标题
  document.title = to.meta.title || '默认标题'

  // 鉴权检查
  if (to.meta.requiresAuth && !isLoggedIn()) {
    return '/login'
  }

  // 角色检查
  if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    return '/403'
  }
})`
    },
    {
      id: 'vr009',
      title: 'Vue Router 的 scrollBehavior 是什么？如何使用？',
      difficulty: 2,
      tags: ['scrollBehavior', '滚动行为'],
      answer: `## 滚动行为 scrollBehavior

### 作用
控制路由切换时页面的滚动位置。

### 常见需求
1. 切换路由时回到顶部
2. 浏览器前进/后退时恢复之前的滚动位置
3. 跳转到页面中的锚点位置

### 注意
- 仅在 History 模式下有效
- 返回 falsy 值或空对象则不滚动
- 支持异步滚动（返回 Promise）`,
      code: `const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 浏览器前进/后退 → 恢复位置
    if (savedPosition) {
      return savedPosition
    }

    // 有锚点 → 滚动到锚点
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth' // 平滑滚动
      }
    }

    // 默认 → 回到顶部
    return { top: 0, behavior: 'smooth' }
  }
})

// 异步滚动（等待页面渲染完成后再滚动）
scrollBehavior(to, from, savedPosition) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ top: 0 })
    }, 300) // 等待过渡动画完成
  })
}`
    },
    {
      id: 'vr010',
      title: '如何实现路由级别的 KeepAlive 缓存？',
      difficulty: 2,
      tags: ['KeepAlive', '缓存', '性能优化'],
      answer: `## 路由级别 KeepAlive

### 需求场景
- 列表页 → 详情页 → 返回列表页，希望列表页保持之前的滚动位置和数据
- 某些页面需要缓存，某些不需要

### 实现方式
结合路由 meta 和 \`<KeepAlive>\` 的 include/exclude 属性

### 注意事项
- 被缓存的组件必须有 \`name\` 属性（或使用 \`<script setup>\` 时通过 defineOptions 设置）
- 缓存的组件不会触发 created/mounted，而是触发 activated/deactivated
- 注意内存占用，不要缓存太多组件`,
      code: `<!-- App.vue -->
<template>
  <RouterView v-slot="{ Component, route }">
    <KeepAlive :include="cachedViews">
      <component :is="Component" :key="route.path" />
    </KeepAlive>
  </RouterView>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// 根据路由 meta 决定是否缓存
const cachedViews = computed(() => {
  return router.getRoutes()
    .filter(r => r.meta.keepAlive)
    .map(r => r.name)
})
</script>

<!-- 路由配置 -->
const routes = [
  { path: '/list', name: 'List', component: List, meta: { keepAlive: true } },
  { path: '/detail/:id', name: 'Detail', component: Detail } // 不缓存
]

<!-- 被缓存的组件 -->
<script setup>
import { onActivated, onDeactivated } from 'vue'

onActivated(() => {
  console.log('从缓存中恢复')
})
onDeactivated(() => {
  console.log('进入缓存')
})
</script>`
    }
  ]
}

export default vue3Router

