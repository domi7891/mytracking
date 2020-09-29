const electron = require('electron')
const path = require('path')
require('electron-reload')(__dirname, {
  ignored: /node_modules|[\/\\]\./,
  argv: []
})

const env = process.env.NODE_ENV || 'development';


const {
  app,
  BrowserWindow,
  Menu,
  ipcMain
} = electron

function createWindow() {

  const {
    width,
    height
  } = electron.screen.getPrimaryDisplay().workAreaSize;

  let window = new BrowserWindow({
    width: 980,
    height: 500,
    center: true,
    transparent: false,
    // backgroundColor: '#444444',
    backgroundColor: '#FFF',
    webPreferences: {
      nodeIntegration: true
    },
  })
  window.setMenuBarVisibility(false)
  window.loadFile('index.html')
  window.webContents.openDevTools()
}


app.whenReady().then(createWindow)