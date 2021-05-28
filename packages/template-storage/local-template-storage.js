const TemplateStorage = require('./template-storage')
const os = require('os')
const path = require('path')
const FileSystemUtils = require('fs-util')

const defaultConfig = {
  localStorageTemplatesPath: path.join(os.homedir(), '.scafflater', 'templates'),
  templateConfigFileName: 'scf.json',
}

/**
* Stores templates in the local file system
* @extends TemplateStorage
*/
class LocalTemplateStorage extends TemplateStorage {
  constructor(config = {}) {
    super(config)
    this.config = {...defaultConfig, ...config}
  }

  /**
  * Stores the template in the local file system.
  * @param {string} templatePath - Path of template
  */
  async storeTemplate(templatePath) {
    const templateConfig = FileSystemUtils.getJson(path.join(templatePath, this.config.templateConfigFileName))
    FileSystemUtils.copy(templatePath, this.getTemplateFolder(templateConfig))
  }

  /**
  *  Returns the template local path
  * @param {string} templateConfig The template configuration
  * @returns {string} The path where template was copied
  */
  getTemplateFolder(templateConfig) {
    return path.join(this.config.localStorageTemplatesPath, templateConfig.name, templateConfig.version)
  }

  /**
  * Gets a template.
  * @param {string} templateName - Template name
  * @param {string} templateVersion - Template Version. If null, the latest stored version is returned.
  * @param {string} path - Path to output the template If null, will store the template in a temp folder.
  * @returns {string} The stored template path
  */
  async getTemplateToPath(templateName, templateVersion = null, path = null) {
    path = path ? path : FileSystemUtils.getTempFolder()

    return this
    .getTemplateStorage()
    .getTemplateToPath(templateName, templateVersion, path)
  }

  /**
  * List stored templates and their versions.
  */
  async listStoredTemplates() {
    const dirTree = FileSystemUtils.getDirTree(this.config.localStorageTemplatesPath, false)

    return dirTree.children.map(folder => {
      return {
        name: folder.name,
        versions: folder.children.map(v => {
          return {version: v.name}
        }),
      }
    })
  }
}

module.exports = LocalTemplateStorage
