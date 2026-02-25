import type { Category } from '../types'

const http: Category = {
  id: 'http',
  name: 'HTTP/网络',
  icon: '🌐',
  description: 'HTTP/HTTPS、TCP/UDP、状态码、跨域、WebSocket',
  questions: [
    {
      id: 'ht001',
      title: 'HTTP 和 HTTPS 有什么区别？',
      difficulty: 1,
      tags: ['HTTP', 'HTTPS', '高频'],
      answer: `## HTTP vs HTTPS

| 对比项 | HTTP | HTTPS |
|--------|------|-------|
| 端口 | 80 | 443 |
| 安全性 | 明文传输 | SSL/TLS 加密 |
| 证书 | 不需要 | 需要 CA 证书 |
| 性能 | 较快 | 略慢（加密开销） |
| SEO | 无加分 | 搜索引擎优先收录 |

### HTTPS 加密过程（简化）
1. 客户端发起请求，发送支持的加密算法列表
2. 服务端返回证书（含公钥）
3. 客户端验证证书，生成随机密钥，用公钥加密后发送
4. 服务端用私钥解密，得到随机密钥
5. 双方使用该随机密钥进行对称加密通信`,
    },
    {
      id: 'ht002',
      title: '常见的 HTTP 状态码有哪些？',
      difficulty: 1,
      tags: ['状态码', '高频'],
      answer: `## HTTP 状态码

### 2xx 成功
- **200**：请求成功
- **201**：创建成功（POST）
- **204**：成功但无返回内容（DELETE）

### 3xx 重定向
- **301**：永久重定向（SEO 权重转移）
- **302**：临时重定向
- **304**：资源未修改，使用缓存

### 4xx 客户端错误
- **400**：请求参数错误
- **401**：未认证（需要登录）
- **403**：无权限（已登录但权限不足）
- **404**：资源不存在
- **405**：请求方法不允许

### 5xx 服务端错误
- **500**：服务器内部错误
- **502**：网关错误
- **503**：服务不可用（过载/维护）
- **504**：网关超时`,
    },
    {
      id: 'ht003',
      title: '跨域是什么？怎么解决？',
      difficulty: 2,
      tags: ['跨域', 'CORS', '高频'],
      answer: `## 跨域问题

### 什么是跨域？
浏览器的**同源策略**限制：协议、域名、端口三者任一不同即为跨域。

### 解决方案

**1. CORS（推荐）**
服务端设置响应头 \`Access-Control-Allow-Origin\`

**2. 代理服务器（开发环境）**
Vite/Webpack 配置 proxy，将请求代理到目标服务器

**3. JSONP（仅 GET）**
利用 \`<script>\` 标签不受同源策略限制的特性

**4. Nginx 反向代理（生产环境）**
通过 Nginx 转发请求，绕过浏览器限制`,
      code: `// Vite 代理配置
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\\/api/, '')
      }
    }
  }
})`
    },
    {
      id: 'ht004',
      title: 'HTTP 缓存机制是怎样的？强缓存和协商缓存有什么区别？',
      difficulty: 2,
      tags: ['缓存', '强缓存', '协商缓存', '高频'],
      answer: `## HTTP 缓存机制

### 强缓存（不发请求）
浏览器直接从本地缓存读取，不与服务器通信。
- \`Cache-Control: max-age=3600\`（优先级高）
- \`Expires: Thu, 01 Jan 2026 00:00:00 GMT\`（绝对时间，已过时）

### 协商缓存（发请求验证）
浏览器发请求到服务器，服务器判断资源是否变化：
- \`Last-Modified / If-Modified-Since\`：基于修改时间
- \`ETag / If-None-Match\`：基于内容哈希（更精确）

返回 304 表示未修改，使用缓存；200 表示已更新，返回新资源。

### 缓存策略优先级
Cache-Control > Expires > ETag > Last-Modified

### 实际应用
- HTML：不缓存或短时间缓存（协商缓存）
- CSS/JS：长期强缓存 + 文件名哈希（内容变化时文件名变化）
- 图片/字体：长期强缓存`,
      code: `// Nginx 缓存配置示例
// HTML 不缓存
location / {
  add_header Cache-Control "no-cache";
}

// 静态资源长期缓存（文件名含哈希）
location /assets/ {
  add_header Cache-Control "public, max-age=31536000, immutable";
}

// Vite 打包自动给文件名加哈希
// index-a1b2c3d4.js → 内容变化时哈希变化 → 自动更新缓存`
    },
    {
      id: 'ht005',
      title: 'TCP 三次握手和四次挥手是什么？',
      difficulty: 2,
      tags: ['TCP', '三次握手', '四次挥手'],
      answer: `## TCP 连接管理

### 三次握手（建立连接）
1. 客户端 → 服务端：SYN（请求建立连接）
2. 服务端 → 客户端：SYN + ACK（同意并确认）
3. 客户端 → 服务端：ACK（确认收到）

**为什么是三次？** 确保双方都能发送和接收数据，防止已失效的连接请求到达服务端。

### 四次挥手（断开连接）
1. 客户端 → 服务端：FIN（请求断开）
2. 服务端 → 客户端：ACK（确认收到，但可能还有数据要发）
3. 服务端 → 客户端：FIN（数据发完了，可以断开）
4. 客户端 → 服务端：ACK（确认断开）

**为什么是四次？** 因为 TCP 是全双工的，每个方向的连接需要单独关闭。`,
    },
    {
      id: 'ht006',
      title: 'GET 和 POST 有什么区别？',
      difficulty: 1,
      tags: ['GET', 'POST', '高频'],
      answer: `## GET vs POST

| 对比项 | GET | POST |
|--------|-----|------|
| 参数位置 | URL 查询字符串 | 请求体（Body） |
| 参数长度 | 受 URL 长度限制（约 2KB） | 无限制 |
| 缓存 | 可被缓存 | 不会被缓存 |
| 历史记录 | 参数保留在浏览器历史 | 不保留 |
| 书签 | 可以收藏为书签 | 不能 |
| 幂等性 | 幂等（多次请求结果相同） | 非幂等 |
| 安全性 | 参数暴露在 URL | 相对安全（但仍需 HTTPS） |

### 使用场景
- GET：获取数据、搜索、分页
- POST：提交表单、上传文件、创建资源

### 本质区别
从 HTTP 协议层面，GET 和 POST 都是 TCP 连接，本质没有区别。上述差异主要是**浏览器和服务器的约定**。`,
    },
    {
      id: 'ht007',
      title: 'WebSocket 是什么？和 HTTP 有什么区别？',
      difficulty: 2,
      tags: ['WebSocket', '实时通信'],
      answer: `## WebSocket

### 定义
WebSocket 是一种在单个 TCP 连接上进行**全双工通信**的协议。

### 与 HTTP 的区别

| 对比项 | HTTP | WebSocket |
|--------|------|-----------|
| 通信方式 | 请求-响应（单向） | 全双工（双向） |
| 连接 | 短连接（每次请求新建） | 长连接（一次握手持续通信） |
| 开销 | 每次请求带完整头部 | 握手后数据帧开销小 |
| 实时性 | 需要轮询 | 服务端可主动推送 |
| 协议 | http:// / https:// | ws:// / wss:// |

### 应用场景
- 即时聊天
- 实时数据推送（股票、体育比分）
- 在线协作编辑
- 游戏实时交互

### 建立过程
先通过 HTTP 握手升级协议，然后切换到 WebSocket 通信。`,
      code: `// 客户端
const ws = new WebSocket('ws://localhost:8080')

ws.onopen = () => {
  console.log('连接建立')
  ws.send('Hello Server')
}

ws.onmessage = (event) => {
  console.log('收到消息:', event.data)
}

ws.onclose = () => {
  console.log('连接关闭')
}

// 心跳保活
setInterval(() => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send('ping')
  }
}, 30000)`
    },
    {
      id: 'ht008',
      title: 'HTTP/1.1、HTTP/2、HTTP/3 有什么区别？',
      difficulty: 3,
      tags: ['HTTP/2', 'HTTP/3', '协议演进'],
      answer: `## HTTP 协议演进

### HTTP/1.1
- 持久连接（keep-alive）
- 管道化（pipelining，但有队头阻塞问题）
- 分块传输编码
- 缺点：**队头阻塞**、头部冗余、无法多路复用

### HTTP/2
- **多路复用**：一个 TCP 连接上并行多个请求/响应
- **头部压缩**：HPACK 算法压缩头部
- **服务端推送**：主动推送资源
- **二进制分帧**：数据以二进制帧传输
- 缺点：TCP 层仍有队头阻塞

### HTTP/3
- 基于 **QUIC 协议**（UDP）
- 彻底解决队头阻塞
- 0-RTT 建连（更快的连接建立）
- 连接迁移（网络切换不断连）

### 性能对比
HTTP/1.1 < HTTP/2 < HTTP/3`,
    },
    {
      id: 'ht009',
      title: 'WebSocket 是什么？和 HTTP 有什么区别？',
      difficulty: 2,
      tags: ['WebSocket', '实时通信', '高频'],
      answer: `## WebSocket

### 定义
WebSocket 是一种在单个 TCP 连接上进行**全双工通信**的协议。

### 与 HTTP 的区别
| 对比项 | HTTP | WebSocket |
|--------|------|-----------|
| 通信方式 | 请求-响应（半双工） | 全双工 |
| 连接 | 短连接（每次请求新建） | 长连接（一次握手持续通信） |
| 发起方 | 只能客户端发起 | 双方都可以主动发送 |
| 头部开销 | 每次携带完整头部 | 握手后数据帧头部很小 |
| 协议标识 | http:// / https:// | ws:// / wss:// |

### 使用场景
- 即时聊天
- 实时数据推送（股票、游戏）
- 协同编辑
- 在线客服`,
      code: `// 客户端
const ws = new WebSocket('wss://example.com/chat')

ws.onopen = () => {
  console.log('连接已建立')
  ws.send(JSON.stringify({ type: 'hello', data: '你好' }))
}

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data)
  console.log('收到消息:', msg)
}

ws.onclose = () => console.log('连接已关闭')
ws.onerror = (err) => console.error('连接错误:', err)

// 心跳保活
setInterval(() => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'ping' }))
  }
}, 30000)`
    },
    {
      id: 'ht010',
      title: '什么是 DNS？DNS 解析过程是怎样的？',
      difficulty: 2,
      tags: ['DNS', '网络基础'],
      answer: `## DNS（域名系统）

### 作用
将域名（如 www.example.com）解析为 IP 地址（如 93.184.216.34）。

### 解析过程
1. **浏览器缓存**：先查浏览器自身的 DNS 缓存
2. **系统缓存**：查操作系统的 hosts 文件和 DNS 缓存
3. **路由器缓存**：查本地路由器的 DNS 缓存
4. **ISP DNS 服务器**：向运营商的 DNS 服务器查询
5. **递归查询**：
   - 根域名服务器 → 返回 .com 顶级域服务器地址
   - .com 服务器 → 返回 example.com 权威服务器地址
   - 权威服务器 → 返回最终 IP 地址

### DNS 优化
- **DNS 预解析**：\`<link rel="dns-prefetch" href="//cdn.example.com">\`
- **减少 DNS 查询**：合并域名，减少不同域名数量
- **DNS 缓存**：合理设置 TTL`,
    }
  ]
}

export default http

