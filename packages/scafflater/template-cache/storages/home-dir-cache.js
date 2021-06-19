const os = require('os')
const path = require('path')
const DirCache = require('./dir-cache')

/**
* Stores templates in the local file system
* @extends DirCache
*/
class HomeDirCache extends DirCache {
  constructor(config = {}) {
    super(path.join(os.homedir(), '.scafflater', 'templates'), config)
  }
}

module.exports = HomeDirCache
