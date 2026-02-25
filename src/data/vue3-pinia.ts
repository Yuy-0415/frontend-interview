import type { Category } from '../types'

const vue3Pinia: Category = {
  id: 'vue3-pinia',
  name: 'Vue3 状态管理',
  icon: '🍍',
  description: 'Pinia 原理与使用、Pinia vs Vuex 对比',
  questions: [
    {
      id: 'vp001',
      title: 'Pinia 和 Vuex 有什么区别？为什么推荐 Pinia？',
      difficulty: 2,
      tags: ['Pinia', 'Vuex', '对比', '高频'],
      answer: `## Pinia vs Vuex

| 对比项 | Pinia | Vuex |
|--------|-------|------|
| API 风格 | Composition API 风格 | Options API 风格 |
| mutations | 没有 mutations，直接修改 state | 必须通过 mutations 修改 |
| 模块化 | 天然模块化，每个 store 独立 | 需要 modules 嵌套 |
| TypeScript | 完美支持，自动类型推导 | 类型支持较弱 |
| 体积 | ~1KB，极轻量 | 相对较大 |
| DevTools | 支持 Vue DevTools | 支持 Vue DevTools |
| SSR | 原生支持 | 需要额外配置 |

### 为什么推荐 Pinia
1. 去掉了 mutations，简化了状态修改流程
2. 完美的 TypeScript 支持
3. 更符合 Composition API 的使用习惯
4. Vue3 官方推荐的状态管理方案`,
      code: `// Pinia store 示例
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)

  function increment() {
    count.value++ // 直接修改，不需要 mutation
  }

  return { count, doubleCount, increment }
})`
    },
    {
      id: 'vp002',
      title: 'Pinia 的核心概念有哪些？',
      difficulty: 1,
      tags: ['Pinia', '基础'],
      answer: `## Pinia 三大核心概念

### 1. State（状态）
- 相当于组件的 data
- 使用 \`ref()\` 或 \`reactive()\` 定义

### 2. Getters（计算属性）
- 相当于组件的 computed
- 使用 \`computed()\` 定义
- 有缓存机制，依赖不变则不重新计算

### 3. Actions（方法）
- 相当于组件的 methods
- 普通函数即可，支持同步和异步
- 可以直接修改 state，不需要 mutations`,
      code: `import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTodoStore = defineStore('todo', () => {
  // State
  const todos = ref<{ id: number; text: string; done: boolean }[]>([])

  // Getter
  const doneCount = computed(() => todos.value.filter(t => t.done).length)

  // Action（同步）
  function addTodo(text: string) {
    todos.value.push({ id: Date.now(), text, done: false })
  }

  // Action（异步）
  async function fetchTodos() {
    const res = await fetch('/api/todos')
    todos.value = await res.json()
  }

  return { todos, doneCount, addTodo, fetchTodos }
})`
    },
    {
      id: 'vp003',
      title: 'Pinia 如何实现持久化存储？',
      difficulty: 2,
      tags: ['Pinia', '持久化', '实战'],
      answer: `## Pinia 持久化方案

### 方案一：手动实现（推荐简单场景）
在 store 中手动读写 localStorage

### 方案二：使用插件 pinia-plugin-persistedstate
自动将 state 同步到 localStorage/sessionStorage

### 注意事项
- localStorage 有 5MB 限制
- 存储的数据需要是可序列化的（不能存函数、Symbol等）
- 敏感数据不要存 localStorage`,
      code: `// 方案一：手动实现
export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')

  function setToken(val: string) {
    token.value = val
    localStorage.setItem('token', val)
  }

  return { token, setToken }
})

// 方案二：使用插件
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)`
    },
    {
      id: 'vp004',
      title: 'Pinia 中 store 之间如何互相调用？',
      difficulty: 2,
      tags: ['Pinia', '模块化', '实战'],
      answer: `## Store 之间互相调用

在 Pinia 中，store 之间可以直接互相引用，非常简单：

### 使用方式
在一个 store 的 action 或 getter 中，直接调用另一个 store 的 \`useXxxStore()\` 即可。

### 注意事项
- 避免循环依赖（A 调 B，B 又调 A）
- 在 getter/action 内部调用，不要在顶层调用
- 如果确实需要循环引用，可以在 action 内部延迟调用`,
      code: `// stores/user.ts
export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const isLoggedIn = computed(() => !!token.value)
  return { token, isLoggedIn }
})

// stores/cart.ts — 调用 userStore
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])

  function checkout() {
    const userStore = useUserStore() // 在 action 内部调用
    if (!userStore.isLoggedIn) {
      throw new Error('请先登录')
    }
    // 执行结算逻辑...
  }

  return { items, checkout }
})`
    },
    {
      id: 'vp005',
      title: 'Pinia 的 $reset、$patch、$subscribe 分别是什么？',
      difficulty: 2,
      tags: ['Pinia', 'API'],
      answer: `## Pinia 实例方法

### $reset()
将 state 重置为初始值（仅 Options 写法支持，Setup 写法需手动实现）

### $patch()
批量修改 state，支持对象和函数两种方式：
- 对象方式：\`store.$patch({ count: 1, name: '张三' })\`
- 函数方式：\`store.$patch(state => { state.items.push(newItem) })\`
- 函数方式适合数组操作，避免替换整个数组

### $subscribe()
监听 state 变化，类似 Vuex 的 subscribe：
- 组件卸载时默认自动取消订阅
- 可设置 \`{ detached: true }\` 保持订阅`,
      code: `const store = useCounterStore()

// $patch 对象方式
store.$patch({
  count: 10,
  name: '新名字'
})

// $patch 函数方式（适合数组操作）
store.$patch((state) => {
  state.items.push({ id: 1, name: '新项目' })
  state.count++
})

// $subscribe 监听变化
store.$subscribe((mutation, state) => {
  console.log('变化类型:', mutation.type) // 'direct' | 'patch object' | 'patch function'
  console.log('store ID:', mutation.storeId)
  // 自动持久化
  localStorage.setItem('store', JSON.stringify(state))
})`
    },
    {
      id: 'vp006',
      title: 'Pinia 的 Setup Store 和 Options Store 有什么区别？',
      difficulty: 1,
      tags: ['Pinia', '写法对比'],
      answer: `## 两种定义 Store 的方式

### Options Store（选项式）
类似 Vue2 的 Options API，通过 state/getters/actions 选项定义

### Setup Store（组合式）
类似 Vue3 的 Composition API，使用 ref/computed/function 定义

### 区别

| 对比项 | Options Store | Setup Store |
|--------|-------------|-------------|
| 写法 | state/getters/actions 选项 | ref/computed/function |
| $reset | 内置支持 | 需手动实现 |
| 灵活性 | 较低 | 更高，可使用任意 composable |
| TypeScript | 类型推导一般 | 类型推导更好 |
| 推荐度 | 简单场景 | 复杂场景（官方推荐） |`,
      code: `// Options Store
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: {
    doubleCount: (state) => state.count * 2
  },
  actions: {
    increment() { this.count++ }
  }
})

// Setup Store（推荐）
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() { count.value++ }
  return { count, doubleCount, increment }
})`
    },
    {
      id: 'vp007',
      title: '在组件外如何使用 Pinia store？',
      difficulty: 2,
      tags: ['Pinia', '进阶', '实战'],
      answer: `## 组件外使用 Pinia

### 问题
在路由守卫、工具函数、axios 拦截器等非组件代码中，直接调用 \`useXxxStore()\` 可能报错，因为 Pinia 实例还没创建。

### 解决方案
确保在 \`app.use(pinia)\` 之后再调用 store。

### 常见场景
1. **路由守卫**：在 router.beforeEach 中使用
2. **axios 拦截器**：在请求/响应拦截器中使用
3. **工具函数**：传入 store 实例或延迟调用`,
      code: `// main.ts
const pinia = createPinia()
const app = createApp(App)
app.use(pinia) // 必须先注册

// router/index.ts — 路由守卫中使用
import { useUserStore } from '../stores/user'

router.beforeEach((to) => {
  const userStore = useUserStore() // ✅ pinia 已注册，可以使用
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    return '/login'
  }
})

// utils/http.ts — axios 拦截器中使用
import { useUserStore } from '../stores/user'

axios.interceptors.request.use((config) => {
  const userStore = useUserStore() // ✅ 在运行时调用，pinia 已就绪
  if (userStore.token) {
    config.headers.Authorization = 'Bearer ' + userStore.token
  }
  return config
})`
    },
    {
      id: 'vp008',
      title: 'Pinia 如何实现模块化？和 Vuex 的 modules 有什么区别？',
      difficulty: 2,
      tags: ['Pinia', 'Vuex', '模块化'],
      answer: `## Pinia 模块化

### Pinia 的模块化
Pinia 天然模块化，每个 store 就是一个独立模块：
- 每个 store 有独立的 id
- 不需要嵌套，扁平化管理
- 按需导入，Tree-shaking 友好

### Vuex 的 modules
- 需要在根 store 中注册 modules
- 嵌套结构，访问需要加命名空间
- 所有 module 打包在一起，不利于 Tree-shaking

### 对比

| 对比项 | Pinia | Vuex modules |
|--------|-------|-------------|
| 注册方式 | 自动注册，按需导入 | 手动注册到根 store |
| 命名空间 | 不需要 | 需要 namespaced: true |
| 嵌套 | 扁平化 | 支持嵌套 |
| 代码分割 | 天然支持 | 需要额外配置 |`,
      code: `// Pinia：每个文件就是一个独立 store
// stores/user.ts
export const useUserStore = defineStore('user', () => { ... })

// stores/product.ts
export const useProductStore = defineStore('product', () => { ... })

// 使用时直接导入
import { useUserStore } from '@/stores/user'
import { useProductStore } from '@/stores/product'

// Vuex：需要注册 modules
const store = createStore({
  modules: {
    user: { namespaced: true, state: {}, mutations: {}, actions: {} },
    product: { namespaced: true, state: {}, mutations: {}, actions: {} }
  }
})
// 使用时需要命名空间
store.dispatch('user/login')
store.commit('product/setList', list)`
    },
    {
      id: 'vp009',
      title: 'storeToRefs 是什么？为什么需要它？',
      difficulty: 2,
      tags: ['Pinia', 'storeToRefs', '响应式'],
      answer: `## storeToRefs

### 问题
直接解构 store 会丢失响应式（和 reactive 解构一样的问题）

### 解决方案
使用 \`storeToRefs()\` 将 store 的 state 和 getters 转为 ref

### 注意
- \`storeToRefs\` 只转换 state 和 getters
- actions（方法）直接解构即可，不需要 storeToRefs
- 这是 Pinia 专用的，比 Vue 的 toRefs 更高效`,
      code: `import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// ❌ 直接解构，丢失响应式
const { name, age } = userStore // name 和 age 不是响应式的

// ✅ 使用 storeToRefs
const { name, age } = storeToRefs(userStore) // name.value, age.value 是响应式的

// ✅ actions 直接解构即可
const { login, logout } = userStore // 方法不需要 storeToRefs`
    },
    {
      id: 'vp010',
      title: 'Pinia 插件机制是什么？如何编写 Pinia 插件？',
      difficulty: 3,
      tags: ['Pinia', '插件', '进阶'],
      answer: `## Pinia 插件

### 什么是 Pinia 插件
Pinia 插件是一个函数，接收 context 参数，可以：
- 给每个 store 添加新属性
- 给每个 store 添加新方法
- 包装或替换现有方法
- 监听 action 的执行

### 插件参数 context
- \`store\`：当前 store 实例
- \`app\`：Vue 应用实例
- \`pinia\`：Pinia 实例
- \`options\`：defineStore 的选项`,
      code: `// 自定义插件：给所有 store 添加 loading 状态
function loadingPlugin({ store }) {
  store.loading = ref(false)

  // 监听所有 action
  store.$onAction(({ name, after, onError }) => {
    store.loading = true
    after(() => { store.loading = false })
    onError(() => { store.loading = false })
  })
}

// 注册插件
const pinia = createPinia()
pinia.use(loadingPlugin)

// 使用时每个 store 都有 loading 属性
const userStore = useUserStore()
console.log(userStore.loading) // false`
    }
  ]
}

export default vue3Pinia

