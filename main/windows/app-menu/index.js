const platform = process.platform

const platFormMap = {
    'darwin': require('./darwin'),
    'win32': require('./win32')
}
platFormMap[platform]