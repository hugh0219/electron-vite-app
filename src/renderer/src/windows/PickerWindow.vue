<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const crosshairX = ref(0)
const crosshairY = ref(0)
const coordsText = ref('X: 0, Y: 0')

// 鼠标移动事件处理
const handleMouseMove = (e: MouseEvent) => {
  crosshairX.value = e.clientX - 15
  crosshairY.value = e.clientY - 15
  coordsText.value = `X: ${e.screenX}, Y: ${e.screenY}`
}

// 点击事件处理 - 发送选中的点给主进程
const handleClick = (e: MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()

  console.log('[PickerWindow] 点击事件:', e.screenX, e.screenY)

  // 通过 IPC 发送选点结果给主进程
  if (window.api?.mouse?.sendPickedPoint) {
    try {
      window.api.mouse.sendPickedPoint({ x: e.screenX, y: e.screenY })
      console.log('[PickerWindow] 选点事件已发送')
    } catch (error) {
      console.error('[PickerWindow] 发送选点事件失败:', error)
    }
  } else {
    console.error('[PickerWindow] sendPickedPoint 不可用')
  }
}

// ESC 键处理
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' || e.keyCode === 27) {
    e.preventDefault()
    e.stopPropagation()
    console.log('[PickerWindow] 检测到 ESC 键')

    // 通过 IPC 发送取消事件给主进程
    if (window.api?.mouse?.sendPickerCancelled) {
      try {
        window.api.mouse.sendPickerCancelled()
        console.log('[PickerWindow] 取消事件已发送')
      } catch (error) {
        console.error('[PickerWindow] 发送取消事件失败:', error)
      }
    }
  }
}

onMounted(() => {
  console.log('[PickerWindow] 组件已挂载')
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('click', handleClick, true)
  document.addEventListener('keydown', handleKeyDown, true)
  window.addEventListener('keydown', handleKeyDown, true)
})

onUnmounted(() => {
  console.log('[PickerWindow] 组件已卸载，清理事件监听')
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('click', handleClick, true)
  document.removeEventListener('keydown', handleKeyDown, true)
  window.removeEventListener('keydown', handleKeyDown, true)
})
</script>

<template>
  <div class="picker-container">
    <!-- 遮罩层 -->
    <div class="overlay"></div>

    <!-- 十字光标 -->
    <div class="crosshair" :style="{ left: crosshairX + 'px', top: crosshairY + 'px' }"></div>

    <!-- 坐标显示 -->
    <div class="coords">{{ coordsText }}</div>

    <!-- 提示文字 -->
    <div class="hint">点击选择位置 | ESC 退出</div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.picker-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  cursor: crosshair;
  z-index: 1000;
}

.crosshair {
  position: fixed;
  width: 30px;
  height: 30px;
  border: 2px solid red;
  border-radius: 50%;
  pointer-events: none;
  z-index: 1001;
}

.coords {
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  font-family: monospace;
  font-size: 14px;
  z-index: 1002;
}

.hint {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 20px;
  text-align: center;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
  pointer-events: none;
  z-index: 1001;
}
</style>

