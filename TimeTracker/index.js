const path = require('path')
const url = require('url')
const electron = require('electron')
require('electron-reload')(__dirname, {
  ignored: /node_modules|[\/\\]\./,
  argv: []
})

const {
  app,
  BrowserWindow,
  Menu,
  ipcMain
} = electron

let startWindow
let trackingWindow

function createWindow() {

  const {
    width,
    height
  } = electron.screen.getPrimaryDisplay().workAreaSize;

  startWindow = new BrowserWindow({
    width: 400,
    height: 200,
    center: true,
    transparent: true,
    // backgroundColor: '#444444',
    backgroundColor: '#CC000000',
    webPreferences: {
      nodeIntegration: true
    },
  })
  startWindow.setMenuBarVisibility(false)
  startWindow.loadFile('index.html')
  // startWindow.webContents.openDevTools()
}



app.whenReady().then(createWindow)

ipcMain.on('startTimeTracking', (e, fileName) => {
  if (trackingWindow) {
    trackingWindow.focus()
    return
  }

  const {
    width,
    height
  } = electron.screen.getPrimaryDisplay().workAreaSize;

  trackingWindow = new BrowserWindow({
    width: 350,
    height: 175,
    // fullscreen: true,
    center: true,
    transparent: true,
    x: width - 350,
    y: 0,
    // y: height - 150,
    // backgroundColor: '#444444',
    backgroundColor: '#CC000000',
    webPreferences: {
      nodeIntegration: true
    },
  })

  trackingWindow.loadFile(fileName)
  trackingWindow.setMenuBarVisibility(false)
  // trackingWindow.webContents.openDevTools()

  startWindow.close()
})

ipcMain.on('closeTracking', (e) => {
  app.quit();
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})