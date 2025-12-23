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

  const addTask = async (task: Omit<MouseTask, 'id' | 'createdAt' | 'status'>) => {
    const newTask = await window.api.mouse.addTask(task)
    tasks.value.push(newTask)
    await refreshStatus()
    return newTask
  }

  const getTasks = async () => {
    tasks.value = await window.api.mouse.getTasks()
    return tasks.value
  }

  const deleteTask = async (id: string) => {
    const result = await window.api.mouse.deleteTask(id)
    tasks.value = tasks.value.filter((t) => t.id !== id)
    await refreshStatus()
    return result
  }

  const runTask = async (id: string) => {
    await window.api.mouse.runTask(id)
    await getTasks()
  }

  const clearAllTasks = async () => {
    await window.api.mouse.clearTasks()
    tasks.value = []
    await refreshStatus()
  }

  const refreshStatus = async () => {
    status.value = await window.api.mouse.getStatus()
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


