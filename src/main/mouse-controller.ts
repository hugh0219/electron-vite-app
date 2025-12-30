import { mouse, Button } from '@nut-tree/nut-js'
import { storageManager } from './storage'

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
  private saveTimer: NodeJS.Timeout | null = null
  private isDirty: boolean = false

  /**
   * 初始化控制器：加载持久化数据
   */
  async initialize(): Promise<void> {
    try {
      const savedTasks = await storageManager.loadTasks()

      // 加载所有状态的任务（pending, executing, completed, failed）
      // 用户可以自己选择删除
      let pendingCount = 0
      let completedCount = 0
      let failedCount = 0

      savedTasks.forEach((task) => {
        // 保留原始状态加载任务
        this.tasks.set(task.id, task)

        // 统计不同状态的任务
        if (task.status === 'pending' || task.status === 'executing') {
          pendingCount++
          // 恢复定时任务（只对待执行任务）
          if (task.scheduledTime) {
            this.scheduleTask(task.id, task.scheduledTime)
          }
        } else if (task.status === 'completed') {
          completedCount++
        } else if (task.status === 'failed') {
          failedCount++
        }
      })

      console.log(
        `[MouseController] ✅ 已加载 ${this.tasks.size} 个任务 (待执行: ${pendingCount}, 已完成: ${completedCount}, 失败: ${failedCount})`
      )

      // 启动自动保存定时器
      this.startAutoSave()
    } catch (error) {
      console.error('[MouseController] ❌ 初始化失败:', error)
      throw error
    }
  }

  /**
   * 标记数据为需要保存
   */
  private markDirty(): void {
    this.isDirty = true
  }

  /**
   * 启动自动保存定时器（每 2 秒保存一次）
   */
  private startAutoSave(): void {
    this.saveTimer = setInterval(async () => {
      if (this.isDirty) {
        try {
          await this.save()
          this.isDirty = false
        } catch (error) {
          console.error('[MouseController] 自动保存失败:', error)
        }
      }
    }, 2000)
  }

  /**
   * 停止自动保存
   */
  stopAutoSave(): void {
    if (this.saveTimer) {
      clearInterval(this.saveTimer)
      this.saveTimer = null
    }
  }

  /**
   * 立即保存所有任务
   */
  async save(): Promise<void> {
    const tasks = Array.from(this.tasks.values())
    await storageManager.saveTasks(tasks)
  }

  /**
   * 获取当前全局鼠标位置（屏幕坐标）
   */
  async getCurrentPosition(): Promise<{ x: number; y: number }> {
    try {
      const pos = await mouse.getPosition()
      return { x: pos.x, y: pos.y }
    } catch (error) {
      console.error('获取鼠标位置失败:', error)
      throw error
    }
  }

  /**
   * 移动鼠标到指定位置
   */
  async moveToPosition(x: number, y: number, duration: number = 500): Promise<void> {
    try {
      const currentPos = await mouse.getPosition()
      console.log(
        `[moveToPosition] 当前位置: (${currentPos.x}, ${currentPos.y}) -> 目标: (${x}, ${y})`
      )
      const startX = currentPos.x
      const startY = currentPos.y
      const steps = Math.ceil(duration / 16) // 60fps
      let currentStep = 0

      return new Promise<void>((resolve) => {
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
            console.log(`[moveToPosition] ✅ 移动完成到: (${x}, ${y})`)
            resolve()
          }
        }

        moveStep()
      })
    } catch (error) {
      console.error('[moveToPosition] ❌ 移动失败:', error)
      throw error
    }
  }

  /**
   * 点击鼠标
   */
  async click(button: 'left' | 'right' | 'middle' = 'left'): Promise<void> {
    try {
      console.log(`[click] 执行点击操作，按钮: ${button}`)

      let buttonEnum
      if (button === 'left') {
        buttonEnum = Button.LEFT
        console.log(`[click] 按钮值: LEFT (${buttonEnum})`)
      } else if (button === 'right') {
        buttonEnum = Button.RIGHT
        console.log(`[click] 按钮值: RIGHT (${buttonEnum})`)
      } else if (button === 'middle') {
        buttonEnum = Button.MIDDLE
        console.log(`[click] 按钮值: MIDDLE (${buttonEnum})`)
      } else {
        buttonEnum = Button.LEFT
      }

      // 使用 press 和 release 方式而不是 click
      console.log(`[click] 按下按钮...`)
      await mouse.pressButton(buttonEnum)

      console.log(`[click] 等待50ms...`)
      await new Promise((resolve) => setTimeout(resolve, 50))

      console.log(`[click] 释放按钮...`)
      await mouse.releaseButton(buttonEnum)

      console.log(`[click] ✅ 点击 ${button} 按钮成功`)
    } catch (error) {
      console.error(`[click] ❌ 点击 ${button} 按钮失败:`, error)
      throw error
    }
  }

  /**
   * 移动到指定位置后点击
   */
  async moveAndClick(
    x: number,
    y: number,
    button: 'left' | 'right' | 'middle' = 'left',
    duration: number = 500
  ): Promise<void> {
    try {
      console.log(`[moveAndClick] 开始：移动到 (${x}, ${y}) 然后点击 ${button}`)

      // 先移动到指定位置
      console.log(`[moveAndClick] 步骤1: 正在移动到目标位置...`)
      await this.moveToPosition(x, y, duration)
      console.log(`[moveAndClick] 步骤1: ✅ 移动完成`)

      // 添加小延迟以确保稳定
      console.log(`[moveAndClick] 步骤2: 等待100ms...`)
      await new Promise((resolve) => setTimeout(resolve, 100))
      console.log(`[moveAndClick] 步骤2: ✅ 等待完成`)

      // 然后点击
      console.log(`[moveAndClick] 步骤3: 正在执行点击...`)
      await this.click(button)
      console.log(`[moveAndClick] 步骤3: ✅ 点击完成`)

      console.log(`[moveAndClick] ✅ 所有步骤完成`)
    } catch (error) {
      console.error(`[moveAndClick] ❌ 失败:`, error)
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
    this.markDirty()

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
    const result = this.tasks.delete(id)
    if (result) {
      this.markDirty()
    }
    return result
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
      console.log(`开始执行任务: ${id}, 动作: ${task.action}, 位置: (${task.x}, ${task.y})`)

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
          // 移动到指定位置后点击
          console.log(`执行点击任务，按钮: ${task.button || 'left'}`)
          await this.moveAndClick(task.x, task.y, task.button || 'left')
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
      console.log(`任务执行完成: ${id}`)
    } catch (error) {
      task.status = 'failed'
      task.error = error instanceof Error ? error.message : '未知错误'
      console.error(`任务执行失败: ${id}, 错误: ${task.error}`)
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
    this.markDirty()
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
