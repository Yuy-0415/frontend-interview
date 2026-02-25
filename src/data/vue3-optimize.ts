import type { Category } from '../types'

const vue3Optimize: Category = {
  id: 'vue3-optimize',
  name: 'Vue3 性能优化',
  icon: '🚀',
  description: '编译优化、Tree-shaking、虚拟DOM、diff算法、组件优化',
  questions: [
    {
      id: 'vo001',
      title: 'Vue3 在编译阶段做了哪些优化？',
      difficulty: 3,
      tags: ['编译优化', '性能', '高频'],
      answer: `## Vue3 编译优化

### 1. 静态提升（Static Hoisting）
将静态节点提升到渲染函数外部，避免每次渲染都重新创建

### 2. 补丁标记（Patch Flags）
在编译时为动态节点添加标记，运行时只对比有标记的节点

### 3. 树结构打平（Block Tree）
将模板编译为扁平的 Block 结构，跳过静态节点的对比

### 4. 缓存事件处理函数
内联事件处理函数会被缓存，避免子组件不必要的更新

### 5. SSR 优化
静态内容直接输出字符串，跳过虚拟 DOM 创建`,
      code: `<!-- 模板 -->
<div>
  <p>静态文本</p>           <!-- 静态提升，只创建一次 -->
  <p>{{ message }}</p>      <!-- 补丁标记：TEXT = 1 -->
  <p :class="cls">动态</p> <!-- 补丁标记：CLASS = 2 -->
</div>

<!-- 编译后（简化） -->
const _hoisted = createVNode("p", null, "静态文本") // 提升到外部

function render() {
  return openBlock(), createBlock("div", null, [
    _hoisted,  // 直接复用，不重新创建
    createVNode("p", null, toDisplayString(message), 1 /* TEXT */),
    createVNode("p", { class: cls }, "动态", 2 /* CLASS */)
  ])
}`
    },
    {
      id: 'vo002',
      title: 'Vue3 的 diff 算法和 Vue2 有什么区别？',
      difficulty: 3,
      tags: ['diff算法', '虚拟DOM', '高频'],
      answer: `## Vue3 diff 算法改进

### Vue2 的 diff（双端对比）
- 头头、尾尾、头尾、尾头 四种对比方式
- 找不到则遍历查找

### Vue3 的 diff（最长递增子序列）
1. 先处理头部相同节点
2. 再处理尾部相同节点
3. 中间部分使用**最长递增子序列（LIS）**算法
4. 最大限度减少 DOM 移动操作

### 关键优化
- 结合 Patch Flags，跳过静态节点对比
- 使用 LIS 算法减少节点移动次数
- 编译时标记动态节点，运行时精准更新`,
    },
    {
      id: 'vo003',
      title: '在 Vue3 中有哪些常用的性能优化手段？',
      difficulty: 2,
      tags: ['性能优化', '实战', '高频'],
      answer: `## Vue3 性能优化手段

### 组件层面
- \`v-once\`：只渲染一次的静态内容
- \`v-memo\`：有条件地跳过子树更新
- \`shallowRef / shallowReactive\`：浅层响应式，大对象优化
- \`computed\` 缓存：避免重复计算

### 渲染层面
- 虚拟列表：大数据量列表使用 virtual-scroll
- 异步组件 + Suspense：按需加载
- \`<KeepAlive>\`：缓存组件状态

### 打包层面
- 路由懒加载：代码分割
- Tree-shaking：按需引入 API
- 图片懒加载、CDN 加速`,
      code: `<!-- v-memo 示例：只在 id 变化时重新渲染 -->
<div v-for="item in list" :key="item.id" v-memo="[item.id]">
  {{ item.name }}
</div>

<!-- 异步组件 -->
<script setup>
import { defineAsyncComponent } from 'vue'
const HeavyChart = defineAsyncComponent(() => import('./HeavyChart.vue'))
</script>

<template>
  <Suspense>
    <HeavyChart />
    <template #fallback>加载中...</template>
  </Suspense>
</template>`
    },
    {
      id: 'vo004',
      title: 'Vue3 的 Tree-shaking 是怎么实现的？',
      difficulty: 2,
      tags: ['Tree-shaking', '打包优化'],
      answer: `## Vue3 Tree-shaking

### 什么是 Tree-shaking？
Tree-shaking 是一种**死代码消除**技术，打包时自动移除未使用的代码，减小最终产物体积。

### Vue3 如何支持 Tree-shaking？
Vue3 将所有 API 改为**具名导出（Named Export）**，而非挂载在全局 Vue 对象上：
- Vue2：\`Vue.nextTick()\`、\`Vue.set()\` → 全部打包
- Vue3：\`import { nextTick } from 'vue'\` → 按需打包

### 效果
- Vue3 最小打包体积约 **10KB**（gzip），Vue2 约 23KB
- 未使用的 API（如 Teleport、Suspense、Transition）不会被打包

### 前提条件
- 使用 ES Module 语法（import/export）
- 打包工具支持（Vite/Webpack 5+/Rollup）
- 代码没有副作用（或正确标记 sideEffects）`,
      code: `// Vue2 — 全量引入，无法 tree-shake
import Vue from 'vue'
Vue.nextTick(() => {})

// Vue3 — 按需引入，未使用的 API 会被移除
import { ref, computed, nextTick } from 'vue'
// 如果没用 Teleport、Suspense，它们不会出现在最终产物中

// vite.config.ts 中无需额外配置，Vite 天然支持 tree-shaking`
    },
    {
      id: 'vo005',
      title: '什么是虚拟 DOM？它的优缺点是什么？',
      difficulty: 2,
      tags: ['虚拟DOM', 'VNode', '高频'],
      answer: `## 虚拟 DOM

### 定义
虚拟 DOM 是用 **JavaScript 对象**来描述真实 DOM 结构的一种抽象表示。每次数据变化时，先生成新的虚拟 DOM 树，与旧树进行 diff 对比，最后只将差异部分应用到真实 DOM。

### 优点
1. **跨平台**：虚拟 DOM 是 JS 对象，可以渲染到不同平台（浏览器、SSR、Native）
2. **批量更新**：将多次 DOM 操作合并为一次，减少重排重绘
3. **声明式编程**：开发者只关心数据，框架负责 DOM 操作
4. **diff 优化**：只更新变化的部分，而非整体替换

### 缺点
1. **额外开销**：创建和对比虚拟 DOM 本身有性能成本
2. **不适合极简场景**：简单的 DOM 操作，直接操作真实 DOM 更快
3. **首次渲染**：首次渲染比直接操作 DOM 慢（需要创建虚拟 DOM + diff + 渲染）

### Vue3 的优化
通过编译时标记（Patch Flags）+ 静态提升，大幅减少了运行时 diff 的工作量`,
      code: `// 虚拟 DOM 的 JS 对象表示（VNode）
const vnode = {
  tag: 'div',
  props: { class: 'container', id: 'app' },
  children: [
    { tag: 'h1', children: 'Hello' },
    { tag: 'p', props: { class: 'text' }, children: 'World' }
  ]
}

// 对应的真实 DOM
// <div class="container" id="app">
//   <h1>Hello</h1>
//   <p class="text">World</p>
// </div>`
    },
    {
      id: 'vo006',
      title: 'KeepAlive 的原理是什么？怎么使用？',
      difficulty: 2,
      tags: ['KeepAlive', '缓存', '性能优化'],
      answer: `## KeepAlive 组件

### 作用
\`<KeepAlive>\` 用于**缓存组件实例**，避免组件被销毁和重新创建，保留组件状态。

### 原理
- 内部维护一个缓存对象（Map），以组件的 key 或 name 为键
- 组件切走时不销毁，而是存入缓存
- 组件切回时从缓存中恢复，触发 activated 钩子
- 支持 \`include\`/\`exclude\` 控制哪些组件需要缓存
- 支持 \`max\` 限制缓存数量（LRU 策略淘汰最久未使用的）

### 生命周期
- \`onActivated\`：组件从缓存中恢复时触发
- \`onDeactivated\`：组件进入缓存时触发`,
      code: `<template>
  <!-- 缓存所有组件 -->
  <KeepAlive>
    <component :is="currentTab" />
  </KeepAlive>

  <!-- 只缓存指定组件 -->
  <KeepAlive include="Home,About">
    <router-view />
  </KeepAlive>

  <!-- 最多缓存10个 -->
  <KeepAlive :max="10">
    <router-view />
  </KeepAlive>
</template>

<script setup>
import { onActivated, onDeactivated } from 'vue'

onActivated(() => {
  console.log('从缓存恢复，可以刷新数据')
})
onDeactivated(() => {
  console.log('进入缓存，可以暂停定时器')
})
</script>`
    },
    {
      id: 'vo007',
      title: 'v-once 和 v-memo 有什么区别？',
      difficulty: 2,
      tags: ['v-once', 'v-memo', '渲染优化'],
      answer: `## v-once vs v-memo

### v-once
- 元素和组件只渲染**一次**，后续更新完全跳过
- 适合纯静态内容，永远不会变化的部分
- 使用简单，无需参数

### v-memo（Vue 3.2+）
- 接收一个依赖数组，只有依赖变化时才重新渲染
- 类似 React 的 \`useMemo\`
- 适合**有条件更新**的场景，比如大列表中只有选中项需要更新

### 使用建议
- 纯静态内容 → \`v-once\`
- 大列表 + 条件更新 → \`v-memo\`
- 不要滥用，大多数场景 Vue 的默认优化已经足够`,
      code: `<!-- v-once：只渲染一次 -->
<h1 v-once>{{ title }}</h1>
<!-- title 变化后，这个 h1 不会更新 -->

<!-- v-memo：依赖变化时才更新 -->
<div v-for="item in list" :key="item.id"
  v-memo="[item.id === selectedId]"
>
  <p>{{ item.name }}</p>
  <p v-if="item.id === selectedId">✅ 选中</p>
</div>
<!-- 只有 selectedId 变化影响到的项才会重新渲染 -->`
    },
    {
      id: 'vo008',
      title: 'shallowRef 和 shallowReactive 是什么？什么时候用？',
      difficulty: 2,
      tags: ['shallowRef', 'shallowReactive', '性能优化'],
      answer: `## 浅层响应式

### shallowRef
- 只有 \`.value\` 的赋值是响应式的
- \`.value\` 内部的属性变化**不会触发更新**
- 适合：大对象整体替换的场景

### shallowReactive
- 只有第一层属性是响应式的
- 嵌套对象的属性变化**不会触发更新**
- 适合：只关心顶层属性变化的场景

### 使用场景
- 大型数据对象（如地图数据、图表数据）
- 第三方库返回的复杂对象
- 性能敏感的场景，避免深层递归代理的开销`,
      code: `import { shallowRef, shallowReactive, triggerRef } from 'vue'

// shallowRef
const bigData = shallowRef({ list: [1, 2, 3] })
bigData.value.list.push(4) // ❌ 不会触发更新
bigData.value = { list: [1, 2, 3, 4] } // ✅ 整体替换才触发

// 手动触发更新
bigData.value.list.push(4)
triggerRef(bigData) // 强制触发更新

// shallowReactive
const state = shallowReactive({
  name: '张三',       // ✅ 响应式
  address: {
    city: '北京'      // ❌ 不是响应式
  }
})
state.name = '李四'           // 触发更新
state.address.city = '上海'   // 不触发更新`
    }
  ]
}

export default vue3Optimize

