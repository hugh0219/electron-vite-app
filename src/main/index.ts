import { app, shell, BrowserWindow, ipcMain, screen } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { mouseController } from './mouse-controller'

let mainWindow: BrowserWindow | null = null
let pickerWindow: BrowserWindow | null = null

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// 创建全屏点选窗口
function createPickerWindow(): void {
  const allDisplays = screen.getAllDisplays()
  const bounds = {
    x: allDisplays[0].bounds.x,
    y: allDisplays[0].bounds.y,
    width: allDisplays[0].bounds.width,
    height: allDisplays[0].bounds.height
  }

  pickerWindow = new BrowserWindow({
    ...bounds,
    type: 'splash',
    frame: false,
    show: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // 加载 picker 页面
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    pickerWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#/picker`)
  } else {
    pickerWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: '/picker' })
  }

  pickerWindow.once('ready-to-show', () => {
    pickerWindow?.show()
    pickerWindow?.focus()
    pickerWindow?.setAlwaysOnTop(true, 'screen-saver')

    // 在开发模式下打开开发者工具以便调试
    // if (is.dev) {
    //   pickerWindow?.webContents.openDevTools({ mode: 'detach' })
    // }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // 鼠标控制 IPC 处理
  ipcMain.handle('mouse:add-task', (_event, task) => {
    return mouseController.addTask(task)
  })

  ipcMain.handle('mouse:get-tasks', () => {
    return mouseController.getTasks()
  })

  ipcMain.handle('mouse:get-task', (_event, id: string) => {
    return mouseController.getTask(id)
  })

  ipcMain.handle('mouse:delete-task', (_event, id: string) => {
    return mouseController.deleteTask(id)
  })

  ipcMain.handle('mouse:run-task', (_event, id: string) => {
    return mouseController.runTask(id)
  })

  ipcMain.handle('mouse:clear-tasks', () => {
    mouseController.clearAllTasks()
    return true
  })

  ipcMain.handle('mouse:get-status', () => {
    return mouseController.getStatus()
  })

  // 获取全局鼠标位置
  ipcMain.handle('mouse:get-position', async () => {
    return await mouseController.getCurrentPosition()
  })

  // 屏幕选点 IPC
  ipcMain.on('picker-selected', (_event, point) => {
    console.log('[Main] 收到 picker-selected:', point)
    if (mainWindow) {
      console.log('[Main] 发送 point-picked 给渲染进程')
      mainWindow.webContents.send('point-picked', point)
    }
    if (pickerWindow) {
      console.log('[Main] 关闭选点窗口')
      pickerWindow.destroy()
      pickerWindow = null
    }
  })

  ipcMain.on('picker-cancelled', () => {
    console.log('[Main] 收到 picker-cancelled')
    if (mainWindow) {
      console.log('[Main] 发送 picker-cancelled 给渲染进程')
      mainWindow.webContents.send('picker-cancelled')
    }
    if (pickerWindow) {
      console.log('[Main] 关闭选点窗口')
      pickerWindow.destroy()
      pickerWindow = null
    }
  })

  ipcMain.handle('open-picker', () => {
    createPickerWindow()
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window when the
    // dock icon is clicked and no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
