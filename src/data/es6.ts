import type { Category } from '../types'

const es6: Category = {
  id: 'es6',
  name: 'ES6+',
  icon: '✨',
  description: 'let/const、解构、Set/Map、Proxy、Promise、Module',
  questions: [
    {
      id: 'es001',
      title: 'var、let、const 有什么区别？',
      difficulty: 1,
      tags: ['变量声明', '作用域', '高频'],
      answer: `## var / let / const 区别

| 特性 | var | let | const |
|------|-----|-----|-------|
| 作用域 | 函数作用域 | 块级作用域 | 块级作用域 |
| 变量提升 | 有（值为 undefined） | 有（暂时性死区） | 有（暂时性死区） |
| 重复声明 | 允许 | 不允许 | 不允许 |
| 重新赋值 | 允许 | 允许 | 不允许（引用类型内部可修改） |
| 全局属性 | 挂载到 window | 不挂载 | 不挂载 |

### 暂时性死区（TDZ）
let/const 声明的变量在声明之前不可访问，会抛出 ReferenceError`,
      code: `// 经典面试题：for 循环中的 var vs let
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100) // 输出 3, 3, 3
}

for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100) // 输出 0, 1, 2
}

// const 引用类型可修改内部属性
const obj = { name: '张三' }
obj.name = '李四' // ✅ 合法
obj = {}           // ❌ TypeError`
    },
    {
      id: 'es002',
      title: 'Promise 的理解？手写一个简易 Promise',
      difficulty: 3,
      tags: ['Promise', '异步', '手写题', '高频'],
      answer: `## Promise

### 三种状态
- **pending**：初始状态
- **fulfilled**：操作成功
- **rejected**：操作失败

状态一旦改变就不可逆（pending → fulfilled 或 pending → rejected）

### 核心方法
- \`.then(onFulfilled, onRejected)\`：注册回调
- \`.catch(onRejected)\`：捕获错误
- \`.finally(callback)\`：无论成功失败都执行

### 静态方法
- \`Promise.all\`：全部成功才成功，一个失败就失败
- \`Promise.race\`：第一个完成的结果（无论成功失败）
- \`Promise.allSettled\`：等所有都完成，返回每个结果
- \`Promise.any\`：第一个成功的结果`,
      code: `// 简易 Promise 实现
class MyPromise {
  constructor(executor) {
    this.state = 'pending'
    this.value = undefined
    this.callbacks = []

    const resolve = (value) => {
      if (this.state !== 'pending') return
      this.state = 'fulfilled'
      this.value = value
      this.callbacks.forEach(cb => cb.onFulfilled(value))
    }

    const reject = (reason) => {
      if (this.state !== 'pending') return
      this.state = 'rejected'
      this.value = reason
      this.callbacks.forEach(cb => cb.onRejected(reason))
    }

    try { executor(resolve, reject) }
    catch (e) { reject(e) }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const handle = (callback, fallback) => {
        try {
          const result = (callback || fallback)(this.value)
          resolve(result)
        } catch (e) { reject(e) }
      }
      if (this.state === 'fulfilled') handle(onFulfilled, v => v)
      else if (this.state === 'rejected') handle(onRejected, e => { throw e })
      else this.callbacks.push({
        onFulfilled: () => handle(onFulfilled, v => v),
        onRejected: () => handle(onRejected, e => { throw e })
      })
    })
  }
}`
    },
    {
      id: 'es003',
      title: '箭头函数和普通函数有什么区别？',
      difficulty: 1,
      tags: ['箭头函数', 'this', '高频'],
      answer: `## 箭头函数 vs 普通函数

### 核心区别

| 特性 | 普通函数 | 箭头函数 |
|------|---------|---------|
| this | 动态绑定（调用时决定） | 词法绑定（定义时决定） |
| arguments | 有 | 没有（用 rest 参数替代） |
| new 调用 | 可以作为构造函数 | 不能 new |
| prototype | 有 | 没有 |
| yield | 可以做 Generator | 不能 |

### 箭头函数的 this
箭头函数没有自己的 this，继承外层作用域的 this，且无法通过 call/apply/bind 改变。

### 使用建议
- 回调函数、数组方法 → 箭头函数
- 对象方法、需要 this 的场景 → 普通函数
- 构造函数 → 必须用普通函数或 class`,
      code: `const obj = {
  name: '张三',
  // 普通函数：this 指向 obj
  sayHi() {
    console.log(this.name) // '张三'
  },
  // 箭头函数：this 指向外层（window）
  sayHello: () => {
    console.log(this.name) // undefined
  },
  // 定时器中的经典问题
  delayLog() {
    // ❌ 普通函数：this 指向 window
    setTimeout(function() { console.log(this.name) }, 100)
    // ✅ 箭头函数：this 继承 delayLog 的 this
    setTimeout(() => { console.log(this.name) }, 100)
  }
}`
    },
    {
      id: 'es004',
      title: '解构赋值有哪些用法？',
      difficulty: 1,
      tags: ['解构', '语法', '基础'],
      answer: `## 解构赋值

### 数组解构
按位置匹配，可以跳过元素、设置默认值、使用 rest 参数。

### 对象解构
按属性名匹配，可以重命名、设置默认值、嵌套解构。

### 常见应用场景
1. 交换变量值
2. 函数参数解构
3. 提取 JSON 数据
4. 函数返回多个值
5. 模块导入`,
      code: `// 数组解构
const [a, , b] = [1, 2, 3]       // a=1, b=3（跳过第二个）
const [x = 10] = []               // x=10（默认值）
const [first, ...rest] = [1,2,3]  // first=1, rest=[2,3]

// 交换变量
let a = 1, b = 2;
[a, b] = [b, a]  // a=2, b=1

// 对象解构
const { name, age: userAge = 18 } = { name: '张三' }
// name='张三', userAge=18（重命名 + 默认值）

// 嵌套解构
const { address: { city } } = { address: { city: '北京' } }

// 函数参数解构
function greet({ name, age = 18 }) {
  console.log(\`\${name}, \${age}岁\`)
}
greet({ name: '张三' })`
    },
    {
      id: 'es005',
      title: 'Set 和 Map 是什么？和普通对象/数组有什么区别？',
      difficulty: 2,
      tags: ['Set', 'Map', '数据结构'],
      answer: `## Set 和 Map

### Set（集合）
- 值唯一，不允许重复
- 常用于**数组去重**
- 方法：add、delete、has、clear
- 可遍历（for...of、forEach）

### Map（映射）
- 键值对集合，键可以是**任意类型**（普通对象的键只能是字符串/Symbol）
- 保持插入顺序
- 方法：set、get、delete、has、clear
- 性能：频繁增删时比普通对象更快

### WeakSet / WeakMap
- 键必须是对象（弱引用）
- 不阻止垃圾回收
- 不可遍历
- 适合：存储 DOM 节点引用、私有数据`,
      code: `// Set 去重
const arr = [1, 2, 2, 3, 3, 3]
const unique = [...new Set(arr)] // [1, 2, 3]

// Set 操作
const set = new Set([1, 2, 3])
set.add(4)      // {1, 2, 3, 4}
set.has(2)      // true
set.delete(1)   // {2, 3, 4}
set.size        // 3

// Map 用法
const map = new Map()
const objKey = { id: 1 }
map.set(objKey, '对象作为键')  // 普通对象做不到
map.get(objKey) // '对象作为键'

// WeakMap 存储私有数据
const privateData = new WeakMap()
class User {
  constructor(name) {
    privateData.set(this, { name })
  }
  getName() {
    return privateData.get(this).name
  }
}`
    },
    {
      id: 'es006',
      title: 'Proxy 和 Reflect 是什么？有什么用？',
      difficulty: 3,
      tags: ['Proxy', 'Reflect', '元编程'],
      answer: `## Proxy 和 Reflect

### Proxy（代理）
用于创建一个对象的代理，拦截并自定义对象的基本操作（读取、赋值、删除等）。

### 可拦截的操作（13种）
- get / set / deleteProperty / has / ownKeys
- apply / construct / getPrototypeOf / setPrototypeOf
- defineProperty / getOwnPropertyDescriptor
- isExtensible / preventExtensions

### Reflect（反射）
与 Proxy 的拦截方法一一对应，提供操作对象的默认行为。
- 让操作对象的行为更规范（返回布尔值而非抛错）
- 配合 Proxy 使用，确保默认行为正确执行

### 应用场景
- Vue3 响应式系统
- 数据验证
- 日志记录
- 默认值处理`,
      code: `// 数据验证 Proxy
const validator = new Proxy({}, {
  set(target, key, value, receiver) {
    if (key === 'age' && typeof value !== 'number') {
      throw new TypeError('age 必须是数字')
    }
    if (key === 'age' && (value < 0 || value > 150)) {
      throw new RangeError('age 必须在 0-150 之间')
    }
    return Reflect.set(target, key, value, receiver)
  }
})

validator.age = 25   // ✅
validator.age = '25' // ❌ TypeError
validator.age = 200  // ❌ RangeError

// 负索引数组
function createNegativeArray(arr) {
  return new Proxy(arr, {
    get(target, key, receiver) {
      const index = Number(key)
      if (index < 0) return target[target.length + index]
      return Reflect.get(target, key, receiver)
    }
  })
}
const arr = createNegativeArray([1, 2, 3])
arr[-1] // 3`
    },
    {
      id: 'es007',
      title: 'ES6 模块（import/export）和 CommonJS（require）有什么区别？',
      difficulty: 2,
      tags: ['模块化', 'import', 'require', '高频'],
      answer: `## ES Module vs CommonJS

| 对比项 | ES Module | CommonJS |
|--------|-----------|----------|
| 语法 | import / export | require / module.exports |
| 加载时机 | 编译时（静态分析） | 运行时（动态加载） |
| 输出 | 值的引用（实时绑定） | 值的拷贝 |
| 顶层 this | undefined | module 对象 |
| Tree-shaking | ✅ 支持 | ❌ 不支持 |
| 循环引用 | 支持（引用绑定） | 部分支持（可能拿到未完成的值） |
| 使用环境 | 浏览器 + Node | 主要 Node |

### 关键区别：值的引用 vs 值的拷贝
- ES Module：导出的是值的**实时引用**，源模块修改后，导入方也会变
- CommonJS：导出的是值的**拷贝**，源模块修改后，导入方不变`,
      code: `// ES Module
// math.js
export const PI = 3.14
export function add(a, b) { return a + b }
export default class Calculator {}

// 导入
import Calculator, { PI, add } from './math.js'
import * as math from './math.js'

// CommonJS
// math.js
const PI = 3.14
function add(a, b) { return a + b }
module.exports = { PI, add }

// 导入
const { PI, add } = require('./math.js')`
    },
    {
      id: 'es008',
      title: 'for...in 和 for...of 有什么区别？',
      difficulty: 1,
      tags: ['遍历', '迭代器', '基础'],
      answer: `## for...in vs for...of

### for...in
- 遍历对象的**可枚举属性的键名**（包括原型链上的）
- 适合遍历对象
- 遍历数组时得到的是**索引**（字符串类型）
- 不保证顺序

### for...of
- 遍历**可迭代对象的值**（Array、Set、Map、String、arguments）
- 不能直接遍历普通对象（除非实现 Symbol.iterator）
- 遍历数组时得到的是**值**
- 支持 break、continue、return

### 使用建议
- 遍历对象属性 → for...in（配合 hasOwnProperty）
- 遍历数组/集合的值 → for...of
- 需要索引和值 → for...of + entries()`,
      code: `const arr = ['a', 'b', 'c']
arr.extra = 'test'

// for...in：遍历键（包括额外属性）
for (const key in arr) {
  console.log(key) // '0', '1', '2', 'extra'
}

// for...of：遍历值
for (const val of arr) {
  console.log(val) // 'a', 'b', 'c'（不包括 extra）
}

// 遍历对象
const obj = { a: 1, b: 2 }
for (const key in obj) {
  if (obj.hasOwnProperty(key)) {
    console.log(key, obj[key])
  }
}

// for...of + entries()
for (const [index, value] of arr.entries()) {
  console.log(index, value)
}`
    },
    {
      id: 'es009',
      title: 'ES6 中 Symbol 是什么？有什么用？',
      difficulty: 2,
      tags: ['Symbol', '基本类型', 'ES6'],
      answer: `## Symbol

### 定义
Symbol 是 ES6 新增的**第七种基本数据类型**，每个 Symbol 值都是唯一的。

### 特点
1. 通过 \`Symbol()\` 创建，不能用 \`new\`
2. 每次调用 \`Symbol()\` 都返回不同的值
3. 可以作为对象属性名，避免属性名冲突
4. 不会被 \`for...in\`、\`Object.keys()\` 遍历到

### 内置 Symbol
- \`Symbol.iterator\`：定义对象的迭代行为
- \`Symbol.toPrimitive\`：对象转原始值的行为
- \`Symbol.hasInstance\`：\`instanceof\` 的行为

### 使用场景
- 定义对象的私有属性
- 防止属性名冲突（如第三方库扩展）
- 实现迭代器协议`,
      code: `// 基本用法
const s1 = Symbol('描述')
const s2 = Symbol('描述')
console.log(s1 === s2) // false（每个都是唯一的）

// 作为属性名
const KEY = Symbol('myKey')
const obj = { [KEY]: '私有值', name: '公开值' }
console.log(obj[KEY])        // '私有值'
console.log(Object.keys(obj)) // ['name']（Symbol 属性不会被遍历）

// Symbol.for：全局共享
const s3 = Symbol.for('shared')
const s4 = Symbol.for('shared')
console.log(s3 === s4) // true

// 实现迭代器
const range = {
  from: 1, to: 5,
  [Symbol.iterator]() {
    let current = this.from
    return {
      next: () => current <= this.to
        ? { value: current++, done: false }
        : { done: true }
    }
  }
}
for (const n of range) console.log(n) // 1,2,3,4,5`
    },
    {
      id: 'es010',
      title: 'ES6 中 Iterator 和 for...of 是什么？',
      difficulty: 2,
      tags: ['Iterator', 'for...of', '迭代器'],
      answer: `## Iterator（迭代器）

### 迭代器协议
一个对象实现了 \`[Symbol.iterator]()\` 方法，返回一个包含 \`next()\` 方法的对象，就是可迭代的。

### next() 返回值
\`{ value: any, done: boolean }\`

### 原生可迭代对象
Array、String、Map、Set、arguments、NodeList、TypedArray

### for...of vs for...in
| 对比 | for...of | for...in |
|------|----------|----------|
| 遍历目标 | 可迭代对象的值 | 对象的可枚举属性名 |
| 数组 | 遍历元素值 | 遍历索引（字符串） |
| 原型链 | 不遍历 | 会遍历原型链属性 |
| 适用 | 数组/Map/Set | 普通对象 |`,
      code: `// for...of 遍历值
const arr = [10, 20, 30]
for (const val of arr) console.log(val) // 10, 20, 30

// for...in 遍历键
for (const key in arr) console.log(key) // '0', '1', '2'

// 解构、展开运算符底层都用迭代器
const [a, b] = [1, 2]     // 迭代器解构
const copy = [...arr]       // 迭代器展开

// 自定义可迭代对象
class Fibonacci {
  [Symbol.iterator]() {
    let [prev, curr] = [0, 1]
    return {
      next() {
        [prev, curr] = [curr, prev + curr]
        return { value: prev, done: prev > 100 }
      }
    }
  }
}
for (const n of new Fibonacci()) console.log(n)
// 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89`
    },
    {
      id: 'es011',
      title: 'ES6 中 Generator 函数是什么？和 async/await 有什么关系？',
      difficulty: 3,
      tags: ['Generator', 'yield', '异步'],
      answer: `## Generator 函数

### 定义
Generator 是一种可以**暂停和恢复执行**的函数，用 \`function*\` 声明，内部用 \`yield\` 暂停。

### 特点
1. 调用 Generator 函数返回一个迭代器对象
2. 调用 \`next()\` 执行到下一个 \`yield\`，返回 \`{ value, done }\`
3. \`next(val)\` 可以向 Generator 内部传值
4. 天然支持 \`for...of\` 遍历

### 与 async/await 的关系
\`async/await\` 本质上是 Generator + Promise 的语法糖：
- \`async function\` ≈ \`function*\`
- \`await\` ≈ \`yield\`
- 自动执行器（不需要手动调用 next）`,
      code: `// 基本用法
function* counter() {
  yield 1
  yield 2
  yield 3
}
const gen = counter()
gen.next() // { value: 1, done: false }
gen.next() // { value: 2, done: false }
gen.next() // { value: 3, done: false }
gen.next() // { value: undefined, done: true }

// 传值
function* adder() {
  const a = yield '请输入第一个数'
  const b = yield '请输入第二个数'
  return a + b
}
const g = adder()
g.next()    // { value: '请输入第一个数' }
g.next(10)  // { value: '请输入第二个数' }（a = 10）
g.next(20)  // { value: 30, done: true }（b = 20）

// async/await 等价写法
async function fetchData() {
  const res = await fetch('/api')
  const data = await res.json()
  return data
}`
    }
  ]
}

export default es6

