import { contextBridge, ipcRenderer } from 'electron'

const pickerAPI = {
  send: (channel: string, data: any) => {
    ipcRenderer.send(channel, data)
  }
}

contextBridge.exposeInMainWorld('pickerAPI', pickerAPI)

