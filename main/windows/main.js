const { BrowserWindow, app, ipcMain } = require('electron')

const path = require('path')
let renderWin, win2
function createRender() {
    renderWin = new BrowserWindow({
        width: 600,
        height: 480,
        webPreferences: {
            nodeIntegration: true,
            preload: path.resolve(__dirname, '../../renderer/peer-control.js')
        }
    })
    const url = path.resolve(__dirname, '../../renderPage/index.html')
    renderWin.webContents.openDevTools();
    // loadFile 需要用绝对路径
    renderWin.loadFile(url)
}

function createMain() {
    win2 = new BrowserWindow({
        width: 600,
        height: 480,
        webPreferences: {
            nodeIntegration: true,
            preload: path.resolve(__dirname, '../../renderer/main-control.js')
        }
    })
    const url = path.resolve(__dirname, '../../renderPage/main.html')
    win2.loadFile(url)
    win2.webContents.openDevTools();
}

// createMain()
function send(ctx, channel, ...args) {
    ctx && ctx.webContents.send(channel, ...args)
}

app.on('ready', () => {
    createRender()
    createMain()
    // require('./main-robot')()
})

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
