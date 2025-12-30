import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  mouse: {
    addTask: (task: any) => ipcRenderer.invoke('mouse:add-task', task),
    getTasks: () => ipcRenderer.invoke('mouse:get-tasks'),
    getTask: (id: string) => ipcRenderer.invoke('mouse:get-task', id),
    deleteTask: (id: string) => ipcRenderer.invoke('mouse:delete-task', id),
    runTask: (id: string) => ipcRenderer.invoke('mouse:run-task', id),
    clearTasks: () => ipcRenderer.invoke('mouse:clear-tasks'),
    getStatus: () => ipcRenderer.invoke('mouse:get-status'),
    getPosition: () => ipcRenderer.invoke('mouse:get-position'),
    openPicker: () => ipcRenderer.invoke('open-picker'),
    // Picker 窗口发送选点结果
    sendPickedPoint: (point: { x: number; y: number }) =>
      ipcRenderer.send('picker-selected', point),
    sendPickerCancelled: () => ipcRenderer.send('picker-cancelled'),
    // 主窗口监听选点结果
    onPointPicked: (callback: (point: { x: number; y: number }) => void) => {
      ipcRenderer.on('point-picked', (_event, point) => callback(point))
    },
    onPickerCancelled: (callback: () => void) => {
      ipcRenderer.on('picker-cancelled', () => callback())
    },
    removePointPickedListener: () => {
      ipcRenderer.removeAllListeners('point-picked')
      ipcRenderer.removeAllListeners('picker-cancelled')
    }
  },
  // 存储配置 API
  storage: {
    getLocation: () => ipcRenderer.invoke('storage:get-location'),
    selectLocation: () => ipcRenderer.invoke('storage:select-location')
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    // 调试信息：确认 API 已暴露
    console.log('[Preload] API exposed:', {
      hasApi: !!api,
      hasMouse: !!api.mouse,
      hasAddTask: typeof api.mouse.addTask === 'function',
      hasGetTasks: typeof api.mouse.getTasks === 'function',
      hasOpenPicker: typeof api.mouse.openPicker === 'function',
      hasOnPointPicked: typeof api.mouse.onPointPicked === 'function',
      hasOnPickerCancelled: typeof api.mouse.onPickerCancelled === 'function',
      hasRemovePointPickedListener: typeof api.mouse.removePointPickedListener === 'function',
      hasSendPickedPoint: typeof api.mouse.sendPickedPoint === 'function',
      hasSendPickerCancelled: typeof api.mouse.sendPickerCancelled === 'function',
      hasStorage: !!api.storage,
      hasGetLocation: typeof api.storage.getLocation === 'function',
      hasSelectLocation: typeof api.storage.selectLocation === 'function'
    })
  } catch (error) {
    console.error('[Preload] Error exposing API:', error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
  // 调试信息：确认 API 已暴露
  console.log('[Preload] API exposed (non-isolated):', {
    hasApi: !!api,
    hasMouse: !!api.mouse,
    hasAddTask: typeof api.mouse.addTask === 'function',
    hasGetTasks: typeof api.mouse.getTasks === 'function',
    hasOpenPicker: typeof api.mouse.openPicker === 'function',
    hasOnPointPicked: typeof api.mouse.onPointPicked === 'function',
    hasOnPickerCancelled: typeof api.mouse.onPickerCancelled === 'function',
    hasRemovePointPickedListener: typeof api.mouse.removePointPickedListener === 'function',
    hasSendPickedPoint: typeof api.mouse.sendPickedPoint === 'function',
    hasSendPickerCancelled: typeof api.mouse.sendPickerCancelled === 'function',
    hasStorage: !!api.storage,
    hasGetLocation: typeof api.storage.getLocation === 'function',
    hasSelectLocation: typeof api.storage.selectLocation === 'function'
  })
}
