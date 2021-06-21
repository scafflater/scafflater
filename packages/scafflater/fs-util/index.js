const fs = require('fs-extra')
const os = require('os')
const dirTree = require('directory-tree')
const glob = require('glob')
const path = require('path')
const {EOL} = require('os')

/**
  * Returns a temp folder path
  * @returns {string} A temp folder path
  */
fs.getTempFolderSync = () => {
  return fs.mkdtempSync(os.tmpdir())
}

/**
* Copies folder and files, creating the dest folder if it does not exists.
* @param {string} src - Source
* @param {string} dest - Destiny
*/
fs.copyEnsuringDestSync = (src, dest) => {
  fs.ensureDirSync(dest)
  fs.copySync(src, dest)
}

/**
* Gets file
* @param {string} path - Source
* @returns {object} The read file
*/
fs.readFileContentSync = () => {
  return fs.readFileSync(path).toString()
}

/**
* Saves the file, ensuring that destiny folder exists and formatting text if it is an append operation.
* @param {string} filePath - Source
* @param {string} data - Data to be saved
* @param {boolean} append - Appends data in file. The file is created if does not exists. Default = true
*/
fs.saveFileSync = (filePath, data, append = true) => {
  const option = {flag: 'w'}
  if (fs.existsSync(filePath) && append) {
    data = EOL + EOL + data
    option.flag = 'a'
  }
  fs.ensureDirSync(path.dirname(filePath))
  fs.writeFileSync(filePath, data, option)
}

/**
* Returns the directory tree
* @param {string} path - The path to build the tree
* @param {boolean} includeFiles - If true, the files will be included in the list
* @return {object} The tree
*/
fs.getDirTreeSync = (path, includeFiles = true) => {
  const options = {}
  if (!includeFiles) {
    // Regex thar does not match with nothing
    options.extensions = /ˆ.*/
  }
  return dirTree(path, options)
}

/**
* List files in directory tree
* @param {string} folderPath - Path to look for files
* @param {string} filePattern - Glob pattern to filter files
* @return {ReturnValueDataTypeHere} Brief description of the returning value here.
*/
fs.listFilesDeeply = (folderPath, filePattern) => {
  return new Promise((resolve, reject) => {
    glob(filePattern, {root: folderPath}, (err, files) => {
      if (err)
        reject(err)
      if (!files || files.length <= 0)
        resolve(null)
      resolve(files)
    })
  })
}

/**
* List files in directory tree by extension
* @param {string} folderPath - Path to look for files
* @param {string} extension - Glob pattern to filter files
* @return {ReturnValueDataTypeHere} Brief description of the returning value here.
*/
fs.listFilesByExtensionDeeply = (folderPath, extension) => {
  return fs.listFilesDeeply(folderPath, `/**/*.${extension}`)
}

/**
* List files in directory tree by name
* @param {string} folderPath - Path to look for files
* @param {string} fileName - Glob pattern to filter files
* @return {ReturnValueDataTypeHere} Brief description of the returning value here.
*/
fs.listFilesByNameDeeply = (folderPath, fileName) => {
  return fs.listFilesDeeply(folderPath, `/**/${fileName}`)
}

module.exports = fs
