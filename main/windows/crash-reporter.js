const {crashReporter, app} = require('electron')

function init() {
    crashReporter.start({
        productName: 'RemoteControl',
        companyName: 'jaychou',
        submitURL: 'http://127.0.0.1:33855/crash',
        autoSubmit: true,
        uploadToServer: true
    })
    // setTimeout(() => {
    //     process.crash()
    // }, 2000)
    
}
module.exports = {init}
