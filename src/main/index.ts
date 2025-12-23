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
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, '../preload/picker.js')
    }
  })

  // 创建简单的选点页面
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }
        #overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.3);
          cursor: crosshair;
          z-index: 1000;
        }
        #crosshair {
          position: fixed;
          width: 30px;
          height: 30px;
          border: 2px solid red;
          border-radius: 50%;
          pointer-events: none;
          z-index: 1001;
        }
        #coords {
          position: fixed;
          bottom: 20px;
          left: 20px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 10px 15px;
          border-radius: 5px;
          font-family: monospace;
          font-size: 14px;
          z-index: 1002;
        }
        #hint {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 20px;
          text-align: center;
          text-shadow: 0 0 10px rgba(0,0,0,0.8);
          pointer-events: none;
          z-index: 1001;
        }
      </style>
    </head>
    <body>
      <div id="overlay"></div>
      <div id="crosshair"></div>
      <div id="coords">X: 0, Y: 0</div>
      <div id="hint">点击选择位置 | ESC 退出</div>
    </body>
    <script>
      const overlay = document.getElementById('overlay');
      const crosshair = document.getElementById('crosshair');
      const coords = document.getElementById('coords');

      document.addEventListener('mousemove', (e) => {
        crosshair.style.left = (e.clientX - 15) + 'px';
        crosshair.style.top = (e.clientY - 15) + 'px';
        coords.textContent = \`X: \${e.screenX}, Y: \${e.screenY}\`;
      });

      overlay.addEventListener('click', (e) => {
        window.pickerAPI.send('picker-selected', { x: e.screenX, y: e.screenY });
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          window.pickerAPI.send('picker-cancelled');
        }
      });
    </script>
  </body>
    </html>
  `

  pickerWindow.loadURL('data:text/html;charset=UTF-8,' + encodeURIComponent(html))
  pickerWindow.show()
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

  // 屏幕选点 IPC
  ipcMain.on('picker-selected', (_event, point) => {
    if (mainWindow) {
      mainWindow.webContents.send('point-picked', point)
    }
    if (pickerWindow) {
      pickerWindow.destroy()
      pickerWindow = null
    }
  })

  ipcMain.on('picker-cancelled', () => {
    if (pickerWindow) {
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
