import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface MouseTask {
  id: string
  action: 'move' | 'click' | 'drag' | 'scroll'
  x: number
  y: number
  targetX?: number
  targetY?: number
  button?: 'left' | 'right' | 'middle'
  delay?: number
  scrollX?: number
  scrollY?: number
  scheduledTime?: number
  createdAt: number
  status: 'pending' | 'executing' | 'completed' | 'failed'
  error?: string
  description?: string
}

export const useMouseStore = defineStore('mouse', () => {
  const tasks = ref<MouseTask[]>([])
  const status = ref({
    activeTask: null as string | null,
    pendingTasks: 0,
    completedTasks: 0,
    failedTasks: 0
  })

  const completedCount = computed(() => status.value.completedTasks)
  const failedCount = computed(() => status.value.failedTasks)
  const pendingCount = computed(() => status.value.pendingTasks)

  /**
   * 添加任务
   */
  const addTask = async (task: Omit<MouseTask, 'id' | 'createdAt' | 'status'>) => {
    const newTask = await window.api.mouse.addTask(task)
    tasks.value.push(newTask)
    await refreshStatus()
    return newTask
  }

  /**
   * 获取所有任务（从主进程同步）
   */
  const getTasks = async () => {
    tasks.value = await window.api.mouse.getTasks()
    return tasks.value
  }

  /**
   * 删除任务
   */
  const deleteTask = async (id: string) => {
    const result = await window.api.mouse.deleteTask(id)
    tasks.value = tasks.value.filter((t) => t.id !== id)
    await refreshStatus()
    return result
  }

  /**
   * 运行任务
   */
  const runTask = async (id: string) => {
    await window.api.mouse.runTask(id)
    // 任务执行后刷新状态（不需要重新加载所有任务）
    await refreshStatus()
  }

  /**
   * 清空所有任务
   */
  const clearAllTasks = async () => {
    await window.api.mouse.clearTasks()
    tasks.value = []
    await refreshStatus()
  }

  /**
   * 刷新状态（只更新统计数据）
   */
  const refreshStatus = async () => {
    status.value = await window.api.mouse.getStatus()
    // 同时更新本地任务的状态
    const remoteTaskData = await window.api.mouse.getTasks()

    // 将远程任务数据合并到本地
    tasks.value = remoteTaskData
  }

  return {
    tasks,
    status,
    completedCount,
    failedCount,
    pendingCount,
    addTask,
    getTasks,
    deleteTask,
    runTask,
    clearAllTasks,
    refreshStatus
  }
})
