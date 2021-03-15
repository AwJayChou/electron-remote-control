const { BrowserWindow, app, ipcMain } = require('electron')

const path = require('path')
let renderWin, win2
let willQuitApp = false
// window的一些方法 window.close() window.show() window.close()
function createRender() {
  renderWin = new BrowserWindow({
    width: 600,
    height: 480,
    webPreferences: {
      nodeIntegration: true,
      preload: path.resolve(__dirname, '../../renderer/peer-control.js'),
    },
  })
  const url = path.resolve(__dirname, '../../renderPage/index.html')
  renderWin.webContents.openDevTools()
  // loadFile 需要用绝对路径
  renderWin.loadFile(url)

  renderWin.on('close', (e) => {
    // 每个窗口关闭事件
    if (willQuitApp) {
      renderWin = null
    } else {
      e.preventDefault()
      renderWin.hide()
    }
  })
}

function createMain() {
  win2 = new BrowserWindow({
    width: 600,
    height: 480,
    webPreferences: {
      nodeIntegration: true,
      preload: path.resolve(__dirname, '../../renderer/main-control.js'),
    },
  })
  const url = path.resolve(__dirname, '../../renderPage/main.html')
  win2.loadFile(url)
  win2.webContents.openDevTools()

  win2.on('close', (e) => {
    // 每个窗口关闭事件
    if (willQuitApp) {
      win2 = null
    } else {
      e.preventDefault()
      win2.hide()
    }
  })
}
function beforeAppClose() {
  willQuitApp = true
  win2.close()
  renderWin.close()
}
function showWindows() {
  renderWin.show()
  win2.show()
}
exports.showWindows = showWindows
// createMain()
function send(ctx, channel, ...args) {
  ctx && ctx.webContents.send(channel, ...args)
}
// 单利启动 获取锁 第一次可以拿到为true 第二次为false
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    showWindows()
  })
  app.on('ready', () => {
    createRender()
    createMain()
    require('./app-menu/index')
    // require('./main-robot')()
  })
  app.on('before-quit', () => {
    beforeAppClose()
  })
  app.on('activate', () => {
      showWindows()
  })
}
// 多实例启动
// app.on('ready', () => {
//     createRender()
//     createMain()
//     // require('./main-robot')()
// })

ipcMain.on('offer', (e, data) => {
  // console.log('ipcMain => ', e,data)
  send(win2, 'postOffer', data)
})

ipcMain.on('answer', (e, data) => {
  // console.log('ipcMain => ', e,data)
  send(renderWin, 'postAnswer', data)
})

ipcMain.on('candidate', (e, data) => {
  send(win2, 'postWin2Candidate', data)
})

ipcMain.on('postCandidate', (e, data) => {
  send(renderWin, 'getMainCandidate', data)
})

// module.exports = { createMain, send }
