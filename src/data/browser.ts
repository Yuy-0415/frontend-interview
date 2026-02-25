import type { Category } from '../types'

const browser: Category = {
  id: 'browser',
  name: '浏览器原理',
  icon: '🖥️',
  description: '渲染原理、回流重绘、本地存储、垃圾回收',
  questions: [
    {
      id: 'br001',
      title: '浏览器输入URL到页面展示，经历了什么？',
      difficulty: 3,
      tags: ['渲染流程', '网络', '高频'],
      answer: `## 从输入 URL 到页面展示

### 1. DNS 解析
域名 → IP 地址（浏览器缓存 → 系统缓存 → 路由器缓存 → DNS 服务器）

### 2. TCP 连接
三次握手建立连接（HTTPS 还需要 TLS 握手）

### 3. 发送 HTTP 请求
构建请求报文，发送到服务器

### 4. 服务器处理并返回响应
返回 HTML/CSS/JS 等资源

### 5. 浏览器解析渲染
1. 解析 HTML → DOM 树
2. 解析 CSS → CSSOM 树
3. DOM + CSSOM → 渲染树（Render Tree）
4. 布局（Layout）：计算元素位置和大小
5. 绘制（Paint）：像素绘制
6. 合成（Composite）：GPU 合成图层

### 6. 执行 JavaScript
遇到 \`<script>\` 会阻塞 HTML 解析（defer/async 可避免）`,
    },
    {
      id: 'br002',
      title: '什么是回流和重绘？如何减少？',
      difficulty: 2,
      tags: ['回流', '重绘', '性能', '高频'],
      answer: `## 回流（Reflow）与重绘（Repaint）

### 回流
元素的几何属性（大小、位置）发生变化，浏览器重新计算布局。
触发场景：修改 width/height/margin/padding、添加删除 DOM、窗口 resize

### 重绘
元素的外观属性（颜色、背景）发生变化，不影响布局。
触发场景：修改 color/background/visibility/box-shadow

### 关系
回流一定触发重绘，重绘不一定触发回流。回流的代价更高。

### 优化手段
- 批量修改 DOM：使用 DocumentFragment 或一次性修改 className
- 避免频繁读取布局属性（offsetTop 等会强制回流）
- 使用 transform 代替 top/left（不触发回流）
- 使用 will-change 提示浏览器提前优化
- 离屏操作：先 display:none，修改完再显示`,
    },
    {
      id: 'br003',
      title: 'localStorage、sessionStorage、Cookie 有什么区别？',
      difficulty: 1,
      tags: ['存储', 'Cookie', 'localStorage', '高频'],
      answer: `## 浏览器存储对比

| 特性 | Cookie | localStorage | sessionStorage |
|------|--------|-------------|----------------|
| 容量 | 4KB | 5MB | 5MB |
| 生命周期 | 可设过期时间 | 永久（手动清除） | 页面关闭即清除 |
| 服务端通信 | 每次请求自动携带 | 不参与 | 不参与 |
| 作用域 | 同源 + 路径 | 同源 | 同源 + 同标签页 |
| API | document.cookie | getItem/setItem | getItem/setItem |

### 使用场景
- **Cookie**：登录态（token）、用户偏好（需要服务端读取的）
- **localStorage**：持久化数据（用户设置、缓存数据）
- **sessionStorage**：临时数据（表单草稿、页面间传参）`,
    },
    {
      id: 'br004',
      title: '浏览器的垃圾回收机制是怎样的？',
      difficulty: 2,
      tags: ['垃圾回收', 'GC', '内存'],
      answer: `## 浏览器垃圾回收

### 标记清除（Mark-and-Sweep）— 主流算法
1. 从根对象（window/global）出发，标记所有可达对象
2. 清除所有未被标记的对象
3. 回收内存空间

### V8 引擎的分代回收
- **新生代**（短命对象）：Scavenge 算法，空间小、回收频繁
- **老生代**（长命对象）：标记清除 + 标记整理，空间大、回收不频繁

### 常见内存泄漏场景
1. **未清除的定时器**：setInterval 没有 clearInterval
2. **未移除的事件监听**：addEventListener 后没有 removeEventListener
3. **闭包引用**：闭包持有大对象的引用
4. **DOM 引用**：JS 中保存了已删除 DOM 的引用
5. **全局变量**：意外创建全局变量

### 排查工具
Chrome DevTools → Memory → Heap Snapshot`,
      code: `// ❌ 内存泄漏示例
// 1. 未清除定时器
const timer = setInterval(() => { /* ... */ }, 1000)
// 组件卸载时忘记清除

// 2. 未移除事件监听
window.addEventListener('resize', handleResize)
// 组件卸载时忘记移除

// ✅ Vue3 中正确做法
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  clearInterval(timer)
})`
    },
    {
      id: 'br005',
      title: 'script 标签的 async 和 defer 有什么区别？',
      difficulty: 1,
      tags: ['script', 'async', 'defer', '高频'],
      answer: `## script 的 async 和 defer

### 普通 script
- 阻塞 HTML 解析
- 下载完立即执行
- 执行完才继续解析 HTML

### async
- 异步下载，**不阻塞** HTML 解析
- 下载完**立即执行**（会阻塞 HTML 解析）
- 多个 async 脚本执行顺序**不确定**
- 适合：独立脚本（统计、广告）

### defer
- 异步下载，**不阻塞** HTML 解析
- HTML 解析完成后、DOMContentLoaded 之前执行
- 多个 defer 脚本**按顺序执行**
- 适合：需要操作 DOM 的脚本、有依赖关系的脚本

### 执行时机对比
\`\`\`
普通：  下载 → 执行 → 继续解析（阻塞）
async： 下载（并行）→ 下载完立即执行（可能阻塞）
defer： 下载（并行）→ HTML解析完后执行（不阻塞）
\`\`\``,
      code: `<!-- 普通：阻塞解析 -->
<script src="app.js"></script>

<!-- async：异步下载，下载完立即执行（顺序不确定） -->
<script async src="analytics.js"></script>
<script async src="ads.js"></script>

<!-- defer：异步下载，HTML解析完后按顺序执行（推荐） -->
<script defer src="vendor.js"></script>
<script defer src="app.js"></script>

<!-- 现代写法：type="module" 默认 defer 行为 -->
<script type="module" src="app.js"></script>`
    },
    {
      id: 'br006',
      title: '什么是事件委托（事件代理）？有什么优缺点？',
      difficulty: 2,
      tags: ['事件委托', '事件冒泡', '高频'],
      answer: `## 事件委托

### 定义
利用**事件冒泡**机制，将子元素的事件监听器绑定到父元素上，通过 \`event.target\` 判断实际触发的元素。

### 优点
1. **减少内存占用**：只需一个监听器，而非每个子元素一个
2. **动态元素支持**：新增的子元素自动拥有事件处理
3. **简化代码**：统一管理事件逻辑

### 缺点
1. 不适合不冒泡的事件（focus、blur、mouseenter、mouseleave）
2. 层级过深时，event.target 判断可能复杂
3. 阻止冒泡可能影响其他功能

### 事件流三个阶段
1. 捕获阶段（从 window 到目标元素）
2. 目标阶段（到达目标元素）
3. 冒泡阶段（从目标元素回到 window）`,
      code: `// ❌ 给每个 li 绑定事件
document.querySelectorAll('li').forEach(li => {
  li.addEventListener('click', handleClick)
})

// ✅ 事件委托：只在父元素绑定一次
document.querySelector('ul').addEventListener('click', (e) => {
  const target = e.target
  if (target.tagName === 'LI') {
    console.log('点击了:', target.textContent)
  }
})

// Vue 中的事件委托（v-for 列表）
// Vue 内部已经做了优化，但大列表仍可手动委托
<ul @click="handleClick">
  <li v-for="item in list" :key="item.id" :data-id="item.id">
    {{ item.name }}
  </li>
</ul>`
    },
    {
      id: 'br007',
      title: '浏览器的同源策略是什么？',
      difficulty: 1,
      tags: ['同源策略', '安全', '跨域'],
      answer: `## 同源策略

### 定义
同源策略是浏览器的安全机制，限制不同源的文档或脚本之间的交互。

### 同源条件
**协议 + 域名 + 端口** 三者完全相同才算同源。

### 限制范围
1. **DOM 访问**：不能操作不同源页面的 DOM
2. **Cookie/Storage**：不能读取不同源的 Cookie 和 localStorage
3. **AJAX 请求**：不能发送跨域 XMLHttpRequest/fetch 请求

### 不受限制的标签
- \`<img>\`：可以加载跨域图片
- \`<link>\`：可以加载跨域 CSS
- \`<script>\`：可以加载跨域 JS（JSONP 原理）
- \`<iframe>\`：可以嵌入跨域页面（但不能操作其 DOM）

### 跨域解决方案
CORS、代理服务器、JSONP、postMessage、WebSocket`,
    },
    {
      id: 'br008',
      title: '什么是 XSS 和 CSRF 攻击？如何防御？',
      difficulty: 2,
      tags: ['XSS', 'CSRF', '安全', '高频'],
      answer: `## Web 安全

### XSS（跨站脚本攻击）
攻击者在网页中注入恶意脚本，窃取用户信息。

**类型**：
- 存储型：恶意脚本存入数据库（评论区注入）
- 反射型：恶意脚本在 URL 参数中
- DOM 型：前端 JS 直接操作 DOM 导致

**防御**：
- 输入过滤 + 输出转义（HTML 实体编码）
- CSP（Content Security Policy）
- HttpOnly Cookie（JS 无法读取）

### CSRF（跨站请求伪造）
攻击者诱导用户访问恶意页面，利用用户已登录的身份发起请求。

**防御**：
- CSRF Token（服务端生成，请求时携带）
- SameSite Cookie（限制第三方 Cookie）
- 验证 Referer/Origin 头
- 关键操作二次确认`,
      code: `// XSS 防御：转义 HTML
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Vue 中默认转义（安全）
<p>{{ userInput }}</p>  // 自动转义

// ⚠️ v-html 不转义（危险）
<p v-html="userInput"></p>  // 可能导致 XSS

// CSRF Token
axios.defaults.headers.common['X-CSRF-Token'] = csrfToken`
    },
    {
      id: 'br009',
      title: '什么是垃圾回收机制？V8 引擎如何进行垃圾回收？',
      difficulty: 3,
      tags: ['垃圾回收', 'V8', '内存管理'],
      answer: `## 垃圾回收（GC）

### 什么是垃圾
不再被引用的对象所占用的内存就是"垃圾"，需要被回收释放。

### V8 的分代回收策略

#### 新生代（Young Generation）
- 存放生命周期短的对象，空间较小（1~8MB）
- 使用 **Scavenge 算法**（复制算法）：将内存分为 From 和 To 两个空间
- 存活对象从 From 复制到 To，然后交换两个空间
- 经过两次 Scavenge 仍存活的对象晋升到老生代

#### 老生代（Old Generation）
- 存放生命周期长的对象，空间较大
- 使用 **Mark-Sweep（标记清除）** + **Mark-Compact（标记整理）**
- 标记阶段：从根对象出发，标记所有可达对象
- 清除阶段：回收未被标记的对象
- 整理阶段：将存活对象移动到一端，消除内存碎片

### 常见内存泄漏
1. 意外的全局变量
2. 未清除的定时器/事件监听
3. 闭包引用
4. 脱离 DOM 的引用`,
      code: `// 内存泄漏示例

// 1. 意外全局变量
function leak() {
  name = '全局变量' // 没有 let/const/var，挂到 window 上
}

// 2. 未清除的定时器
const timer = setInterval(() => {
  // 即使组件销毁，定时器仍在运行
}, 1000)
// 修复：组件卸载时 clearInterval(timer)

// 3. 闭包引用大对象
function createClosure() {
  const bigData = new Array(1000000).fill('x')
  return function() {
    console.log(bigData.length) // bigData 无法被回收
  }
}

// 4. Vue 组件中的正确做法
onUnmounted(() => {
  clearInterval(timer)
  window.removeEventListener('resize', handler)
  observer.disconnect()
})`
    },
    {
      id: 'br010',
      title: '浏览器的同源策略是什么？为什么需要它？',
      difficulty: 2,
      tags: ['同源策略', '安全', '高频'],
      answer: `## 同源策略

### 定义
同源策略是浏览器的一种安全机制，限制一个源的文档或脚本如何与另一个源的资源进行交互。

### 同源条件（三者必须完全相同）
- **协议**：http / https
- **域名**：www.example.com
- **端口**：80 / 443 / 3000

### 限制范围
1. **DOM 访问**：不能操作跨域页面的 DOM
2. **Cookie/Storage**：不能读取跨域的 Cookie、localStorage
3. **AJAX 请求**：不能发送跨域的 XMLHttpRequest / fetch

### 为什么需要
防止恶意网站：
- 读取其他网站的用户数据（Cookie、表单内容）
- 冒充用户发送请求（CSRF）
- 窃取敏感信息

### 跨域解决方案
1. **CORS**：服务端设置 Access-Control-Allow-Origin
2. **代理**：开发环境用 Vite/Webpack 代理，生产环境用 Nginx 反向代理
3. **JSONP**：利用 script 标签不受同源限制（仅支持 GET）
4. **postMessage**：跨窗口通信`,
      code: `// 同源判断示例
// 当前页面：https://www.example.com:443/page

// ✅ 同源
// https://www.example.com:443/other

// ❌ 不同源
// http://www.example.com    （协议不同）
// https://api.example.com   （域名不同）
// https://www.example.com:8080 （端口不同）

// Vite 开发代理配置
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://api.example.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\\/api/, '')
      }
    }
  }
})`
    }
  ]
}

export default browser

