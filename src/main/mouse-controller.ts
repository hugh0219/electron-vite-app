import { mouse } from '@nut-tree/nut-js'
import { Button } from '@nut-tree/shared'

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

export class MouseController {
  private tasks: Map<string, MouseTask> = new Map()
  private activeTask: string | null = null
  private timers: Map<string, NodeJS.Timeout> = new Map()

  /**
   * 移动鼠标到指定位置
   */
  async moveToPosition(x: number, y: number, duration: number = 500): Promise<void> {
    try {
      const currentPos = await mouse.getPosition()
      const startX = currentPos.x
      const startY = currentPos.y
      const steps = Math.ceil(duration / 16) // 60fps
      let currentStep = 0

      const moveStep = async () => {
        currentStep++
        const progress = currentStep / steps
        const newX = Math.round(startX + (x - startX) * progress)
        const newY = Math.round(startY + (y - startY) * progress)

        await mouse.setPosition({ x: newX, y: newY })

        if (currentStep < steps) {
          setTimeout(moveStep, 16)
        } else {
          await mouse.setPosition({ x, y })
        }
      }

      await moveStep()
    } catch (error) {
      console.error('移动鼠标失败:', error)
      throw error
    }
  }

  /**
   * 点击鼠标
   */
  async click(button: 'left' | 'right' | 'middle' = 'left'): Promise<void> {
    try {
      const buttonMap = {
        left: Button.LEFT,
        right: Button.RIGHT,
        middle: Button.MIDDLE
      }
      await mouse.click(buttonMap[button])
    } catch (error) {
      console.error('点击失败:', error)
      throw error
    }
  }

  /**
   * 拖拽操作
   */
  async drag(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    duration: number = 500
  ): Promise<void> {
    try {
      await this.moveToPosition(fromX, fromY, duration / 2)
      
      // 按下鼠标左键
      await mouse.pressButton(Button.LEFT)
      
      // 移动到目标位置
      await this.moveToPosition(toX, toY, duration / 2)
      
      // 释放鼠标左键
      await mouse.releaseButton(Button.LEFT)
    } catch (error) {
      console.error('拖拽失败:', error)
      throw error
    }
  }

  /**
   * 滚动操作
   */
  async scroll(x: number, y: number, scrollX: number, scrollY: number): Promise<void> {
    try {
      await mouse.setPosition({ x, y })
      
      // 垂直滚动：向下滚动（正数）或向上滚动（负数）
      if (scrollY > 0) {
        await mouse.scrollDown(Math.abs(scrollY))
      } else if (scrollY < 0) {
        await mouse.scrollUp(Math.abs(scrollY))
      }
      
      // 水平滚动：向右滚动（正数）或向左滚动（负数）
      if (scrollX > 0) {
        await mouse.scrollRight(Math.abs(scrollX))
      } else if (scrollX < 0) {
        await mouse.scrollLeft(Math.abs(scrollX))
      }
    } catch (error) {
      console.error('滚动失败:', error)
      throw error
    }
  }

  /**
   * 添加任务
   */
  addTask(task: Omit<MouseTask, 'id' | 'createdAt' | 'status'>): MouseTask {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const newTask: MouseTask = {
      ...task,
      id,
      createdAt: Date.now(),
      status: 'pending'
    }

    this.tasks.set(id, newTask)

    // 如果有定时时间，则启用定时器
    if (task.scheduledTime) {
      this.scheduleTask(id, task.scheduledTime)
    }

    return newTask
  }

  /**
   * 获取所有任务
   */
  getTasks(): MouseTask[] {
    return Array.from(this.tasks.values())
  }

  /**
   * 获取单个任务
   */
  getTask(id: string): MouseTask | undefined {
    return this.tasks.get(id)
  }

  /**
   * 删除任务
   */
  deleteTask(id: string): boolean {
    const timer = this.timers.get(id)
    if (timer) {
      clearTimeout(timer)
      this.timers.delete(id)
    }
    return this.tasks.delete(id)
  }

  /**
   * 执行任务
   */
  async executeTask(id: string): Promise<void> {
    const task = this.tasks.get(id)
    if (!task) {
      throw new Error(`任务不存在: ${id}`)
    }

    try {
      task.status = 'executing'
      this.activeTask = id

      // 执行延迟
      if (task.delay) {
        await new Promise((resolve) => setTimeout(resolve, task.delay))
      }

      // 根据操作类型执行
      switch (task.action) {
        case 'move':
          await this.moveToPosition(task.x, task.y)
          break
        case 'click':
          await this.click(task.button)
          break
        case 'drag':
          if (task.targetX !== undefined && task.targetY !== undefined) {
            await this.drag(task.x, task.y, task.targetX, task.targetY)
          }
          break
        case 'scroll':
          await this.scroll(task.x, task.y, task.scrollX || 0, task.scrollY || 0)
          break
      }

      task.status = 'completed'
    } catch (error) {
      task.status = 'failed'
      task.error = error instanceof Error ? error.message : '未知错误'
      throw error
    } finally {
      this.activeTask = null
    }
  }

  /**
   * 定时执行任务
   */
  private scheduleTask(id: string, scheduledTime: number): void {
    const task = this.tasks.get(id)
    if (!task) return

    // 计算延迟时间
    const now = Date.now()
    const delay = Math.max(0, scheduledTime - now)

    const timer = setTimeout(() => {
      this.executeTask(id).catch((error) => {
        console.error('执行任务失败:', error)
      })
      this.timers.delete(id)
    }, delay)

    this.timers.set(id, timer)
  }

  /**
   * 立即执行任务
   */
  async runTask(id: string): Promise<void> {
    return this.executeTask(id)
  }

  /**
   * 清空所有任务
   */
  clearAllTasks(): void {
    this.timers.forEach((timer) => clearTimeout(timer))
    this.timers.clear()
    this.tasks.clear()
    this.activeTask = null
  }

  /**
   * 获取当前状态
   */
  getStatus(): {
    activeTask: string | null
    pendingTasks: number
    completedTasks: number
    failedTasks: number
  } {
    const tasks = Array.from(this.tasks.values())
    return {
      activeTask: this.activeTask,
      pendingTasks: tasks.filter((t) => t.status === 'pending').length,
      completedTasks: tasks.filter((t) => t.status === 'completed').length,
      failedTasks: tasks.filter((t) => t.status === 'failed').length
    }
  }
}

export const mouseController = new MouseController()
