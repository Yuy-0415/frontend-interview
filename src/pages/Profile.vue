<template>
  <div role="main" aria-label="我的学习">
    <h1 class="text-lg font-bold text-gray-800 mb-4">📊 我的学习</h1>

    <!-- 总体进度卡片 -->
    <div class="bg-white rounded-xl p-5 border border-gray-100 mb-4">
      <div class="flex items-center space-x-4">
        <ProgressRing :percent="overallPercent" :size="80" :fontSize="18" />
        <div>
          <p class="text-sm text-gray-500">总体掌握进度</p>
          <p class="text-2xl font-bold text-gray-800">{{ userStore.masteredCount }} <span class="text-sm font-normal text-gray-400">/ {{ questionStore.totalCount }} 题</span></p>
          <p class="text-xs text-gray-400 mt-1">收藏 {{ userStore.favoritesCount }} 题</p>
        </div>
      </div>
    </div>

    <!-- 各分类进度 -->
    <div class="bg-white rounded-xl p-5 border border-gray-100 mb-4">
      <h2 class="text-sm font-bold text-gray-700 mb-3">📈 分类掌握率</h2>
      <div class="space-y-3">
        <div v-for="cat in categoryProgress" :key="cat.id" class="flex items-center space-x-3">
          <span class="text-lg w-6 text-center" aria-hidden="true">{{ cat.icon }}</span>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs text-gray-600 truncate">{{ cat.name }}</span>
              <span class="text-xs text-gray-400">{{ cat.mastered }}/{{ cat.total }}</span>
            </div>
            <div
              class="h-1.5 bg-gray-100 rounded-full overflow-hidden"
              role="progressbar"
              :aria-valuenow="cat.mastered"
              :aria-valuemax="cat.total"
              :aria-label="`${cat.name} 掌握进度：${cat.mastered}/${cat.total}`"
            >
              <div
                class="h-full rounded-full transition-all duration-500"
                :class="cat.percent >= 80 ? 'bg-green-500' : cat.percent >= 40 ? 'bg-blue-500' : 'bg-gray-300'"
                :style="{ width: cat.percent + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 刷题历史记录 -->
    <div class="bg-white rounded-xl p-5 border border-gray-100 mb-4">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-sm font-bold text-gray-700">📋 刷题历史</h2>
        <button
          v-if="userStore.quizHistoryList.length > 0"
          @click="showClearHistoryDialog = true"
          class="text-xs text-gray-400 hover:text-red-500 transition-colors"
          aria-label="清空刷题历史"
        >
          清空
        </button>
      </div>
      <div v-if="userStore.quizHistoryList.length > 0" class="space-y-2">
        <div
          v-for="record in userStore.quizHistoryList"
          :key="record.id"
          class="p-3 rounded-lg border border-gray-100 hover:border-blue-100 transition-colors"
        >
          <div class="flex items-center justify-between mb-1">
            <span class="text-sm font-medium text-gray-700">{{ record.rangeLabel }}</span>
            <span class="text-xs text-gray-400">{{ formatDate(record.startTime) }}</span>
          </div>
          <div class="flex items-center space-x-4 text-xs text-gray-500">
            <span>浏览 <span class="text-blue-600 font-medium">{{ record.viewedCount }}</span>/{{ record.totalCount }} 题</span>
            <span>掌握 <span class="text-green-600 font-medium">{{ record.masteredCount }}</span> 题</span>
            <span>用时 {{ formatDuration(record.startTime, record.endTime) }}</span>
          </div>
        </div>
      </div>
      <p v-else class="text-sm text-gray-400 text-center py-4">还没有刷题记录</p>
    </div>

    <!-- 收藏列表 -->
    <div class="bg-white rounded-xl p-5 border border-gray-100 mb-4">
      <h2 class="text-sm font-bold text-gray-700 mb-3">⭐ 我的收藏</h2>
      <div v-if="favoriteList.length > 0" class="space-y-2">
        <router-link
          v-for="item in favoriteList"
          :key="item.question.id"
          :to="`/question/${item.category.id}/${item.question.id}`"
          class="block p-3 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors"
          :aria-label="`${item.question.title} - ${item.category.name}`"
        >
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-800 flex-1 mr-2 truncate">{{ item.question.title }}</span>
            <DifficultyTag :level="item.question.difficulty" />
          </div>
          <span class="text-xs text-gray-400">{{ item.category.name }}</span>
        </router-link>
      </div>
      <p v-else class="text-sm text-gray-400 text-center py-4">还没有收藏题目</p>
    </div>

    <!-- 重置按钮 -->
    <button
      @click="showResetDialog = true"
      class="w-full py-3 rounded-xl border border-red-200 text-red-500 text-sm hover:bg-red-50 transition-colors"
      aria-label="重置所有学习进度"
    >
      重置所有进度
    </button>

    <!-- 重置确认弹窗 -->
    <ConfirmDialog
      v-model:visible="showResetDialog"
      title="重置学习进度"
      message="确定要重置所有学习进度吗？已掌握和收藏的记录将全部清除，此操作不可恢复。"
      icon="⚠️"
      confirm-text="确定重置"
      type="danger"
      @confirm="handleReset"
    />

    <!-- 清空历史确认弹窗 -->
    <ConfirmDialog
      v-model:visible="showClearHistoryDialog"
      title="清空刷题历史"
      message="确定要清空所有刷题历史记录吗？此操作不可恢复。"
      icon="🗑️"
      confirm-text="确定清空"
      type="danger"
      @confirm="handleClearHistory"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/user'
import { useQuestionStore } from '../stores/question'
import ProgressRing from '../components/ProgressRing.vue'
import DifficultyTag from '../components/DifficultyTag.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'

const userStore = useUserStore()
const questionStore = useQuestionStore()

// 弹窗状态
const showResetDialog = ref(false)
const showClearHistoryDialog = ref(false)

// 总体掌握百分比
const overallPercent = computed(() => {
  if (questionStore.totalCount === 0) return 0
  return Math.round((userStore.masteredCount / questionStore.totalCount) * 100)
})

// 各分类进度
const categoryProgress = computed(() => {
  return questionStore.allCategories.map(cat => {
    const mastered = cat.questions.filter(q => userStore.isMastered(q.id)).length
    const total = cat.questions.length
    return {
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      mastered,
      total,
      percent: total > 0 ? Math.round((mastered / total) * 100) : 0
    }
  })
})

// 收藏列表
const favoriteList = computed(() => {
  return questionStore.allCategories.flatMap(cat =>
    cat.questions
      .filter(q => userStore.isFavorite(q.id))
      .map(q => ({ question: q, category: cat }))
  )
})

// 格式化日期显示
function formatDate(isoStr: string): string {
  try {
    const d = new Date(isoStr)
    const month = d.getMonth() + 1
    const day = d.getDate()
    const hours = d.getHours().toString().padStart(2, '0')
    const minutes = d.getMinutes().toString().padStart(2, '0')
    return `${month}/${day} ${hours}:${minutes}`
  } catch {
    return isoStr
  }
}

// 格式化刷题用时
function formatDuration(startStr: string, endStr: string): string {
  try {
    const diff = new Date(endStr).getTime() - new Date(startStr).getTime()
    if (diff < 0) return '0秒'
    const totalSec = Math.floor(diff / 1000)
    if (totalSec < 60) return `${totalSec}秒`
    const min = Math.floor(totalSec / 60)
    const sec = totalSec % 60
    if (min < 60) return sec > 0 ? `${min}分${sec}秒` : `${min}分钟`
    const hour = Math.floor(min / 60)
    const remainMin = min % 60
    return remainMin > 0 ? `${hour}小时${remainMin}分` : `${hour}小时`
  } catch {
    return '未知'
  }
}

// 重置进度
function handleReset() {
  userStore.resetAll()
}

// 清空刷题历史
function handleClearHistory() {
  userStore.clearHistory()
}
</script>

