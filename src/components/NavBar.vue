<template>
  <!-- PC端顶部导航 -->
  <nav class="hidden md:block bg-white shadow-sm sticky top-0 z-50" role="navigation" aria-label="主导航">
    <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
      <!-- Logo -->
      <router-link to="/" class="flex items-center space-x-2" aria-label="前端面试题 - 返回首页">
        <span class="text-xl" aria-hidden="true">📝</span>
        <span class="font-bold text-gray-800 text-lg">前端面试题</span>
      </router-link>
      <!-- 导航链接 -->
      <div class="flex items-center space-x-6">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="text-sm text-gray-600 hover:text-blue-600 transition-colors"
          active-class="text-blue-600 font-medium"
        >
          {{ item.label }}
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const navItems = [
  { path: '/', label: '首页' },
  { path: '/quiz', label: '刷题模式' },
  { path: '/profile', label: '我的' },
]
</script>

