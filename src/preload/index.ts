import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  mouse: {
    addTask: (task: any) => window.electron.ipcRenderer.invoke('mouse:add-task', task),
    getTasks: () => window.electron.ipcRenderer.invoke('mouse:get-tasks'),
    getTask: (id: string) => window.electron.ipcRenderer.invoke('mouse:get-task', id),
    deleteTask: (id: string) => window.electron.ipcRenderer.invoke('mouse:delete-task', id),
    runTask: (id: string) => window.electron.ipcRenderer.invoke('mouse:run-task', id),
    clearTasks: () => window.electron.ipcRenderer.invoke('mouse:clear-tasks'),
    getStatus: () => window.electron.ipcRenderer.invoke('mouse:get-status')
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
