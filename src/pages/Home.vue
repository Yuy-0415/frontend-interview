<template>
  <div role="main" aria-label="首页">
    <!-- 顶部搜索框 -->
    <div class="mb-6">
      <div class="relative" role="search">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" aria-hidden="true">🔍</span>
        <input
          v-model="searchKeyword"
          type="search"
          placeholder="搜索面试题..."
          aria-label="搜索面试题"
          class="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-sm"
          @input="onSearch"
        />
      </div>
    </div>

    <!-- 搜索结果 -->
    <div v-if="searchKeyword && searchResults.length > 0" class="mb-6" aria-live="polite">
      <h3 class="text-sm font-medium text-gray-500 mb-3">搜索结果（{{ searchResults.length }}）</h3>
      <div class="space-y-2">
        <router-link
          v-for="item in searchResults"
          :key="item.question.id"
          :to="`/question/${item.category.id}/${item.question.id}`"
          class="block bg-white rounded-lg p-3 border border-gray-100 hover:border-blue-200 transition-colors"
          :aria-label="`${item.question.title} - ${item.category.name}`"
        >
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-800 flex-1 mr-2">{{ item.question.title }}</span>
            <DifficultyTag :level="item.question.difficulty" />
          </div>
          <span class="text-xs text-gray-400 mt-1">{{ item.category.name }}</span>
        </router-link>
      </div>
    </div>

    <div v-else-if="searchKeyword && searchResults.length === 0" class="mb-6 text-center text-gray-400 text-sm py-8" aria-live="polite">
      没有找到相关题目
    </div>

    <!-- 总体进度 -->
    <div v-if="!searchKeyword" class="bg-white rounded-xl p-4 mb-6 border border-gray-100">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-bold text-gray-800">前端面试题库</h2>
          <p class="text-sm text-gray-500 mt-1">
            已掌握 <span class="text-blue-600 font-medium">{{ userStore.masteredCount }}</span>
            / {{ questionStore.totalCount }} 题
          </p>
        </div>
        <ProgressRing
          :percent="totalPercent"
          :size="56"
          :stroke-width="5"
          :font-size="14"
        />
      </div>
    </div>

    <!-- 分类卡片网格 -->
    <div v-if="!searchKeyword" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list" aria-label="知识分类列表">
      <router-link
        v-for="category in questionStore.allCategories"
        :key="category.id"
        :to="`/category/${category.id}`"
        class="bg-white rounded-xl p-4 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all active:scale-[0.98]"
        role="listitem"
        :aria-label="`${category.name}，共 ${category.questions.length} 题，已掌握 ${getMastered(category)} 题`"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-2">
              <span class="text-2xl" aria-hidden="true">{{ category.icon }}</span>
              <h3 class="font-bold text-gray-800">{{ category.name }}</h3>
            </div>
            <p class="text-xs text-gray-400 mb-3 line-clamp-1">{{ category.description }}</p>
            <div class="flex items-center space-x-3 text-xs text-gray-500">
              <span>{{ category.questions.length }} 题</span>
              <span aria-hidden="true">·</span>
              <span class="text-blue-600">
                已掌握 {{ getMastered(category) }}
              </span>
            </div>
          </div>
          <ProgressRing
            :percent="getPercent(category)"
            :size="44"
            :stroke-width="4"
            :font-size="11"
          />
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuestionStore } from '../stores/question'
import { useUserStore } from '../stores/user'
import DifficultyTag from '../components/DifficultyTag.vue'
import ProgressRing from '../components/ProgressRing.vue'
import type { Category } from '../types'

const questionStore = useQuestionStore()
const userStore = useUserStore()

// 搜索（带防抖）
const searchKeyword = ref('')
const searchResults = ref<ReturnType<typeof questionStore.searchQuestions>>([])
let searchTimer: ReturnType<typeof setTimeout> | null = null

function onSearch() {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    searchResults.value = questionStore.searchQuestions(searchKeyword.value)
  }, 300)
}

// 总体进度
const totalPercent = computed(() => {
  if (questionStore.totalCount === 0) return 0
  return (userStore.masteredCount / questionStore.totalCount) * 100
})

// 某分类已掌握数
function getMastered(category: Category): number {
  const ids = category.questions.map(q => q.id)
  return userStore.getMasteredCountByIds(ids)
}

// 某分类掌握百分比
function getPercent(category: Category): number {
  if (category.questions.length === 0) return 0
  return (getMastered(category) / category.questions.length) * 100
}
</script>

