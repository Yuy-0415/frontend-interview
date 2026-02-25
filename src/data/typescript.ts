import type { Category } from '../types'

const typescript: Category = {
  id: 'typescript',
  name: 'TypeScript',
  icon: '🔷',
  description: '基础类型、接口、泛型、装饰器、Vue3中TS应用',
  questions: [
    {
      id: 'ts001',
      title: 'TypeScript 中 interface 和 type 有什么区别？',
      difficulty: 2,
      tags: ['interface', 'type', '高频'],
      answer: `## interface vs type

### 相同点
- 都可以描述对象结构
- 都支持扩展（继承）

### 不同点

| 特性 | interface | type |
|------|-----------|------|
| 声明合并 | ✅ 同名自动合并 | ❌ 不允许重复 |
| 扩展方式 | extends 继承 | & 交叉类型 |
| 基本类型别名 | ❌ | ✅ type A = string |
| 联合类型 | ❌ | ✅ type A = B \\| C |
| 元组 | ❌ | ✅ type A = [string, number] |
| 映射类型 | ❌ | ✅ |

### 使用建议
- 描述对象/类的结构 → interface
- 联合类型、交叉类型、工具类型 → type
- 需要声明合并（如扩展第三方库类型）→ interface`,
      code: `// interface - 描述对象结构
interface User {
  name: string
  age: number
}
// 声明合并
interface User {
  email: string  // 自动合并到 User
}

// type - 更灵活
type ID = string | number                    // 联合类型
type UserWithRole = User & { role: string }  // 交叉类型
type Pair = [string, number]                 // 元组`
    },
    {
      id: 'ts002',
      title: 'TypeScript 中常用的工具类型有哪些？',
      difficulty: 2,
      tags: ['工具类型', 'Utility Types'],
      answer: `## 常用工具类型

| 工具类型 | 作用 |
|---------|------|
| \`Partial<T>\` | 所有属性变为可选 |
| \`Required<T>\` | 所有属性变为必选 |
| \`Readonly<T>\` | 所有属性变为只读 |
| \`Pick<T, K>\` | 从 T 中选取部分属性 |
| \`Omit<T, K>\` | 从 T 中排除部分属性 |
| \`Record<K, V>\` | 构造键值对类型 |
| \`ReturnType<T>\` | 获取函数返回值类型 |
| \`Parameters<T>\` | 获取函数参数类型 |`,
      code: `interface User {
  name: string
  age: number
  email: string
}

type PartialUser = Partial<User>       // 所有属性可选
type UserName = Pick<User, 'name'>     // 只取 name
type NoEmail = Omit<User, 'email'>     // 排除 email
type StringMap = Record<string, number> // { [key: string]: number }`
    },
    {
      id: 'ts003',
      title: 'TypeScript 中泛型是什么？有什么用？',
      difficulty: 2,
      tags: ['泛型', 'Generics', '高频'],
      answer: `## 泛型（Generics）

### 定义
泛型是**类型的参数化**，允许在定义函数、接口、类时不预先指定具体类型，而在使用时再指定。

### 作用
1. **类型安全**：保证输入输出类型一致
2. **代码复用**：一套逻辑适用于多种类型
3. **类型推导**：TypeScript 可以自动推断泛型类型

### 常见用法
- 泛型函数
- 泛型接口
- 泛型类
- 泛型约束（extends）
- 默认泛型参数`,
      code: `// 泛型函数
function identity<T>(value: T): T {
  return value
}
identity<string>('hello') // 显式指定
identity(42)              // 自动推断为 number

// 泛型约束
interface HasLength { length: number }
function logLength<T extends HasLength>(val: T): void {
  console.log(val.length)
}
logLength('hello')  // ✅ string 有 length
logLength([1, 2])   // ✅ array 有 length
logLength(123)      // ❌ number 没有 length

// 泛型接口
interface ApiResponse<T> {
  code: number
  data: T
  message: string
}
type UserResponse = ApiResponse<{ name: string; age: number }>

// 泛型默认值
function createArray<T = string>(length: number, value: T): T[] {
  return Array(length).fill(value)
}`
    },
    {
      id: 'ts004',
      title: 'TypeScript 中 any、unknown、never 有什么区别？',
      difficulty: 2,
      tags: ['any', 'unknown', 'never', '类型'],
      answer: `## any vs unknown vs never

### any（任意类型）
- 关闭类型检查，可以赋值给任何类型，也可以接收任何类型
- 相当于回到 JavaScript，失去类型安全
- 尽量避免使用

### unknown（未知类型）
- 类型安全的 any，可以接收任何类型的值
- 但使用前**必须进行类型检查**（类型收窄）
- 推荐用 unknown 替代 any

### never（永不类型）
- 表示永远不会出现的值
- 函数永远不会返回（抛异常、死循环）
- 用于穷举检查（确保 switch 覆盖所有情况）`,
      code: `// any — 不安全
let a: any = 'hello'
a.toFixed(2) // 不报错，但运行时崩溃

// unknown — 安全
let b: unknown = 'hello'
// b.toFixed(2) // ❌ 编译报错
if (typeof b === 'string') {
  b.toUpperCase() // ✅ 类型收窄后可用
}

// never — 穷举检查
type Shape = 'circle' | 'square' | 'triangle'
function getArea(shape: Shape) {
  switch (shape) {
    case 'circle': return Math.PI * 10
    case 'square': return 100
    case 'triangle': return 50
    default:
      const _exhaustive: never = shape // 如果漏了某个 case，这里会报错
      return _exhaustive
  }
}`
    },
    {
      id: 'ts005',
      title: 'TypeScript 在 Vue3 中如何使用？',
      difficulty: 2,
      tags: ['Vue3', 'TypeScript', '实战', '高频'],
      answer: `## Vue3 + TypeScript

### Props 类型定义
使用 \`defineProps<T>()\` 泛型方式定义 props 类型

### Emits 类型定义
使用 \`defineEmits<T>()\` 定义事件类型

### Ref 类型
\`ref<T>()\` 可以指定泛型类型

### 常见类型工具
- \`PropType<T>\`：复杂 props 类型
- \`ComponentPublicInstance\`：组件实例类型
- \`InjectionKey<T>\`：provide/inject 类型安全`,
      code: `<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Ref } from 'vue'

// Props 类型
interface Props {
  title: string
  count?: number
  items: string[]
}
const props = withDefaults(defineProps<Props>(), {
  count: 0,
  items: () => []
})

// Emits 类型
const emit = defineEmits<{
  (e: 'update', id: number): void
  (e: 'delete', id: number): void
}>()

// Ref 类型
const name = ref<string>('张三')
const list = ref<{ id: number; title: string }[]>([])

// 模板 ref 类型
const inputRef = ref<HTMLInputElement | null>(null)

// computed 自动推导类型
const fullName = computed(() => name.value + '先生')
</script>`
    },
    {
      id: 'ts006',
      title: 'TypeScript 中 enum 枚举有哪些类型？',
      difficulty: 1,
      tags: ['enum', '枚举', '基础'],
      answer: `## TypeScript 枚举

### 数字枚举
默认从 0 开始自增，也可以手动赋值。

### 字符串枚举
每个成员必须用字符串字面量初始化。

### 常量枚举（const enum）
编译时内联替换，不生成额外代码，性能更好。

### 使用建议
- 简单场景用 \`const enum\`（编译后体积更小）
- 需要反向映射时用普通数字枚举
- Vue3 项目中也可以用 \`as const\` 对象替代枚举`,
      code: `// 数字枚举
enum Direction {
  Up,      // 0
  Down,    // 1
  Left,    // 2
  Right    // 3
}

// 字符串枚举
enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Pending = 'PENDING'
}

// 常量枚举（推荐，编译后内联）
const enum Color {
  Red = 'RED',
  Green = 'GREEN',
  Blue = 'BLUE'
}
const c = Color.Red // 编译后直接变成 'RED'

// as const 替代方案（Vue3 项目常用）
const STATUS = {
  Active: 'ACTIVE',
  Inactive: 'INACTIVE'
} as const
type StatusType = typeof STATUS[keyof typeof STATUS] // 'ACTIVE' | 'INACTIVE'`
    },
    {
      id: 'ts007',
      title: '什么是类型守卫（Type Guard）？有哪些方式？',
      difficulty: 2,
      tags: ['类型守卫', '类型收窄'],
      answer: `## 类型守卫

### 定义
类型守卫是在运行时检查类型，让 TypeScript 在特定代码块中**收窄类型**。

### 常见方式
1. **typeof**：判断基本类型
2. **instanceof**：判断类的实例
3. **in**：判断对象是否有某个属性
4. **自定义类型谓词**：\`is\` 关键字
5. **可辨识联合**：通过共同的字面量属性区分

### 使用场景
- 处理联合类型时，根据不同类型执行不同逻辑
- API 返回数据的类型判断
- 错误处理时区分错误类型`,
      code: `// typeof 守卫
function padLeft(value: string | number) {
  if (typeof value === 'number') {
    return ' '.repeat(value) // value 被收窄为 number
  }
  return value // value 被收窄为 string
}

// 自定义类型谓词
interface Fish { swim(): void }
interface Bird { fly(): void }

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined
}

// 可辨识联合（推荐）
interface Circle { kind: 'circle'; radius: number }
interface Square { kind: 'square'; side: number }
type Shape = Circle | Square

function getArea(shape: Shape) {
  switch (shape.kind) {
    case 'circle': return Math.PI * shape.radius ** 2
    case 'square': return shape.side ** 2
  }
}`
    },
    {
      id: 'ts008',
      title: 'TypeScript 中如何实现条件类型和映射类型？',
      difficulty: 3,
      tags: ['条件类型', '映射类型', '高级'],
      answer: `## 高级类型

### 条件类型（Conditional Types）
\`T extends U ? X : Y\`
类似三元表达式，根据类型关系选择不同的类型。

### 映射类型（Mapped Types）
遍历联合类型或对象类型的键，生成新类型。

### infer 关键字
在条件类型中推断类型变量。

### 常见应用
- 实现自定义工具类型
- 类型转换和过滤
- 提取函数参数/返回值类型`,
      code: `// 条件类型
type IsString<T> = T extends string ? 'yes' : 'no'
type A = IsString<string>  // 'yes'
type B = IsString<number>  // 'no'

// infer 推断
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never
type Fn = () => string
type R = ReturnType<Fn> // string

// 映射类型
type Readonly<T> = {
  readonly [K in keyof T]: T[K]
}

// 自定义工具类型：将指定属性变为可选
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

interface User { name: string; age: number; email: string }
type UserOptionalEmail = PartialBy<User, 'email'>
// { name: string; age: number; email?: string }`
    },
    {
      id: 'ts009',
      title: 'TypeScript 中 enum 枚举有哪些类型？使用时要注意什么？',
      difficulty: 2,
      tags: ['enum', '枚举', '基础'],
      answer: `## TypeScript 枚举

### 数字枚举
默认从 0 开始自增，也可以手动赋值。

### 字符串枚举
每个成员必须用字符串字面量初始化，没有自增行为。

### 常量枚举（const enum）
编译时会被内联替换，不会生成额外的 JS 对象，性能更好。

### 注意事项
1. 数字枚举存在**反向映射**（值 → 键），字符串枚举没有
2. \`const enum\` 不能用于需要运行时遍历枚举的场景
3. 在 Vue3 + Vite 项目中，\`const enum\` 跨文件使用可能有问题，建议用普通 enum 或联合类型替代`,
      code: `// 数字枚举
enum Direction {
  Up,    // 0
  Down,  // 1
  Left,  // 2
  Right  // 3
}

// 字符串枚举
enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Pending = 'PENDING'
}

// 常量枚举（编译后被内联）
const enum Color {
  Red = '#ff0000',
  Green = '#00ff00',
  Blue = '#0000ff'
}
const c = Color.Red // 编译后直接变成 '#ff0000'

// 替代方案：联合类型（推荐）
type Difficulty = 1 | 2 | 3
type Theme = 'light' | 'dark' | 'auto'`
    },
    {
      id: 'ts010',
      title: 'TypeScript 中 never 类型是什么？有什么用？',
      difficulty: 3,
      tags: ['never', '类型系统', '高级'],
      answer: `## never 类型

### 定义
\`never\` 表示**永远不会出现的值**的类型，是所有类型的子类型。

### 出现场景
1. 函数抛出异常，永远不会正常返回
2. 函数包含无限循环
3. 类型收窄后的不可达分支

### 实际用途
1. **穷举检查**：确保 switch/if 覆盖了所有联合类型成员
2. **类型过滤**：在条件类型中过滤掉不需要的类型
3. **标记不可达代码**：帮助编译器检测逻辑错误`,
      code: `// 1. 穷举检查（最常用）
type Shape = 'circle' | 'square' | 'triangle'

function getArea(shape: Shape) {
  switch (shape) {
    case 'circle': return Math.PI * 10 * 10
    case 'square': return 10 * 10
    case 'triangle': return (10 * 8) / 2
    default:
      // 如果新增了 Shape 成员但没处理，这里会报错
      const _exhaustive: never = shape
      return _exhaustive
  }
}

// 2. 类型过滤
type NonNullable<T> = T extends null | undefined ? never : T
type Result = NonNullable<string | null | undefined> // string

// 3. 永不返回的函数
function throwError(msg: string): never {
  throw new Error(msg)
}`
    }
  ]
}

export default typescript

