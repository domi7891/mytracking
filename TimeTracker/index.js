const path = require('path')
const url = require('url')
const electron = require('electron')
require('electron-reload')(__dirname, {
  ignored: /node_modules|[\/\\]\./,
  argv: []
})
let iconpath = path.join(__dirname, 'images/tray.png')

const {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
  Tray,
  remote
} = electron

let startWindow
let trackingWindow
let appIcon

let first = true;

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
    icon: iconpath,
  })
  startWindow.setMenuBarVisibility(false)
  startWindow.loadFile('index.html')
  // startWindow.webContents.openDevTools()
}

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
    icon: iconpath,
    alwaysOnTop: true,
  })

  trackingWindow.loadFile(fileName)

  trackingWindow.setMenuBarVisibility(false)
  // trackingWindow.webContents.openDevTools()
  appIcon = new Tray(iconpath)

  var contextMenu = Menu.buildFromTemplate([{
      label: 'Show App',
      click: function () {
        trackingWindow.show()
      }
    },
    {
      label: 'Quit',
      click: function () {
        app.isQuiting = true
        app.quit()
      }
    }
  ])

  appIcon.setContextMenu(contextMenu)


  trackingWindow.on('close', function (event) {
    trackingWindow = null
  })

  trackingWindow.on('minimize', function (event) {
    event.preventDefault()
    trackingWindow.hide()
  })

  startWindow.close()

  trackingWindow.on('focus', function (event) {
    event.preventDefault()
    if (!first)
      fadeWindowIn(trackingWindow, 0.05, 50)
  })

  trackingWindow.on('blur', function (event) {
    event.preventDefault()
    fadeOutInterval = fadeWindowOut(trackingWindow, 0.05, 50)
  })

  setTimeout((e) => {
    first = false;
    trackingWindow.blur()
  }, 2000)
})

ipcMain.on('closeTracking', (e) => {
  appIcon.destroy()
  app.quit();
})


ipcMain.on('hideTracking', (e) => {
  trackingWindow.hide()
})

ipcMain.on('showTracking', (e) => {
  trackingWindow.show()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    appIcon.destroy()
    app.quit()
  }
})


app.whenReady().then(createWindow)



const fadeWindowOut = (
  win, step, seconds
) => {
  let opacity = win.getOpacity();
  const interval = setInterval(() => {
    if (opacity <= 0.4) clearInterval(interval);
    win.setOpacity(opacity);
    opacity -= step;
  }, seconds);
  return interval;
}

const fadeWindowIn = (
  win, step, seconds
) => {
  let opacity = win.getOpacity();
  const interval = setInterval(() => {
    if (opacity >= 1) clearInterval(interval);
    win.setOpacity(opacity);
    opacity += step;
  }, seconds);
  return interval;
}