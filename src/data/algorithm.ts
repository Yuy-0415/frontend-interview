import type { Category } from '../types'

const algorithm: Category = {
  id: 'algorithm',
  name: '算法与手写题',
  icon: '🧮',
  description: '排序算法、手写Promise、深拷贝、防抖节流',
  questions: [
    {
      id: 'al001',
      title: '手写防抖和节流函数',
      difficulty: 2,
      tags: ['防抖', '节流', '手写题', '高频'],
      answer: `## 防抖（Debounce）与节流（Throttle）

### 防抖
事件触发后延迟执行，如果在延迟期间再次触发则重新计时。
场景：搜索框输入、窗口 resize

### 节流
固定时间间隔内只执行一次。
场景：滚动事件、按钮防重复点击`,
      code: `// 防抖
function debounce(fn, delay = 300) {
  let timer = null
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

// 节流
function throttle(fn, interval = 300) {
  let last = 0
  return function(...args) {
    const now = Date.now()
    if (now - last >= interval) {
      last = now
      fn.apply(this, args)
    }
  }
}`
    },
    {
      id: 'al002',
      title: '手写深拷贝',
      difficulty: 3,
      tags: ['深拷贝', '手写题', '高频'],
      answer: `## 深拷贝

### 简单方案
\`JSON.parse(JSON.stringify(obj))\` — 不支持函数、undefined、循环引用、Date、RegExp

### 完整方案
递归拷贝 + WeakMap 处理循环引用`,
      code: `function deepClone(obj, map = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj)

  // 处理循环引用
  if (map.has(obj)) return map.get(obj)

  const clone = Array.isArray(obj) ? [] : {}
  map.set(obj, clone)

  for (const key of Reflect.ownKeys(obj)) {
    clone[key] = deepClone(obj[key], map)
  }
  return clone
}`
    },
    {
      id: 'al003',
      title: '手写 Promise.all 和 Promise.race',
      difficulty: 3,
      tags: ['Promise', '手写题', '高频'],
      answer: `## 手写 Promise.all / Promise.race

### Promise.all
- 接收一个 Promise 数组
- 所有 Promise 都成功才返回结果数组
- 任一 Promise 失败则立即 reject
- 结果顺序与输入顺序一致

### Promise.race
- 接收一个 Promise 数组
- 返回第一个完成的 Promise 的结果（无论成功失败）
- 常用于超时控制`,
      code: `// 手写 Promise.all
function myAll(promises) {
  return new Promise((resolve, reject) => {
    const results = []
    let count = 0
    if (promises.length === 0) return resolve([])

    promises.forEach((p, i) => {
      Promise.resolve(p).then(val => {
        results[i] = val // 保证顺序
        count++
        if (count === promises.length) resolve(results)
      }).catch(reject) // 任一失败立即 reject
    })
  })
}

// 手写 Promise.race
function myRace(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach(p => {
      Promise.resolve(p).then(resolve).catch(reject)
    })
  })
}

// 超时控制
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('超时')), ms)
  )
  return Promise.race([promise, timeout])
}`
    },
    {
      id: 'al004',
      title: '手写 new 操作符',
      difficulty: 2,
      tags: ['new', '手写题', '原型'],
      answer: `## 手写 new

### new 操作符做了什么？
1. 创建一个空对象
2. 将空对象的 \`__proto__\` 指向构造函数的 \`prototype\`
3. 执行构造函数，\`this\` 指向新对象
4. 如果构造函数返回对象，则返回该对象；否则返回新创建的对象`,
      code: `function myNew(Constructor, ...args) {
  // 1. 创建空对象，原型指向构造函数的 prototype
  const obj = Object.create(Constructor.prototype)

  // 2. 执行构造函数，this 指向新对象
  const result = Constructor.apply(obj, args)

  // 3. 如果构造函数返回对象，则返回该对象
  return result instanceof Object ? result : obj
}

// 测试
function Person(name, age) {
  this.name = name
  this.age = age
}
Person.prototype.sayHi = function() {
  console.log('Hi, I am ' + this.name)
}

const p = myNew(Person, '张三', 25)
p.sayHi() // Hi, I am 张三
console.log(p instanceof Person) // true`
    },
    {
      id: 'al005',
      title: '手写 call、apply、bind',
      difficulty: 3,
      tags: ['call', 'apply', 'bind', '手写题', '高频'],
      answer: `## 手写 call / apply / bind

### 核心思路
将函数作为目标对象的临时方法调用，这样 this 就指向了目标对象。

### call
逐个传参，立即执行

### apply
数组传参，立即执行

### bind
返回新函数，支持柯里化`,
      code: `// 手写 call
Function.prototype.myCall = function(context, ...args) {
  context = context || window
  const key = Symbol() // 避免属性名冲突
  context[key] = this  // this 是调用 myCall 的函数
  const result = context[key](...args)
  delete context[key]
  return result
}

// 手写 apply
Function.prototype.myApply = function(context, args = []) {
  context = context || window
  const key = Symbol()
  context[key] = this
  const result = context[key](...args)
  delete context[key]
  return result
}

// 手写 bind
Function.prototype.myBind = function(context, ...outerArgs) {
  const fn = this
  return function(...innerArgs) {
    return fn.apply(context, [...outerArgs, ...innerArgs])
  }
}

// 测试
function greet(age) { console.log(this.name, age) }
greet.myCall({ name: '张三' }, 25)   // 张三 25
greet.myApply({ name: '李四' }, [30]) // 李四 30
const bound = greet.myBind({ name: '王五' })
bound(35) // 王五 35`
    },
    {
      id: 'al006',
      title: '手写数组扁平化（flat）',
      difficulty: 2,
      tags: ['数组', 'flat', '手写题'],
      answer: `## 数组扁平化

### 需求
将多维数组转为一维数组：\`[1, [2, [3, 4]]] → [1, 2, 3, 4]\`

### 实现方式
1. **递归**：遍历数组，遇到子数组递归处理
2. **reduce + 递归**：更简洁的写法
3. **flat(Infinity)**：原生方法
4. **toString + split**：简单但只适合数字数组
5. **栈/队列**：非递归实现`,
      code: `// 方法1：递归
function flatten(arr) {
  const result = []
  for (const item of arr) {
    if (Array.isArray(item)) {
      result.push(...flatten(item))
    } else {
      result.push(item)
    }
  }
  return result
}

// 方法2：reduce（更简洁）
function flatten(arr) {
  return arr.reduce((acc, cur) =>
    acc.concat(Array.isArray(cur) ? flatten(cur) : cur), [])
}

// 方法3：指定深度
function flattenDepth(arr, depth = 1) {
  if (depth <= 0) return arr.slice()
  return arr.reduce((acc, cur) =>
    acc.concat(Array.isArray(cur) ? flattenDepth(cur, depth - 1) : cur), [])
}

// 原生方法
[1, [2, [3]]].flat(Infinity) // [1, 2, 3]`
    },
    {
      id: 'al007',
      title: '手写 instanceof',
      difficulty: 2,
      tags: ['instanceof', '原型链', '手写题'],
      answer: `## 手写 instanceof

### 原理
沿着对象的原型链（\`__proto__\`）向上查找，看是否能找到构造函数的 \`prototype\`。

### 步骤
1. 获取对象的 \`__proto__\`
2. 获取构造函数的 \`prototype\`
3. 循环比较，相等则返回 true
4. 到达原型链顶端（null）则返回 false`,
      code: `function myInstanceof(obj, Constructor) {
  if (obj === null || typeof obj !== 'object') return false

  let proto = Object.getPrototypeOf(obj)
  const prototype = Constructor.prototype

  while (proto !== null) {
    if (proto === prototype) return true
    proto = Object.getPrototypeOf(proto)
  }
  return false
}

// 测试
console.log(myInstanceof([], Array))    // true
console.log(myInstanceof([], Object))   // true
console.log(myInstanceof({}, Array))    // false
console.log(myInstanceof('hello', String)) // false（基本类型）`
    },
    {
      id: 'al008',
      title: '常见排序算法及其时间复杂度？',
      difficulty: 2,
      tags: ['排序', '算法', '复杂度'],
      answer: `## 常见排序算法

| 算法 | 平均时间 | 最坏时间 | 空间 | 稳定性 |
|------|---------|---------|------|--------|
| 冒泡排序 | O(n²) | O(n²) | O(1) | 稳定 |
| 选择排序 | O(n²) | O(n²) | O(1) | 不稳定 |
| 插入排序 | O(n²) | O(n²) | O(1) | 稳定 |
| 快速排序 | O(nlogn) | O(n²) | O(logn) | 不稳定 |
| 归并排序 | O(nlogn) | O(nlogn) | O(n) | 稳定 |

### 面试重点
- 快速排序：分治思想，选基准、分区、递归
- 归并排序：分治 + 合并，稳定的 O(nlogn)
- 了解各算法的适用场景和优缺点`,
      code: `// 快速排序
function quickSort(arr) {
  if (arr.length <= 1) return arr
  const pivot = arr[0]
  const left = [], right = []
  for (let i = 1; i < arr.length; i++) {
    arr[i] < pivot ? left.push(arr[i]) : right.push(arr[i])
  }
  return [...quickSort(left), pivot, ...quickSort(right)]
}

// 归并排序
function mergeSort(arr) {
  if (arr.length <= 1) return arr
  const mid = Math.floor(arr.length / 2)
  const left = mergeSort(arr.slice(0, mid))
  const right = mergeSort(arr.slice(mid))
  return merge(left, right)
}
function merge(left, right) {
  const result = []
  let i = 0, j = 0
  while (i < left.length && j < right.length) {
    left[i] <= right[j] ? result.push(left[i++]) : result.push(right[j++])
  }
  return result.concat(left.slice(i)).concat(right.slice(j))
}`
    },
    {
      id: 'al009',
      title: '手写 Promise.all 和 Promise.race',
      difficulty: 3,
      tags: ['Promise', '手写题', '高频'],
      answer: `## Promise.all / Promise.race

### Promise.all
- 接收一个 Promise 数组，返回一个新 Promise
- **全部成功**才 resolve（结果数组顺序与输入一致）
- **任一失败**立即 reject

### Promise.race
- 接收一个 Promise 数组，返回一个新 Promise
- **第一个完成**（无论成功/失败）的结果作为最终结果

### 其他组合方法
- \`Promise.allSettled\`：等所有都完成，返回每个的状态和结果
- \`Promise.any\`：第一个成功的结果（全部失败才 reject）`,
      code: `// 手写 Promise.all
function myAll(promises) {
  return new Promise((resolve, reject) => {
    const results = []
    let count = 0
    if (promises.length === 0) return resolve([])

    promises.forEach((p, i) => {
      Promise.resolve(p).then(value => {
        results[i] = value // 保持顺序
        if (++count === promises.length) resolve(results)
      }).catch(reject) // 任一失败立即 reject
    })
  })
}

// 手写 Promise.race
function myRace(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach(p => {
      Promise.resolve(p).then(resolve, reject) // 第一个完成的决定结果
    })
  })
}

// 测试
myAll([
  Promise.resolve(1),
  new Promise(r => setTimeout(() => r(2), 100)),
  Promise.resolve(3)
]).then(console.log) // [1, 2, 3]`
    },
    {
      id: 'al010',
      title: '手写数组扁平化（flat）',
      difficulty: 2,
      tags: ['数组', '递归', '手写题'],
      answer: `## 数组扁平化

### 定义
将多层嵌套的数组转换为一维数组。

### 实现方式
1. **递归**：遍历数组，遇到子数组递归处理
2. **reduce + concat**：利用 reduce 累积
3. **toString + split**：简单但只适用于数字
4. **flat(Infinity)**：原生方法（ES2019）
5. **栈/队列**：非递归实现`,
      code: `// 方法1：递归
function flatten(arr) {
  const result = []
  for (const item of arr) {
    if (Array.isArray(item)) {
      result.push(...flatten(item))
    } else {
      result.push(item)
    }
  }
  return result
}

// 方法2：reduce
function flatten2(arr) {
  return arr.reduce((acc, item) =>
    acc.concat(Array.isArray(item) ? flatten2(item) : item), [])
}

// 方法3：指定深度的扁平化
function flattenDepth(arr, depth = 1) {
  if (depth <= 0) return arr.slice()
  return arr.reduce((acc, item) =>
    acc.concat(Array.isArray(item) ? flattenDepth(item, depth - 1) : item), [])
}

// 方法4：栈实现（非递归）
function flattenStack(arr) {
  const stack = [...arr]
  const result = []
  while (stack.length) {
    const item = stack.pop()
    Array.isArray(item) ? stack.push(...item) : result.unshift(item)
  }
  return result
}

// 测试
flatten([1, [2, [3, [4]]]]) // [1, 2, 3, 4]`
    },
    {
      id: 'al011',
      title: '手写 new 操作符',
      difficulty: 2,
      tags: ['new', '原型', '手写题'],
      answer: `## new 操作符的过程

### 四个步骤
1. 创建一个空对象
2. 将空对象的 \`__proto__\` 指向构造函数的 \`prototype\`
3. 将构造函数的 \`this\` 绑定到新对象，执行构造函数
4. 如果构造函数返回对象，则返回该对象；否则返回新创建的对象`,
      code: `function myNew(Constructor, ...args) {
  // 1. 创建空对象，原型指向构造函数的 prototype
  const obj = Object.create(Constructor.prototype)

  // 2. 执行构造函数，绑定 this
  const result = Constructor.apply(obj, args)

  // 3. 如果构造函数返回了对象，则使用该对象；否则返回新对象
  return result instanceof Object ? result : obj
}

// 测试
function Person(name, age) {
  this.name = name
  this.age = age
}
Person.prototype.sayHi = function() {
  console.log('我是' + this.name)
}

const p = myNew(Person, '张三', 25)
console.log(p.name) // '张三'
p.sayHi()           // '我是张三'
console.log(p instanceof Person) // true`
    }
  ]
}

export default algorithm

