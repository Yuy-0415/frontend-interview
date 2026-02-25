import type { Category } from '../types'

const vue3Core: Category = {
  id: 'vue3-core',
  name: 'Vue3 核心',
  icon: '⚡',
  description: 'Composition API、响应式原理、生命周期、组件通信',
  questions: [
    {
      id: 'v3c001',
      title: 'Vue3 相比 Vue2 有哪些重大变化？',
      difficulty: 3,
      tags: ['Vue3', '对比', '高频'],
      answer: `## Vue3 的主要改进

### 1. 性能提升
- 重写虚拟 DOM 实现，编译时优化（静态提升、补丁标记）
- 基于 Proxy 的响应式系统，替代 Object.defineProperty
- 更好的 Tree-shaking 支持，打包体积更小

### 2. Composition API
- 按功能逻辑组织代码，而非按选项类型
- 更好的逻辑复用（替代 mixins）
- 更好的 TypeScript 类型推导

### 3. 新特性
- **Teleport**：将组件渲染到 DOM 的其他位置
- **Fragments**：组件可以有多个根节点
- **Suspense**：异步组件的优雅加载
- **\`<script setup>\`**：更简洁的组合式 API 语法糖

### 4. 架构升级
- 使用 TypeScript 重写
- 模块化架构，按需引入
- 自定义渲染器 API`,
      code: `<!-- Vue2 写法 -->
<script>
export default {
  data() {
    return { count: 0 }
  },
  methods: {
    increment() { this.count++ }
  }
}
</script>

<!-- Vue3 写法 -->
<script setup>
import { ref } from 'vue'
const count = ref(0)
const increment = () => count.value++
</script>`
    },
    {
      id: 'v3c002',
      title: 'Composition API 和 Options API 有什么区别？',
      difficulty: 2,
      tags: ['Composition API', 'Options API', '高频'],
      answer: `## 核心区别

### 代码组织方式
- **Options API**：按选项类型分类（data、methods、computed、watch）
- **Composition API**：按功能逻辑组织，相关代码放在一起

### 逻辑复用
- **Options API**：通过 mixins 复用，存在命名冲突、来源不清晰的问题
- **Composition API**：通过 composable 函数复用，清晰、无冲突

### TypeScript 支持
- **Options API**：类型推导困难，需要额外的类型声明
- **Composition API**：天然支持类型推导

### 适用场景
- 小型项目、简单逻辑：Options API 更直观
- 中大型项目、复杂逻辑：Composition API 更灵活`,
      code: `// Composable 函数示例（逻辑复用）
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  function update(e: MouseEvent) {
    x.value = e.pageX
    y.value = e.pageY
  }

  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  return { x, y }
}`
    },
    {
      id: 'v3c003',
      title: 'Vue3 的响应式原理是什么？Proxy 和 defineProperty 有什么区别？',
      difficulty: 3,
      tags: ['响应式', 'Proxy', '原理', '高频'],
      answer: `## Vue3 响应式原理

Vue3 使用 **Proxy** 实现响应式系统，核心流程：

### 1. 响应式代理
- 使用 \`Proxy\` 包装目标对象
- 通过 \`get\` 拦截器进行**依赖收集**（track）
- 通过 \`set\` 拦截器进行**派发更新**（trigger）

### 2. Proxy vs defineProperty

| 对比项 | Proxy (Vue3) | defineProperty (Vue2) |
|--------|-------------|----------------------|
| 监听方式 | 代理整个对象 | 逐个属性劫持 |
| 新增属性 | 自动监听 | 需要 Vue.set() |
| 数组变化 | 原生支持 | 需要重写数组方法 |
| 性能 | 懒代理，按需创建 | 初始化时递归遍历 |
| 嵌套对象 | 访问时才递归代理 | 初始化时全部递归 |

### 3. 依赖收集机制
- 使用 \`WeakMap -> Map -> Set\` 的三层结构存储依赖
- \`targetMap(WeakMap)\` → \`depsMap(Map)\` → \`dep(Set)\`
- 自动追踪和清理无效依赖`,
      code: `// 简化版响应式实现
function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver)
      track(target, key) // 依赖收集
      // 嵌套对象懒代理
      if (typeof result === 'object' && result !== null) {
        return reactive(result)
      }
      return result
    },
    set(target, key, value, receiver) {
      const oldValue = target[key]
      const result = Reflect.set(target, key, value, receiver)
      if (oldValue !== value) {
        trigger(target, key) // 派发更新
      }
      return result
    }
  })
}`
    },
    {
      id: 'v3c004',
      title: 'ref 和 reactive 有什么区别？什么时候用哪个？',
      difficulty: 2,
      tags: ['ref', 'reactive', '响应式', '高频'],
      answer: `## ref vs reactive

### 基本区别
- **ref**：可以包装任意类型（基本类型 + 对象），通过 \`.value\` 访问
- **reactive**：只能包装对象类型，直接访问属性

### 使用建议
- 基本类型（string/number/boolean）→ 用 \`ref\`
- 对象/数组 → 都可以，但 \`ref\` 更安全（不会丢失响应式）
- 表单数据等整体对象 → \`reactive\` 更方便（不用写 .value）

### 响应式丢失问题
\`reactive\` 对象解构后会丢失响应式，需要用 \`toRefs\` 转换：`,
      code: `import { ref, reactive, toRefs } from 'vue'

// ref 用法
const count = ref(0)
console.log(count.value) // 0
count.value++

// reactive 用法
const state = reactive({ name: '张三', age: 25 })
console.log(state.name) // 张三

// ⚠️ 解构会丢失响应式
const { name, age } = state // name, age 不是响应式的！

// ✅ 用 toRefs 保持响应式
const { name, age } = toRefs(state) // name.value, age.value 是响应式的`
    },
    {
      id: 'v3c005',
      title: 'Vue3 的生命周期钩子有哪些？和 Vue2 有什么区别？',
      difficulty: 1,
      tags: ['生命周期', '对比'],
      answer: `## Vue3 生命周期

### Composition API 钩子

| Vue2 (Options API) | Vue3 (Composition API) | 说明 |
|-------|-------|------|
| beforeCreate | setup() | 组件创建前 |
| created | setup() | 组件创建完成 |
| beforeMount | onBeforeMount | 挂载前 |
| mounted | onMounted | 挂载完成（可操作 DOM） |
| beforeUpdate | onBeforeUpdate | 更新前 |
| updated | onUpdated | 更新完成 |
| beforeDestroy | onBeforeUnmount | 卸载前 |
| destroyed | onUnmounted | 卸载完成 |

### 关键变化
1. \`setup()\` 替代了 \`beforeCreate\` 和 \`created\`
2. 销毁钩子改名：destroy → unmount
3. 新增 \`onRenderTracked\` 和 \`onRenderTriggered\`（调试用）
4. 所有钩子都需要从 vue 中导入`,
      code: `<script setup>
import { onMounted, onUpdated, onUnmounted } from 'vue'

// setup 本身就相当于 created
console.log('组件创建')

onMounted(() => {
  console.log('DOM 挂载完成，可以操作 DOM')
})

onUpdated(() => {
  console.log('数据更新，DOM 已重新渲染')
})

onUnmounted(() => {
  console.log('组件卸载，清理定时器/事件监听等')
})
</script>`
    },
    {
      id: 'v3c006',
      title: 'computed 和 watch 有什么区别？watchEffect 又是什么？',
      difficulty: 2,
      tags: ['computed', 'watch', 'watchEffect', '高频'],
      answer: `## computed vs watch vs watchEffect

### computed（计算属性）
- 基于依赖**自动缓存**，依赖不变则不重新计算
- 必须有返回值
- 适合：从已有数据派生新数据

### watch（侦听器）
- 监听特定数据源的变化，执行副作用
- 可以获取新值和旧值
- 支持 \`immediate\`（立即执行）和 \`deep\`（深度监听）
- 适合：数据变化时执行异步操作或复杂逻辑

### watchEffect
- 自动追踪回调中用到的所有响应式依赖
- 不需要指定监听源，用到谁就监听谁
- 立即执行一次（类似 immediate: true 的 watch）
- 适合：多个依赖同时监听、副作用逻辑`,
      code: `import { ref, computed, watch, watchEffect } from 'vue'

const firstName = ref('张')
const lastName = ref('三')

// computed：自动缓存
const fullName = computed(() => firstName.value + lastName.value)

// watch：监听特定数据
watch(firstName, (newVal, oldVal) => {
  console.log(\`姓从 \${oldVal} 变成了 \${newVal}\`)
})

// watch 深度监听对象
watch(() => state.user, (newUser) => {
  saveToServer(newUser)
}, { deep: true })

// watchEffect：自动追踪依赖
watchEffect(() => {
  console.log(\`全名是：\${firstName.value}\${lastName.value}\`)
  // 自动监听 firstName 和 lastName
})`
    },
    {
      id: 'v3c007',
      title: 'Vue3 组件通信有哪些方式？',
      difficulty: 2,
      tags: ['组件通信', 'props', 'emit', 'provide', '高频'],
      answer: `## Vue3 组件通信方式

### 1. props / emit（父子通信）
- 父 → 子：通过 props 传递数据
- 子 → 父：通过 emit 触发事件

### 2. provide / inject（跨层级通信）
- 祖先组件 provide 提供数据
- 后代组件 inject 注入数据
- 可以传递响应式数据

### 3. v-model（双向绑定）
- Vue3 支持多个 v-model
- 本质是 props + emit 的语法糖

### 4. expose / ref（父访问子）
- 子组件通过 defineExpose 暴露方法/属性
- 父组件通过 ref 访问

### 5. 事件总线（mitt）
- 第三方库 mitt，替代 Vue2 的 EventBus
- 适合兄弟组件或任意组件通信

### 6. Pinia（全局状态管理）
- 适合多组件共享的全局状态`,
      code: `<!-- 父组件 -->
<template>
  <Child :msg="message" @update="handleUpdate" v-model:title="title" />
</template>

<!-- 子组件 -->
<script setup>
const props = defineProps<{ msg: string; title: string }>()
const emit = defineEmits<{
  (e: 'update', val: string): void
  (e: 'update:title', val: string): void
}>()

// provide / inject
import { provide, inject } from 'vue'
// 祖先组件
provide('theme', ref('dark'))
// 后代组件
const theme = inject('theme')

// defineExpose
defineExpose({ reset: () => { /* ... */ } })
</script>`
    },
    {
      id: 'v3c008',
      title: 'Vue3 中 Teleport 是什么？有什么应用场景？',
      difficulty: 2,
      tags: ['Teleport', '新特性'],
      answer: `## Teleport（传送门）

### 作用
将组件的 DOM 渲染到指定的目标元素下，而不是当前组件的 DOM 树中。

### 应用场景
- **模态框（Modal）**：避免被父元素的 overflow:hidden 或 z-index 影响
- **全局通知/Toast**：渲染到 body 下，确保层级正确
- **下拉菜单**：避免被父容器裁剪

### 特点
- 逻辑上仍属于当前组件（props、事件、生命周期不变）
- 只是 DOM 位置发生了变化
- 支持动态 \`to\` 属性和 \`disabled\` 属性`,
      code: `<template>
  <!-- 模态框渲染到 body 下 -->
  <Teleport to="body">
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2>标题</h2>
        <p>内容</p>
        <button @click="showModal = false">关闭</button>
      </div>
    </div>
  </Teleport>

  <!-- 也可以渲染到指定 ID 的元素 -->
  <Teleport to="#notifications">
    <Toast :message="msg" />
  </Teleport>

  <!-- 动态禁用 -->
  <Teleport to="body" :disabled="isMobile">
    <Dropdown />
  </Teleport>
</template>`
    },
    {
      id: 'v3c009',
      title: 'Vue3 中 \`<script setup>\` 的优势是什么？',
      difficulty: 1,
      tags: ['script setup', '语法糖', '高频'],
      answer: `## \`<script setup>\` 语法糖

### 优势
1. **更简洁**：不需要 return，顶层变量/函数自动暴露给模板
2. **更好的性能**：编译时优化，运行时性能更好
3. **更好的 TS 支持**：直接使用 defineProps/defineEmits 获得类型推导
4. **更少的样板代码**：不需要 export default、setup() 函数包裹

### 与普通 \`<script>\` 的区别
- 普通 script：需要 export default + setup() + return
- script setup：顶层代码即 setup，自动暴露

### 专属 API
- \`defineProps\`：声明 props
- \`defineEmits\`：声明事件
- \`defineExpose\`：暴露给父组件的属性/方法
- \`defineOptions\`：声明组件选项（name 等）
- \`defineSlots\`：声明插槽类型（TS）`,
      code: `<!-- 普通写法 -->
<script>
import { ref } from 'vue'
export default {
  props: { msg: String },
  emits: ['update'],
  setup(props, { emit }) {
    const count = ref(0)
    return { count }
  }
}
</script>

<!-- script setup 写法（推荐） -->
<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ msg: string }>()
const emit = defineEmits<{ (e: 'update', val: number): void }>()
const count = ref(0)
// 不需要 return，模板直接使用 count
</script>`
    },
    {
      id: 'v3c010',
      title: 'Vue3 中 Suspense 是什么？怎么用？',
      difficulty: 3,
      tags: ['Suspense', '异步组件', '新特性'],
      answer: `## Suspense（悬念组件）

### 作用
处理异步组件的加载状态，在异步内容加载完成前显示 fallback 内容。

### 使用场景
- 异步组件加载时显示 loading
- 配合 async setup() 使用
- 多个异步组件的统一加载状态管理

### 两个插槽
- \`#default\`：异步内容加载完成后显示
- \`#fallback\`：加载过程中显示

### 注意事项
- 目前仍是实验性功能
- 子组件的 setup 可以是 async 的
- 支持 \`onPending\`、\`onResolve\`、\`onFallback\` 事件`,
      code: `<template>
  <Suspense>
    <!-- 异步组件 -->
    <template #default>
      <AsyncDashboard />
    </template>
    <!-- 加载中显示 -->
    <template #fallback>
      <div class="loading">加载中...</div>
    </template>
  </Suspense>
</template>

<!-- AsyncDashboard.vue -->
<script setup>
// setup 可以是 async 的
const data = await fetch('/api/dashboard').then(r => r.json())
</script>`
    },
    {
      id: 'v3c011',
      title: 'Vue3 中如何自定义指令？',
      difficulty: 2,
      tags: ['自定义指令', 'directive'],
      answer: `## 自定义指令

### 指令钩子函数
- \`created\`：元素创建后
- \`beforeMount\`：挂载前
- \`mounted\`：挂载后（最常用）
- \`beforeUpdate\`：更新前
- \`updated\`：更新后
- \`beforeUnmount\`：卸载前
- \`unmounted\`：卸载后

### 常见应用场景
- 自动聚焦（v-focus）
- 权限控制（v-permission）
- 点击外部关闭（v-click-outside）
- 懒加载（v-lazy）
- 防抖点击（v-debounce）`,
      code: `// 全局注册
app.directive('focus', {
  mounted(el) {
    el.focus()
  }
})

// 局部注册（script setup 中以 v 开头命名）
const vFocus = {
  mounted: (el: HTMLElement) => el.focus()
}

// 带参数的指令
const vPermission = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const permission = binding.value
    if (!hasPermission(permission)) {
      el.parentNode?.removeChild(el)
    }
  }
}

// 使用
// <input v-focus />
// <button v-permission="'admin'">删除</button>`
    },
    {
      id: 'v3c012',
      title: 'Vue3 中 provide/inject 如何传递响应式数据？',
      difficulty: 2,
      tags: ['provide', 'inject', '响应式', '组件通信'],
      answer: `## provide/inject 响应式传递

### 关键点
- provide 传递 ref 或 reactive 对象，inject 接收后自动保持响应式
- 建议在 provide 端提供修改方法，而不是让 inject 端直接修改
- 使用 readonly 包装可以防止子组件意外修改

### 最佳实践
1. 提供数据 + 修改方法
2. 用 readonly 保护数据
3. 使用 InjectionKey 保证类型安全`,
      code: `// 祖先组件
import { provide, ref, readonly } from 'vue'
import type { InjectionKey, Ref } from 'vue'

// 类型安全的 key
export const ThemeKey: InjectionKey<Ref<string>> = Symbol('theme')

const theme = ref('light')
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

// 提供只读数据 + 修改方法
provide(ThemeKey, readonly(theme))
provide('toggleTheme', toggleTheme)

// 后代组件
import { inject } from 'vue'
import { ThemeKey } from './keys'

const theme = inject(ThemeKey, ref('light')) // 带默认值
const toggleTheme = inject<() => void>('toggleTheme')!`
    },
    {
      id: 'v3c013',
      title: 'Vue3 中 shallowRef 和 shallowReactive 是什么？什么时候用？',
      difficulty: 3,
      tags: ['shallowRef', 'shallowReactive', '性能优化'],
      answer: `## 浅层响应式

### shallowRef
- 只有 \`.value\` 的变化是响应式的
- \`.value\` 内部的属性变化不会触发更新
- 适合：大型对象只需要整体替换时

### shallowReactive
- 只有第一层属性是响应式的
- 嵌套对象的属性变化不会触发更新
- 适合：只关心顶层属性变化的大型对象

### 使用场景
- 性能优化：避免深层对象的递归代理开销
- 第三方库集成：某些库不需要深层响应式
- 大型列表数据：只需要整体替换而非逐项修改`,
      code: `import { shallowRef, shallowReactive, triggerRef } from 'vue'

// shallowRef
const state = shallowRef({ count: 0, nested: { value: 1 } })
state.value.count = 1      // ❌ 不会触发更新
state.value = { count: 1, nested: { value: 1 } }  // ✅ 整体替换才触发
triggerRef(state)           // ✅ 手动触发更新

// shallowReactive
const obj = shallowReactive({
  name: '张三',           // ✅ 响应式
  address: {
    city: '北京'          // ❌ 不是响应式
  }
})
obj.name = '李四'          // ✅ 触发更新
obj.address.city = '上海'  // ❌ 不触发更新`
    },
    {
      id: 'v3c014',
      title: 'Vue3 中 toRef 和 toRefs 有什么作用？',
      difficulty: 2,
      tags: ['toRef', 'toRefs', '响应式'],
      answer: `## toRef / toRefs

### 问题背景
reactive 对象解构后会丢失响应式，toRef/toRefs 解决这个问题。

### toRef
- 将 reactive 对象的某个属性转为 ref
- 保持与源对象的响应式连接

### toRefs
- 将 reactive 对象的所有属性转为 ref
- 常用于 composable 函数的返回值

### 使用场景
- 从 reactive 对象中解构属性时保持响应式
- composable 函数返回多个响应式值
- props 解构时保持响应式`,
      code: `import { reactive, toRef, toRefs } from 'vue'

const state = reactive({ name: '张三', age: 25 })

// ❌ 解构丢失响应式
const { name, age } = state

// ✅ toRef：单个属性
const nameRef = toRef(state, 'name')
nameRef.value = '李四' // state.name 也会变

// ✅ toRefs：所有属性
const { name: nameRef2, age: ageRef } = toRefs(state)

// composable 中常见用法
function useUser() {
  const user = reactive({ name: '张三', age: 25 })
  return toRefs(user) // 返回 ref，解构后仍保持响应式
}
const { name, age } = useUser() // name.value, age.value`
    },
    {
      id: 'v3c015',
      title: 'Vue3 中 key 的作用是什么？为什么不建议用 index 作为 key？',
      difficulty: 1,
      tags: ['key', '虚拟DOM', 'diff', '高频'],
      answer: `## key 的作用

### 核心作用
key 是虚拟 DOM diff 算法的**唯一标识**，帮助 Vue 判断哪些节点可以复用、哪些需要更新。

### 为什么不用 index 作为 key？
当列表发生插入、删除、排序时，index 会变化，导致：
1. **错误复用**：Vue 认为节点没变（index 相同），实际内容已经变了
2. **性能浪费**：本可以复用的节点被销毁重建
3. **状态错乱**：输入框等有内部状态的组件会出现数据错位

### 正确做法
使用数据的唯一标识（如 id）作为 key`,
      code: `<!-- ❌ 用 index 作为 key -->
<li v-for="(item, index) in list" :key="index">
  <input v-model="item.name" />
</li>
<!-- 删除第一项后，所有 input 的值会错位 -->

<!-- ✅ 用唯一 id 作为 key -->
<li v-for="item in list" :key="item.id">
  <input v-model="item.name" />
</li>

<!-- key 的另一个用途：强制重新渲染组件 -->
<MyComponent :key="componentKey" />
<!-- 改变 componentKey 会销毁旧组件，创建新组件 -->`
    },
    {
      id: 'v3c016',
      title: 'Vue3 中 nextTick 的原理和使用场景？',
      difficulty: 2,
      tags: ['nextTick', '异步更新', '高频'],
      answer: `## nextTick

### 作用
\`nextTick\` 用于在 DOM 更新完成后执行回调。Vue 的 DOM 更新是**异步**的，修改响应式数据后 DOM 不会立即更新。

### 原理
Vue3 中 nextTick 基于 \`Promise.then\` 实现（微任务）。内部维护一个异步更新队列，数据变化时将更新任务推入队列，在当前同步代码执行完毕后统一刷新。

### 使用场景
1. 修改数据后需要立即操作更新后的 DOM
2. 在 \`onMounted\` 中等待子组件全部渲染完成
3. 获取更新后的元素尺寸/位置`,
      code: `import { ref, nextTick } from 'vue'

const count = ref(0)
const el = ref<HTMLElement>()

async function increment() {
  count.value++
  // DOM 还没更新
  console.log(el.value?.textContent) // 旧值

  await nextTick()
  // DOM 已更新
  console.log(el.value?.textContent) // 新值
}

// 也可以用回调形式
count.value++
nextTick(() => {
  console.log('DOM 已更新')
})`
    },
    {
      id: 'v3c017',
      title: 'Vue3 中插槽（Slot）有哪几种？怎么用？',
      difficulty: 2,
      tags: ['插槽', 'slot', '组件', '高频'],
      answer: `## Vue3 插槽

### 1. 默认插槽
父组件传入的内容会渲染到子组件的 \`<slot />\` 位置。

### 2. 具名插槽
通过 \`name\` 属性区分多个插槽，父组件用 \`v-slot:name\` 或 \`#name\` 指定。

### 3. 作用域插槽
子组件通过 slot 向父组件传递数据，父组件可以访问子组件暴露的数据来自定义渲染。

### 使用建议
- 简单内容分发 → 默认插槽
- 多区域布局 → 具名插槽
- 子组件数据 + 父组件模板 → 作用域插槽`,
      code: `<!-- 子组件 MyCard.vue -->
<template>
  <div class="card">
    <header><slot name="header">默认标题</slot></header>
    <main><slot>默认内容</slot></main>
    <!-- 作用域插槽：向父组件传数据 -->
    <footer>
      <slot name="footer" :count="total" :label="'共计'">
        默认底部
      </slot>
    </footer>
  </div>
</template>

<!-- 父组件使用 -->
<MyCard>
  <template #header>自定义标题</template>
  <p>这是主体内容</p>
  <template #footer="{ count, label }">
    {{ label }}: {{ count }} 条
  </template>
</MyCard>`
    },
    {
      id: 'v3c018',
      title: 'Vue3 中异步组件怎么定义？和路由懒加载有什么关系？',
      difficulty: 2,
      tags: ['异步组件', 'defineAsyncComponent', '懒加载'],
      answer: `## 异步组件

### 定义方式
使用 \`defineAsyncComponent\` 定义，组件会在首次渲染时才加载。

### 核心特性
- 支持加载状态（loading 组件）
- 支持错误状态（error 组件）
- 支持超时设置
- 支持重试

### 与路由懒加载的关系
路由懒加载本质也是异步组件，只是写法更简洁：
- 路由懒加载：\`() => import('./Page.vue')\`
- 异步组件：\`defineAsyncComponent(() => import('./Comp.vue'))\`

### 使用场景
- 大型组件按需加载（图表、编辑器）
- 条件渲染的组件（弹窗、抽屉）
- 减少首屏加载体积`,
      code: `import { defineAsyncComponent } from 'vue'

// 基本用法
const AsyncComp = defineAsyncComponent(
  () => import('./HeavyComponent.vue')
)

// 完整配置
const AsyncWithOptions = defineAsyncComponent({
  loader: () => import('./HeavyChart.vue'),
  loadingComponent: LoadingSpinner,  // 加载中显示
  errorComponent: ErrorDisplay,       // 加载失败显示
  delay: 200,        // 延迟显示 loading（避免闪烁）
  timeout: 10000     // 超时时间
})

// 配合 Suspense 使用
<template>
  <Suspense>
    <AsyncComp />
    <template #fallback>加载中...</template>
  </Suspense>
</template>`
    },
    {
      id: 'v3c019',
      title: 'Vue3 中 defineExpose 的作用是什么？',
      difficulty: 2,
      tags: ['defineExpose', 'script setup', '组件'],
      answer: `## defineExpose

### 背景
在 \`<script setup>\` 中，组件的所有变量和方法默认是**私有的**，父组件通过 ref 无法访问。

### 作用
\`defineExpose\` 用于显式暴露组件的属性和方法，让父组件可以通过模板 ref 访问。

### 使用场景
- 父组件需要调用子组件的方法（如表单验证、重置）
- 父组件需要读取子组件的内部状态
- 封装可复用组件时暴露公共 API`,
      code: `<!-- 子组件 MyForm.vue -->
<script setup>
import { ref } from 'vue'

const formData = ref({ name: '', email: '' })
const isValid = ref(false)

function validate() {
  isValid.value = formData.value.name.length > 0
  return isValid.value
}

function reset() {
  formData.value = { name: '', email: '' }
  isValid.value = false
}

// 只暴露需要的方法和属性
defineExpose({ validate, reset, isValid })
</script>

<!-- 父组件 -->
<script setup>
import { ref } from 'vue'
import MyForm from './MyForm.vue'

const formRef = ref<InstanceType<typeof MyForm>>()

function handleSubmit() {
  if (formRef.value?.validate()) {
    console.log('验证通过')
  }
}
</script>
<template>
  <MyForm ref="formRef" />
  <button @click="handleSubmit">提交</button>
</template>`
    },
    {
      id: 'v3c020',
      title: 'Vue3 中 v-model 的原理？如何实现多个 v-model？',
      difficulty: 2,
      tags: ['v-model', '双向绑定', '组件', '高频'],
      answer: `## v-model 原理

### 本质
v-model 是语法糖，等价于 \`:modelValue\` + \`@update:modelValue\`。

### Vue3 vs Vue2 的变化
- Vue2：\`v-model\` 绑定 \`value\` + \`input\` 事件，只能用一个
- Vue3：\`v-model\` 绑定 \`modelValue\` + \`update:modelValue\`，支持多个

### 多个 v-model
Vue3 支持 \`v-model:propName\` 语法，一个组件可以绑定多个双向数据。

### 自定义修饰符
Vue3 还支持自定义 v-model 修饰符。`,
      code: `<!-- 子组件 UserForm.vue -->
<script setup>
const props = defineProps<{
  name: string
  age: number
}>()
const emit = defineEmits<{
  'update:name': [value: string]
  'update:age': [value: number]
}>()
</script>
<template>
  <input :value="name" @input="emit('update:name', ($event.target as HTMLInputElement).value)" />
  <input type="number" :value="age" @input="emit('update:age', Number(($event.target as HTMLInputElement).value))" />
</template>

<!-- 父组件：多个 v-model -->
<UserForm v-model:name="userName" v-model:age="userAge" />

<!-- 等价于 -->
<UserForm
  :name="userName"
  @update:name="userName = $event"
  :age="userAge"
  @update:age="userAge = $event"
/>`
    },
    {
      id: 'v3c021',
      title: 'Vue3 中 readonly 和 shallowReadonly 有什么用？',
      difficulty: 2,
      tags: ['readonly', '响应式', 'API'],
      answer: `## readonly / shallowReadonly

### readonly
将一个响应式对象变为**深层只读**，任何层级的属性都不可修改。

### shallowReadonly
只有第一层属性是只读的，嵌套对象的属性仍然可以修改。

### 使用场景
1. **props 保护**：防止子组件意外修改父组件传入的数据
2. **全局配置**：应用级别的只读配置对象
3. **provide 数据保护**：向子组件提供只读数据，防止被修改

### 与 const 的区别
- \`const\` 只是变量不可重新赋值，对象内部属性仍可修改
- \`readonly\` 是深层冻结，对象内部属性也不可修改`,
      code: `import { reactive, readonly, shallowReadonly } from 'vue'

const state = reactive({ name: '张三', address: { city: '北京' } })

// readonly：深层只读
const readonlyState = readonly(state)
readonlyState.name = '李四'          // ⚠️ 警告，不生效
readonlyState.address.city = '上海'  // ⚠️ 警告，不生效

// shallowReadonly：浅层只读
const shallowState = shallowReadonly(state)
shallowState.name = '李四'           // ⚠️ 警告，不生效
shallowState.address.city = '上海'   // ✅ 可以修改（深层不受限）

// 实际应用：provide 只读数据
provide('config', readonly(appConfig))`
    },
    {
      id: 'v3c022',
      title: 'Vue3 中 effectScope 是什么？有什么用？',
      difficulty: 3,
      tags: ['effectScope', '高级API', '响应式'],
      answer: `## effectScope

### 定义
\`effectScope\` 用于创建一个**副作用作用域**，可以批量收集和停止其中创建的所有响应式副作用（computed、watch、watchEffect）。

### 解决的问题
在组合式函数中创建了多个 watch/computed，组件卸载时需要逐个清理。effectScope 可以一次性停止所有副作用。

### 使用场景
1. **组合式函数库**：封装可复用逻辑时统一管理副作用
2. **Pinia 内部**：每个 store 就是一个 effectScope
3. **手动控制副作用生命周期**`,
      code: `import { effectScope, ref, computed, watch } from 'vue'

const scope = effectScope()

scope.run(() => {
  const count = ref(0)
  const double = computed(() => count.value * 2)

  watch(count, (val) => {
    console.log('count changed:', val)
  })

  // 这些副作用都被 scope 收集了
})

// 一次性停止所有副作用
scope.stop() // computed、watch 全部清理`
    },
    {
      id: 'v3c023',
      title: 'Vue3 中 Fragments 是什么？解决了什么问题？',
      difficulty: 1,
      tags: ['Fragments', '多根节点', '新特性'],
      answer: `## Fragments（片段）

### Vue2 的限制
Vue2 中每个组件模板**必须有且只有一个根元素**，否则编译报错。

### Vue3 的改进
Vue3 支持**多根节点**（Fragments），组件模板可以有多个根元素，编译器会自动将它们包裹在一个虚拟的 Fragment 节点中。

### 优势
1. 减少不必要的 DOM 嵌套
2. 更灵活的组件结构
3. 更好的语义化 HTML

### 注意事项
- 多根节点组件无法自动继承 \`attrs\`，需要手动绑定 \`v-bind="$attrs"\`
- 如果只有一个根节点，attrs 会自动继承`,
      code: `<!-- Vue2：必须单根节点 -->
<template>
  <div> <!-- 多余的包裹层 -->
    <header>头部</header>
    <main>内容</main>
    <footer>底部</footer>
  </div>
</template>

<!-- Vue3：支持多根节点 -->
<template>
  <header>头部</header>
  <main>内容</main>
  <footer>底部</footer>
</template>

<!-- 多根节点时手动绑定 attrs -->
<template>
  <header>头部</header>
  <main v-bind="$attrs">内容</main>
</template>`
    },
    {
      id: 'v3c024',
      title: 'Vue3 中 Transition 和 TransitionGroup 怎么用？',
      difficulty: 2,
      tags: ['Transition', '动画', '过渡'],
      answer: `## Transition / TransitionGroup

### Transition
用于单个元素/组件的进入和离开过渡动画。

### 过渡类名（6个阶段）
- \`v-enter-from\` → \`v-enter-active\` → \`v-enter-to\`（进入）
- \`v-leave-from\` → \`v-leave-active\` → \`v-leave-to\`（离开）

### TransitionGroup
用于列表中多个元素的过渡，额外支持 \`v-move\` 类名处理元素位移动画。

### 与 CSS 动画库配合
可以通过 \`enter-active-class\` 等属性直接使用 Animate.css 等第三方动画库。`,
      code: `<!-- 基本过渡 -->
<Transition name="fade">
  <p v-if="show">Hello</p>
</Transition>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>

<!-- 列表过渡 -->
<TransitionGroup name="list" tag="ul">
  <li v-for="item in items" :key="item.id">
    {{ item.text }}
  </li>
</TransitionGroup>

<style>
.list-enter-active, .list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.list-move { transition: transform 0.5s ease; }
</style>`
    },
    {
      id: 'v3c025',
      title: 'Vue3 中 app.use() 插件机制是怎样的？如何写一个插件？',
      difficulty: 2,
      tags: ['插件', 'app.use', '全局API'],
      answer: `## Vue3 插件机制

### 插件的定义
插件是一个拥有 \`install\` 方法的对象，或者直接是一个 install 函数。

### install 方法接收的参数
1. \`app\`：应用实例
2. \`options\`：用户传入的配置选项

### 插件能做什么
- 注册全局组件（\`app.component\`）
- 注册全局指令（\`app.directive\`）
- 注册全局属性（\`app.config.globalProperties\`）
- 通过 provide 注入全局数据
- 添加全局 mixin（不推荐）`,
      code: `// 定义插件
const MyPlugin = {
  install(app, options) {
    // 1. 注册全局组件
    app.component('MyButton', MyButton)

    // 2. 注册全局指令
    app.directive('focus', {
      mounted(el) { el.focus() }
    })

    // 3. 注册全局属性
    app.config.globalProperties.$http = axios

    // 4. provide 注入
    app.provide('apiBase', options.apiBase || '/api')
  }
}

// 使用插件
import { createApp } from 'vue'
const app = createApp(App)
app.use(MyPlugin, { apiBase: 'https://api.example.com' })
app.mount('#app')`
    },
    {
      id: 'v3c027',
      title: 'Vue3 中 Fragments 是什么？解决了什么问题？',
      difficulty: 1,
      tags: ['Fragments', '多根节点', '新特性'],
      answer: `## Fragments（片段）

### Vue2 的限制
每个组件模板**必须有且只有一个根元素**，否则编译报错。

### Vue3 的改进
组件可以有**多个根节点**，编译器会自动将它们包裹在一个 Fragment 中。Fragment 是一个虚拟节点，不会渲染为真实 DOM 元素。

### 优势
1. 减少不必要的 DOM 嵌套
2. 更灵活的模板结构
3. 减小 DOM 树深度，提升渲染性能

### 注意事项
- 多根节点组件无法自动继承 attrs，需要手动绑定 \`v-bind="$attrs"\`
- 如果只有一个根节点，attrs 会自动继承`,
      code: `<!-- Vue2：必须单根节点 -->
<template>
  <div> <!-- 多余的包裹层 -->
    <header>头部</header>
    <main>内容</main>
    <footer>底部</footer>
  </div>
</template>

<!-- Vue3：支持多根节点 -->
<template>
  <header>头部</header>
  <main>内容</main>
  <footer>底部</footer>
</template>

<!-- 多根节点时手动绑定 attrs -->
<template>
  <header v-bind="$attrs">头部</header>
  <main>内容</main>
</template>`
    },
    {
      id: 'v3c028',
      title: 'Vue3 中 Transition 和 TransitionGroup 怎么用？',
      difficulty: 2,
      tags: ['Transition', '动画', '过渡'],
      answer: `## Transition / TransitionGroup

### Transition
用于**单个元素/组件**的进入和离开过渡动画。

### 过渡类名（6个阶段）
- 进入：\`v-enter-from\` → \`v-enter-active\` → \`v-enter-to\`
- 离开：\`v-leave-from\` → \`v-leave-active\` → \`v-leave-to\`

### TransitionGroup
用于**列表**的过渡动画，渲染为真实 DOM 元素（默认 \`<span>\`）。
- 支持 \`move\` 类名处理元素位移动画
- 每个子元素必须有唯一的 \`key\`

### 过渡模式
- \`mode="out-in"\`：先离开再进入（推荐）
- \`mode="in-out"\`：先进入再离开`,
      code: `<!-- 基本过渡 -->
<Transition name="fade">
  <p v-if="show">Hello</p>
</Transition>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>

<!-- 列表过渡 -->
<TransitionGroup name="list" tag="ul">
  <li v-for="item in items" :key="item.id">
    {{ item.text }}
  </li>
</TransitionGroup>

<style>
.list-enter-active, .list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.list-move { transition: transform 0.3s ease; }
</style>`
    },
    {
      id: 'v3c029',
      title: 'Vue3 中模板 ref 怎么获取 DOM 元素和子组件实例？',
      difficulty: 2,
      tags: ['ref', 'DOM', '模板引用', '高频'],
      answer: `## 模板 ref

### 获取 DOM 元素
在 \`<script setup>\` 中声明一个同名的 ref 变量，Vue 会自动将 DOM 元素赋值给它。

### 获取子组件实例
同样使用 ref，但子组件需要通过 \`defineExpose\` 暴露方法/属性。

### 注意事项
1. ref 在 \`onMounted\` 之后才有值（DOM 挂载后）
2. \`v-for\` 中的 ref 会收集为数组
3. 动态 ref 可以用函数形式 \`:ref="(el) => {}"\``,
      code: `<script setup>
import { ref, onMounted } from 'vue'

// 获取 DOM 元素
const inputRef = ref<HTMLInputElement>()

onMounted(() => {
  inputRef.value?.focus() // 自动聚焦
})

// 获取子组件实例
const childRef = ref()
function callChild() {
  childRef.value?.sayHello() // 调用子组件方法
}
</script>

<template>
  <input ref="inputRef" />
  <ChildComponent ref="childRef" />
</template>

<!-- v-for 中的 ref -->
<script setup>
const itemRefs = ref<HTMLElement[]>([])
</script>
<template>
  <div v-for="item in list" :ref="(el) => { if(el) itemRefs.push(el) }">
    {{ item }}
  </div>
</template>`
    },
    {
      id: 'v3c030',
      title: 'Vue3 和 React 有什么区别？各自的优缺点？',
      difficulty: 3,
      tags: ['Vue3', 'React', '对比', '高频'],
      answer: `## Vue3 vs React

### 核心理念
- **Vue**：渐进式框架，模板语法，响应式数据驱动
- **React**：UI 库，JSX 语法，不可变数据 + 单向数据流

### 响应式机制
- **Vue3**：基于 Proxy 的自动依赖追踪，数据变化自动更新视图
- **React**：手动调用 setState/useState 触发重新渲染，需要手动优化（memo/useMemo）

### 模板 vs JSX
- **Vue**：模板语法更直观，编译时优化（静态提升、补丁标记）
- **React**：JSX 更灵活，纯 JavaScript 表达力强

### 状态管理
- **Vue**：Pinia（官方推荐），简单直观
- **React**：Redux/Zustand/Jotai，选择多但学习成本高

### 性能优化
- **Vue**：编译时自动优化，开发者无需过多关注
- **React**：需要手动使用 memo、useMemo、useCallback 避免不必要的重渲染

### 学习曲线
- **Vue**：上手快，文档友好，适合中小型项目快速开发
- **React**：概念多（Hooks、Fiber、Concurrent），但生态更丰富

### 适用场景
- **Vue**：中后台管理系统、快速原型、团队 JS 基础参差不齐
- **React**：大型复杂应用、跨平台（React Native）、团队 JS 功底扎实`,
      code: `// Vue3 — 响应式自动追踪
const count = ref(0)
const double = computed(() => count.value * 2)
// count 变化时 double 自动更新，无需手动优化

// React — 需要手动声明依赖
const [count, setCount] = useState(0)
const double = useMemo(() => count * 2, [count])
// 必须手动传入 [count] 依赖数组

// Vue3 — 模板语法
// <div v-for="item in list" :key="item.id">{{ item.name }}</div>

// React — JSX
// {list.map(item => <div key={item.id}>{item.name}</div>)}`
    }
  ]
}

export default vue3Core

