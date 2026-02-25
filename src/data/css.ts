import type { Category } from '../types'

const css: Category = {
  id: 'css',
  name: 'CSS',
  icon: '🎨',
  description: '盒模型、BFC、Flex/Grid布局、响应式设计、CSS3动画',
  questions: [
    {
      id: 'css001',
      title: '说说你对盒模型的理解？',
      difficulty: 1,
      tags: ['盒模型', 'box-sizing', '高频'],
      answer: `## CSS 盒模型

### 两种盒模型
- **标准盒模型**（content-box）：width = 内容宽度
- **IE盒模型**（border-box）：width = 内容 + padding + border

### 切换方式
\`box-sizing: content-box | border-box\`

### 实际开发建议
全局设置 \`box-sizing: border-box\`，计算尺寸更直观`,
      code: `/* 推荐全局设置 */
*, *::before, *::after {
  box-sizing: border-box;
}

/* 标准盒模型：实际宽度 = 200 + 20*2 + 1*2 = 242px */
.standard { width: 200px; padding: 20px; border: 1px solid; box-sizing: content-box; }

/* IE盒模型：实际宽度 = 200px（内容自动缩小） */
.border { width: 200px; padding: 20px; border: 1px solid; box-sizing: border-box; }`
    },
    {
      id: 'css002',
      title: '什么是 BFC？如何触发？有什么应用？',
      difficulty: 2,
      tags: ['BFC', '布局', '高频'],
      answer: `## BFC（块级格式化上下文）

### 定义
BFC 是一个独立的渲染区域，内部元素的布局不会影响外部元素。

### 触发条件
- \`overflow\` 不为 visible（如 hidden、auto）
- \`display: flow-root\`（最推荐）
- \`float\` 不为 none
- \`position: absolute / fixed\`
- \`display: inline-block / flex / grid\`

### 应用场景
1. **清除浮动**：父元素触发 BFC 包裹浮动子元素
2. **防止 margin 重叠**：相邻元素放入不同 BFC
3. **自适应两栏布局**：右侧触发 BFC 不与左侧浮动元素重叠`,
      code: `/* 清除浮动 - 推荐方式 */
.clearfix { display: flow-root; }

/* 防止 margin 重叠 */
.wrapper { overflow: hidden; } /* 触发 BFC */

/* 两栏布局 */
.left { float: left; width: 200px; }
.right { overflow: hidden; } /* 触发 BFC，自适应剩余宽度 */`
    },
    {
      id: 'css003',
      title: 'Flex 布局的常用属性有哪些？',
      difficulty: 1,
      tags: ['Flex', '布局', '高频'],
      answer: `## Flexbox 布局

### 容器属性（父元素）
- \`display: flex\`：开启 flex 布局
- \`flex-direction\`：主轴方向（row/column/row-reverse/column-reverse）
- \`justify-content\`：主轴对齐（flex-start/center/space-between/space-around/space-evenly）
- \`align-items\`：交叉轴对齐（flex-start/center/stretch/baseline）
- \`flex-wrap\`：是否换行（nowrap/wrap）
- \`gap\`：子元素间距

### 子元素属性
- \`flex\`：简写属性（flex-grow flex-shrink flex-basis）
- \`flex: 1\` 等价于 \`flex: 1 1 0%\`（等分剩余空间）
- \`align-self\`：单独设置交叉轴对齐
- \`order\`：排列顺序`,
      code: `/* 水平垂直居中 */
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 两端对齐导航栏 */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 等分三列 */
.grid {
  display: flex;
  gap: 16px;
}
.grid > .col {
  flex: 1; /* 等分剩余空间 */
}

/* 固定侧边栏 + 自适应内容 */
.layout {
  display: flex;
}
.sidebar { width: 200px; flex-shrink: 0; }
.content { flex: 1; }`
    },
    {
      id: 'css004',
      title: '如何实现水平垂直居中？',
      difficulty: 1,
      tags: ['居中', '布局', '高频'],
      answer: `## 水平垂直居中方案

### 1. Flex（推荐）
最简单通用，适合任何场景。

### 2. Grid
一行代码搞定。

### 3. absolute + transform
不需要知道元素尺寸。

### 4. absolute + margin: auto
需要设置宽高。

### 5. absolute + 负 margin
需要知道元素尺寸（不推荐）。

### 推荐优先级
Flex > Grid > absolute + transform`,
      code: `/* 方案1：Flex（推荐） */
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 方案2：Grid */
.parent {
  display: grid;
  place-items: center;
}

/* 方案3：absolute + transform */
.parent { position: relative; }
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 方案4：absolute + margin auto */
.parent { position: relative; }
.child {
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  margin: auto;
  width: 200px;
  height: 100px;
}`
    },
    {
      id: 'css005',
      title: '什么是响应式设计？如何实现？',
      difficulty: 2,
      tags: ['响应式', '媒体查询', '移动端'],
      answer: `## 响应式设计

### 定义
同一个网页在不同设备（手机、平板、PC）上都能良好展示，自动适配屏幕尺寸。

### 实现方式

1. **媒体查询（Media Query）**
根据屏幕宽度应用不同样式

2. **弹性布局（Flex/Grid）**
自动适配容器尺寸

3. **相对单位**
- rem：相对于根元素 font-size
- vw/vh：相对于视口宽高
- %：相对于父元素

4. **CSS 框架**
Tailwind CSS、Bootstrap 等提供响应式工具类

### viewport meta 标签
移动端必须设置，否则页面会按 PC 宽度缩放`,
      code: `<!-- viewport 设置 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">

/* 媒体查询 */
/* 手机 */
@media (max-width: 768px) {
  .container { padding: 16px; }
  .grid { grid-template-columns: 1fr; }
}
/* 平板 */
@media (min-width: 768px) and (max-width: 1024px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}
/* PC */
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}

/* Tailwind CSS 响应式（推荐） */
/* <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"> */`
    },
    {
      id: 'css006',
      title: 'CSS 选择器优先级是怎么计算的？',
      difficulty: 1,
      tags: ['选择器', '优先级', '基础'],
      answer: `## CSS 选择器优先级

### 优先级权重（从高到低）
1. **!important**：最高优先级（慎用）
2. **内联样式**：style="..."（权重 1000）
3. **ID 选择器**：#id（权重 100）
4. **类/伪类/属性选择器**：.class / :hover / [attr]（权重 10）
5. **标签/伪元素选择器**：div / ::before（权重 1）
6. **通配符/组合器**：* / > / + / ~（权重 0）

### 计算规则
- 比较时按 (a, b, c, d) 四位数比较
- a: 内联样式数量
- b: ID 选择器数量
- c: 类/伪类/属性选择器数量
- d: 标签/伪元素选择器数量

### 注意
- 权重相同时，后写的覆盖先写的
- 继承的样式优先级最低
- !important > 内联 > ID > 类 > 标签`,
      code: `/* 优先级示例 */
div { color: red; }              /* (0,0,0,1) */
.text { color: blue; }           /* (0,0,1,0) */
#title { color: green; }         /* (0,1,0,0) */
div.text#title { color: pink; }  /* (0,1,1,1) */

/* !important 最高 */
p { color: red !important; }     /* 最高优先级 */

/* 实际开发建议 */
/* ❌ 避免过深的选择器嵌套 */
.header .nav .list .item .link { }

/* ✅ 使用 BEM 命名或工具类 */
.nav__link { }
/* 或 Tailwind: class="text-blue-500 hover:text-blue-700" */`
    },
    {
      id: 'css007',
      title: 'CSS3 有哪些新特性？',
      difficulty: 1,
      tags: ['CSS3', '新特性', '基础'],
      answer: `## CSS3 新特性

### 布局
- **Flexbox**：一维弹性布局
- **Grid**：二维网格布局
- **多列布局**：column-count

### 视觉效果
- **圆角**：border-radius
- **阴影**：box-shadow、text-shadow
- **渐变**：linear-gradient、radial-gradient
- **滤镜**：filter（blur、brightness等）
- **混合模式**：mix-blend-mode

### 动画
- **过渡**：transition
- **动画**：@keyframes + animation
- **变换**：transform（translate/rotate/scale）

### 其他
- **媒体查询**：@media
- **自定义属性**：CSS 变量 var(--color)
- **calc() 计算**：width: calc(100% - 200px)
- **clamp()**：响应式字体 font-size: clamp(14px, 2vw, 18px)`,
      code: `/* CSS 变量 */
:root {
  --primary: #3b82f6;
  --radius: 8px;
}
.btn {
  background: var(--primary);
  border-radius: var(--radius);
}

/* 过渡动画 */
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

/* 关键帧动画 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.fade-in { animation: fadeIn 0.3s ease; }`
    },
    {
      id: 'css008',
      title: 'position 有哪些值？各有什么特点？',
      difficulty: 1,
      tags: ['position', '定位', '基础'],
      answer: `## CSS position 属性

### static（默认）
- 正常文档流，top/left 等无效

### relative（相对定位）
- 相对于自身原始位置偏移
- 不脱离文档流，原始空间保留
- 常用作绝对定位的参照物

### absolute（绝对定位）
- 相对于最近的非 static 祖先元素定位
- 脱离文档流，不占据空间
- 常用于弹窗、下拉菜单、徽标等

### fixed（固定定位）
- 相对于浏览器视口定位
- 脱离文档流
- 常用于固定导航栏、返回顶部按钮

### sticky（粘性定位）
- 正常流 + 固定定位的混合
- 滚动到阈值前是 relative，到达后变成 fixed
- 常用于吸顶效果`,
      code: `/* 相对定位 */
.parent { position: relative; }

/* 绝对定位（右上角徽标） */
.badge {
  position: absolute;
  top: -8px;
  right: -8px;
}

/* 固定定位（固定导航） */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

/* 粘性定位（吸顶） */
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: white;
}`
    },
    {
      id: 'css009',
      title: 'Grid 布局的常用属性有哪些？和 Flex 有什么区别？',
      difficulty: 2,
      tags: ['Grid', '布局', '高频'],
      answer: `## Grid 布局

### 核心概念
Grid 是**二维布局**系统，可以同时控制行和列，而 Flex 是**一维布局**（主轴方向）。

### 容器属性
- \`display: grid\`：开启 Grid 布局
- \`grid-template-columns\`：定义列数和列宽
- \`grid-template-rows\`：定义行数和行高
- \`gap\`：行列间距
- \`grid-template-areas\`：命名区域布局

### 子元素属性
- \`grid-column\`：跨列（如 \`1 / 3\` 表示从第1列线到第3列线）
- \`grid-row\`：跨行
- \`grid-area\`：指定所在区域

### Grid vs Flex
| 场景 | 推荐 |
|------|------|
| 一维排列（导航栏、列表） | Flex |
| 二维网格（卡片墙、仪表盘） | Grid |
| 不确定子元素数量 | Flex |
| 固定网格结构 | Grid |`,
      code: `/* 等分三列网格 */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

/* 响应式网格：自动填充，最小200px */
.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

/* 命名区域布局 */
.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 200px 1fr;
}
.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }`
    },
    {
      id: 'css010',
      title: 'CSS 动画有哪些实现方式？transition 和 animation 有什么区别？',
      difficulty: 2,
      tags: ['动画', 'transition', 'animation'],
      answer: `## CSS 动画

### transition（过渡）
- 需要**触发条件**（hover、class 变化等）
- 只能定义**起始和结束**两个状态
- 适合简单的状态切换动画

### animation（动画）
- **自动执行**，不需要触发条件
- 通过 \`@keyframes\` 定义**多个关键帧**
- 支持循环、暂停、反向播放等
- 适合复杂的、持续的动画

### 对比

| 特性 | transition | animation |
|------|-----------|-----------|
| 触发方式 | 需要触发 | 自动/触发 |
| 关键帧 | 2个（起止） | 多个 |
| 循环 | 不支持 | 支持 |
| 暂停 | 不支持 | 支持 |`,
      code: `/* transition 过渡 */
.btn {
  background: #3b82f6;
  transition: all 0.3s ease;
}
.btn:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

/* animation 动画 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.card {
  animation: fadeIn 0.5s ease forwards;
}

/* 加载动画 */
@keyframes spin {
  to { transform: rotate(360deg); }
}
.loading {
  animation: spin 1s linear infinite;
}`
    },
    {
      id: 'css011',
      title: '伪元素和伪类有什么区别？常用的有哪些？',
      difficulty: 1,
      tags: ['伪元素', '伪类', '选择器'],
      answer: `## 伪类 vs 伪元素

### 伪类（:）— 选择特定状态的元素
- \`:hover\`：鼠标悬停
- \`:focus\`：获得焦点
- \`:first-child / :last-child\`：第一个/最后一个子元素
- \`:nth-child(n)\`：第n个子元素
- \`:not(selector)\`：排除匹配的元素
- \`:active\`：激活状态（点击时）

### 伪元素（::）— 创建虚拟元素
- \`::before / ::after\`：在元素前/后插入内容
- \`::first-line\`：第一行文本
- \`::first-letter\`：第一个字母
- \`::placeholder\`：输入框占位符
- \`::selection\`：选中的文本

### 核心区别
- 伪类：选择已有元素的特定状态
- 伪元素：创建 DOM 中不存在的虚拟元素`,
      code: `/* 伪元素清除浮动 */
.clearfix::after {
  content: '';
  display: block;
  clear: both;
}

/* 伪元素装饰线 */
.title::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 1em;
  background: #3b82f6;
  margin-right: 8px;
  vertical-align: middle;
}

/* 伪类：隔行变色 */
tr:nth-child(even) { background: #f8fafc; }
tr:hover { background: #e2e8f0; }`
    }
  ]
}

export default css

