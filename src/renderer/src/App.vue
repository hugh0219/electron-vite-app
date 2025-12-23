<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'

const router = useRouter()

const isActive = (name: string) => {
  return router.currentRoute.value.name === name
}
</script>

<template>
  <div id="app" class="app-container">
    <!-- 导航栏 -->
    <nav class="bg-indigo-600 text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-2xl">🖱️</span>
            <h1 class="text-xl font-bold">自动鼠标控制</h1>
          </div>
          <div class="flex gap-4">
            <button
              @click="router.push('/')"
              :class="[
                'px-4 py-2 rounded transition',
                isActive('MouseControl')
                  ? 'bg-white text-indigo-600 font-bold'
                  : 'hover:bg-indigo-500'
              ]"
            >
              控制面板
            </button>
            <button
              @click="router.push('/about')"
              :class="[
                'px-4 py-2 rounded transition',
                isActive('About')
                  ? 'bg-white text-indigo-600 font-bold'
                  : 'hover:bg-indigo-500'
              ]"
            >
              关于
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- 页面内容 -->
    <RouterView />
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
