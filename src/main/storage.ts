import { app } from 'electron'
import { promises as fs } from 'fs'
import { join } from 'path'
import type { MouseTask } from './mouse-controller'

/**
 * 数据持久化管理模块
 * 负责任务数据的保存和加载
 */
export class StorageManager {
  private storageDir: string
  private tasksFile: string
  private configFile: string

  constructor() {
    // 使用 Electron app 的 userData 目录作为默认位置
    const defaultDir = join(app.getPath('userData'), 'data')
    this.storageDir = defaultDir
    this.tasksFile = join(this.storageDir, 'tasks.json')
    // 配置文件用来存储用户选择的存储位置
    this.configFile = join(app.getPath('userData'), 'storage-config.json')
  }

  /**
   * 设置自定义存储位置
   */
  async setStorageLocation(location: string): Promise<void> {
    try {
      // 验证目录是否可访问
      await fs.mkdir(location, { recursive: true })

      // 保存配置
      await fs.writeFile(
        this.configFile,
        JSON.stringify({ storageDir: location }, null, 2),
        'utf-8'
      )

      // 更新内部状态
      this.storageDir = location
      this.tasksFile = join(this.storageDir, 'tasks.json')

      console.log(`[Storage] ✅ 存储位置已更改为: ${location}`)
    } catch (error) {
      console.error('[Storage] ❌ 设置存储位置失败:', error)
      throw error
    }
  }

  /**
   * 获取当前存储位置
   */
  getStorageLocation(): string {
    return this.storageDir
  }

  /**
   * 加载存储位置配置
   */
  private async loadStorageConfig(): Promise<void> {
    try {
      try {
        await fs.access(this.configFile)
      } catch {
        // 配置文件不存在，使用默认位置
        return
      }

      const content = await fs.readFile(this.configFile, 'utf-8')
      const config = JSON.parse(content)

      if (config.storageDir) {
        // 验证目录存在
        await fs.mkdir(config.storageDir, { recursive: true })
        this.storageDir = config.storageDir
        this.tasksFile = join(this.storageDir, 'tasks.json')
        console.log(`[Storage] ✅ 加载自定义存储位置: ${this.storageDir}`)
      }
    } catch (error) {
      console.warn('[Storage] ⚠️ 加载存储配置失败，使用默认位置:', error)
    }
  }

  /**
   * 初始化存储目录
   */
  async initialize(): Promise<void> {
    try {
      // 首先加载存储配置
      await this.loadStorageConfig()

      // 创建存储目录（如果不存在）
      await fs.mkdir(this.storageDir, { recursive: true })
      console.log(`[Storage] 存储目录已初始化: ${this.storageDir}`)
    } catch (error) {
      console.error('[Storage] 初始化存储目录失败:', error)
      throw error
    }
  }

  /**
   * 保存任务列表到文件
   */
  async saveTasks(tasks: MouseTask[]): Promise<void> {
    try {
      const data = {
        version: '1.0',
        timestamp: Date.now(),
        tasks: tasks
      }
      await fs.writeFile(this.tasksFile, JSON.stringify(data, null, 2), 'utf-8')
      console.log(`[Storage] ✅ 任务已保存: ${tasks.length} 个任务`)
    } catch (error) {
      console.error('[Storage] ❌ 保存任务失败:', error)
      throw error
    }
  }

  /**
   * 从文件加载任务列表
   */
  async loadTasks(): Promise<MouseTask[]> {
    try {
      // 检查文件是否存在
      try {
        await fs.access(this.tasksFile)
      } catch {
        console.log('[Storage] 任务文件不存在，返回空列表')
        return []
      }

      const content = await fs.readFile(this.tasksFile, 'utf-8')
      const data = JSON.parse(content)

      // 验证数据结构
      if (!Array.isArray(data.tasks)) {
        console.warn('[Storage] ⚠️ 数据结构无效，返回空列表')
        return []
      }

      console.log(`[Storage] ✅ 任务已加载: ${data.tasks.length} 个任务`)
      return data.tasks
    } catch (error) {
      console.error('[Storage] ❌ 加载任务失败:', error)
      return []
    }
  }

  /**
   * 清除所有任务数据
   */
  async clearTasks(): Promise<void> {
    try {
      await fs.unlink(this.tasksFile)
      console.log('[Storage] ✅ 任务数据已清除')
    } catch (error) {
      // 如果文件不存在，也不抛出错误
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        console.log('[Storage] 任务文件不存在，无需清除')
      } else {
        console.error('[Storage] ❌ 清除任务失败:', error)
        throw error
      }
    }
  }

  /**
   * 获取存储文件路径（仅用于调试）
   */
  getStoragePath(): string {
    return this.tasksFile
  }
}

// 导出单例
export const storageManager = new StorageManager()
