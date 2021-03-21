const { app, Menu, Tray  } = require('electron')
const path = require('path')
const { showWindows } = require('../main')
const {create: createAboutWindow} = require('../about')

let tray;
app.whenReady().then(() => {
    tray = new Tray(path.resolve(__dirname, './images/icon_win32.png'))
    const contextMenu = Menu.buildFromTemplate([
        { label: '打开' + app.name, click: showWindows},
        { label: '关于' + app.name, click: createAboutWindow},
        { type: 'separator' },
        { label: '退出', click: () => {app.quit()}}
    ])
    tray.setContextMenu(contextMenu)
    // window下面 默认不使用状态栏
    menu = Menu.buildFromTemplate([])
    app.applicationMenu = menu;
})
