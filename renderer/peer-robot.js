const EventEmitter = require('events')
const peer = new EventEmitter()
window.onkeydown = function(e) {
    // data {keyCode, meta, alt, ctrl, shift}
    let data = {
        keyCode: e.keyCode,
        shift: e.shiftKey,
        meta: e.metaKey,
        control: e.ctrlKey,
        alt: e.altKey
    }
    peer.emit('robot', 'key', data) 
}

window.onmouseup = function(e) {
    let video = document.getElementById('screen-video')
    // data {clientX, clientY, screen: {width, height}, video: {width, height}}
    let data = {}
    data.clientX = e.clientX
    data.clientY = e.clientY
    data.video = {
        width: video && video.getBoundingClientRect().width,
        height: video && video.getBoundingClientRect().height
    }
    peer.emit('robot', 'mouse', data)
}

module.exports = peer