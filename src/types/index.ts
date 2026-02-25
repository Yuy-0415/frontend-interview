// 题目难度等级
export type Difficulty = 1 | 2 | 3

// 单道面试题
export interface Question {
  id: string
  title: string
  difficulty: Difficulty
  tags: string[]
  answer: string
  code?: string
}

// 知识模块分类
export interface Category {
  id: string
  name: string
  icon: string
  description: string
  questions: Question[]
}

// 用户进度数据（存 localStorage）
export interface UserProgress {
  mastered: string[]
  favorites: string[]
  lastVisit: string
}

// 难度配置映射
export interface DifficultyConfig {
  label: string
  color: string
  bg: string
}

// 刷题历史记录
export interface QuizHistory {
  id: string                // 唯一标识（时间戳）
  startTime: string         // 开始时间 ISO
  endTime: string           // 结束时间 ISO
  range: string             // 刷题范围标识（all / favorites / unmastered / 分类id）
  rangeLabel: string        // 刷题范围中文名
  totalCount: number        // 本次总题数
  masteredCount: number     // 本次标记掌握数
  viewedCount: number       // 本次浏览题数（翻到第几题）
}

// 难度配置表
export const DIFFICULTY_MAP: Record<Difficulty, DifficultyConfig> = {
  1: { label: '初级', color: 'text-green-600', bg: 'bg-green-100' },
  2: { label: '中级', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  3: { label: '高级', color: 'text-red-600', bg: 'bg-red-100' },
}

