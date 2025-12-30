<script setup lang="ts">
import type { MouseTask } from '@renderer/stores/mouse'

defineProps<{
  tasks: MouseTask[]
  isLoading?: boolean
}>()

defineEmits<{
  delete: [id: string]
  run: [id: string]
}>()

const getStatusBadge = (status: string) => {
  const badges: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '待执行' },
    executing: { bg: 'bg-blue-100', text: 'text-blue-800', label: '执行中' },
    completed: { bg: 'bg-green-100', text: 'text-green-800', label: '已完成' },
    failed: { bg: 'bg-red-100', text: 'text-red-800', label: '失败' }
  }
  return badges[status] || badges.pending
}

const getActionLabel = (action: string) => {
  const labels: Record<string, string> = {
    move: '移动',
    click: '点击',
    drag: '拖拽',
    scroll: '滚动'
  }
  return labels[action] || action
}

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('zh-CN')
}
</script>

<template>
  <div class="space-y-3">
    <div v-if="tasks.length === 0" class="text-center py-8 text-gray-500">
      <p class="text-lg">暂无任务</p>
    </div>

    <div
      v-for="task in tasks"
      :key="task.id"
      class="bg-white rounded-lg shadow p-4 hover:shadow-lg transition"
    >
      <div class="flex items-start justify-between">
        <!-- 任务信息 -->
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-2">
            <h3 class="font-semibold text-gray-900">
              {{ task.description || `${getActionLabel(task.action)} - (${task.x}, ${task.y})` }}
            </h3>
            <span
              :class="[
                getStatusBadge(task.status).bg,
                getStatusBadge(task.status).text,
                'px-2 py-1 rounded text-xs font-medium'
              ]"
            >
              {{ getStatusBadge(task.status).label }}
            </span>
          </div>

          <div class="text-sm text-gray-600 space-y-1">
            <p>
              <span class="font-medium">操作：</span>
              {{ getActionLabel(task.action) }}
            </p>
            <p v-if="task.action === 'drag'">
              <span class="font-medium">位置：</span>
              从 ({{ task.x }}, {{ task.y }}) 到 ({{ task.targetX }}, {{ task.targetY }})
            </p>
            <p v-else>
              <span class="font-medium">位置：</span>
              ({{ task.x }}, {{ task.y }})
            </p>

            <p v-if="task.action === 'click'">
              <span class="font-medium">按钮：</span>
              {{ { left: '左键', right: '右键', middle: '中键' }[task.button || 'left'] }}
            </p>

            <p v-if="task.delay">
              <span class="font-medium">延迟：</span>
              {{ task.delay }}ms
            </p>

            <p v-if="task.scheduledTime">
              <span class="font-medium">定时：</span>
              {{ formatTime(task.scheduledTime) }}
            </p>

            <p v-if="task.error">
              <span class="font-medium text-red-600">错误：</span>
              {{ task.error }}
            </p>

            <p class="text-gray-500">
              <span class="font-medium">创建时间：</span>
              {{ formatTime(task.createdAt) }}
            </p>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex gap-2 ml-4">
          <button
            @click="$emit('run', task.id)"
            :disabled="isLoading"
            class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:bg-gray-400 text-sm font-medium"
          >
            运行
          </button>
          <button
            @click="$emit('delete', task.id)"
            :disabled="isLoading"
            class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:bg-gray-400 text-sm font-medium"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
