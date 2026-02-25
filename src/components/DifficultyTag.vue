<template>
  <span
    class="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
    :class="[config.color, config.bg]"
  >
    {{ config.label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { DIFFICULTY_MAP } from '../types'
import type { Difficulty } from '../types'

const props = defineProps<{ level: Difficulty }>()

const config = computed(() => DIFFICULTY_MAP[props.level])
</script>

