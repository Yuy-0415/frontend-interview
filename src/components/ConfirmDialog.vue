<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div
        v-if="visible"
        class="fixed inset-0 z-[999] flex items-center justify-center px-4"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="'dialog-title-' + title"
        @click.self="onCancel"
        @keydown.escape="onCancel"
      >
        <!-- 遮罩层 -->
        <div class="absolute inset-0 bg-black/40" aria-hidden="true"></div>
        <!-- 弹窗主体 -->
        <div class="relative bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden">
          <!-- 图标区域 -->
          <div class="pt-6 pb-2 text-center">
            <span class="text-4xl">{{ icon }}</span>
          </div>
          <!-- 标题 -->
          <div class="px-6 pb-1 text-center">
            <h3 class="text-base font-bold text-gray-800">{{ title }}</h3>
          </div>
          <!-- 描述 -->
          <div class="px-6 pb-6 text-center">
            <p class="text-sm text-gray-500 leading-relaxed mt-1">{{ message }}</p>
          </div>
          <!-- 按钮区域 -->
          <div class="flex border-t border-gray-100">
            <button
              @click="onCancel"
              class="flex-1 py-3.5 text-sm text-gray-500 hover:bg-gray-50 active:bg-gray-100 transition-colors border-r border-gray-100"
            >
              {{ cancelText }}
            </button>
            <button
              @click="onConfirm"
              class="flex-1 py-3.5 text-sm font-medium transition-colors active:opacity-80"
              :class="confirmClass"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface ConfirmDialogProps {
  visible: boolean
  title?: string
  message?: string
  icon?: string
  confirmText?: string
  cancelText?: string
  type?: 'default' | 'danger'
}

const props = withDefaults(defineProps<ConfirmDialogProps>(), {
  title: '提示',
  message: '',
  icon: '🤔',
  confirmText: '确定',
  cancelText: '取消',
  type: 'default',
})

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
  (e: 'update:visible', val: boolean): void
}>()

const confirmClass = computed(() => {
  return props.type === 'danger'
    ? 'text-red-500 hover:bg-red-50'
    : 'text-blue-600 hover:bg-blue-50'
})

function onConfirm() {
  emit('confirm')
  emit('update:visible', false)
}

function onCancel() {
  emit('cancel')
  emit('update:visible', false)
}
</script>

<style scoped>
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.2s ease;
}
.dialog-enter-active .relative,
.dialog-leave-active .relative {
  transition: transform 0.2s ease;
}
.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}
.dialog-enter-from .relative {
  transform: scale(0.9);
}
.dialog-leave-to .relative {
  transform: scale(0.9);
}
</style>

