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
    getStatus: () => ipcRenderer.invoke('mouse:get-status')
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
