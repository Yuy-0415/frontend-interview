<template>
  <div v-if="question && category" role="main" :aria-label="`题目详情：${question.title}`">
    <!-- 顶部返回 + 导航 -->
    <div class="flex items-center justify-between mb-4">
      <button @click="$router.back()" class="text-gray-500 hover:text-gray-800 text-lg" aria-label="返回上一页">←</button>
      <span class="text-xs text-gray-400">{{ currentIndex + 1 }} / {{ category.questions.length }}</span>
      <div class="flex items-center space-x-2">
        <!-- 收藏按钮 -->
        <button
          @click="userStore.toggleFavorite(question.id)"
          class="text-xl transition-transform active:scale-90"
          :aria-pressed="userStore.isFavorite(question.id)"
          :aria-label="userStore.isFavorite(question.id) ? '取消收藏' : '添加收藏'"
        >
          {{ userStore.isFavorite(question.id) ? '⭐' : '☆' }}
        </button>
      </div>
    </div>

    <!-- 题目标题 -->
    <div class="bg-white rounded-xl p-5 border border-gray-100 mb-4">
      <h1 class="text-base font-bold text-gray-800 leading-relaxed mb-3">{{ question.title }}</h1>
      <div class="flex items-center flex-wrap gap-2">
        <DifficultyTag :level="question.difficulty" />
        <span class="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{{ category.name }}</span>
        <span
          v-for="tag in question.tags"
          :key="tag"
          class="text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded"
        >{{ tag }}</span>
      </div>
    </div>

    <!-- 答案解析 -->
    <div class="bg-white rounded-xl p-5 border border-gray-100 mb-4">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-sm font-bold text-gray-700"><span aria-hidden="true">💡</span> 答案解析</h2>
        <button
          @click="showAnswer = !showAnswer"
          class="text-xs text-blue-600 hover:text-blue-800"
          :aria-expanded="showAnswer"
          aria-controls="answer-content"
        >
          {{ showAnswer ? '收起' : '展开答案' }}
        </button>
      </div>
      <div v-show="showAnswer" id="answer-content">
        <div class="prose prose-sm max-w-none text-gray-700 leading-relaxed" v-html="renderedAnswer"></div>
        <!-- 示例代码 -->
        <div v-if="question.code" class="mt-4">
          <h3 class="text-xs font-bold text-gray-500 mb-2"><span aria-hidden="true">📝</span> 示例代码</h3>
          <pre class="rounded-lg overflow-x-auto"><code class="hljs text-sm" v-html="highlightedCode"></code></pre>
        </div>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="flex items-center justify-between bg-white rounded-xl p-4 border border-gray-100" role="toolbar" aria-label="题目操作">
      <!-- 上一题 -->
      <button
        @click="goPrev"
        :disabled="currentIndex <= 0"
        aria-label="上一题"
        class="px-4 py-2 text-sm rounded-lg border transition-colors"
        :class="currentIndex <= 0
          ? 'text-gray-300 border-gray-100 cursor-not-allowed'
          : 'text-gray-600 border-gray-200 hover:border-blue-300 active:bg-gray-50'"
      >
        ← 上一题
      </button>

      <!-- 掌握状态 -->
      <button
        @click="userStore.toggleMastered(question.id)"
        :aria-pressed="userStore.isMastered(question.id)"
        :aria-label="userStore.isMastered(question.id) ? '取消掌握标记' : '标记为已掌握'"
        class="px-6 py-2 text-sm rounded-lg font-medium transition-all active:scale-95"
        :class="userStore.isMastered(question.id)
          ? 'bg-green-500 text-white'
          : 'bg-blue-600 text-white hover:bg-blue-700'"
      >
        {{ userStore.isMastered(question.id) ? '✓ 已掌握' : '标记掌握' }}
      </button>

      <!-- 下一题 -->
      <button
        @click="goNext"
        :disabled="currentIndex >= category.questions.length - 1"
        aria-label="下一题"
        class="px-4 py-2 text-sm rounded-lg border transition-colors"
        :class="currentIndex >= category.questions.length - 1
          ? 'text-gray-300 border-gray-100 cursor-not-allowed'
          : 'text-gray-600 border-gray-200 hover:border-blue-300 active:bg-gray-50'"
      >
        下一题 →
      </button>
    </div>
  </div>

  <!-- 404 -->
  <div v-else class="text-center text-gray-400 py-20" role="status">
    <p class="text-4xl mb-4" aria-hidden="true">🤔</p>
    <p>题目不存在</p>
    <router-link to="/" class="text-blue-600 text-sm mt-2 inline-block">返回首页</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuestionStore } from '../stores/question'
import { useUserStore } from '../stores/user'
import DifficultyTag from '../components/DifficultyTag.vue'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

const route = useRoute()
const router = useRouter()
const questionStore = useQuestionStore()
const userStore = useUserStore()

const showAnswer = ref(true)

const categoryId = computed(() => route.params.categoryId as string)
const questionId = computed(() => route.params.questionId as string)

const result = computed(() => questionStore.getQuestionById(categoryId.value, questionId.value))
const question = computed(() => result.value.question)
const category = computed(() => result.value.category)
const currentIndex = computed(() => result.value.index)

// Markdown 渲染
const renderedAnswer = computed(() => {
  if (!question.value) return ''
  return marked.parse(question.value.answer) as string
})

// 代码高亮
const highlightedCode = computed(() => {
  if (!question.value?.code) return ''
  return hljs.highlightAuto(question.value.code).value
})

// 上一题 / 下一题
function goPrev() {
  if (!category.value || currentIndex.value <= 0) return
  const prev = category.value.questions[currentIndex.value - 1]
  router.replace(`/question/${categoryId.value}/${prev.id}`)
}

function goNext() {
  if (!category.value || currentIndex.value >= category.value.questions.length - 1) return
  const next = category.value.questions[currentIndex.value + 1]
  router.replace(`/question/${categoryId.value}/${next.id}`)
}

// 切换题目时收起答案
watch(questionId, () => {
  showAnswer.value = true
  window.scrollTo({ top: 0 })
})
</script>

