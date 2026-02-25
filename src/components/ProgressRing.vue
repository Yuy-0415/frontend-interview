<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 100 100"
    class="transform -rotate-90"
    role="progressbar"
    :aria-valuenow="Math.round(percent)"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-label="`进度 ${Math.round(percent)}%`"
  >
    <!-- 背景圆环 -->
    <circle
      cx="50" cy="50" :r="radius"
      fill="none"
      :stroke="bgColor"
      :stroke-width="strokeWidth"
    />
    <!-- 进度圆环 -->
    <circle
      cx="50" cy="50" :r="radius"
      fill="none"
      :stroke="color"
      :stroke-width="strokeWidth"
      :stroke-dasharray="circumference"
      :stroke-dashoffset="offset"
      stroke-linecap="round"
      class="transition-all duration-500 ease-out"
    />
    <!-- 中间文字 -->
    <text
      x="50" y="50"
      text-anchor="middle"
      dominant-baseline="central"
      class="transform rotate-90 origin-center"
      :font-size="fontSize"
      :fill="textColor"
      font-weight="600"
      aria-hidden="true"
    >
      {{ displayText }}
    </text>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  percent: number
  size?: number
  strokeWidth?: number
  color?: string
  bgColor?: string
  textColor?: string
  fontSize?: number
  showText?: boolean
}>(), {
  size: 60,
  strokeWidth: 6,
  color: '#3b82f6',
  bgColor: '#e5e7eb',
  textColor: '#374151',
  fontSize: 16,
  showText: true,
})

const radius = computed(() => (100 - props.strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const offset = computed(() => {
  const p = Math.min(Math.max(props.percent, 0), 100)
  return circumference.value * (1 - p / 100)
})
const displayText = computed(() => props.showText ? `${Math.round(props.percent)}%` : '')
</script>

