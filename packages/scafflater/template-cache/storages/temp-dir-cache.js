const path = require('path')
const FileSystemUtils = require('../../fs-util')
const DirCache = require('./dir-cache')

/**
* Stores templates in the local file system
* @extends DirCache
*/
class TempDirCache extends DirCache {
  constructor(config = {}) {
    super(FileSystemUtils.getTempFolder(), config)
  }
}

module.exports = TempDirCache
