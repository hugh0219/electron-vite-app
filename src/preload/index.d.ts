import { ElectronAPI } from '@electron-toolkit/preload'

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
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      mouse: {
        addTask: (task: Omit<MouseTask, 'id' | 'createdAt' | 'status'>) => Promise<MouseTask>
        getTasks: () => Promise<MouseTask[]>
        getTask: (id: string) => Promise<MouseTask | undefined>
        deleteTask: (id: string) => Promise<boolean>
        runTask: (id: string) => Promise<void>
        clearTasks: () => Promise<boolean>
        getStatus: () => Promise<{
          activeTask: string | null
          pendingTasks: number
          completedTasks: number
          failedTasks: number
        }>
        getPosition: () => Promise<{ x: number; y: number }>
        openPicker: () => Promise<void>
        onPointPicked: (callback: (point: { x: number; y: number }) => void) => void
        onPickerCancelled: (callback: () => void) => void
        removePointPickedListener: () => void
      }
    }
  }
}
