import { contextBridge, ipcRenderer } from 'electron'

const pickerAPI = {
  send: (channel: string, data?: any) => {
    try {
      ipcRenderer.send(channel, data)
    } catch (error) {
      console.error('[Picker] 发送 IPC 消息失败:', error)
    }
  }
}

try {
  contextBridge.exposeInMainWorld('pickerAPI', pickerAPI)
  console.log('[Picker] pickerAPI 已暴露')
} catch (error) {
  console.error('[Picker] 暴露 API 失败:', error)
}

