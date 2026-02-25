import type { Category } from '../types'

const vue2: Category = {
  id: 'vue2',
  name: 'Vue2 经典',
  icon: '🟢',
  description: '双向绑定原理、Vuex、mixins、keep-alive、nextTick',
  questions: [
    {
      id: 'v2001',
      title: 'Vue2 的双向绑定原理是什么？',
      difficulty: 3,
      tags: ['双向绑定', 'defineProperty', '原理', '高频'],
      answer: `## Vue2 双向绑定原理

Vue2 采用 **数据劫持 + 发布订阅模式** 实现双向绑定：

### 核心流程
1. **Observer（数据劫持）**：递归遍历 data，用 \`Object.defineProperty\` 给每个属性添加 getter/setter
2. **Dep（依赖收集器）**：每个属性对应一个 Dep 实例，收集依赖该属性的 Watcher
3. **Watcher（观察者）**：组件渲染时触发 getter → 收集依赖；数据变化时触发 setter → 通知 Watcher 更新
4. **Compiler（模板编译）**：解析模板中的指令和插值，绑定对应的 Watcher

### 局限性
- 无法监听对象属性的新增/删除（需要 Vue.set）
- 无法原生监听数组索引变化（重写了 push/pop 等7个方法）
- 初始化时递归遍历所有属性，性能开销大`,
      code: `// 简化版 defineProperty 实现
function defineReactive(obj, key, val) {
  const dep = new Dep()
  Object.defineProperty(obj, key, {
    get() {
      if (Dep.target) dep.addSub(Dep.target) // 收集依赖
      return val
    },
    set(newVal) {
      if (newVal === val) return
      val = newVal
      dep.notify() // 通知更新
    }
  })
}`
    },
    {
      id: 'v2002',
      title: 'Vue2 中 nextTick 的原理是什么？',
      difficulty: 2,
      tags: ['nextTick', '异步更新', '高频'],
      answer: `## nextTick 原理

### 为什么需要 nextTick？
Vue2 的 DOM 更新是**异步**的。修改数据后，DOM 不会立即更新，而是在下一个"tick"中批量更新。

### 实现原理
nextTick 本质是一个**微任务/宏任务**的降级策略：
1. \`Promise.then\`（微任务，优先）
2. \`MutationObserver\`（微任务）
3. \`setImmediate\`（宏任务，IE）
4. \`setTimeout(fn, 0)\`（宏任务，兜底）

### 使用场景
- 修改数据后需要立即操作更新后的 DOM
- 在 created 钩子中操作 DOM`,
      code: `// 使用场景
this.message = '更新了'
// DOM 还没更新
this.$nextTick(() => {
  // DOM 已经更新
  console.log(this.$refs.msg.textContent) // '更新了'
})`
    },
    {
      id: 'v2003',
      title: 'Vue2 中 keep-alive 的作用和原理？',
      difficulty: 2,
      tags: ['keep-alive', '缓存', '高频'],
      answer: `## keep-alive

### 作用
\`<keep-alive>\` 是 Vue 内置组件，用于**缓存不活动的组件实例**，避免重复渲染，保留组件状态。

### 核心属性
- \`include\`：只缓存匹配的组件（字符串/正则/数组）
- \`exclude\`：不缓存匹配的组件
- \`max\`：最大缓存数量（超出时使用 LRU 策略淘汰）

### 生命周期
被缓存的组件会触发两个额外的钩子：
- \`activated\`：组件从缓存中恢复时调用
- \`deactivated\`：组件进入缓存时调用

### 原理
- 内部维护一个 \`cache\` 对象和 \`keys\` 数组
- 首次渲染时将组件 VNode 存入 cache
- 再次渲染时直接从 cache 取出，跳过 mount 过程
- 使用 LRU（最近最少使用）算法管理缓存`,
      code: `<!-- 基本用法 -->
<keep-alive>
  <component :is="currentComponent" />
</keep-alive>

<!-- 配合路由使用 -->
<router-view v-slot="{ Component }">
  <keep-alive include="Home,About" :max="10">
    <component :is="Component" />
  </keep-alive>
</router-view>

<!-- 生命周期 -->
<script>
export default {
  activated() {
    console.log('从缓存恢复，可以刷新数据')
  },
  deactivated() {
    console.log('进入缓存，可以清理定时器')
  }
}
</script>`
    },
    {
      id: 'v2004',
      title: 'Vue2 中 mixins 有什么问题？Vue3 如何替代？',
      difficulty: 2,
      tags: ['mixins', 'Composition API', '对比'],
      answer: `## Mixins 的问题

### 1. 命名冲突
多个 mixin 可能定义同名的 data、methods，合并规则复杂且不直观。

### 2. 来源不清晰
组件中使用 \`this.xxx\`，无法直观判断这个属性来自哪个 mixin。

### 3. 隐式依赖
mixin 之间可能互相依赖，但这种依赖关系是隐式的。

### 4. 类型推导困难
TypeScript 很难推导 mixin 注入的属性类型。

### Vue3 替代方案：Composable 函数
- 明确的导入导出，来源清晰
- 不存在命名冲突（变量可重命名）
- 完美的 TypeScript 支持
- 可以传参，更灵活`,
      code: `// Vue2 mixin — 问题多
const myMixin = {
  data() { return { count: 0 } },
  methods: { increment() { this.count++ } }
}
export default {
  mixins: [myMixin], // count 从哪来？不直观
}

// Vue3 composable — 清晰明了
import { ref } from 'vue'
export function useCounter(initial = 0) {
  const count = ref(initial)
  const increment = () => count.value++
  return { count, increment }
}

// 使用时
import { useCounter } from './useCounter'
const { count, increment } = useCounter(10) // 来源一目了然`
    },
    {
      id: 'v2005',
      title: 'Vuex 的核心概念和工作流程？',
      difficulty: 2,
      tags: ['Vuex', '状态管理', '高频'],
      answer: `## Vuex 核心概念

### 五大核心
1. **State**：单一状态树，存储所有共享数据
2. **Getters**：从 state 派生的计算属性
3. **Mutations**：唯一修改 state 的方式（同步）
4. **Actions**：处理异步操作，提交 mutation
5. **Modules**：将 store 分割成模块

### 工作流程
\`\`\`
组件 dispatch → Action（异步）→ commit → Mutation（同步）→ 修改 State → 响应式更新视图
\`\`\`

### 严格模式
开启后，直接修改 state（不通过 mutation）会抛出错误，仅在开发环境使用。`,
      code: `// Vuex Store
const store = new Vuex.Store({
  state: { count: 0 },
  getters: {
    doubleCount: state => state.count * 2
  },
  mutations: {
    INCREMENT(state, payload) {
      state.count += payload
    }
  },
  actions: {
    async incrementAsync({ commit }, amount) {
      await new Promise(r => setTimeout(r, 1000))
      commit('INCREMENT', amount)
    }
  }
})

// 组件中使用
this.$store.dispatch('incrementAsync', 5)`
    },
    {
      id: 'v2006',
      title: 'Vue2 中 $set 和 $delete 的作用？为什么需要它们？',
      difficulty: 2,
      tags: ['$set', '响应式', '原理'],
      answer: `## $set 和 $delete

### 为什么需要？
Vue2 使用 Object.defineProperty 实现响应式，有两个局限：
1. **无法检测对象属性的新增**
2. **无法检测对象属性的删除**

### Vue.set / this.$set
向响应式对象添加新属性，并确保新属性也是响应式的，同时触发视图更新。

### Vue.delete / this.$delete
删除对象属性并触发视图更新。

### 数组的特殊处理
Vue2 无法检测以下数组变化：
- 通过索引直接设置值：\`arr[0] = newVal\`
- 修改数组长度：\`arr.length = 0\`

需要用 \`$set\` 或数组变异方法（push/splice等）替代。`,
      code: `// 对象新增属性
this.user.age = 25 // ❌ 不是响应式的
this.$set(this.user, 'age', 25) // ✅ 响应式

// 对象删除属性
delete this.user.age // ❌ 不触发更新
this.$delete(this.user, 'age') // ✅ 触发更新

// 数组修改
this.list[0] = 'new' // ❌ 不触发更新
this.$set(this.list, 0, 'new') // ✅ 触发更新
this.list.splice(0, 1, 'new')  // ✅ 触发更新

// Vue3 中不再需要，Proxy 原生支持`
    },
    {
      id: 'v2007',
      title: 'Vue2 的 computed 和 watch 有什么区别？',
      difficulty: 1,
      tags: ['computed', 'watch', '高频'],
      answer: `## computed vs watch

### computed（计算属性）
- 基于依赖**缓存**，依赖不变则不重新计算
- 必须有返回值
- 不能执行异步操作
- 适合：从已有数据派生新数据（如全名 = 姓 + 名）

### watch（侦听器）
- 没有缓存，数据变化就执行
- 不需要返回值
- 可以执行异步操作
- 适合：数据变化时执行副作用（如发请求、操作 DOM）

### 使用建议
- 能用 computed 就用 computed（有缓存，性能更好）
- 需要副作用（异步、DOM操作）时用 watch`,
      code: `export default {
  data() {
    return { firstName: '张', lastName: '三', keyword: '' }
  },
  // computed：有缓存，同步
  computed: {
    fullName() {
      return this.firstName + this.lastName
    }
  },
  // watch：无缓存，可异步
  watch: {
    keyword(newVal) {
      // 搜索关键词变化时发请求（防抖）
      this.debouncedSearch(newVal)
    }
  }
}`
    },
    {
      id: 'v2008',
      title: 'Vue2 组件通信有哪些方式？',
      difficulty: 2,
      tags: ['组件通信', '高频'],
      answer: `## Vue2 组件通信方式

### 1. props / $emit（父子）
最基本的通信方式，父传子用 props，子传父用 $emit。

### 2. $parent / $children（父子）
直接访问父/子组件实例，不推荐使用（耦合度高）。

### 3. $refs（父访问子）
通过 ref 获取子组件实例，调用其方法或访问数据。

### 4. provide / inject（跨层级）
祖先组件 provide 数据，后代组件 inject 接收。Vue2 中默认不是响应式的。

### 5. EventBus（任意组件）
创建一个空的 Vue 实例作为事件总线，通过 $on/$emit 通信。Vue3 中已移除，推荐用 mitt。

### 6. Vuex（全局状态）
集中式状态管理，适合大型应用。

### 7. $attrs / $listeners（跨层级透传）
将父组件传递的非 prop 属性和事件透传给子组件。`,
      code: `// EventBus 示例
const bus = new Vue()

// 组件A：发送事件
bus.$emit('user-login', { name: '张三' })

// 组件B：监听事件
bus.$on('user-login', (user) => {
  console.log(user.name)
})

// $attrs / $listeners 透传
// 父组件
<Child :name="name" :age="age" @click="handleClick" />

// Child 组件（透传给 GrandChild）
<GrandChild v-bind="$attrs" v-on="$listeners" />`
    },
    {
      id: 'v2009',
      title: 'Vue2 的 v-model 原理是什么？',
      difficulty: 2,
      tags: ['v-model', '双向绑定', '语法糖'],
      answer: `## v-model 原理

### 本质
v-model 是一个**语法糖**，等价于 \`:value\` + \`@input\` 的组合。

### 在原生元素上
\`<input v-model="msg">\` 等价于：
\`<input :value="msg" @input="msg = $event.target.value">\`

### 在组件上
\`<MyInput v-model="msg">\` 等价于：
\`<MyInput :value="msg" @input="msg = $event">\`

### 自定义 v-model（Vue2）
通过 \`model\` 选项可以自定义 prop 名和事件名。

### Vue3 的变化
- 默认 prop 改为 \`modelValue\`，事件改为 \`update:modelValue\`
- 支持多个 v-model：\`v-model:title="title"\``,
      code: `<!-- Vue2 自定义组件 v-model -->
<script>
export default {
  model: {
    prop: 'checked',    // 自定义 prop 名
    event: 'change'     // 自定义事件名
  },
  props: ['checked'],
  methods: {
    toggle() {
      this.$emit('change', !this.checked)
    }
  }
}
</script>

<!-- Vue3 多个 v-model -->
<UserForm v-model:name="userName" v-model:age="userAge" />

<!-- UserForm 组件 -->
<script setup>
defineProps(['name', 'age'])
const emit = defineEmits(['update:name', 'update:age'])
</script>`
    },
    {
      id: 'v2010',
      title: 'Vue2 中 slot 的用法和原理？',
      difficulty: 2,
      tags: ['slot', '插槽', '组件'],
      answer: `## Vue2 插槽

### 默认插槽
父组件传入的内容渲染到子组件的 \`<slot>\` 位置。

### 具名插槽
通过 \`name\` 属性区分多个插槽，父组件用 \`v-slot:name\` 或 \`slot="name"\`（已废弃）指定。

### 作用域插槽
子组件通过 \`<slot :data="item">\` 向父组件传递数据，父组件用 \`v-slot="slotProps"\` 接收。

### 原理
- 默认插槽和具名插槽编译为 \`_t(name)\` 函数调用
- 作用域插槽编译为函数，子组件调用时传入数据
- Vue2.6+ 统一使用 \`v-slot\` 指令`,
      code: `<!-- 子组件 MyList.vue -->
<template>
  <ul>
    <li v-for="item in list" :key="item.id">
      <!-- 作用域插槽：向父组件暴露 item -->
      <slot :item="item" :index="index">
        {{ item.name }} <!-- 默认内容 -->
      </slot>
    </li>
  </ul>
</template>

<!-- 父组件使用 -->
<MyList :list="users">
  <template v-slot="{ item }">
    <span>{{ item.name }} - {{ item.age }}岁</span>
  </template>
</MyList>`
    },
    {
      id: 'v2011',
      title: 'Vue2 中自定义指令怎么写？',
      difficulty: 2,
      tags: ['自定义指令', 'directive'],
      answer: `## Vue2 自定义指令

### 钩子函数
- \`bind\`：指令第一次绑定到元素时（只调用一次）
- \`inserted\`：元素插入父节点时
- \`update\`：组件 VNode 更新时
- \`componentUpdated\`：组件 VNode 及子 VNode 全部更新后
- \`unbind\`：指令与元素解绑时（只调用一次）

### 钩子参数
- \`el\`：绑定的 DOM 元素
- \`binding\`：包含 value、oldValue、arg、modifiers 等
- \`vnode\`：虚拟节点

### 常见应用
- 自动聚焦（v-focus）
- 权限控制（v-permission）
- 点击外部关闭（v-click-outside）
- 懒加载（v-lazy）`,
      code: `// 全局注册
Vue.directive('focus', {
  inserted(el) {
    el.focus()
  }
})

// 局部注册
export default {
  directives: {
    clickOutside: {
      bind(el, binding) {
        el._handler = (e) => {
          if (!el.contains(e.target)) {
            binding.value(e) // 执行传入的回调
          }
        }
        document.addEventListener('click', el._handler)
      },
      unbind(el) {
        document.removeEventListener('click', el._handler)
      }
    }
  }
}

// 使用
// <input v-focus />
// <div v-click-outside="handleClose">弹窗内容</div>`
    },
    {
      id: 'v2012',
      title: 'Vue2 中 $attrs 和 $listeners 的作用？',
      difficulty: 2,
      tags: ['$attrs', '$listeners', '组件通信'],
      answer: `## $attrs 和 $listeners

### $attrs
包含父组件传入的、但子组件没有在 \`props\` 中声明的属性（class 和 style 除外）。

### $listeners
包含父组件传入的所有事件监听器（不含 .native 修饰符的）。

### 应用场景
**二次封装组件**时，将父组件的属性和事件透传给内部组件，避免逐个声明 props 和 emit。

### Vue3 的变化
- Vue3 中 \`$listeners\` 被移除，合并到 \`$attrs\` 中
- Vue3 中 \`$attrs\` 包含 class 和 style`,
      code: `<!-- 二次封装 el-input -->
<template>
  <div class="my-input">
    <label>{{ label }}</label>
    <!-- 透传所有属性和事件 -->
    <el-input v-bind="$attrs" v-on="$listeners" />
  </div>
</template>

<script>
export default {
  // 禁止自动继承 attrs 到根元素
  inheritAttrs: false,
  props: ['label'] // 只声明自己需要的
}
</script>

<!-- 使用时 -->
<MyInput
  label="用户名"
  v-model="name"
  placeholder="请输入"
  @blur="handleBlur"
/>
<!-- placeholder 和 @blur 会透传给内部的 el-input -->`
    },
    {
      id: 'v2013',
      title: 'Vue2 中 render 函数和 JSX 怎么用？',
      difficulty: 3,
      tags: ['render', 'JSX', '高级'],
      answer: `## Render 函数

### 为什么需要 render 函数？
模板语法无法满足某些动态场景（如根据 level 渲染不同标签的标题组件），render 函数提供完全的 JavaScript 编程能力。

### createElement (h)
\`h(tag, data, children)\` 创建虚拟节点：
- \`tag\`：标签名/组件
- \`data\`：属性、事件、class、style 等
- \`children\`：子节点

### JSX
Render 函数的语法糖，需要 babel 插件支持。写法更接近模板，可读性更好。`,
      code: `// render 函数
export default {
  props: ['level'],
  render(h) {
    return h(
      'h' + this.level, // 动态标签：h1, h2, h3...
      { class: 'title' },
      this.$slots.default // 子内容
    )
  }
}

// JSX 写法（需要 @vue/babel-preset-jsx）
export default {
  props: ['level'],
  render() {
    const Tag = 'h' + this.level
    return <Tag class="title">{this.$slots.default}</Tag>
  }
}`
    }
  ]
}

export default vue2

