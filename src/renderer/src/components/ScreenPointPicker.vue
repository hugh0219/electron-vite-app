<script setup lang="ts">
import { watch, onUnmounted } from 'vue'

interface Point {
  x: number
  y: number
}

const emit = defineEmits<{
  pointSelected: [Point]
  cancel: []
}>()

const props = withDefaults(
  defineProps<{
    isActive?: boolean
  }>(),
  {
    isActive: false
  }
)

// 监听全屏选点窗口返回的点
const handlePointPicked = (point: { x: number; y: number }) => {
  console.log('[ScreenPointPicker] 收到选点:', point)
  // 清理监听器
  cleanupListeners()
  // 发送事件给父组件
  emit('pointSelected', { x: point.x, y: point.y })
}

// 监听取消事件
const handlePickerCancelled = () => {
  console.log('[ScreenPointPicker] 收到取消事件')
  // 清理监听器
  cleanupListeners()
  // 发送取消事件给父组件
  emit('cancel')
}

// 等待 API 可用的辅助函数
const waitForAPI = (maxAttempts = 10, delay = 100): Promise<boolean> => {
  return new Promise((resolve) => {
    let attempts = 0
    const checkAPI = () => {
      // 使用类型断言来检查运行时是否存在
      const api = window.api
      // 详细检查每个属性
      const mouseObj = api?.mouse
      const hasOnPointPicked = mouseObj && typeof mouseObj.onPointPicked === 'function'
      const hasOnPickerCancelled = mouseObj && typeof mouseObj.onPickerCancelled === 'function'
      const hasOpenPicker = mouseObj && typeof mouseObj.openPicker === 'function'

      // 第一次检查时输出详细信息
      if (attempts === 0) {
        console.log('[ScreenPointPicker] API 检查:', {
          hasApi: !!api,
          hasMouse: !!mouseObj,
          mouseKeys: mouseObj ? Object.keys(mouseObj) : [],
          hasOnPointPicked,
          hasOnPickerCancelled,
          hasOpenPicker
        })
      }

      if (hasOnPointPicked && hasOnPickerCancelled && hasOpenPicker) {
        resolve(true)
      } else if (attempts < maxAttempts) {
        attempts++
        setTimeout(checkAPI, delay)
      } else {
        console.error('API 检查失败:', {
          hasWindow: typeof window !== 'undefined',
          hasApi: !!api,
          hasMouse: !!(api && api.mouse),
          hasOnPointPicked,
          hasOnPickerCancelled,
          hasOpenPicker
        })
        resolve(false)
      }
    }
    checkAPI()
  })
}

// 清理监听器的辅助函数
const cleanupListeners = () => {
  if (window.api?.mouse?.removePointPickedListener) {
    try {
      window.api.mouse.removePointPickedListener()
    } catch (error) {
      console.error('清理监听器失败:', error)
    }
  }
}

// 当激活时，打开全屏选点窗口
watch(
  () => props.isActive,
  async (isActive) => {
    if (isActive) {
      // 先清理之前的监听器（如果有）
      cleanupListeners()

      // 等待 API 可用
      const apiReady = await waitForAPI()
      if (!apiReady) {
        console.error('API 不可用，请确保预加载脚本已正确加载')
        emit('cancel')
        return
      }

      // 设置监听器
      try {
        window.api.mouse.onPointPicked(handlePointPicked)
        window.api.mouse.onPickerCancelled(handlePickerCancelled)
      } catch (error) {
        console.error('设置监听器失败:', error)
        emit('cancel')
        return
      }

      // 打开全屏选点窗口
      try {
        await window.api.mouse.openPicker()
      } catch (error) {
        console.error('打开选点窗口失败:', error)
        cleanupListeners()
        emit('cancel')
      }
    } else {
      // 清理监听器
      cleanupListeners()
    }
  },
  { immediate: false }
)

onUnmounted(() => {
  // 清理监听器
  cleanupListeners()
})
</script>

<template>
  <!-- 全屏选点窗口由主进程管理，这里不需要显示任何内容 -->
  <!-- 当 isActive 为 true 时，会打开全屏选点窗口 -->
  <div style="display: none"></div>
</template>
