import type { Category } from '../types'
import vue3Core from './vue3-core'
import vue3Pinia from './vue3-pinia'
import vue3Router from './vue3-router'
import vue3Optimize from './vue3-optimize'
import vue2 from './vue2'
import javascript from './javascript'
import es6 from './es6'
import css from './css'
import http from './http'
import typescript from './typescript'
import engineering from './engineering'
import browser from './browser'
import algorithm from './algorithm'

// 所有分类数据（按优先级排序）
export const categories: Category[] = [
  vue3Core,
  vue3Pinia,
  vue3Router,
  vue3Optimize,
  vue2,
  javascript,
  es6,
  css,
  http,
  typescript,
  engineering,
  browser,
  algorithm,
]

