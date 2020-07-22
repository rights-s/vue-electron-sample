'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import usb from 'usb'
import sql from 'mssql'

const usbDevices = usb.getDeviceList()
console.log('DEBUG: usb.getDeviceList()', usb.getDeviceList())

usbDevices.forEach(device => {
  device.open()
  console.log('DEBUG: device.deviceDescriptor', device.deviceDescriptor)
  device.getStringDescriptor(device.deviceDescriptor.iProduct, cb)
})

function cb (err, name) {
  console.log('DEBUG: cb -> err', err)
  console.log('DEBUG: cb -> name', name)
}

const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function getDataMSSQL () {
  try {
    const {
      MSSQL_DATABASE,
      MSSQL_SERVER,
      MSSQL_PASSWORD,
      MSSQL_USER
    } = process.env

    const config = {
      user: MSSQL_USER,
      password: MSSQL_PASSWORD,
      server: MSSQL_SERVER,
      database: MSSQL_DATABASE
    }
    await sql.connect(config)

    const result = await sql.query`select * from test`
    sql.close()

    return result
  } catch (err) {
    console.log('DEBUG: getDataMSSQL -> err', err)
  }
}

ipcMain.handle('getDataMSSQL', getDataMSSQL)

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true // process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
  // getDataMSSQL()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
