const {runCommand} = require('./utils')
// eslint-disable-next-line node/no-extraneous-require
const fs = require('fs-extra')
const os = require('os')

/**
* Class to manage Github Repos
*/
class GitUtil {
  /**
  * Clones a repo to a local path.
  * @param {string} repoUrl - Repository url
  * @param {string} localPath - Local path where the repos will be cloned
  */
  static async clone(repoUrl, localPath) {
    await runCommand('git',
      [
        'clone',
        repoUrl,
        localPath,
      ]
    )
  }

  /**
  * Clones a repo to a temp path.
  * @param {string} repoUrl - Repository url
  * @returns {string} The path where repo was cloned
  */
  static async cloneToTempPath(repoUrl) {
    const tempDir = fs.mkdtempSync(os.tmpdir())

    await runCommand('git',
      [
        'clone',
        repoUrl,
        tempDir,
      ]
    )

    return tempDir
  }
}

module.exports = GitUtil
