const TemplateCache = require('..')
const path = require('path')
const fsUtil = require('../../fs-util')
const sort = require('version-sort')
const ConfigProvider = require('../../config-provider')

/**
* Stores templates in the local file system
* @extends TemplateCache
*/
class DirCache extends TemplateCache {
  constructor(storagePath, config = {}) {
    config = {...new ConfigProvider(), ...config}
    super(config)
    this.storagePath = storagePath
    this.config = config
  }

  /**
  * Stores the template in the local file system.
  * @param {string} templatePath - Path of template
  */
  storeTemplate(templatePath) {
    const templateConfig = fsUtil.readJSONSync(path.join(templatePath, this.config.scfFileName))
    const cachePath = path.join(this.storagePath, templateConfig.name, templateConfig.version)
    fsUtil.copyEnsuringDestSync(templatePath, cachePath)
    return cachePath
  }

  /**
  *  Returns the template local path
  * @param {string} templateName - Template name
  * @param {string} templateVersion - Template Version. If null, the latest stored version is returned.
  * @returns {string} The path where template was copied. Returns null if the template is not in cache.
  */
  getTemplateFolder(templateName, templateVersion = null) {
    const templateFolder = path.join(this.storagePath, templateName)

    if (!fsUtil.pathExists(templateFolder)) {
      return null
    }

    if (!templateVersion) {
      let versions =  fsUtil.getDirTreeSync(templateFolder, false)

      // The template folder does not exist or there no versions on it
      if (!versions || versions.children.length <= 0)
        return null

      versions = sort(versions.children.map(d => d.name))
      templateVersion = versions[versions.length - 1]
    }

    const templateVersionFolder =  path.join(templateFolder, templateVersion)

    if (!fsUtil.pathExists(templateVersionFolder)) {
      return null
    }

    return templateVersionFolder
  }

  /**
  * Gets the template path.
  * @param {string} templateName - Template name
  * @param {string} templateVersion - Template Version. If null, the latest stored version is returned.
  * @returns {string} The stored template path
  */
  async getTemplatePath(templateName, templateVersion = null) {
    return this.getTemplateFolder(templateName, templateVersion)
  }

  /**
  * Gets the cached template config.
  * @param {string} cacheKey - The cache key
  * @returns {object} The template config
  */
  getTemplateConfig(cacheKey) {
    return fsUtil.readJSONSync(path.join(cacheKey, this.config.scfFileName))
  }

  /**
  * List stored templates and their versions.
  */
  listCachedTemplates() {
    const dirTree = fsUtil.getDirTreeSync(this.storagePath, false)

    if (!dirTree)
      return null

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

module.exports = DirCache
