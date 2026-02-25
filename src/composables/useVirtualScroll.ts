import { ref, computed, onMounted, onUnmounted, type Ref } from 'vue'

/**
 * 虚拟滚动 composable
 * 用于大列表的高性能渲染，只渲染可视区域内的元素
 */
export function useVirtualScroll<T>(
  items: Ref<T[]>,
  options: {
    itemHeight: number       // 每项高度（px）
    containerRef: Ref<HTMLElement | null>
    overscan?: number        // 上下额外渲染的条数，默认5
  }
) {
  const { itemHeight, containerRef, overscan = 5 } = options

  const scrollTop = ref(0)
  const containerHeight = ref(0)

  // 总高度（撑开滚动区域）
  const totalHeight = computed(() => items.value.length * itemHeight)

  // 可视区域起始索引
  const startIndex = computed(() => {
    const idx = Math.floor(scrollTop.value / itemHeight) - overscan
    return Math.max(0, idx)
  })

  // 可视区域结束索引
  const endIndex = computed(() => {
    const idx = Math.ceil((scrollTop.value + containerHeight.value) / itemHeight) + overscan
    return Math.min(items.value.length, idx)
  })

  // 可视区域内的数据切片
  const visibleItems = computed(() => {
    return items.value.slice(startIndex.value, endIndex.value).map((item, i) => ({
      item,
      index: startIndex.value + i
    }))
  })

  // 偏移量（用于定位可视区域）
  const offsetY = computed(() => startIndex.value * itemHeight)

  function onScroll() {
    if (!containerRef.value) return
    scrollTop.value = containerRef.value.scrollTop
  }

  function updateContainerHeight() {
    if (!containerRef.value) return
    containerHeight.value = containerRef.value.clientHeight
  }

  let resizeObserver: ResizeObserver | null = null

  onMounted(() => {
    if (containerRef.value) {
      containerRef.value.addEventListener('scroll', onScroll, { passive: true })
      updateContainerHeight()
      // 监听容器尺寸变化
      resizeObserver = new ResizeObserver(updateContainerHeight)
      resizeObserver.observe(containerRef.value)
    }
  })

  onUnmounted(() => {
    if (containerRef.value) {
      containerRef.value.removeEventListener('scroll', onScroll)
    }
    if (resizeObserver) {
      resizeObserver.disconnect()
    }
  })

  return {
    visibleItems,
    totalHeight,
    offsetY,
    startIndex,
    endIndex
  }
}

