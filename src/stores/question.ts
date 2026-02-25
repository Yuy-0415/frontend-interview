import { defineStore } from 'pinia'
import { computed } from 'vue'
import { categories } from '../data'
import type { Category, Question } from '../types'

export const useQuestionStore = defineStore('question', () => {
  // 所有分类数据
  const allCategories = computed<Category[]>(() => categories)

  // 所有题目（扁平化）
  const allQuestions = computed<Question[]>(() => {
    return categories.flatMap(c => c.questions)
  })

  // 总题目数
  const totalCount = computed(() => allQuestions.value.length)

  // 根据分类ID获取分类
  function getCategoryById(id: string): Category | undefined {
    return categories.find(c => c.id === id)
  }

  // 根据题目ID获取题目（同时返回所属分类）
  function getQuestionById(categoryId: string, questionId: string): {
    question: Question | undefined
    category: Category | undefined
    index: number
  } {
    const category = getCategoryById(categoryId)
    if (!category) return { question: undefined, category: undefined, index: -1 }
    const index = category.questions.findIndex(q => q.id === questionId)
    return {
      question: index > -1 ? category.questions[index] : undefined,
      category,
      index
    }
  }

  // 搜索题目（模糊匹配标题和标签）
  function searchQuestions(keyword: string): Array<{ question: Question; category: Category }> {
    if (!keyword.trim()) return []
    const kw = keyword.toLowerCase()
    const results: Array<{ question: Question; category: Category }> = []
    for (const category of categories) {
      for (const question of category.questions) {
        const matchTitle = question.title.toLowerCase().includes(kw)
        const matchTag = question.tags.some(t => t.toLowerCase().includes(kw))
        if (matchTitle || matchTag) {
          results.push({ question, category })
        }
      }
    }
    return results
  }

  return {
    allCategories,
    allQuestions,
    totalCount,
    getCategoryById,
    getQuestionById,
    searchQuestions
  }
})

