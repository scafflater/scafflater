const ConfigProvider = require("../config-provider")

/**
* TemplateStorage factory.
*/
class TemplateCache {
  /**
  * Template Source constructor.
  * @param {?object} config - Scafflater configuration. If null, will get the default configuration.
  */
  constructor(config = {}) {
    this.config = {...new ConfigProvider(), ...config}
  }

  /**
  * Returns the template source instance to be used to get templates.
  * @param {?object} config - Scafflater configuration. If null, will get the default configuration.
  * @param {?string} cacheStorage - Storage to be used. If null, will use local as default.
  * @return {TemplateCache} An specialized instance of TemplateStorage.
  */
  getTemplateCache(config = {}, cacheStorage = null) {
    const c = {...new ConfigProvider(), ...config}
    const s = cacheStorage ? cacheStorage : c.cacheStorage

    if (!c.cacheStorages[s]) {
      throw new Error(`There's no module for source '${s}'`)
    }

    const ts = new (require(c.cacheStorages[s]))(config)
    return ts
  }

  /**
  * Stores the template.
  * @param {string} path - Path of template
  * @returns {string} The cache key
  */
  async storeTemplate(path) {
    return this
    .getTemplateCache()
    .storeTemplate(path)
  }

  /**
  * Gets the template path.
  * @param {string} templateName - Template name
  * @param {string} templateVersion - Template Version. If null, the latest stored version is returned.
  * @returns {string} The template path
  */
  async getTemplatePath(templateName, templateVersion = null) {
    return this
    .getTemplateCache()
    .getTemplatePath(templateName, templateVersion)
  }

  /**
  * Gets the cached template config.
  * @param {string} cacheKey - The cache key
  * @returns {object} The template config
  */
  async getTemplateConfig(cacheKey) {
    return this
    .getTemplateCache()
    .getTemplateConfig(cacheKey)
  }

  /**
  * List stored templates and their versions.
  * @param {string} templateName - Template name
  * @param {string} templateVersion - Template Version. If null, the latest stored version is returned.
  * @param {string} path - Path to output the template If null, will store the template in a temp folder.
  */
  async listCachedTemplates() {
    return this
    .getTemplateCache()
    .listCachedTemplates()
  }
}

module.exports = TemplateCache
