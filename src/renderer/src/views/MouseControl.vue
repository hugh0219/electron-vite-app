<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useMouseStore, type MouseTask } from '@renderer/stores/mouse'
import TaskForm from '@renderer/components/TaskForm.vue'
import TaskList from '@renderer/components/TaskList.vue'

const mouseStore = useMouseStore()
const showTaskForm = ref(false)
const isLoading = ref(false)
const refreshInterval = ref<number | null>(null)

onMounted(async () => {
  await loadTasks()
  // 每秒刷新一次任务状态
  refreshInterval.value = window.setInterval(async () => {
    await mouseStore.refreshStatus()
  }, 1000)
})

// 清理定时器
watch(showTaskForm, (newVal) => {
  if (!newVal && !refreshInterval.value) {
    refreshInterval.value = window.setInterval(async () => {
      await mouseStore.refreshStatus()
    }, 1000)
  }
})

const loadTasks = async () => {
  isLoading.value = true
  try {
    await mouseStore.getTasks()
  } finally {
    isLoading.value = false
  }
}

const handleCreateTask = async (task: Omit<MouseTask, 'id' | 'createdAt' | 'status'>) => {
  isLoading.value = true
  try {
    await mouseStore.addTask(task)
    showTaskForm.value = false
  } catch (error) {
    console.error('创建任务失败:', error)
  } finally {
    isLoading.value = false
  }
}

const handleDeleteTask = async (id: string) => {
  if (confirm('确定要删除这个任务吗？')) {
    isLoading.value = true
    try {
      await mouseStore.deleteTask(id)
    } finally {
      isLoading.value = false
    }
  }
}

const handleRunTask = async (id: string) => {
  isLoading.value = true
  try {
    await mouseStore.runTask(id)
  } catch (error) {
    console.error('执行任务失败:', error)
  } finally {
    isLoading.value = false
  }
}

const handleClearAllTasks = async () => {
  if (confirm('确定要清空所有任务吗？此操作不可撤销。')) {
    isLoading.value = true
    try {
      await mouseStore.clearAllTasks()
    } finally {
      isLoading.value = false
    }
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- 头部 -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">🖱️ 自动鼠标控制</h1>
        <p class="text-gray-600 text-lg">轻松自动化您的鼠标操作</p>
      </div>

      <!-- 统计卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="text-3xl font-bold text-blue-600">{{ mouseStore.tasks.length }}</div>
          <p class="text-gray-600 text-sm mt-2">总任务数</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="text-3xl font-bold text-yellow-600">{{ mouseStore.pendingCount }}</div>
          <p class="text-gray-600 text-sm mt-2">待执行</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="text-3xl font-bold text-green-600">{{ mouseStore.completedCount }}</div>
          <p class="text-gray-600 text-sm mt-2">已完成</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="text-3xl font-bold text-red-600">{{ mouseStore.failedCount }}</div>
          <p class="text-gray-600 text-sm mt-2">失败</p>
        </div>
      </div>

      <!-- 主要内容区 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 任务创建表单 -->
        <div v-if="showTaskForm" class="lg:col-span-3 mb-8">
          <TaskForm @submit="handleCreateTask" @cancel="showTaskForm = false" />
        </div>

        <!-- 左侧 - 操作按钮 -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-lg p-6 sticky top-4 space-y-4">
            <h2 class="text-xl font-bold text-gray-900 mb-4">快速操作</h2>

            <button
              v-if="!showTaskForm"
              class="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
              @click="showTaskForm = true"
            >
              ➕ 创建新任务
            </button>

            <button
              :disabled="isLoading"
              class="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold disabled:bg-gray-400 flex items-center justify-center gap-2"
              @click="loadTasks"
            >
              🔄 刷新任务
            </button>

            <button
              :disabled="isLoading || mouseStore.tasks.length === 0"
              class="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold disabled:bg-gray-400 flex items-center justify-center gap-2"
              @click="handleClearAllTasks"
            >
              🗑️ 清空所有
            </button>

            <!-- 任务统计 -->
            <div class="bg-gray-50 rounded-lg p-4 mt-6">
              <h3 class="font-semibold text-gray-900 mb-3">任务统计</h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">总数：</span>
                  <span class="font-semibold">{{ mouseStore.tasks.length }}</span>
                </div>
                <div class="flex justify-between text-yellow-700">
                  <span class="text-gray-600">待执行：</span>
                  <span class="font-semibold">{{ mouseStore.pendingCount }}</span>
                </div>
                <div class="flex justify-between text-green-700">
                  <span class="text-gray-600">已完成：</span>
                  <span class="font-semibold">{{ mouseStore.completedCount }}</span>
                </div>
                <div class="flex justify-between text-red-700">
                  <span class="text-gray-600">失败：</span>
                  <span class="font-semibold">{{ mouseStore.failedCount }}</span>
                </div>
              </div>
            </div>

            <!-- 提示 -->
            <div
              class="bg-blue-50 border-l-4 border-blue-600 p-4 rounded text-sm text-gray-700 mt-6"
            >
              <p class="font-semibold mb-2">💡 使用提示</p>
              <ul class="space-y-1 text-xs">
                <li>✓ 点击"在屏幕上选择"按钮快速设置坐标</li>
                <li>✓ 支持定时执行和延迟执行</li>
                <li>✓ 点击"运行"立即执行任务</li>
                <li>✓ 任务自动记录执行状态</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 右侧 - 任务列表 -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">任务列表</h2>
            <TaskList
              :tasks="mouseStore.tasks"
              :is-loading="isLoading"
              @delete="handleDeleteTask"
              @run="handleRunTask"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
