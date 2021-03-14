const { ipcRenderer } = require('electron')
const { getScreenStream } = require('./video-stream')
// const {addIceCandidate} = require('./video-stream');
const pc = new window.RTCPeerConnection()
pc.ondatachannel = function (e) {
  e.channel.onmessage = (e) => {
    console.log('onmessage', e, JSON.parse(e.data))
    let { type, data } = JSON.parse(e.data)
    console.log('robot', type, data)
    if (type === 'mouse') {
      data.screen = {
        width: window.screen.width,
        height: window.screen.height,
      }
    }
    // robotjs 存在问题
    // ipcRenderer.send('robot', type, data)
  }
}
let candidates = []
async function addIceCandidate(candidate) {
  console.log('candidate => ', candidate)
  if (!candidate) return
  candidates.push(candidate)
  console.log('list => ', candidates)
  if (pc.remoteDescription && pc.remoteDescription.type) {
    for (let i = 0; i < candidates.length; i++) {
      await pc.addIceCandidate(new RTCIceCandidate(candidates[i]))
    }
    candidates = []
  }
}
ipcRenderer.on('postOffer', (e, offer) => {
  //   console.log('e => ', e, offer)
  // console.log('接收到offer => ')
  // ipc通信answer端

  createAnswer(offer).then((answer) => {
    // console.log('create-answer\n', JSON.stringify(pc.localDescription))
    ipcRenderer.send('answer', { type: answer.type, sdp: answer.sdp })
  })
  async function createAnswer(offer) {
    let stream = await getScreenStream()
    pc.addStream(stream)
    await pc.setRemoteDescription(offer)
    await pc.setLocalDescription(await pc.createAnswer())
    // console.log('create answer \n', JSON.stringify(pc.localDescription))
    // send answer
    return pc.localDescription
  }
})
pc.onicecandidate = (e) => {
  // console.log('candidate', JSON.stringify(e.candidate))
  if (e.candidate) {
    ipcRenderer.send('postCandidate', JSON.stringify(e.candidate))
  }
  // 告知其他人
}
ipcRenderer.on('postWin2Candidate', (e, data) => {
  addIceCandidate(JSON.parse(data))
})
window.addIceCandidate = addIceCandidate
