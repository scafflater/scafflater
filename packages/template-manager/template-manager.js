const path = require('path')
/**
* Template Manager factory.
*/
class TemplateManager {
  /**
  * Template Manager constructor.
  * @param {TemplateSource} templateSource - The template source
  * @param {TemplateCache} templateCache - The template cache
  */
  constructor(templateSource, templateCache) {
    this.templateSource = templateSource
    this.templateCache = templateCache
  }

  /**
  * Gets teh template from source and stores in the cache
  * @param {string} sourceKey - Teh source key
  * @return {object} An object containing template config
  */
  async getTemplateFromSource(sourceKey) {
    const tempTemplateFolder =  await this.templateSource.getTemplateFrom(sourceKey)
    const cacheKey = await this.templateCache.storeTemplate(tempTemplateFolder)
    return this.templateCache.getTemplateConfig(cacheKey)
  }

  /**
  * Gets the template path, if it is stored in the cache.
  * @param {string} templateName - Template name
  * @param {string} templateVersion - Template Version. If null, the latest stored version is returned.
  * @returns {string} The cached template path
  */
  async getTemplatePath(templateName, templateVersion = null) {
    return this.templateCache.getTemplatePath(templateName, templateVersion)
  }
}

module.exports = TemplateManager
