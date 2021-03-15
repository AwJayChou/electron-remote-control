const { app, Menu, Tray } = require('electron')
const { showWindows } = require('../main')
const {create: createAboutWindow} = require('../about')
const path = require('path')

let tray
// 托盘直接实例化
// 托盘点击后直接消失？？
function setTray() {
  tray = new Tray(path.resolve(__dirname, './images/icon_darwin.png'))
  // 点击打开窗口
  tray.on('click', () => {
    showWindows()
  })
  // 右键推出窗口
  tray.on('right-click', () => {
    const contextMenu = Menu.buildFromTemplate([
      { label: 'show', click: showWindows },
      { label: 'quit', click: app.quit },
    ])
    tray.popUpContextMenu(contextMenu)
  })
}
// todos 查找官方menus文档
function setAppMenu() {
  let appMenu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          label: 'About',
          click: createAboutWindow,
        },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
    { role: 'fileMenu' },
    { role: 'windowMenu' },
    { role: 'editMenu' },
  ])
  app.applicationMenu = appMenu
}

app.whenReady().then(() => {
  setTray()
  setAppMenu()
})
