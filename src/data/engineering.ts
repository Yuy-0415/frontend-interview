import type { Category } from '../types'

const engineering: Category = {
  id: 'engineering',
  name: '工程化',
  icon: '🔧',
  description: 'Webpack/Vite、模块化、前端部署、CI/CD',
  questions: [
    {
      id: 'eg001',
      title: 'Vite 和 Webpack 有什么区别？为什么 Vite 更快？',
      difficulty: 2,
      tags: ['Vite', 'Webpack', '对比', '高频'],
      answer: `## Vite vs Webpack

| 对比项 | Vite | Webpack |
|--------|------|---------|
| 开发启动 | 毫秒级（不打包） | 秒级（全量打包） |
| 热更新 | 极快（ESM 按需编译） | 较慢（重新构建依赖图） |
| 底层原理 | 原生 ESM + esbuild | Bundle 模式 |
| 生产构建 | Rollup | 自身 |
| 配置复杂度 | 简单 | 复杂 |

### Vite 为什么快？
1. **开发时不打包**：利用浏览器原生 ESM，按需编译
2. **依赖预构建**：用 esbuild（Go 编写）预构建第三方依赖，比 JS 快 10-100 倍
3. **HMR 精准更新**：只更新修改的模块，不重新构建整个依赖图`,
    },
    {
      id: 'eg002',
      title: '前端模块化规范有哪些？区别是什么？',
      difficulty: 2,
      tags: ['模块化', 'ESM', 'CommonJS'],
      answer: `## 前端模块化规范

| 规范 | 环境 | 加载方式 | 语法 |
|------|------|---------|------|
| CommonJS | Node.js | 同步 | require / module.exports |
| ESM | 浏览器/Node | 异步 | import / export |
| AMD | 浏览器 | 异步 | define / require |
| UMD | 通用 | 兼容多种 | 工厂函数 |

### ESM vs CommonJS（高频考点）
- ESM 是**静态导入**，编译时确定依赖 → 支持 Tree-shaking
- CommonJS 是**动态导入**，运行时确定依赖 → 不支持 Tree-shaking
- ESM 输出的是**值的引用**，CommonJS 输出的是**值的拷贝**`,
      code: `// ESM
import { ref } from 'vue'
export const count = ref(0)

// CommonJS
const { ref } = require('vue')
module.exports = { count: ref(0) }`
    },
    {
      id: 'eg003',
      title: 'Webpack 的构建流程是怎样的？Loader 和 Plugin 有什么区别？',
      difficulty: 2,
      tags: ['Webpack', 'Loader', 'Plugin', '高频'],
      answer: `## Webpack 构建流程

### 核心流程
1. **初始化**：读取配置，创建 Compiler 实例
2. **编译**：从 entry 入口开始，递归解析依赖
3. **模块转换**：使用 Loader 将非 JS 文件转换为模块
4. **生成依赖图**：构建完整的模块依赖关系图
5. **输出**：将模块组合成 chunk，输出到 output 目录

### Loader vs Plugin

| 对比项 | Loader | Plugin |
|--------|--------|--------|
| 作用 | 文件转换（编译） | 扩展功能（打包优化等） |
| 执行时机 | 模块加载时 | 整个构建生命周期 |
| 用法 | module.rules 配置 | plugins 数组配置 |
| 本质 | 转换函数 | 带 apply 方法的类 |

### 常用 Loader
babel-loader、css-loader、style-loader、file-loader、ts-loader

### 常用 Plugin
HtmlWebpackPlugin、MiniCssExtractPlugin、DefinePlugin、HotModuleReplacementPlugin`,
      code: `// webpack.config.js
module.exports = {
  entry: './src/index.js',
  output: { filename: 'bundle.[contenthash].js' },
  module: {
    rules: [
      { test: /\\.tsx?$/, use: 'ts-loader' },      // Loader
      { test: /\\.css$/, use: ['style-loader', 'css-loader'] }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './index.html' }), // Plugin
    new MiniCssExtractPlugin()
  ]
}`
    },
    {
      id: 'eg004',
      title: '什么是 HMR（热模块替换）？原理是什么？',
      difficulty: 3,
      tags: ['HMR', '热更新', 'Vite', 'Webpack'],
      answer: `## HMR（Hot Module Replacement）

### 定义
在应用运行时，替换、添加或删除模块，**无需刷新整个页面**，保留应用状态。

### Webpack HMR 原理
1. 文件修改后，Webpack 重新编译变更的模块
2. 通过 WebSocket 通知浏览器
3. 浏览器通过 JSONP 请求获取更新的模块代码
4. 替换旧模块，执行 accept 回调

### Vite HMR 原理
1. 文件修改后，Vite 只重新编译该模块（ESM 按需编译）
2. 通过 WebSocket 发送更新信息
3. 浏览器直接请求更新的模块（原生 ESM import）
4. 精准替换，速度极快

### Vite HMR 为什么更快？
- 不需要重新构建整个依赖图
- 利用浏览器原生 ESM，按需请求
- 更新粒度更细，只处理变更的模块`,
    },
    {
      id: 'eg005',
      title: '前端性能优化有哪些常见手段？',
      difficulty: 2,
      tags: ['性能优化', '实战', '高频'],
      answer: `## 前端性能优化

### 加载优化
- **代码分割**：路由懒加载、动态 import
- **Tree-shaking**：移除未使用的代码
- **资源压缩**：gzip/brotli 压缩、图片压缩
- **CDN 加速**：静态资源部署到 CDN
- **预加载**：prefetch/preload 关键资源

### 渲染优化
- **减少回流重绘**：批量 DOM 操作、使用 transform
- **虚拟列表**：大数据量列表优化
- **懒加载**：图片懒加载、组件懒加载
- **防抖节流**：高频事件优化

### 缓存优化
- **HTTP 缓存**：强缓存 + 协商缓存
- **Service Worker**：离线缓存
- **本地存储**：localStorage 缓存数据

### 打包优化
- **分包策略**：vendor 分离、按路由分包
- **资源内联**：小图片转 base64
- **按需引入**：组件库按需加载`,
    },
    {
      id: 'eg006',
      title: 'npm、yarn、pnpm 有什么区别？',
      difficulty: 1,
      tags: ['包管理', 'npm', 'pnpm'],
      answer: `## 包管理器对比

| 对比项 | npm | yarn | pnpm |
|--------|-----|------|------|
| 安装速度 | 较慢 | 快（并行） | 最快 |
| 磁盘占用 | 大（每个项目独立） | 大 | 小（硬链接共享） |
| 幽灵依赖 | 存在 | 存在 | 不存在 |
| lock 文件 | package-lock.json | yarn.lock | pnpm-lock.yaml |
| monorepo | workspaces | workspaces | 原生支持 |

### pnpm 的优势
1. **硬链接 + 符号链接**：所有项目共享同一份依赖，节省磁盘空间
2. **严格的依赖结构**：不允许访问未声明的依赖（解决幽灵依赖）
3. **安装速度最快**：利用缓存和硬链接

### 幽灵依赖
npm/yarn 的扁平化 node_modules 允许访问未在 package.json 中声明的依赖，pnpm 通过非扁平结构解决了这个问题。`,
      code: `# 常用命令对比
# npm
npm install
npm install lodash
npm run dev

# pnpm（推荐）
pnpm install
pnpm add lodash
pnpm dev

# 查看依赖树
pnpm ls --depth 1`
    },
    {
      id: 'eg007',
      title: '什么是 CI/CD？前端项目如何实现？',
      difficulty: 2,
      tags: ['CI/CD', '部署', '自动化'],
      answer: `## CI/CD

### CI（持续集成）
代码提交后自动执行：代码检查、单元测试、构建验证。
- 目的：尽早发现问题，保证代码质量

### CD（持续部署/交付）
构建通过后自动部署到测试/生产环境。
- 持续交付：自动部署到预发环境，手动确认上线
- 持续部署：全自动部署到生产环境

### 前端 CI/CD 流程
1. 代码推送到 Git
2. 触发 CI 流水线（lint → test → build）
3. 构建产物上传到服务器/CDN
4. 自动部署（Nginx/Vercel/GitHub Pages）

### 常用工具
- GitHub Actions
- GitLab CI
- Jenkins
- Vercel（前端零配置部署）`,
      code: `# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - name: Deploy to server
        run: rsync -avz dist/ user@server:/var/www/html/`
    },
    {
      id: 'eg008',
      title: '什么是 Tree Shaking？原理是什么？',
      difficulty: 2,
      tags: ['Tree Shaking', '优化', '高频'],
      answer: `## Tree Shaking

### 定义
Tree Shaking 是一种**死代码消除**技术，在打包时移除 JavaScript 中未被引用的代码（dead code），减小打包体积。

### 原理
基于 ES Module 的**静态分析**特性：
1. ES Module 的 import/export 是静态的，编译时就能确定依赖关系
2. 打包工具分析模块依赖图，标记哪些导出被使用
3. 压缩阶段移除未被标记的代码

### 前提条件
1. 必须使用 **ES Module**（import/export），CommonJS（require）不支持
2. package.json 中设置 \`"sideEffects": false\` 或指定有副作用的文件
3. 使用支持 Tree Shaking 的打包工具（Webpack 4+、Rollup、Vite）

### 注意事项
- 有副作用的代码（如 polyfill、CSS 导入）需要在 sideEffects 中声明
- 避免导出整个对象，优先使用具名导出`,
      code: `// ✅ 可以 Tree Shaking（具名导出）
// utils.ts
export function add(a: number, b: number) { return a + b }
export function multiply(a: number, b: number) { return a * b }

// main.ts — 只引入 add，multiply 会被移除
import { add } from './utils'

// ❌ 无法 Tree Shaking（默认导出整个对象）
export default {
  add(a, b) { return a + b },
  multiply(a, b) { return a * b }
}

// package.json 配置
{
  "sideEffects": [
    "*.css",
    "*.scss",
    "./src/polyfills.ts"
  ]
}`
    },
    {
      id: 'eg009',
      title: '前端有哪些常见的性能优化手段？',
      difficulty: 2,
      tags: ['性能优化', '综合', '高频'],
      answer: `## 前端性能优化

### 加载优化
1. **代码分割**：路由懒加载、动态 import
2. **资源压缩**：gzip/brotli、图片压缩、CSS/JS 压缩
3. **CDN 加速**：静态资源部署到 CDN
4. **缓存策略**：强缓存 + 协商缓存、Service Worker
5. **预加载**：prefetch、preload、dns-prefetch

### 渲染优化
1. **减少重排重绘**：批量 DOM 操作、使用 transform 代替 top/left
2. **虚拟滚动**：大列表只渲染可视区域
3. **防抖节流**：高频事件处理
4. **Web Worker**：CPU 密集型任务放到 Worker 线程

### 代码优化
1. **Tree Shaking**：移除未使用代码
2. **按需引入**：组件库按需加载
3. **图片优化**：WebP 格式、懒加载、响应式图片
4. **骨架屏**：提升首屏感知速度`,
      code: `// 路由懒加载
const routes = [
  { path: '/home', component: () => import('./views/Home.vue') },
  { path: '/about', component: () => import('./views/About.vue') }
]

// 图片懒加载（Intersection Observer）
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target as HTMLImageElement
      img.src = img.dataset.src || ''
      observer.unobserve(img)
    }
  })
})
document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img))

// 预加载关键资源
// <link rel="preload" href="/fonts/main.woff2" as="font" crossorigin>
// <link rel="prefetch" href="/js/about.chunk.js">`
    }
  ]
}

export default engineering

