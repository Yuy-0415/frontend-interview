import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages 部署时设置为仓库名，本地开发用 '/'
  // 部署前改成你的仓库名，例如 '/frontend-interview/'
  base: '/frontend-interview/',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon-192.svg', 'icon-512.svg'],
      manifest: {
        name: '前端面试题库',
        short_name: '面试题库',
        description: '前端面试题刷题助手，涵盖 Vue3、JavaScript、CSS、HTTP 等核心知识',
        theme_color: '#2563eb',
        background_color: '#f5f7fa',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: '/icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // 预缓存所有静态资源
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        // 运行时缓存策略
        runtimeCaching: [
          {
            // 缓存页面导航请求
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 7 * 24 * 60 * 60 // 7天
              }
            }
          }
        ]
      }
    })
  ],
})
