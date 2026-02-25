<template>
  <!-- 手机端底部Tab导航 -->
  <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-bottom" role="navigation" aria-label="底部导航">
    <div class="flex items-center justify-around h-14">
      <router-link
        v-for="item in tabItems"
        :key="item.path"
        :to="item.path"
        class="flex flex-col items-center justify-center w-full h-full text-gray-400 transition-colors"
        active-class="!text-blue-600"
        :aria-label="item.label"
      >
        <span class="text-xl leading-none" aria-hidden="true">{{ item.icon }}</span>
        <span class="text-xs mt-1">{{ item.label }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
const tabItems = [
  { path: '/', icon: '🏠', label: '首页' },
  { path: '/quiz', icon: '📖', label: '刷题' },
  { path: '/profile', icon: '👤', label: '我的' },
]
</script>

