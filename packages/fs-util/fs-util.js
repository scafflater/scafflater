const fs = require('fs-extra')
const os = require('os')
const dirTree = require('directory-tree')

class FileSystemUtils {
  /**
  * Returns a temp folder path
  * @returns {string} A temp folder path
  */
  static getTempFolder() {
    return fs.mkdtempSync(os.tmpdir())
  }

  /**
  * Checks if a path exists
  * @param {string} path - Path to be tested
  * @returns {boolean} True if the path exists
  */
  static pathExists(path) {
    return fs.pathExistsSync(path)
  }

  /**
  * Copies folder and files.
  * @param {string} src - Source
  * @param {string} dest - Destin
  */
  static copy(src, dest) {
    fs.ensureDirSync(dest)
    fs.copySync(src, dest)
  }

  /**
  * Gets json file
  * @param {string} path - Source
  * @returns {object} The read json
  */
  static getJson(path) {
    return fs.readJsonSync(path)
  }

  /**
  * Saves json file
  * @param {string} path - Source
  * @param {object} object - The object to be saved
  */
  static saveJson(path, object) {
    fs.writeJsonSync(path, object)
  }

  /**
  * Returns the directory tree
  * @param {string} path - The path to build the tree
  * @param {boolean} includeFiles - If true, the files will be included in the list
  * @return {object} The tree
  */
  static getDirTree(path, includeFiles = true) {
    const options = {}
    if (!includeFiles) {
      // Regex thar does not match with nothing
      options.extensions = /ˆ.*/
    }
    return dirTree(path, options)
  }
}

module.exports = FileSystemUtils
