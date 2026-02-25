<template>
  <div role="main" aria-label="刷题模式">
    <div class="flex items-center space-x-3 mb-4">
      <button @click="$router.back()" class="text-gray-500 hover:text-gray-800 text-lg" aria-label="返回上一页">←</button>
      <h1 class="text-lg font-bold text-gray-800">刷题模式</h1>
    </div>

    <!-- 刷题范围选择 -->
    <div v-if="!isStarted" class="space-y-4">
      <div class="bg-white rounded-xl p-5 border border-gray-100">
        <h2 class="text-sm font-bold text-gray-700 mb-3" id="range-label">选择刷题范围</h2>
        <div class="space-y-2" role="radiogroup" aria-labelledby="range-label">
          <button
            v-for="option in rangeOptions"
            :key="option.value"
            @click="selectedRange = option.value"
            role="radio"
            :aria-checked="selectedRange === option.value"
            class="w-full flex items-center justify-between p-3 rounded-lg border text-sm transition-colors"
            :class="selectedRange === option.value
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 text-gray-600 hover:border-blue-300'"
          >
            <span><span aria-hidden="true">{{ option.icon }}</span> {{ option.label }}</span>
            <span class="text-xs text-gray-400">{{ option.count }} 题</span>
          </button>
        </div>
      </div>
      <button
        @click="startQuiz"
        :disabled="quizQuestions.length === 0"
        :aria-disabled="quizQuestions.length === 0"
        class="w-full py-3 rounded-xl text-white font-medium transition-all active:scale-[0.98]"
        :class="quizQuestions.length > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'"
      >
        开始刷题（{{ quizQuestions.length }} 题）
      </button>
    </div>

    <!-- 刷题卡片 -->
    <div v-else>
      <!-- 进度条 -->
      <div class="flex items-center space-x-3 mb-4">
        <div
          class="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden"
          role="progressbar"
          :aria-valuenow="currentIdx + 1"
          :aria-valuemin="1"
          :aria-valuemax="quizQuestions.length"
          :aria-label="`刷题进度：第 ${currentIdx + 1} 题，共 ${quizQuestions.length} 题`"
        >
          <div
            class="h-full bg-blue-500 rounded-full transition-all duration-300"
            :style="{ width: `${((currentIdx + 1) / quizQuestions.length) * 100}%` }"
          ></div>
        </div>
        <span class="text-xs text-gray-400 shrink-0" aria-hidden="true">{{ currentIdx + 1 }}/{{ quizQuestions.length }}</span>
      </div>

      <!-- 卡片（支持触摸滑动） -->
      <div
        class="bg-white rounded-xl border border-gray-100 overflow-hidden min-h-[320px] flex flex-col cursor-pointer select-none"
        @click="onCardClick"
        @touchstart.passive="onTouchStart"
        @touchmove.passive="onTouchMove"
        @touchend="onTouchEnd"
        @keydown.enter="onCardClick"
        @keydown.space.prevent="onCardClick"
        :style="cardStyle"
        tabindex="0"
        role="button"
        :aria-label="flipped ? '点击收起答案' : '点击查看答案'"
        :aria-expanded="flipped"
      >
        <!-- 正面：题目 -->
        <div v-if="!flipped" class="p-6 flex-1 flex flex-col">
          <div class="flex items-center gap-2 mb-4">
            <DifficultyTag :level="currentQuestion.difficulty" />
            <span class="text-xs text-gray-400">{{ getCategoryName(currentQuestion.id) }}</span>
          </div>
          <h2 class="text-base font-bold text-gray-800 leading-relaxed flex-1">{{ currentQuestion.title }}</h2>
          <p class="text-xs text-gray-400 mt-4 text-center" aria-hidden="true">👆 点击查看答案</p>
        </div>
        <!-- 背面：答案 -->
        <div v-else class="p-6 flex-1 overflow-y-auto" aria-live="polite">
          <div class="prose prose-sm max-w-none text-gray-700 leading-relaxed" v-html="currentRenderedAnswer"></div>
          <p class="text-xs text-gray-400 mt-4 text-center" aria-hidden="true">👆 点击收起答案</p>
        </div>
      </div>

      <!-- 底部操作 -->
      <div class="flex items-center justify-between mt-4 gap-3" role="toolbar" aria-label="题目操作">
        <button
          @click="prevCard"
          :disabled="currentIdx <= 0"
          aria-label="上一题"
          class="flex-1 py-2.5 rounded-lg border text-sm transition-colors"
          :class="currentIdx <= 0 ? 'text-gray-300 border-gray-100' : 'text-gray-600 border-gray-200 active:bg-gray-50'"
        >← 上一题</button>
        <button
          @click="toggleMastered"
          :aria-pressed="userStore.isMastered(currentQuestion.id)"
          :aria-label="userStore.isMastered(currentQuestion.id) ? '取消掌握标记' : '标记为已掌握'"
          class="flex-1 py-2.5 rounded-lg text-sm font-medium text-white transition-all active:scale-95"
          :class="userStore.isMastered(currentQuestion.id) ? 'bg-green-500' : 'bg-blue-600'"
        >{{ userStore.isMastered(currentQuestion.id) ? '✓ 已掌握' : '标记掌握' }}</button>
        <button
          @click="nextCard"
          :aria-label="currentIdx >= quizQuestions.length - 1 ? '完成刷题' : '下一题'"
          class="flex-1 py-2.5 rounded-lg border text-sm transition-colors text-gray-600 border-gray-200 active:bg-gray-50"
        >{{ currentIdx >= quizQuestions.length - 1 ? '完成 🎉' : '下一题 →' }}</button>
      </div>

      <!-- 退出 -->
      <button
        @click="exitQuiz"
        aria-label="退出刷题并保存记录"
        class="w-full mt-3 py-2 text-xs text-gray-400 hover:text-gray-600"
      >
        退出刷题
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuestionStore } from '../stores/question'
import { useUserStore } from '../stores/user'
import DifficultyTag from '../components/DifficultyTag.vue'
import { marked } from 'marked'
import type { Question } from '../types'

const questionStore = useQuestionStore()
const userStore = useUserStore()

const selectedRange = ref('all')
const isStarted = ref(false)
const currentIdx = ref(0)
const flipped = ref(false)

// 刷题历史追踪
let quizStartTime = ''
let masteredDuringQuiz = new Set<string>()
let maxViewedIdx = 0

// 刷题范围选项
const rangeOptions = computed(() => [
  { value: 'all', icon: '📚', label: '全部题目', count: questionStore.totalCount },
  { value: 'favorites', icon: '⭐', label: '我的收藏', count: userStore.favoritesCount },
  { value: 'unmastered', icon: '❓', label: '未掌握', count: questionStore.totalCount - userStore.masteredCount },
  ...questionStore.allCategories.map(c => ({
    value: c.id, icon: c.icon, label: c.name, count: c.questions.length
  }))
])

// 获取当前选中范围的中文名
function getRangeLabel(): string {
  const opt = rangeOptions.value.find(o => o.value === selectedRange.value)
  return opt ? opt.label : '未知范围'
}

// 根据范围获取题目列表
const quizQuestions = computed<Question[]>(() => {
  if (selectedRange.value === 'all') return questionStore.allQuestions
  if (selectedRange.value === 'favorites') {
    return questionStore.allQuestions.filter(q => userStore.isFavorite(q.id))
  }
  if (selectedRange.value === 'unmastered') {
    return questionStore.allQuestions.filter(q => !userStore.isMastered(q.id))
  }
  const cat = questionStore.getCategoryById(selectedRange.value)
  return cat ? cat.questions : []
})

const currentQuestion = computed(() => quizQuestions.value[currentIdx.value])
const currentRenderedAnswer = computed(() => {
  if (!currentQuestion.value) return ''
  return marked.parse(currentQuestion.value.answer) as string
})

function getCategoryName(questionId: string): string {
  for (const c of questionStore.allCategories) {
    if (c.questions.some(q => q.id === questionId)) return c.name
  }
  return ''
}

function startQuiz() {
  if (quizQuestions.value.length === 0) return
  currentIdx.value = 0
  flipped.value = false
  isStarted.value = true
  // 初始化历史追踪
  quizStartTime = new Date().toISOString()
  masteredDuringQuiz = new Set<string>()
  maxViewedIdx = 0
}

// 保存刷题历史记录
function saveQuizRecord() {
  if (!quizStartTime || quizQuestions.value.length === 0) return
  userStore.addQuizHistory({
    startTime: quizStartTime,
    endTime: new Date().toISOString(),
    range: selectedRange.value,
    rangeLabel: getRangeLabel(),
    totalCount: quizQuestions.value.length,
    masteredCount: masteredDuringQuiz.size,
    viewedCount: maxViewedIdx + 1
  })
  quizStartTime = ''
}

function prevCard() {
  if (currentIdx.value > 0) {
    currentIdx.value--
    flipped.value = false
  }
}

function nextCard() {
  if (currentIdx.value < quizQuestions.value.length - 1) {
    currentIdx.value++
    flipped.value = false
    // 更新最大浏览索引
    if (currentIdx.value > maxViewedIdx) {
      maxViewedIdx = currentIdx.value
    }
  } else {
    // 刷完最后一题，保存记录
    saveQuizRecord()
    isStarted.value = false
    flipped.value = false
  }
}

function toggleMastered() {
  const qid = currentQuestion.value.id
  // 追踪本次刷题中标记掌握的题目
  if (!userStore.isMastered(qid)) {
    masteredDuringQuiz.add(qid)
  } else {
    masteredDuringQuiz.delete(qid)
  }
  userStore.toggleMastered(qid)
}

// 退出刷题（也保存记录）
function exitQuiz() {
  saveQuizRecord()
  isStarted.value = false
  flipped.value = false
}

// 触摸滑动相关
const touchStartX = ref(0)
const touchStartY = ref(0)
const touchDeltaX = ref(0)
const isSwiping = ref(false)

const cardStyle = computed(() => {
  if (!isSwiping.value || Math.abs(touchDeltaX.value) < 10) return {}
  return {
    transform: `translateX(${touchDeltaX.value}px)`,
    transition: 'none',
    opacity: `${1 - Math.abs(touchDeltaX.value) / 400}`
  }
})

function onTouchStart(e: TouchEvent) {
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
  touchDeltaX.value = 0
  isSwiping.value = false
}

function onTouchMove(e: TouchEvent) {
  const dx = e.touches[0].clientX - touchStartX.value
  const dy = e.touches[0].clientY - touchStartY.value
  // 水平滑动幅度大于垂直时才算滑动切题
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
    isSwiping.value = true
    touchDeltaX.value = dx
  }
}

function onTouchEnd() {
  if (isSwiping.value && Math.abs(touchDeltaX.value) > 80) {
    if (touchDeltaX.value < 0) {
      nextCard() // 左滑 → 下一题
    } else {
      prevCard() // 右滑 → 上一题
    }
  }
  touchDeltaX.value = 0
  isSwiping.value = false
}

function onCardClick() {
  // 滑动过程中不触发翻转
  if (!isSwiping.value) {
    flipped.value = !flipped.value
  }
}
</script>

