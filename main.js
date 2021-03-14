// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')

let win
function createWindow () {
  win = new BrowserWindow({
    width: 300,
    height: 300,
    webPreferences: {
      // 允许开启node 通信
      nodeIntegration: true
    }
  })
  win.loadFile('index.html')
}

app.on('ready', () => {
  createWindow()
})

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
// 有个active事件
// app.on('act')
