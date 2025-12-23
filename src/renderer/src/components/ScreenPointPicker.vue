<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Point {
  x: number
  y: number
}

const emit = defineEmits<{
  pointSelected: [Point]
  cancel: []
}>()

withDefaults(
  defineProps<{
    isActive?: boolean
  }>(),
  {
    isActive: false
  }
)

const cursorPos = ref<Point>({ x: 0, y: 0 })
const overlay = ref<HTMLDivElement | null>(null)

const handleMouseMove = (e: MouseEvent) => {
  cursorPos.value = { x: Math.round(e.clientX), y: Math.round(e.clientY) }
}

const handleClick = (e: MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()

  const point: Point = {
    x: Math.round(e.clientX),
    y: Math.round(e.clientY)
  }

  emit('pointSelected', point)
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    emit('cancel')
  }
}

onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div
    v-if="isActive"
    ref="overlay"
    class="fixed inset-0 z-50 bg-black bg-opacity-30 cursor-crosshair flex items-center justify-center"
    @click="handleClick"
  >
    <!-- 十字准星 -->
    <div
      class="fixed w-8 h-8 pointer-events-none border-2 border-red-500 rounded-full"
      :style="{ left: cursorPos.x - 16 + 'px', top: cursorPos.y - 16 + 'px' }"
    >
      <div class="absolute inset-1/2 w-1 h-1 bg-red-500 transform -translate-x-1/2 -translate-y-1/2"></div>
    </div>

    <!-- 坐标显示 -->
    <div
      class="fixed bg-gray-900 text-white px-3 py-1 rounded text-sm pointer-events-none"
      :style="{ left: cursorPos.x + 20 + 'px', top: cursorPos.y + 20 + 'px' }"
    >
      X: {{ cursorPos.x }}, Y: {{ cursorPos.y }}
    </div>

    <!-- 提示文字 -->
    <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <div class="text-white text-3xl font-bold mb-4 drop-shadow-lg">点击选择目标位置</div>
      <div class="text-white text-lg drop-shadow-lg">按 ESC 退出</div>
    </div>
  </div>
</template>
