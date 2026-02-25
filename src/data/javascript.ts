import type { Category } from '../types'

const javascript: Category = {
  id: 'javascript',
  name: 'JavaScript',
  icon: '💛',
  description: '闭包、原型链、Promise、事件循环、this、防抖节流',
  questions: [
    {
      id: 'js001',
      title: '说说你对闭包的理解？应用场景有哪些？',
      difficulty: 2,
      tags: ['闭包', '作用域', '高频'],
      answer: `## 闭包（Closure）

### 定义
闭包是指一个函数能够访问其词法作用域外部的变量，即使该函数在其词法作用域之外执行。

### 形成条件
1. 函数嵌套
2. 内部函数引用了外部函数的变量
3. 内部函数被返回或传递到外部

### 应用场景
- **数据私有化**：模拟私有变量
- **函数柯里化**：参数复用
- **防抖/节流**：保存定时器引用
- **模块模式**：IIFE + 闭包

### 注意事项
- 闭包会导致外部函数的变量无法被垃圾回收，可能造成内存泄漏
- 循环中使用闭包需注意变量捕获问题（经典 for + var 问题）`,
      code: `// 闭包实现数据私有化
function createCounter() {
  let count = 0 // 私有变量，外部无法直接访问
  return {
    increment: () => ++count,
    getCount: () => count
  }
}
const counter = createCounter()
counter.increment()
console.log(counter.getCount()) // 1

// 防抖函数（闭包保存 timer）
function debounce(fn, delay) {
  let timer = null
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}`
    },
    {
      id: 'js002',
      title: '说说 JavaScript 的事件循环机制？',
      difficulty: 3,
      tags: ['事件循环', 'Event Loop', '微任务', '宏任务', '高频'],
      answer: `## 事件循环（Event Loop）

### 执行顺序
1. 执行同步代码（调用栈）
2. 清空微任务队列（Microtask）
3. 执行一个宏任务（Macrotask）
4. 重复 2-3

### 微任务（优先级高）
- Promise.then / catch / finally
- MutationObserver
- queueMicrotask

### 宏任务
- setTimeout / setInterval
- requestAnimationFrame
- I/O 操作
- UI 渲染`,
      code: `console.log('1')           // 同步

setTimeout(() => {
  console.log('2')         // 宏任务
}, 0)

Promise.resolve().then(() => {
  console.log('3')         // 微任务
})

console.log('4')           // 同步

// 输出顺序：1 → 4 → 3 → 2`
    },
    {
      id: 'js003',
      title: '原型和原型链是什么？如何实现继承？',
      difficulty: 3,
      tags: ['原型链', '继承', '高频'],
      answer: `## 原型与原型链

### 核心概念
- 每个函数都有一个 \`prototype\` 属性，指向原型对象
- 每个对象都有一个 \`__proto__\` 属性，指向其构造函数的 prototype
- 原型链：对象查找属性时，沿 \`__proto__\` 链向上查找，直到 \`null\`

### 原型链查找过程
\`obj.name\` → \`obj\` 自身 → \`obj.__proto__\`（构造函数.prototype）→ \`Object.prototype\` → \`null\`

### 继承方式
1. **原型链继承**：子类.prototype = new 父类()（缺点：引用类型共享）
2. **构造函数继承**：子类中调用 父类.call(this)（缺点：无法继承原型方法）
3. **组合继承**：1 + 2 结合（缺点：父类构造函数调用两次）
4. **寄生组合继承**：最优方案，ES5 推荐
5. **ES6 class extends**：语法糖，底层仍是寄生组合继承`,
      code: `// ES6 class 继承（推荐）
class Animal {
  constructor(name) {
    this.name = name
  }
  speak() {
    console.log(this.name + ' makes a sound')
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name) // 调用父类构造函数
  }
  bark() {
    console.log(this.name + ' barks')
  }
}

// 原型链验证
const dog = new Dog('旺财')
console.log(dog.__proto__ === Dog.prototype)           // true
console.log(Dog.prototype.__proto__ === Animal.prototype) // true`
    },
    {
      id: 'js004',
      title: 'this 的指向规则是什么？call/apply/bind 有什么区别？',
      difficulty: 2,
      tags: ['this', 'call', 'apply', 'bind', '高频'],
      answer: `## this 指向规则

### 四种绑定规则（优先级从高到低）
1. **new 绑定**：\`new Foo()\` → this 指向新创建的对象
2. **显式绑定**：\`call/apply/bind\` → this 指向指定对象
3. **隐式绑定**：\`obj.fn()\` → this 指向调用对象 obj
4. **默认绑定**：独立调用 \`fn()\` → this 指向 window（严格模式为 undefined）

### 箭头函数
- 没有自己的 this，继承外层作用域的 this
- 无法通过 call/apply/bind 改变 this

### call / apply / bind 区别
| 方法 | 执行 | 参数 |
|------|------|------|
| call | 立即执行 | 逐个传参 fn.call(obj, a, b) |
| apply | 立即执行 | 数组传参 fn.apply(obj, [a, b]) |
| bind | 返回新函数 | 逐个传参 fn.bind(obj, a, b) |`,
      code: `const obj = {
  name: '张三',
  greet() { console.log(this.name) },
  greetArrow: () => { console.log(this.name) } // 箭头函数 this 指向外层
}

obj.greet()        // '张三'（隐式绑定）
obj.greetArrow()   // undefined（箭头函数 this 指向 window）

const fn = obj.greet
fn()               // undefined（默认绑定，this 丢失）

// call / apply / bind
function say(age, city) {
  console.log(\`\${this.name}, \${age}岁, \${city}\`)
}
say.call({ name: '张三' }, 25, '北京')     // 立即执行
say.apply({ name: '张三' }, [25, '北京'])  // 立即执行
const bound = say.bind({ name: '张三' }, 25)
bound('北京')                               // 返回新函数后调用`
    },
    {
      id: 'js005',
      title: '什么是防抖和节流？如何实现？',
      difficulty: 2,
      tags: ['防抖', '节流', '手写题', '高频'],
      answer: `## 防抖与节流

### 防抖（Debounce）
事件触发后延迟执行，如果在延迟期间再次触发，则重新计时。
- 场景：搜索框输入、窗口 resize、表单验证

### 节流（Throttle）
事件触发后，在指定时间内只执行一次，不管触发多少次。
- 场景：滚动事件、按钮点击、拖拽

### 区别
- 防抖：只执行最后一次
- 节流：每隔一段时间执行一次`,
      code: `// 防抖
function debounce(fn, delay = 300) {
  let timer = null
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

// 节流（时间戳版）
function throttle(fn, interval = 300) {
  let lastTime = 0
  return function(...args) {
    const now = Date.now()
    if (now - lastTime >= interval) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}

// 使用
const handleSearch = debounce((keyword) => {
  fetchResults(keyword)
}, 500)

const handleScroll = throttle(() => {
  checkPosition()
}, 200)`
    },
    {
      id: 'js006',
      title: 'JavaScript 有哪些数据类型？如何判断类型？',
      difficulty: 1,
      tags: ['数据类型', 'typeof', 'instanceof', '高频'],
      answer: `## JavaScript 数据类型

### 8 种数据类型
**基本类型（7种）**：
- string、number、boolean、undefined、null、symbol、bigint

**引用类型（1种）**：
- object（包括 Array、Function、Date、RegExp、Map、Set 等）

### 类型判断方法

| 方法 | 适用场景 | 缺陷 |
|------|---------|------|
| typeof | 基本类型 | null → 'object'，数组 → 'object' |
| instanceof | 引用类型 | 不能判断基本类型，跨 iframe 失效 |
| Object.prototype.toString.call() | 所有类型 | 写法较长 |
| Array.isArray() | 数组判断 | 只能判断数组 |

### 推荐方案
\`Object.prototype.toString.call()\` 是最准确的通用方案`,
      code: `// typeof
typeof 'hello'    // 'string'
typeof 42         // 'number'
typeof true       // 'boolean'
typeof undefined  // 'undefined'
typeof null       // 'object' ⚠️ 历史遗留 bug
typeof []         // 'object' ⚠️ 无法区分数组
typeof function(){} // 'function'

// Object.prototype.toString.call()（最准确）
Object.prototype.toString.call('hello')   // '[object String]'
Object.prototype.toString.call(null)      // '[object Null]'
Object.prototype.toString.call([])        // '[object Array]'
Object.prototype.toString.call({})        // '[object Object]'

// 封装通用类型判断
function getType(val) {
  return Object.prototype.toString.call(val).slice(8, -1).toLowerCase()
}
getType([])    // 'array'
getType(null)  // 'null'`
    },
    {
      id: 'js007',
      title: 'async/await 的原理是什么？和 Promise 有什么关系？',
      difficulty: 2,
      tags: ['async', 'await', 'Promise', '高频'],
      answer: `## async/await

### 本质
async/await 是 **Generator + Promise** 的语法糖，让异步代码看起来像同步代码。

### 核心规则
- \`async\` 函数始终返回一个 Promise
- \`await\` 只能在 async 函数内使用
- \`await\` 后面跟一个 Promise，会暂停执行直到 Promise 完成
- \`await\` 后面跟非 Promise 值，直接返回该值

### 错误处理
- 使用 \`try/catch\` 捕获 await 的错误
- 或者在调用时用 \`.catch()\`

### 与 Promise 的关系
- async/await 是 Promise 的语法糖，底层仍是 Promise
- async 函数 return 的值会被 Promise.resolve() 包装
- await 相当于 .then() 的简写`,
      code: `// Promise 链式写法
function fetchUser() {
  return fetch('/api/user')
    .then(res => res.json())
    .then(user => fetch('/api/posts?uid=' + user.id))
    .then(res => res.json())
    .catch(err => console.error(err))
}

// async/await 写法（更清晰）
async function fetchUser() {
  try {
    const res1 = await fetch('/api/user')
    const user = await res1.json()
    const res2 = await fetch('/api/posts?uid=' + user.id)
    const posts = await res2.json()
    return posts
  } catch (err) {
    console.error(err)
  }
}

// 并发请求（不要串行 await）
async function fetchAll() {
  // ❌ 串行，慢
  const a = await fetchA()
  const b = await fetchB()

  // ✅ 并发，快
  const [a, b] = await Promise.all([fetchA(), fetchB()])
}`
    },
    {
      id: 'js008',
      title: '深拷贝和浅拷贝的区别？如何实现深拷贝？',
      difficulty: 2,
      tags: ['深拷贝', '浅拷贝', '手写题', '高频'],
      answer: `## 深拷贝 vs 浅拷贝

### 浅拷贝
只复制对象的第一层属性，嵌套对象仍然是引用。
- \`Object.assign()\`
- 展开运算符 \`{...obj}\`
- \`Array.prototype.slice()\`

### 深拷贝
递归复制所有层级，完全独立的副本。
- \`JSON.parse(JSON.stringify())\`（简单但有局限）
- \`structuredClone()\`（现代浏览器原生支持）
- 手写递归实现（面试常考）

### JSON 方案的局限
- 无法处理：函数、undefined、Symbol、循环引用
- Date 会变成字符串，RegExp 会变成空对象`,
      code: `// 手写深拷贝（处理循环引用）
function deepClone(obj, map = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj)

  // 处理循环引用
  if (map.has(obj)) return map.get(obj)

  const clone = Array.isArray(obj) ? [] : {}
  map.set(obj, clone)

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key], map)
    }
  }
  return clone
}

// 现代方案（推荐）
const copy = structuredClone(original)`
    },
    {
      id: 'js009',
      title: '作用域和作用域链是什么？',
      difficulty: 2,
      tags: ['作用域', '作用域链', '高频'],
      answer: `## 作用域与作用域链

### 三种作用域
1. **全局作用域**：最外层定义的变量，任何地方都能访问
2. **函数作用域**：函数内部定义的变量，外部无法访问
3. **块级作用域**（ES6）：\`let\`/\`const\` 在 \`{}\` 内形成块级作用域

### 作用域链
当访问一个变量时，JS 引擎会从当前作用域开始查找，如果找不到就向上层作用域查找，直到全局作用域。这条查找链路就是**作用域链**。

### 词法作用域
JavaScript 采用**词法作用域**（静态作用域），函数的作用域在定义时就确定了，而不是在调用时。`,
      code: `let a = 1 // 全局作用域

function outer() {
  let b = 2 // outer 函数作用域

  function inner() {
    let c = 3 // inner 函数作用域
    console.log(a, b, c) // 1, 2, 3 — 沿作用域链向上查找
  }

  inner()
  // console.log(c) // ❌ ReferenceError
}

// 词法作用域示例
let x = 10
function foo() { console.log(x) }
function bar() { let x = 20; foo() }
bar() // 输出 10，不是 20（词法作用域，foo 定义时 x=10）`
    },
    {
      id: 'js010',
      title: 'JavaScript 中的类型转换规则是什么？',
      difficulty: 2,
      tags: ['类型转换', '隐式转换', '高频'],
      answer: `## 类型转换

### 显式转换
- \`Number()\`、\`String()\`、\`Boolean()\`
- \`parseInt()\`、\`parseFloat()\`
- \`.toString()\`

### 隐式转换规则
1. **字符串拼接**：\`+\` 运算符有字符串时，其他值转为字符串
2. **数学运算**：\`-\`、\`*\`、\`/\` 会将操作数转为数字
3. **布尔判断**：\`if\`、\`&&\`、\`||\`、\`!\` 会将值转为布尔值

### falsy 值（转为 false 的值）
\`false\`、\`0\`、\`-0\`、\`''\`、\`null\`、\`undefined\`、\`NaN\`

### == 和 === 的区别
- \`==\`：会进行类型转换后比较（宽松相等）
- \`===\`：不进行类型转换，类型和值都必须相同（严格相等）
- 推荐始终使用 \`===\``,
      code: `// 字符串拼接
'1' + 2       // '12'（数字转字符串）
'1' - 2       // -1（字符串转数字）

// 布尔转换
Boolean(0)     // false
Boolean('')    // false
Boolean(null)  // false
Boolean('0')   // true（非空字符串）
Boolean([])    // true（空数组也是 true）
Boolean({})    // true（空对象也是 true）

// == 的坑
'' == false    // true
0 == false     // true
null == undefined // true
NaN == NaN     // false（NaN 不等于任何值）

// 推荐用 ===
'' === false   // false
0 === false    // false`
    },
    {
      id: 'js011',
      title: 'JavaScript 中数组有哪些常用方法？',
      difficulty: 1,
      tags: ['数组', '方法', '基础'],
      answer: `## 数组常用方法

### 改变原数组的方法
- \`push()\` / \`pop()\`：尾部添加/删除
- \`unshift()\` / \`shift()\`：头部添加/删除
- \`splice()\`：任意位置增删改
- \`sort()\`：排序
- \`reverse()\`：反转
- \`fill()\`：填充

### 不改变原数组的方法
- \`map()\`：映射，返回新数组
- \`filter()\`：过滤，返回满足条件的元素
- \`reduce()\`：累加器，将数组归约为单个值
- \`find()\` / \`findIndex()\`：查找元素/索引
- \`some()\` / \`every()\`：是否有/全部满足条件
- \`slice()\`：截取子数组
- \`concat()\`：合并数组
- \`flat()\` / \`flatMap()\`：扁平化
- \`includes()\`：是否包含某元素`,
      code: `const arr = [1, 2, 3, 4, 5]

// map：映射
arr.map(x => x * 2)           // [2, 4, 6, 8, 10]

// filter：过滤
arr.filter(x => x > 3)        // [4, 5]

// reduce：累加
arr.reduce((sum, x) => sum + x, 0) // 15

// find：查找
arr.find(x => x > 3)          // 4

// some / every
arr.some(x => x > 4)          // true
arr.every(x => x > 0)         // true

// flat：扁平化
[1, [2, [3]]].flat(Infinity)  // [1, 2, 3]

// 链式调用
arr.filter(x => x > 2).map(x => x * 10) // [30, 40, 50]`
    },
    {
      id: 'js012',
      title: '什么是变量提升？let/const 有变量提升吗？',
      difficulty: 2,
      tags: ['变量提升', 'hoisting', '作用域'],
      answer: `## 变量提升（Hoisting）

### var 的变量提升
\`var\` 声明的变量会被提升到当前作用域顶部，但赋值不会提升。提升后值为 \`undefined\`。

### 函数声明提升
函数声明会整体提升（包括函数体），可以在声明前调用。函数表达式不会提升。

### let/const 的"提升"
\`let\`/\`const\` 也有提升（进入作用域时就知道变量存在），但存在**暂时性死区（TDZ）**：从作用域开始到声明语句之间，访问变量会抛出 \`ReferenceError\`。

### 优先级
函数声明 > 变量声明（同名时函数声明覆盖变量声明）`,
      code: `// var 变量提升
console.log(a) // undefined（不是 ReferenceError）
var a = 1

// 等价于：
var a
console.log(a) // undefined
a = 1

// 函数声明提升
foo() // '函数声明' — 可以在声明前调用
function foo() { console.log('函数声明') }

// 函数表达式不提升
bar() // ❌ TypeError: bar is not a function
var bar = function() { console.log('函数表达式') }

// let 暂时性死区
console.log(b) // ❌ ReferenceError
let b = 2`
    },
    {
      id: 'js015',
      title: 'JavaScript 中数组有哪些常用方法？哪些会改变原数组？',
      difficulty: 1,
      tags: ['数组', '方法', '高频'],
      answer: `## 数组常用方法

### 会改变原数组（mutating）
- \`push / pop\`：尾部添加/删除
- \`unshift / shift\`：头部添加/删除
- \`splice\`：任意位置增删改
- \`sort\`：排序
- \`reverse\`：反转

### 不改变原数组（non-mutating）
- \`map\`：映射为新数组
- \`filter\`：过滤
- \`reduce\`：累积计算
- \`find / findIndex\`：查找元素/索引
- \`some / every\`：条件判断
- \`slice\`：截取
- \`concat\`：合并
- \`flat / flatMap\`：扁平化`,
      code: `const arr = [1, 2, 3, 4, 5]

// map：映射
arr.map(x => x * 2) // [2, 4, 6, 8, 10]

// filter：过滤
arr.filter(x => x > 3) // [4, 5]

// reduce：累积
arr.reduce((sum, x) => sum + x, 0) // 15

// find：查找
arr.find(x => x > 3) // 4

// flat：扁平化
[1, [2, [3]]].flat(Infinity) // [1, 2, 3]

// 链式调用
arr.filter(x => x > 2).map(x => x * 10) // [30, 40, 50]`
    },
    {
      id: 'js016',
      title: 'Map 和 Object 有什么区别？WeakMap 又是什么？',
      difficulty: 2,
      tags: ['Map', 'WeakMap', '数据结构'],
      answer: `## Map vs Object

| 对比项 | Map | Object |
|--------|-----|--------|
| 键类型 | 任意类型 | 字符串/Symbol |
| 键顺序 | 插入顺序 | 不保证 |
| 大小 | .size 属性 | Object.keys().length |
| 迭代 | 直接 for...of | 需要 Object.keys() |
| 性能 | 频繁增删更优 | 少量固定键更优 |

### WeakMap
- 键**必须是对象**（不能是基本类型）
- 键是**弱引用**，不阻止垃圾回收
- 不可迭代，没有 size 属性
- 适合：存储 DOM 节点关联数据、私有数据`,
      code: `// Map 基本用法
const map = new Map()
map.set('name', '张三')
map.set(1, 'number key')
map.set({}, 'object key')
console.log(map.size) // 3

// 遍历
for (const [key, value] of map) {
  console.log(key, value)
}

// WeakMap — 弱引用
const weakMap = new WeakMap()
let obj = { name: '张三' }
weakMap.set(obj, '额外数据')
obj = null // obj 可以被垃圾回收`
    },
    {
      id: 'js017',
      title: 'Promise 有哪些静态方法？各自的使用场景？',
      difficulty: 2,
      tags: ['Promise', '异步', '高频'],
      answer: `## Promise 静态方法

### Promise.all(promises)
- 所有 Promise 都成功才返回结果数组
- 任一失败则立即 reject
- 场景：并发请求多个接口，全部成功后处理

### Promise.allSettled(promises)
- 等所有 Promise 都完成（无论成功失败）
- 返回每个 Promise 的状态和结果
- 场景：批量操作，需要知道每个的结果

### Promise.race(promises)
- 返回第一个完成的结果（无论成功失败）
- 场景：超时控制、竞速请求

### Promise.any(promises)
- 返回第一个成功的结果
- 所有都失败才 reject（AggregateError）
- 场景：多源请求，取最快成功的`,
      code: `// Promise.all — 全部成功
const [user, orders] = await Promise.all([
  fetch('/api/user'),
  fetch('/api/orders')
])

// Promise.allSettled — 获取所有结果
const results = await Promise.allSettled([
  fetch('/api/a'),
  fetch('/api/b'), // 即使失败也不影响
])
results.forEach(r => {
  if (r.status === 'fulfilled') console.log(r.value)
  else console.log(r.reason)
})

// Promise.race — 超时控制
const timeout = new Promise((_, reject) =>
  setTimeout(() => reject('超时'), 5000)
)
const result = await Promise.race([fetch('/api/data'), timeout])`
    }
  ]
}

export default javascript
