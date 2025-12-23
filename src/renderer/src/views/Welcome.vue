<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAppStore } from '@renderer/stores/app'

const router = useRouter()
const appStore = useAppStore()

const goToMouseControl = () => {
  router.push('/')
}

const goToAbout = () => {
  router.push('/about')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="text-6xl mb-6">🖱️</div>
        <h1 class="text-4xl font-bold text-gray-900 mb-3">{{ appStore.appTitle }}</h1>
        <div class="text-indigo-600 font-semibold text-lg">自动鼠标控制系统</div>
      </div>

      <!-- Main Content -->
      <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div class="text-gray-700 text-center mb-8">
          <p class="text-xl mb-4">
            一个强大的自动化工具，让您轻松控制鼠标操作
          </p>
          <p class="text-gray-600">支持移动、点击、拖拽、滚动等多种操作模式</p>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 text-center border-2 border-blue-200">
            <div class="text-4xl mb-3">🎯</div>
            <h3 class="font-bold text-lg mb-2 text-gray-900">屏幕选点</h3>
            <p class="text-gray-600 text-sm">直接在屏幕上选择目标位置，无需手动输入坐标</p>
          </div>
          <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 text-center border-2 border-green-200">
            <div class="text-4xl mb-3">⏰</div>
            <h3 class="font-bold text-lg mb-2 text-gray-900">定时执行</h3>
            <p class="text-gray-600 text-sm">支持定时任务，可在指定时间自动执行操作</p>
          </div>
          <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 text-center border-2 border-purple-200">
            <div class="text-4xl mb-3">📋</div>
            <h3 class="font-bold text-lg mb-2 text-gray-900">任务管理</h3>
            <p class="text-gray-600 text-sm">记录所有操作任务，随时查看执行状态和历史</p>
          </div>
        </div>

        <!-- Capabilities -->
        <div class="bg-indigo-50 rounded-lg p-6 mb-8">
          <h3 class="font-bold text-lg text-gray-900 mb-4">✨ 功能特性</h3>
          <ul class="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">
            <li class="flex items-start gap-2">
              <span class="text-green-600 font-bold">✓</span>
              <span>自动移动鼠标到指定位置</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-600 font-bold">✓</span>
              <span>支持左键、右键、中键点击</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-600 font-bold">✓</span>
              <span>拖拽操作（从一点拖到另一点）</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-600 font-bold">✓</span>
              <span>鼠标滚轮滚动</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-600 font-bold">✓</span>
              <span>设置操作延迟时间</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-600 font-bold">✓</span>
              <span>定时自动执行任务</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-600 font-bold">✓</span>
              <span>任务执行状态实时显示</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-600 font-bold">✓</span>
              <span>完整的任务历史记录</span>
            </li>
          </ul>
        </div>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4">
          <button
            @click="goToMouseControl"
            class="flex-1 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center font-bold text-lg"
          >
            🚀 开始使用
          </button>
          <button
            @click="goToAbout"
            class="flex-1 px-6 py-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-center font-bold text-lg"
          >
            ℹ️ 了解更多
          </button>
        </div>
      </div>

      <!-- Info Box -->
      <div class="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
        <p class="text-sm text-gray-700">
          💡 <strong>提示：</strong> 首次使用请查看应用设置和使用说明。按 <code class="bg-gray-200 px-2 py-1 rounded">F12</code> 可打开开发者工具
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.logo {
  opacity: 0.8;
  transition: opacity 0.3s;
}

.logo:hover {
  opacity: 1;
}
</style>



