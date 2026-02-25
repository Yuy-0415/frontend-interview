import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserProgress, QuizHistory } from '../types'

const STORAGE_KEY = 'frontend-interview-progress'
const HISTORY_KEY = 'frontend-interview-history'

// 从 localStorage 读取进度
function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.warn('读取进度数据失败', e)
  }
  return { mastered: [], favorites: [], lastVisit: '' }
}

// 写入 localStorage
function saveProgress(data: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.warn('保存进度数据失败', e)
  }
}

// 从 localStorage 读取刷题历史
function loadHistory(): QuizHistory[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.warn('读取刷题历史失败', e)
  }
  return []
}

// 写入刷题历史
function saveHistory(data: QuizHistory[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(data))
  } catch (e) {
    console.warn('保存刷题历史失败', e)
  }
}

export const useUserStore = defineStore('user', () => {
  const progress = ref<UserProgress>(loadProgress())
  const quizHistoryList = ref<QuizHistory[]>(loadHistory())

  // 已掌握题目数
  const masteredCount = computed(() => progress.value.mastered.length)
  // 收藏题目数
  const favoritesCount = computed(() => progress.value.favorites.length)
  // 刷题历史记录数
  const historyCount = computed(() => quizHistoryList.value.length)

  // 判断某题是否已掌握
  function isMastered(questionId: string): boolean {
    return progress.value.mastered.includes(questionId)
  }

  // 判断某题是否已收藏
  function isFavorite(questionId: string): boolean {
    return progress.value.favorites.includes(questionId)
  }

  // 切换掌握状态
  function toggleMastered(questionId: string): void {
    const idx = progress.value.mastered.indexOf(questionId)
    if (idx > -1) {
      progress.value.mastered.splice(idx, 1)
    } else {
      progress.value.mastered.push(questionId)
    }
    persist()
  }

  // 切换收藏状态
  function toggleFavorite(questionId: string): void {
    const idx = progress.value.favorites.indexOf(questionId)
    if (idx > -1) {
      progress.value.favorites.splice(idx, 1)
    } else {
      progress.value.favorites.push(questionId)
    }
    persist()
  }

  // 获取某分类下已掌握的题目数
  function getMasteredCountByIds(questionIds: string[]): number {
    return questionIds.filter(id => progress.value.mastered.includes(id)).length
  }

  // 添加一条刷题历史记录
  function addQuizHistory(record: Omit<QuizHistory, 'id'>): void {
    const entry: QuizHistory = {
      ...record,
      id: Date.now().toString()
    }
    quizHistoryList.value.unshift(entry)
    // 最多保留50条历史
    if (quizHistoryList.value.length > 50) {
      quizHistoryList.value = quizHistoryList.value.slice(0, 50)
    }
    saveHistory(quizHistoryList.value)
  }

  // 清空刷题历史
  function clearHistory(): void {
    quizHistoryList.value = []
    saveHistory([])
  }

  // 重置所有进度
  function resetAll(): void {
    progress.value = { mastered: [], favorites: [], lastVisit: '' }
    persist()
    clearHistory()
  }

  // 持久化
  function persist(): void {
    progress.value.lastVisit = new Date().toISOString().slice(0, 10)
    saveProgress(progress.value)
  }

  return {
    progress,
    quizHistoryList,
    masteredCount,
    favoritesCount,
    historyCount,
    isMastered,
    isFavorite,
    toggleMastered,
    toggleFavorite,
    getMasteredCountByIds,
    addQuizHistory,
    clearHistory,
    resetAll
  }
})

