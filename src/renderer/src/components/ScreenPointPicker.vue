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

const selectedPoint = ref<Point | null>(null)
const cursorPos = ref<Point>({ x: 0, y: 0 })
const overlay = ref<HTMLDivElement | null>(null)

const handleMouseMove = (e: MouseEvent) => {
  cursorPos.value = { x: e.clientX, y: e.clientY }
}

const handleClick = (e: MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()

  // 获取屏幕坐标
  let screenX = e.clientX
  let screenY = e.clientY

  // 尝试从 electron 获取窗口位置以计算实际屏幕坐标
  const getScreenCoords = async () => {
    try {
      const screenCoords = window.electron.ipcRenderer.invoke('get-window-bounds')
      return screenCoords
    } catch (e) {
      return null
    }
  }

  const point: Point = {
    x: Math.round(screenX),
    y: Math.round(screenY)
  }

  selectedPoint.value = point
  emit('pointSelected', point)
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    emit('cancel')
  }
}

onMounted(() => {
  if (overlay.value) {
    overlay.value.addEventListener('mousemove', handleMouseMove)
    overlay.value.addEventListener('click', handleClick)
    document.addEventListener('keydown', handleKeyDown)
  }
})

onUnmounted(() => {
  if (overlay.value) {
    overlay.value.removeEventListener('mousemove', handleMouseMove)
    overlay.value.removeEventListener('click', handleClick)
  }
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div
    v-if="isActive"
    ref="overlay"
    class="fixed inset-0 z-50 bg-black bg-opacity-30 cursor-crosshair"
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
      <div class="text-white text-2xl font-bold mb-4 drop-shadow-lg">点击选择目标位置</div>
      <div class="text-white text-lg drop-shadow-lg">按 ESC 退出</div>
    </div>
  </div>
</template>

