const { ipcRenderer, desktopCapturer } = require('electron')
const peer = require('./peer-robot')
const pc = new window.RTCPeerConnection({})
const dc = pc.createDataChannel('robotchannel', { reliable: false})
const { play } = require('./video-stream')
/**
 * data.createDataChannel
 */
dc.onopen = function () {
    peer.on('robot', (type, data) => {
        dc.send(JSON.stringify({ type, data}))
    })
}
dc.onmessage = function (event) {
    console.log('event => ', event)
}
dc.onerror = function (e) {
    console.log('error => ',e)
}
// let dc =
let candidates = []
async function addIceCandidate(candidate) {
  if (!candidate) return
  candidates.push(candidate)
  console.log('aaa => ', candidates)
  // 确保已经建立p2p连接
  if (pc.remoteDescription && pc.remoteDescription.type) {
    for (let i = 0; i < candidates.length; i++) {
      await pc.addIceCandidate(new RTCIceCandidate(candidates[i]))
    }
    candidates = []
  }
}
async function createOffer() {
  // 1.createOffer
  let offer = await pc.createOffer({
    offerToReceiveAudio: false,
    offerToReceiveVideo: true,
  })
  // 2.设置本地offer
  await pc.setLocalDescription(offer)
//   console.log('create-offer\n', JSON.stringify(pc.localDescription))
  return pc.localDescription
}

createOffer().then(offer => {
    ipcRenderer.send('offer', { type: offer.type, sdp: offer.sdp})
})

/**
 * 发出去的offer的回调函数
 */
ipcRenderer.on('postAnswer', (e, answer) => {
    setRemote(answer)
})

/**
 * 接受传递回来的 candidate
 */
ipcRenderer.on('getMainCandidate', (e, data) => {
    addIceCandidate(JSON.parse(data))
})

async function setRemote(answer) {
    await pc.setRemoteDescription(answer)
    // console.log('get-answer', pc)
}

pc.onicecandidate = (e) => {
	// console.log('candidate', JSON.stringify(e.candidate))
    if(e.candidate) {
        ipcRenderer.send('candidate', JSON.stringify(e.candidate))
    }
	// 告知其他人
}

window.addIceCandidate = addIceCandidate

pc.onaddstream = (e) => {
	console.log('on add stream.......', e.stream)
	// peer.emit('add-stream', e.stream)
    play(e.stream)
}

window.setRemote = setRemote
