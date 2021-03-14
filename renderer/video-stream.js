const { desktopCapturer } = require('electron')
/**
 * 直接获取屏幕的方法
 * @returns
 */
async function getScreenStream() {
  const sources = await desktopCapturer.getSources({ types: ['screen'] })
  return new Promise((resolve, reject) => {
    navigator.webkitGetUserMedia(
      {
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: sources[0].id,
            maxWidth: window.screen.width,
            maxHeight: window.screen.height,
          },
        },
      },
      (stream) => {
        // console.log('add-stream', stream)
        resolve(stream)
        // main会自动播放
        // play(stream)
      },
      reject
    )
  })
}

// getScreenStream()

function play(stream) {
  let video = document.getElementById('screen-video')
  if (video) {
    video.srcObject = stream
    video.onloadedmetadata = function () {
      video.play()
    }
  }
}

const candidates = []
async function addIceCandidate(pc, candidate) {
  if (!candidate || !candidate.type) return
  candidates.push(candidate)
  if (pc.remoteDescription && pc.remoteDescription.type) {
    for (let i = 0; i < candidates.length; i++) {
      await pc.addIceCandidate(new RTCIceCandidate(candidates[i]))
    }
    candidates = []
  }
}

module.exports = {
  getScreenStream,
  play,
  addIceCandidate
}
