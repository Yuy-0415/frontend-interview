<template>
  <div role="main" :aria-label="category?.name ? `${category.name} 题目列表` : '题目列表'">
    <!-- 顶部返回 + 标题 -->
    <div class="flex items-center space-x-3 mb-4">
      <button @click="$router.back()" class="text-gray-500 hover:text-gray-800 text-lg" aria-label="返回上一页">←</button>
      <h1 class="text-lg font-bold text-gray-800">{{ category?.name || '题目列表' }}</h1>
      <span v-if="category" class="text-2xl" aria-hidden="true">{{ category.icon }}</span>
    </div>

    <!-- 筛选栏 -->
    <div class="flex flex-wrap gap-2 mb-4" role="toolbar" aria-label="题目筛选">
      <!-- 难度筛选 -->
      <button
        v-for="item in difficultyFilters"
        :key="item.value"
        @click="currentDifficulty = item.value"
        :aria-pressed="currentDifficulty === item.value"
        :aria-label="`按难度筛选：${item.label}`"
        class="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
        :class="currentDifficulty === item.value
          ? 'bg-blue-600 text-white border-blue-600'
          : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'"
      >
        {{ item.label }}
      </button>
      <span class="w-px h-6 bg-gray-200 self-center mx-1" aria-hidden="true"></span>
      <!-- 状态筛选 -->
      <button
        v-for="item in statusFilters"
        :key="item.value"
        @click="currentStatus = item.value"
        :aria-pressed="currentStatus === item.value"
        :aria-label="`按状态筛选：${item.label}`"
        class="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
        :class="currentStatus === item.value
          ? 'bg-blue-600 text-white border-blue-600'
          : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'"
      >
        {{ item.label }}
      </button>
    </div>

    <!-- 题目数量 -->
    <p class="text-xs text-gray-400 mb-3" aria-live="polite">共 {{ filteredQuestions.length }} 题</p>

    <!-- 题目列表 -->
    <div class="space-y-2" role="list" aria-label="题目列表">
      <router-link
        v-for="(q, idx) in filteredQuestions"
        :key="q.id"
        :to="`/question/${categoryId}/${q.id}`"
        class="flex items-center bg-white rounded-lg p-4 border border-gray-100 hover:border-blue-200 transition-all active:scale-[0.99]"
        role="listitem"
        :aria-label="`第${idx + 1}题：${q.title}${userStore.isMastered(q.id) ? '（已掌握）' : ''}`"
      >
        <span class="text-xs text-gray-300 w-6 shrink-0" aria-hidden="true">{{ idx + 1 }}</span>
        <div class="flex-1 min-w-0 mr-3">
          <p class="text-sm text-gray-800 truncate">{{ q.title }}</p>
          <div class="flex items-center space-x-2 mt-1">
            <DifficultyTag :level="q.difficulty" />
            <span
              v-for="tag in q.tags.slice(0, 2)"
              :key="tag"
              class="text-xs text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded"
            >{{ tag }}</span>
          </div>
        </div>
        <!-- 掌握状态 -->
        <span
          class="shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs"
          :class="userStore.isMastered(q.id)
            ? 'border-green-500 bg-green-500 text-white'
            : 'border-gray-300'"
          :aria-label="userStore.isMastered(q.id) ? '已掌握' : '未掌握'"
        >
          <span v-if="userStore.isMastered(q.id)" aria-hidden="true">✓</span>
        </span>
      </router-link>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredQuestions.length === 0" class="text-center text-gray-400 text-sm py-16" role="status">
      没有符合条件的题目
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuestionStore } from '../stores/question'
import { useUserStore } from '../stores/user'
import DifficultyTag from '../components/DifficultyTag.vue'
import type { Difficulty } from '../types'

const route = useRoute()
const questionStore = useQuestionStore()
const userStore = useUserStore()

const categoryId = computed(() => route.params.id as string)
const category = computed(() => questionStore.getCategoryById(categoryId.value))

// 筛选状态
const currentDifficulty = ref<number>(0) // 0=全部
const currentStatus = ref<string>('all')

const difficultyFilters = [
  { label: '全部难度', value: 0 },
  { label: '🟢 初级', value: 1 },
  { label: '🟡 中级', value: 2 },
  { label: '🔴 高级', value: 3 },
]

const statusFilters = [
  { label: '全部', value: 'all' },
  { label: '已掌握', value: 'mastered' },
  { label: '未掌握', value: 'unmastered' },
]

// 筛选后的题目
const filteredQuestions = computed(() => {
  if (!category.value) return []
  let list = [...category.value.questions]

  // 难度筛选
  if (currentDifficulty.value > 0) {
    list = list.filter(q => q.difficulty === (currentDifficulty.value as Difficulty))
  }

  // 状态筛选
  if (currentStatus.value === 'mastered') {
    list = list.filter(q => userStore.isMastered(q.id))
  } else if (currentStatus.value === 'unmastered') {
    list = list.filter(q => !userStore.isMastered(q.id))
  }

  return list
})
</script>

