const openAboutWindow = require('about-window').default
const path = require('path')

const create = () =>
  openAboutWindow({
    icon_path: path.join(__dirname, './images/icon.png'),
    package_json_dir: path.resolve(__dirname, '../../'),
    copyright: 'Copyright (c) 2020 jaychou',
    homepage: 'https://github.com/AwJayChou/electron-remote-control',
  })

module.exports = { create }
