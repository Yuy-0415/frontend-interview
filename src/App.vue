<template>
  <div class="min-h-screen bg-gray-50 pb-16 md:pb-0">
    <!-- 顶部导航栏（PC端） -->
    <NavBar />
    <!-- 页面内容 -->
    <main class="max-w-6xl mx-auto px-4 pt-4 pb-8">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <!-- 底部Tab导航（手机端） -->
    <TabBar />
  </div>
</template>

<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import TabBar from './components/TabBar.vue'
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
