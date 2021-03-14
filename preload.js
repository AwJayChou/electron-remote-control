// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// window.addEventListener('DOMContentLoaded', () => {
//   const replaceText = (selector, text) => {
//     const element = document.getElementById(selector)
//     if (element) element.innerText = text
//   }

//   for (const type of ['chrome', 'node', 'electron']) {
//     replaceText(`${type}-version`, process.versions[type])
//   }
// })

const {
  ipcRenderer,
  remote
} = require('electron')
const Timer = require('timer.js')

//  开启 render
// function sendTo() {
//   console.log(' remote=>', remote)
//   console.log(' global=>', global, global.sharedObject)
//   const obj = remote.getGlobal('sharedObject')
//   ipcRenderer.sendTo(obj.win2Id, 'com', 1)
// }
// sendTo()
// setTimeout(() => {
//   sendTo()
// }, 1000)
//
function startWork() {
  let workTimer = new Timer({
    ontick: (ms) => {
      updateTime(ms)
    },
    onend: () => {
      notification()
    }
  })
  workTimer.start(2)
}

function updateTime(ms) {
  let timerContainer = document.getElementById('timer-container')
  timerContainer.innerHTML = ms
}

async function notification() {
  let res = await ipcRenderer.invoke('work-notification')
  console.log('notification => ', res)
  if (res === 'rest') {
    setTimeout(() => {
      alert('rest')
    }, 2000)
  } else if (res === 'work') {
    startWork()
  }
}
ipcRenderer.on('do-some-work', () => {
  console.log('render do some work')
})

// 开启番茄时钟
// startWork()