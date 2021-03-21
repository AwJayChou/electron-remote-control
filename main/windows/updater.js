const { autoUpdater, app, dialog } = require('electron');
const baseUrl = 'http://127.0.0.1:33855';
if(process.platform === 'darwin') {
    autoUpdater.setFeedURL(baseUrl + '/darwin?version=' + app.getVersion())
} else {
    autoUpdater.setFeedURL(baseUrl + '/win32?version=' + app.getVersion())
}
autoUpdater.checkForUpdates() // 定时轮询、服务端推送

autoUpdater.on('update-available', () => {
    console.log('update-available')
})

autoUpdater.on('update-downloaded', (e, notes, version) => {
    app.whenReady().then(() =>{
        let clickId = dialog.showMessageBoxSync({
            type: 'info',
            title: '升级提示',
            message: '已为您升级到最新版，是否立即体验',
            buttons: ['马上升级', '手动重启'],
            cancelId: 1,
        })
        if(clickId === 0) {
            autoUpdater.quitAndInstall()
            app.quit()
        }
    })
})

autoUpdater.on('error', (e) => {
    console.log('error', e)
})